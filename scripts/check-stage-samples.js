#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { TextDecoder } = require("util");

const root = path.resolve(__dirname, "..");
const dataFiles = [
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

for (const file of dataFiles) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

const appCode = [
  "app-core-data.js", "data/mainline-data.js", "data/extension-data.js",
  "app-project-tools.js",
  "app-state.js",
  "app-model.js",
  "app-ai-view.js",
  "app-reading.js",
  "app-review-notes.js",
  "app-course-views.js",
  "app.js"
].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
vm.runInContext(
  `${appCode}\nglobalThis.__stageSampleCheck={stages,getAllLessons,getLessonSearchText,renderHighDensityLessonSections};`,
  context,
  { filename: "app.js" }
);

const { stages, getAllLessons, getLessonSearchText, renderHighDensityLessonSections } = context.__stageSampleCheck;
const allLessons = getAllLessons();
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
const picks = {
  0: ["file-basics", "archives"],
  1: ["hardware", "accounts-permissions"],
  2: ["http", "network-troubleshooting"],
  3: ["safe-practice-folder", "pipeline-objects"]
};
const mojibake = /[\uFFFD]|(?:Ã|Â|â€|ðŸ|锟斤拷)/;
const textOf = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textOf).join("\n");
  if (typeof value === "object") return Object.values(value).map(textOf).join("\n");
  return String(value);
};

for (const file of ["index.html", "app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "stage2-high-density.js", "course-labs-stage6-9.js"]) {
  const buffer = fs.readFileSync(path.join(root, file));
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    errors.push(`${file}: UTF-8 解码失败`);
  }
}

for (const stageId of [0, 1, 2, 3]) {
  const stage = stages.find((item) => item.id === stageId);
  expect(stage, `阶段 ${stageId}: 阶段对象缺失`);
  expect(stage?.lessons.length === ({ 0: 20, 1: 12, 2: 12, 3: 12 }[stageId]), `阶段 ${stageId}: 课程数量不符`);
  const lessons = allLessons.filter((lesson) => lesson.stageId === stageId);
  expect(lessons.length === stage?.lessons.length, `阶段 ${stageId}: 合并后课程数量不符`);
  for (const id of picks[stageId]) {
    const lesson = lessons.find((item) => item.id === id);
    expect(lesson, `阶段 ${stageId}: 抽样课程 ${id} 缺失`);
    if (!lesson) continue;
    expect(lesson.references?.length >= 2, `${id}: 引用少于 2 条`);
    expect(lesson.references?.every((item) => item.url?.startsWith("https://") && item.title && item.usage), `${id}: 引用字段不完整`);
    expect(lesson.workedExamples?.length >= 2, `${id}: 案例少于 2 个`);
    expect(lesson.practices?.length >= 3, `${id}: 练习少于 3 个`);
    expect(lesson.practices?.every((item) => item.task && item.evidence), `${id}: 练习缺少任务或证据`);
    expect(lesson.quiz?.length === 6, `${id}: 题目数量不是 6`);
    expect(renderHighDensityLessonSections(lesson).includes("density-overview"), `${id}: 正文渲染缺少概览`);
    expect(getLessonSearchText(lesson).includes(String(lesson.knowledgePoints?.[0]?.term || "").toLowerCase()), `${id}: 知识点未进入搜索文本`);
    expect(!mojibake.test(textOf(lesson)), `${id}: 发现疑似乱码字符`);
  }
}

const sampled = Object.values(picks).flat();
const sampleLessons = allLessons.filter((lesson) => sampled.includes(lesson.id));
const byId = Object.fromEntries(sampleLessons.map((lesson) => [lesson.id, lesson]));
expect(byId["file-basics"]?.practices?.[0]?.task.includes(".exe"), "file-basics: 未覆盖可执行文件边界");
expect(byId["network-troubleshooting"]?.practices?.[1]?.title.includes("八步"), "network-troubleshooting: 排障步骤命名未同步");
expect(byId["safe-practice-folder"]?.example.includes("$HOME"), "safe-practice-folder: 未使用安全绝对路径");
expect(byId["pipeline-objects"]?.example.includes("-Property CPU") && byId["pipeline-objects"]?.example.includes("累计"), "pipeline-objects: CPU 指标边界未说明");

console.log("Stage 0-3 sample check");
console.log(JSON.stringify({ stages: [0, 1, 2, 3], sampledLessons: sampled.length, utf8FilesChecked: 4, errors: errors.length }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 阶段 0-3 抽样课程结构、引用、案例、练习、搜索与 UTF-8 检查通过。");

