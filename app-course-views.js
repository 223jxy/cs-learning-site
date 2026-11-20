"use strict";

// 主线、方向和 AI 阅读工作区的正文渲染模块。
// 打开/关闭、完成状态与事件绑定仍由 app.js 负责。

function renderExtensionCourse(courseId) {
  const course = getExtensionCourse(courseId);
  if (!course) return;
  beginLessonContentRender();
  const route = getFutureRoute(course.routeCode);
  const module = getExtensionModule(course.routeCode, course.moduleIndex);
  const routeCourses = getExtensionCoursesByRoute(course.routeCode);
  const routeCourseIndex = routeCourses.findIndex((item) => item.id === course.id);
  const moduleCourses = getExtensionCoursesByModule(course.routeCode, course.moduleIndex);
  const moduleCourseIndex = moduleCourses.findIndex((item) => item.id === course.id);
  const complete = isExtensionCourseComplete(course.id);
  document.getElementById("lesson-stage-label").textContent = `方向课程 · ${route.title}`;
  document.getElementById("lesson-position-label").textContent = `${route.code} · ${module.title} · 第 ${moduleCourseIndex + 1} / ${moduleCourses.length} 课 · ${course.title}`;
  document.getElementById("lesson-position-bar").style.width = `${Math.round(((routeCourseIndex + 1) / routeCourses.length) * 100)}%`;
  document.getElementById("lesson-content").innerHTML = `
    <header class="lesson-heading extension-lesson-heading">
      <span class="section-kicker">${escapeHTML(course.level)}</span>
      <h1 id="lesson-title">${escapeHTML(course.title)}</h1>
      <p>${escapeHTML(course.summary)}</p>
      <div class="lesson-meta"><span>${escapeHTML(route.title)}</span><span>${escapeHTML(module.title)}</span><span>预计 ${course.duration} 分钟</span><span>${complete ? "已完成" : "未完成"}</span></div>
    </header>
    <section class="lesson-section">
      <h2>为什么要学</h2>
      <div class="why-box"><strong>真实问题</strong><p>${escapeHTML(course.why)}</p></div>
    </section>
    ${renderExtensionCourseTeachingBridge(course)}
    ${renderExtensionCourseGlossary(course)}
    <section class="lesson-section">
      <h2>关键概念</h2>
      <ul>${course.concepts.map((concept) => `<li>${escapeHTML(concept)}</li>`).join("")}</ul>
    </section>
    <section class="lesson-section">
      <h2>把链路连起来</h2>
      <pre class="lesson-code">${escapeHTML(course.example)}</pre>
    </section>
    <section class="lesson-section">
      <h2>动手练习</h2>
      <div class="practice-box"><strong>本课任务</strong><p>${escapeHTML(course.practice)}</p></div>
    </section>
    <section class="lesson-section">
      <h2>验收标准</h2>
      <div class="checkpoint-box"><strong>完成标志</strong><p>${escapeHTML(course.checkpoint)}</p></div>
    </section>
    <section class="lesson-section extension-evidence">
      <h2>作品证据</h2>
      <div class="practice-box"><strong>交付物</strong><p>${escapeHTML(course.projectEvidence)}</p></div>
    </section>
    <section class="lesson-section extension-boundary">
      <h2>参考方向</h2>
      <ul>${course.references.map((reference) => `<li>${escapeHTML(reference)}</li>`).join("")}</ul>
    </section>
    ${renderExtensionCourseQuiz(course)}
    ${renderExtensionCourseNote(course)}
    ${renderExtensionCourseReferences(course)}`;
  document.getElementById("previous-lesson").disabled = routeCourseIndex === 0;
  document.getElementById("previous-lesson").innerHTML = `<span aria-hidden="true">←</span> 上一课`;
  document.getElementById("next-lesson").disabled = routeCourseIndex === routeCourses.length - 1;
  document.getElementById("next-lesson").innerHTML = `下一课 <span aria-hidden="true">→</span>`;
  const completeButton = document.getElementById("complete-lesson");
  completeButton.textContent = complete ? "已完成 · 点击撤销" : "标记为已完成";
  completeButton.classList.toggle("is-complete", complete);
  completeButton.classList.add("is-extension");
  completeButton.disabled = false;
  completeButton.title = "";
  finishLessonContentRender(getReadingPositionKey("extension", course.id));
}

