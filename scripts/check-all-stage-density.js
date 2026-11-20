#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const dataFiles = ["foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js", "foundation-practice-labs.js", "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js", "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js", "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js"];
const context = { console, localStorage: { getItem: () => null, setItem: () => {} }, document: {}, Blob: function Blob() {}, URL, FileReader: function FileReader() {} };
context.window = context;
vm.createContext(context);
for (const file of dataFiles) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
let code = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
code += "globalThis.__check={stages,extensionCourses,getAllLessons,getLessonSearchText,renderHighDensityLessonSections,normalizeState};";
vm.runInContext(code, context, { filename: "app.js" });

const { stages, extensionCourses, getAllLessons, getLessonSearchText, renderHighDensityLessonSections } = context.__check;
const all = getAllLessons();
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
expect(all.length === 152, `主线课程应为 152，实际 ${all.length}`);
expect(extensionCourses.length === 120, `专业方向课程应为 120，实际 ${extensionCourses.length}`);

for (const stage of stages) {
  const lessons = all.filter((lesson) => lesson.stageId === stage.id);
  expect(lessons.length === stage.lessons.length, `阶段 ${stage.id} 合并后数量错误`);
  for (const lesson of lessons) {
    expect(Boolean(lesson.density), `${lesson.id}: 未启用完整正文`);
    expect(lesson.prerequisites?.length >= 3, `${lesson.id}: prerequisites 少于 3`);
    expect(lesson.objectives?.length >= 3, `${lesson.id}: objectives 少于 3`);
    expect(lesson.knowledgePoints?.length >= 8, `${lesson.id}: knowledgePoints 少于 8`);
    expect(lesson.deepDive?.length >= 3, `${lesson.id}: deepDive 少于 3`);
    expect(Boolean(lesson.systemPosition), `${lesson.id}: systemPosition 缺失`);
    expect(lesson.workedExamples?.length >= 2, `${lesson.id}: workedExamples 少于 2`);
    expect(lesson.mistakes?.length >= 3, `${lesson.id}: mistakes 少于 3`);
    expect(lesson.troubleshooting?.length >= 6, `${lesson.id}: troubleshooting 少于 6`);
    expect(lesson.practices?.length >= 3, `${lesson.id}: practices 少于 3`);
    expect(lesson.quiz?.length === 6, `${lesson.id}: quiz 应为 6`);
    expect(lesson.references?.length >= 2, `${lesson.id}: references 少于 2`);
    expect(lesson.references?.every((item) => item.title && item.usage && item.url?.startsWith("https://")), `${lesson.id}: 引用字段或 HTTPS 错误`);
    expect(lesson.takeaways?.length >= 4, `${lesson.id}: takeaways 少于 4`);
    expect(renderHighDensityLessonSections(lesson).includes("density-overview"), `${lesson.id}: 正文渲染失败`);
    expect(getLessonSearchText(lesson).includes(lesson.knowledgePoints?.[0]?.term.toLowerCase()), `${lesson.id}: 详细知识未进入搜索`);
  }
}

const counts = Object.fromEntries(stages.map((stage) => [stage.id, all.filter((lesson) => lesson.stageId === stage.id && lesson.density).length]));
console.log("All-stage course detail check");
console.log(JSON.stringify({ mainLessons: all.length, extensionCourses: extensionCourses.length, detailedByStage: counts }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 阶段 0-9 的结构、引用、搜索和正文渲染检查通过。");

