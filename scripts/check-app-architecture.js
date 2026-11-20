#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const layerFiles = [
  "app-core-data.js", "data/mainline-data.js", "data/extension-data.js",
  "app-project-tools.js",
  "app-state.js",
  "app-model.js",
  "app-ai-view.js",
  "app-reading.js",
  "app-review-notes.js",
  "app-stage-review.js",
  "app-course-views.js",
  "app.js"
];
const coreCheckLayerFiles = layerFiles.filter((file) => file !== "app-stage-review.js");
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const metrics = Object.fromEntries(layerFiles.map((file) => {
  const code = read(file);
  return [file, {
    lines: code.split(/\r?\n/).length - 1,
    bytes: Buffer.byteLength(code)
  }];
}));

for (const file of layerFiles) {
  expect(fs.existsSync(path.join(root, file)), `缺少应用分层文件：${file}`);
}

const indexHTML = read("index.html");
let previousIndex = -1;
for (const file of layerFiles) {
  const currentIndex = indexHTML.indexOf(`src="${file}"`);
  expect(currentIndex >= 0, `index.html 未加载 ${file}`);
  expect(currentIndex > previousIndex, `应用分层文件加载顺序错误：${file}`);
  previousIndex = currentIndex;
}

expect(metrics["app-project-tools.js"].lines <= 1600, "项目工具层超过 1600 行，应继续拆分");
expect(metrics["app-state.js"].lines <= 500, "状态层超过 500 行，应继续拆分");
expect(metrics["app-model.js"].lines <= 600, "模型访问层超过 600 行，应继续拆分");
expect(metrics["app-ai-view.js"].lines <= 500, "AI 视图层超过 500 行，应继续拆分");
expect(metrics["app-reading.js"].lines <= 600, "阅读模块超过 600 行，应继续拆分");
expect(metrics["app-review-notes.js"].lines <= 500, "复习笔记模块超过 500 行，应继续拆分");
expect(metrics["app-stage-review.js"].lines <= 350, "阶段复盘模块超过 350 行，应继续拆分");
expect(metrics["app-course-views.js"].lines <= 500, "课程视图模块超过 500 行，应继续拆分");
expect(metrics["app.js"].lines <= 3200, "主应用超过 3200 行，本轮拆分目标未达到");

const projectToolsCode = read("app-project-tools.js");
const stateCode = read("app-state.js");
const modelCode = read("app-model.js");
const aiViewCode = read("app-ai-view.js");
const readingCode = read("app-reading.js");
const reviewNotesCode = read("app-review-notes.js");
const stageReviewCode = read("app-stage-review.js");
const courseViewsCode = read("app-course-views.js");
const appCode = read("app.js");

expect(projectToolsCode.includes("const portfolioExecutionDetails"), "项目工具层缺少作品集执行数据");
expect(projectToolsCode.includes("function getUnifiedResourceIndex"), "项目工具层缺少资源索引逻辑");
expect(!appCode.includes("const portfolioExecutionDetails"), "主应用仍包含作品集大数据");
expect(stateCode.includes("let state = null;"), "状态层必须先声明空状态");
expect(!stateCode.includes("let state = loadState();"), "状态层不得在依赖函数加载前读取本地状态");
expect(modelCode.includes("state = loadState();"), "模型层就绪后必须初始化本地状态");
expect(modelCode.indexOf("state = loadState();") > modelCode.indexOf("function normalizeNoteTags"), "本地状态读取早于标签清洗函数");
expect(aiViewCode.includes("function renderAIZone"), "AI 视图层缺少专区渲染入口");
expect(!appCode.includes("function renderAIZone"), "主应用仍包含 AI 专区视图渲染");
expect(readingCode.includes("function setupLessonTableOfContents"), "阅读模块缺少章节目录逻辑");
expect(readingCode.includes("function saveReadingPositionForKey"), "阅读模块缺少断点保存逻辑");
expect(!appCode.includes("function setupLessonTableOfContents"), "主应用仍包含章节目录逻辑");
expect(!appCode.includes("function saveReadingPositionForKey"), "主应用仍包含断点保存逻辑");
expect(reviewNotesCode.includes("function renderMistakeReview"), "复习笔记模块缺少错题视图逻辑");
expect(reviewNotesCode.includes("function renderNoteSearch"), "复习笔记模块缺少笔记搜索逻辑");
expect(!appCode.includes("function renderMistakeReview"), "主应用仍包含错题视图逻辑");
expect(!appCode.includes("function renderNoteSearch"), "主应用仍包含笔记搜索逻辑");
expect(stageReviewCode.includes("function renderStageReview"), "阶段复盘模块缺少渲染入口");
expect(stageReviewCode.includes("function buildStageReviewMarkdown"), "阶段复盘模块缺少导出逻辑");
expect(!appCode.includes("function renderStageReview"), "主应用仍包含阶段复盘视图逻辑");
expect(courseViewsCode.includes("function renderLesson"), "课程视图模块缺少主线课程渲染逻辑");
expect(courseViewsCode.includes("function renderAILesson"), "课程视图模块缺少 AI 课程渲染逻辑");
expect(!appCode.includes("function renderLesson(lesson)"), "主应用仍包含主线课程渲染逻辑");
expect(!appCode.includes("function renderAILesson(lesson)"), "主应用仍包含 AI 课程渲染逻辑");

try {
  new vm.Script(layerFiles.map(read).join("\n"), { filename: "combined-app-layers.js" });
} catch (error) {
  errors.push(`应用分层合并语法错误：${error.message}`);
}

const sourceCheckFiles = fs.readdirSync(path.join(root, "scripts"))
  .filter((file) => file.endsWith(".js") && file !== path.basename(__filename))
  .filter((file) => read(path.join("scripts", file)).includes("app-core-data.js"));
for (const file of sourceCheckFiles) {
  const code = read(path.join("scripts", file));
  const requiredLayers = file === "check-stage-review.js" ? layerFiles : coreCheckLayerFiles;
  for (const layerFile of requiredLayers) {
    expect(code.includes(layerFile), `${file} 的源码加载列表缺少 ${layerFile}`);
  }
}

console.log("Application architecture check");
console.log(JSON.stringify({
  layers: metrics,
  sourceChecks: sourceCheckFiles.length,
  mainAppReduction: {
    originalLines: 11134,
    currentLines: metrics["app.js"].lines,
    percent: Math.round((1 - metrics["app.js"].lines / 11134) * 100)
  }
}, null, 2));

for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 应用数据、项目工具、状态、模型、AI 视图、阅读复盘与主交互层边界检查通过。");