function renderAIGuideQuiz(guide) {
  return `<section class="lesson-section quiz-section" data-ai-guide-quiz="${guide.id}">
    <div class="lesson-section-heading"><div><h2>即时检查</h2><p>三道题检查你是否理解概念关系，而不是只记住名称。</p></div><span class="quiz-score" data-ai-guide-score>尚未提交</span></div>
    <div class="quiz-list">${guide.quiz.map((question, index) => `<fieldset class="quiz-card"><legend>${index + 1}. ${escapeHTML(question.question)}</legend>${question.options.map((option, optionIndex) => `<label class="quiz-option"><input type="radio" name="ai-guide-quiz-${guide.id}-${index}" value="${optionIndex}"><span>${escapeHTML(option)}</span></label>`).join("")}<p class="quiz-explain" data-ai-guide-explain="${index}" hidden>${escapeHTML(question.explanation)}</p></fieldset>`).join("")}</div>
    <div class="lesson-inline-actions"><button class="complete-button" type="button" data-check-ai-guide-quiz="${guide.id}">检查答案</button></div>
  </section>`;
}

function renderAIGuideNote(guide) {
  const note = getAIProgress().guideNotes[guide.id] || {};
  return `<section class="lesson-section note-section"><div class="lesson-section-heading"><div><h2>入门笔记</h2><p>写下自己的解释、练习结果和仍然不清楚的地方。</p></div><span class="note-status">保存：${escapeHTML(formatDateTime(note.updatedAt))}</span></div>
    <label class="lesson-note-tags"><span>标签</span><input id="ai-guide-note-tags" type="text" maxlength="200" value="${escapeHTML((note.tags || []).join(", "))}" placeholder="例如：AI入门, 易混淆"></label>
    <textarea id="ai-guide-note-text" class="lesson-note-input" rows="7" maxlength="12000" placeholder="用自己的话回答本篇真实问题。">${escapeHTML(note.content || "")}</textarea>
    <div class="lesson-inline-actions"><button class="complete-button" type="button" data-save-ai-guide-note="${guide.id}">保存笔记</button></div>
  </section>`;
}

