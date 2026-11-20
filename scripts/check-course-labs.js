#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const files = ["foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js", "foundation-practice-labs.js", "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js", "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js", "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js"];
const context = { console, localStorage: { getItem: () => null, setItem: () => {} }, document: {}, Blob: function Blob() {}, URL, FileReader: function FileReader() {} };
context.window = context;
vm.createContext(context);
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
let code = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
code += "globalThis.__labCheck={getAllLessons,getLessonSearchText,renderHighDensityLessonSections};";
vm.runInContext(code, context, { filename: "app.js" });

const lessons = context.__labCheck.getAllLessons().filter((lesson) => lesson.stageId >= 4);
const errors = [];
const codes = new Map();
const mappedReferenceLessons = [4, 5, 6, 7, 8].reduce((count, stageId) => {
  const config = context.lessonProfileStageConfigs[stageId];
  for (const id of config.ids) {
    if (!config.referencesById?.[id] || config.referencesById[id].length < 2) errors.push(`${id}: 课程级引用映射缺失`);
  }
  return count + Object.keys(config.referencesById || {}).length;
}, 0);
for (const lesson of lessons) {
  const lab = lesson.lab;
  if (!lab) { errors.push(`${lesson.id}: 缺少实验`); continue; }
  for (const field of ["title", "runtime", "command", "code"]) if (!lab[field]) errors.push(`${lesson.id}: ${field} 缺失`);
  if (!Array.isArray(lab.files) || !lab.files.length) errors.push(`${lesson.id}: files 缺失`);
  if (!Array.isArray(lab.expected) || !lab.expected.length) errors.push(`${lesson.id}: expected 缺失`);
  if (!Array.isArray(lab.cases) || lab.cases.length < 2) errors.push(`${lesson.id}: 边界案例少于 2`);
  if (!Array.isArray(lab.checks) || lab.checks.length < 3) errors.push(`${lesson.id}: 验收项少于 3`);
  if (codes.has(lab.code)) errors.push(`${lesson.id}: 与 ${codes.get(lab.code)} 使用完全相同代码`); else codes.set(lab.code, lesson.id);
  if (!context.__labCheck.getLessonSearchText(lesson).includes(lab.command.toLowerCase())) errors.push(`${lesson.id}: 实验命令未进入搜索`);
  if (!context.__labCheck.renderHighDensityLessonSections(lesson).includes("course-lab-section")) errors.push(`${lesson.id}: 实验区未渲染`);
  if (lesson.stageId <= 8 && lesson.references.length < 2) errors.push(`${lesson.id}: 课程级引用少于 2`);
}
console.log("Course lab structure check");
if (mappedReferenceLessons !== 80) errors.push(`阶段 4-8 课程级引用映射应为 80，实际 ${mappedReferenceLessons}`);
console.log(JSON.stringify({ lessons: lessons.length, labs: Object.keys(context.courseLabs || {}).length, uniqueCodeSamples: codes.size, mappedReferenceLessons }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 阶段 4-9 的 96 节实验、搜索、渲染和课程级引用检查通过。");

