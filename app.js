"use strict";

function isExtensionCourseComplete(courseId) {
  return getExtensionState().completedExtensionLessons.includes(courseId);
}

function getExtensionCompletedCount() {
  return getExtensionState().completedExtensionLessons.length;
}

function getExtensionNoteCount() {
  return Object.values(getExtensionState().extensionNotes || {}).filter((note) => note?.content?.trim()).length;
}

function getDistractorLessons(lesson, seed) {
  const lessons = getAllLessons();
  const index = Math.max(0, lessons.findIndex((item) => item.id === lesson.id));
  const offsets = [7 + seed, 19 + seed * 2, 37 + seed * 3, 61 + seed, 89 + seed * 4];
  return offsets.map((offset) => lessons[(index + offset) % lessons.length]).filter((item) => item && item.id !== lesson.id);
}

function getDistractorExtensionCourses(course, seed) {
  const courses = getAllExtensionCourses();
  const index = Math.max(0, courses.findIndex((item) => item.id === course.id));
  const offsets = [5 + seed, 17 + seed * 2, 31 + seed * 3, 47 + seed, 71 + seed * 4];
  return offsets.map((offset) => courses[(index + offset) % courses.length]).filter((item) => item && item.id !== course.id);
}

function uniqueQuizOptions(options) {
  const seen = new Set();
  return options.map((option) => String(option || "").trim()).filter((option) => {
    if (!option || seen.has(option)) return false;
    seen.add(option);
    return true;
  }).slice(0, 4);
}

function buildQuizQuestion(prompt, correct, distractors, seed, explanation) {
  const normalizedCorrect = String(correct || "").trim();
  const options = uniqueQuizOptions([normalizedCorrect, ...distractors]);
  while (options.length < 4) options.push(`回到本课内容，重新核对第 ${options.length + 1} 个关键点。`);
  const rotation = seed % options.length;
  const rotated = [...options.slice(rotation), ...options.slice(0, rotation)];
  return {
    prompt,
    options: rotated,
    answerIndex: rotated.indexOf(normalizedCorrect),
    explanation
  };
}

// 根据课程已有内容自动生成 3 道检查题，避免后续新增课程时维护两套题库。
function buildLessonQuiz(lesson) {
  if (Array.isArray(lesson.quiz) && lesson.quiz.length) {
    return lesson.quiz.map((question) => ({
      prompt: question.prompt,
      options: question.options,
      answerIndex: question.answerIndex,
      explanation: question.explanation
    }));
  }
  const summaryDistractors = getDistractorLessons(lesson, 1).map((item) => item.summary);
  const conceptDistractors = getDistractorLessons(lesson, 2).map((item) => item.concepts[0]);
  const checkpointDistractors = getDistractorLessons(lesson, 3).map((item) => item.checkpoint);
  return [
    buildQuizQuestion("本课最主要解决的问题是什么？", lesson.summary, summaryDistractors, 1, "看课程标题下方的摘要，它说明这节课的学习目标。"),
    buildQuizQuestion("下列哪一项属于本课关键概念？", lesson.concepts[0], conceptDistractors, 2, "回到“关键概念”区，先抓住第一个核心概念。"),
    buildQuizQuestion("学完本课后，应该能达到哪条验收标准？", lesson.checkpoint, checkpointDistractors, 3, "验收标准是决定是否标记完成的证据。")
  ];
}

// 根据扩展细课内容生成独立检查题，结果只进入扩展进度，不影响主线课程。
function buildExtensionCourseQuiz(course) {
  const summaryDistractors = getDistractorExtensionCourses(course, 1).map((item) => item.summary);
  const conceptDistractors = getDistractorExtensionCourses(course, 2).map((item) => item.concepts[0]);
  const evidenceDistractors = getDistractorExtensionCourses(course, 3).map((item) => item.projectEvidence);
  return [
    buildQuizQuestion("这节方向课程主要训练哪项能力？", course.summary, summaryDistractors, 1, "先看课程标题下方的摘要，它说明这节课在方向学习中的位置。"),
    buildQuizQuestion("下列哪一项属于本课关键概念？", course.concepts[0], conceptDistractors, 2, "回到“关键概念”区，优先确认第一个核心概念。"),
    buildQuizQuestion("本课最适合留下哪类作品证据？", course.projectEvidence, evidenceDistractors, 3, "方向课程重在作品积累，作品证据能判断练习是否真正落地。")
  ];
}

function renderLessonQuiz(lesson) {
  const questions = buildLessonQuiz(lesson);
  const result = state.quizResults[lesson.id];
  const scoreCopy = result ? `上次得分 ${result.score} / ${result.total} · ${formatDateTime(result.checkedAt)}` : "提交后会保存到本机，不影响课程完成状态。";
  return `<section class="lesson-section quiz-section" data-quiz-lesson="${lesson.id}">
    <div class="lesson-section-heading">
      <div>
        <h2>知识检查</h2>
        <p>用 3 道小题确认自己是否抓住本课重点。</p>
      </div>
      <span class="quiz-score ${result ? "is-checked" : ""}">${escapeHTML(scoreCopy)}</span>
    </div>
    <div class="quiz-list">
      ${questions.map((question, questionIndex) => `
        <fieldset class="quiz-card">
          <legend>${questionIndex + 1}. ${escapeHTML(question.prompt)}</legend>
          ${question.options.map((option, optionIndex) => {
            const selected = result?.answers?.[questionIndex] === optionIndex;
            const answer = result && optionIndex === question.answerIndex;
            const missed = result && selected && optionIndex !== question.answerIndex;
            return `<label class="quiz-option ${answer ? "is-answer" : ""} ${missed ? "is-miss" : ""}">
              <input type="radio" name="lesson-quiz-${questionIndex}" value="${optionIndex}" ${selected ? "checked" : ""}>
              <span>${escapeHTML(option)}</span>
            </label>`;
          }).join("")}
          ${result ? `<p class="quiz-explain">${escapeHTML(question.explanation)}</p>` : ""}
        </fieldset>
      `).join("")}
    </div>
    <div class="lesson-inline-actions">
      <button class="complete-button" type="button" data-check-quiz="${lesson.id}">检查答案</button>
      ${result ? `<button class="secondary-button" type="button" data-reset-quiz="${lesson.id}">重做本课检查</button>` : ""}
    </div>
  </section>`;
}

function renderExtensionCourseQuiz(course) {
  const questions = buildExtensionCourseQuiz(course);
  const result = getExtensionState().extensionQuizResults[course.id];
  const scoreCopy = result ? `扩展检查 ${result.score} / ${result.total} · ${formatDateTime(result.checkedAt)}` : `提交后只保存到扩展进度，不影响 ${getAllLessons().length} 节主线课程。`;
  return `<section class="lesson-section quiz-section extension-quiz-section" data-extension-quiz-course="${course.id}">
    <div class="lesson-section-heading">
      <div>
        <h2>方向知识检查</h2>
        <p>用 3 道小题确认自己是否理解本方向的概念、练习和作品证据。</p>
      </div>
      <span class="quiz-score ${result ? "is-checked" : ""}">${escapeHTML(scoreCopy)}</span>
    </div>
    <div class="quiz-list">
      ${questions.map((question, questionIndex) => `
        <fieldset class="quiz-card">
          <legend>${questionIndex + 1}. ${escapeHTML(question.prompt)}</legend>
          ${question.options.map((option, optionIndex) => {
            const selected = result?.answers?.[questionIndex] === optionIndex;
            const answer = result && optionIndex === question.answerIndex;
            const missed = result && selected && optionIndex !== question.answerIndex;
            return `<label class="quiz-option ${answer ? "is-answer" : ""} ${missed ? "is-miss" : ""}">
              <input type="radio" name="extension-quiz-${course.id}-${questionIndex}" value="${optionIndex}" ${selected ? "checked" : ""}>
              <span>${escapeHTML(option)}</span>
            </label>`;
          }).join("")}
          ${result ? `<p class="quiz-explain">${escapeHTML(question.explanation)}</p>` : ""}
        </fieldset>
      `).join("")}
    </div>
    <div class="lesson-inline-actions">
      <button class="complete-button is-extension" type="button" data-check-extension-quiz="${course.id}">检查扩展答案</button>
      ${result ? `<button class="secondary-button" type="button" data-reset-extension-quiz="${course.id}">重做扩展检查</button>` : ""}
    </div>
  </section>`;
}

function renderLessonNote(lesson) {
  const note = state.lessonNotes[lesson.id] || {};
  return `<section class="lesson-section note-section">
    <div class="lesson-section-heading">
      <div>
        <h2>学习笔记</h2>
        <p>写下你自己的理解、疑问或操作记录，只保存在当前浏览器。</p>
      </div>
      <span class="note-status">保存：${escapeHTML(formatDateTime(note.updatedAt))}</span>
    </div>
    <label class="lesson-note-tags"><span>标签</span><input id="lesson-note-tags" type="text" maxlength="200" value="${escapeHTML((note.tags || []).join(", "))}" placeholder="用逗号分隔，例如：文件, 路径, 易错点"></label>
    <textarea id="lesson-note-text" class="lesson-note-input" rows="7" maxlength="12000" placeholder="例如：今天我终于分清了文件名、扩展名和路径……">${escapeHTML(note.content || "")}</textarea>
    <div class="lesson-inline-actions">
      <button class="complete-button" type="button" data-save-note="${lesson.id}">保存笔记</button>
    </div>
  </section>`;
}

function renderPracticeRecordCard(lesson, practice) {
  const record = state.practiceRecords?.[practice.id] || {};
  const status = ["todo", "in-progress", "done", "blocked"].includes(record.status) ? record.status : "todo";
  const assessment = normalizePracticeAssessment(record.assessment);
  const verificationBinding = getPracticeVerificationBinding(lesson, practice);
  const verification = verificationBinding && record.verification ? validatePracticeVerificationArtifact(record.verification, lesson, practice).verification : null;
  const statusOptions = [
    ["todo", "未开始"],
    ["in-progress", "进行中"],
    ["done", "已完成"],
    ["blocked", "遇到问题"]
  ];
  return `<article class="practice-tier-card" data-practice-card="${escapeHTML(practice.id)}">
    <div class="practice-tier-heading">
      <span>${escapeHTML(practice.level)}</span>
      <div class="practice-record-status-group">
        <strong class="practice-record-status is-${escapeHTML(status)}">${escapeHTML(formatPracticeRecordStatus(status))}</strong>
        ${assessment ? `<strong class="practice-assessment-status is-${escapeHTML(assessment.result)}">${escapeHTML(formatPracticeAssessmentLabel(assessment))} · ${assessment.score}</strong>` : ""}
      </div>
    </div>
    <h3>${escapeHTML(practice.title)}</h3>
    <p>${escapeHTML(practice.task)}</p>
    <small>${escapeHTML(practice.evidence)}</small>
    <details class="practice-record-editor">
      <summary>${record.checkedAt ? `更新证据 · ${escapeHTML(formatDateTime(record.checkedAt))}` : "记录练习证据"}</summary>
      ${verificationBinding ? `<div class="practice-verification-panel">
        <div><strong>${verification ? escapeHTML(formatPracticeAssessmentLabel(assessment)) : "固定脚本验收"}</strong><span>${verification ? `${verification.checks.filter((check) => check.passed).length}/${verification.checks.length} 项 · exit ${verification.exitCode}` : escapeHTML(verificationBinding.runtime)}</span></div>
        <code>${escapeHTML(getPracticeVerificationRunnerCommand(lesson.id))}</code>
        <div class="practice-verification-actions">
          <button class="secondary-button" type="button" data-copy-practice-verification="${escapeHTML(lesson.id)}">复制命令</button>
          <label class="secondary-button">导入结果<input type="file" accept=".json,application/json" data-import-practice-verification="${escapeHTML(practice.id)}" data-practice-lesson="${escapeHTML(lesson.id)}"></label>
        </div>
      </div>` : ""}
      <div class="practice-record-fields">
        <label><span>练习状态</span><select data-practice-record-status>
          ${statusOptions.map(([value, label]) => `<option value="${value}" ${status === value ? "selected" : ""}>${label}</option>`).join("")}
        </select></label>
        <label><span>执行命令（可选）</span><input type="text" maxlength="300" data-practice-record-command value="${escapeHTML(record.command || "")}" placeholder="例如：node exercise.js"></label>
        <label class="practice-record-wide"><span>输出摘要（可选）</span><textarea rows="3" maxlength="2000" data-practice-record-output placeholder="记录退出码、关键输出或验收结果。">${escapeHTML(record.output || "")}</textarea></label>
        <label class="practice-record-wide"><span>复盘备注（可选）</span><textarea rows="3" maxlength="3000" data-practice-record-note placeholder="记录遇到的问题、修复过程或截图位置。">${escapeHTML(record.note || "")}</textarea></label>
        ${assessment ? `<div class="practice-assessment-result practice-record-wide"><strong>${escapeHTML(formatPracticeAssessmentLabel(assessment))} · ${assessment.score}/100</strong><span>${escapeHTML(assessment.reasons.join("；") || "暂无判定说明")}</span><small>判定时间：${escapeHTML(formatDateTime(assessment.checkedAt))}</small></div>` : ""}
      </div>
      <div class="lesson-inline-actions">
        <button class="complete-button" type="button" data-save-practice-record="${escapeHTML(practice.id)}" data-practice-lesson="${escapeHTML(lesson.id)}">保存并判定</button>
        ${record.checkedAt ? `<button class="secondary-button" type="button" data-clear-practice-record="${escapeHTML(practice.id)}" data-practice-lesson="${escapeHTML(lesson.id)}">清除</button>` : ""}
      </div>
    </details>
  </article>`;
}