function renderAIGuide(guide) {
  beginLessonContentRender();
  const foundation = getAIFoundationData();
  const index = foundation.guides.findIndex((item) => item.id === guide.id);
  const path = getAIPath(guide.pathId);
  const complete = isAIGuideComplete(guide.id);
  const termButtons = guide.termIds.map((termId) => {
    const term = getAITerm(termId);
    return term ? `<button type="button" data-open-ai-term="${term.id}"><strong>${escapeHTML(term.nameZh)}</strong><span>${escapeHTML(term.abbreviation || term.nameEn)}</span></button>` : "";
  }).join("");
  const courseButtons = guide.nextStep.map((lessonId) => {
    const lesson = getAILesson(lessonId);
    return lesson ? `<button type="button" data-open-ai-lesson="${lesson.id}"><span>${escapeHTML(lesson.number)}</span>${escapeHTML(lesson.title)}</button>` : "";
  }).join("");
  const references = guide.sourceIds.map(getAISource).filter(Boolean);
  document.getElementById("lesson-stage-label").textContent = `AI 入门 · ${path?.title || "入门指南"}`;
  document.getElementById("lesson-position-label").textContent = `${guide.number} · 第 ${index + 1} / ${foundation.guides.length} 篇`;
  document.getElementById("lesson-position-bar").style.width = `${Math.round(((index + 1) / foundation.guides.length) * 100)}%`;
  document.getElementById("lesson-content").innerHTML = `<header class="lesson-heading ai-guide-heading"><span class="section-kicker">${escapeHTML(guide.number)} · ${escapeHTML(guide.level)}</span><h1 id="lesson-title">${escapeHTML(guide.title)}</h1><p>${escapeHTML(guide.question)}</p><div class="lesson-meta"><span>${escapeHTML(path?.title || "AI 入门")}</span><span>预计 ${guide.duration} 分钟</span><span>${complete ? "已完成" : "未完成"}</span></div></header>
    <section class="lesson-section ai-quick-view"><h2>30 秒先看懂</h2><div class="why-box"><strong>先记住这句话</strong><p>${escapeHTML(guide.quickView)}</p></div></section>
    <section class="lesson-section"><h2>学习前需要知道什么</h2><ul>${guide.prerequisites.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><h3>学完你应该能做到</h3><ul>${guide.objectives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
    <section class="lesson-section"><h2>从一个现实问题开始</h2><div class="practice-box"><strong>情境</strong><p>${escapeHTML(guide.scenario)}</p></div></section>
    <section class="lesson-section"><h2>把链路一步步拆开</h2><ol class="ai-guide-steps">${guide.steps.map((step, stepIndex) => `<li><span>${stepIndex + 1}</span><p>${escapeHTML(step)}</p></li>`).join("")}</ol></section>
    <section class="lesson-section"><h2>最小示例</h2><div class="checkpoint-box"><strong>观察结果</strong><p>${escapeHTML(guide.demo)}</p></div></section>
    <section class="lesson-section"><h2>可修改的小练习</h2><div class="practice-box"><strong>任务</strong><p>${escapeHTML(guide.practice)}</p></div>
      <label class="ai-guide-exercise-input"><span>写下你的答案或步骤</span><textarea rows="5" data-ai-guide-exercise-input="${guide.id}" placeholder="至少写出输入、步骤、输出或判断依据。"></textarea></label>
      <div class="lesson-inline-actions"><button class="complete-button" type="button" data-run-ai-guide-exercise="${guide.id}">检查练习记录</button></div>
      <div class="ai-guide-exercise-output" data-ai-guide-exercise-output="${guide.id}" hidden></div>
      <details class="ai-guide-error-example"><summary>查看常见错误示例</summary><p>${escapeHTML(guide.errorExample)}</p></details>
    </section>
    <section class="lesson-section"><h2>本篇专有名词</h2><div class="ai-related-term-list">${termButtons}</div></section>
    ${renderAIGuideQuiz(guide)}
    <section class="lesson-section ai-learning-links"><h2>下一步正式课程</h2><div class="ai-adjacent-lesson-list">${courseButtons}</div></section>
    ${renderAIGuideNote(guide)}
    <section class="lesson-section"><h2>引用资料</h2><ul>${references.map((source) => `<li><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)}</a><small> · ${escapeHTML(source.provider)} · ${escapeHTML(source.id)}</small></li>`).join("")}</ul></section>`;
  document.getElementById("previous-lesson").disabled = index === 0;
  document.getElementById("previous-lesson").innerHTML = `<span aria-hidden="true">←</span> 上一篇`;
  document.getElementById("next-lesson").disabled = index === foundation.guides.length - 1;
  document.getElementById("next-lesson").innerHTML = `下一篇 <span aria-hidden="true">→</span>`;
  const completeButton = document.getElementById("complete-lesson");
  completeButton.textContent = complete ? "已完成 · 点击撤销" : "标记教程已完成";
  completeButton.classList.toggle("is-complete", complete);
  completeButton.disabled = false;
  finishLessonContentRender(getReadingPositionKey("ai-guide", guide.id));
}

