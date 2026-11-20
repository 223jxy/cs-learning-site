#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const nodes = new Map();
const makeNode = (id) => ({
  id,
  value: "",
  innerHTML: "",
  textContent: "",
  disabled: false,
  style: {},
  classList: { add() {}, remove() {}, toggle() {} },
  setAttribute() {},
  querySelector() { return null; },
  querySelectorAll() { return []; }
});
const document = {
  getElementById(id) {
    if (!nodes.has(id)) nodes.set(id, makeNode(id));
    return nodes.get(id);
  },
  querySelector() { return null; },
  querySelectorAll() { return []; }
};
const context = {
  console,
  document,
  localStorage: { getItem: () => null, setItem: () => {} },
  Blob,
  TextEncoder,
  URL,
  FileReader: function FileReader() {}
};
context.window = context;
vm.createContext(context);

const dataFiles = [
  "foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js",
  "foundation-practice-labs.js",
  "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js",
  "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js",
  "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js", "ai-zone-data.js",
  "ai-zone-az2-data.js", "ai-zone-az3-data.js", "ai-zone-az4-data.js", "ai-zone-az5-data.js", "ai-zone-az6-data.js"
];
for (const file of dataFiles) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += `globalThis.__libraryCheck={
  getAllLessons,
  getFilteredLibraryLessons,
  formatLibraryDuration,
  renderFilters,
  renderLibrary,
  resetLibraryFilters,
  setCompleted:(ids)=>{state.completedLessons=[...ids]},
  setView:(stage,status,sort)=>{activeFilter=stage;activeLibraryStatus=status;activeLibrarySort=sort},
  getView:()=>({stage:activeFilter,status:activeLibraryStatus,sort:activeLibrarySort})
};`;
vm.runInContext(appCode, context, { filename: "app.js" });

const api = context.__libraryCheck;
const lessons = api.getAllLessons();
const errors = [];
const expect = (condition, message) => {
  if (!condition) errors.push(message);
};
function readStyleBundle(file, seen = new Set()) {
  const absolute = path.join(root, file);
  if (seen.has(absolute)) return "";
  seen.add(absolute);
  const css = fs.readFileSync(absolute, "utf8");
  const imports = [...css.matchAll(/@import\s+url\(["']?([^"')]+)["']?\);/g)].map((match) => match[1]);
  return [
    css,
    ...imports.map((importPath) => readStyleBundle(importPath, seen))
  ].join("\n");
}
const isAscending = (items) => items.every((lesson, index) => index === 0 || items[index - 1].duration <= lesson.duration);
const isDescending = (items) => items.every((lesson, index) => index === 0 || items[index - 1].duration >= lesson.duration);

expect(lessons.length === 152, `主线课程应为 152，实际 ${lessons.length}`);
expect(api.getFilteredLibraryLessons().map((lesson) => lesson.id).join(",") === lessons.map((lesson) => lesson.id).join(","), "默认路线顺序被改变");
expect(api.getFilteredLibraryLessons({ stageId: "0" }).length === 20, "阶段 0 筛选结果不是 20 节");
expect(api.getFilteredLibraryLessons({ stageId: "bad", status: "bad", sort: "bad" }).length === 152, "非法筛选值没有回退到默认值");

const completedIds = lessons.slice(0, 3).map((lesson) => lesson.id);
api.setCompleted(completedIds);
expect(api.getFilteredLibraryLessons({ status: "complete" }).length === 3, "已完成筛选结果不是 3 节");
expect(api.getFilteredLibraryLessons({ status: "incomplete" }).length === 149, "未完成筛选结果不是 149 节");
expect(api.getFilteredLibraryLessons({ stageId: "0", status: "complete" }).length === 3, "阶段与完成状态组合筛选错误");
expect(api.getFilteredLibraryLessons({ stageId: "9", status: "complete" }).length === 0, "空结果组合筛选错误");

const ascending = api.getFilteredLibraryLessons({ sort: "duration-asc" });
const descending = api.getFilteredLibraryLessons({ sort: "duration-desc" });
expect(isAscending(ascending), "课程时长升序错误");
expect(isDescending(descending), "课程时长降序错误");
expect(ascending.length === 152 && descending.length === 152, "排序改变了课程数量");
expect(api.formatLibraryDuration(59) === "59 分钟", "不足一小时的时长格式错误");
expect(api.formatLibraryDuration(125) === "2 小时 5 分钟", "跨小时的时长格式错误");

api.setView("all", "complete", "duration-asc");
api.renderFilters();
api.renderLibrary();
expect(nodes.get("library-visible-count").textContent === "3 / 152", "完成筛选的可见数量文案错误");
expect((nodes.get("course-grid").innerHTML.match(/<article class="course-card/g) || []).length === 3, "完成筛选没有渲染 3 张卡片");
expect(nodes.get("course-grid").innerHTML.includes("复习课程"), "已完成课程卡缺少复习入口文案");
expect(nodes.get("library-status-filter").value === "complete", "完成状态控件没有同步");
expect(nodes.get("library-sort").value === "duration-asc", "排序控件没有同步");
expect(!nodes.get("library-reset-filters").disabled, "非默认筛选下重置按钮不应禁用");

api.setView("9", "complete", "route");
api.renderLibrary();
expect(nodes.get("course-grid").innerHTML.includes("library-empty-state"), "空筛选结果没有渲染空状态");
expect(nodes.get("library-duration-summary").textContent.length > 0, "空筛选结果缺少时长说明");

api.resetLibraryFilters();
expect(api.getView().stage === "all" && api.getView().status === "all" && api.getView().sort === "route", "重置后筛选状态不正确");
expect(nodes.get("library-visible-count").textContent === "152 / 152", "重置后课程数量不正确");
expect(nodes.get("library-reset-filters").disabled, "默认筛选下重置按钮应禁用");

const indexHTML = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styles = readStyleBundle("styles.css");
expect(indexHTML.includes('id="library-status-filter"') && indexHTML.includes('id="library-sort"'), "课程库缺少状态筛选或排序控件");
expect(indexHTML.includes('data-reset-library-filters') && indexHTML.includes('id="library-visible-count"'), "课程库缺少重置或结果统计控件");
expect(styles.includes(".library-toolbar") && styles.includes(".library-empty-state"), "课程库工具栏或空状态样式缺失");
expect(appCode.includes('getElementById("library-status-filter").addEventListener("change"'), "完成状态筛选事件未接入");
expect(appCode.includes('getElementById("library-sort").addEventListener("change"'), "课程排序事件未接入");

console.log("Library controls check");
console.log(JSON.stringify({
  lessons: lessons.length,
  completedSample: completedIds.length,
  stage0: api.getFilteredLibraryLessons({ stageId: "0" }).length,
  shortest: ascending[0].duration,
  longest: descending[0].duration,
  resetCount: nodes.get("library-visible-count").textContent
}, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 课程库阶段、完成状态、时长排序、空状态和重置检查通过。");

