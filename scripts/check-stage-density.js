#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const stageId = Number(process.argv[2]);
if (!Number.isInteger(stageId) || stageId < 4 || stageId > 9) throw new Error("用法：node scripts/check-stage-density.js <4-9>");

const root = path.resolve(__dirname, "..");
const files = ["foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js", "foundation-practice-labs.js", "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js", "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js", "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js"];
const context = { console, localStorage: { getItem: () => null, setItem: () => {} }, document: {}, Blob: function Blob() {}, URL, FileReader: function FileReader() {} };
context.window = context;
vm.createContext(context);
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
let code = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
code += "globalThis.__stageCheck={stages,extensionCourses,getAllLessons,getLessonSearchText,renderHighDensityLessonSections,normalizeState};";
vm.runInContext(code, context, { filename: "app.js" });

const api = context.__stageCheck;
const lessons = api.getAllLessons().filter((lesson) => lesson.stageId === stageId);
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
expect(api.getAllLessons().length === 152, "主线课程数量变化");
expect(api.extensionCourses.length === 120, "专业方向课程数量变化");
expect(lessons.length === 16, `阶段 ${stageId} 应为 16 节，实际 ${lessons.length}`);
for (const lesson of lessons) {
  expect(lesson.prerequisites?.length >= 3, `${lesson.id}: 前置知识少于 3`);
  expect(lesson.objectives?.length >= 3, `${lesson.id}: 学习目标少于 3`);
  expect(lesson.knowledgePoints?.length >= 8, `${lesson.id}: 知识点少于 8`);
  expect(lesson.deepDive?.length >= 3, `${lesson.id}: 原理详解少于 3`);
  expect(lesson.workedExamples?.length >= 2, `${lesson.id}: 示例少于 2`);
  expect(lesson.mistakes?.length >= 3, `${lesson.id}: 误区少于 3`);
  expect(lesson.troubleshooting?.length >= 6, `${lesson.id}: 排查项少于 6`);
  expect(lesson.practices?.length >= 3, `${lesson.id}: 练习层级少于 3`);
  expect(lesson.quiz?.length === 6, `${lesson.id}: 检查题不是 6 道`);
  expect(lesson.references?.length >= 2, `${lesson.id}: 引用少于 2`);
  expect(Boolean(lesson.lab), `${lesson.id}: 动手实验缺失`);
  expect(lesson.lab?.expected?.length >= 1, `${lesson.id}: 实验预期输出缺失`);
  expect(api.renderHighDensityLessonSections(lesson).includes("density-overview"), `${lesson.id}: 正文未渲染`);
  expect(api.renderHighDensityLessonSections(lesson).includes("course-lab-section"), `${lesson.id}: 实验未渲染`);
  expect(api.getLessonSearchText(lesson).includes(lesson.knowledgePoints[0].term.toLowerCase()), `${lesson.id}: 正文未进入搜索`);
}
const probe = lessons[0];
vm.runInContext(`globalThis.__normalized=normalizeState({quizResults:{"${probe.id}":{answers:[0,0,0,0,0,0],score:6,total:6}}});`, context);
expect(context.__normalized.quizResults[probe.id]?.answers.length === 6, "测验导入被截断");
console.log(`Stage ${stageId} course detail check`);
console.log(JSON.stringify({ lessons: lessons.length, mainLessons: api.getAllLessons().length, extensionCourses: api.extensionCourses.length }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log(`PASS: 阶段 ${stageId} 的 16 节课程结构、搜索、渲染和状态兼容检查通过。`);

