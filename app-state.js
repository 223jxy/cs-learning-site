"use strict";

let allLessonsCache = null;
let allExtensionCoursesCache = null;
const lessonSearchTextCache = new WeakMap();
let state = null;
let activeLessonId = null;
let activeExtensionModule = null;
let activeExtensionCourseId = null;
let activePortfolioProjectId = null;
let activeAILessonId = null;
let activeAIGuideId = null;
let activeAITermId = null;
let aiReaderReturnContext = null;
let activeAITab = "overview";
let activeAIModule = "all";
let activeAIType = "all";
let activeAIGlossaryCategory = "all";
let activeAIGlossaryLevel = "all";
let activeAIGlossaryStatus = "all";
let activeAIAnatomyMode = "data";
let activeAIAnatomyStep = 0;
let activeAIGovernanceStage = "requirements";
let activeFilter = "all";
let activeLibraryStatus = "all";
let activeLibrarySort = "route";
let activeReferenceProvider = "all";
let activeReferenceCourseId = null;
let activeResourceRoute = "all";
let activeResourceProvider = "all";
let activePortfolioRoute = "all";
let activeMistakeSource = "all";
let activeMistakeGroup = "all";
let activeMistakeReviewStatus = "all";
let activeMistakeSort = "recent";
let activeNoteTag = "all";
let noteTagSearchQuery = "";
let activeReadingKind = "all";
let activeReadingQuery = "";
let activeReadingSort = "recent";
let activeReadingEvidence = "all";
let showAllReadingPositions = false;
let activeRoadmapMode = "current";
let activeFutureScope = "all";
const selectedNoteKeys = new Set();
let toastTimer = null;
let lastFocusedElement = null;
let activeLessonTocSections = [];
let renderedReadingKey = "";
let readingPositionSaveTimer = null;

// 生成当前版本的本地学习状态骨架。
function createFallbackState() {
  return {
    completedLessons: [],
    completedTasks: {},
    activityDates: [],
    firstVisit: new Date().toISOString(),
    quizResults: {},
    lessonNotes: {},
    practiceEvidence: {},
    practiceRecords: {},
    practiceAttempts: [],
    reviewedMistakes: {},
    extensionProgress: {
      completedExtensionLessons: [],
      extensionNotes: {},
      extensionQuizResults: {}
    },
    aiZoneProgress: {
      completedLessons: [],
      completedGuides: [],
      lessonNotes: {},
      guideNotes: {},
      quizResults: {},
      labResults: {},
      paperProgress: {},
      favoriteTermIds: [],
      recentTermIds: [],
      lastLessonId: "",
      lastGuideId: "",
      updatedAt: ""
    },
    settings: {
      completionMode: "manual",
      resumeReading: true,
      fontSize: "standard",
      readingDensity: "comfortable",
      highContrast: false,
      reduceMotion: false
    },
    readingPositions: {},
    portfolioProgress: {},
    lastLearningActivityAt: "",
    lastExportedAt: ""
  };
}

function isPlainRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

