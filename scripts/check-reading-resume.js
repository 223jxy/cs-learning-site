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
  FileReader: function FileReader() {},
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);

const dataFiles = [
  "foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js",
  "foundation-practice-labs.js",
  "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js",
  "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js",
  "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js", "ai-zone-data.js",
  "ai-zone-az2-data.js", "ai-zone-az3-data.js", "ai-zone-az4-data.js", "ai-zone-az5-data.js", "ai-zone-az6-data.js", "ai-foundation-data.js", "ai-foundation-depth-data.js"
];
for (const file of dataFiles) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += `globalThis.__readingResumeCheck={
  normalizeStateJSON:(value)=>normalizeState(JSON.parse(value)),
  setStateJSON:(value)=>{state=normalizeState(JSON.parse(value))},
  getReadingPositionKey,
  getReadingPositionEntries,
  getFilteredReadingPositionEntries,
  sortReadingPositionEntries,
  getReadingEntrySearchText,
  renderRecentReading,
  setActiveReadingKindForCheck:(kind)=>{activeReadingKind=kind;showAllReadingPositions=false},
  setReadingSearchForCheck:(query)=>{activeReadingQuery=query;showAllReadingPositions=false},
  setReadingSortForCheck:(sort)=>{activeReadingSort=sort},
  setReadingEvidenceForCheck:(value)=>{activeReadingEvidence=value},
  resolveReadingPositionTarget,
  getAllLessons,
  getAllExtensionCourses,
  getAIData
};`;
vm.runInContext(appCode, context, { filename: "app.js" });

const api = context.__readingResumeCheck;
const errors = [];
const expect = (condition, message) => {
  if (!condition) errors.push(message);
};

const mainLesson = api.getAllLessons()[0];
const extensionCourse = api.getAllExtensionCourses()[0];
const aiLesson = api.getAIData().lessons[0];
const mainKey = api.getReadingPositionKey("main", mainLesson.id);
const extensionKey = api.getReadingPositionKey("extension", extensionCourse.id);
const aiKey = api.getReadingPositionKey("ai", aiLesson.id);
const timestamp = "2026-07-26T08:00:00.000Z";

const fallback = api.normalizeStateJSON("{}");
expect(fallback.settings.resumeReading === true, "旧数据未默认开启阅读位置记录");
expect(Object.keys(fallback.readingPositions).length === 0, "空状态不应生成阅读断点");
expect(mainKey.startsWith("main:"), "主线阅读键缺少 main 命名空间");
expect(extensionKey.startsWith("extension:"), "方向阅读键缺少 extension 命名空间");
expect(aiKey.startsWith("ai:"), "AI 阅读键缺少 ai 命名空间");

const normalized = api.normalizeStateJSON(JSON.stringify({
  settings: { completionMode: "auto", resumeReading: true },
  readingPositions: {
    [mainKey]: { sectionTitle: "关键概念", sectionIndex: 2, sectionOffset: -74, ratio: 0.42, percent: 42, updatedAt: timestamp },
    [extensionKey]: { sectionTitle: "动手练习", sectionIndex: 5, sectionOffset: 86, ratio: 0.61, percent: 61, updatedAt: timestamp },
    [aiKey]: { sectionTitle: "分步示例", sectionIndex: 3, sectionOffset: 120, ratio: 0.55, percent: 55, updatedAt: timestamp },
    "main:not-a-course": { sectionTitle: "伪造课程", sectionIndex: 0, sectionOffset: 0, ratio: 0.5, percent: 50, updatedAt: timestamp },
    [`main:${mainLesson.id}-bad-ratio`]: { sectionTitle: "错误比例", sectionIndex: 0, sectionOffset: 0, ratio: 5, percent: 500, updatedAt: timestamp }
  }
}));
expect(Object.keys(normalized.readingPositions).length === 3, "已知三类课程的合法阅读断点未完整保留");
expect(normalized.readingPositions[mainKey]?.sectionTitle === "关键概念", "主线课程章节标题未保留");
expect(normalized.readingPositions[extensionKey]?.percent === 61, "方向课程阅读百分比未保留");
expect(normalized.readingPositions[aiKey]?.sectionOffset === 120, "AI 课程章节内偏移未保留");