function renderAITerm(term) {
  beginLessonContentRender();
  const foundation = getAIFoundationData();
  const index = foundation.terms.findIndex((item) => item.id === term.id);
  const category = foundation.categories.find((item) => item.id === term.categoryId);
  const favorite = isAITermFavorite(term.id);
  const relatedTerms = term.relatedTermIds.map(getAITerm).filter(Boolean);
  const relatedGuides = term.guideIds.map(getAIGuide).filter(Boolean);
  const relatedLessons = term.lessonIds.map(getAILesson).filter(Boolean);
  const references = term.sourceIds.map(getAISource).filter(Boolean);
  document.getElementById("lesson-stage-label").textContent = `AI 词典 · ${category?.title || "基础术语"}`;
  document.getElementById("lesson-position-label").textContent = `${term.id.toUpperCase()} · 第 ${index + 1} / ${foundation.terms.length} 条`;
  document.getElementById("lesson-position-bar").style.width = `${Math.round(((index + 1) / foundation.terms.length) * 100)}%`;
  document.getElementById("lesson-content").innerHTML = `<header class="lesson-heading ai-term-heading"><span class="section-kicker">${escapeHTML(category?.title || "AI 术语")} · ${escapeHTML(term.level)}</span><h1 id="lesson-title">${escapeHTML(term.nameZh)}${term.abbreviation ? `<code>${escapeHTML(term.abbreviation)}</code>` : ""}</h1>${term.nameEn !== term.nameZh ? `<p class="ai-term-english">${escapeHTML(term.nameEn)}</p>` : ""}<div class="lesson-meta"><span>${escapeHTML(term.id)}</span><span>${term.lessonIds.length} 节关联课程</span><span>${favorite ? "已收藏" : "未收藏"}</span></div></header>
    ${aiReaderReturnContext ? `<section class="ai-reader-return"><button class="secondary-button" type="button" data-return-ai-reader><span aria-hidden="true">←</span> 返回${aiReaderReturnContext.type === "guide" ? "入门教程" : "原课程"}</button></section>` : ""}
    <section class="lesson-section ai-quick-view"><h2>30 秒解释</h2><div class="why-box"><strong>一句话</strong><p>${escapeHTML(term.quickDefinition)}</p></div><p>${escapeHTML(term.plainExplanation)}</p></section>
    <section class="lesson-section"><h2>严格定义</h2><p>${escapeHTML(term.technicalDefinition)}</p></section>
    <section class="lesson-section"><h2>类比与最小实例</h2><div class="practice-box"><strong>类比</strong><p>${escapeHTML(term.analogy)}</p></div><div class="checkpoint-box"><strong>实例</strong><p>${escapeHTML(term.example)}</p></div></section>
    <section class="lesson-section"><h2>容易混淆的概念</h2>${term.confusion.length ? `<ul>${term.confusion.map((item) => `<li>${escapeHTML(term.nameZh)} 与 ${escapeHTML(item)} 处在同一学习链路，但职责不同；回到关联课程比较输入、输出和评价方式。</li>`).join("")}</ul>` : `<p>先把它与输入、输出和评价方式一起理解，不孤立背名称。</p>`}</section>
    <section class="lesson-section"><h2>常见误区与边界</h2><div class="ai-anatomy-warning"><strong>常见误区</strong><p>${escapeHTML(term.misconception)}</p></div><ul>${term.limitations.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
    <section class="lesson-section ai-learning-links"><h2>关联学习</h2><div class="ai-learning-link-grid">
      <section><h3>相关术语</h3><div class="ai-related-term-list">${relatedTerms.map((item) => `<button type="button" data-open-ai-term="${item.id}"><strong>${escapeHTML(item.nameZh)}</strong><span>${escapeHTML(item.abbreviation || item.nameEn)}</span></button>`).join("")}</div></section>
      <section><h3>入门教程</h3><div class="ai-related-paper-list">${relatedGuides.map((guide) => `<button type="button" data-open-ai-guide="${guide.id}"><span>${escapeHTML(guide.number)}</span>${escapeHTML(guide.title)}</button>`).join("") || "<p>当前词条直接进入正式课程。</p>"}</div></section>
      <section><h3>正式课程</h3><div class="ai-adjacent-lesson-list">${relatedLessons.slice(0, 6).map((lesson) => `<button type="button" data-open-ai-lesson="${lesson.id}"><span>${escapeHTML(lesson.number)}</span>${escapeHTML(lesson.title)}</button>`).join("")}</div></section>
    </div></section>
    <section class="lesson-section"><h2>引用资料</h2><ul>${references.map((source) => `<li><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)}</a><small> · ${escapeHTML(source.provider)} · ${escapeHTML(source.id)}</small></li>`).join("")}</ul></section>`;
  document.getElementById("previous-lesson").disabled = index === 0;
  document.getElementById("previous-lesson").innerHTML = `<span aria-hidden="true">←</span> 上一词`;
  document.getElementById("next-lesson").disabled = index === foundation.terms.length - 1;
  document.getElementById("next-lesson").innerHTML = `下一词 <span aria-hidden="true">→</span>`;
  const completeButton = document.getElementById("complete-lesson");
  completeButton.textContent = favorite ? "已收藏 · 点击取消" : "收藏这个术语";
  completeButton.classList.toggle("is-complete", favorite);
  completeButton.disabled = false;
  finishLessonContentRender();
}