// 对旧版本状态和导入文件做兼容整理，只保留本项目认识的数据字段。
function normalizeState(source = {}) {
  const fallback = createFallbackState();
  const knownLessonIds = new Set(stages.flatMap((stage) => stage.lessons.map((lesson) => lesson.id)));
  const knownTaskIds = new Set(dailyTasks.map((task) => task.id));
  const knownExtensionIds = new Set(extensionCourses.map((course) => course.id));
  const knownAILessonIds = new Set((window.aiZoneData?.lessons || []).map((lesson) => lesson.id));
  const knownAILabIds = new Set((window.aiZoneData?.labs || []).map((lab) => lab.id));
  const knownAIPaperIds = new Set((window.aiZoneData?.papers || []).map((paper) => paper.id));
  const knownAIGuideIds = new Set((window.aiFoundationData?.guides || []).map((guide) => guide.id));
  const knownAITermIds = new Set((window.aiFoundationData?.terms || []).map((term) => term.id));
  const knownPortfolioIds = new Set(getPortfolioProjects().map((project) => project.id));
  const knownPortfolioStatuses = new Set(portfolioStatusOptions.map((status) => status.id));
  const safeSource = isPlainRecord(source) ? source : {};
  const completedLessons = Array.isArray(safeSource.completedLessons)
    ? [...new Set(safeSource.completedLessons.filter((id) => knownLessonIds.has(id)))]
    : fallback.completedLessons;
  const activityDates = Array.isArray(safeSource.activityDates)
    ? [...new Set(safeSource.activityDates.filter((date) => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)))]
    : fallback.activityDates;
  const completedTasks = Object.create(null);
  if (isPlainRecord(safeSource.completedTasks)) {
    Object.entries(safeSource.completedTasks).forEach(([date, taskMap]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isPlainRecord(taskMap)) return;
      completedTasks[date] = Object.create(null);
      Object.entries(taskMap).forEach(([taskId, checked]) => {
        if (knownTaskIds.has(taskId)) completedTasks[date][taskId] = Boolean(checked);
      });
    });
  }
  const quizResults = Object.create(null);
  if (isPlainRecord(safeSource.quizResults)) {
    Object.entries(safeSource.quizResults).forEach(([lessonId, result]) => {
      if (!knownLessonIds.has(lessonId) || !isPlainRecord(result)) return;
      const lesson = getAllLessons().find((item) => item.id === lessonId);
      const questionCount = Array.isArray(lesson?.quiz) && lesson.quiz.length ? lesson.quiz.length : 3;
      const answers = Array.isArray(result.answers)
        ? result.answers.slice(0, questionCount).map(Number).filter((value) => Number.isInteger(value) && value >= 0 && value < 4)
        : [];
      if (!answers.length) return;
      quizResults[lessonId] = {
        answers,
        score: Math.max(0, Math.min(questionCount, Number(result.score) || 0)),
        total: Math.max(1, Math.min(questionCount, Number(result.total) || answers.length)),
        checkedAt: typeof result.checkedAt === "string" ? result.checkedAt : ""
      };
    });
  }
  const lessonNotes = Object.create(null);
  if (isPlainRecord(safeSource.lessonNotes)) {
    Object.entries(safeSource.lessonNotes).forEach(([lessonId, note]) => {
      if (!knownLessonIds.has(lessonId)) return;
      const content = isPlainRecord(note) ? note.content : note;
      const updatedAt = isPlainRecord(note) ? note.updatedAt : "";
      const tags = isPlainRecord(note) ? normalizeNoteTags(note.tags) : [];
      if (typeof content !== "string" || !content.trim()) return;
      lessonNotes[lessonId] = {
        content: content.slice(0, 12000),
        updatedAt: typeof updatedAt === "string" ? updatedAt : "",
        tags
      };
    });
  }
  const practiceEvidence = Object.create(null);
  if (isPlainRecord(safeSource.practiceEvidence)) {
    Object.entries(safeSource.practiceEvidence).forEach(([lessonId, evidence]) => {
      if (!knownLessonIds.has(lessonId) || !isPlainRecord(evidence)) return;
      const summary = typeof evidence.summary === "string" ? evidence.summary.trim().slice(0, 3000) : "";
      const status = ["done", "blocked", "rerun-needed"].includes(evidence.status) ? evidence.status : "done";
      const updatedAt = typeof evidence.updatedAt === "string" && !Number.isNaN(Date.parse(evidence.updatedAt)) ? evidence.updatedAt : "";
      if (!summary || !updatedAt) return;
      practiceEvidence[lessonId] = {
        status,
        summary,
        command: typeof evidence.command === "string" ? evidence.command.slice(0, 300) : "",
        updatedAt
      };
    });
  }
  const practiceRecords = Object.create(null);
  if (isPlainRecord(safeSource.practiceRecords)) {
    Object.entries(safeSource.practiceRecords).slice(0, 2000).forEach(([practiceId, record]) => {
      if (!isPlainRecord(record) || !getPracticeById(practiceId)) return;
      const status = ["todo", "in-progress", "done", "blocked"].includes(record.status) ? record.status : "todo";
      const command = typeof record.command === "string" ? record.command.trim().slice(0, 300) : "";
      const output = typeof record.output === "string" ? record.output.trim().slice(0, 2000) : "";
      const note = typeof record.note === "string" ? record.note.trim().slice(0, 3000) : "";
      const checkedAt = typeof record.checkedAt === "string" && !Number.isNaN(Date.parse(record.checkedAt)) ? record.checkedAt : "";
      if (status === "todo" && !command && !output && !note) return;
      const assessment = normalizePracticeAssessment(record.assessment);
      const context = getPracticeById(practiceId);
      const verificationCheck = record.verification && context ? validatePracticeVerificationArtifact(record.verification, context.lesson, context.practice) : { ok: false };
      const verification = verificationCheck.ok ? verificationCheck.verification : null;
      const safeAssessment = assessment?.source === "runner" && !verification ? null : assessment;
      practiceRecords[practiceId] = { status, command, output, note, checkedAt, ...(safeAssessment ? { assessment: safeAssessment } : {}), ...(verification ? { verification } : {}) };
    });
  }
  const practiceAttempts = (Array.isArray(safeSource.practiceAttempts) ? safeSource.practiceAttempts : []).slice(-1000).map((attempt) => {
    const context = isPlainRecord(attempt) ? getPracticeById(attempt.practiceId) : null;
    if (!context) return null;
    const status = ["todo", "in-progress", "done", "blocked"].includes(attempt.status) ? attempt.status : "todo";
    const checkedAt = typeof attempt.checkedAt === "string" && !Number.isNaN(Date.parse(attempt.checkedAt)) ? attempt.checkedAt : "";
    const assessment = normalizePracticeAssessment(attempt.assessment);
    const verificationCheck = attempt.verification
      ? validatePracticeVerificationArtifact(attempt.verification, context.lesson, context.practice)
      : { ok: false };
    const verification = verificationCheck.ok ? verificationCheck.verification : null;
    const safeAssessment = assessment?.source === "runner" && !verification ? null : assessment;
    return checkedAt && safeAssessment
      ? { practiceId: attempt.practiceId, status, assessment: safeAssessment, checkedAt, ...(verification ? { verification } : {}) }
      : null;
  }).filter(Boolean);
  const safeExtensionProgress = isPlainRecord(safeSource.extensionProgress) ? safeSource.extensionProgress : {};
  const safeSettings = isPlainRecord(safeSource.settings) ? safeSource.settings : {};
  const completionMode = ["manual", "auto"].includes(safeSettings.completionMode) ? safeSettings.completionMode : "manual";
  const resumeReading = typeof safeSettings.resumeReading === "boolean" ? safeSettings.resumeReading : true;
  const fontSize = ["small", "standard", "large"].includes(safeSettings.fontSize) ? safeSettings.fontSize : "standard";
  const readingDensity = ["compact", "comfortable"].includes(safeSettings.readingDensity) ? safeSettings.readingDensity : "comfortable";
  const highContrast = typeof safeSettings.highContrast === "boolean" ? safeSettings.highContrast : false;
  const reduceMotion = typeof safeSettings.reduceMotion === "boolean" ? safeSettings.reduceMotion : false;
  const completedExtensionLessons = Array.isArray(safeExtensionProgress.completedExtensionLessons)
    ? [...new Set(safeExtensionProgress.completedExtensionLessons.filter((id) => knownExtensionIds.has(id)))]
    : fallback.extensionProgress.completedExtensionLessons;
  const extensionNotes = Object.create(null);
  if (isPlainRecord(safeExtensionProgress.extensionNotes)) {
    Object.entries(safeExtensionProgress.extensionNotes).forEach(([courseId, note]) => {
      if (!knownExtensionIds.has(courseId)) return;
      const content = isPlainRecord(note) ? note.content : note;
      const updatedAt = isPlainRecord(note) ? note.updatedAt : "";
      const tags = isPlainRecord(note) ? normalizeNoteTags(note.tags) : [];
      if (typeof content !== "string" || !content.trim()) return;
      extensionNotes[courseId] = {
        content: content.slice(0, 12000),
        updatedAt: typeof updatedAt === "string" ? updatedAt : "",
        tags
      };
    });
  }
  const extensionQuizResults = Object.create(null);
  if (isPlainRecord(safeExtensionProgress.extensionQuizResults)) {
    Object.entries(safeExtensionProgress.extensionQuizResults).forEach(([courseId, result]) => {
      if (!knownExtensionIds.has(courseId) || !isPlainRecord(result)) return;
      const answers = Array.isArray(result.answers)
        ? result.answers.slice(0, 3).map(Number).filter((value) => Number.isInteger(value) && value >= 0 && value < 4)
        : [];
      if (!answers.length) return;
      extensionQuizResults[courseId] = {
        answers,
        score: Math.max(0, Math.min(3, Number(result.score) || 0)),
        total: Math.max(1, Math.min(3, Number(result.total) || answers.length)),
        checkedAt: typeof result.checkedAt === "string" ? result.checkedAt : ""
      };
    });
  }
  const portfolioProgress = Object.create(null);
  if (isPlainRecord(safeSource.portfolioProgress)) {
    Object.entries(safeSource.portfolioProgress).forEach(([projectId, progress]) => {
      if (!knownPortfolioIds.has(projectId) || !isPlainRecord(progress)) return;
      const status = knownPortfolioStatuses.has(progress.status) ? progress.status : "not-started";
      portfolioProgress[projectId] = {
        status,
        updatedAt: typeof progress.updatedAt === "string" ? progress.updatedAt : ""
      };
    });
  }
  const safeAIProgress = isPlainRecord(safeSource.aiZoneProgress) ? safeSource.aiZoneProgress : {};
  const completedAILessons = Array.isArray(safeAIProgress.completedLessons)
    ? [...new Set(safeAIProgress.completedLessons.filter((id) => knownAILessonIds.has(id)))]
    : fallback.aiZoneProgress.completedLessons;
  const completedAIGuides = Array.isArray(safeAIProgress.completedGuides)
    ? [...new Set(safeAIProgress.completedGuides.filter((id) => knownAIGuideIds.has(id)))]
    : fallback.aiZoneProgress.completedGuides;
  const aiLessonNotes = Object.create(null);
  if (isPlainRecord(safeAIProgress.lessonNotes)) {
    Object.entries(safeAIProgress.lessonNotes).forEach(([lessonId, note]) => {
      if (!knownAILessonIds.has(lessonId)) return;
      const content = isPlainRecord(note) ? note.content : note;
      if (typeof content !== "string" || !content.trim()) return;
      aiLessonNotes[lessonId] = {
        content: content.slice(0, 12000),
        tags: isPlainRecord(note) ? normalizeNoteTags(note.tags) : [],
        updatedAt: isPlainRecord(note) && typeof note.updatedAt === "string" ? note.updatedAt : ""
      };
    });
  }
  const aiQuizResults = Object.create(null);
  if (isPlainRecord(safeAIProgress.quizResults)) {
    Object.entries(safeAIProgress.quizResults).forEach(([lessonId, result]) => {
      if (!knownAILessonIds.has(lessonId) || !isPlainRecord(result)) return;
      const answers = Array.isArray(result.answers) ? result.answers.slice(0, 6).map(Number) : [];
      if (answers.some((value) => !Number.isInteger(value) || value < 0 || value > 3) || !answers.length) return;
      aiQuizResults[lessonId] = { answers, score: Math.max(0, Math.min(6, Number(result.score) || 0)), total: 6, checkedAt: typeof result.checkedAt === "string" ? result.checkedAt : "" };
    });
  }
  const aiLabResults = Object.create(null);
  if (isPlainRecord(safeAIProgress.labResults)) {
    Object.entries(safeAIProgress.labResults).forEach(([labId, result]) => {
      if (!knownAILabIds.has(labId) || !isPlainRecord(result)) return;
      aiLabResults[labId] = { ranAt: typeof result.ranAt === "string" ? result.ranAt : "", passed: Boolean(result.passed), summary: typeof result.summary === "string" ? result.summary.slice(0, 2000) : "" };
    });
  }
  const aiPaperProgress = Object.create(null);
  if (isPlainRecord(safeAIProgress.paperProgress)) {
    Object.entries(safeAIProgress.paperProgress).forEach(([paperId, progress]) => {
      if (!knownAIPaperIds.has(paperId) || !isPlainRecord(progress)) return;
      const status = ["unread", "reading", "done"].includes(progress.status) ? progress.status : "unread";
      aiPaperProgress[paperId] = {
        status,
        updatedAt: typeof progress.updatedAt === "string" ? progress.updatedAt : ""
      };
    });
  }
  const aiGuideNotes = Object.create(null);
  if (isPlainRecord(safeAIProgress.guideNotes)) {
    Object.entries(safeAIProgress.guideNotes).forEach(([guideId, note]) => {
      if (!knownAIGuideIds.has(guideId)) return;
      const content = isPlainRecord(note) ? note.content : note;
      if (typeof content !== "string" || !content.trim()) return;
      aiGuideNotes[guideId] = {
        content: content.slice(0, 12000),
        tags: isPlainRecord(note) ? normalizeNoteTags(note.tags) : [],
        updatedAt: isPlainRecord(note) && typeof note.updatedAt === "string" ? note.updatedAt : ""
      };
    });
  }
  const favoriteTermIds = Array.isArray(safeAIProgress.favoriteTermIds)
    ? [...new Set(safeAIProgress.favoriteTermIds.filter((id) => knownAITermIds.has(id)))].slice(0, 320)
    : fallback.aiZoneProgress.favoriteTermIds;
  const recentTermIds = Array.isArray(safeAIProgress.recentTermIds)
    ? [...new Set(safeAIProgress.recentTermIds.filter((id) => knownAITermIds.has(id)))].slice(0, 50)
    : fallback.aiZoneProgress.recentTermIds;
  const reviewedMistakes = Object.create(null);
  if (isPlainRecord(safeSource.reviewedMistakes)) {
    Object.entries(safeSource.reviewedMistakes).slice(0, 2000).forEach(([key, reviewedAt]) => {
      if (typeof key !== "string" || key.length > 240 || !/^(mainline|extension|ai-zone):/.test(key)) return;
      if (typeof reviewedAt !== "string" || Number.isNaN(Date.parse(reviewedAt))) return;
      reviewedMistakes[key] = reviewedAt;
    });
  }
  const knownReadingKeys = new Set(
    [...knownLessonIds].map((id) => `main:${id}`)
      .concat([...knownExtensionIds].map((id) => `extension:${id}`))
      .concat([...knownAILessonIds].map((id) => `ai:${id}`))
      .concat([...knownAIGuideIds].map((id) => `ai-guide:${id}`))
  );
  const readingPositions = Object.create(null);
  if (resumeReading && isPlainRecord(safeSource.readingPositions)) {
    Object.entries(safeSource.readingPositions).slice(0, 500).forEach(([key, position]) => {
      if (!knownReadingKeys.has(key) || !isPlainRecord(position)) return;
      const sectionTitle = typeof position.sectionTitle === "string" ? position.sectionTitle.trim().slice(0, 160) : "";
      const sectionIndex = Number(position.sectionIndex);
      const sectionOffset = Number(position.sectionOffset);
      const ratio = Number(position.ratio);
      const updatedAt = typeof position.updatedAt === "string" && !Number.isNaN(Date.parse(position.updatedAt)) ? position.updatedAt : "";
      if (!Number.isInteger(sectionIndex) || sectionIndex < 0 || sectionIndex > 200) return;
      if (!Number.isFinite(sectionOffset) || Math.abs(sectionOffset) > 10000000) return;
      if (!Number.isFinite(ratio) || ratio <= 0 || ratio >= 1 || !updatedAt) return;
      readingPositions[key] = {
        sectionTitle,
        sectionIndex,
        sectionOffset,
        ratio,
        percent: Math.max(1, Math.min(99, Math.round(Number(position.percent) || ratio * 100))),
        updatedAt
      };
    });
  }
  return {
    completedLessons,
    completedTasks,
    activityDates,
    firstVisit: typeof safeSource.firstVisit === "string" && !Number.isNaN(Date.parse(safeSource.firstVisit)) ? safeSource.firstVisit : fallback.firstVisit,
    quizResults,
    lessonNotes,
    practiceEvidence,
    practiceRecords,
    practiceAttempts,
    reviewedMistakes,
    extensionProgress: {
      completedExtensionLessons,
      extensionNotes,
      extensionQuizResults
    },
    aiZoneProgress: {
      completedLessons: completedAILessons,
      completedGuides: completedAIGuides,
      lessonNotes: aiLessonNotes,
      guideNotes: aiGuideNotes,
      quizResults: aiQuizResults,
      labResults: aiLabResults,
      paperProgress: aiPaperProgress,
      favoriteTermIds,
      recentTermIds,
      lastLessonId: knownAILessonIds.has(safeAIProgress.lastLessonId) ? safeAIProgress.lastLessonId : "",
      lastGuideId: knownAIGuideIds.has(safeAIProgress.lastGuideId) ? safeAIProgress.lastGuideId : "",
      updatedAt: typeof safeAIProgress.updatedAt === "string" ? safeAIProgress.updatedAt : ""
    },
    settings: {
      completionMode,
      resumeReading,
      fontSize,
      readingDensity,
      highContrast,
      reduceMotion
    },
    readingPositions,
    portfolioProgress,
    lastLearningActivityAt: typeof safeSource.lastLearningActivityAt === "string" && !Number.isNaN(Date.parse(safeSource.lastLearningActivityAt))
      ? safeSource.lastLearningActivityAt
      : fallback.lastLearningActivityAt,
    lastExportedAt: typeof safeSource.lastExportedAt === "string" ? safeSource.lastExportedAt : fallback.lastExportedAt
  };
}