api.setStateJSON(JSON.stringify({
  completedLessons: [mainLesson.id],
  practiceEvidence: {
    [mainLesson.id]: { status: "done", summary: "已完成本课练习并记录结果", command: "Get-ChildItem", updatedAt: "2026-07-26T08:30:00.000Z" }
  },
  readingPositions: {
    [mainKey]: { sectionTitle: "关键概念", sectionIndex: 2, sectionOffset: -74, ratio: 0.42, percent: 42, updatedAt: "2026-07-26T08:00:00.000Z" },
    [extensionKey]: { sectionTitle: "动手练习", sectionIndex: 5, sectionOffset: 86, ratio: 0.61, percent: 61, updatedAt: "2026-07-26T09:00:00.000Z" },
    [aiKey]: { sectionTitle: "分步示例", sectionIndex: 3, sectionOffset: 120, ratio: 0.55, percent: 55, updatedAt: "2026-07-26T10:00:00.000Z" }
  }
}));
const recentEntries = api.getReadingPositionEntries();
expect(recentEntries.length === 3, "最近阅读没有汇总三类课程");
expect(recentEntries[0]?.key === aiKey && recentEntries[1]?.key === extensionKey && recentEntries[2]?.key === mainKey, "最近阅读未按更新时间倒序排列");
expect(recentEntries.map((entry) => entry.typeLabel).join(",") === "AI 课程,方向课程,主线课程", "最近阅读课程类型标签错误");
expect(recentEntries.every((entry) => entry.title && entry.context), "最近阅读缺少课程标题或上下文");
expect(api.getFilteredReadingPositionEntries(recentEntries, "main").length === 1, "主线最近阅读筛选数量错误");
expect(api.getFilteredReadingPositionEntries(recentEntries, "extension").length === 1, "方向最近阅读筛选数量错误");
expect(api.getFilteredReadingPositionEntries(recentEntries, "ai").length === 1, "AI 最近阅读筛选数量错误");
expect(api.getFilteredReadingPositionEntries(recentEntries, "all", "关键概念").length === 1, "最近阅读未按章节标题搜索");
expect(api.getFilteredReadingPositionEntries(recentEntries, "all", mainLesson.title).length === 1, "最近阅读未按课程标题搜索");
expect(api.getFilteredReadingPositionEntries(recentEntries, "extension", "动手练习").length === 1, "最近阅读未组合类型与关键词筛选");
expect(api.getFilteredReadingPositionEntries(recentEntries, "ai", "AI").length === 1, "最近阅读未命中 AI 类型关键词");
expect(api.getFilteredReadingPositionEntries(recentEntries, "all", "<script>").length === 0, "最近阅读特殊字符搜索应安全返回空结果");
expect(api.getFilteredReadingPositionEntries(recentEntries, "all", "", "recent", "with").length === 1, "最近阅读有练习记录筛选错误");
expect(api.getFilteredReadingPositionEntries(recentEntries, "all", "", "recent", "without").length === 2, "最近阅读待补练习筛选错误");
expect(api.sortReadingPositionEntries(recentEntries, "type").map((entry) => entry.kind).join(",") === "main,extension,ai", "最近阅读按类型排序错误");
expect(api.sortReadingPositionEntries(recentEntries, "stage")[0].kind === "main", "最近阅读按主线阶段排序未把主线课程前置");
expect(api.sortReadingPositionEntries(recentEntries, "progress-desc")[0].position.percent === 61, "最近阅读按进度高到低排序错误");
expect(api.sortReadingPositionEntries(recentEntries, "progress-asc")[0].position.percent === 42, "最近阅读按进度低到高排序错误");
expect(api.sortReadingPositionEntries(recentEntries, "unfinished").every((entry, index, list) => index === 0 || Number(list[index - 1].isComplete) <= Number(entry.isComplete)), "最近阅读未按未完成优先排序");
expect(api.getReadingEntrySearchText(recentEntries[0]).includes("ai"), "最近阅读搜索文本缺少类型关键词");
const filterButtons = ["all", "main", "extension", "ai"].map((kind) => ({
  dataset: { readingKindFilter: kind },
  active: false,
  pressed: "",
  classList: { toggle(name, enabled) { if (name === "is-active") this.owner.active = enabled; }, owner: null },
  setAttribute(name, value) { if (name === "aria-pressed") this.pressed = value; }
}));
filterButtons.forEach((button) => { button.classList.owner = button; });
const filterCounts = ["all", "main", "extension", "ai"].map((kind) => ({
  dataset: { readingKindCount: kind },
  textContent: ""
}));
const recentDOM = {
  "recent-reading-list": { innerHTML: "" },
  "reading-position-count": { textContent: "" },
  "recent-reading-count": { textContent: "" },
  "recent-reading-search": { value: "" },
  "recent-reading-sort": { value: "" },
  "recent-reading-evidence": { value: "" },
  "toggle-all-reading-positions": { hidden: false, textContent: "" },
  "clear-all-reading-positions": { disabled: true, textContent: "" }
};
context.document.getElementById = (id) => recentDOM[id] || null;
context.document.querySelectorAll = (selector) => {
  if (selector === "[data-reading-kind-filter]") return filterButtons;
  if (selector === "[data-reading-kind-count]") return filterCounts;
  return [];
};
api.renderRecentReading();
const renderedCardCount = recentDOM["recent-reading-list"].innerHTML.split('<article class="recent-reading-card ').length - 1;
expect(renderedCardCount === 3, `最近阅读卡片未完整渲染，实际 ${renderedCardCount}`);
expect(recentDOM["recent-reading-list"].innerHTML.includes(`data-open-reading-position="${aiKey}"`), "最近阅读缺少 AI 课程继续入口");
expect(recentDOM["recent-reading-list"].innerHTML.includes(`data-clear-reading-entry="${mainKey}"`), "最近阅读缺少主线课程清除入口");
expect(recentDOM["reading-position-count"].textContent === 3 && recentDOM["recent-reading-count"].textContent === "3 节课程", "最近阅读数量显示错误");
expect(recentDOM["clear-all-reading-positions"].disabled === false, "存在阅读断点时清除全部按钮仍被禁用");
expect(recentDOM["recent-reading-list"].innerHTML.includes("已完成") && recentDOM["recent-reading-list"].innerHTML.includes("有练习记录"), "最近阅读卡片缺少完成或练习状态");
expect(filterButtons[0].active && filterButtons[0].pressed === "true", "全部筛选未默认激活");
expect(filterCounts.map((item) => item.textContent).join(",") === "3,1,1,1", "最近阅读筛选计数错误");
api.setReadingSearchForCheck("关键概念");
api.renderRecentReading();
expect(recentDOM["recent-reading-list"].innerHTML.includes(mainLesson.title) && recentDOM["recent-reading-count"].textContent === "1 / 3 节", "最近阅读搜索渲染结果错误");
expect(recentDOM["clear-all-reading-positions"].textContent === "清除当前结果", "搜索后批量清除文案错误");
api.setReadingSearchForCheck("没有这门课");
api.renderRecentReading();
expect(recentDOM["recent-reading-list"].innerHTML.includes("当前筛选没有阅读记录"), "最近阅读无结果空状态错误");
api.setReadingSearchForCheck("");
api.setActiveReadingKindForCheck("extension");
api.renderRecentReading();
expect(recentDOM["recent-reading-list"].innerHTML.includes("is-extension") && !recentDOM["recent-reading-list"].innerHTML.includes("is-main"), "方向筛选仍显示其他课程类型");
expect(recentDOM["recent-reading-count"].textContent === "1 / 3 节", "方向筛选后的当前数量显示错误");
expect(recentDOM["clear-all-reading-positions"].textContent === "清除方向记录", "方向筛选后的批量清除文案错误");
expect(filterButtons[2].active && filterButtons[2].pressed === "true", "方向筛选按钮状态错误");
api.setActiveReadingKindForCheck("all");
api.setReadingEvidenceForCheck("with");
api.renderRecentReading();
expect(recentDOM["recent-reading-list"].innerHTML.includes(mainLesson.title) && !recentDOM["recent-reading-list"].innerHTML.includes(extensionCourse.title), "有练习记录筛选仍显示待补练习课程");
api.setReadingEvidenceForCheck("all");