function renderAILessonQuiz(lesson) {
  const result = getAIProgress().quizResults[lesson.id];
  return `<section class="lesson-section quiz-section" data-ai-quiz-lesson="${lesson.id}"><div class="lesson-section-heading"><div><h2>知识检查</h2><p>完成 6 道题，检查概念、证据和边界。</p></div><span class="quiz-score ${result ? "is-checked" : ""}">${result ? `上次得分 ${result.score} / 6 · ${formatDateTime(result.checkedAt)}` : "结果保存在当前浏览器"}</span></div><div class="quiz-list">${lesson.quiz.map((question, index) => `<fieldset class="quiz-card"><legend>${index + 1}. ${escapeHTML(question.question)}</legend>${question.options.map((option, optionIndex) => { const selected = result?.answers?.[index] === optionIndex; const answer = result && optionIndex === question.answer; const missed = result && selected && optionIndex !== question.answer; return `<label class="quiz-option ${answer ? "is-answer" : ""} ${missed ? "is-miss" : ""}"><input type="radio" name="ai-quiz-${lesson.id}-${index}" value="${optionIndex}" ${selected ? "checked" : ""}><span>${escapeHTML(option)}</span></label>`; }).join("")}${result ? `<p class="quiz-explain">${escapeHTML(question.explanation)}</p>` : ""}</fieldset>`).join("")}</div><div class="lesson-inline-actions"><button class="complete-button" type="button" data-check-ai-quiz="${lesson.id}">检查答案</button>${result ? `<button class="secondary-button" type="button" data-reset-ai-quiz="${lesson.id}">重做检查</button>` : ""}</div></section>`;
}

function renderAILessonNote(lesson) {
  const note = getAIProgress().lessonNotes[lesson.id] || {};
  return `<section class="lesson-section note-section"><div class="lesson-section-heading"><div><h2>学习笔记</h2><p>记录自己的解释、疑问、公式或实验结果。</p></div><span class="note-status">保存：${escapeHTML(formatDateTime(note.updatedAt))}</span></div><label class="lesson-note-tags"><span>标签</span><input id="ai-note-tags" type="text" maxlength="200" value="${escapeHTML((note.tags || []).join(", "))}" placeholder="例如：AI, 梯度, 易错点"></label><textarea id="ai-note-text" class="lesson-note-input" rows="7" maxlength="12000" placeholder="用自己的话解释本课结论，并写下证据。">${escapeHTML(note.content || "")}</textarea><div class="lesson-inline-actions"><button class="complete-button" type="button" data-save-ai-note="${lesson.id}">保存笔记</button></div></section>`;
}

function renderAILessonConnections(lesson) {
  const terms = getRelatedAITerms(lesson);
  const papers = getRelatedAIPapers(lesson);
  const adjacent = getAdjacentAIModuleLessons(lesson);
  const adjacentButtons = [
    adjacent.previous ? `<button type="button" data-open-ai-lesson="${adjacent.previous.id}"><small>上一课</small><span>${escapeHTML(adjacent.previous.number)} · ${escapeHTML(adjacent.previous.title)}</span></button>` : "",
    adjacent.next ? `<button type="button" data-open-ai-lesson="${adjacent.next.id}"><small>下一课</small><span>${escapeHTML(adjacent.next.number)} · ${escapeHTML(adjacent.next.title)}</span></button>` : ""
  ].filter(Boolean).join("");
  return `<section class="lesson-section ai-learning-links">
    <h2>关联学习</h2>
    <div class="ai-learning-link-grid">
      <section><h3>相关术语</h3><p>回到术语表核对定义，再用本课示例建立操作理解。</p><div class="ai-related-term-list">${terms.map((term) => `<button type="button" data-term-result="${escapeHTML(term[0])}"><strong>${escapeHTML(term[0])}</strong><span>${escapeHTML(term[1])}</span></button>`).join("")}</div></section>
      <section><h3>关联论文</h3><p>${papers.length ? "从课程概念进入原论文，检查问题、方法和证据。" : "本课先建立基础概念，暂不要求阅读指定论文。"}</p><div class="ai-related-paper-list">${papers.map((paper) => `<button type="button" data-open-ai-paper="${paper.id}"><span>${paper.year}</span>${escapeHTML(paper.title)}</button>`).join("")}</div></section>
      <section><h3>同模块前后课</h3><p>沿当前模块顺序继续，避免跳过直接前置。</p><div class="ai-adjacent-lesson-list">${adjacentButtons}</div></section>
    </div>
  </section>`;
}

