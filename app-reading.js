"use strict";

// 阅读状态、最近阅读、阅读位置和章节目录模块。
// 课程渲染器通过这些全局函数接入，保持原生 JS 的低耦合方式。

function getReadingPositionEntry(key, position) {
  const separatorIndex = key.indexOf(":");
  if (separatorIndex < 1) return null;
  const kind = key.slice(0, separatorIndex);
  const id = key.slice(separatorIndex + 1);
  if (kind === "main") {
    const lesson = getLesson(id);
    if (!lesson) return null;
    return {
      key, kind, id, position,
      typeLabel: "主线课程",
      title: lesson.title,
      context: `阶段 ${lesson.stageId} · ${lesson.stageTitle}`,
      ...getReadingEntryStudyStatus(kind, id)
    };
  }
  if (kind === "extension") {
    const course = getExtensionCourse(id);
    if (!course) return null;
    const route = getFutureRoute(course.routeCode);
    const module = getExtensionModule(course.routeCode, course.moduleIndex);
    return {
      key, kind, id, position,
      typeLabel: "方向课程",
      title: course.title,
      context: `${route?.title || course.routeCode} · ${module?.title || `模块 ${course.moduleIndex + 1}`}`,
      ...getReadingEntryStudyStatus(kind, id)
    };
  }
  if (kind === "ai") {
    const lesson = getAILesson(id);
    if (!lesson) return null;
    const module = getAIModule(lesson.moduleId);
    return {
      key, kind, id, position,
      typeLabel: "AI 课程",
      title: lesson.title,
      context: `${lesson.number} · ${module?.title || lesson.moduleId}`,
      ...getReadingEntryStudyStatus(kind, id)
    };
  }
  if (kind === "ai-guide") {
    const guide = getAIGuide(id);
    if (!guide) return null;
    const path = getAIPath(guide.pathId);
    return {
      key, kind: "ai", readerKind: "guide", id, position,
      typeLabel: "AI 入门",
      title: guide.title,
      context: `${guide.number} · ${path?.title || "入门指南"}`,
      ...getReadingEntryStudyStatus("ai", id, "guide")
    };
  }
  return null;
}

function getReadingPositionEntries() {
  return Object.entries(state.readingPositions || {})
    .map(([key, position]) => getReadingPositionEntry(key, position))
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.position.updatedAt) - Date.parse(a.position.updatedAt) || a.key.localeCompare(b.key));
}

function getReadingEntrySearchText(entry) {
  return [
    entry.typeLabel,
    entry.title,
    entry.context,
    entry.position.sectionTitle,
    entry.id,
    entry.kind,
    entry.readerKind
  ].filter(Boolean).join(" ").toLowerCase();
}

function sortReadingPositionEntries(entries = [], sort = activeReadingSort) {
  const sorted = [...entries];
  if (sort === "unfinished") {
    return sorted.sort((a, b) => Number(a.isComplete) - Number(b.isComplete) || Date.parse(b.position.updatedAt) - Date.parse(a.position.updatedAt) || a.key.localeCompare(b.key));
  }
  if (sort === "progress-desc" || sort === "progress-asc") {
    const direction = sort === "progress-desc" ? -1 : 1;
    return sorted.sort((a, b) => direction * ((Number(a.position.percent) || 0) - (Number(b.position.percent) || 0)) || Date.parse(b.position.updatedAt) - Date.parse(a.position.updatedAt) || a.key.localeCompare(b.key));
  }
  if (sort === "stage") {
    return sorted.sort((a, b) => {
      const aLesson = a.kind === "main" ? getLesson(a.id) : null;
      const bLesson = b.kind === "main" ? getLesson(b.id) : null;
      const aStage = Number.isInteger(aLesson?.stageId) ? aLesson.stageId : 99;
      const bStage = Number.isInteger(bLesson?.stageId) ? bLesson.stageId : 99;
      return aStage - bStage || a.title.localeCompare(b.title, "zh-CN") || Date.parse(b.position.updatedAt) - Date.parse(a.position.updatedAt);
    });
  }
  if (sort === "type") {
    const rank = { main: 0, extension: 1, ai: 2 };
    return sorted.sort((a, b) => (rank[a.kind] ?? 9) - (rank[b.kind] ?? 9) || a.title.localeCompare(b.title, "zh-CN") || Date.parse(b.position.updatedAt) - Date.parse(a.position.updatedAt));
  }
  return sorted.sort((a, b) => Date.parse(b.position.updatedAt) - Date.parse(a.position.updatedAt) || a.key.localeCompare(b.key));
}

