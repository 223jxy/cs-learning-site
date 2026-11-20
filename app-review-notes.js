"use strict";

// 错题复习、笔记搜索、标签筛选与 Markdown 导出模块。
// 该层只负责已产生学习数据的聚合与展示，不改变课程进度模型。

function getMissedQuizItems() {
  return Object.entries(state.quizResults || {}).flatMap(([lessonId, result]) => {
    const lesson = getLesson(lessonId);
    if (!lesson || !Array.isArray(result.answers)) return [];
    const questions = buildLessonQuiz(lesson);
    return questions.map((question, questionIndex) => ({
      kind: "mainline",
      lesson,
      question,
      questionIndex,
      selectedIndex: result.answers[questionIndex],
      checkedAt: result.checkedAt
    })).filter((item) => item.selectedIndex !== item.question.answerIndex);
  });
}

function getMissedExtensionQuizItems() {
  return Object.entries(getExtensionState().extensionQuizResults || {}).flatMap(([courseId, result]) => {
    const course = getExtensionCourse(courseId);
    if (!course || !Array.isArray(result.answers)) return [];
    const questions = buildExtensionCourseQuiz(course);
    return questions.map((question, questionIndex) => ({
      kind: "extension",
      course,
      question,
      questionIndex,
      selectedIndex: result.answers[questionIndex],
      checkedAt: result.checkedAt
    })).filter((item) => item.selectedIndex !== item.question.answerIndex);
  });
}

function getMissedAIQuizItems() {
  return Object.entries(getAIProgress().quizResults || {}).flatMap(([lessonId, result]) => {
    const lesson = getAILesson(lessonId);
    if (!lesson || !Array.isArray(result.answers)) return [];
    return lesson.quiz.map((question, questionIndex) => ({
      kind: "ai-zone", lesson,
      question: { prompt: question.question, options: question.options, answerIndex: question.answer, explanation: question.explanation },
      questionIndex, selectedIndex: result.answers[questionIndex], checkedAt: result.checkedAt
    })).filter((item) => item.selectedIndex !== item.question.answerIndex);
  });
}

function getMistakeGroupId(item) {
  if (item.kind === "extension") return `route-${item.course.routeCode}`;
  if (item.kind === "ai-zone") return `ai-${item.lesson.moduleId}`;
  return `stage-${item.lesson.stageId}`;
}

function getMistakeReviewKey(item) {
  const courseId = item.kind === "extension" ? item.course.id : item.lesson.id;
  return `${item.kind}:${courseId}:${item.questionIndex}:${item.checkedAt || "unknown"}`;
}

function isMistakeReviewed(item) {
  return Boolean(state.reviewedMistakes?.[getMistakeReviewKey(item)]);
}

function renderMistakeFilters(items) {
  const sourceFilter = document.getElementById("mistake-source-filter");
  const groupFilter = document.getElementById("mistake-group-filter");
  const statusFilter = document.getElementById("mistake-status-filter");
  const sortFilter = document.getElementById("mistake-sort-filter");
  if (!sourceFilter || !groupFilter || !statusFilter || !sortFilter) return;
  const sourceOptions = [
    { id: "all", label: "全部课程", count: items.length },
    { id: "mainline", label: "主线课程", count: items.filter((item) => item.kind === "mainline").length },
    { id: "extension", label: "方向课程", count: items.filter((item) => item.kind === "extension").length },
    { id: "ai-zone", label: "AI 专区", count: items.filter((item) => item.kind === "ai-zone").length }
  ];
  sourceFilter.innerHTML = sourceOptions.map((option) => `<option value="${option.id}" ${activeMistakeSource === option.id ? "selected" : ""}>${option.label} · ${option.count}</option>`).join("");

  const availableGroups = [];
  if (["all", "mainline"].includes(activeMistakeSource)) {
    stages.forEach((stage) => availableGroups.push({
      id: `stage-${stage.id}`,
      label: `阶段 ${stage.id} · ${stage.title}`,
      count: items.filter((item) => item.kind === "mainline" && item.lesson.stageId === stage.id).length
    }));
  }
  if (["all", "extension"].includes(activeMistakeSource)) {
    futureRoutes.forEach((route) => availableGroups.push({
      id: `route-${route.code}`,
      label: `${route.code} · ${route.title}`,
      count: items.filter((item) => item.kind === "extension" && item.course.routeCode === route.code).length
    }));
  }
  if (["all", "ai-zone"].includes(activeMistakeSource)) {
    getAIData().modules.filter((module) => module.status === "open").forEach((module) => availableGroups.push({ id: `ai-${module.id}`, label: `${module.id} · ${module.title}`, count: items.filter((item) => item.kind === "ai-zone" && item.lesson.moduleId === module.id).length }));
  }
  if (activeMistakeGroup !== "all" && !availableGroups.some((group) => group.id === activeMistakeGroup)) activeMistakeGroup = "all";
  groupFilter.innerHTML = [{ id: "all", label: "全部学习分组", count: items.length }, ...availableGroups]
    .map((option) => `<option value="${escapeHTML(option.id)}" ${activeMistakeGroup === option.id ? "selected" : ""}>${escapeHTML(option.label)} · ${option.count}</option>`).join("");
  const pendingCount = items.filter((item) => !isMistakeReviewed(item)).length;
  const reviewedCount = items.length - pendingCount;
  statusFilter.innerHTML = [
    { id: "all", label: "全部状态", count: items.length },
    { id: "pending", label: "未复习", count: pendingCount },
    { id: "reviewed", label: "已复习", count: reviewedCount }
  ].map((option) => `<option value="${option.id}" ${activeMistakeReviewStatus === option.id ? "selected" : ""}>${option.label} · ${option.count}</option>`).join("");
  sortFilter.value = activeMistakeSort;
}

