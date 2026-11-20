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
  Blob: function Blob() {},
  URL,
  FileReader: function FileReader() {}
};
context.window = context;
vm.createContext(context);

for (const file of ["foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js", "foundation-practice-labs.js", "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js", "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js", "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += "globalThis.__copyCheck={getAllLessons,renderHighDensityLessonSections};";
vm.runInContext(appCode, context, { filename: "app.js" });

const forbidden = ["高密度", "样板课", "课程高密度改造标准", "sample-v1", "high-density-v1"];
const forbiddenInterfaceTerms = ["已细化", "待细化", "不计入主线", "不写入主线", "独立进度", "扩展细课", "细课程"];
const errors = [];
const lessons = context.__copyCheck.getAllLessons();

for (const lesson of lessons) {
  const visibleText = [lesson.title, lesson.summary, lesson.why, lesson.level].filter(Boolean).join(" ");
  const sections = lesson.density ? context.__copyCheck.renderHighDensityLessonSections(lesson) : "";
  for (const term of forbidden) {
    if (visibleText.includes(term) || sections.includes(term)) errors.push(`${lesson.id}: 用户可见内容包含“${term}”`);
  }
}

const indexText = fs.readFileSync(path.join(root, "index.html"), "utf8");
const interfaceScriptText = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");
for (const term of forbiddenInterfaceTerms) {
  if (indexText.includes(term) || interfaceScriptText.includes(term)) {
    errors.push(`页面界面包含内部表达“${term}”`);
  }
}

console.log("User-facing copy check");
console.log(JSON.stringify({ lessons: lessons.length, checkedTerms: forbidden.length + forbiddenInterfaceTerms.length }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 用户界面未展示内部改造、密度或进度边界术语。");