function getFilteredReadingPositionEntries(entries = getReadingPositionEntries(), kind = activeReadingKind, query = activeReadingQuery, sort = activeReadingSort, evidence = activeReadingEvidence) {
  const normalized = String(query || "").trim().toLowerCase();
  const filtered = entries.filter((entry) => {
    const kindMatched = kind === "all" || entry.kind === kind;
    const queryMatched = !normalized || getReadingEntrySearchText(entry).includes(normalized);
    const evidenceMatched = evidence === "all" || (evidence === "with" ? entry.hasEvidence : !entry.hasEvidence);
    return kindMatched && queryMatched && evidenceMatched;
  });
  return sortReadingPositionEntries(filtered, sort);
}

function getReadingKindLabel(kind) {
  return ({ all: "全部", main: "主线", extension: "方向", ai: "AI" })[kind] || "全部";
}

function renderReadingKindFilters(entries) {
  const counts = {
    all: entries.length,
    main: entries.filter((entry) => entry.kind === "main").length,
    extension: entries.filter((entry) => entry.kind === "extension").length,
    ai: entries.filter((entry) => entry.kind === "ai").length
  };
  document.querySelectorAll("[data-reading-kind-filter]").forEach((button) => {
    const active = button.dataset.readingKindFilter === activeReadingKind;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-reading-kind-count]").forEach((count) => {
    count.textContent = counts[count.dataset.readingKindCount] || 0;
  });
}

