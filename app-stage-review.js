"use strict";

// 阶段复盘模块：聚合主线阶段内的完成记录、实验记录、错题、笔记和下一步动作。

let activeStageReviewId = null;

function getStageReviewStage() {
  const current = typeof getCurrentStage === "function" ? getCurrentStage() : stages[0];
  const fallbackId = current?.id ?? 0;
  const requestedId = Number.isInteger(Number(activeStageReviewId)) ? Number(activeStageReviewId) : fallbackId;
  return stages.find((stage) => stage.id === requestedId) || stages.find((stage) => stage.id === fallbackId) || stages[0];
}

function setStageReviewId(value) {
  const requestedId = Number(value);
  if (Number.isInteger(requestedId) && stages.some((stage) => stage.id === requestedId)) {
    activeStageReviewId = requestedId;
  }
  renderStageReview();
}

const stageAbilityLevels = [
  { id: "basic", label: "基础练习", match: "基础" },
  { id: "advanced", label: "进阶练习", match: "进阶" },
  { id: "project", label: "项目化练习", match: "项目" }
];

function getStageAbilityTrend(stage = getStageReviewStage()) {
  const lessons = getAllLessons().filter((lesson) => lesson.stageId === stage.id);
  const practices = lessons.flatMap((lesson) => getLessonPractices(lesson).map((practice) => ({ lesson, practice })));
  const currentRecords = new Map(Object.entries(state.practiceRecords || {}));
  const levels = stageAbilityLevels.map((level) => {
    const items = practices.filter((item) => item.practice.level.includes(level.match));
    const records = items.map((item) => currentRecords.get(item.practice.id)).filter(Boolean);
    const passed = records.filter((record) => normalizePracticeAssessment(record.assessment)?.result === "passed" || record.status === "done").length;
    const average = records.length ? Math.round(records.reduce((sum, record) => sum + getPracticeRecordScore(record), 0) / records.length) : 0;
    return { ...level, total: items.length, recorded: records.length, passed, average };
  });
  const attempts = (Array.isArray(state.practiceAttempts) ? state.practiceAttempts : [])
    .map((attempt) => {
      const context = getPracticeById(attempt.practiceId);
      if (!context || context.lesson.stageId !== stage.id) return null;
      return { ...attempt, lesson: context.lesson, practice: context.practice, score: getPracticeRecordScore(attempt) };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.checkedAt) - new Date(b.checkedAt));
  const fallbackPoints = practices.map(({ lesson, practice }) => {
    const record = currentRecords.get(practice.id);
    const checkedAt = record?.checkedAt || normalizePracticeAssessment(record?.assessment)?.checkedAt || "";
    return record && checkedAt && !Number.isNaN(Date.parse(checkedAt)) ? { practiceId: practice.id, lesson, practice, status: record.status, assessment: record.assessment, checkedAt, score: getPracticeRecordScore(record) } : null;
  }).filter(Boolean).sort((a, b) => new Date(a.checkedAt || 0) - new Date(b.checkedAt || 0));
  const points = (attempts.length ? attempts : fallbackPoints).slice(-8);
  const average = points.length ? Math.round(points.reduce((sum, point) => sum + point.score, 0) / points.length) : 0;
  const split = Math.ceil(points.length / 2);
  const first = points.slice(0, split);
  const last = points.slice(split);
  const firstAverage = first.length ? first.reduce((sum, point) => sum + point.score, 0) / first.length : average;
  const lastAverage = last.length ? last.reduce((sum, point) => sum + point.score, 0) / last.length : average;
  const delta = points.length >= 2 ? Math.round(lastAverage - firstAverage) : 0;
  const direction = delta >= 5 ? "上升" : delta <= -5 ? "回落" : points.length ? "稳定" : "暂无";
  const runnerCount = points.filter((point) => normalizePracticeAssessment(point.assessment)?.source === "runner").length;
  return { levels, points, average, delta, direction, runnerCount };
}

