"use strict";

// 把所有阶段中的课程展开为带阶段信息的一维列表。
function getAllLessons() {
  if (allLessonsCache) return allLessonsCache;
  allLessonsCache = stages.flatMap((stage) => stage.lessons.map((lesson) => {
    const generatedProfile = window.buildStageLessonProfile?.(lesson, stage.id) || {};
    return {
      ...lesson,
      ...generatedProfile,
      ...(window.foundationHighDensityProfiles?.[lesson.id] || {}),
      ...(window.stage1HighDensityProfiles?.[lesson.id] || {}),
      ...(window.stage2HighDensityProfiles?.[lesson.id] || {}),
      ...(window.stage3HighDensityProfiles?.[lesson.id] || {}),
      ...(window.stage4HighDensityProfiles?.[lesson.id] || {}),
      ...(window.stageSampleDeepDiveProfiles?.[lesson.id] || {}),
      ...(window.foundationPracticeLabs?.[lesson.id] ? { lab: window.foundationPracticeLabs[lesson.id] } : {}),
      stageId: stage.id,
      stageTitle: stage.title
    };
  }));
  return allLessonsCache;
}

// 根据课程标识查找课程及其所属阶段。
function getLesson(lessonId) {
  return getAllLessons().find((lesson) => lesson.id === lessonId);
}

function getPracticeRecordId(lessonId, practiceIndex) {
  return `${lessonId}:practice-${Number(practiceIndex) + 1}`;
}

function getLessonPractices(lesson) {
  return (Array.isArray(lesson?.practices) ? lesson.practices : []).map((practice, index) => ({
    ...practice,
    id: getPracticeRecordId(lesson.id, index),
    index
  }));
}

function getPracticeById(practiceId) {
  const match = /^(.+):practice-(\d+)$/.exec(String(practiceId || ""));
  const lesson = match ? getLesson(match[1]) : null;
  const practice = lesson ? getLessonPractices(lesson)[Number(match[2]) - 1] : null;
  return lesson && practice?.id === practiceId ? { lesson, practice } : null;
}

const PRACTICE_VERIFICATION_SCHEMA = "computer-learning-practice-verification/v1";