const invalidKnownPosition = api.normalizeStateJSON(JSON.stringify({
  readingPositions: {
    [mainKey]: { sectionTitle: "错误比例", sectionIndex: 0, sectionOffset: 0, ratio: 5, percent: 500, updatedAt: timestamp }
  }
}));
expect(Object.keys(invalidKnownPosition.readingPositions).length === 0, "已知课程的非法阅读比例未被清除");

const disabled = api.normalizeStateJSON(JSON.stringify({
  settings: { resumeReading: false },
  readingPositions: {
    [mainKey]: { sectionTitle: "关键概念", sectionIndex: 2, sectionOffset: 10, ratio: 0.4, percent: 40, updatedAt: timestamp }
  }
}));
expect(disabled.settings.resumeReading === false, "关闭阅读位置的设置未保留");
expect(Object.keys(disabled.readingPositions).length === 0, "关闭阅读位置后仍保留了断点");

const metrics = [
  { title: "为什么要学", top: 120 },
  { title: "关键概念", top: 520 },
  { title: "动手练习", top: 940 }
];
const exactTarget = api.resolveReadingPositionTarget(
  { sectionTitle: "关键概念", sectionIndex: 0, sectionOffset: 125, ratio: 0.2 },
  metrics,
  1400,
  70
);
expect(exactTarget === 645, `按章节标题恢复位置错误，实际 ${exactTarget}`);
const indexTarget = api.resolveReadingPositionTarget(
  { sectionTitle: "已改名章节", sectionIndex: 2, sectionOffset: -90, ratio: 0.2 },
  metrics,
  1400,
  70
);
expect(indexTarget === 850, `章节改名后的索引回退错误，实际 ${indexTarget}`);
const ratioTarget = api.resolveReadingPositionTarget(
  { sectionTitle: "不存在", sectionIndex: 99, sectionOffset: 0, ratio: 0.25 },
  metrics,
  1400,
  70
);
expect(ratioTarget === 350, `章节结构变化后的比例回退错误，实际 ${ratioTarget}`);

