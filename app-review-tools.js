"use strict";

// 复习页辅助能力：错题排序、标签库增强、学习证据导出。

function getMistakeCourseTitle(item) {
  return item.kind === "extension" ? item.course.title : item.lesson.title;
}

function getMistakeKnowledgeLabel(item) {
  if (item.kind === "extension") {
    const context = getExtensionCourseContext(item.course);
    return `${context.routeTitle} · ${context.moduleTitle}`;
  }
  if (item.kind === "ai-zone") return getAIModule(item.lesson.moduleId)?.title || item.lesson.moduleId;
  return `阶段 ${item.lesson.stageId} · ${item.lesson.stageTitle}`;
}

function sortMistakeItems(items) {
  const sorted = [...items];
  if (activeMistakeSort === "course") return sorted.sort((a, b) => getMistakeCourseTitle(a).localeCompare(getMistakeCourseTitle(b), "zh-CN") || a.questionIndex - b.questionIndex);
  if (activeMistakeSort === "knowledge") return sorted.sort((a, b) => getMistakeKnowledgeLabel(a).localeCompare(getMistakeKnowledgeLabel(b), "zh-CN") || getMistakeCourseTitle(a).localeCompare(getMistakeCourseTitle(b), "zh-CN"));
  return sorted.sort((a, b) => new Date(b.checkedAt || 0) - new Date(a.checkedAt || 0));
}

function getNoteStoreGroups() {
  const aiProgress = getAIProgress();
  return [{ kind: "mainline", notes: state.lessonNotes || Object.create(null) }, { kind: "extension", notes: getExtensionState().extensionNotes || Object.create(null) }, { kind: "ai-zone", notes: aiProgress.lessonNotes || Object.create(null) }, { kind: "ai-guide", notes: aiProgress.guideNotes || Object.create(null) }];
}