function renderMistakeReview() {
  const list = document.getElementById("mistake-review-list");
  if (!list) return;
  const allMissed = sortMistakeItems([...getMissedQuizItems(), ...getMissedExtensionQuizItems(), ...getMissedAIQuizItems()]);
  renderMistakeFilters(allMissed);
  const missed = allMissed.filter((item) => {
    const sourceMatched = activeMistakeSource === "all" || item.kind === activeMistakeSource;
    const groupMatched = activeMistakeGroup === "all" || getMistakeGroupId(item) === activeMistakeGroup;
    const reviewed = isMistakeReviewed(item);
    const statusMatched = activeMistakeReviewStatus === "all"
      || (activeMistakeReviewStatus === "reviewed" ? reviewed : !reviewed);
    return sourceMatched && groupMatched && statusMatched;
  });
  document.getElementById("review-mistake-count").textContent = allMissed.filter((item) => !isMistakeReviewed(item)).length;
  document.getElementById("review-filter-count").textContent = `显示 ${missed.length} / ${allMissed.length} 道`;
  list.innerHTML = missed.length ? missed.map((item) => {
    const isExtension = item.kind === "extension";
    const isAI = item.kind === "ai-zone";
    const courseTitle = isExtension ? item.course.title : item.lesson.title;
    const context = isExtension ? getExtensionCourseContext(item.course) : null;
    const reviewKey = getMistakeReviewKey(item);
    const reviewed = isMistakeReviewed(item);
    const knowledgeLabel = getMistakeKnowledgeLabel(item);
    const topLabel = isExtension
      ? `方向 · ${context.routeTitle} · ${context.moduleTitle}`
      : isAI ? `AI 专区 · ${item.lesson.moduleId}` : `阶段 ${item.lesson.stageId} · ${item.lesson.stageTitle}`;
    const openButton = isExtension
      ? `<button class="text-button" type="button" data-open-extension-course="${item.course.id}">打开方向课程 <span aria-hidden="true">→</span></button>`
      : isAI ? `<button class="text-button" type="button" data-open-ai-lesson="${item.lesson.id}">回到 AI 课程 <span aria-hidden="true">→</span></button>` : `<button class="text-button" type="button" data-open-lesson="${item.lesson.id}">回到课程复习 <span aria-hidden="true">→</span></button>`;
    return `<article class="mistake-card ${isExtension ? "is-extension" : ""} ${reviewed ? "is-reviewed" : ""}">
    <div class="review-card-top">
      <span>${escapeHTML(topLabel)}</span>
      <small>${escapeHTML(formatDateTime(item.checkedAt))}</small>
    </div>
    <h3>${escapeHTML(courseTitle)}</h3>
    <div class="mistake-knowledge-label">${escapeHTML(knowledgeLabel)}</div>
    <p class="review-question">${item.questionIndex + 1}. ${escapeHTML(item.question.prompt)}</p>
    <div class="review-answer is-wrong"><strong>你的答案</strong><span>${escapeHTML(item.question.options[item.selectedIndex] || "未记录")}</span></div>
    <div class="review-answer is-correct"><strong>正确答案</strong><span>${escapeHTML(item.question.options[item.question.answerIndex])}</span></div>
    <p class="review-explain">${escapeHTML(item.question.explanation)}</p>
    <div class="mistake-card-actions">
      ${openButton}
      <button class="review-complete-button" type="button" data-toggle-mistake-review="${escapeHTML(reviewKey)}" aria-pressed="${reviewed}">${reviewed ? "已复习 · 撤销" : "标记为已复习"}</button>
    </div>
  </article>`;
  }).join("") : `<div class="review-empty">
    <strong>${allMissed.length ? "当前筛选没有错题" : "暂时没有错题"}</strong>
    <p>${allMissed.length ? "换一个课程类型、阶段或方向查看。" : "完成知识检查后，答错的题会自动出现在这里。"}</p>
  </div>`;
}