function renderRecentReading() {
  const list = document.getElementById("recent-reading-list");
  if (!list) return;
  const entries = getReadingPositionEntries();
  const filteredEntries = getFilteredReadingPositionEntries(entries);
  const visibleEntries = showAllReadingPositions ? filteredEntries : filteredEntries.slice(0, 6);
  const enabled = state.settings?.resumeReading !== false;
  renderReadingKindFilters(entries);
  document.getElementById("reading-position-count").textContent = entries.length;
  const hasReadingQuery = Boolean(activeReadingQuery.trim());
  const hasReadingScope = hasReadingQuery || activeReadingEvidence !== "all";
  document.getElementById("recent-reading-count").textContent = activeReadingKind === "all" && !hasReadingScope
    ? `${entries.length} 节课程`
    : `${filteredEntries.length} / ${entries.length} 节`;
  const searchInput = document.getElementById("recent-reading-search");
  if (searchInput && searchInput.value !== activeReadingQuery) searchInput.value = activeReadingQuery;
  const sortSelect = document.getElementById("recent-reading-sort");
  if (sortSelect) sortSelect.value = activeReadingSort;
  const evidenceSelect = document.getElementById("recent-reading-evidence");
  if (evidenceSelect) evidenceSelect.value = activeReadingEvidence;
  const toggleButton = document.getElementById("toggle-all-reading-positions");
  toggleButton.hidden = filteredEntries.length <= 6;
  toggleButton.textContent = showAllReadingPositions ? "收起列表" : `查看全部 ${filteredEntries.length} 节`;
  const clearButton = document.getElementById("clear-all-reading-positions");
  clearButton.disabled = filteredEntries.length === 0;
  clearButton.textContent = hasReadingScope
    ? "清除当前结果"
    : activeReadingKind === "all" ? "清除全部" : `清除${getReadingKindLabel(activeReadingKind)}记录`;
  if (!enabled) {
    list.innerHTML = `<div class="recent-reading-empty">
      <strong>阅读位置记录已关闭</strong>
      <span>切换到“记住位置”后，阅读超过课程开头的内容会出现在这里。</span>
    </div>`;
    return;
  }
  if (!entries.length) {
    list.innerHTML = `<div class="recent-reading-empty">
      <strong>还没有可继续的课程</strong>
      <span>阅读离开课程开头后，会自动记录上次章节；读到结尾后不再保留断点。</span>
    </div>`;
    return;
  }
  if (!filteredEntries.length) {
    list.innerHTML = `<div class="recent-reading-empty">
      <strong>${hasReadingScope ? "当前筛选没有阅读记录" : "当前类型没有阅读记录"}</strong>
      <span>${activeReadingQuery.trim() ? "换一个课程名、阶段、方向或章节关键词。" : `其他课程类型仍有 ${entries.length} 条记录，可以切回全部查看。`}</span>
      <button class="secondary-button" type="button" data-reading-kind-filter="all">查看全部课程</button>
    </div>`;
    return;
  }
  list.innerHTML = visibleEntries.map((entry) => {
    const sectionTitle = entry.position.sectionTitle || `第 ${entry.position.sectionIndex + 1} 节`;
    return `<article class="recent-reading-card is-${entry.kind}">
      <div class="recent-reading-card-top">
        <span>${escapeHTML(entry.typeLabel)}</span>
        <small>${escapeHTML(formatDateTime(entry.position.updatedAt))}</small>
      </div>
      <div class="recent-reading-status"><span>${entry.isComplete ? "已完成" : "未完成"}</span><span>${entry.hasEvidence ? "有练习记录" : "待补练习"}</span></div>
      <h3>${escapeHTML(entry.title)}</h3>
      <p>${escapeHTML(entry.context)}</p>
      <div class="recent-reading-location">
        <span>上次读到</span>
        <strong>${escapeHTML(sectionTitle)}</strong>
        <em>${entry.position.percent}%</em>
      </div>
      <div class="recent-reading-progress" role="progressbar" aria-label="${escapeHTML(entry.title)}阅读进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${entry.position.percent}">
        <span style="width:${entry.position.percent}%"></span>
      </div>
      <div class="recent-reading-actions">
        <button class="secondary-button is-reading-primary" type="button" data-open-reading-position="${escapeHTML(entry.key)}">继续阅读</button>
        <button class="recent-reading-clear" type="button" data-clear-reading-entry="${escapeHTML(entry.key)}">清除记录</button>
      </div>
    </article>`;
  }).join("");
}

function openReadingPosition(key) {
  const entry = getReadingPositionEntries().find((item) => item.key === key);
  if (!entry) {
    renderRecentReading();
    showToast("这条阅读记录已经不存在");
    return;
  }
  if (entry.kind === "main") openLesson(entry.id);
  else if (entry.kind === "extension") openExtensionCourse(entry.id);
  else if (entry.kind === "ai" && entry.readerKind === "guide") openAIGuide(entry.id);
  else if (entry.kind === "ai") openAILesson(entry.id);
}

function clearReadingPositionEntry(key) {
  if (!state.readingPositions?.[key]) return;
  delete state.readingPositions[key];
  if (renderedReadingKey === key) {
    cancelReadingPositionSave();
    const resumeRow = document.querySelector("[data-lesson-resume-row]");
    if (resumeRow) resumeRow.hidden = true;
  }
  if (getFilteredReadingPositionEntries().length <= 6) showAllReadingPositions = false;
  saveState(false);
  renderRecentReading();
  showToast("已清除该课程的阅读位置");
}

function clearAllReadingPositions() {
  const entries = getFilteredReadingPositionEntries();
  if (!entries.length) return;
  const scopeLabel = activeReadingKind === "all"
    ? `${entries.length} 节课程的阅读位置`
    : `${entries.length} 节${getReadingKindLabel(activeReadingKind)}课程的阅读位置`;
  const queryLabel = activeReadingQuery.trim() ? `\n当前搜索：${activeReadingQuery.trim()}` : "";
  const allowed = window.confirm(`将清除 ${scopeLabel}，课程完成状态和笔记不受影响。${queryLabel}\n是否继续？`);
  if (!allowed) return;
  cancelReadingPositionSave();
  entries.forEach((entry) => delete state.readingPositions[entry.key]);
  showAllReadingPositions = false;
  saveState(false);
  renderRecentReading();
  const resumeRow = document.querySelector("[data-lesson-resume-row]");
  if (resumeRow) resumeRow.hidden = true;
  showToast(activeReadingKind === "all" ? "全部阅读位置已清除" : `${getReadingKindLabel(activeReadingKind)}课程阅读位置已清除`);
}