function renderHighDensityLessonSections(lesson) {
  if (!lesson.density) return "";
  const objectives = Array.isArray(lesson.objectives) ? lesson.objectives : [];
  const prerequisites = Array.isArray(lesson.prerequisites) ? lesson.prerequisites : [];
  const knowledgePoints = Array.isArray(lesson.knowledgePoints) ? lesson.knowledgePoints : [];
  const deepDive = Array.isArray(lesson.deepDive) ? lesson.deepDive : [];
  const workedExamples = Array.isArray(lesson.workedExamples) ? lesson.workedExamples : [];
  const lab = lesson.lab;
  const labEvidence = lab ? state.practiceEvidence?.[lesson.id] || {} : {};
  const mistakes = Array.isArray(lesson.mistakes) ? lesson.mistakes : [];
  const troubleshooting = Array.isArray(lesson.troubleshooting) ? lesson.troubleshooting : [];
  const practices = getLessonPractices(lesson);
  const projectLinks = Array.isArray(lesson.projectLinks) ? lesson.projectLinks : [];
  const references = Array.isArray(lesson.references) ? lesson.references : [];
  const takeaways = Array.isArray(lesson.takeaways) ? lesson.takeaways : [];
  return `
    <section class="lesson-section density-overview">
      <div class="lesson-section-heading">
        <div>
          <h2>本课学习目标</h2>
          <p>完成本课后，你应该能够独立解释关键概念、完成练习并验证结果。</p>
        </div>
      </div>
      <div class="density-two-column">
        <div>
          <h3>学完能做什么</h3>
          <ul>${objectives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>前置知识</h3>
          <ul>${prerequisites.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
    <section class="lesson-section density-knowledge">
      <h2>知识点清单</h2>
      <div class="density-table-wrap">
        <table class="density-table">
          <thead><tr><th>知识点</th><th>必须理解</th><th>常见误解</th></tr></thead>
          <tbody>${knowledgePoints.map((item) => `<tr><td>${escapeHTML(item.term)}</td><td>${escapeHTML(item.detail)}</td><td>${escapeHTML(item.misconception)}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
    <section class="lesson-section density-deep-dive">
      <h2>核心原理详解</h2>
      ${deepDive.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
      <div class="checkpoint-box"><strong>在真实系统里的位置</strong><p>${escapeHTML(lesson.systemPosition || "")}</p></div>
    </section>
    ${lab ? `<section class="lesson-section course-lab-section">
      <div class="lesson-section-heading">
        <div>
          <h2>动手实验</h2>
          <p>${escapeHTML(lab.title)}</p>
        </div>
        <span class="course-lab-runtime">${escapeHTML(lab.runtime === "python" ? "Python" : lab.runtime === "powershell" ? "PowerShell" : "JavaScript")}</span>
      </div>
      <div class="course-lab-meta">
        <div><strong>实验文件</strong><code>${escapeHTML((lab.files || []).join(" + "))}</code></div>
        <div><strong>运行命令</strong><code>${escapeHTML(lab.command)}</code></div>
      </div>
      <h3>完整代码</h3>
      <pre class="lesson-code course-lab-code">${escapeHTML(lab.code)}</pre>
      <div class="density-two-column course-lab-results">
        <div><h3>预期输出</h3><ul>${(lab.expected || []).map((item) => `<li><code>${escapeHTML(item)}</code></li>`).join("")}</ul></div>
        <div><h3>边界案例</h3><ul>${(lab.cases || []).map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
      </div>
      <h3>验收清单</h3>
      <ul class="density-check-list">${(lab.checks || []).map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      <div class="course-lab-evidence">
        <div class="lesson-section-heading">
          <div>
            <h3>记录实验结果</h3>
            <p>写下你实际运行的命令、输出、失败原因或截图说明。保存后会进入学习证据导出。</p>
          </div>
          <span class="note-status">${labEvidence.updatedAt ? `保存：${escapeHTML(formatDateTime(labEvidence.updatedAt))}` : "未记录"}</span>
        </div>
        <label class="lab-evidence-status"><span>实验状态</span><select data-lab-evidence-status="${escapeHTML(lesson.id)}">
          ${[
            ["done", "已完成"],
            ["blocked", "遇到问题"],
            ["rerun-needed", "需要复跑"]
          ].map(([value, label]) => `<option value="${value}" ${labEvidence.status === value ? "selected" : ""}>${label}</option>`).join("")}
        </select></label>
        <textarea class="lesson-note-input lab-evidence-input" rows="5" maxlength="3000" data-lab-evidence-input="${escapeHTML(lesson.id)}" placeholder="例如：命令退出码 0；输出包含 FILE_COUNT=3；我把扩展名改掉后发现内容没有转换。">${escapeHTML(labEvidence.summary || "")}</textarea>
        <div class="lesson-inline-actions">
          <button class="complete-button" type="button" data-save-lab-evidence="${escapeHTML(lesson.id)}">保存实验结果</button>
          ${labEvidence.updatedAt ? `<button class="secondary-button" type="button" data-clear-lab-evidence="${escapeHTML(lesson.id)}">清除记录</button>` : ""}
        </div>
      </div>
    </section>` : ""}
    <section class="lesson-section density-examples">
      <h2>分步骤示范</h2>
      <div class="worked-example-list">
        ${workedExamples.map((example, exampleIndex) => `<article class="worked-example-card">
          <div class="worked-example-top"><span>${String(exampleIndex + 1).padStart(2, "0")}</span><h3>${escapeHTML(example.title)}</h3></div>
          <p>${escapeHTML(example.scenario)}</p>
          <ol>${example.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join("")}</ol>
          <div class="worked-example-io">
            <div><strong>输入 / 观察对象</strong><pre class="lesson-code">${escapeHTML(example.input)}</pre></div>
            <div><strong>输出 / 判断结果</strong><pre class="lesson-code">${escapeHTML(example.output)}</pre></div>
          </div>
          <ul class="density-check-list">${example.checkpoints.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
        </article>`).join("")}
      </div>
    </section>
    <section class="lesson-section density-mistakes">
      <h2>常见误区与错误现象</h2>
      <div class="density-table-wrap">
        <table class="density-table">
          <thead><tr><th>错误说法 / 现象</th><th>为什么错</th><th>正确处理</th></tr></thead>
          <tbody>${mistakes.map((item) => `<tr><td>${escapeHTML(item.wrong)}</td><td>${escapeHTML(item.why)}</td><td>${escapeHTML(item.correct)}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
    <section class="lesson-section density-troubleshooting">
      <h2>排查清单</h2>
      <ul class="density-check-list">${troubleshooting.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
    </section>
    <section class="lesson-section density-practices">
      <h2>分层练习</h2>
      <div class="practice-tier-grid">
        ${practices.map((practice) => renderPracticeRecordCard(lesson, practice)).join("")}
      </div>
    </section>
    <section class="lesson-section density-projects">
      <h2>项目关联</h2>
      <ul>${projectLinks.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
    </section>
    <section class="lesson-section density-references">
      <h2>延伸阅读与引用</h2>
      <ul class="density-reference-list">
        ${references.map((reference) => `<li>
          <a class="reference-link" href="${escapeHTML(reference.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(reference.title)} <span aria-hidden="true">↗</span></a>
          <p>${escapeHTML(reference.usage)}</p>
        </li>`).join("")}
      </ul>
    </section>
    <section class="lesson-section density-summary">
      <h2>本课总结</h2>
      <ul>${takeaways.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
    </section>`;
}

function renderExtensionCourseNote(course) {
  const note = getExtensionState().extensionNotes[course.id] || {};
  return `<section class="lesson-section note-section extension-note-section">
    <div class="lesson-section-heading">
      <div>
        <h2>方向笔记</h2>
        <p>记录方向试炼中的术语、项目想法和验收证据，只保存在当前浏览器。</p>
      </div>
      <span class="note-status">保存：${escapeHTML(formatDateTime(note.updatedAt))}</span>
    </div>
    <label class="lesson-note-tags"><span>标签</span><input id="extension-note-tags" type="text" maxlength="200" value="${escapeHTML((note.tags || []).join(", "))}" placeholder="用逗号分隔，例如：项目, API, 待验证"></label>
    <textarea id="extension-note-text" class="lesson-note-input" rows="7" maxlength="12000" placeholder="例如：这个方向我想先做一个小项目验证……">${escapeHTML(note.content || "")}</textarea>
    <div class="lesson-inline-actions">
      <button class="complete-button is-extension" type="button" data-save-extension-note="${course.id}">保存方向笔记</button>
    </div>
  </section>`;
}

function renderOperationGuide(lesson) {
  const guide = stageOperationGuides[lesson.stageId];
  if (!guide) return "";
  const steps = guide.labels.map(([label, copy], index) => ({ label, copy, ...guide.actions[index] }));
  return `<section class="lesson-section operation-guide">
    <div class="lesson-section-heading">
      <div>
        <h2>操作图示标注</h2>
        <p>${escapeHTML(guide.subtitle)}</p>
      </div>
      <span class="operation-badge">阶段 ${lesson.stageId}</span>
    </div>
    <div class="operation-step-tabs" role="tablist" aria-label="操作步骤">
      ${steps.map((step, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" data-operation-step="${index}"><span>${index + 1}</span>${escapeHTML(step.label)}</button>`).join("")}
    </div>
    <div class="operation-layout">
      <div class="operation-window" aria-label="${escapeHTML(guide.title)}">
        <div class="operation-window-bar"><span></span><strong>${escapeHTML(guide.window)}</strong></div>
        <div class="operation-mock">
          ${guide.mock.map((item, index) => {
            const activeSteps = steps.map((step, stepIndex) => step.mock.includes(index) ? stepIndex : null).filter((stepIndex) => stepIndex !== null);
            return `<span class="mock-line mock-line-${index % 4} ${activeSteps.includes(0) ? "is-active" : ""}" data-operation-steps="${activeSteps.join(" ")}">${escapeHTML(item)}</span>`;
          }).join("")}
        </div>
      </div>
      <div class="operation-step-panels" aria-live="polite">
        ${steps.map((step, index) => `<article class="operation-step-panel" data-operation-panel="${index}" ${index === 0 ? "" : "hidden"}>
          <span class="operation-step-number">步骤 ${index + 1}</span>
          <h3>${escapeHTML(step.label)}</h3>
          <p>${escapeHTML(step.copy)}</p>
          <dl>
            <div><dt>现在操作</dt><dd>${escapeHTML(step.action)}</dd></div>
            <div><dt>观察证据</dt><dd>${escapeHTML(step.evidence)}</dd></div>
            <div><dt>完成判断</dt><dd>${escapeHTML(step.done)}</dd></div>
          </dl>
        </article>`).join("")}
      </div>
    </div>
  </section>`;
}

// 计算指定阶段已经完成的课程数量和百分比。
function getStageProgress(stage) {
  const completed = stage.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
  return { completed, total: stage.lessons.length, percent: Math.round((completed / stage.lessons.length) * 100) };
}

// 计算全站课程的整体完成情况。
function getOverallProgress() {
  const allLessons = getAllLessons();
  const completed = allLessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
  return { completed, total: allLessons.length, percent: Math.round((completed / allLessons.length) * 100) };
}

// 获取路线中第一节尚未完成的课程，全部完成时返回最后一课。
function getNextLesson() {
  const lessons = getAllLessons();
  return lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) || lessons[lessons.length - 1];
}

// 返回路线中第一个未完成阶段，全部完成时停留在最终阶段。
function getCurrentStage() {
  return stages.find((stage) => getStageProgress(stage).percent < 100) || stages[stages.length - 1];
}

// 切换主工作区视图，并同步侧边导航的当前状态。
function switchView(viewName) {
  document.querySelectorAll("[data-view-panel]").forEach((panel) => panel.classList.toggle("is-visible", panel.dataset.viewPanel === viewName));
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("is-active", button.dataset.view === viewName));
  setSidebarOpen(false);
  document.getElementById("search-results").hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 统一控制移动端侧边导航和背景遮罩，避免页面内容仍可误触。
function setSidebarOpen(open) {
  document.getElementById("sidebar").classList.toggle("is-open", open);
  document.getElementById("sidebar-backdrop").hidden = !open;
  document.getElementById("menu-button").setAttribute("aria-expanded", String(open));
}

// 更新侧边栏、仪表指标和日期等全局进度数据。
function renderProgress() {
  const overall = getOverallProgress();
  const completedTasks = countCompletedTaskEntries();
  const start = new Date(state.firstVisit);
  const studyDay = Math.max(1, Math.floor((Date.now() - start.getTime()) / 86400000) + 1);
  const recentStudyKeys = new Set(getRecentStudyDays().map((day) => day.key));
  const weeklyDays = state.activityDates.filter((date) => recentStudyKeys.has(date)).length;
  const currentStage = getCurrentStage();
  const currentStageProgress = getStageProgress(currentStage);
  const nextLesson = getNextLesson();

  document.getElementById("sidebar-progress-value").textContent = `${overall.percent}%`;
  document.getElementById("sidebar-progress-bar").style.width = `${overall.percent}%`;
  document.getElementById("sidebar-progress-copy").textContent = overall.completed ? `${overall.completed} / ${overall.total} 节课程` : "尚未开始";
  document.getElementById("completed-count").textContent = overall.completed;
  document.getElementById("overall-percent").textContent = `${overall.percent}%`;
  document.getElementById("roadmap-percent").textContent = `${overall.percent}%`;
  document.getElementById("stage-progress-note").textContent = `阶段 ${currentStage.id} / 9`;
  document.getElementById("weekly-days").textContent = weeklyDays;
  const completedPracticeRecords = Object.values(state.practiceRecords || {}).filter((record) => record.status === "done").length;
  document.getElementById("practice-count").textContent = completedTasks + getQuizCount() + completedPracticeRecords;
  document.getElementById("study-day-label").textContent = `第 ${studyDay} 天`;
  document.getElementById("today-label").textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date());
  document.getElementById("hero-stage-label").textContent = `当前阶段 · ${currentStage.title}`;
  document.getElementById("hero-title").textContent = stageHeroCopy[currentStage.id][0];
  document.getElementById("hero-summary").textContent = stageHeroCopy[currentStage.id][1];
  document.getElementById("hero-stage-progress").textContent = `${currentStageProgress.completed} / ${currentStageProgress.total}`;
  document.getElementById("hero-next-duration").textContent = `${nextLesson.duration} 分钟`;
  document.getElementById("hero-stage-percent").textContent = `${currentStageProgress.percent}%`;
  document.getElementById("hero-stage-bar").style.width = `${currentStageProgress.percent}%`;
}

// 渲染学习台中的下一节课程卡片。
function renderNextLesson() {
  const lesson = getNextLesson();
  const complete = state.completedLessons.includes(lesson.id);
  document.getElementById("next-lesson-card").innerHTML = `
    <div class="lesson-card">
      <div class="lesson-card-accent"></div>
      <div class="lesson-card-body">
        <div class="lesson-card-meta"><span>阶段 ${lesson.stageId} · ${escapeHTML(lesson.stageTitle)}</span><span>${lesson.duration} 分钟</span></div>
        <h3>${escapeHTML(lesson.title)}</h3>
        <p>${escapeHTML(lesson.summary)}</p>
      </div>
      <button class="open-lesson-button" type="button" data-open-lesson="${lesson.id}">${complete ? "重新查看" : "开始学习"}</button>
    </div>`;
}

// 渲染每日练习，并显示当天完成数量。
function renderDailyTasks() {
  const today = getLocalDateKey();
  const todayState = state.completedTasks[today] || {};
  const completed = dailyTasks.filter((task) => todayState[task.id]).length;
  document.getElementById("task-counter").textContent = `${completed} / ${dailyTasks.length}`;
  document.getElementById("daily-tasks").innerHTML = dailyTasks.map((task) => `
    <label class="task-item ${todayState[task.id] ? "is-complete" : ""}">
      <input type="checkbox" data-task-id="${task.id}" ${todayState[task.id] ? "checked" : ""}>
      <span><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.note)}</small></span>
    </label>`).join("");
  renderStudyWeek();
}

function renderDisplaySettings() {
  const settings = state.settings || {};
  document.body.dataset.fontSize = settings.fontSize || "standard";
  document.body.dataset.readingDensity = settings.readingDensity || "comfortable";
  document.body.dataset.highContrast = String(Boolean(settings.highContrast));
  document.body.dataset.reduceMotion = String(Boolean(settings.reduceMotion));
  const fontSize = document.getElementById("display-font-size");
  const readingDensity = document.getElementById("display-reading-density");
  const highContrast = document.getElementById("display-high-contrast");
  const reduceMotion = document.getElementById("display-reduce-motion");
  if (fontSize) fontSize.value = settings.fontSize || "standard";
  if (readingDensity) readingDensity.value = settings.readingDensity || "comfortable";
  if (highContrast) highContrast.checked = Boolean(settings.highContrast);
  if (reduceMotion) reduceMotion.checked = Boolean(settings.reduceMotion);
}

function setDisplaySetting(key, value) {
  const allowed = {
    fontSize: ["small", "standard", "large"],
    readingDensity: ["compact", "comfortable"]
  };
  if (allowed[key] && !allowed[key].includes(value)) return;
  if (["highContrast", "reduceMotion"].includes(key)) value = Boolean(value);
  state.settings = { ...state.settings, [key]: value };
  saveState(false);
  renderDisplaySettings();
  showToast("阅读显示已更新");
}

function getRecentStudyDays(referenceDate = new Date()) {
  const todayKey = getLocalDateKey(referenceDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() - (6 - index));
    const key = getLocalDateKey(date);
    const taskState = state.completedTasks[key] || {};
    const completed = dailyTasks.filter((task) => taskState[task.id]).length;
    return {
      key,
      dayLabel: new Intl.DateTimeFormat("zh-CN", { weekday: "short" }).format(date).replace("周", ""),
      dateLabel: `${date.getMonth() + 1}/${date.getDate()}`,
      completed,
      total: dailyTasks.length,
      isToday: key === todayKey
    };
  });
}

function renderStudyWeek() {
  const container = document.getElementById("study-week-days");
  if (!container) return;
  container.innerHTML = getRecentStudyDays().map((day) => `
    <div class="study-week-day ${day.isToday ? "is-today" : ""}" aria-label="${day.key}，完成 ${day.completed} / ${day.total} 项">
      <span>${day.dayLabel}</span>
      <strong>${day.dateLabel}</strong>
      <i aria-hidden="true"><b style="height:${Math.round((day.completed / day.total) * 100)}%"></b></i>
      <small>${day.completed}/${day.total}</small>
    </div>`).join("");
}

// 渲染学习台上前六个阶段的快速入口。
function renderStagePreview() {
  document.getElementById("stage-preview-grid").innerHTML = stages.slice(0, 6).map((stage) => {
    const progress = getStageProgress(stage);
    const status = progress.percent === 100 ? "已完成" : stage.id === getCurrentStage().id ? "当前阶段" : "未开始";
    return `<button class="stage-mini-card ${progress.percent === 100 ? "is-complete" : ""} ${stage.id === getCurrentStage().id ? "is-current" : ""}" type="button" data-stage-jump="${stage.id}">
      <span class="stage-number">${String(stage.id).padStart(2, "0")}</span>
      <span class="stage-mini-copy">
        <span class="stage-mini-title"><strong>${escapeHTML(stage.title)}</strong><em>${status}</em></span>
        <small>${progress.completed} / ${progress.total} 节完成</small>
        <span class="stage-mini-progress" aria-hidden="true"><i style="width: ${progress.percent}%"></i></span>
      </span>
      <span aria-hidden="true">→</span>
    </button>`;
  }).join("");
}

// 渲染可展开的完整知识路线及课程完成状态。
function renderRoadmap() {
  const currentStage = getCurrentStage();
  const visibleStages = activeRoadmapMode === "current" ? [currentStage] : stages;
  document.querySelectorAll("[data-roadmap-mode]").forEach((button) => {
    const active = button.dataset.roadmapMode === activeRoadmapMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const visibleCount = document.getElementById("roadmap-visible-count");
  if (visibleCount) visibleCount.textContent = `${visibleStages.length} / ${stages.length} 阶段`;
  document.getElementById("roadmap-list").innerHTML = visibleStages.map((stage) => {
    const progress = getStageProgress(stage);
    const isCurrent = progress.percent < 100 && stages.slice(0, stage.id).every((item) => getStageProgress(item).percent === 100);
    const isComplete = progress.percent === 100;
    const status = isComplete ? "已完成" : isCurrent ? "当前阶段" : "待学习";
    const isOpen = activeRoadmapMode === "current" || stage.id === currentStage.id;
    return `<section class="roadmap-stage ${isOpen ? "is-open" : ""} ${isCurrent ? "is-current" : ""} ${isComplete ? "is-complete" : ""}" data-stage="${stage.id}">
      <button class="roadmap-stage-header" type="button" data-toggle-stage="${stage.id}" aria-expanded="${isOpen}">
        <span class="stage-number">${String(stage.id).padStart(2, "0")}</span>
        <span class="roadmap-stage-copy">
          <span class="roadmap-stage-title"><strong>${escapeHTML(stage.title)}</strong><em>${status}</em></span>
          <small>${escapeHTML(stage.subtitle)}</small>
          <span class="roadmap-stage-track" aria-hidden="true"><i style="width: ${progress.percent}%"></i></span>
        </span>
        <span class="stage-progress-label">${progress.completed} / ${progress.total} · ${progress.percent}%</span>
        <span class="stage-chevron" aria-hidden="true">›</span>
      </button>
      <div class="roadmap-lessons">
        ${stage.lessons.map((lesson) => `<button class="roadmap-lesson ${state.completedLessons.includes(lesson.id) ? "is-complete" : ""}" type="button" data-open-lesson="${lesson.id}">
          <span class="lesson-status" aria-hidden="true">${state.completedLessons.includes(lesson.id) ? "✓" : ""}</span>
          <strong>${escapeHTML(lesson.title)}</strong><small>${lesson.duration} 分钟</small>
        </button>`).join("")}
      </div>
    </section>`;
  }).join("");
}

function setRoadmapMode(mode) {
  if (!["current", "all"].includes(mode)) return;
  activeRoadmapMode = mode;
  renderRoadmap();
}

// 渲染课程库的阶段筛选按钮。
function renderFilters() {
  const filters = [{ id: "all", title: "全部" }, ...stages.map((stage) => ({ id: String(stage.id), title: stage.title }))];
  document.getElementById("library-filters").innerHTML = filters.map((filter) => `<button class="filter-button ${activeFilter === filter.id ? "is-active" : ""}" type="button" data-filter="${filter.id}">${escapeHTML(filter.title)}</button>`).join("");
}

function getFilteredLibraryLessons({ stageId = activeFilter, status = activeLibraryStatus, sort = activeLibrarySort } = {}) {
  const safeStageId = stageId === "all" || stages.some((stage) => String(stage.id) === String(stageId)) ? String(stageId) : "all";
  const safeStatus = ["all", "incomplete", "complete"].includes(status) ? status : "all";
  const safeSort = ["route", "duration-asc", "duration-desc"].includes(sort) ? sort : "route";
  const completed = new Set(state.completedLessons);
  const lessons = getAllLessons().map((lesson, routeIndex) => ({ lesson, routeIndex })).filter(({ lesson }) => {
    const stageMatched = safeStageId === "all" || String(lesson.stageId) === safeStageId;
    const isComplete = completed.has(lesson.id);
    const statusMatched = safeStatus === "all" || (safeStatus === "complete" ? isComplete : !isComplete);
    return stageMatched && statusMatched;
  });
  if (safeSort !== "route") {
    const direction = safeSort === "duration-asc" ? 1 : -1;
    lessons.sort((a, b) => ((a.lesson.duration - b.lesson.duration) * direction) || (a.routeIndex - b.routeIndex));
  }
  return lessons.map(({ lesson }) => lesson);
}

function formatLibraryDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes} 分钟`;
  return `${hours} 小时${minutes ? ` ${minutes} 分钟` : ""}`;
}