function getNoteTagStats() {
  const stats = new Map();
  getNoteResults("").forEach((item) => (item.note.tags || []).forEach((tag) => {
    const key = tag.toLowerCase();
    const current = stats.get(key) || { tag, count: 0, sources: new Set() };
    current.count += 1;
    current.sources.add(item.kind);
    stats.set(key, current);
  }));
  return [...stats.values()].map((item) => ({ tag: item.tag, count: item.count, sourceCount: item.sources.size })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

function getFilteredNoteTagStats() {
  const normalized = noteTagSearchQuery.trim().toLowerCase();
  return getNoteTagStats().filter((item) => !normalized || item.tag.toLowerCase().includes(normalized));
}

function selectNotesByTag(tag) {
  const target = normalizeNoteTags([tag])[0];
  if (!target) return 0;
  const key = target.toLowerCase();
  let count = 0;
  getNoteResults("").forEach((item) => {
    if (!(item.note.tags || []).some((noteTag) => noteTag.toLowerCase() === key)) return;
    selectedNoteKeys.add(getNoteResultKey(item));
    count += 1;
  });
  if (typeof document.getElementById === "function") renderNoteSearch();
  return count;
}

function updateTagsForAllNotes(transform) {
  let changed = 0;
  const now = new Date().toISOString();
  getNoteStoreGroups().forEach((group) => {
    Object.values(group.notes).forEach((note) => {
      if (!note || typeof note.content !== "string") return;
      const before = normalizeNoteTags(note.tags);
      const after = normalizeNoteTags(transform(before, group.kind));
      if (before.length === after.length && before.every((tag, index) => tag === after[index])) return;
      note.tags = after;
      note.updatedAt = now;
      changed += 1;
    });
  });
  if (changed > 0) getAIProgress().updatedAt = now;
  return changed;
}

function renameNoteTag(fromTag, toTag) {
  const sourceTag = normalizeNoteTags([fromTag])[0];
  const targetTag = normalizeNoteTags([toTag])[0];
  if (!sourceTag || !targetTag) return 0;
  const sourceKey = sourceTag.toLowerCase();
  return updateTagsForAllNotes((tags) => tags.map((tag) => (tag.toLowerCase() === sourceKey ? targetTag : tag)));
}

function noteTagExists(tag) {
  const target = normalizeNoteTags([tag])[0];
  return Boolean(target && getAllNoteTags().some((item) => item.toLowerCase() === target.toLowerCase()));
}

function mergeNoteTag(fromTag, intoTag) {
  const sourceTag = normalizeNoteTags([fromTag])[0];
  const targetTag = normalizeNoteTags([intoTag])[0];
  if (!sourceTag || !targetTag || sourceTag.toLowerCase() === targetTag.toLowerCase() || !noteTagExists(targetTag)) return 0;
  return renameNoteTag(sourceTag, targetTag);
}

function removeNoteTag(tag) {
  const sourceTag = normalizeNoteTags([tag])[0];
  if (!sourceTag) return 0;
  const sourceKey = sourceTag.toLowerCase();
  return updateTagsForAllNotes((tags) => tags.filter((item) => item.toLowerCase() !== sourceKey));
}

function refreshNoteTagManagerAfterChange(message, changed, focusTag = "") {
  if (!changed) {
    showToast("没有找到需要更新的标签");
    return;
  }
  const tags = getAllNoteTags();
  const normalizedFocusTag = normalizeNoteTags([focusTag])[0];
  if (normalizedFocusTag && tags.some((tag) => tag.toLowerCase() === normalizedFocusTag.toLowerCase())) activeNoteTag = normalizedFocusTag;
  if (activeNoteTag !== "all" && !tags.some((tag) => tag.toLowerCase() === activeNoteTag.toLowerCase())) activeNoteTag = "all";
  saveState(true);
  renderDataTools();
  renderStudyReview();
  showToast(message);
}

function handleNoteTagRename() {
  const source = document.getElementById("note-tag-source")?.value || "";
  const targetTag = normalizeNoteTags([document.getElementById("note-tag-target")?.value || ""])[0];
  if (!normalizeNoteTags([source])[0] || !targetTag) { showToast("先选择标签，并填写新标签名"); return; }
  if (source.toLowerCase() !== targetTag.toLowerCase() && noteTagExists(targetTag)) { showToast("目标标签已存在，请使用合并"); return; }
  const changed = renameNoteTag(source, targetTag);
  refreshNoteTagManagerAfterChange(`已更新 ${changed} 篇笔记的标签`, changed, targetTag);
}

function handleNoteTagMerge() {
  const source = document.getElementById("note-tag-source")?.value || "";
  const targetTag = normalizeNoteTags([document.getElementById("note-tag-target")?.value || ""])[0];
  if (!normalizeNoteTags([source])[0] || !targetTag) { showToast("先选择标签，并填写要合并到的标签"); return; }
  if (!noteTagExists(targetTag)) { showToast("合并目标需要是已有标签"); return; }
  const changed = mergeNoteTag(source, targetTag);
  refreshNoteTagManagerAfterChange(`已合并 ${changed} 篇笔记的标签`, changed, targetTag);
}

function handleNoteTagRemove() {
  const source = document.getElementById("note-tag-source")?.value || "";
  if (!normalizeNoteTags([source])[0]) { showToast("先选择要移除的标签"); return; }
  const changed = removeNoteTag(source);
  refreshNoteTagManagerAfterChange(`已从 ${changed} 篇笔记移除标签`, changed);
}

function renderNoteTagManager() {
  const panel = document.getElementById("note-tag-manager");
  if (!panel) return;
  const allStats = getNoteTagStats();
  const stats = getFilteredNoteTagStats();
  if (activeNoteTag !== "all" && !stats.some((item) => item.tag.toLowerCase() === activeNoteTag.toLowerCase())) activeNoteTag = "all";
  const current = stats.find((item) => item.tag.toLowerCase() === activeNoteTag.toLowerCase()) || stats[0];
  const selectedTag = activeNoteTag === "all" ? current?.tag || "" : activeNoteTag;
  panel.innerHTML = stats.length ? `<div class="note-tag-manager-top">
    <div><span class="section-kicker">标签管理</span><strong>${allStats.length} 个标签 · ${allStats.reduce((sum, item) => sum + item.count, 0)} 次使用</strong></div>
    <label><span>搜索标签</span><input id="note-tag-search" type="search" maxlength="40" value="${escapeHTML(noteTagSearchQuery)}" placeholder="输入标签关键词"></label>
    <label><span>当前标签</span><select id="note-tag-source" aria-label="选择要管理的笔记标签">${stats.map((item) => `<option value="${escapeHTML(item.tag)}" ${item.tag.toLowerCase() === selectedTag.toLowerCase() ? "selected" : ""}>${escapeHTML(item.tag)} · ${item.count} 篇</option>`).join("")}</select></label>
    <label><span>目标标签</span><input id="note-tag-target" type="text" maxlength="60" list="note-tag-target-options" placeholder="输入新名称或已有标签"><datalist id="note-tag-target-options">${allStats.map((item) => `<option value="${escapeHTML(item.tag)}"></option>`).join("")}</datalist></label>
    <div class="note-tag-manager-actions"><button class="secondary-button" type="button" data-note-tag-action="select">选择标签笔记</button><button class="secondary-button" type="button" data-note-tag-action="rename">重命名</button><button class="secondary-button" type="button" data-note-tag-action="merge">合并</button><button class="secondary-button danger-button" type="button" data-note-tag-action="remove">移除标签</button></div>
  </div>
  <div class="note-tag-chart" aria-label="标签使用统计">${stats.slice(0, 8).map((item) => `<div><span>${escapeHTML(item.tag)}</span><b style="--tag-ratio:${Math.max(8, Math.round(item.count / Math.max(1, stats[0].count) * 100))}%"></b><em>${item.count}</em></div>`).join("")}</div>
  <div class="note-tag-cloud" aria-label="全部笔记标签">${stats.slice(0, 32).map((item) => `<button type="button" data-note-tag-pick="${escapeHTML(item.tag)}" class="${item.tag.toLowerCase() === selectedTag.toLowerCase() ? "is-active" : ""}">#${escapeHTML(item.tag)} <span>${item.count}</span></button>`).join("")}</div>` : `<div class="note-tag-manager-empty"><strong>${allStats.length ? "没有匹配的标签" : "还没有可管理的标签"}</strong><p>${allStats.length ? "换一个标签关键词试试。" : "在课程笔记里添加标签后，可以在这里统一重命名、合并或移除。"}</p></div>`;
}

function redactLearningEvidence(value) {
  return String(value || "")
    .replace(/(api[_-]?key|token|secret|password|cookie|authorization)(\s*[:=]\s*)([^\s,;]+)/gi, "$1$2[已脱敏]")
    .replace(/(Bearer\s+)[A-Za-z0-9._~+/-]+=*/gi, "$1[已脱敏]")
    .replace(/([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, "$1@[已脱敏]");
}

function getPracticeEvidenceEntries() {
  const store = state.practiceEvidence || Object.create(null);
  return Object.entries(store)
    .map(([lessonId, evidence]) => {
      const lesson = getLesson(lessonId);
      if (!lesson || !lesson.lab || !evidence) return null;
      return { lesson, evidence };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.evidence.updatedAt || 0) - new Date(a.evidence.updatedAt || 0));
}

function getPracticeRecordEntries() {
  return Object.entries(state.practiceRecords || Object.create(null))
    .map(([practiceId, evidence]) => {
      const context = getPracticeById(practiceId);
      if (!context || !evidence) return null;
      return { practiceId, lesson: context.lesson, practice: context.practice, evidence };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.evidence.checkedAt || 0) - new Date(a.evidence.checkedAt || 0));
}

function formatPracticeEvidenceStatus(status) {
  return {
    done: "已完成",
    blocked: "遇到问题",
    "rerun-needed": "需要复跑"
  }[status] || "已记录";
}

function buildLearningEvidenceMarkdown() {
  const completedMain = getAllLessons().filter((lesson) => state.completedLessons.includes(lesson.id));
  const completedExtension = getAllExtensionCourses().filter((course) => getExtensionState().completedExtensionLessons.includes(course.id));
  const aiProgress = getAIProgress();
  const completedAI = getAIData().lessons.filter((lesson) => aiProgress.completedLessons.includes(lesson.id));
  const completedGuides = getAIFoundationData().guides.filter((guide) => aiProgress.completedGuides.includes(guide.id));
  const notes = getNoteResults("");
  const mistakes = sortMistakeItems([...getMissedQuizItems(), ...getMissedExtensionQuizItems(), ...getMissedAIQuizItems()]);
  const labs = getAIData().labs.filter((lab) => aiProgress.labResults[lab.id]);
  const practiceEvidence = getPracticeEvidenceEntries();
  const practiceRecords = getPracticeRecordEntries();
  const practiceAssessmentCounts = practiceRecords.reduce((counts, item) => {
    const result = normalizePracticeAssessment(item.evidence.assessment)?.result || "unassessed";
    counts[result] = (counts[result] || 0) + 1;
    return counts;
  }, { passed: 0, failed: 0, review: 0, unassessed: 0 });
  const reviewed = mistakes.filter(isMistakeReviewed);
  return `# 计算机学习地图 - 学习证据

- 导出时间：${new Date().toLocaleString("zh-CN")}
- 主线完成：${completedMain.length} / ${getAllLessons().length}
- 专业方向完成：${completedExtension.length} / ${getAllExtensionCourses().length}
- AI 课程完成：${completedAI.length} / ${getAIData().lessons.length}
- AI 入门完成：${completedGuides.length} / ${getAIFoundationData().guides.length}
- AI 实验记录：${labs.length} / ${getAIData().labs.length}
- 课程实验证据：${practiceEvidence.length} 条
- 逐练习证据：${practiceRecords.length} 条
- 自动判定：通过 ${practiceAssessmentCounts.passed}｜未通过 ${practiceAssessmentCounts.failed}｜待复核 ${practiceAssessmentCounts.review}｜历史未判定 ${practiceAssessmentCounts.unassessed}
- 学习笔记：${notes.length} 篇
- 错题复习：${reviewed.length} / ${mistakes.length}

## 完成记录

${[...completedMain.map((lesson) => `- 主线｜阶段 ${lesson.stageId}｜${lesson.title}`), ...completedExtension.map((course) => `- 专业方向｜${getExtensionCourseContext(course).routeTitle}｜${course.title}`), ...completedAI.map((lesson) => `- AI 课程｜${lesson.moduleId}｜${lesson.title}`), ...completedGuides.map((guide) => `- AI 入门｜${guide.number}｜${guide.title}`)].join("\n") || "- 暂无完成记录"}

## 实验记录

${labs.map((lab) => { const result = aiProgress.labResults[lab.id]; return `- ${lab.title}｜${result.passed ? "已通过" : "已运行"}｜${formatDateTime(result.ranAt)}｜${result.summary || "无摘要"}`; }).join("\n") || "- 暂无实验记录"}

## 课程实验证据

${practiceEvidence.map(({ lesson, evidence }) => `- 阶段 ${lesson.stageId}｜${lesson.title}｜${formatPracticeEvidenceStatus(evidence.status)}｜${formatDateTime(evidence.updatedAt)}
  - 命令：${redactLearningEvidence(evidence.command || lesson.lab.command || "未记录")}
  - 证据：${redactLearningEvidence(evidence.summary)}`).join("\n") || "- 暂无课程实验证据"}

## 逐练习证据

${practiceRecords.map(({ lesson, practice, evidence }) => { const assessment = normalizePracticeAssessment(evidence.assessment); return `- 阶段 ${lesson.stageId}｜${lesson.title}｜${practice.level}｜${practice.title}｜${formatPracticeRecordStatus(evidence.status)}｜${formatDateTime(evidence.checkedAt)}
  - 任务：${practice.task}
  - 验收：${practice.evidence}
  - 判定结果：${assessment ? `${formatPracticeAssessmentLabel(assessment)}｜${assessment.score}/100｜${assessment.reasons.join("；") || "无说明"}` : "历史记录，尚未判定"}
  - 真实验收：${evidence.verification ? `${evidence.verification.checks.filter((check) => check.passed).length}/${evidence.verification.checks.length} 项｜exit ${evidence.verification.exitCode}｜${evidence.verification.artifactFingerprint}` : "未接入"}
  - 命令：${redactLearningEvidence(evidence.command || "未记录")}
  - 输出：${redactLearningEvidence(evidence.output || "未记录")}
  - 备注：${redactLearningEvidence(evidence.note || "未记录")}`; }).join("\n") || "- 暂无逐练习证据"}

## 错题复习记录

${mistakes.map((item) => `- ${isMistakeReviewed(item) ? "已复习" : "未复习"}｜${getMistakeKnowledgeLabel(item)}｜${getMistakeCourseTitle(item)}｜第 ${item.questionIndex + 1} 题｜${formatDateTime(item.checkedAt)}`).join("\n") || "- 暂无错题记录"}

## 笔记目录

${notes.map((item) => { const meta = getNoteResultPresentation(item); return `- ${meta.typeLabel}｜${meta.contextLabel}｜${meta.title}｜标签：${(item.note.tags || []).join("、") || "无"}`; }).join("\n") || "- 暂无笔记"}
`;
}

function downloadLearningEvidenceMarkdown() {
  const date = new Intl.DateTimeFormat("sv-SE").format(new Date());
  downloadTextFile(`学习证据-${date}.md`, buildLearningEvidenceMarkdown());
  showToast("学习证据已导出");
}