function toggleAllReadingPositions() {
  showAllReadingPositions = !showAllReadingPositions;
  renderRecentReading();
}

function setReadingKindFilter(kind) {
  if (!["all", "main", "extension", "ai"].includes(kind)) return;
  activeReadingKind = kind;
  showAllReadingPositions = false;
  renderRecentReading();
}

function setReadingSearchQuery(query) {
  activeReadingQuery = String(query || "").slice(0, 80);
  showAllReadingPositions = false;
  renderRecentReading();
}

function setReadingSort(sort) {
  activeReadingSort = ["recent", "unfinished", "progress-desc", "progress-asc", "stage", "type"].includes(sort) ? sort : "recent";
  renderRecentReading();
}

function setReadingEvidenceFilter(value) {
  activeReadingEvidence = ["all", "with", "without"].includes(value) ? value : "all";
  showAllReadingPositions = false;
  renderRecentReading();
}
// 渲染首页学习数据面板，集中展示笔记、知识检查、阅读位置和备份状态。
function renderDataTools() {
  const noteCount = document.getElementById("note-count");
  if (!noteCount) return;
  noteCount.textContent = getNoteCount();
  document.getElementById("quiz-count").textContent = getQuizCount();
  document.getElementById("backup-status").textContent = state.lastExportedAt ? formatDateTime(state.lastExportedAt) : "未导出";
  const backupReminder = getBackupReminderState();
  const backupReminderElement = document.getElementById("backup-reminder");
  backupReminderElement.className = `backup-reminder is-${backupReminder.level}`;
  backupReminderElement.innerHTML = `<span aria-hidden="true"></span><div><strong>${backupReminder.title}</strong><small>${backupReminder.detail}</small></div>`;
  const completionMode = state.settings?.completionMode === "auto" ? "auto" : "manual";
  document.querySelectorAll('[name="completion-mode"]').forEach((input) => {
    input.checked = input.value === completionMode;
  });
  document.getElementById("completion-mode-hint").textContent = completionMode === "auto"
    ? "主线、方向、AI 课程和 AI 入门教程浏览到底后，自动记录为已完成。"
    : "浏览课程后，由你点击完成按钮。";
  const resumeReading = state.settings?.resumeReading !== false;
  document.querySelectorAll('[name="resume-reading"]').forEach((input) => {
    input.checked = input.value === (resumeReading ? "on" : "off");
  });
  document.getElementById("resume-reading-hint").textContent = resumeReading
    ? "主线、方向、AI 课程和 AI 入门教程会回到上次章节，位置可随学习数据导出。"
    : "每次打开课程都从顶部开始，已有阅读位置已清除。";
  renderDisplaySettings();
  renderRecentReading();
}

function setCompletionMode(mode) {
  if (!["manual", "auto"].includes(mode)) return;
  state.settings = { ...state.settings, completionMode: mode };
  saveState(false);
  renderDataTools();
  showToast(mode === "auto" ? "已开启浏览到底自动完成" : "已切换为自行标记完成");
}

function setResumeReading(enabled) {
  const resumeReading = Boolean(enabled);
  if (!resumeReading) {
    if (readingPositionSaveTimer) window.clearTimeout(readingPositionSaveTimer);
    readingPositionSaveTimer = null;
    state.readingPositions = {};
    showAllReadingPositions = false;
  }
  state.settings = { ...state.settings, resumeReading };
  saveState(false);
  renderDataTools();
  showToast(resumeReading ? "已开启阅读位置记录" : "已关闭并清除阅读位置");
}