function renderLibraryControls(lessons) {
  const statusSelect = document.getElementById("library-status-filter");
  const sortSelect = document.getElementById("library-sort");
  if (statusSelect) statusSelect.value = activeLibraryStatus;
  if (sortSelect) sortSelect.value = activeLibrarySort;
  const count = document.getElementById("library-visible-count");
  if (count) count.textContent = `${lessons.length} / ${getAllLessons().length}`;
  const duration = document.getElementById("library-duration-summary");
  if (duration) duration.textContent = lessons.length ? `合计 ${formatLibraryDuration(lessons.reduce((sum, lesson) => sum + lesson.duration, 0))}` : "当前筛选无课程";
  const reset = document.getElementById("library-reset-filters");
  if (reset) reset.disabled = activeFilter === "all" && activeLibraryStatus === "all" && activeLibrarySort === "route";
}

function resetLibraryFilters() {
  activeFilter = "all";
  activeLibraryStatus = "all";
  activeLibrarySort = "route";
  renderFilters();
  renderLibrary();
}

// 根据阶段、完成状态和排序条件渲染课程卡片。
function renderLibrary() {
  const lessons = getFilteredLibraryLessons();
  renderLibraryControls(lessons);
  document.getElementById("course-grid").innerHTML = lessons.length ? lessons.map((lesson) => {
    const complete = state.completedLessons.includes(lesson.id);
    return `<article class="course-card tone-${lesson.stageId % 4} ${complete ? "is-complete" : ""}" data-open-lesson="${lesson.id}" tabindex="0" role="button" aria-label="打开课程：${escapeHTML(lesson.title)}">
      <div class="course-card-top"><span class="course-stage-chip">阶段 ${lesson.stageId}</span><span>${escapeHTML(lesson.level)}</span><span class="course-completion-status ${complete ? "is-complete" : ""}">${complete ? "已完成" : "未完成"}</span></div>
      <h2>${escapeHTML(lesson.title)}</h2>
      <p>${escapeHTML(lesson.summary)}</p>
      <div class="course-card-footer"><span>${lesson.duration} 分钟</span><strong>${complete ? "复习课程 →" : "打开课程 →"}</strong></div>
    </article>`;
  }).join("") : `<div class="library-empty-state">
    <span aria-hidden="true">⌕</span>
    <strong>当前筛选没有课程</strong>
    <p>可以切换阶段或完成状态，也可以恢复路线顺序。</p>
    <button type="button" data-reset-library-filters>重置筛选</button>
  </div>`;
}

// 按筛选词渲染术语卡片，输入仅用于比较而不会写入页面。
function renderGlossary(query = "") {
  const normalized = query.trim().toLowerCase();
  const legacyTerms = glossary.filter((term) => term.join(" ").toLowerCase().includes(normalized));
  const legacyNames = new Set(glossary.map((term) => term[0].toLowerCase()));
  const aiTerms = getAIFoundationData().terms.filter((term) => !legacyNames.has(term.nameZh.toLowerCase()) && getAITermSearchText(term).includes(normalized));
  const terms = [
    ...legacyTerms.map((term) => ({ kind: "legacy", term })),
    ...aiTerms.map((term) => ({ kind: "ai", term }))
  ];
  document.getElementById("glossary-grid").innerHTML = terms.length ? terms.map((entry) => {
    if (entry.kind === "ai") {
      const term = entry.term;
      return `<article class="term-card is-ai-term">
        <div class="term-name"><strong>${highlightSearchTerm(term.nameZh, query)}</strong>${term.nameEn !== term.nameZh ? `<code>${highlightSearchTerm(term.abbreviation || term.nameEn, query)}</code>` : ""}</div>
        <div class="term-definition"><p>${highlightSearchTerm(term.quickDefinition, query)}</p><small>${highlightSearchTerm(term.plainExplanation, query)}</small><button class="text-button" type="button" data-open-ai-term="${term.id}">查看完整解释与课程 →</button></div>
      </article>`;
    }
    const term = entry.term;
    const relatedLessons = getGlossaryRelatedAILessons(term);
    const relatedCopy = relatedLessons.length ? `<div class="term-related-lessons"><strong>相关 AI 课程</strong><div>${relatedLessons.map((lesson) => `<button type="button" data-open-ai-lesson="${lesson.id}"><span>${escapeHTML(lesson.number)}</span>${escapeHTML(lesson.title)}</button>`).join("")}</div></div>` : "";
    return `<article class="term-card">
      <div class="term-name"><strong>${escapeHTML(term[0])}</strong><code>${escapeHTML(term[1])}</code></div>
      <div class="term-definition"><p>${escapeHTML(term[2])}</p><small>${escapeHTML(term[3])}</small>${relatedCopy}</div>
    </article>`;
  }).join("") : `<div class="search-empty">没有匹配的术语</div>`;
}

function getExtensionSearchResults(query = "") {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return getAllExtensionCourses().filter((course) => {
    const { routeTitle, moduleTitle } = getExtensionCourseContext(course);
    const note = getExtensionState().extensionNotes[course.id]?.content || "";
    return [
      course.routeCode,
      routeTitle,
      moduleTitle,
      course.title,
      course.summary,
      course.why,
      course.example,
      course.practice,
      course.checkpoint,
      course.projectEvidence,
      course.references.join(" "),
      note
    ].join(" ").toLowerCase().includes(normalized);
  }).slice(0, 12);
}

function renderExtensionSearch(query = document.getElementById("extension-search-input")?.value || "") {
  const panel = document.getElementById("extension-search-results");
  if (!panel) return;
  const normalized = query.trim();
  const results = getExtensionSearchResults(normalized);
  panel.hidden = !normalized;
  if (!normalized) {
    panel.innerHTML = "";
    return;
  }
  panel.innerHTML = results.length ? results.map((course) => {
    const { routeTitle, moduleTitle } = getExtensionCourseContext(course);
    const complete = isExtensionCourseComplete(course.id);
    const note = getExtensionState().extensionNotes[course.id];
    return `<article class="extension-result-card ${complete ? "is-complete" : ""}">
      <div class="review-card-top">
        <span>${escapeHTML(routeTitle)} · ${escapeHTML(moduleTitle)}</span>
        <small>${complete ? "已完成" : "未完成"}${note?.content ? " · 有笔记" : ""}</small>
      </div>
      <h3>${escapeHTML(course.title)}</h3>
      <p>${escapeHTML(course.summary)}</p>
      <button class="text-button" type="button" data-open-extension-course="${course.id}">打开方向课程 <span aria-hidden="true">→</span></button>
    </article>`;
  }).join("") : `<div class="review-empty">
    <strong>没有匹配的方向课程</strong>
    <p>换一个关键词试试，例如方向名、模块名、练习任务或你写过的方向笔记。</p>
  </div>`;
}