function renderStageAbilityTrend(trend) {
  const deltaLabel = trend.points.length < 2 ? "等待更多记录" : `${trend.direction} ${trend.delta > 0 ? "+" : ""}${trend.delta} 分`;
  return `<article class="stage-review-card stage-ability-card">
    <div class="stage-ability-heading"><div><h3>阶段能力趋势</h3><p>按基础、进阶和项目化练习汇总最近判定；其中真实脚本 ${trend.runnerCount} 次。</p></div><strong>${trend.average} <small>均分</small><span>${escapeHTML(deltaLabel)}</span></strong></div>
    <div class="stage-ability-levels">${trend.levels.map((level) => `<div><span>${escapeHTML(level.label)}</span><b><i style="--ability-width:${level.average}%"></i></b><strong>${level.average}</strong><small>${level.passed}/${level.total} 通过</small></div>`).join("")}</div>
    <div class="stage-ability-points" aria-label="最近练习判定分数">${trend.points.map((point) => `<div title="${escapeHTML(`${point.practice.title} · ${point.score} 分 · ${formatPracticeAssessmentLabel(point.assessment)}`)}"><i style="--ability-score:${Math.max(4, point.score)}%"></i><span>${escapeHTML(new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit" }).format(new Date(point.checkedAt)))}</span></div>`).join("") || "<p>保存练习证据后，这里会显示近期判定趋势。</p>"}</div>
  </article>`;
}

function getStageReviewItems(stage = getStageReviewStage()) {
  const completed = new Set(state.completedLessons || []);
  const lessons = stage.lessons.map((lesson) => getLesson(lesson.id) || lesson);
  const completedLessons = lessons.filter((lesson) => completed.has(lesson.id));
  const incompleteLessons = lessons.filter((lesson) => !completed.has(lesson.id));
  const quizzes = lessons.map((lesson) => ({ lesson, result: state.quizResults?.[lesson.id] })).filter((item) => item.result);
  const mistakes = getMissedQuizItems().filter((item) => item.lesson.stageId === stage.id);
  const pendingMistakes = mistakes.filter((item) => !isMistakeReviewed(item));
  const notes = getNoteResults("").filter((item) => item.kind === "mainline" && item.lesson.stageId === stage.id);
  const evidence = getPracticeEvidenceEntries().filter((item) => item.lesson.stageId === stage.id);
  const practiceRecords = getPracticeRecordEntries().filter((item) => item.lesson.stageId === stage.id);
  const reading = getReadingPositionEntries().filter((entry) => entry.kind === "main" && getLesson(entry.id)?.stageId === stage.id);
  const blockedEvidence = evidence.filter((item) => item.evidence.status === "blocked" || item.evidence.status === "rerun-needed");
  const blockedPracticeRecords = practiceRecords.filter((item) => item.evidence.status === "blocked");
  const abilityTrend = getStageAbilityTrend(stage);
  const nextActions = [];
  if (incompleteLessons[0]) nextActions.push({ type: "继续课程", title: incompleteLessons[0].title, detail: `阶段 ${stage.id} 还剩 ${incompleteLessons.length} 节`, lessonId: incompleteLessons[0].id });
  if (pendingMistakes[0]) nextActions.push({ type: "复习错题", title: pendingMistakes[0].lesson.title, detail: `还有 ${pendingMistakes.length} 道未复习错题`, lessonId: pendingMistakes[0].lesson.id });
  if (blockedEvidence[0]) nextActions.push({ type: "重跑实验", title: blockedEvidence[0].lesson.title, detail: formatPracticeEvidenceStatus(blockedEvidence[0].evidence.status), lessonId: blockedEvidence[0].lesson.id });
  if (blockedPracticeRecords[0]) nextActions.push({ type: "处理练习证据", title: blockedPracticeRecords[0].practice.title, detail: "练习记录标记为遇到问题", lessonId: blockedPracticeRecords[0].lesson.id });
  if (!nextActions.length && completedLessons.length === lessons.length) nextActions.push({ type: "进入下一阶段", title: "这个阶段已经闭环", detail: "可以导出复盘，或继续下一阶段课程", lessonId: null });
  return { stage, lessons, completedLessons, incompleteLessons, quizzes, mistakes, pendingMistakes, notes, evidence, practiceRecords, reading, blockedEvidence, blockedPracticeRecords, abilityTrend, nextActions };
}

function renderStageReviewOptions(stage) {
  const select = document.getElementById("stage-review-filter");
  if (!select) return;
  select.innerHTML = stages.map((item) => {
    const progress = getStageProgress(item);
    return `<option value="${item.id}" ${item.id === stage.id ? "selected" : ""}>阶段 ${item.id} · ${escapeHTML(item.title)} · ${progress.completed}/${progress.total}</option>`;
  }).join("");
}

function renderStageReviewMetric(label, value, hint) {
  return `<div class="stage-review-metric"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong><small>${escapeHTML(hint)}</small></div>`;
}

function renderStageActionItem(action) {
  const button = action.lessonId ? `<button class="text-button" type="button" data-open-lesson="${escapeHTML(action.lessonId)}">打开课程 <span aria-hidden="true">→</span></button>` : `<button class="text-button" type="button" data-go-view="roadmap">查看路线 <span aria-hidden="true">→</span></button>`;
  return `<li><span>${escapeHTML(action.type)}</span><strong>${escapeHTML(action.title)}</strong><small>${escapeHTML(action.detail)}</small>${button}</li>`;
}

function renderStageReview() {
  const panel = document.getElementById("stage-review-panel");
  if (!panel) return;
  const data = getStageReviewItems();
  const { stage, lessons, completedLessons, incompleteLessons, quizzes, pendingMistakes, notes, evidence, practiceRecords, reading, blockedEvidence, abilityTrend, nextActions } = data;
  const percent = Math.round((completedLessons.length / Math.max(1, lessons.length)) * 100);
  renderStageReviewOptions(stage);
  panel.innerHTML = `<div class="stage-review-overview">
    ${renderStageReviewMetric("课程完成", `${completedLessons.length} / ${lessons.length}`, `${percent}%`)}
    ${renderStageReviewMetric("知识检查", `${quizzes.length} / ${lessons.length}`, pendingMistakes.length ? `${pendingMistakes.length} 道待复习` : "暂无待复习错题")}
    ${renderStageReviewMetric("实验 / 练习证据", `${evidence.length} / ${practiceRecords.length}`, blockedEvidence.length ? `${blockedEvidence.length} 条实验需处理` : "实验条数 / 练习条数")}
    ${renderStageReviewMetric("学习笔记", `${notes.length} 篇`, reading.length ? `${reading.length} 个阅读断点` : "可导出复盘")}
  </div>
  <div class="stage-review-grid">
    ${renderStageAbilityTrend(abilityTrend)}
    <article class="stage-review-card">
      <h3>下一步</h3>
      <ol class="stage-review-action-list">${nextActions.map(renderStageActionItem).join("")}</ol>
    </article>
    <article class="stage-review-card">
      <h3>未完成课程</h3>
      <div class="stage-review-chip-list">${incompleteLessons.slice(0, 8).map((lesson) => `<button type="button" data-open-lesson="${escapeHTML(lesson.id)}">阶段 ${lesson.stageId} · ${escapeHTML(lesson.title)}</button>`).join("") || "<p>本阶段课程已完成。</p>"}</div>
    </article>
    <article class="stage-review-card">
      <h3>实验与证据</h3>
      <div class="stage-review-evidence-list">${evidence.slice(0, 5).map(({ lesson, evidence: item }) => `<button type="button" data-open-lesson="${escapeHTML(lesson.id)}"><strong>${escapeHTML(lesson.title)}</strong><span>${escapeHTML(formatPracticeEvidenceStatus(item.status))} · ${escapeHTML(formatDateTime(item.updatedAt))}</span></button>`).join("") || "<p>还没有记录本阶段实验结果。</p>"}</div>
    </article>
    <article class="stage-review-card">
      <h3>逐练习证据</h3>
      <div class="stage-review-evidence-list">${practiceRecords.slice(0, 5).map(({ lesson, practice, evidence: item }) => `<button type="button" data-open-lesson="${escapeHTML(lesson.id)}"><strong>${escapeHTML(practice.title)}</strong><span>${escapeHTML(lesson.title)} · ${escapeHTML(formatPracticeRecordStatus(item.status))}</span></button>`).join("") || "<p>还没有记录逐练习证据。</p>"}</div>
    </article>
    <article class="stage-review-card">
      <h3>笔记与错题</h3>
      <ul class="stage-review-summary-list">
        <li><strong>${notes.length}</strong><span>篇笔记，可在下方笔记搜索继续定位。</span></li>
        <li><strong>${pendingMistakes.length}</strong><span>道未复习错题，可在下方错题区标记完成。</span></li>
        <li><strong>${reading.length}</strong><span>个阅读断点，可从学习台继续阅读。</span></li>
      </ul>
    </article>
  </div>`;
}

function buildStageReviewMarkdown(stage = getStageReviewStage()) {
  const data = getStageReviewItems(stage);
  const { lessons, completedLessons, incompleteLessons, quizzes, mistakes, pendingMistakes, notes, evidence, practiceRecords, reading, blockedEvidence, abilityTrend, nextActions } = data;
  const percent = Math.round((completedLessons.length / Math.max(1, lessons.length)) * 100);
  return `# 阶段 ${stage.id} 复盘 - ${stage.title}

- 导出时间：${new Date().toLocaleString("zh-CN")}
- 课程完成：${completedLessons.length} / ${lessons.length}（${percent}%）
- 知识检查：${quizzes.length} / ${lessons.length}
- 错题：${mistakes.length} 道，其中 ${pendingMistakes.length} 道未复习
- 实验记录：${evidence.length} 条，其中 ${blockedEvidence.length} 条需要处理
- 逐练习证据：${practiceRecords.length} 条
- 近期能力判定：${abilityTrend.average} 分（${abilityTrend.direction}${abilityTrend.points.length >= 2 ? ` ${abilityTrend.delta > 0 ? "+" : ""}${abilityTrend.delta} 分` : ""}）
- 近期真实脚本验收：${abilityTrend.runnerCount} 次
- 学习笔记：${notes.length} 篇
- 阅读断点：${reading.length} 个

## 下一步

${nextActions.map((item) => `- ${item.type}｜${item.title}｜${item.detail}`).join("\n") || "- 暂无下一步建议"}

## 未完成课程

${incompleteLessons.map((lesson) => `- ${lesson.id}｜${lesson.title}｜${lesson.duration} 分钟`).join("\n") || "- 本阶段课程已完成"}

## 实验记录

${evidence.map(({ lesson, evidence: item }) => `- ${lesson.title}｜${formatPracticeEvidenceStatus(item.status)}｜${formatDateTime(item.updatedAt)}
  - 命令：${redactLearningEvidence(item.command || lesson.lab?.command || "未记录")}
  - 证据：${redactLearningEvidence(item.summary)}`).join("\n") || "- 暂无实验记录"}

## 逐练习证据

${practiceRecords.map(({ lesson, practice, evidence: item }) => { const assessment = normalizePracticeAssessment(item.assessment); return `- ${lesson.title}｜${practice.level}｜${practice.title}｜${formatPracticeRecordStatus(item.status)}｜${formatDateTime(item.checkedAt)}
  - 判定结果：${assessment ? `${formatPracticeAssessmentLabel(assessment)}｜${assessment.score}/100｜${assessment.reasons.join("；") || "无说明"}` : "历史记录，尚未判定"}
  - 真实验收：${item.verification ? `${item.verification.checks.filter((check) => check.passed).length}/${item.verification.checks.length} 项｜exit ${item.verification.exitCode}｜${item.verification.artifactFingerprint}` : "未接入"}
  - 命令：${redactLearningEvidence(item.command || "未记录")}
  - 输出：${redactLearningEvidence(item.output || "未记录")}
  - 备注：${redactLearningEvidence(item.note || "未记录")}`; }).join("\n") || "- 暂无逐练习证据"}

## 阶段能力趋势

${abilityTrend.levels.map((level) => `- ${level.label}：均分 ${level.average}｜已记录 ${level.recorded}/${level.total}｜通过 ${level.passed}/${level.total}`).join("\n")}

${abilityTrend.points.map((point) => `- ${formatDateTime(point.checkedAt)}｜${point.practice.title}｜${point.score}/100｜${formatPracticeAssessmentLabel(point.assessment)}`).join("\n") || "- 暂无近期判定记录"}

## 错题复习

${mistakes.map((item) => `- ${isMistakeReviewed(item) ? "已复习" : "未复习"}｜${item.lesson.title}｜第 ${item.questionIndex + 1} 题｜${formatDateTime(item.checkedAt)}`).join("\n") || "- 暂无错题"}

## 笔记目录

${notes.map((item) => `- ${item.lesson.title}｜标签：${(item.note.tags || []).join("、") || "无"}｜${formatDateTime(item.note.updatedAt)}`).join("\n") || "- 暂无笔记"}
`;
}

function downloadStageReviewMarkdown() {
  const stage = getStageReviewStage();
  const date = new Intl.DateTimeFormat("sv-SE").format(new Date());
  downloadTextFile(`阶段${stage.id}-复盘-${date}.md`, buildStageReviewMarkdown(stage));
  showToast("阶段复盘已导出");
}