function setActiveLessonToc(sectionId) {
  const toc = document.querySelector(".lesson-toc");
  if (!toc) return;
  toc.querySelectorAll("[data-lesson-section]").forEach((button) => {
    const active = button.dataset.lessonSection === sectionId;
    button.setAttribute("aria-current", String(active));
    if (active) {
      const track = button.closest(".lesson-toc-track");
      const left = button.offsetLeft - (track.clientWidth - button.offsetWidth) / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  });
}

function getReadingPositionKey(kind, id) {
  if (!id || !["main", "extension", "ai", "ai-guide"].includes(kind)) return "";
  return `${kind}:${id}`;
}

function getActiveLessonTocSection(content, toc) {
  if (!activeLessonTocSections.length) return null;
  const contentTop = content.getBoundingClientRect().top;
  const threshold = contentTop + (toc?.offsetHeight || 0) + 48;
  let active = activeLessonTocSections[0];
  activeLessonTocSections.forEach((section) => {
    if (section.element.getBoundingClientRect().top <= threshold) active = section;
  });
  return active;
}

function resolveReadingPositionTarget(position, sectionMetrics, maxScroll, tocHeight = 0) {
  const fallbackTarget = Math.max(0, Math.min(maxScroll, maxScroll * position.ratio));
  const exactSection = sectionMetrics.find((section) => section.title === position.sectionTitle);
  const indexedSection = sectionMetrics[position.sectionIndex];
  const section = exactSection || indexedSection;
  if (!section) return fallbackTarget;
  const sectionIndex = sectionMetrics.indexOf(section);
  const nextSection = sectionMetrics[sectionIndex + 1];
  const minimumOffset = -(Math.max(0, tocHeight) + 80);
  const maximumOffset = nextSection
    ? Math.max(0, nextSection.top - section.top - 32)
    : Math.max(0, maxScroll - section.top);
  const sectionOffset = Math.max(minimumOffset, Math.min(maximumOffset, position.sectionOffset));
  return Math.max(0, Math.min(maxScroll, section.top + sectionOffset));
}

function saveReadingPositionForKey(key) {
  if (!key || state.settings?.resumeReading === false) return;
  const content = document.getElementById("lesson-content");
  if (!content) return;
  const maxScroll = Math.max(0, content.scrollHeight - content.clientHeight);
  const ratio = maxScroll ? content.scrollTop / maxScroll : 0;
  state.readingPositions = state.readingPositions || {};
  if (!maxScroll || ratio < 0.03 || ratio > 0.97) {
    if (Object.prototype.hasOwnProperty.call(state.readingPositions, key)) {
      delete state.readingPositions[key];
      saveState(false);
    }
    return;
  }
  const toc = content.querySelector(".lesson-toc");
  const active = getActiveLessonTocSection(content, toc);
  const sectionIndex = Math.max(0, activeLessonTocSections.indexOf(active));
  const sectionTop = active
    ? active.element.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop
    : 0;
  state.readingPositions[key] = {
    sectionTitle: active?.title || "",
    sectionIndex,
    sectionOffset: content.scrollTop - sectionTop,
    ratio: Math.max(0, Math.min(1, ratio)),
    percent: Math.max(1, Math.min(99, Math.round(ratio * 100))),
    updatedAt: new Date().toISOString()
  };
  state.lastLearningActivityAt = new Date().toISOString(); saveState(false);
}

function queueReadingPositionSave() {
  if (!renderedReadingKey || state.settings?.resumeReading === false) return;
  if (readingPositionSaveTimer) window.clearTimeout(readingPositionSaveTimer);
  readingPositionSaveTimer = window.setTimeout(() => {
    readingPositionSaveTimer = null;
    saveReadingPositionForKey(renderedReadingKey);
  }, 650);
}

function flushReadingPositionSave() {
  if (readingPositionSaveTimer) window.clearTimeout(readingPositionSaveTimer);
  readingPositionSaveTimer = null;
  saveReadingPositionForKey(renderedReadingKey);
}

function cancelReadingPositionSave() {
  if (readingPositionSaveTimer) window.clearTimeout(readingPositionSaveTimer);
  readingPositionSaveTimer = null;
}

function restoreReadingPosition(key) {
  if (!key || renderedReadingKey !== key || state.settings?.resumeReading === false) return;
  const position = state.readingPositions?.[key];
  if (!position) return;
  const content = document.getElementById("lesson-content");
  const toc = content?.querySelector(".lesson-toc");
  if (!content || !toc) return;
  const resumeRow = toc.querySelector("[data-lesson-resume-row]");
  const resumeCopy = toc.querySelector("[data-lesson-resume-copy]");
  if (resumeRow) resumeRow.hidden = false;
  if (resumeCopy) resumeCopy.textContent = `已回到上次阅读位置 · ${position.percent}%`;
  const maxScroll = Math.max(0, content.scrollHeight - content.clientHeight);
  const sectionMetrics = activeLessonTocSections.map((section) => ({
    title: section.title,
    top: section.element.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop
  }));
  content.scrollTop = resolveReadingPositionTarget(position, sectionMetrics, maxScroll, toc.offsetHeight);
  updateActiveLessonToc();
}

function clearCurrentReadingPosition() {
  if (!renderedReadingKey) return;
  if (state.readingPositions?.[renderedReadingKey]) {
    delete state.readingPositions[renderedReadingKey];
    saveState(false);
  }
  const resumeRow = document.querySelector("[data-lesson-resume-row]");
  if (resumeRow) resumeRow.hidden = true;
  renderRecentReading();
  scrollLessonToTop();
  showToast("已从课程开头重新阅读");
}

function beginLessonContentRender() {
  flushReadingPositionSave();
  renderedReadingKey = "";
  activeLessonTocSections = [];
}

function finishLessonContentRender(readingKey = "") {
  const content = document.getElementById("lesson-content");
  content.scrollTop = 0;
  renderedReadingKey = readingKey;
  setupLessonTableOfContents();
  if (!readingKey || state.settings?.resumeReading === false || !state.readingPositions?.[readingKey]) return;
  const restore = () => {
    if (renderedReadingKey === readingKey) restoreReadingPosition(readingKey);
  };
  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => window.requestAnimationFrame(restore));
  } else {
    window.setTimeout(restore, 0);
  }
}