const indexHTML = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const selector of [
  "resume-reading-hint", 'name="resume-reading"', 'value="on"', 'value="off"',
  "reading-position-count", "recent-reading-count", "recent-reading-list",
  "toggle-all-reading-positions", "clear-all-reading-positions",
  "recent-reading-search", "recent-reading-sort",
  "recent-reading-evidence",
  'data-reading-kind-filter="all"', 'data-reading-kind-filter="main"',
  'data-reading-kind-filter="extension"', 'data-reading-kind-filter="ai"'
]) {
  expect(indexHTML.includes(selector), `学习台缺少阅读位置设置：${selector}`);
}
for (const token of [
  "renderedReadingKey", "readingPositions", "queueReadingPositionSave", "flushReadingPositionSave",
  "resolveReadingPositionTarget", "data-lesson-resume-row", "data-clear-reading-position",
  'getReadingPositionKey("main"', 'getReadingPositionKey("extension"', 'getReadingPositionKey("ai"',
  "getReadingPositionEntries", "renderRecentReading", "data-open-reading-position", "data-clear-reading-entry",
  "getFilteredReadingPositionEntries", "setReadingKindFilter", "data-reading-kind-filter",
  "setReadingSearchQuery", "setReadingSort", "setReadingEvidenceFilter", "unfinished", "progress-desc", "progress-asc", "recent-reading-search", "recent-reading-sort",
  "clearAllReadingPositions", "toggleAllReadingPositions", "filteredEntries.slice(0, 6)",
  "课程完成状态和笔记不受影响", "ratio < 0.03", "ratio > 0.97", "}, 650);", "version: 15"
]) {
  expect(appCode.includes(token), `阅读断点实现缺少 ${token}`);
}

console.log("Reading resume check");
console.log(JSON.stringify({
  namespaces: [mainKey.split(":")[0], extensionKey.split(":")[0], aiKey.split(":")[0]],
  normalizedPositions: Object.keys(normalized.readingPositions).length,
  recentOrder: recentEntries.map((entry) => entry.kind),
  searchableResults: api.getFilteredReadingPositionEntries(recentEntries, "all", "关键概念").length,
  exactTarget,
  indexTarget,
  ratioTarget,
  exportVersion: 15
}, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 三类课程断点、最近阅读管理、旧数据兼容、严格清洗和章节/索引/比例恢复检查通过。");

