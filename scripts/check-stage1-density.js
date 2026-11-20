#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const denseIds = ["hardware", "program-process", "windows-folders", "startup-chain", "install-path", "accounts-permissions", "file-permissions", "environment-registry", "task-manager", "services-events", "device-manager", "disk-management"];

function loadData() {
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
  for (const file of ["foundation-high-density.js", "stage1-high-density.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
  }
  let code = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
  code += `globalThis.__check = { stages, extensionCourses, getAllLessons, getLessonSearchText, renderHighDensityLessonSections, normalizeState };`;
  vm.runInContext(code, context, { filename: "app.js" });
  return context;
}

function run() {
  const context = loadData();
  const data = context.__check;
  const profiles = context.stage1HighDensityProfiles || {};
  const allLessons = data.getAllLessons();
  const stage1Ids = new Set(data.stages[1].lessons.map((lesson) => lesson.id));
  const stage1 = allLessons.filter((lesson) => stage1Ids.has(lesson.id));
  const denseLessons = stage1.filter((lesson) => denseIds.includes(lesson.id));
  const errors = [];
  const expect = (condition, message) => { if (!condition) errors.push(message); };

  expect(allLessons.length === 152, `主线课程应为 152，实际 ${allLessons.length}`);
  expect(data.extensionCourses.length === 120, `专业课程应为 120，实际 ${data.extensionCourses.length}`);
  expect(stage1.length === 12, `阶段 1 应为 12 节，实际 ${stage1.length}`);
  expect(Object.keys(profiles).length === 12, `阶段 1 高密度 profile 应为 12，实际 ${Object.keys(profiles).length}`);
  expect(denseLessons.length === 12 && denseLessons.every((lesson) => lesson.density), "阶段 1 课程未全部启用高密度正文");

  for (const lesson of denseLessons) {
    expect(lesson.objectives?.length >= 3, `${lesson.id}: objectives 少于 3`);
    expect(lesson.knowledgePoints?.length >= 8, `${lesson.id}: knowledgePoints 少于 8`);
    expect(lesson.deepDive?.length >= 3, `${lesson.id}: deepDive 少于 3`);
    expect(lesson.workedExamples?.length >= 2, `${lesson.id}: workedExamples 少于 2`);
    expect(lesson.mistakes?.length >= 3, `${lesson.id}: mistakes 少于 3`);
    expect(lesson.troubleshooting?.length >= 3, `${lesson.id}: troubleshooting 少于 3`);
    expect(lesson.practices?.length >= 2, `${lesson.id}: practices 少于 2`);
    expect(lesson.quiz?.length === 6, `${lesson.id}: quiz 应为 6`);
    expect(lesson.references?.length >= 2, `${lesson.id}: references 少于 2`);
    expect(lesson.references.every((reference) => new URL(reference.url).protocol === "https:"), `${lesson.id}: 存在非 HTTPS 引用`);
    const rendered = data.renderHighDensityLessonSections(lesson);
    expect(rendered.includes("density-overview"), `${lesson.id}: 未输出高密度结构`);
    expect(!rendered.includes("<h2>关键概念</h2>"), `${lesson.id}: 重复输出旧版关键概念区`);
  }

  expect(data.getLessonSearchText(denseLessons.find((lesson) => lesson.id === "hardware")).includes("虚拟内存"), "hardware 外置知识点未进入搜索文本");
  expect(data.getLessonSearchText(denseLessons.find((lesson) => lesson.id === "program-process")).includes("pid"), "program-process 外置知识点未进入搜索文本");
  expect(data.getLessonSearchText(denseLessons.find((lesson) => lesson.id === "windows-folders")).includes("known folder"), "windows-folders 外置知识点未进入搜索文本");
  expect(data.getLessonSearchText(denseLessons.find((lesson) => lesson.id === "install-path")).includes("get-command"), "install-path 外置知识点未进入搜索文本");

  vm.runInContext(`globalThis.__normalized = normalizeState({ quizResults: {
    hardware: { answers: [0, 1, 2, 3, 0, 1], score: 5, total: 6 }
  }});`, context);
  expect(context.__normalized.quizResults.hardware?.answers.length === 6, "阶段 1 高密度测验导入被截断");

  console.log("Stage 1 density check");
  console.log(JSON.stringify({ mainLessons: allLessons.length, stage1Lessons: stage1.length, denseStage1Lessons: denseLessons.length, extensionCourses: data.extensionCourses.length }, null, 2));
  for (const error of errors) console.error(`FAIL ${error}`);
  if (errors.length) process.exitCode = 1;
  else console.log("PASS: 阶段 1 十二节高密度课程的结构、搜索、渲染和状态兼容检查通过。");
}

run();

