#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

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

const appFiles = [
  "app-core-data.js",
  "data/mainline-data.js",
  "data/extension-data.js",
  "app-project-tools.js",
  "app-state.js",
  "app-model.js",
  "app-ai-view.js",
  "app-reading.js",
  "app-review-notes.js",
  "app-course-views.js",
  "app.js"
];

const expected = {
  0: ["file-basics", "paths", "archives", "text-encoding-line-endings"],
  1: ["hardware", "program-process", "windows-folders", "accounts-permissions"],
  2: ["dns-resolution", "ports-protocols-localhost", "http", "network-troubleshooting"],
  3: ["shell", "cmdlets-parameters", "safe-practice-folder", "pipeline-objects"]
};

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
  vm.runInContext(read(file), context, { filename: file });
}

let appCode = appFiles.map(read).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += "\nglobalThis.__foundationLabCheck={stages,getAllLessons,getLessonSearchText,renderHighDensityLessonSections};";
vm.runInContext(appCode, context, { filename: "combined-app.js" });

const labMap = context.foundationPracticeLabs || {};
const labIds = Object.keys(labMap).sort();
const expectedIds = Object.values(expected).flat().sort();
expect(labIds.length === 16, `基础半自动实验数量应为 16，实际为 ${labIds.length}`);
expect(JSON.stringify(labIds) === JSON.stringify(expectedIds), "基础半自动实验 ID 与计划清单不一致");

const lessons = context.__foundationLabCheck.getAllLessons();
expect(lessons.length === 152, `主线课程数量应保持 152，实际为 ${lessons.length}`);
const byId = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));

for (const [stageId, ids] of Object.entries(expected)) {
  expect(ids.length === 4, `阶段 ${stageId} 应配置 4 个基础半自动实验`);
  for (const id of ids) {
    const lab = labMap[id];
    const lesson = byId[id];
    expect(lab, `${id}: 实验缺失`);
    expect(lesson, `${id}: 课程缺失`);
    if (!lab || !lesson) continue;
    expect(String(lesson.stageId) === String(stageId), `${id}: 阶段应为 ${stageId}，实际为 ${lesson.stageId}`);
    expect(lesson.lab === lab, `${id}: 课程未合并基础实验`);
    for (const field of ["title", "runtime", "command", "code"]) {
      expect(Boolean(lab[field]), `${id}: ${field} 缺失`);
    }
    expect(["powershell", "javascript"].includes(lab.runtime), `${id}: runtime 不在允许范围`);
    expect(Array.isArray(lab.files) && lab.files.length === 1, `${id}: files 应包含一个实验文件`);
    expect(Array.isArray(lab.expected) && lab.expected.length >= 3, `${id}: expected 少于 3 条`);
    expect(Array.isArray(lab.cases) && lab.cases.length >= 2, `${id}: cases 少于 2 条`);
    expect(Array.isArray(lab.checks) && lab.checks.length >= 4, `${id}: checks 少于 4 条`);
    expect(context.__foundationLabCheck.getLessonSearchText(lesson).includes(lab.command.toLowerCase()), `${id}: 实验命令未进入搜索文本`);
    expect(context.__foundationLabCheck.renderHighDensityLessonSections(lesson).includes("course-lab-section"), `${id}: 实验区未渲染`);
  }
}

function runLab(id, lab) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `foundation-lab-${id}-`));
  try {
    const file = lab.runtime === "powershell" ? "lab.ps1" : "lab.js";
    fs.writeFileSync(path.join(tempRoot, file), lab.code, "utf8");
    const child = lab.runtime === "powershell"
      ? spawnSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", file], {
        cwd: tempRoot,
        encoding: "utf8",
        windowsHide: true,
        timeout: 15000,
        env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" }
      })
      : spawnSync(process.execPath, [file], {
        cwd: tempRoot,
        encoding: "utf8",
        windowsHide: true,
        timeout: 15000,
        env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" }
      });
    const output = `${child.stdout || ""}${child.stderr || ""}`;
    expect(!child.error, `${id}: 实验启动失败：${child.error?.message || ""}`);
    expect(child.status === 0, `${id}: 实验退出码 ${child.status}，输出：${output.trim()}`);
    for (const expectedText of lab.expected) {
      expect(output.includes(expectedText), `${id}: 输出缺少 ${expectedText}，实际输出：${output.trim()}`);
    }
    return { id, runtime: lab.runtime, status: child.error ? 1 : child.status, outputLines: output.trim().split(/\r?\n/).filter(Boolean).length };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

const runtimeResults = [];
for (const id of expectedIds) {
  runtimeResults.push(runLab(id, labMap[id]));
}

const remainingTemp = fs.readdirSync(os.tmpdir()).filter((name) => name.startsWith("foundation-lab-"));
expect(remainingTemp.length === 0, `临时实验目录未清理：${remainingTemp.join(", ")}`);

console.log("Foundation practice lab check");
console.log(JSON.stringify({
  labCount: labIds.length,
  stages: Object.fromEntries(Object.entries(expected).map(([stageId, ids]) => [stageId, ids.length])),
  runtime: runtimeResults.reduce((acc, result) => {
    acc[result.runtime] = (acc[result.runtime] || 0) + 1;
    return acc;
  }, {}),
  lessons: lessons.length,
  errors: errors.length
}, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 阶段 0-3 首批 16 个半自动实验已合并、渲染、可搜索，并通过真实运行验收。");