function toggleMistakeReviewed(reviewKey) {
  const knownKeys = [...getMissedQuizItems(), ...getMissedExtensionQuizItems(), ...getMissedAIQuizItems()].map(getMistakeReviewKey);
  if (!knownKeys.includes(reviewKey)) return;
  state.reviewedMistakes = isPlainRecord(state.reviewedMistakes) ? state.reviewedMistakes : {};
  if (state.reviewedMistakes[reviewKey]) {
    delete state.reviewedMistakes[reviewKey];
    showToast("已恢复为未复习");
  } else {
    state.reviewedMistakes[reviewKey] = new Date().toISOString();
    showToast("已标记为已复习");
  }
  saveState(false);
  renderMistakeReview();
}

function clearMistakeReviewForCourse(kind, courseId) {
  if (!isPlainRecord(state.reviewedMistakes)) return;
  const prefix = `${kind}:${courseId}:`;
  Object.keys(state.reviewedMistakes).forEach((key) => {
    if (key.startsWith(prefix)) delete state.reviewedMistakes[key];
  });
}

function getNoteResults(query = "") {
  const normalized = query.trim().toLowerCase();
  const mainlineNotes = Object.entries(state.lessonNotes || {}).map(([lessonId, note]) => {
    const lesson = getLesson(lessonId);
    if (!lesson || !note?.content?.trim()) return null;
    return { kind: "mainline", lesson, note };
  }).filter(Boolean);
  const directionNotes = Object.entries(getExtensionState().extensionNotes || {}).map(([courseId, note]) => {
    const course = getExtensionCourse(courseId);
    if (!course || !note?.content?.trim()) return null;
    return { kind: "extension", course, note, context: getExtensionCourseContext(course) };
  }).filter(Boolean);
  const aiNotes = Object.entries(getAIProgress().lessonNotes || {}).map(([lessonId, note]) => {
    const lesson = getAILesson(lessonId);
    if (!lesson || !note?.content?.trim()) return null;
    return { kind: "ai-zone", lesson, note, module: getAIModule(lesson.moduleId) };
  }).filter(Boolean);
  const aiGuideNotes = Object.entries(getAIProgress().guideNotes || {}).map(([guideId, note]) => {
    const guide = getAIGuide(guideId);
    if (!guide || !note?.content?.trim()) return null;
    return { kind: "ai-guide", guide, note, path: getAIPath(guide.pathId) };
  }).filter(Boolean);
  return [...mainlineNotes, ...directionNotes, ...aiNotes, ...aiGuideNotes].filter((item) => {
    if (!normalized) return true;
    if (item.kind === "extension") {
      return [item.course.title, item.course.summary, item.context.routeTitle, item.context.moduleTitle, ...(item.note.tags || []), item.note.content]
        .join(" ").toLowerCase().includes(normalized);
    }
    if (item.kind === "ai-guide") return [item.guide.number, item.guide.title, item.guide.question, item.path?.title, ...(item.note.tags || []), item.note.content].join(" ").toLowerCase().includes(normalized);
    if (item.kind === "ai-zone") return [item.lesson.number, item.lesson.title, item.lesson.summary, item.module?.title, ...(item.note.tags || []), item.note.content].join(" ").toLowerCase().includes(normalized);
    return [item.lesson.title, item.lesson.stageTitle, item.lesson.summary, ...(item.note.tags || []), item.note.content]
      .join(" ").toLowerCase().includes(normalized);
  }).sort((a, b) => new Date(b.note.updatedAt || 0) - new Date(a.note.updatedAt || 0));
}