function renderAILesson(lesson) {
  beginLessonContentRender();
  const lessons = getAIData().lessons;
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const module = getAIModule(lesson.moduleId);
  const complete = isAILessonComplete(lesson.id);
  const foundationTerms = (lesson.termIds || []).map(getAITerm).filter(Boolean);
  const beginnerGuides = (lesson.guideIds || []).map(getAIGuide).filter(Boolean);
  document.getElementById("lesson-stage-label").textContent = `AI 专区 · ${module.title}`;
  document.getElementById("lesson-position-label").textContent = `第 ${index + 1} / ${lessons.length} 课`;
  document.getElementById("lesson-position-bar").style.width = `${Math.round(((index + 1) / lessons.length) * 100)}%`;
  document.getElementById("lesson-content").innerHTML = `<header class="lesson-heading ai-lesson-intro"><span class="section-kicker">${escapeHTML(lesson.number)} · ${escapeHTML(lesson.type)}</span><h1 id="lesson-title">${escapeHTML(lesson.title)}</h1><p>${escapeHTML(lesson.summary)}</p><div class="lesson-meta"><span>预计 ${lesson.duration} 分钟</span><span>${lesson.concepts.length} 个关键概念</span><span>${complete ? "已完成" : "未完成"}</span></div></header>
    <section class="lesson-section ai-lesson-prerequisite-terms"><div class="lesson-section-heading"><div><h2>本课先懂这些词</h2><p>先看 30 秒解释，遇到陌生词时不必硬着头皮往下读。</p></div>${beginnerGuides.length ? `<button class="secondary-button" type="button" data-open-ai-guide="${beginnerGuides[0].id}">先看入门教程</button>` : ""}</div><div class="ai-related-term-list">${foundationTerms.map((term) => `<button type="button" data-open-ai-term="${term.id}"><strong>${escapeHTML(term.nameZh)}</strong><span>${escapeHTML(term.abbreviation || term.nameEn)}</span></button>`).join("")}</div></section>
    <section class="lesson-section"><h2>真实问题与学习目标</h2><div class="why-box"><strong>为什么要学</strong><p>${escapeHTML(lesson.why)}</p></div><ul>${lesson.objectives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
    <section class="lesson-section"><h2>关键概念</h2><table class="ai-shape-table"><thead><tr><th>概念</th><th>在本课中的操作性定义</th></tr></thead><tbody>${lesson.concepts.map(([name, definition]) => { const term = getAITerm(name); return `<tr><td>${term ? `<button class="ai-concept-link" type="button" data-open-ai-term="${term.id}">${escapeHTML(name)} <span aria-hidden="true">↗</span></button>` : `<strong>${escapeHTML(name)}</strong>`}</td><td>${escapeHTML(definition)}</td></tr>`; }).join("")}</tbody></table></section>
    <section class="lesson-section"><h2>原理详解</h2>${lesson.deepDive.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}</section>
    <section class="lesson-section"><h2>分步示例</h2>${lesson.workedExamples.map((example) => `<div class="practice-box"><strong>${escapeHTML(example.title)}</strong><ol>${example.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join("")}</ol></div>`).join("")}</section>
    ${lesson.labId ? `<section class="lesson-section"><h2>可运行实验</h2><div class="practice-box"><strong>${escapeHTML(getAILab(lesson.labId).title)}</strong><p>${escapeHTML(getAILab(lesson.labId).goal)}</p><button class="secondary-button" type="button" data-open-ai-lab="${lesson.labId}">打开实验室</button></div></section>` : ""}
    <section class="lesson-section"><h2>常见误区与适用边界</h2><h3>常见误区</h3><ul>${lesson.misconceptions.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><h3>适用边界</h3><ul>${lesson.limits.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
    <section class="lesson-section"><h2>练习与验收</h2><div class="practice-box"><strong>练习</strong><ol>${lesson.practice.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ol></div><div class="checkpoint-box"><strong>完成标志</strong><ul>${lesson.checkpoint.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div></section>
    ${renderAILessonQuiz(lesson)}${renderAILessonNote(lesson)}
    ${renderAILessonConnections(lesson)}
    <section class="lesson-section"><h2>引用资料</h2><ul>${lesson.references.map((reference) => `<li><a href="${escapeHTML(reference.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(reference.title)}</a><small> · ${escapeHTML(reference.provider)} · ${escapeHTML(reference.id)}</small></li>`).join("")}</ul></section>`;
  document.getElementById("previous-lesson").disabled = index === 0;
  document.getElementById("next-lesson").disabled = index === lessons.length - 1;
  const completeButton = document.getElementById("complete-lesson");
  completeButton.textContent = complete ? "已完成 · 点击撤销" : "标记为已完成";
  completeButton.classList.toggle("is-complete", complete);
  completeButton.classList.remove("is-extension");
  completeButton.disabled = false;
  finishLessonContentRender(getReadingPositionKey("ai", lesson.id));
}