function handleLessonContentScroll() {
  updateActiveLessonToc();
  queueReadingPositionSave();
}

function updateActiveLessonToc() {
  const content = document.getElementById("lesson-content");
  const toc = content.querySelector(".lesson-toc");
  if (!toc || !activeLessonTocSections.length) return;
  const active = getActiveLessonTocSection(content, toc);
  if (!active) return;
  setActiveLessonToc(active.id);
  const sectionIndex = Math.max(0, activeLessonTocSections.findIndex((section) => section.id === active.id));
  const maxScroll = Math.max(1, content.scrollHeight - content.clientHeight);
  const percent = Math.max(0, Math.min(100, Math.round((content.scrollTop / maxScroll) * 100)));
  const status = toc.querySelector("[data-lesson-toc-status]");
  const progress = toc.querySelector("[data-lesson-reading-progress]");
  const topButton = toc.querySelector("[data-lesson-top]");
  if (status) status.textContent = `${sectionIndex + 1} / ${activeLessonTocSections.length} · ${percent}%`;
  if (progress) {
    progress.style.width = `${percent}%`;
    progress.parentElement.setAttribute("aria-valuenow", String(percent));
  }
  if (topButton) {
    const visible = content.scrollTop > 240;
    topButton.classList.toggle("is-visible", visible);
    topButton.tabIndex = visible ? 0 : -1;
  }
  if (percent === 100) completeActiveCourseAfterReading();
}

