#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const ids = ["network-map", "ip-addressing", "private-public-nat", "wifi-ethernet", "dns-resolution", "ports-protocols-localhost", "tcp-udp", "http", "https-certificates", "browser-network-panel", "network-tools", "network-troubleshooting"];

const context = { console, localStorage: { getItem: () => null, setItem: () => {} }, document: {}, Blob: function Blob() {}, URL, FileReader: function FileReader() {} };
context.window = context;
vm.createContext(context);
for (const file of ["foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
let code = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
code += "globalThis.__check={stages,extensionCourses,getAllLessons,getLessonSearchText,renderHighDensityLessonSections,normalizeState};";
vm.runInContext(code, context, { filename: "app.js" });

const data = context.__check;
const all = data.getAllLessons();
const stage2Ids = new Set(data.stages[2].lessons.map((lesson) => lesson.id));
const stage2 = all.filter((lesson) => stage2Ids.has(lesson.id));
const samples = stage2.filter((lesson) => ids.includes(lesson.id));
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
expect(all.length === 152, `主线课程应为 152，实际 ${all.length}`);
expect(stage2.length === 12, `阶段 2 应为 12，实际 ${stage2.length}`);
expect(Object.keys(context.stage2HighDensityProfiles || {}).length === 12, "阶段 2 profile 应为 12");
for (const lesson of samples) {
  expect(Boolean(lesson.density), `${lesson.id}: 未启用高密度正文`);
  expect(lesson.objectives?.length >= 3, `${lesson.id}: objectives 少于 3`);
  expect(lesson.knowledgePoints?.length >= 8, `${lesson.id}: knowledgePoints 少于 8`);
  expect(lesson.deepDive?.length >= 3, `${lesson.id}: deepDive 少于 3`);
  expect(lesson.workedExamples?.length >= 2, `${lesson.id}: workedExamples 少于 2`);
  expect(lesson.mistakes?.length >= 3, `${lesson.id}: mistakes 少于 3`);
  expect(lesson.troubleshooting?.length >= 3, `${lesson.id}: troubleshooting 少于 3`);
  expect(lesson.practices?.length >= 2, `${lesson.id}: practices 少于 2`);
  expect(lesson.quiz?.length === 6, `${lesson.id}: quiz 应为 6`);
  expect(lesson.references?.length >= 2, `${lesson.id}: references 少于 2`);
  expect(data.renderHighDensityLessonSections(lesson).includes("density-overview"), `${lesson.id}: 渲染失败`);
}
expect(data.getLessonSearchText(samples.find((lesson) => lesson.id === "ip-addressing")).includes("apipa"), "IP 样板知识点未进入搜索");
vm.runInContext("globalThis.__normalized=normalizeState({quizResults:{'network-map':{answers:[0,1,2,3,0,1],score:5,total:6}}});", context);
expect(context.__normalized.quizResults["network-map"]?.answers.length === 6, "阶段 2 测验导入被截断");
console.log("Stage 2 density sample check");
console.log(JSON.stringify({ mainLessons: all.length, stage2Lessons: stage2.length, denseStage2Samples: samples.length, extensionCourses: data.extensionCourses.length }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 阶段 2 十二节课程的结构、搜索、渲染和状态兼容检查通过。");