// 从浏览器本地存储读取学习状态，并补齐首次使用所需字段。
function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch (error) {
    console.warn("学习进度读取失败，将使用新的本地记录。", error);
    return createFallbackState();
  }
}

// 将学习进度持久化在当前浏览器，并记录发生学习行为的日期。
function saveState(recordActivity = false) {
  if (recordActivity) {
    const now = new Date();
    const today = getLocalDateKey(now);
    if (!state.activityDates.includes(today)) state.activityDates.push(today);
    state.lastLearningActivityAt = now.toISOString();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hasLearningData() {
  const completedTaskCount = Object.values(state.completedTasks || {}).reduce((total, taskMap) => total + Object.values(taskMap || {}).filter(Boolean).length, 0);
  const aiProgress = state.aiZoneProgress || {};
  const extensionProgress = state.extensionProgress || {};
  return Boolean(
    state.completedLessons.length || completedTaskCount || state.activityDates.length ||
    Object.keys(state.quizResults || {}).length || Object.keys(state.lessonNotes || {}).length ||
    Object.keys(state.practiceEvidence || {}).length || Object.keys(state.reviewedMistakes || {}).length ||
    Object.keys(state.practiceRecords || {}).length || state.practiceAttempts?.length ||
    Object.keys(state.readingPositions || {}).length ||
    extensionProgress.completedExtensionLessons?.length || Object.keys(extensionProgress.extensionNotes || {}).length ||
    Object.keys(extensionProgress.extensionQuizResults || {}).length ||
    aiProgress.completedLessons?.length || aiProgress.completedGuides?.length ||
    Object.keys(aiProgress.lessonNotes || {}).length || Object.keys(aiProgress.guideNotes || {}).length ||
    Object.keys(aiProgress.quizResults || {}).length || Object.keys(aiProgress.labResults || {}).length ||
    Object.keys(aiProgress.paperProgress || {}).length || aiProgress.favoriteTermIds?.length || aiProgress.recentTermIds?.length ||
    Object.keys(state.portfolioProgress || {}).length
  );
}

function getBackupReminderState(now = new Date()) {
  const exportedAt = Date.parse(state.lastExportedAt || "");
  if (!hasLearningData()) return { level: "idle", title: "暂无学习数据", detail: "开始学习后可导出一份本地备份。" };
  if (Number.isNaN(exportedAt)) return { level: "due", title: "建议首次备份", detail: "已有学习记录，导出 JSON 可防止清理浏览器后丢失。" };
  const lastActivityAt = Date.parse(state.lastLearningActivityAt || "");
  const hasNewActivity = !Number.isNaN(lastActivityAt) && lastActivityAt > exportedAt;
  if (now.getTime() - exportedAt >= 7 * 86400000 && hasNewActivity) {
    return { level: "due", title: "备份可以更新了", detail: "上次导出后有新的学习记录，建议重新导出。" };
  }
  return { level: "current", title: "备份状态正常", detail: hasNewActivity ? "已有少量新记录，满 7 天后会提醒更新。" : "当前学习记录已包含在最近一次导出中。" };
}