// 渲染专业方向蓝图，让用户可以看到模块、项目和验收抓手。
function renderFutureRoutes() {
  const totalExtensionCourses = getAllExtensionCourses().length;
  const completedExtensionCourses = getExtensionCompletedCount();
  const extensionCompletedCount = document.getElementById("extension-completed-count");
  const extensionNoteCount = document.getElementById("extension-note-count");
  const extensionRouteStatus = document.getElementById("extension-route-status");
  if (extensionCompletedCount) extensionCompletedCount.textContent = `${completedExtensionCourses} / ${totalExtensionCourses}`;
  if (extensionNoteCount) extensionNoteCount.textContent = getExtensionNoteCount();
  const visibleRoutes = futureRoutes.filter((route) => activeFutureScope === "all" || getFutureScope(route.code) === activeFutureScope);
  const visibleCourseCount = visibleRoutes.reduce((sum, route) => sum + getExtensionCoursesByRoute(route.code).length, 0);
  if (extensionRouteStatus) extensionRouteStatus.textContent = activeFutureScope === "all" ? `共 ${totalExtensionCourses} 节课程` : `${visibleRoutes.length} 个子路线 · ${visibleCourseCount} 节课程`;
  document.querySelectorAll("[data-future-scope]").forEach((button) => {
    const active = button.dataset.futureScope === activeFutureScope;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  renderExtensionSearch();
  document.getElementById("future-route-grid").innerHTML = visibleRoutes.map((route) => {
    const routeCourseCount = getExtensionCoursesByRoute(route.code).length;
    const modules = route.modules.map((module, index) => {
      const moduleCourseCount = getExtensionCoursesByModule(route.code, index).length;
      const moduleCompletedCount = getExtensionCoursesByModule(route.code, index).filter((course) => isExtensionCourseComplete(course.id)).length;
      const moduleStatus = moduleCourseCount ? `${moduleCourseCount} 节课 · 完成 ${moduleCompletedCount}/${moduleCourseCount} →` : "打开模块概览 →";
      return `<li><button class="future-module-button ${moduleCourseCount ? "is-detailed" : ""}" type="button" data-open-extension="${escapeHTML(route.code)}" data-extension-index="${index}" aria-label="打开专业方向：${escapeHTML(route.title)} ${escapeHTML(module)}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${escapeHTML(module)}</strong>
      <small>${escapeHTML(moduleStatus)}</small>
    </button></li>`;
    }).join("");
    const projects = route.projects.map((project) => `<li>${escapeHTML(project)}</li>`).join("");
    const checks = route.checks.map((check) => `<li>${escapeHTML(check)}</li>`).join("");
    return `<article class="future-route-card tone-${route.tone}" aria-label="${escapeHTML(route.title)}，专业方向蓝图">
      <div class="future-route-top">
        <span class="future-route-icon" aria-hidden="true">${escapeHTML(route.code)}</span>
        <span class="future-status is-live"><i aria-hidden="true"></i>${routeCourseCount ? `${routeCourseCount} 节课程` : "课程准备中"}</span>
      </div>
      <h3>${escapeHTML(route.title)}</h3>
      <p>${escapeHTML(route.summary)}</p>
      <ul class="future-topic-list">${route.topics.map((topic) => `<li>${escapeHTML(topic)}</li>`).join("")}</ul>
      <div class="future-route-meta">
        <span><small>前置要求</small><strong>${escapeHTML(route.prerequisite)}</strong></span>
        <span><small>模块数量</small><strong>${route.modules.length} 个</strong></span>
        <span><small>方向课程</small><strong>${routeCourseCount || "准备中"}</strong></span>
      </div>
      <details class="future-route-detail">
        <summary>查看模块与项目</summary>
        <div class="future-route-detail-grid">
          <div>
            <h4>模块路径</h4>
            <ol class="future-module-list">${modules}</ol>
          </div>
          <div>
            <h4>建议项目</h4>
            <ul class="future-project-list">${projects}</ul>
            <h4>验收抓手</h4>
            <ul class="future-project-list">${checks}</ul>
          </div>
        </div>
      </details>
      <div class="future-route-lock future-route-open"><span aria-hidden="true">✓</span><strong>开始方向学习</strong></div>
    </article>`;
  }).join("");
}

function renderExtensionModule(routeCode, moduleIndex) {
  const module = getExtensionModule(routeCode, moduleIndex);
  if (!module) return;
  beginLessonContentRender();
  const { route, index, title } = module;
  const project = route.projects[index % route.projects.length];
  const moduleFlow = route.modules.map((item, itemIndex) => `${itemIndex === index ? "▶ " : "  "}${String(itemIndex + 1).padStart(2, "0")} ${item}`).join("\n");
  document.getElementById("lesson-stage-label").textContent = `专业方向 · ${route.title}`;
  document.getElementById("lesson-position-label").textContent = `${route.code} · 第 ${index + 1} / ${route.modules.length} 模块`;
  document.getElementById("lesson-position-bar").style.width = `${Math.round(((index + 1) / route.modules.length) * 100)}%`;
  document.getElementById("lesson-content").innerHTML = `
    <header class="lesson-heading extension-lesson-heading">
      <span class="section-kicker">方向模块</span>
      <h1 id="lesson-title">${escapeHTML(route.title)}：${escapeHTML(title)}</h1>
      <p>${escapeHTML(route.summary)}</p>
      <div class="lesson-meta"><span>前置 ${escapeHTML(route.prerequisite)}</span><span>${route.topics.map((topic) => escapeHTML(topic)).join(" · ")}</span><span>方向试炼</span></div>
    </header>
    <section class="lesson-section">
      <h2>为什么要学</h2>
      <div class="why-box"><strong>方向价值</strong><p>${escapeHTML(title)} 是 ${escapeHTML(route.title)} 的一段能力拼图，用来把主线知识转成可以展示的项目证据。</p></div>
    </section>
    <section class="lesson-section">
      <h2>你要掌握什么</h2>
      <ul>
        <li>能说明本模块和 ${escapeHTML(route.title)} 的关系。</li>
        <li>能把本模块产出连接到至少一个建议项目。</li>
        <li>能用验收抓手判断自己是否真的完成，而不是只看过概念。</li>
      </ul>
    </section>
    <section class="lesson-section">
      <h2>模块路径</h2>
      <pre class="lesson-code">${escapeHTML(moduleFlow)}</pre>
    </section>
    <section class="lesson-section">
      <h2>建议项目</h2>
      <div class="practice-box"><strong>项目任务</strong><p>${escapeHTML(project)}</p></div>
    </section>
    <section class="lesson-section">
      <h2>验收标准</h2>
      <div class="checkpoint-box"><strong>完成标志</strong><ul>${route.checks.map((check) => `<li>${escapeHTML(check)}</li>`).join("")}</ul></div>
    </section>
    `;
  document.getElementById("previous-lesson").disabled = index === 0;
  document.getElementById("previous-lesson").innerHTML = `<span aria-hidden="true">←</span> 上一模块`;
  document.getElementById("next-lesson").disabled = index === route.modules.length - 1;
  document.getElementById("next-lesson").innerHTML = `下一模块 <span aria-hidden="true">→</span>`;
  const completeButton = document.getElementById("complete-lesson");
  completeButton.textContent = "从下方课程开始学习";
  completeButton.classList.remove("is-complete");
  completeButton.classList.add("is-extension");
  completeButton.disabled = true;
  completeButton.title = "";
  finishLessonContentRender();
}

function renderPortfolioProject(projectId) {
  const project = getPortfolioProject(projectId);
  if (!project) return;
  beginLessonContentRender();
  const detail = project.execution || {};
  const starter = getPortfolioStarterKit(project);
  const routeProjects = getPortfolioProjects().filter((item) => item.routeCode === project.routeCode);
  const routeProjectIndex = routeProjects.findIndex((item) => item.id === project.id);
  const projectIndex = getPortfolioProjects().findIndex((item) => item.id === project.id);
  const previousProject = getPortfolioProjects()[projectIndex - 1];
  const nextProject = getPortfolioProjects()[projectIndex + 1];
  const requirementItems = detail.requirements || [];
  const fileTree = detail.fileTree || ["project/", "├─ README.md", "├─ src/", "└─ report.md"];
  const steps = detail.steps || [];
  const acceptance = detail.acceptance || [];
  const starterFileTree = starter.files.map((file) => file.path).join("\n");
  const courseList = project.suggestedCourses.slice(0, 8).map((course) => `<li><button class="inline-course-link" type="button" data-open-extension-course="${escapeHTML(course.id)}">${escapeHTML(course.routeCode)} · ${escapeHTML(course.title)}</button></li>`).join("");
  document.getElementById("lesson-stage-label").textContent = `项目作品集 · ${project.routeTitle}`;
  document.getElementById("lesson-position-label").textContent = `${project.number} · 第 ${projectIndex + 1} / ${getPortfolioProjects().length} 项`;
  document.getElementById("lesson-position-bar").style.width = `${Math.round(((projectIndex + 1) / getPortfolioProjects().length) * 100)}%`;
  document.getElementById("lesson-content").innerHTML = `
    <header class="lesson-heading extension-lesson-heading portfolio-project-heading">
      <span class="section-kicker">项目执行页 · ${escapeHTML(project.level)}</span>
      <div class="portfolio-project-title-row">
        <div>
          <h1 id="lesson-title">${escapeHTML(project.title)}</h1>
          <p>${escapeHTML(detail.requirement || project.summary)}</p>
        </div>
        ${renderPortfolioStatusTag(project.id)}
      </div>
      <div class="lesson-meta"><span>${escapeHTML(project.routeCode)} · ${escapeHTML(project.routeTitle)}</span><span>前置 ${escapeHTML(project.prerequisite)}</span><span>${escapeHTML(project.number)}</span></div>
      ${renderPortfolioStatusControls(project.id)}
    </header>
    <section class="lesson-section portfolio-project-section">
      <h2>需求说明</h2>
      <div class="why-box"><strong>项目目标</strong><p>${escapeHTML(detail.requirement || project.summary)}</p></div>
      <ul>${requirementItems.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
    </section>
    <section class="lesson-section portfolio-project-section">
      <h2>建议文件结构</h2>
      <pre class="lesson-code">${escapeHTML(fileTree.join("\n"))}</pre>
    </section>
    <section class="lesson-section portfolio-project-section">
      <h2>开发步骤</h2>
      <ol class="portfolio-step-list">${steps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHTML(step)}</p></li>`).join("")}</ol>
    </section>
    <section class="lesson-section portfolio-project-section">
      <h2>验收清单</h2>
      <div class="checkpoint-box"><strong>完成前逐项检查</strong><ul>${acceptance.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
    </section>
    <section class="lesson-section portfolio-project-section portfolio-template-panel">
      <div>
        <span class="section-kicker">项目文件</span>
        <h2>生成技术栈启动包</h2>
        <p>${escapeHTML(starter.stack)}；执行“${escapeHTML(starter.workflow.name)}”，包含真实启动代码、API/服务入口、契约检查、目录骨架、README 和验收清单。</p>
      </div>
      <div class="portfolio-template-actions">
        <button class="secondary-button is-primary-template" type="button" data-download-project-package="${escapeHTML(project.id)}"><span aria-hidden="true">▣</span> 启动代码包</button>
        <button class="secondary-button" type="button" data-download-project-verifier="${escapeHTML(project.id)}"><span aria-hidden="true">⌘</span> 验收脚本</button>
        <button class="secondary-button" type="button" data-download-project-readme="${escapeHTML(project.id)}"><span aria-hidden="true">↓</span> README 模板</button>
        <button class="secondary-button" type="button" data-download-project-acceptance="${escapeHTML(project.id)}"><span aria-hidden="true">✓</span> 验收清单</button>
      </div>
    </section>
    <section class="lesson-section portfolio-project-section">
      <h2>启动包目录</h2>
      <p class="reference-footnote">下载的初始化包会按以下路径生成文件；先运行 smoke test，再逐项替换 TODO。</p>
      <pre class="lesson-code portfolio-starter-file-tree">${escapeHTML(starterFileTree)}</pre>
    </section>
    <section class="lesson-section portfolio-project-section">
      <h2>交付物</h2>
      <ul>${project.evidence.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
    </section>
    <section class="lesson-section portfolio-project-section">
      <h2>推荐先补课程</h2>
      <div class="portfolio-project-course-grid">
        <ul>${courseList}</ul>
      </div>
      <p class="reference-footnote">点课程名会跳到对应方向课程；项目状态保留在作品集进度中。</p>
    </section>`;
  document.getElementById("previous-lesson").disabled = !previousProject;
  document.getElementById("previous-lesson").innerHTML = `<span aria-hidden="true">←</span> 上一项目`;
  document.getElementById("next-lesson").disabled = !nextProject;
  document.getElementById("next-lesson").innerHTML = `下一项目 <span aria-hidden="true">→</span>`;
  const completeButton = document.getElementById("complete-lesson");
  const currentStatus = getPortfolioProjectStatus(project.id);
  completeButton.textContent = currentStatus === "done" ? "项目已完成 · 点击改为进行中" : "标记项目已完成";
  completeButton.classList.toggle("is-complete", currentStatus === "done");
  completeButton.classList.add("is-extension");
  completeButton.disabled = false;
  completeButton.title = "";
  finishLessonContentRender();
}

function showLessonModal() {
  document.getElementById("drawer-backdrop").hidden = false;
  const drawer = document.getElementById("lesson-drawer");
  if (!drawer.classList.contains("is-open")) lastFocusedElement = document.activeElement;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => document.getElementById("close-lesson").focus(), 50);
}

// 打开指定课程的学习抽屉，并锁定页面背景滚动。
function openLesson(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return;
  activeLessonId = lessonId;
  activeExtensionModule = null;
  activeExtensionCourseId = null;
  activePortfolioProjectId = null;
  activeAILessonId = null;
  activeAIGuideId = null;
  activeAITermId = null;
  aiReaderReturnContext = null;
  renderLesson(lesson);
  showLessonModal();
}

function openAILesson(lessonId) {
  const lesson = getAILesson(lessonId);
  if (!lesson) return;
  activeLessonId = null; activeExtensionModule = null; activeExtensionCourseId = null; activePortfolioProjectId = null; activeAILessonId = lesson.id; activeAIGuideId = null; activeAITermId = null; aiReaderReturnContext = null;
  const progress = getAIProgress();
  progress.lastLessonId = lesson.id; progress.updatedAt = new Date().toISOString();
  saveState(false);
  renderAILesson(lesson);
  showLessonModal();
}

function openAIGuide(guideId) {
  const guide = getAIGuide(guideId);
  if (!guide) return;
  activeLessonId = null;
  activeExtensionModule = null;
  activeExtensionCourseId = null;
  activePortfolioProjectId = null;
  activeAILessonId = null;
  activeAITermId = null;
  activeAIGuideId = guide.id;
  aiReaderReturnContext = null;
  const progress = getAIProgress();
  progress.lastGuideId = guide.id;
  progress.updatedAt = new Date().toISOString();
  saveState(false);
  renderAIGuide(guide);
  showLessonModal();
}

function openAITerm(termId, returnContext = null) {
  const term = getAITerm(termId);
  if (!term) return;
  if (returnContext) aiReaderReturnContext = returnContext;
  else if (activeAILessonId) aiReaderReturnContext = { type: "lesson", id: activeAILessonId };
  else if (activeAIGuideId) aiReaderReturnContext = { type: "guide", id: activeAIGuideId };
  else if (activeAITermId && aiReaderReturnContext) aiReaderReturnContext = { ...aiReaderReturnContext };
  else aiReaderReturnContext = null;
  activeLessonId = null;
  activeExtensionModule = null;
  activeExtensionCourseId = null;
  activePortfolioProjectId = null;
  activeAILessonId = null;
  activeAIGuideId = null;
  activeAITermId = term.id;
  const progress = getAIProgress();
  progress.recentTermIds = [term.id, ...progress.recentTermIds.filter((id) => id !== term.id)].slice(0, 50);
  progress.updatedAt = new Date().toISOString();
  saveState(false);
  renderAITerm(term);
  showLessonModal();
}

function returnFromAITerm() {
  const target = aiReaderReturnContext;
  aiReaderReturnContext = null;
  if (target?.type === "guide") openAIGuide(target.id);
  else if (target?.type === "lesson") openAILesson(target.id);
}

function openExtensionModule(routeCode, moduleIndex) {
  const module = getExtensionModule(routeCode, Number(moduleIndex));
  if (!module) return;
  const moduleCourses = getExtensionCoursesByModule(routeCode, module.index);
  if (moduleCourses.length) {
    openExtensionCourse(moduleCourses[0].id);
    return;
  }
  activeLessonId = null;
  activeExtensionCourseId = null;
  activePortfolioProjectId = null;
  activeAILessonId = null;
  activeAIGuideId = null;
  activeAITermId = null;
  aiReaderReturnContext = null;
  activeExtensionModule = { routeCode, moduleIndex: module.index };
  renderExtensionModule(routeCode, module.index);
  showLessonModal();
}

function openExtensionCourse(courseId) {
  const course = getExtensionCourse(courseId);
  if (!course) return;
  activeLessonId = null;
  activeExtensionCourseId = course.id;
  activePortfolioProjectId = null;
  activeAILessonId = null;
  activeAIGuideId = null;
  activeAITermId = null;
  aiReaderReturnContext = null;
  activeExtensionModule = { routeCode: course.routeCode, moduleIndex: course.moduleIndex };
  renderExtensionCourse(course.id);
  showLessonModal();
}

function openPortfolioProject(projectId) {
  const project = getPortfolioProject(projectId);
  if (!project) return;
  activeLessonId = null;
  activeExtensionCourseId = null;
  activeExtensionModule = null;
  activeAILessonId = null;
  activeAIGuideId = null;
  activeAITermId = null;
  aiReaderReturnContext = null;
  activePortfolioProjectId = project.id;
  renderPortfolioProject(project.id);
  showLessonModal();
}

// 关闭课程抽屉并恢复页面滚动。
function closeLesson() {
  flushReadingPositionSave();
  renderRecentReading();
  renderedReadingKey = "";
  activeLessonTocSections = [];
  document.getElementById("drawer-backdrop").hidden = true;
  const drawer = document.getElementById("lesson-drawer");
  const wasOpen = drawer.classList.contains("is-open");
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeLessonId = null;
  activeExtensionCourseId = null;
  activeExtensionModule = null;
  activePortfolioProjectId = null;
  activeAILessonId = null;
  activeAIGuideId = null;
  activeAITermId = null;
  aiReaderReturnContext = null;
  if (wasOpen && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

// 将 Tab 键限制在打开的课程工作区内，关闭后由 closeLesson 恢复原焦点。
function trapLessonFocus(event) {
  if (event.key !== "Tab") return;
  const modal = document.getElementById("lesson-drawer");
  if (!modal.classList.contains("is-open")) return;
  const focusable = [...modal.querySelectorAll("button:not(:disabled), [href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex='-1'])")];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// 切换当前课程完成状态，并同步所有进度视图。
function toggleLessonComplete() {
  if (activeAITermId) { toggleAITermFavorite(activeAITermId); return; }
  if (activeAIGuideId) { toggleAIGuideComplete(activeAIGuideId); return; }
  if (activeAILessonId) { toggleAILessonComplete(activeAILessonId); return; }
  if (activePortfolioProjectId) {
    togglePortfolioProjectDone(activePortfolioProjectId);
    return;
  }
  if (activeExtensionCourseId) {
    toggleExtensionCourseComplete(activeExtensionCourseId);
    return;
  }
  if (activeExtensionModule) {
    showToast("请从下方选择一节方向课程");
    return;
  }
  if (!activeLessonId) return;
  const index = state.completedLessons.indexOf(activeLessonId);
  if (index >= 0) {
    state.completedLessons.splice(index, 1);
    showToast("已撤销课程完成状态");
  } else {
    state.completedLessons.push(activeLessonId);
    showToast("课程已完成，进度已保存在本机");
  }
  saveState(true);
  renderAll();
  renderLesson(getLesson(activeLessonId));
}

function toggleAILessonComplete(lessonId) {
  const lesson = getAILesson(lessonId);
  if (!lesson) return;
  const progress = getAIProgress();
  const index = progress.completedLessons.indexOf(lessonId);
  if (index >= 0) { progress.completedLessons.splice(index, 1); showToast("已撤销 AI 课程完成状态"); }
  else { progress.completedLessons.push(lessonId); showToast("AI 课程已完成"); }
  progress.updatedAt = new Date().toISOString(); saveState(true); renderAll(); renderAILesson(lesson);
}

function toggleAIGuideComplete(guideId) {
  const guide = getAIGuide(guideId);
  if (!guide) return;
  const progress = getAIProgress();
  const index = progress.completedGuides.indexOf(guideId);
  if (index >= 0) {
    progress.completedGuides.splice(index, 1);
    showToast("已撤销入门教程完成状态");
  } else {
    progress.completedGuides.push(guideId);
    showToast("入门教程已完成");
  }
  progress.updatedAt = new Date().toISOString();
  saveState(true);
  renderAll();
  renderAIGuide(guide);
}

function toggleAITermFavorite(termId) {
  const term = getAITerm(termId);
  if (!term) return;
  const progress = getAIProgress();
  const index = progress.favoriteTermIds.indexOf(term.id);
  if (index >= 0) {
    progress.favoriteTermIds.splice(index, 1);
    showToast("已取消术语收藏");
  } else {
    progress.favoriteTermIds.unshift(term.id);
    showToast("术语已收藏");
  }
  progress.updatedAt = new Date().toISOString();
  saveState(false);
  renderAIZone();
  if (activeAITermId === term.id) renderAITerm(term);
}

function togglePortfolioProjectDone(projectId) {
  const currentStatus = getPortfolioProjectStatus(projectId);
  setPortfolioProjectStatus(projectId, currentStatus === "done" ? "in-progress" : "done");
}

function toggleExtensionCourseComplete(courseId) {
  const course = getExtensionCourse(courseId);
  if (!course) return;
  const extensionState = getExtensionState();
  const index = extensionState.completedExtensionLessons.indexOf(courseId);
  if (index >= 0) {
    extensionState.completedExtensionLessons.splice(index, 1);
    showToast("已撤销完成状态");
  } else {
    extensionState.completedExtensionLessons.push(courseId);
    showToast("方向课程已完成");
  }
  saveState(true);
  renderAll();
  renderExtensionCourse(courseId);
}

// 打开当前课程的上一节或下一节。
function moveLesson(direction) {
  if (activeAITermId) {
    const terms = getAIFoundationData().terms;
    const index = terms.findIndex((term) => term.id === activeAITermId);
    const target = terms[index + direction];
    if (target) openAITerm(target.id, aiReaderReturnContext);
    return;
  }
  if (activeAIGuideId) {
    const guides = getAIFoundationData().guides;
    const index = guides.findIndex((guide) => guide.id === activeAIGuideId);
    const target = guides[index + direction];
    if (target) openAIGuide(target.id);
    return;
  }
  if (activeAILessonId) { const lessons = getAIData().lessons; const index = lessons.findIndex((lesson) => lesson.id === activeAILessonId); const target = lessons[index + direction]; if (target) openAILesson(target.id); return; }
  if (activePortfolioProjectId) {
    movePortfolioProject(direction);
    return;
  }
  if (activeExtensionModule) {
    moveExtensionModule(direction);
    return;
  }
  const lessons = getAllLessons();
  const index = lessons.findIndex((lesson) => lesson.id === activeLessonId);
  const target = lessons[index + direction];
  if (target) openLesson(target.id);
}

function moveExtensionModule(direction) {
  if (!activeExtensionModule) return;
  if (activeExtensionCourseId) {
    const routeCourses = getExtensionCoursesByRoute(activeExtensionModule.routeCode);
    const index = routeCourses.findIndex((course) => course.id === activeExtensionCourseId);
    const targetCourse = routeCourses[index + direction];
    if (targetCourse) openExtensionCourse(targetCourse.id);
    return;
  }
  const { routeCode, moduleIndex } = activeExtensionModule;
  const target = getExtensionModule(routeCode, moduleIndex + direction);
  if (target) openExtensionModule(routeCode, target.index);
}

function movePortfolioProject(direction) {
  const projects = getPortfolioProjects();
  const index = projects.findIndex((project) => project.id === activePortfolioProjectId);
  const target = projects[index + direction];
  if (target) openPortfolioProject(target.id);
}

// 切换当日练习项并更新活动记录。
function toggleTask(taskId, checked) {
  const today = getLocalDateKey();
  state.completedTasks[today] = state.completedTasks[today] || {};
  state.completedTasks[today][taskId] = checked;
  saveState(true);
  renderDailyTasks();
  renderProgress();
  if (checked) showToast("今日练习已记录");
}

function saveLessonNote(lessonId) {
  const lesson = getLesson(lessonId);
  const textarea = document.getElementById("lesson-note-text");
  const tags = normalizeNoteTags(document.getElementById("lesson-note-tags")?.value || "");
  if (!lesson || !textarea) return;
  const content = textarea.value.trim().slice(0, 12000);
  if (content) {
    state.lessonNotes[lessonId] = { content, tags, updatedAt: new Date().toISOString() };
    showToast("课程笔记已保存到本机");
  } else {
    delete state.lessonNotes[lessonId];
    showToast("空笔记已清除");
  }
  saveState(true);
  renderDataTools();
  renderStudyReview();
  renderLesson(lesson);
}

function getFutureScope(routeCode) {
  if (routeCode === "WEB") return "web";
  if (routeCode === "AI") return "ai";
  if (routeCode === "SEC") return "security";
  return "system";
}

function setFutureScope(scope) {
  if (!["all", "web", "ai", "security", "system"].includes(scope)) return;
  activeFutureScope = scope;
  renderFutureRoutes();
}

function saveLabEvidence(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson?.lab) return;
  const textarea = document.querySelector(`[data-lab-evidence-input="${lessonId}"]`);
  const statusInput = document.querySelector(`[data-lab-evidence-status="${lessonId}"]`);
  const summary = (textarea?.value || "").trim().slice(0, 3000);
  if (!summary) {
    delete state.practiceEvidence[lessonId];
    showToast("空实验记录已清除");
  } else {
    const status = ["done", "blocked", "rerun-needed"].includes(statusInput?.value) ? statusInput.value : "done";
    state.practiceEvidence[lessonId] = {
      status,
      summary,
      command: lesson.lab.command || "",
      updatedAt: new Date().toISOString()
    };
    showToast("实验结果已保存到学习证据");
  }
  saveState(true);
  renderDataTools();
  renderStudyReview();
  renderLesson(lesson);
}

function clearLabEvidence(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson?.lab) return;
  delete state.practiceEvidence[lessonId];
  saveState(false);
  renderDataTools();
  renderStudyReview();
  renderLesson(lesson);
  showToast("实验记录已清除");
}

function findPracticeRecordCard(practiceId) {
  return [...document.querySelectorAll("[data-practice-card]")].find((card) => card.dataset.practiceCard === practiceId) || null;
}

function appendPracticeAttempt(practiceId, status, assessment, checkedAt, verification = null) {
  state.practiceAttempts = Array.isArray(state.practiceAttempts) ? state.practiceAttempts : [];
  state.practiceAttempts.push({ practiceId, status, assessment, checkedAt, ...(verification ? { verification } : {}) });
  state.practiceAttempts = state.practiceAttempts.slice(-1000);
}

async function copyPracticeVerificationCommand(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson?.lab) return;
  const command = getPracticeVerificationRunnerCommand(lesson.id);
  try {
    await navigator.clipboard.writeText(command);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = command;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("验收命令已复制");
}

async function importPracticeVerificationFile(file, lessonId, practiceId) {
  const lesson = getLesson(lessonId);
  const practice = getLessonPractices(lesson).find((item) => item.id === practiceId);
  if (!file || !lesson || !practice) return;
  try {
    const artifact = JSON.parse(await file.text());
    const validation = validatePracticeVerificationArtifact(artifact, lesson, practice);
    if (!validation.ok) throw new Error(validation.errors[0] || "验收结果校验失败");
    const verification = validation.verification;
    const assessment = buildPracticeVerificationAssessment(verification);
    const status = verification.passed ? "done" : "blocked";
    const previous = state.practiceRecords?.[practiceId] || {};
    state.practiceRecords[practiceId] = {
      status,
      command: verification.command,
      output: verification.outputSummary,
      note: previous.note || "",
      checkedAt: verification.finishedAt,
      assessment,
      verification
    };
    appendPracticeAttempt(practiceId, status, assessment, verification.finishedAt, verification);
    saveState(true);
    renderDataTools();
    renderStudyReview();
    renderLesson(lesson);
    showToast(`真实验收结果已导入：${formatPracticeAssessmentLabel(assessment)}`);
  } catch (error) {
    showToast(`导入失败：${error.message}`);
  }
}

function savePracticeRecord(lessonId, practiceId) {
  const lesson = getLesson(lessonId);
  const practice = getLessonPractices(lesson).find((item) => item.id === practiceId);
  const card = findPracticeRecordCard(practiceId);
  if (!lesson || !practice || !card) return;
  const status = ["todo", "in-progress", "done", "blocked"].includes(card.querySelector("[data-practice-record-status]")?.value)
    ? card.querySelector("[data-practice-record-status]").value
    : "todo";
  const command = (card.querySelector("[data-practice-record-command]")?.value || "").trim().slice(0, 300);
  const output = (card.querySelector("[data-practice-record-output]")?.value || "").trim().slice(0, 2000);
  const note = (card.querySelector("[data-practice-record-note]")?.value || "").trim().slice(0, 3000);
  if (status === "todo" && !command && !output && !note) {
    delete state.practiceRecords[practiceId];
    showToast("空练习记录已清除");
  } else {
    const checkedAt = new Date().toISOString();
    const assessment = assessPracticeRecord(practice, { status, command, output, note }, checkedAt);
    const savedStatus = assessment.result === "passed" ? "done" : assessment.result === "failed" ? "blocked" : status === "todo" ? "in-progress" : status;
    state.practiceRecords[practiceId] = { status: savedStatus, command, output, note, checkedAt, assessment };
    appendPracticeAttempt(practiceId, savedStatus, assessment, checkedAt);
    showToast(`练习已保存：${formatPracticeAssessmentLabel(assessment)} · ${assessment.score} 分`);
  }
  saveState(true);
  renderDataTools();
  renderStudyReview();
  renderLesson(lesson);
}

function clearPracticeRecord(lessonId, practiceId) {
  const lesson = getLesson(lessonId);
  if (!lesson || !state.practiceRecords?.[practiceId]) return;
  delete state.practiceRecords[practiceId];
  saveState(false);
  renderDataTools();
  renderStudyReview();
  renderLesson(lesson);
  showToast("练习证据已清除");
}

function saveExtensionNote(courseId) {
  const course = getExtensionCourse(courseId);
  const textarea = document.getElementById("extension-note-text");
  if (!course || !textarea) return;
  const extensionState = getExtensionState();
  const content = textarea.value.trim().slice(0, 12000);
  const tags = normalizeNoteTags(document.getElementById("extension-note-tags")?.value || "");
  if (content) {
    extensionState.extensionNotes[courseId] = { content, tags, updatedAt: new Date().toISOString() };
    showToast("方向笔记已保存到本机");
  } else {
    delete extensionState.extensionNotes[courseId];
    showToast("空方向笔记已清除");
  }
  saveState(true);
  renderFutureRoutes();
  renderExtensionCourse(courseId);
}

function checkLessonQuiz(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return;
  const questions = buildLessonQuiz(lesson);
  const answers = questions.map((_, index) => {
    const selected = document.querySelector(`input[name="lesson-quiz-${index}"]:checked`);
    return selected ? Number(selected.value) : -1;
  });
  if (answers.includes(-1)) {
    showToast("先完成 3 道检查题，再提交答案");
    return;
  }
  const score = questions.reduce((sum, question, index) => sum + (answers[index] === question.answerIndex ? 1 : 0), 0);
  clearMistakeReviewForCourse("mainline", lessonId);
  state.quizResults[lessonId] = { answers, score, total: questions.length, checkedAt: new Date().toISOString() };
  saveState(true);
  renderProgress();
  renderDataTools();
  renderStudyReview();
  renderLesson(lesson);
  showToast(`知识检查完成：${score} / ${questions.length}`);
}

function resetLessonQuiz(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return;
  delete state.quizResults[lessonId];
  clearMistakeReviewForCourse("mainline", lessonId);
  saveState(false);
  renderProgress();
  renderDataTools();
  renderStudyReview();
  renderLesson(lesson);
  showToast("已重置本课知识检查");
}

// 提交扩展细课检查题，结果只保存在 extensionProgress.extensionQuizResults。
function checkExtensionCourseQuiz(courseId) {
  const course = getExtensionCourse(courseId);
  if (!course) return;
  const questions = buildExtensionCourseQuiz(course);
  const answers = questions.map((_, index) => {
    const selected = document.querySelector(`input[name="extension-quiz-${course.id}-${index}"]:checked`);
    return selected ? Number(selected.value) : -1;
  });
  if (answers.includes(-1)) {
    showToast("先完成 3 道方向检查题，再提交答案");
    return;
  }
  const score = questions.reduce((sum, question, index) => sum + (answers[index] === question.answerIndex ? 1 : 0), 0);
  const extensionState = getExtensionState();
  clearMistakeReviewForCourse("extension", courseId);
  extensionState.extensionQuizResults[courseId] = { answers, score, total: questions.length, checkedAt: new Date().toISOString() };
  saveState(true);
  renderFutureRoutes();
  renderStudyReview();
  renderExtensionCourse(courseId);
  showToast(`方向知识检查完成：${score} / ${questions.length}`);
}

// 清除指定扩展细课的检查结果，便于重新练习。
function resetExtensionCourseQuiz(courseId) {
  const course = getExtensionCourse(courseId);
  if (!course) return;
  const extensionState = getExtensionState();
  delete extensionState.extensionQuizResults[courseId];
  clearMistakeReviewForCourse("extension", courseId);
  saveState(false);
  renderFutureRoutes();
  renderStudyReview();
  renderExtensionCourse(courseId);
  showToast("已重置本课知识检查");
}

function saveAINote(lessonId) {
  const lesson = getAILesson(lessonId);
  const textarea = document.getElementById("ai-note-text");
  if (!lesson || !textarea) return;
  const progress = getAIProgress();
  const content = textarea.value.trim().slice(0, 12000);
  const tags = normalizeNoteTags(document.getElementById("ai-note-tags")?.value || "");
  if (content) { progress.lessonNotes[lessonId] = { content, tags, updatedAt: new Date().toISOString() }; showToast("AI 课程笔记已保存"); }
  else { delete progress.lessonNotes[lessonId]; showToast("空笔记已清除"); }
  progress.updatedAt = new Date().toISOString(); saveState(true); renderStudyReview(); renderAIZone(); renderAILesson(lesson);
}

function saveAIGuideNote(guideId) {
  const guide = getAIGuide(guideId);
  const textarea = document.getElementById("ai-guide-note-text");
  if (!guide || !textarea) return;
  const progress = getAIProgress();
  const content = textarea.value.trim().slice(0, 12000);
  const tags = normalizeNoteTags(document.getElementById("ai-guide-note-tags")?.value || "");
  if (content) {
    progress.guideNotes[guide.id] = { content, tags, updatedAt: new Date().toISOString() };
    showToast("入门笔记已保存");
  } else {
    delete progress.guideNotes[guide.id];
    showToast("空入门笔记已清除");
  }
  progress.updatedAt = new Date().toISOString();
  saveState(true);
  renderStudyReview();
  renderAIZone();
  renderAIGuide(guide);
}

function checkAIGuideQuiz(guideId) {
  const guide = getAIGuide(guideId);
  if (!guide) return;
  const answers = guide.quiz.map((_, index) => {
    const selected = document.querySelector(`input[name="ai-guide-quiz-${guide.id}-${index}"]:checked`);
    return selected ? Number(selected.value) : -1;
  });
  if (answers.includes(-1)) {
    showToast("先完成 3 道即时检查题");
    return;
  }
  const score = guide.quiz.reduce((sum, question, index) => sum + Number(answers[index] === question.answer), 0);
  guide.quiz.forEach((question, index) => {
    const fieldset = document.querySelector(`[data-ai-guide-quiz="${guide.id}"] .quiz-card:nth-child(${index + 1})`);
    fieldset?.querySelectorAll(".quiz-option").forEach((option, optionIndex) => {
      option.classList.toggle("is-answer", optionIndex === question.answer);
      option.classList.toggle("is-miss", optionIndex === answers[index] && answers[index] !== question.answer);
    });
    const explanation = document.querySelector(`[data-ai-guide-explain="${index}"]`);
    if (explanation) explanation.hidden = false;
  });
  const scoreNode = document.querySelector("[data-ai-guide-score]");
  if (scoreNode) {
    scoreNode.textContent = `本次得分 ${score} / 3`;
    scoreNode.classList.add("is-checked");
  }
  showToast(`即时检查完成：${score} / 3`);
}

function runAIGuideExercise(guideId) {
  const guide = getAIGuide(guideId);
  const input = document.querySelector(`[data-ai-guide-exercise-input="${guideId}"]`);
  const output = document.querySelector(`[data-ai-guide-exercise-output="${guideId}"]`);
  if (!guide || !input || !output) return;
  const answer = input.value.trim();
  const rules = guide.exerciseRules || {};
  const requiredAny = Array.isArray(rules.requiredAny) ? rules.requiredAny.filter(Boolean) : [];
  const matchedTerms = requiredAny.filter((term) => answer.toLowerCase().includes(String(term).toLowerCase()));
  const requiredCount = Math.max(1, Number(rules.requiredCount) || 1);
  const minimumLength = Math.max(8, Number(rules.minLength) || 20);
  const hasSpecificEvidence = requiredAny.length
    ? matchedTerms.length >= Math.min(requiredCount, requiredAny.length)
    : /输入|输出|步骤|数据|指标|结果|错误|边界|条件|版本|权限|模型|样本/.test(answer);
  const passed = answer.length >= minimumLength && hasSpecificEvidence;
  output.hidden = false;
  output.classList.toggle("is-pass", passed);
  output.innerHTML = passed
    ? `<strong>记录已达到入门验收线</strong><p>${escapeHTML(guide.expected)}</p>`
    : `<strong>再补一层专属证据</strong><p>至少写 ${minimumLength} 个字，并明确包含 ${escapeHTML(requiredAny.slice(0, 4).join("、") || "输入、步骤、输出或边界")} 中的 ${Math.min(requiredCount, requiredAny.length || 1)} 项。参考完成标志：${escapeHTML(guide.expected)}</p>`;
}

function checkAIQuiz(lessonId) {
  const lesson = getAILesson(lessonId);
  if (!lesson) return;
  const answers = lesson.quiz.map((_, index) => { const selected = document.querySelector(`input[name="ai-quiz-${lessonId}-${index}"]:checked`); return selected ? Number(selected.value) : -1; });
  if (answers.includes(-1)) { showToast("先完成 6 道检查题，再提交答案"); return; }
  const score = lesson.quiz.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0);
  clearMistakeReviewForCourse("ai-zone", lessonId);
  getAIProgress().quizResults[lessonId] = { answers, score, total: 6, checkedAt: new Date().toISOString() };
  getAIProgress().updatedAt = new Date().toISOString(); saveState(true); renderStudyReview(); renderAIZone(); renderAILesson(lesson); showToast(`AI 知识检查完成：${score} / 6`);
}

function resetAIQuiz(lessonId) {
  const lesson = getAILesson(lessonId);
  if (!lesson) return;
  delete getAIProgress().quizResults[lessonId]; clearMistakeReviewForCourse("ai-zone", lessonId); saveState(false); renderStudyReview(); renderAIZone(); renderAILesson(lesson); showToast("已重置 AI 知识检查");
}

function runAILab(labId) {
  const lab = getAILab(labId);
  const card = document.querySelector(`[data-ai-lab-card="${labId}"]`);
  if (!lab || !card) return;
  const config = Object.fromEntries([...card.querySelectorAll("[data-ai-lab-input]")].map((input) => [
    input.dataset.aiLabInput,
    input.dataset.aiLabValueType === "text" ? input.value : Number(input.value)
  ]));
  try {
    const result = lab.run(config);
    const summary = typeof lab.formatResult === "function" ? lab.formatResult(result) : labId === "ai-lab-gradient-step"
      ? [`旧参数 w = ${result.oldWeight}`, `预测 = ${result.prediction}，旧损失 = ${result.loss}`, `梯度 = ${result.gradient}`, `新参数 w = ${Number(result.newWeight.toFixed(6))}`, `新预测 = ${Number(result.newPrediction.toFixed(6))}，新损失 = ${Number(result.newLoss.toFixed(6))}`, `验收：${result.improved ? "本次更新使损失下降" : "本次更新未使损失下降，请检查学习率"}`].join("\n")
      : ["文本 | 规则输出 | 统计输出 | 分数", ...result.map((row) => `${row.text} | ${row.rule} | ${row.model} | ${row.score}`), `\n不一致样本：${result.filter((row) => row.rule !== row.model).length} 条`].join("\n");
    const passed = labId === "ai-lab-gradient-step" ? result.improved : labId === "ai-lab-rules-vs-learning" ? Array.isArray(result) && result.length === 4 : Boolean(summary && summary.length > 20);
    getAIProgress().labResults[labId] = { ranAt: new Date().toISOString(), passed, summary };
    getAIProgress().updatedAt = new Date().toISOString(); saveState(true);
    const output = card.querySelector(`[data-ai-lab-output="${labId}"]`); if (output) output.textContent = summary;
    card.querySelector(".ai-status").textContent = "已运行"; showToast("实验已运行，结果已记录");
  } catch (error) { console.warn("AI 实验运行失败", error); showToast("实验输入有误，请检查后重试"); }
}

function exportLearningData() {
  flushReadingPositionSave();
  const exportedAt = new Date().toISOString();
  const payloadState = normalizeState({ ...state, lastExportedAt: exportedAt });
  const payload = {
    app: "computer-learning-map",
    version: 15,
    storageKey: STORAGE_KEY,
    exportedAt,
    state: payloadState
  };
  downloadBlob(
    `计算机学习地图-学习数据-${exportedAt.slice(0, 10)}.json`,
    new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
  );
  state.lastExportedAt = exportedAt;
  saveState(false);
  renderDataTools();
  showToast("学习数据导出文件已生成");
}

function requestLearningDataImport() {
  document.getElementById("import-progress-file").click();
}

function importLearningData(file) {
  if (!file) return;
  if (file.size > 1024 * 1024) {
    showToast("导入失败：学习数据文件超过 1MB，请检查是否选错文件");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      const importedState = normalizeState(parsed?.state || parsed);
      const importedPortfolioProgress = Object.values(importedState.portfolioProgress).filter((item) => item.status && item.status !== "not-started").length;
      const importedReadingPositions = Object.keys(importedState.readingPositions).length;
      const summary = [
        `${importedState.completedLessons.length} 节已完成课程`,
        `${countCompletedTaskEntries(importedState)} 项每日任务`,
        `${Object.keys(importedState.quizResults).length} 节知识检查`,
        `${Object.keys(importedState.reviewedMistakes).length} 道已复习错题`,
        `${Object.keys(importedState.lessonNotes).length} 节课程笔记`,
        `${Object.keys(importedState.practiceEvidence).length} 条实验证据`,
        `${Object.keys(importedState.practiceRecords).length} 条逐练习证据`,
        `${importedState.extensionProgress.completedExtensionLessons.length} 节方向课程`,
        `${Object.keys(importedState.extensionProgress.extensionNotes).length} 篇方向笔记`,
        `${Object.keys(importedState.extensionProgress.extensionQuizResults).length} 节方向知识检查`,
        `${importedState.aiZoneProgress.completedLessons.length} 节 AI 课程`,
        `${importedState.aiZoneProgress.completedGuides.length} 篇 AI 入门教程`,
        `${Object.keys(importedState.aiZoneProgress.lessonNotes).length} 篇 AI 笔记`,
        `${Object.keys(importedState.aiZoneProgress.guideNotes).length} 篇 AI 入门笔记`,
        `${Object.keys(importedState.aiZoneProgress.quizResults).length} 节 AI 知识检查`,
        `${Object.keys(importedState.aiZoneProgress.labResults).length} 个 AI 实验`,
        `${importedState.aiZoneProgress.favoriteTermIds.length} 条收藏术语`,
        `${importedPortfolioProgress} 个作品集项目状态`,
        `${importedReadingPositions} 节阅读断点`
      ].join("、");
      const allowed = window.confirm(`导入会覆盖当前浏览器中的学习数据。\n将导入：${summary}\n是否继续？`);
      if (!allowed) return;
      cancelReadingPositionSave();
      renderedReadingKey = "";
      state = importedState;
      saveState(false);
      renderAll();
      if (activeLessonId) renderLesson(getLesson(activeLessonId));
      else if (activeExtensionCourseId) renderExtensionCourse(activeExtensionCourseId);
      else if (activePortfolioProjectId) renderPortfolioProject(activePortfolioProjectId);
      else if (activeAILessonId) renderAILesson(getAILesson(activeAILessonId));
      else if (activeAIGuideId) renderAIGuide(getAIGuide(activeAIGuideId));
      else if (activeAITermId) renderAITerm(getAITerm(activeAITermId));
      else if (activeExtensionModule) renderExtensionModule(activeExtensionModule.routeCode, activeExtensionModule.moduleIndex);
      showToast("学习数据已导入");
    } catch (error) {
      console.warn("学习数据导入失败", error);
      showToast("导入失败：请选择有效的 JSON 数据文件");
    }
  });
  reader.readAsText(file, "utf-8");
}

// 在顶部搜索框中同时检索课程和术语。
function searchGlobal(query) {
  const panel = document.getElementById("search-results");
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    panel.hidden = true;
    return;
  }
  const lessonResults = getAllLessons().filter((lesson) => getLessonSearchText(lesson).includes(normalized)).slice(0, 6);
  const aiResults = getAIData().lessons.filter((lesson) => [lesson.number, lesson.title, lesson.summary, ...lesson.objectives, ...lesson.concepts.flat()].join(" ").toLowerCase().includes(normalized)).slice(0, 5);
  const guideResults = getAIFoundationData().guides.filter((guide) => [guide.number, guide.title, guide.question, guide.quickView, ...guide.objectives].join(" ").toLowerCase().includes(normalized)).slice(0, 4);
  const aiTermResults = getAIFoundationData().terms.filter((term) => getAITermSearchText(term).includes(normalized))
    .sort((a, b) => Number([b.nameZh, b.nameEn, b.abbreviation, ...b.aliases].some((value) => value?.toLowerCase() === normalized)) - Number([a.nameZh, a.nameEn, a.abbreviation, ...a.aliases].some((value) => value?.toLowerCase() === normalized)) || a.order - b.order)
    .slice(0, 5);
  const aiTermNames = new Set(aiTermResults.map((term) => term.nameZh.toLowerCase()));
  const termResults = glossary.filter((term) => term.join(" ").toLowerCase().includes(normalized) && !aiTermNames.has(term[0].toLowerCase())).slice(0, 3);
  const html = [
    ...lessonResults.map((lesson) => `<button class="search-result" type="button" data-open-lesson="${lesson.id}"><span><strong>${escapeHTML(lesson.title)}</strong><small>课程 · 阶段 ${lesson.stageId} ${escapeHTML(lesson.stageTitle)}</small></span><span aria-hidden="true">→</span></button>`),
    ...aiResults.map((lesson) => `<button class="search-result" type="button" data-open-ai-lesson="${lesson.id}"><span><strong>${escapeHTML(lesson.title)}</strong><small>AI 专区 · ${escapeHTML(lesson.number)}</small></span><span aria-hidden="true">→</span></button>`),
    ...guideResults.map((guide) => `<button class="search-result" type="button" data-open-ai-guide="${guide.id}"><span><strong>${escapeHTML(guide.title)}</strong><small>AI 入门 · ${escapeHTML(guide.number)}</small></span><span aria-hidden="true">→</span></button>`),
    ...aiTermResults.map((term) => `<button class="search-result" type="button" data-open-ai-term="${term.id}"><span><strong>${escapeHTML(term.nameZh)}${term.abbreviation ? ` · ${escapeHTML(term.abbreviation)}` : ""}</strong><small>AI 术语 · ${escapeHTML(term.quickDefinition)}</small></span><span aria-hidden="true">→</span></button>`),
    ...termResults.map((term) => `<button class="search-result" type="button" data-term-result="${escapeHTML(term[0])}"><span><strong>${escapeHTML(term[0])} · ${escapeHTML(term[1])}</strong><small>术语 · ${escapeHTML(term[2])}</small></span><span aria-hidden="true">→</span></button>`)
  ].join("");
  panel.innerHTML = html || `<div class="search-empty">没有找到相关课程或术语</div>`;
  panel.hidden = false;
}

// 显示短暂状态提示，并避免多次提示互相覆盖。
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

let pwaRegistration = null;

function setPWAStatus(message, level = "idle") {
  const element = document.getElementById("pwa-status");
  if (!element) return;
  element.className = `pwa-status is-${level}`;
  element.textContent = message;
}

async function clearOfflineCache() {
  if (!window.isSecureContext || !("caches" in window)) {
    setPWAStatus("当前打开方式不支持离线缓存", "idle");
    return;
  }
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key.startsWith("computer-learning-map-")).map((key) => caches.delete(key)));
  setPWAStatus("离线缓存已清理，下次联网打开时会重新建立", "current");
  showToast("离线缓存已清理");
}

async function setupPWA() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    setPWAStatus("当前打开方式不支持离线缓存", "idle");
    return;
  }
  try {
    pwaRegistration = await navigator.serviceWorker.register("sw.js", { updateViaCache: "none" });
    setPWAStatus(pwaRegistration.waiting ? "有可用更新，刷新后生效" : "离线缓存已启用", pwaRegistration.waiting ? "due" : "current");
    pwaRegistration.addEventListener("updatefound", () => {
      const worker = pwaRegistration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) setPWAStatus("有可用更新，刷新后生效", "due");
      });
    });
  } catch (error) {
    console.warn("离线缓存注册失败", error);
    setPWAStatus("离线缓存暂不可用", "due");
  }
}

// 重新渲染所有依赖学习状态的区域。
function renderAll() {
  renderProgress();
  renderDataTools();
  renderStudyReview();
  renderNextLesson();
  renderDailyTasks();
  renderStagePreview();
  renderRoadmap();
  renderFilters();
  renderLibrary();
  renderGlossary(document.getElementById("glossary-search")?.value || "");
  renderAIZone();
  renderFutureRoutes();
  renderPortfolioProjects();
  renderResourceIndex();
}

// 注册页面级事件委托、键盘快捷键和输入事件。
function bindEvents() {
  document.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-view]");
    const viewButton = event.target.closest("[data-go-view]");
    const lessonButton = event.target.closest("[data-open-lesson]");
    const extensionButton = event.target.closest("[data-open-extension]");
    const extensionCourseButton = event.target.closest("[data-open-extension-course]");
    const aiLessonButton = event.target.closest("[data-open-ai-lesson]");
    const aiGuideButton = event.target.closest("[data-open-ai-guide]");
    const aiTermButton = event.target.closest("[data-open-ai-term]");
    const aiTermFavoriteButton = event.target.closest("[data-toggle-ai-term-favorite]");
    const aiReaderReturnButton = event.target.closest("[data-return-ai-reader]");
    const aiPaperOpenButton = event.target.closest("[data-open-ai-paper]");
    const aiTabButton = event.target.closest("[data-ai-tab]");
    const aiModuleButton = event.target.closest("[data-ai-module]");
    const aiLabButton = event.target.closest("[data-run-ai-lab]");
    const aiLabOpenButton = event.target.closest("[data-open-ai-lab]");
    const aiAnatomyModeButton = event.target.closest("[data-ai-anatomy-mode]");
    const aiAnatomyStepButton = event.target.closest("[data-ai-anatomy-step]");
    const aiAnatomyMoveButton = event.target.closest("[data-ai-anatomy-move]");
    const aiPaperStatusButton = event.target.closest("[data-ai-paper-status]");
    const aiGovernanceStageButton = event.target.closest("[data-ai-governance-stage]");
    const aiQuizCheck = event.target.closest("[data-check-ai-quiz]");
    const aiQuizReset = event.target.closest("[data-reset-ai-quiz]");
    const aiNoteSave = event.target.closest("[data-save-ai-note]");
    const aiGuideNoteSave = event.target.closest("[data-save-ai-guide-note]");
    const aiGuideQuizCheck = event.target.closest("[data-check-ai-guide-quiz]");
    const aiGuideExerciseRun = event.target.closest("[data-run-ai-guide-exercise]");
    const stageToggle = event.target.closest("[data-toggle-stage]");
    const stageJump = event.target.closest("[data-stage-jump]");
    const filterButton = event.target.closest("[data-filter]");
    const libraryResetButton = event.target.closest("[data-reset-library-filters]");
    const termResult = event.target.closest("[data-term-result]");
    const quizCheck = event.target.closest("[data-check-quiz]");
    const quizReset = event.target.closest("[data-reset-quiz]");
    const extensionQuizCheck = event.target.closest("[data-check-extension-quiz]");
    const extensionQuizReset = event.target.closest("[data-reset-extension-quiz]");
    const noteSave = event.target.closest("[data-save-note]");
    const labEvidenceSave = event.target.closest("[data-save-lab-evidence]");
    const labEvidenceClear = event.target.closest("[data-clear-lab-evidence]");
    const practiceRecordSave = event.target.closest("[data-save-practice-record]");
    const practiceRecordClear = event.target.closest("[data-clear-practice-record]");
    const practiceVerificationCopy = event.target.closest("[data-copy-practice-verification]");
    const extensionNoteSave = event.target.closest("[data-save-extension-note]");
    const referenceProviderButton = event.target.closest("[data-reference-provider]");
    const resourceRouteButton = event.target.closest("[data-resource-route]");
    const resourceProviderButton = event.target.closest("[data-resource-provider]");
    const portfolioRouteButton = event.target.closest("[data-portfolio-route]");
    const portfolioStatusButton = event.target.closest("[data-portfolio-status]");
    const portfolioProjectButton = event.target.closest("[data-open-portfolio-project]");
    const operationStepButton = event.target.closest("[data-operation-step]");
    const projectReadmeButton = event.target.closest("[data-download-project-readme]");
    const projectAcceptanceButton = event.target.closest("[data-download-project-acceptance]");
    const projectPackageButton = event.target.closest("[data-download-project-package]");
    const projectVerifierButton = event.target.closest("[data-download-project-verifier]");
    const mistakeReviewButton = event.target.closest("[data-toggle-mistake-review]");
    const noteTagActionButton = event.target.closest("[data-note-tag-action]");
    const noteTagPickButton = event.target.closest("[data-note-tag-pick]");
    const lessonTocButton = event.target.closest("[data-lesson-section]");
    const lessonTopButton = event.target.closest("[data-lesson-top]");
    const clearReadingPositionButton = event.target.closest("[data-clear-reading-position]");
    const openReadingPositionButton = event.target.closest("[data-open-reading-position]");
    const clearReadingEntryButton = event.target.closest("[data-clear-reading-entry]");
    const readingKindFilterButton = event.target.closest("[data-reading-kind-filter]");
    const roadmapModeButton = event.target.closest("[data-roadmap-mode]");
    const futureScopeButton = event.target.closest("[data-future-scope]");

    if (!event.target.closest(".search-wrap")) document.getElementById("search-results").hidden = true;
    if (!event.target.closest(".future-search")) document.getElementById("extension-search-results").hidden = true;

    if (navButton) switchView(navButton.dataset.view);
    if (viewButton) switchView(viewButton.dataset.goView);
    if (lessonButton) {
      openLesson(lessonButton.dataset.openLesson);
      document.getElementById("search-results").hidden = true;
    }
    if (extensionButton) {
      openExtensionModule(extensionButton.dataset.openExtension, Number(extensionButton.dataset.extensionIndex));
    }
    if (extensionCourseButton) {
      openExtensionCourse(extensionCourseButton.dataset.openExtensionCourse);
      document.getElementById("extension-search-results").hidden = true;
    }
    if (aiLessonButton) { openAILesson(aiLessonButton.dataset.openAiLesson); document.getElementById("search-results").hidden = true; }
    if (aiGuideButton) { openAIGuide(aiGuideButton.dataset.openAiGuide); document.getElementById("search-results").hidden = true; }
    if (aiTermButton) { openAITerm(aiTermButton.dataset.openAiTerm); document.getElementById("search-results").hidden = true; }
    if (aiTermFavoriteButton) toggleAITermFavorite(aiTermFavoriteButton.dataset.toggleAiTermFavorite);
    if (aiReaderReturnButton) returnFromAITerm();
    if (aiPaperOpenButton) openAIPaper(aiPaperOpenButton.dataset.openAiPaper);
    if (aiTabButton) setAITab(aiTabButton.dataset.aiTab);
    if (aiModuleButton) { activeAIModule = aiModuleButton.dataset.aiModule; setAITab("courses"); }
    if (aiLabButton) runAILab(aiLabButton.dataset.runAiLab);
    if (aiLabOpenButton) { closeLesson(); switchView("ai"); setAITab("labs"); requestAnimationFrame(() => document.querySelector(`[data-ai-lab-card="${aiLabOpenButton.dataset.openAiLab}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" })); }
    if (aiAnatomyModeButton) {
      activeAIAnatomyMode = aiAnatomyModeButton.dataset.aiAnatomyMode;
      activeAIAnatomyStep = 0;
      renderAIZone();
    }
    if (aiAnatomyStepButton) {
      activeAIAnatomyStep = Number(aiAnatomyStepButton.dataset.aiAnatomyStep) || 0;
      renderAIZone();
    }
    if (aiAnatomyMoveButton) {
      const mode = (getAIData().anatomyModes || []).find((item) => item.id === activeAIAnatomyMode);
      activeAIAnatomyStep = Math.max(0, Math.min((mode?.steps.length || 1) - 1, activeAIAnatomyStep + Number(aiAnatomyMoveButton.dataset.aiAnatomyMove)));
      renderAIZone();
    }
    if (aiPaperStatusButton) setAIPaperStatus(aiPaperStatusButton.dataset.aiPaperStatus, aiPaperStatusButton.dataset.aiPaperValue);
    if (aiGovernanceStageButton) {
      activeAIGovernanceStage = aiGovernanceStageButton.dataset.aiGovernanceStage;
      renderAIZone();
    }
    if (aiQuizCheck) checkAIQuiz(aiQuizCheck.dataset.checkAiQuiz);
    if (aiQuizReset) resetAIQuiz(aiQuizReset.dataset.resetAiQuiz);
    if (aiNoteSave) saveAINote(aiNoteSave.dataset.saveAiNote);
    if (aiGuideNoteSave) saveAIGuideNote(aiGuideNoteSave.dataset.saveAiGuideNote);
    if (aiGuideQuizCheck) checkAIGuideQuiz(aiGuideQuizCheck.dataset.checkAiGuideQuiz);
    if (aiGuideExerciseRun) runAIGuideExercise(aiGuideExerciseRun.dataset.runAiGuideExercise);
    if (portfolioProjectButton) {
      openPortfolioProject(portfolioProjectButton.dataset.openPortfolioProject);
    }
    if (operationStepButton) {
      const guide = operationStepButton.closest(".operation-guide");
      const step = operationStepButton.dataset.operationStep;
      guide.querySelectorAll("[data-operation-step]").forEach((button) => {
        const active = button.dataset.operationStep === step;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      guide.querySelectorAll("[data-operation-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.operationPanel !== step;
      });
      guide.querySelectorAll("[data-operation-steps]").forEach((line) => {
        line.classList.toggle("is-active", line.dataset.operationSteps.split(" ").includes(step));
      });
    }
    if (projectReadmeButton) downloadPortfolioTemplate(projectReadmeButton.dataset.downloadProjectReadme, "readme");
    if (projectAcceptanceButton) downloadPortfolioTemplate(projectAcceptanceButton.dataset.downloadProjectAcceptance, "acceptance");
    if (projectPackageButton) downloadPortfolioInitializer(projectPackageButton.dataset.downloadProjectPackage);
    if (projectVerifierButton) downloadPortfolioVerifier(projectVerifierButton.dataset.downloadProjectVerifier);
    if (mistakeReviewButton) toggleMistakeReviewed(mistakeReviewButton.dataset.toggleMistakeReview);
    if (noteTagActionButton) {
      if (noteTagActionButton.dataset.noteTagAction === "select") {
        const source = document.getElementById("note-tag-source")?.value || "";
        const count = selectNotesByTag(source);
        showToast(count ? `已选择 ${count} 篇带有该标签的笔记` : "没有找到该标签的笔记");
      }
      if (noteTagActionButton.dataset.noteTagAction === "rename") handleNoteTagRename();
      if (noteTagActionButton.dataset.noteTagAction === "merge") handleNoteTagMerge();
      if (noteTagActionButton.dataset.noteTagAction === "remove") handleNoteTagRemove();
    }
    if (noteTagPickButton) {
      const source = document.getElementById("note-tag-source");
      if (source) source.value = noteTagPickButton.dataset.noteTagPick;
    }
    if (lessonTocButton) scrollToLessonSection(lessonTocButton.dataset.lessonSection);
    if (lessonTopButton) scrollLessonToTop();
    if (clearReadingPositionButton) clearCurrentReadingPosition();
    if (openReadingPositionButton) openReadingPosition(openReadingPositionButton.dataset.openReadingPosition);
    if (clearReadingEntryButton) clearReadingPositionEntry(clearReadingEntryButton.dataset.clearReadingEntry);
    if (readingKindFilterButton) setReadingKindFilter(readingKindFilterButton.dataset.readingKindFilter);
    if (roadmapModeButton) setRoadmapMode(roadmapModeButton.dataset.roadmapMode);
    if (futureScopeButton) setFutureScope(futureScopeButton.dataset.futureScope);
    if (stageToggle) {
      const stage = stageToggle.closest(".roadmap-stage");
      stage.classList.toggle("is-open");
      stageToggle.setAttribute("aria-expanded", stage.classList.contains("is-open"));
    }
    if (stageJump) {
      switchView("roadmap");
      if (String(getCurrentStage().id) !== stageJump.dataset.stageJump) setRoadmapMode("all");
      const target = document.querySelector(`[data-stage="${stageJump.dataset.stageJump}"]`);
      target?.classList.add("is-open");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (filterButton) {
      activeFilter = filterButton.dataset.filter;
      renderFilters();
      renderLibrary();
    }
    if (libraryResetButton) resetLibraryFilters();
    if (termResult) {
      closeLesson();
      switchView("glossary");
      const input = document.getElementById("glossary-search");
      input.value = termResult.dataset.termResult;
      renderGlossary(input.value);
      document.getElementById("search-results").hidden = true;
    }
    if (quizCheck) checkLessonQuiz(quizCheck.dataset.checkQuiz);
    if (quizReset) resetLessonQuiz(quizReset.dataset.resetQuiz);
    if (extensionQuizCheck) checkExtensionCourseQuiz(extensionQuizCheck.dataset.checkExtensionQuiz);
    if (extensionQuizReset) resetExtensionCourseQuiz(extensionQuizReset.dataset.resetExtensionQuiz);
    if (noteSave) saveLessonNote(noteSave.dataset.saveNote);
    if (labEvidenceSave) saveLabEvidence(labEvidenceSave.dataset.saveLabEvidence);
    if (labEvidenceClear) clearLabEvidence(labEvidenceClear.dataset.clearLabEvidence);
    if (practiceRecordSave) savePracticeRecord(practiceRecordSave.dataset.practiceLesson, practiceRecordSave.dataset.savePracticeRecord);
    if (practiceRecordClear) clearPracticeRecord(practiceRecordClear.dataset.practiceLesson, practiceRecordClear.dataset.clearPracticeRecord);
    if (practiceVerificationCopy) copyPracticeVerificationCommand(practiceVerificationCopy.dataset.copyPracticeVerification);
    if (extensionNoteSave) saveExtensionNote(extensionNoteSave.dataset.saveExtensionNote);
    if (referenceProviderButton) {
      const courseId = referenceProviderButton.dataset.referenceCourse;
      activeReferenceProvider = referenceProviderButton.dataset.referenceProvider || "all";
      activeReferenceCourseId = courseId;
      renderExtensionCourse(courseId);
      [...document.querySelectorAll("[data-reference-provider]")]
        .find((button) => button.dataset.referenceProvider === activeReferenceProvider)
        ?.focus();
    }
    if (resourceRouteButton) {
      activeResourceRoute = resourceRouteButton.dataset.resourceRoute || "all";
      renderResourceIndex();
    }
    if (resourceProviderButton) {
      activeResourceProvider = resourceProviderButton.dataset.resourceProvider || "all";
      renderResourceIndex();
    }
    if (portfolioRouteButton) {
      activePortfolioRoute = portfolioRouteButton.dataset.portfolioRoute || "all";
      renderPortfolioProjects();
    }
    if (portfolioStatusButton) {
      setPortfolioProjectStatus(portfolioStatusButton.dataset.portfolioProject, portfolioStatusButton.dataset.portfolioStatus);
    }
  });

  document.addEventListener("keydown", (event) => {
    trapLessonFocus(event);
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.getElementById("global-search").focus();
    }
    if (event.key === "Escape") {
      closeLesson();
      document.getElementById("search-results").hidden = true;
      setSidebarOpen(false);
    }
    const courseCard = event.target.closest?.(".course-card");
    if (courseCard && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openLesson(courseCard.dataset.openLesson);
    }
  });

  document.getElementById("global-search").addEventListener("input", (event) => searchGlobal(event.target.value));
  document.getElementById("library-status-filter").addEventListener("change", (event) => {
    activeLibraryStatus = ["all", "incomplete", "complete"].includes(event.target.value) ? event.target.value : "all";
    renderLibrary();
  });
  document.getElementById("library-sort").addEventListener("change", (event) => {
    activeLibrarySort = ["route", "duration-asc", "duration-desc"].includes(event.target.value) ? event.target.value : "route";
    renderLibrary();
  });
  document.getElementById("glossary-search").addEventListener("input", (event) => renderGlossary(event.target.value));
  document.getElementById("note-search-input").addEventListener("input", (event) => renderNoteSearch(event.target.value));
  document.getElementById("note-tag-filter").addEventListener("change", (event) => {
    activeNoteTag = event.target.value || "all";
    renderNoteSearch();
  });
  document.getElementById("export-notes-markdown").addEventListener("click", downloadNotesMarkdown);
  document.getElementById("select-visible-notes").addEventListener("click", selectVisibleNotes);
  document.getElementById("clear-note-selection").addEventListener("click", clearNoteSelection);
  document.getElementById("export-selected-notes").addEventListener("click", downloadSelectedNotesMarkdown);
  document.getElementById("export-learning-evidence").addEventListener("click", downloadLearningEvidenceMarkdown);
  document.getElementById("stage-review-filter").addEventListener("change", (event) => setStageReviewId(event.target.value));
  document.getElementById("export-stage-review").addEventListener("click", downloadStageReviewMarkdown);
  document.getElementById("note-search-results").addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-select-note]");
    if (!checkbox) return;
    if (checkbox.checked) selectedNoteKeys.add(checkbox.dataset.selectNote);
    else selectedNoteKeys.delete(checkbox.dataset.selectNote);
    checkbox.closest(".note-result-card")?.classList.toggle("is-selected", checkbox.checked);
    renderNoteSelectionState();
  });
  document.getElementById("lesson-content").addEventListener("scroll", handleLessonContentScroll, { passive: true });
  document.getElementById("mistake-source-filter").addEventListener("change", (event) => {
    activeMistakeSource = event.target.value;
    activeMistakeGroup = "all";
    renderMistakeReview();
  });
  document.getElementById("mistake-group-filter").addEventListener("change", (event) => {
    activeMistakeGroup = event.target.value;
    renderMistakeReview();
  });
  document.getElementById("mistake-status-filter").addEventListener("change", (event) => {
    activeMistakeReviewStatus = event.target.value;
    renderMistakeReview();
  });
  document.addEventListener("change", (event) => {
    const input = event.target.closest("[data-import-practice-verification]");
    if (!input) return;
    importPracticeVerificationFile(input.files?.[0], input.dataset.practiceLesson, input.dataset.importPracticeVerification);
    input.value = "";
  });
  document.getElementById("mistake-sort-filter").addEventListener("change", (event) => {
    activeMistakeSort = ["recent", "course", "knowledge"].includes(event.target.value) ? event.target.value : "recent";
    renderMistakeReview();
  });
  document.getElementById("note-tag-manager").addEventListener("input", (event) => {
    if (event.target.id !== "note-tag-search") return;
    noteTagSearchQuery = event.target.value.slice(0, 40);
    renderNoteTagManager();
    document.getElementById("note-tag-search")?.focus();
  });
  document.getElementById("extension-search-input").addEventListener("input", (event) => renderExtensionSearch(event.target.value));
  document.getElementById("portfolio-search-input").addEventListener("input", (event) => renderPortfolioProjects(event.target.value));
  document.getElementById("resource-search-input").addEventListener("input", (event) => renderResourceIndex(event.target.value));
  document.getElementById("ai-zone-content").addEventListener("input", (event) => {
    if (event.target.id === "ai-course-search") {
      const grid = document.getElementById("ai-course-grid");
      if (grid) grid.innerHTML = getFilteredAILessons().map(renderAICourseCard).join("") || `<div class="ai-empty-panel"><strong>没有匹配课程</strong><p>换一个课程名、概念或编号。</p></div>`;
    }
    if (event.target.id === "ai-glossary-search") refreshAIGlossaryResults();
  });
  document.getElementById("ai-zone-content").addEventListener("change", (event) => {
    if (event.target.id === "ai-module-filter") {
      activeAIModule = event.target.value;
      const grid = document.getElementById("ai-course-grid");
      if (grid) grid.innerHTML = getFilteredAILessons().map(renderAICourseCard).join("");
    }
    if (event.target.id === "ai-type-filter") {
      activeAIType = event.target.value;
      const grid = document.getElementById("ai-course-grid");
      if (grid) grid.innerHTML = getFilteredAILessons().map(renderAICourseCard).join("");
    }
    if (event.target.id === "ai-glossary-category") {
      activeAIGlossaryCategory = event.target.value;
      refreshAIGlossaryResults();
    }
    if (event.target.id === "ai-glossary-level") {
      activeAIGlossaryLevel = event.target.value;
      refreshAIGlossaryResults();
    }
    if (event.target.id === "ai-glossary-status") {
      activeAIGlossaryStatus = event.target.value;
      refreshAIGlossaryResults();
    }
  });
  document.querySelectorAll('[name="completion-mode"]').forEach((input) => {
    input.addEventListener("change", (event) => {
      if (event.target.checked) setCompletionMode(event.target.value);
    });
  });
  document.querySelectorAll('[name="resume-reading"]').forEach((input) => {
    input.addEventListener("change", (event) => {
      if (event.target.checked) setResumeReading(event.target.value === "on");
    });
  });
  document.getElementById("display-font-size").addEventListener("change", (event) => setDisplaySetting("fontSize", event.target.value));
  document.getElementById("display-reading-density").addEventListener("change", (event) => setDisplaySetting("readingDensity", event.target.value));
  document.getElementById("display-high-contrast").addEventListener("change", (event) => setDisplaySetting("highContrast", event.target.checked));
  document.getElementById("display-reduce-motion").addEventListener("change", (event) => setDisplaySetting("reduceMotion", event.target.checked));
  document.getElementById("daily-tasks").addEventListener("change", (event) => {
    if (event.target.matches("[data-task-id]")) toggleTask(event.target.dataset.taskId, event.target.checked);
  });
  document.getElementById("continue-button").addEventListener("click", () => openLesson(getNextLesson().id));
  document.getElementById("close-lesson").addEventListener("click", closeLesson);
  document.getElementById("drawer-backdrop").addEventListener("click", closeLesson);
  document.getElementById("complete-lesson").addEventListener("click", toggleLessonComplete);
  document.getElementById("previous-lesson").addEventListener("click", () => moveLesson(-1));
  document.getElementById("next-lesson").addEventListener("click", () => moveLesson(1));
  document.getElementById("export-progress").addEventListener("click", exportLearningData);
  document.getElementById("import-progress").addEventListener("click", requestLearningDataImport);
  document.getElementById("import-progress-file").addEventListener("change", (event) => {
    importLearningData(event.target.files?.[0]);
    event.target.value = "";
  });
  document.getElementById("clear-offline-cache").addEventListener("click", clearOfflineCache);
  document.getElementById("toggle-all-reading-positions").addEventListener("click", toggleAllReadingPositions);
  document.getElementById("clear-all-reading-positions").addEventListener("click", clearAllReadingPositions);
  document.getElementById("recent-reading-search").addEventListener("input", (event) => setReadingSearchQuery(event.target.value));
  document.getElementById("recent-reading-sort").addEventListener("change", (event) => setReadingSort(event.target.value));
  document.getElementById("recent-reading-evidence").addEventListener("change", (event) => setReadingEvidenceFilter(event.target.value));
  document.getElementById("menu-button").addEventListener("click", () => setSidebarOpen(!document.getElementById("sidebar").classList.contains("is-open")));
  document.getElementById("sidebar-backdrop").addEventListener("click", () => setSidebarOpen(false));
  window.addEventListener("beforeunload", flushReadingPositionSave);
}

// 初始化页面数据、事件和首次可见状态。
function init() {
  renderAll();
  bindEvents();
  setupPWA();
  const params = new URLSearchParams(window.location.search);
  const requestedLesson = params.get("lesson");
  if (requestedLesson && getLesson(requestedLesson)) {
    openLesson(requestedLesson);
    if (params.get("section") === "lab") {
      requestAnimationFrame(() => document.querySelector(".course-lab-section")?.scrollIntoView({ block: "start" }));
    }
  }
}

init();
