#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = {
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: {},
  Blob,
  TextEncoder,
  URL,
  FileReader: function FileReader() {}
};
context.window = context;
vm.createContext(context);

const dataFiles = [
  "ai-foundation-data.js",
  "ai-foundation-depth-data.js",
  "ai-zone-data.js",
  "ai-zone-az2-data.js",
  "ai-zone-az3-data.js",
  "ai-zone-az4-data.js",
  "ai-zone-az5-data.js",
  "ai-zone-az6-data.js",
  "foundation-high-density.js",
  "stage1-high-density.js",
  "stage2-high-density.js",
  "stage3-high-density.js",
  "foundation-practice-labs.js",
  "course-labs.js",
  "course-labs-stage6-9.js",
  "lesson-profile-builder.js",
  "stage4-course-config.js",
  "stage4-high-density.js",
  "stage5-high-density.js",
  "stage6-high-density.js",
  "stage7-high-density.js",
  "stage8-high-density.js",
  "stage9-high-density.js",
  "stage4-9-sample-deep-dives.js",
  "stage4-8-course-references.js"
];
for (const file of dataFiles) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-review-tools.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += `globalThis.__nextRoundCheck={
  getPortfolioProjects,
  buildPortfolioAcceptanceTemplate,
  buildPortfolioReadmeTemplate,
  buildPortfolioVerifierScript,
  buildPortfolioInitializerFiles,
  getPortfolioStarterKit,
  createStoredZipBlob,
  getPortfolioTemplateBaseName,
  getNoteResults,
  buildNotesMarkdown,
  highlightSearchTerm,
  normalizeNoteTags,
  getNoteTagStats,
  getFilteredNoteTagStats,
  renameNoteTag,
  mergeNoteTag,
  removeNoteTag,
  selectNotesByTag,
  buildLearningEvidenceMarkdown,
  getPracticeEvidenceEntries,
  redactLearningEvidence,
  sortMistakeItems,
  getMistakeKnowledgeLabel,
  getSelectedNoteResults,
  setSelectedNotesForCheck:(keys)=>{selectedNoteKeys.clear();keys.forEach((key)=>selectedNoteKeys.add(key))},
  getSelectedNoteKeysForCheck:()=>[...selectedNoteKeys],
  normalizeStateForCheck:(value)=>normalizeState(JSON.parse(value)),
  setStateForCheck:(value)=>{state=normalizeState(JSON.parse(value))},
  saveLabEvidence,
  clearLabEvidence,
  setMistakeSortForCheck:(value)=>{activeMistakeSort=value},
  setNoteTagSearchForCheck:(value)=>{noteTagSearchQuery=value},
  getAIData,
  getAIFoundationData,
  stageOperationGuides,
  getAllLessons,
  getAllExtensionCourses,
  getLessonSearchText,
  renderOperationGuide
};`;
vm.runInContext(appCode, context, { filename: "app.js" });

const api = context.__nextRoundCheck;
const errors = [];
const projects = api.getPortfolioProjects();

if (appCode.indexOf("let state = null") > appCode.indexOf("state = loadState();")) {
  errors.push("状态变量必须先声明，再在课程派生与标签清洗函数就绪后读取");
}
if (api.getAllLessons() !== api.getAllLessons()) errors.push("主线课程派生数据未复用缓存");
if (api.getAllExtensionCourses() !== api.getAllExtensionCourses()) errors.push("方向课程排序结果未复用缓存");
if (projects !== api.getPortfolioProjects()) errors.push("作品集派生数据未复用缓存");
const cachedLesson = api.getAllLessons()[0];
if (api.getLessonSearchText(cachedLesson) !== api.getLessonSearchText(cachedLesson)) errors.push("课程搜索文本缓存结果不稳定");