function getNoteResultPresentation(item) {
  const isExtension = item.kind === "extension";
  const isAI = item.kind === "ai-zone";
  const isAIGuide = item.kind === "ai-guide";
  return {
    isExtension,
    isAI,
    isAIGuide,
    title: isExtension ? item.course.title : isAIGuide ? item.guide.title : item.lesson.title,
    contextLabel: isExtension
      ? `方向 · ${item.context.routeTitle} · ${item.context.moduleTitle}`
      : isAIGuide ? `AI 入门 · ${item.path?.title || "入门指南"} · ${item.guide.number}`
        : isAI ? `AI 专区 · ${item.lesson.moduleId} · ${item.module?.title || ""}` : `阶段 ${item.lesson.stageId} · ${item.lesson.stageTitle}`,
    typeLabel: isExtension ? "方向课程" : isAIGuide ? "AI 入门教程" : isAI ? "AI 课程" : "主线课程"
  };
}

function getNoteResultKey(item) {
  return item.kind === "extension" ? `extension:${item.course.id}` : item.kind === "ai-guide" ? `ai-guide:${item.guide.id}` : item.kind === "ai-zone" ? `ai-zone:${item.lesson.id}` : `mainline:${item.lesson.id}`;
}

function getAllNoteTags() {
  const tags = new Map();
  getNoteResults("").forEach((item) => (item.note.tags || []).forEach((tag) => {
    const key = tag.toLowerCase();
    if (!tags.has(key)) tags.set(key, tag);
  }));
  return [...tags.values()].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function getVisibleNoteResults(query = document.getElementById("note-search-input")?.value || "") {
  return getNoteResults(query).filter((item) => activeNoteTag === "all" || (item.note.tags || []).some((tag) => tag.toLowerCase() === activeNoteTag.toLowerCase()));
}

function renderNoteTagFilter() {
  const select = document.getElementById("note-tag-filter");
  if (!select) return;
  const tags = getAllNoteTags();
  if (activeNoteTag !== "all" && !tags.some((tag) => tag.toLowerCase() === activeNoteTag.toLowerCase())) activeNoteTag = "all";
  select.innerHTML = `<option value="all">全部标签</option>${tags.map((tag) => `<option value="${escapeHTML(tag)}">${escapeHTML(tag)}</option>`).join("")}`;
  select.value = activeNoteTag;
}

function getSelectedNoteResults() {
  return getNoteResults("").filter((item) => selectedNoteKeys.has(getNoteResultKey(item)));
}

function renderNoteSelectionState() {
  const selected = getSelectedNoteResults();
  document.getElementById("selected-note-count").textContent = `已选择 ${selected.length} 篇`;
  document.getElementById("clear-note-selection").disabled = selected.length === 0;
  document.getElementById("export-selected-notes").disabled = selected.length === 0;
}

function buildNotesMarkdown(results, query = "") {
  const trimmedQuery = query.trim();
  const sections = results.map((item, index) => {
    const meta = getNoteResultPresentation(item);
    return `## ${index + 1}. ${meta.title}

- 课程类型：${meta.typeLabel}
- 位置：${meta.contextLabel}
- 更新时间：${formatDateTime(item.note.updatedAt)}
- 标签：${(item.note.tags || []).length ? item.note.tags.map((tag) => `#${tag}`).join(" ") : "无"}

### 笔记正文

${item.note.content.trim()}
`;
  }).join("\n---\n\n");
  return `# 计算机学习地图 - 学习笔记

- 导出时间：${new Date().toLocaleString("zh-CN")}
- 搜索条件：${trimmedQuery || "全部笔记"}
- 笔记数量：${results.length}

${sections}`;
}

function downloadNotesMarkdown() {
  const query = document.getElementById("note-search-input")?.value || "";
  const results = getNoteResults(query);
  if (!results.length) {
    showToast("当前没有可导出的笔记");
    return;
  }
  const date = new Intl.DateTimeFormat("sv-SE").format(new Date());
  const querySuffix = query.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").replace(/\s+/g, "-").slice(0, 30);
  downloadTextFile(`学习笔记-${querySuffix || "全部"}-${date}.md`, buildNotesMarkdown(results, query));
  showToast(`已导出 ${results.length} 篇笔记`);
}

function downloadSelectedNotesMarkdown() {
  const results = getSelectedNoteResults();
  if (!results.length) {
    showToast("先选择要导出的笔记");
    return;
  }
  const date = new Intl.DateTimeFormat("sv-SE").format(new Date());
  downloadTextFile(`学习笔记-已选-${date}.md`, buildNotesMarkdown(results, "手动选择"));
  showToast(`已导出 ${results.length} 篇选中笔记`);
}

function selectVisibleNotes() {
  getVisibleNoteResults().forEach((item) => selectedNoteKeys.add(getNoteResultKey(item)));
  renderNoteSearch();
}

function clearNoteSelection() {
  selectedNoteKeys.clear();
  renderNoteSearch();
}

function renderNoteSearch(query = document.getElementById("note-search-input")?.value || "") {
  const list = document.getElementById("note-search-results");
  if (!list) return;
  renderNoteTagFilter();
  renderNoteTagManager();
  const results = getVisibleNoteResults(query);
  document.getElementById("review-note-count").textContent = getNoteCount() + getExtensionNoteCount() + Object.keys(getAIProgress().lessonNotes).length + Object.keys(getAIProgress().guideNotes).length;
  document.getElementById("note-search-count").textContent = `${results.length} 篇结果`;
  document.getElementById("export-notes-markdown").disabled = results.length === 0;
  list.innerHTML = results.length ? results.map((item) => {
    const { note } = item;
    const noteKey = getNoteResultKey(item);
    const { isExtension, isAI, isAIGuide, title, contextLabel } = getNoteResultPresentation(item);
    const openButton = isExtension
      ? `<button class="text-button" type="button" data-open-extension-course="${item.course.id}">打开方向课程修改笔记 <span aria-hidden="true">→</span></button>`
      : isAIGuide ? `<button class="text-button" type="button" data-open-ai-guide="${item.guide.id}">打开入门教程修改笔记 <span aria-hidden="true">→</span></button>`
        : isAI ? `<button class="text-button" type="button" data-open-ai-lesson="${item.lesson.id}">打开 AI 课程修改笔记 <span aria-hidden="true">→</span></button>` : `<button class="text-button" type="button" data-open-lesson="${item.lesson.id}">打开课程修改笔记 <span aria-hidden="true">→</span></button>`;
    const snippet = note.content.length > 180 ? `${note.content.slice(0, 180)}…` : note.content;
    return `<article class="note-result-card ${isExtension ? "is-extension" : ""} ${selectedNoteKeys.has(noteKey) ? "is-selected" : ""}">
      <div class="review-card-top">
        <span>${highlightSearchTerm(contextLabel, query)}</span>
        <small>${escapeHTML(formatDateTime(note.updatedAt))}</small>
      </div>
      <h3>${highlightSearchTerm(title, query)}</h3>
      <p>${highlightSearchTerm(snippet, query)}</p>
      ${(note.tags || []).length ? `<div class="note-tag-list">${note.tags.map((tag) => `<span>${highlightSearchTerm(`#${tag}`, query)}</span>`).join("")}</div>` : ""}
      <div class="note-card-actions">
        <label class="note-select"><input type="checkbox" data-select-note="${escapeHTML(noteKey)}" ${selectedNoteKeys.has(noteKey) ? "checked" : ""}><span>选择笔记</span></label>
        ${openButton}
      </div>
    </article>`;
  }).join("") : `<div class="review-empty">
    <strong>${query.trim() ? "没有匹配的笔记" : "还没有课程笔记"}</strong>
    <p>${query.trim() ? "换一个关键词，或回到课程里补充更明确的笔记。" : "打开任意课程，在底部学习笔记区保存内容后，这里会显示结果。"}</p>
  </div>`;
  renderNoteSelectionState();
}

function renderStudyReview() {
  if (typeof renderStageReview === "function") renderStageReview();
  renderMistakeReview();
  renderNoteSearch();
}