function stablePracticeFingerprint(value) {
  const source = typeof value === "string" ? value : JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function getPracticeVerificationBinding(lesson, practice) {
  if (!lesson?.lab || practice?.index !== 1) return null;
  return {
    lessonId: lesson.id,
    practiceId: practice.id,
    runtime: lesson.lab.runtime,
    command: lesson.lab.command,
    labFingerprint: stablePracticeFingerprint({
      title: lesson.lab.title,
      runtime: lesson.lab.runtime,
      command: lesson.lab.command,
      files: lesson.lab.files,
      code: lesson.lab.code,
      expected: lesson.lab.expected,
      checks: lesson.lab.checks
    })
  };
}

function getPracticeVerificationRunnerCommand(lessonId) {
  return `node scripts\\run-practice-verification.js --lesson ${String(lessonId || "")}`;
}

function normalizePracticeVerification(value) {
  if (!isPlainRecord(value) || value.schema !== PRACTICE_VERIFICATION_SCHEMA) return null;
  const checks = Array.isArray(value.checks) ? value.checks.slice(0, 32).map((check) => ({
    id: typeof check?.id === "string" ? check.id.slice(0, 80) : "",
    label: typeof check?.label === "string" ? check.label.trim().slice(0, 200) : "",
    passed: Boolean(check?.passed),
    actual: typeof check?.actual === "string" ? check.actual.trim().slice(0, 300) : ""
  })).filter((check) => check.id && check.label) : [];
  const startedAt = typeof value.startedAt === "string" && !Number.isNaN(Date.parse(value.startedAt)) ? value.startedAt : "";
  const finishedAt = typeof value.finishedAt === "string" && !Number.isNaN(Date.parse(value.finishedAt)) ? value.finishedAt : "";
  const exitCode = Number(value.exitCode);
  if (!value.lessonId || !value.practiceId || !value.runtime || !value.command || !startedAt || !finishedAt || !Number.isInteger(exitCode) || !checks.length) return null;
  return {
    schema: PRACTICE_VERIFICATION_SCHEMA,
    runnerVersion: typeof value.runnerVersion === "string" ? value.runnerVersion.slice(0, 24) : "1",
    lessonId: String(value.lessonId).slice(0, 120),
    practiceId: String(value.practiceId).slice(0, 160),
    labFingerprint: typeof value.labFingerprint === "string" ? value.labFingerprint.slice(0, 32) : "",
    runtime: String(value.runtime).slice(0, 32),
    command: String(value.command).slice(0, 300),
    startedAt,
    finishedAt,
    exitCode,
    passed: Boolean(value.passed),
    checks,
    outputSummary: typeof value.outputSummary === "string" ? value.outputSummary.trim().slice(0, 2400) : "",
    artifactFingerprint: typeof value.artifactFingerprint === "string" ? value.artifactFingerprint.slice(0, 32) : ""
  };
}

function getPracticeVerificationFingerprintPayload(verification) {
  const { artifactFingerprint, ...payload } = verification;
  return payload;
}

function getPracticeVerificationFingerprint(verification) {
  return stablePracticeFingerprint(getPracticeVerificationFingerprintPayload(verification));
}

function validatePracticeVerificationArtifact(value, lesson, practice) {
  const verification = normalizePracticeVerification(value);
  const binding = getPracticeVerificationBinding(lesson, practice);
  const errors = [];
  if (!binding) errors.push("这项练习没有固定验收脚本");
  if (!verification) errors.push("验收结果文件格式不完整");
  if (binding && verification) {
    if (verification.lessonId !== binding.lessonId || verification.practiceId !== binding.practiceId) errors.push("课程或练习 ID 不匹配");
    if (verification.runtime !== binding.runtime || verification.command !== binding.command) errors.push("运行时或命令与当前课程不匹配");
    if (verification.labFingerprint !== binding.labFingerprint) errors.push("验收脚本已更新，请重新运行");
    if (verification.artifactFingerprint !== getPracticeVerificationFingerprint(verification)) errors.push("结果指纹校验失败");
    if (verification.passed !== (verification.exitCode === 0 && verification.checks.every((check) => check.passed))) errors.push("结果汇总与逐项检查不一致");
  }
  return { ok: errors.length === 0, errors, verification, binding };
}

function buildPracticeVerificationAssessment(verification) {
  const passedChecks = verification.checks.filter((check) => check.passed).length;
  const result = verification.passed ? "passed" : "failed";
  const reasons = [`真实脚本 ${passedChecks}/${verification.checks.length} 项通过`, `退出码 ${verification.exitCode}`];
  const failed = verification.checks.filter((check) => !check.passed).map((check) => check.label).slice(0, 4);
  if (failed.length) reasons.push(`未通过：${failed.join("、")}`);
  return { result, score: verification.passed ? 100 : 0, reasons, checkedAt: verification.finishedAt, source: "runner", version: 2 };
}

function normalizePracticeAssessment(value) {
  if (!isPlainRecord(value)) return null;
  const result = ["passed", "failed", "review"].includes(value.result) ? value.result : "";
  const score = Math.max(0, Math.min(100, Math.round(Number(value.score))));
  const checkedAt = typeof value.checkedAt === "string" && !Number.isNaN(Date.parse(value.checkedAt)) ? value.checkedAt : "";
  if (!result || !Number.isFinite(score) || !checkedAt) return null;
  const reasons = Array.isArray(value.reasons)
    ? value.reasons.map((item) => String(item).trim().slice(0, 120)).filter(Boolean).slice(0, 6)
    : [];
  const source = value.source === "runner" ? "runner" : "rule";
  return { result, score, reasons, checkedAt, source, version: source === "runner" ? 2 : 1 };
}

function assessPracticeRecord(practice, draft = {}, checkedAt = new Date().toISOString()) {
  const status = ["todo", "in-progress", "done", "blocked"].includes(draft.status) ? draft.status : "todo";
  const command = String(draft.command || "").trim();
  const output = String(draft.output || "").trim();
  const note = String(draft.note || "").trim();
  const positivePattern = /(?:\bpass(?:ed)?\b|\bsuccess(?:ful(?:ly)?)?\b|exit(?:\s+code)?\s*[:=]?\s*0\b|通过|成功|符合预期|完成验收)/i;
  const negativePattern = /(?:\bfail(?:ed|ure)?\b|\berror\b|\bexception\b|\bdenied\b|exit(?:\s+code)?\s*[:=]?\s*[1-9]\d*\b|失败|报错|异常|未通过|拒绝访问)/i;
  const outputHasPositiveSignal = positivePattern.test(output);
  const hasPositiveSignal = outputHasPositiveSignal || positivePattern.test(note);
  const hasNegativeSignal = (negativePattern.test(output) && !outputHasPositiveSignal) || (!output && negativePattern.test(note));
  let score = status === "done" ? 20 : status === "in-progress" ? 10 : 0;
  const reasons = [];
  if (command) { score += 10; reasons.push("已记录执行入口"); }
  if (output.length >= 24) { score += 30; reasons.push("输出证据较完整"); }
  else if (output.length >= 8) { score += 18; reasons.push("已记录输出摘要"); }
  else reasons.push("输出证据不足");
  if (note.length >= 24) { score += 20; reasons.push("包含复盘或边界说明"); }
  else if (note.length >= 8) { score += 10; reasons.push("已记录简短复盘"); }
  if (hasPositiveSignal) { score += 20; reasons.push("发现通过或成功信号"); }
  if (hasNegativeSignal || status === "blocked") {
    reasons.push("发现失败、异常或阻塞信号");
    return { result: "failed", score: Math.min(49, score), reasons: reasons.slice(0, 6), checkedAt, version: 1 };
  }
  const result = score >= 70 && (status === "done" || hasPositiveSignal) ? "passed" : "review";
  if (result === "review") reasons.push(`证据尚未达到自动通过阈值（${practice?.level || "练习"}）`);
  return { result, score: Math.min(100, score), reasons: reasons.slice(0, 6), checkedAt, version: 1 };
}

function formatPracticeAssessmentResult(result) {
  return { passed: "自动通过", failed: "自动未通过", review: "需要复核" }[result] || "尚未判定";
}

function formatPracticeAssessmentLabel(assessment) {
  if (assessment?.source === "runner") return assessment.result === "passed" ? "脚本通过" : "脚本未通过";
  return formatPracticeAssessmentResult(assessment?.result);
}

function getPracticeRecordScore(record = {}) {
  const assessment = normalizePracticeAssessment(record.assessment);
  if (assessment) return assessment.score;
  return { done: 100, "in-progress": 50, blocked: 20, todo: 0 }[record.status] || 0;
}

function hasLessonPracticeRecords(lessonId) {
  const prefix = `${lessonId}:practice-`;
  return Object.keys(state.practiceRecords || {}).some((practiceId) => practiceId.startsWith(prefix));
}

function getLessonSearchText(lesson) {
  if (lessonSearchTextCache.has(lesson)) return lessonSearchTextCache.get(lesson);
  const searchText = [
    lesson.title,
    lesson.summary,
    lesson.stageTitle,
    ...(lesson.concepts || []),
    ...(lesson.objectives || []),
    ...(lesson.prerequisites || []),
    ...(lesson.deepDive || []),
    ...(lesson.troubleshooting || []),
    ...(lesson.takeaways || []),
    ...(lesson.knowledgePoints || []).flatMap((item) => [item.term, item.detail, item.misconception]),
    ...(lesson.mistakes || []).flatMap((item) => [item.wrong, item.why, item.correct]),
    ...(lesson.practices || []).flatMap((item) => [item.level, item.title, item.task, item.evidence]),
    lesson.lab?.title,
    lesson.lab?.runtime,
    lesson.lab?.command,
    lesson.lab?.code,
    ...(lesson.lab?.expected || []),
    ...(lesson.lab?.cases || []),
    ...(lesson.lab?.checks || []),
    ...(lesson.references || []).flatMap((item) => [item.title, item.usage])
  ].filter(Boolean).join(" ").toLowerCase();
  lessonSearchTextCache.set(lesson, searchText);
  return searchText;
}

// 对动态文本做 HTML 转义，避免后续接入外部内容时直接注入 DOM。
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function normalizeNoteTags(value) {
  const source = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[,，]/) : [];
  const seen = new Set();
  return source.map((item) => String(item).trim().replace(/^#/, "").slice(0, 24)).filter((item) => {
    const key = item.toLowerCase();
    if (!item || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
}

// 课程派生函数与标签清洗函数就绪后再读取本地状态，避免跨脚本提前初始化。
state = loadState();

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightSearchTerm(value, query) {
  const source = String(value || "");
  const term = String(query || "").trim();
  if (!term) return escapeHTML(source);
  const matcher = new RegExp(escapeRegExp(term), "gi");
  let cursor = 0;
  let output = "";
  source.replace(matcher, (match, offset) => {
    output += escapeHTML(source.slice(cursor, offset));
    output += `<mark class="search-highlight">${escapeHTML(match)}</mark>`;
    cursor = offset + match.length;
    return match;
  });
  return output + escapeHTML(source.slice(cursor));
}

function formatDateTime(value) {
  if (!value) return "尚未保存";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
}

function formatPracticeRecordStatus(status) {
  return {
    todo: "未开始",
    "in-progress": "进行中",
    done: "已完成",
    blocked: "遇到问题"
  }[status] || "已记录";
}

function getNoteCount() {
  return Object.values(state.lessonNotes || {}).filter((note) => note?.content?.trim()).length;
}

function getQuizCount() {
  return Object.keys(state.quizResults || {}).length;
}

function getReadingEntryStudyStatus(kind, id, readerKind = "") {
  if (kind === "main") {
    return { isComplete: state.completedLessons.includes(id), hasEvidence: Boolean(state.practiceEvidence?.[id] || hasLessonPracticeRecords(id) || state.quizResults?.[id]) };
  }
  if (kind === "extension") {
    const progress = getExtensionState();
    return { isComplete: progress.completedExtensionLessons.includes(id), hasEvidence: Boolean(progress.extensionQuizResults?.[id]) };
  }
  const progress = getAIProgress();
  const completed = readerKind === "guide" ? progress.completedGuides : progress.completedLessons;
  return { isComplete: completed.includes(id), hasEvidence: Boolean(progress.quizResults?.[id]) };
}

function countCompletedTaskEntries(targetState = state) {
  return Object.values(targetState.completedTasks || {}).reduce((sum, taskMap) => {
    if (!isPlainRecord(taskMap)) return sum;
    return sum + Object.values(taskMap).filter(Boolean).length;
  }, 0);
}

function getFutureRoute(routeCode) {
  return futureRoutes.find((route) => route.code === routeCode);
}

function getExtensionModule(routeCode, moduleIndex) {
  const route = getFutureRoute(routeCode);
  const index = Number(moduleIndex);
  if (!route || !Number.isInteger(index) || index < 0 || index >= route.modules.length) return null;
  return {
    route,
    index,
    title: route.modules[index],
    nextTitle: route.modules[index + 1] || "",
    previousTitle: route.modules[index - 1] || ""
  };
}

function getExtensionCoursesByRoute(routeCode) {
  return extensionCourses
    .filter((course) => course.routeCode === routeCode)
    .sort((a, b) => a.moduleIndex - b.moduleIndex || a.lessonIndex - b.lessonIndex);
}

function getExtensionCoursesByModule(routeCode, moduleIndex) {
  const index = Number(moduleIndex);
  return extensionCourses
    .filter((course) => course.routeCode === routeCode && course.moduleIndex === index)
    .sort((a, b) => a.lessonIndex - b.lessonIndex);
}

function getExtensionCourse(courseId) {
  return extensionCourses.find((course) => course.id === courseId);
}

function getAllExtensionCourses() {
  if (allExtensionCoursesCache) return allExtensionCoursesCache;
  allExtensionCoursesCache = [...extensionCourses].sort((a, b) => {
    const routeOrder = futureRoutes.findIndex((route) => route.code === a.routeCode) - futureRoutes.findIndex((route) => route.code === b.routeCode);
    return routeOrder || a.moduleIndex - b.moduleIndex || a.lessonIndex - b.lessonIndex;
  });
  return allExtensionCoursesCache;
}

function getPortfolioProject(projectId) {
  return getPortfolioProjects().find((project) => project.id === projectId);
}

function getPortfolioState() {
  state.portfolioProgress = isPlainRecord(state.portfolioProgress) ? state.portfolioProgress : Object.create(null);
  return state.portfolioProgress;
}

function getPortfolioProjectStatus(projectId) {
  const progress = getPortfolioState()[projectId];
  return portfolioStatusOptions.some((status) => status.id === progress?.status) ? progress.status : "not-started";
}

function getPortfolioStatusMeta(statusId) {
  return portfolioStatusOptions.find((status) => status.id === statusId) || portfolioStatusOptions[0];
}

function setPortfolioProjectStatus(projectId, status) {
  const project = getPortfolioProject(projectId);
  if (!project || !portfolioStatusOptions.some((option) => option.id === status)) return;
  getPortfolioState()[projectId] = { status, updatedAt: new Date().toISOString() };
  saveState(status !== "not-started");
  renderPortfolioProjects();
  if (activePortfolioProjectId === projectId) renderPortfolioProject(projectId);
  showToast(`项目状态已更新为：${getPortfolioStatusMeta(status).label}`);
}

function getExtensionCourseContext(course) {
  const route = getFutureRoute(course.routeCode);
  const module = getExtensionModule(course.routeCode, course.moduleIndex);
  return {
    route,
    module,
    routeTitle: route?.title || course.routeCode,
    moduleTitle: module?.title || `模块 ${course.moduleIndex + 1}`
  };
}

function getExtensionState() {
  state.extensionProgress = state.extensionProgress || { completedExtensionLessons: [], extensionNotes: {} };
  state.extensionProgress.completedExtensionLessons = Array.isArray(state.extensionProgress.completedExtensionLessons)
    ? state.extensionProgress.completedExtensionLessons
    : [];
  state.extensionProgress.extensionNotes = isPlainRecord(state.extensionProgress.extensionNotes)
    ? state.extensionProgress.extensionNotes
    : Object.create(null);
  state.extensionProgress.extensionQuizResults = isPlainRecord(state.extensionProgress.extensionQuizResults)
    ? state.extensionProgress.extensionQuizResults
    : Object.create(null);
  return state.extensionProgress;
}

function getAIData() {
  return window.aiZoneData || { modules: [], lessons: [], labs: [], papers: [], anatomyModes: [], governanceStages: [], governanceRisks: [], references: [] };
}

function getAIFoundationData() {
  return window.aiFoundationData || { categories: [], paths: [], terms: [], guides: [], sources: [] };
}

function getAITerm(termIdOrName) {
  const normalized = String(termIdOrName || "").trim().toLowerCase();
  return getAIFoundationData().terms.find((term) => term.id === termIdOrName
    || term.nameZh.toLowerCase() === normalized
    || term.nameEn.toLowerCase() === normalized
    || term.abbreviation?.toLowerCase() === normalized
    || term.aliases.some((alias) => alias.toLowerCase() === normalized));
}

function getAIGuide(guideId) {
  return getAIFoundationData().guides.find((guide) => guide.id === guideId);
}

function getAIPath(pathId) {
  return getAIFoundationData().paths.find((path) => path.id === pathId);
}

function getAISource(sourceId) {
  return getAIFoundationData().sources.find((source) => source.id === sourceId);
}

function getAILesson(lessonId) {
  return getAIData().lessons.find((lesson) => lesson.id === lessonId);
}

function getAILab(labId) {
  return getAIData().labs.find((lab) => lab.id === labId);
}

function getAIProgress() {
  if (!isPlainRecord(state.aiZoneProgress)) state.aiZoneProgress = createFallbackState().aiZoneProgress;
  const progress = state.aiZoneProgress;
  progress.completedLessons = Array.isArray(progress.completedLessons) ? progress.completedLessons : [];
  progress.completedGuides = Array.isArray(progress.completedGuides) ? progress.completedGuides : [];
  progress.lessonNotes = isPlainRecord(progress.lessonNotes) ? progress.lessonNotes : Object.create(null);
  progress.guideNotes = isPlainRecord(progress.guideNotes) ? progress.guideNotes : Object.create(null);
  progress.quizResults = isPlainRecord(progress.quizResults) ? progress.quizResults : Object.create(null);
  progress.labResults = isPlainRecord(progress.labResults) ? progress.labResults : Object.create(null);
  progress.paperProgress = isPlainRecord(progress.paperProgress) ? progress.paperProgress : Object.create(null);
  progress.favoriteTermIds = Array.isArray(progress.favoriteTermIds) ? progress.favoriteTermIds : [];
  progress.recentTermIds = Array.isArray(progress.recentTermIds) ? progress.recentTermIds : [];
  return progress;
}

function isAIGuideComplete(guideId) {
  return getAIProgress().completedGuides.includes(guideId);
}

function isAITermFavorite(termId) {
  return getAIProgress().favoriteTermIds.includes(termId);
}

function getAIPaperStatus(paperId) {
  return getAIProgress().paperProgress[paperId]?.status || "unread";
}

function setAIPaperStatus(paperId, status) {
  if (!getAIData().papers.some((paper) => paper.id === paperId) || !["unread", "reading", "done"].includes(status)) return;
  getAIProgress().paperProgress[paperId] = { status, updatedAt: new Date().toISOString() };
  getAIProgress().updatedAt = new Date().toISOString();
  saveState(true);
  renderAIZone();
  showToast(status === "done" ? "论文已标记为完成" : status === "reading" ? "已记录为阅读中" : "已重置阅读状态");
}

function isAILessonComplete(lessonId) {
  return getAIProgress().completedLessons.includes(lessonId);
}

function getAIModule(moduleId) {
  return getAIData().modules.find((module) => module.id === moduleId);
}

const aiPaperLessonMap = Object.freeze({
  "paper-attention": ["ai-08-qkv-attention", "ai-08-multihead-position-residual", "ai-08-encoder-decoder-masks"],
  "paper-bert": ["ai-07-sequence-position-context", "ai-08-encoder-decoder-masks", "ai-08-pretraining-objectives"],
  "paper-gpt3": ["ai-08-tokens-tokenizers-context", "ai-08-pretraining-objectives", "ai-08-decoding-strategies"],
  "paper-instructgpt": ["ai-08-instruction-alignment-boundaries", "ai-09-prompt-contracts", "ai-11-risk-context-stakeholders"],
  "paper-rag": ["ai-09-embeddings-chunks-indexes", "ai-09-rag-retrieve-rerank-cite", "ai-09-rag-evaluation"],
  "paper-datasheets": ["ai-02-imbalance-representativeness", "ai-02-dataset-cards-versioning", "ai-11-transparency-explainability-cards"]
});

const aiGlossaryTermLessonMap = Object.freeze({
  "人工智能": ["ai-00-overview", "ai-00-rules-vs-learning", "ai-00-problem-framing"],
  "机器学习": ["ai-00-rules-vs-learning", "ai-00-learning-types", "ai-03-pipeline-baselines"],
  "模型": ["ai-00-model-training-inference", "ai-03-pipeline-baselines", "ai-10-tracking-registry-model-card"],
  "参数": ["ai-00-model-training-inference", "ai-01-gradient-step", "ai-05-batch-epoch-optimizer"],
  "训练": ["ai-00-model-training-inference", "ai-05-training-loop", "ai-10-reproducible-environments"],
  "推理": ["ai-00-model-training-inference", "ai-10-batch-online-serving", "ai-10-onnx-runtime-compatibility"],
  "张量": ["ai-01-vectors-tensors", "ai-01-dot-products-linear-maps", "ai-05-gpu-memory-mixed-precision"],
  "损失函数": ["ai-01-functions-loss", "ai-05-forward-loss-graph", "ai-05-training-loop"],
  "梯度下降": ["ai-01-gradient-step", "ai-05-backprop-autograd", "ai-05-batch-epoch-optimizer"],
  "特征": ["ai-02-samples-features-labels", "ai-02-preprocessing", "ai-06-cnn-features-head"],
  "标签": ["ai-02-samples-features-labels", "ai-02-data-quality", "ai-07-nlp-tasks"],
  "数据泄漏": ["ai-02-train-validation-test", "ai-02-data-leakage", "ai-03-pipeline-baselines"],
  "过拟合": ["ai-03-decision-tree", "ai-04-under-overfitting", "ai-05-regularization"],
  "交叉验证": ["ai-04-cross-validation", "ai-03-pipeline-baselines", "ai-04-slices-significance"],
  "Precision": ["ai-04-classification-metrics", "ai-04-roc-pr-thresholds", "ai-06-classification-topk"],
  "Recall": ["ai-04-classification-metrics", "ai-04-roc-pr-thresholds", "ai-06-detection-iou"],
  "神经网络": ["ai-05-neurons-layers-activations", "ai-05-forward-loss-graph", "ai-06-cnn-features-head"],
  "反向传播": ["ai-01-chain-rule-numerical-stability", "ai-05-backprop-autograd", "ai-05-training-loop"],
  "卷积神经网络": ["ai-06-convolution", "ai-06-cnn-features-head", "ai-06-transfer-learning"],
  "Token": ["ai-07-normalization-tokenization", "ai-08-tokens-tokenizers-context", "ai-08-decoding-strategies"],
  "Tokenizer": ["ai-07-normalization-tokenization", "ai-08-tokens-tokenizers-context", "ai-11-supply-chain-integrity"],
  "Embedding": ["ai-07-embeddings-similarity", "ai-09-embeddings-chunks-indexes", "ai-09-rag-retrieve-rerank-cite"],
  "注意力机制": ["ai-08-qkv-attention", "ai-08-multihead-position-residual", "ai-08-encoder-decoder-masks"],
  "Transformer": ["ai-08-multihead-position-residual", "ai-08-encoder-decoder-masks", "ai-08-pretraining-objectives"],
  "大语言模型": ["ai-08-pretraining-objectives", "ai-08-decoding-strategies", "ai-08-instruction-alignment-boundaries"],
  "RAG": ["ai-09-embeddings-chunks-indexes", "ai-09-rag-retrieve-rerank-cite", "ai-09-rag-evaluation"],
  "Agent": ["ai-09-tools-workflows-agents", "ai-09-agent-state-permissions-observability", "ai-11-llm-application-security"],
  "Tool Calling": ["ai-09-structured-output-validation", "ai-09-tools-workflows-agents", "ai-09-agent-state-permissions-observability"],
  "MLOps": ["ai-10-reproducible-environments", "ai-10-lineage-versions-artifacts", "ai-10-rollout-rollback-retraining-cost"],
  "Model Card": ["ai-02-dataset-cards-versioning", "ai-10-tracking-registry-model-card", "ai-11-transparency-explainability-cards"],
  "Prompt Injection": ["ai-09-agent-state-permissions-observability", "ai-11-llm-application-security", "ai-11-nist-risk-incident-response"],
  "数据漂移": ["ai-04-slices-significance", "ai-10-drift-monitoring-alerts", "ai-10-rollout-rollback-retraining-cost"]
});

const aiModuleGlossaryDefaults = Object.freeze({
  "AI-00": ["人工智能", "机器学习", "模型", "训练"],
  "AI-01": ["张量", "损失函数", "梯度下降", "参数"],
  "AI-02": ["特征", "标签", "数据泄漏", "Model Card"],
  "AI-03": ["机器学习", "模型", "特征", "过拟合"],
  "AI-04": ["过拟合", "交叉验证", "Precision", "Recall"],
  "AI-05": ["神经网络", "反向传播", "梯度下降", "张量"],
  "AI-06": ["卷积神经网络", "张量", "特征", "模型"],
  "AI-07": ["Token", "Tokenizer", "Embedding", "神经网络"],
  "AI-08": ["Token", "注意力机制", "Transformer", "大语言模型"],
  "AI-09": ["RAG", "Embedding", "Agent", "Tool Calling"],
  "AI-10": ["MLOps", "Model Card", "数据漂移", "推理"],
  "AI-11": ["Prompt Injection", "Model Card", "Agent", "人工智能"]
});

function getGlossaryTermByName(name) {
  return glossary.find((term) => term[0] === name);
}

function getGlossaryRelatedAILessons(term) {
  const termName = Array.isArray(term) ? term[0] : String(term || "");
  const lessonIds = [
    ...(aiGlossaryTermLessonMap[termName] || []),
    ...Object.entries(aiModuleGlossaryDefaults)
      .filter(([, termNames]) => termNames.includes(termName))
      .flatMap(([moduleId]) => getAIData().lessons.filter((lesson) => lesson.moduleId === moduleId).map((lesson) => lesson.id))
  ];
  return [...new Set(lessonIds)].map(getAILesson).filter(Boolean).slice(0, 4);
}

function getRelatedAITerms(lesson) {
  const explicit = Object.entries(aiGlossaryTermLessonMap)
    .filter(([, lessonIds]) => lessonIds.includes(lesson.id))
    .map(([termName]) => termName);
  const defaults = aiModuleGlossaryDefaults[lesson.moduleId] || [];
  return [...new Set([...explicit, ...defaults])].map(getGlossaryTermByName).filter(Boolean).slice(0, 6);
}

function getPaperRelatedAILessons(paperId) {
  return (aiPaperLessonMap[paperId] || []).map(getAILesson).filter(Boolean);
}

function getRelatedAIPapers(lesson) {
  return (getAIData().papers || []).filter((paper) => (aiPaperLessonMap[paper.id] || []).includes(lesson.id));
}

function getAdjacentAIModuleLessons(lesson) {
  const moduleLessons = getAIData().lessons.filter((item) => item.moduleId === lesson.moduleId);
  const index = moduleLessons.findIndex((item) => item.id === lesson.id);
  return {
    previous: index > 0 ? moduleLessons[index - 1] : null,
    next: index >= 0 && index < moduleLessons.length - 1 ? moduleLessons[index + 1] : null
  };
}