if (projects.length !== 18) errors.push(`作品集项目应为 18 个，实际 ${projects.length} 个`);
for (const project of projects) {
  const readme = api.buildPortfolioReadmeTemplate(project);
  const acceptance = api.buildPortfolioAcceptanceTemplate(project);
  if (!readme.includes(project.title) || !readme.includes(project.number)) errors.push(`${project.id}: README 缺少标题或编号`);
  for (const item of project.execution?.fileTree || []) {
    if (!readme.includes(item)) errors.push(`${project.id}: README 缺少目录项 ${item}`);
  }
  for (const item of project.execution?.acceptance || []) {
    if (!readme.includes(item) || !acceptance.includes(item)) errors.push(`${project.id}: 模板缺少验收项 ${item}`);
  }
  const verifier = api.buildPortfolioVerifierScript(project);
  const starter = api.getPortfolioStarterKit(project);
  const initializerFiles = api.buildPortfolioInitializerFiles(project);
  const fileNames = initializerFiles.map((file) => file.name);
  const root = `${api.getPortfolioTemplateBaseName(project)}/`;
  for (const required of [`${root}README.md`, `${root}ACCEPTANCE.md`, `${root}START-HERE.md`, `${root}scripts/verify-project.ps1`, `${root}scripts/start-project.ps1`, `${root}scripts/smoke-test.ps1`]) {
    if (!fileNames.includes(required)) errors.push(`${project.id}: 初始化包缺少 ${required}`);
  }
  if (!starter.stack || !starter.files.some((file) => file.path.startsWith("starter/"))) errors.push(`${project.id}: 技术栈或启动源码缺失`);
  if (!readme.includes(starter.stack) || !readme.includes(starter.smokeCommand)) errors.push(`${project.id}: README 缺少真实启动说明`);
  if (new Set(fileNames).size !== fileNames.length) errors.push(`${project.id}: 初始化包存在重复路径`);
  if (fileNames.some((item) => item.includes("../") || item.startsWith("/"))) errors.push(`${project.id}: 初始化包包含不安全路径`);
  if (!verifier.includes("[switch]$StructureOnly") || !verifier.includes("[switch]$RunStarter") || !verifier.includes("smoke-test.ps1") || !verifier.includes(project.number) || !verifier.includes("RESULT: PASS")) {
    errors.push(`${project.id}: PowerShell 验收脚本结构不完整`);
  }
  const zip = api.createStoredZipBlob(initializerFiles);
  if (!(zip instanceof Blob) || zip.size < 500) errors.push(`${project.id}: ZIP 数据未生成`);
}