// 把当前课程内容写入侧边抽屉并设置前后课程按钮状态。
function renderLesson(lesson) {
  beginLessonContentRender();
  const lessons = getAllLessons();
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const complete = state.completedLessons.includes(lesson.id);
  const highDensity = Boolean(lesson.density);
  document.getElementById("lesson-stage-label").textContent = `阶段 ${lesson.stageId} · ${lesson.stageTitle}`;
  document.getElementById("lesson-position-label").textContent = `第 ${index + 1} / ${lessons.length} 课`;
  document.getElementById("lesson-position-bar").style.width = `${Math.round(((index + 1) / lessons.length) * 100)}%`;
  document.getElementById("lesson-content").innerHTML = `
    <header class="lesson-heading ${highDensity ? "high-density-heading" : ""}">
      <span class="section-kicker">${escapeHTML(lesson.level)}</span>
      <h1 id="lesson-title">${escapeHTML(lesson.title)}</h1>
      <p>${escapeHTML(lesson.summary)}</p>
      <div class="lesson-meta"><span>预计 ${lesson.duration} 分钟</span><span>${highDensity ? `${lesson.knowledgePoints?.length || lesson.concepts.length} 个知识点` : `${lesson.concepts.length} 个关键点`}</span><span>${complete ? "已完成" : "未完成"}</span></div>
    </header>
    ${highDensity ? renderHighDensityLessonSections(lesson) : `<section class="lesson-section">
      <h2>为什么要学</h2>
      <div class="why-box"><strong>真实问题</strong><p>${escapeHTML(lesson.why)}</p></div>
    </section>
    <section class="lesson-section">
      <h2>关键概念</h2>
      <ul>${lesson.concepts.map((concept) => `<li>${escapeHTML(concept)}</li>`).join("")}</ul>
    </section>
    <section class="lesson-section">
      <h2>把链路连起来</h2>
      <pre class="lesson-code">${escapeHTML(lesson.example)}</pre>
    </section>`}
    ${renderOperationGuide(lesson)}
    ${highDensity ? "" : `<section class="lesson-section">
      <h2>动手练习</h2>
      <div class="practice-box"><strong>本课任务</strong><p>${escapeHTML(lesson.practice)}</p></div>
    </section>
    <section class="lesson-section">
      <h2>验收标准</h2>
      <div class="checkpoint-box"><strong>完成标志</strong><p>${escapeHTML(lesson.checkpoint)}</p></div>
    </section>`}
    ${renderLessonQuiz(lesson)}
    ${renderLessonNote(lesson)}`;
  document.getElementById("previous-lesson").disabled = index === 0;
  document.getElementById("previous-lesson").innerHTML = `<span aria-hidden="true">←</span> 上一课`;
  document.getElementById("next-lesson").disabled = index === lessons.length - 1;
  document.getElementById("next-lesson").innerHTML = `下一课 <span aria-hidden="true">→</span>`;
  const completeButton = document.getElementById("complete-lesson");
  completeButton.textContent = complete ? "已完成 · 点击撤销" : "标记为已完成";
  completeButton.classList.toggle("is-complete", complete);
  completeButton.classList.remove("is-extension");
  completeButton.disabled = false;
  completeButton.title = "";
  finishLessonContentRender(getReadingPositionKey("main", lesson.id));
}