function completeActiveCourseAfterReading() {
  const moduleOverviewOpen = activeExtensionModule && !activeExtensionCourseId;
  if (state.settings?.completionMode !== "auto" || activePortfolioProjectId || activeAITermId || moduleOverviewOpen) return;
  if (activeAIGuideId && !isAIGuideComplete(activeAIGuideId)) {
    getAIProgress().completedGuides.push(activeAIGuideId);
    getAIProgress().updatedAt = new Date().toISOString();
    saveState(true); renderAll(); renderAIGuide(getAIGuide(activeAIGuideId)); showToast("已浏览到底，入门教程自动完成"); return;
  }
  if (activeAILessonId && !isAILessonComplete(activeAILessonId)) {
    getAIProgress().completedLessons.push(activeAILessonId);
    getAIProgress().updatedAt = new Date().toISOString();
    saveState(true); renderAll(); renderAILesson(getAILesson(activeAILessonId)); showToast("已浏览到底，AI 课程自动完成"); return;
  }
  let message = "";
  if (activeExtensionCourseId && !isExtensionCourseComplete(activeExtensionCourseId)) {
    getExtensionState().completedExtensionLessons.push(activeExtensionCourseId);
    message = "已浏览到底，方向课程自动完成";
  } else if (activeLessonId && !state.completedLessons.includes(activeLessonId)) {
    state.completedLessons.push(activeLessonId);
    message = "已浏览到底，课程自动完成";
  }
  if (!message) return;
  saveState(true);
  renderAll();
  const completeButton = document.getElementById("complete-lesson");
  completeButton.textContent = "已完成 · 点击撤销";
  completeButton.classList.add("is-complete");
  const metaStatus = document.querySelector("#lesson-content .lesson-meta span:last-child");
  if (metaStatus) metaStatus.textContent = "已完成";
  showToast(message);
}

function setupLessonTableOfContents() {
  const content = document.getElementById("lesson-content");
  content.querySelector(".lesson-toc")?.remove();
  const sections = [...content.querySelectorAll(":scope > .lesson-section")].map((section, index) => {
    const heading = section.querySelector(":scope > h2, :scope > .lesson-section-heading h2");
    if (!heading) return null;
    const id = `lesson-section-${index + 1}`;
    section.id = id;
    return { id, title: heading.textContent.trim(), element: section };
  }).filter(Boolean);
  activeLessonTocSections = sections;
  if (sections.length < 2) return;
  const toc = document.createElement("nav");
  toc.className = "lesson-toc";
  toc.setAttribute("aria-label", "本课章节目录");
  toc.innerHTML = `<div class="lesson-toc-inner">
    <div class="lesson-toc-summary"><span class="lesson-toc-label">本课目录</span><strong data-lesson-toc-status>1 / ${sections.length} · 0%</strong></div>
    <div class="lesson-toc-track">
      ${sections.map((section, index) => `<button class="lesson-toc-button" type="button" data-lesson-section="${section.id}" aria-current="${index === 0}">${escapeHTML(section.title)}</button>`).join("")}
    </div>
    <button class="lesson-toc-top" type="button" data-lesson-top title="返回课程顶部" aria-label="返回课程顶部" tabindex="-1">↑</button>
  </div>
  <div class="lesson-resume-row" data-lesson-resume-row hidden>
    <span data-lesson-resume-copy>已回到上次阅读位置</span>
    <button type="button" data-clear-reading-position>从头开始</button>
  </div>
  <div class="lesson-reading-progress" role="progressbar" aria-label="本课阅读进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-lesson-reading-progress></span></div>`;
  const heading = content.querySelector(":scope > .lesson-heading");
  if (heading) heading.insertAdjacentElement("afterend", toc);
  else content.prepend(toc);
  updateActiveLessonToc();
}

function scrollToLessonSection(sectionId) {
  const content = document.getElementById("lesson-content");
  const target = document.getElementById(sectionId);
  const toc = content.querySelector(".lesson-toc");
  if (!target || !toc) return;
  const top = target.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - toc.offsetHeight - 14;
  content.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  setActiveLessonToc(sectionId);
}

function scrollLessonToTop() {
  document.getElementById("lesson-content").scrollTo({ top: 0, behavior: "smooth" });
  if (activeLessonTocSections[0]) setActiveLessonToc(activeLessonTocSections[0].id);
}