const sampleLesson = api.getAllLessons()[0];
const sampleProject = projects[0];
const sampleCourse = sampleProject.suggestedCourses[0];
const sampleAILesson = api.getAIData().lessons[0];
const sampleAIGuide = api.getAIFoundationData().guides[0];
if (!sampleAILesson || !sampleAIGuide) errors.push("AI 课程或入门教程样本缺失，无法验证四类笔记");
api.setStateForCheck(JSON.stringify({
  lessonNotes: { [sampleLesson.id]: { content: "主线路径笔记", tags: ["路径", "复习", "路径"], updatedAt: "2026-07-27T01:00:00.000Z" } },
  reviewedMistakes: {
    [`mainline:${sampleLesson.id}:0:2026-07-27T01:00:00.000Z`]: "2026-07-27T02:00:00.000Z",
    "mainline:bad:0:bad-date": "bad-date"
  },
  extensionProgress: {
    extensionNotes: { [sampleCourse.id]: { content: "方向项目笔记", tags: ["项目", "API"], updatedAt: "2026-07-27T03:00:00.000Z" } }
  },
  aiZoneProgress: {
    lessonNotes: { [sampleAILesson.id]: { content: "AI 课程概念笔记", tags: ["AI", "概念"], updatedAt: "2026-07-27T04:00:00.000Z" } },
    guideNotes: { [sampleAIGuide.id]: { content: "入门路径笔记", tags: ["路径", "AI"], updatedAt: "2026-07-27T05:00:00.000Z" } }
  },
  practiceEvidence: {
    [sampleLesson.id]: {
      status: "done",
      summary: "命令退出码 0；token=abc123；输出包含 FILE_COUNT=3",
      command: "powershell -NoProfile -File lab.ps1",
      updatedAt: "2026-07-27T06:00:00.000Z"
    }
  }
}));
const mergedNotes = api.getNoteResults("");
if (mergedNotes.length !== 4 || !["mainline", "extension", "ai-zone", "ai-guide"].every((kind) => mergedNotes.some((item) => item.kind === kind))) {
  errors.push("主线、方向、AI 课程与 AI 入门笔记未合并到同一搜索结果");
}
if (api.getNoteResults("方向项目").length !== 1 || api.getNoteResults("路径笔记").length !== 2) {
  errors.push("统一笔记搜索未正确匹配课程与入门笔记内容");
}
if (api.getNoteResults("API").length !== 1 || mergedNotes.find((item) => item.kind === "mainline").note.tags.length !== 2) {
  errors.push("笔记标签清洗或标签搜索失败");
}
api.setSelectedNotesForCheck([`mainline:${sampleLesson.id}`, `extension:${sampleCourse.id}`]);
if (api.getSelectedNoteResults().length !== 2) errors.push("跨主线与方向笔记的批量选择失败");
const noteMarkdown = api.buildNotesMarkdown(mergedNotes, "笔记");
if (!noteMarkdown.includes("笔记数量：4") || !noteMarkdown.includes("主线路径笔记") || !noteMarkdown.includes("方向项目笔记") || !noteMarkdown.includes("AI 课程概念笔记") || !noteMarkdown.includes("入门路径笔记") || !noteMarkdown.includes("#API")) {
  errors.push("Markdown 笔记导出未包含当前搜索结果");
}
const tagStats = api.getNoteTagStats();
if (!tagStats.some((item) => item.tag === "路径" && item.count === 2) || !tagStats.some((item) => item.tag === "AI" && item.count === 2)) {
  errors.push("笔记标签统计未覆盖四类笔记");
}
api.setNoteTagSearchForCheck("ai");
if (api.getFilteredNoteTagStats().length !== 1 || api.getFilteredNoteTagStats()[0].tag !== "AI") errors.push("标签库搜索未按关键词筛选");
api.setNoteTagSearchForCheck("");
if (api.selectNotesByTag("AI") !== 2 || api.getSelectedNoteKeysForCheck().filter((key) => key.startsWith("ai-")).length !== 2) {
  errors.push("按标签批量选择笔记失败");
}
if (api.renameNoteTag("路径", "学习路径") !== 2 || api.getNoteResults("学习路径").length !== 2) {
  errors.push("笔记标签重命名未跨四类笔记生效");
}
if (api.mergeNoteTag("AI", "学习路径") !== 2) {
  errors.push("笔记标签合并未跨 AI 笔记生效");
}
if (api.mergeNoteTag("概念", "不存在标签") !== 0) errors.push("标签合并不应接受不存在的目标标签");
const mergedPathStats = api.getNoteTagStats().find((item) => item.tag === "学习路径");
if (!mergedPathStats || mergedPathStats.count !== 3) errors.push("笔记标签合并后未去重或统计错误");
if (api.removeNoteTag("学习路径") !== 3 || api.getNoteTagStats().some((item) => item.tag === "学习路径")) {
  errors.push("笔记标签移除没有只移除标签并保留笔记");
}
if (api.getNoteResults("").length !== 4) errors.push("标签移除后不应删除笔记正文");
const fakeMistakes = [
  { kind: "mainline", lesson: sampleLesson, questionIndex: 2, checkedAt: "2026-07-20T00:00:00.000Z" },
  { kind: "extension", course: sampleCourse, questionIndex: 1, checkedAt: "2026-07-22T00:00:00.000Z" },
  { kind: "ai-zone", lesson: sampleAILesson, questionIndex: 0, checkedAt: "2026-07-21T00:00:00.000Z" }
];
api.setMistakeSortForCheck("recent");
if (api.sortMistakeItems(fakeMistakes)[0].kind !== "extension") errors.push("错题最近错误排序失败");
api.setMistakeSortForCheck("course");
if (!api.sortMistakeItems(fakeMistakes)[0].lesson && !api.sortMistakeItems(fakeMistakes)[0].course) errors.push("错题课程排序返回异常");
api.setMistakeSortForCheck("knowledge");
if (!api.getMistakeKnowledgeLabel(api.sortMistakeItems(fakeMistakes)[0])) errors.push("错题知识点排序或标签生成失败");
const evidenceMarkdown = api.buildLearningEvidenceMarkdown();
if (!evidenceMarkdown.includes("学习证据") || !evidenceMarkdown.includes("学习笔记：4 篇") || !evidenceMarkdown.includes("错题复习")) {
  errors.push("学习证据导出内容缺少关键段落");
}
if (!evidenceMarkdown.includes("课程实验证据：1 条") || !evidenceMarkdown.includes("## 课程实验证据") || !evidenceMarkdown.includes("[已脱敏]") || evidenceMarkdown.includes("abc123")) {
  errors.push("课程实验证据导出或默认脱敏失败");
}
if (api.getPracticeEvidenceEntries().length !== 1 || !api.redactLearningEvidence("password=123456").includes("[已脱敏]")) {
  errors.push("课程实验证据读取或敏感字段脱敏失败");
}
const highlighted = api.highlightSearchTerm("方向 <项目> 笔记", "项目");
if (!highlighted.includes('<mark class="search-highlight">项目</mark>') || highlighted.includes("<项目>")) {
  errors.push("笔记命中词高亮或 HTML 转义失败");
}
const normalizedReviewState = api.normalizeStateForCheck(JSON.stringify({ reviewedMistakes: {
  [`mainline:${sampleLesson.id}:0:2026-07-27T01:00:00.000Z`]: "2026-07-27T02:00:00.000Z",
  "mainline:bad:0:bad-date": "bad-date"
} }));
if (Object.keys(normalizedReviewState.reviewedMistakes).length !== 1) errors.push("错题复习状态兼容过滤失败");
if (api.normalizeStateForCheck("{}").settings.completionMode !== "manual") errors.push("旧学习数据未默认使用自行标记完成");
if (api.normalizeStateForCheck(JSON.stringify({ settings: { completionMode: "auto" } })).settings.completionMode !== "auto") errors.push("自动完成设置未保留");
if (Object.keys(api.normalizeStateForCheck("{}").practiceEvidence).length !== 0) errors.push("旧学习数据未补齐空实验证据字段");
const sampleLabLesson = api.getAllLessons().find((lesson) => lesson.lab);
const normalizedPracticeEvidence = api.normalizeStateForCheck(JSON.stringify({
  practiceEvidence: {
    [sampleLabLesson.id]: { status: "blocked", summary: "输出和预期不一致", command: "node lab.js", updatedAt: "2026-07-27T07:00:00.000Z" },
    bad: { status: "done", summary: "无效", updatedAt: "2026-07-27T07:00:00.000Z" },
    [api.getAllLessons()[1].id]: { status: "done", summary: "", updatedAt: "2026-07-27T07:00:00.000Z" }
  }
}));
if (Object.keys(normalizedPracticeEvidence.practiceEvidence).length !== 1 || normalizedPracticeEvidence.practiceEvidence[sampleLabLesson.id].status !== "blocked") {
  errors.push("实验证据状态迁移、过滤或兼容失败");
}

for (const stageId of [0, 1, 2, 3]) {
  const guide = api.stageOperationGuides[stageId];
  if (!guide || guide.labels.length !== 4 || guide.actions.length !== 4) {
    errors.push(`阶段 ${stageId}: 操作步骤不是 4 项`);
    continue;
  }
  guide.actions.forEach((step, index) => {
    if (!step.action || !step.evidence || !step.done) errors.push(`阶段 ${stageId} 步骤 ${index + 1}: 操作、证据或完成判断缺失`);
    if (!Array.isArray(step.mock) || !step.mock.length || step.mock.some((item) => item < 0 || item >= guide.mock.length)) {
      errors.push(`阶段 ${stageId} 步骤 ${index + 1}: 高亮索引无效`);
    }
  });
  const lesson = api.getAllLessons().find((item) => item.stageId === stageId);
  const rendered = api.renderOperationGuide(lesson);
  if ((rendered.match(/data-operation-step=/g) || []).length !== 4) errors.push(`阶段 ${stageId}: 未渲染 4 个步骤按钮`);
  if ((rendered.match(/data-operation-panel=/g) || []).length !== 4) errors.push(`阶段 ${stageId}: 未渲染 4 个步骤面板`);
}

const indexText = fs.readFileSync(path.join(root, "index.html"), "utf8");
const requiredSelectors = ["mistake-source-filter", "mistake-group-filter", "mistake-status-filter", "mistake-sort-filter", "review-filter-count", "export-notes-markdown", "note-search-count", "note-tag-filter", "note-tag-manager", "export-learning-evidence", "select-visible-notes", "clear-note-selection", "export-selected-notes"];
for (const selector of requiredSelectors) {
  if (!indexText.includes(`id="${selector}"`)) errors.push(`错题筛选缺少 #${selector}`);
}
if (!indexText.includes('src="app-review-tools.js"')) errors.push("index.html 未加载复习辅助层 app-review-tools.js");
for (const token of ["data-download-project-readme", "data-download-project-acceptance", "data-download-project-package", "data-download-project-verifier", "activeMistakeSource", "activeMistakeGroup", "activeMistakeReviewStatus", "activeMistakeSort", "data-toggle-mistake-review", "setupLessonTableOfContents", "data-lesson-section", "data-lesson-toc-status", "data-lesson-reading-progress", "data-lesson-top", "downloadNotesMarkdown", "downloadSelectedNotesMarkdown", "downloadLearningEvidenceMarkdown", "completeActiveCourseAfterReading", "getNoteTagStats", "mergeNoteTag", "data-note-tag-action", "noteTagSearchQuery", "practiceEvidence", "practiceRecords", "practiceAttempts", "data-save-lab-evidence", "data-clear-lab-evidence", "data-save-practice-record", "data-clear-practice-record", "version: 15"]) {
  if (!appCode.includes(token)) errors.push(`功能代码缺少 ${token}`);
}

console.log("Next-round feature check");
const workflowIds = new Set(projects.map((project) => api.getPortfolioStarterKit(project).workflow.id));
if (workflowIds.size !== projects.length) errors.push(`项目专属 workflow.id 应为 ${projects.length} 个，实际 ${workflowIds.size} 个`);
console.log(JSON.stringify({ projects: projects.length, operationStages: 4, reviewControls: requiredSelectors.length, mergedNotes: mergedNotes.length, starterStacks: new Set(projects.map((project) => api.getPortfolioStarterKit(project).stack)).size, workflowIds: workflowIds.size }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 笔记标签与批量导出、阅读进度目录、错题状态和 18 个项目专属启动包结构检查通过。");

