#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");
const root = path.resolve(__dirname, "..");
const context = { window: {} };
context.window.window = context.window;
vm.createContext(context.window);
for (const file of ["course-labs.js", "course-labs-stage6-9.js"]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context.window, { filename: file });

const labs = context.window.courseLabs;
const errors = [];
const passed = [];
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "computer-course-labs-"));

function resolvePythonRunner() {
  const candidates = [
    process.env.PYTHON && { command: process.env.PYTHON, prefixArgs: [] },
    process.env.PYTHON_EXE && { command: process.env.PYTHON_EXE, prefixArgs: [] },
    { command: "python", prefixArgs: [] },
    { command: "py", prefixArgs: ["-3"] },
    { command: "python3", prefixArgs: [] }
  ].filter(Boolean);
  for (const candidate of candidates) {
    const probe = spawnSync(candidate.command, [...candidate.prefixArgs, "--version"], {
      encoding: "utf8",
      timeout: 5000,
      windowsHide: true,
      env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" }
    });
    if (!probe.error && probe.status === 0) return candidate;
  }
  return null;
}

const pythonRunner = resolvePythonRunner();

try {
  for (const [id, lab] of Object.entries(labs)) {
    const folder = path.join(tempRoot, id);
    fs.mkdirSync(folder);
    const filename = lab.files[0];
    fs.writeFileSync(path.join(folder, filename), lab.code, "utf8");
    const runner = lab.runtime === "python" ? pythonRunner : { command: process.execPath, prefixArgs: [] };
    if (!runner) {
      errors.push(`${id}: 未找到可用 Python。可设置 PYTHON 环境变量指向 python.exe 后重试。`);
      continue;
    }
    const result = spawnSync(runner.command, [...runner.prefixArgs, filename], {
      cwd: folder,
      encoding: "utf8",
      timeout: 10000,
      windowsHide: true,
      env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" }
    });
    const output = `${result.stdout || ""}\n${result.stderr || ""}`;
    if (result.error) errors.push(`${id}: 启动失败 ${result.error.message}`);
    else if (result.status !== 0) errors.push(`${id}: 退出码 ${result.status}\n${output.trim()}`);
    else {
      const missing = lab.expected.filter((text) => !output.includes(text));
      if (missing.length) errors.push(`${id}: 缺少预期输出 ${missing.join(" | ")}\n${output.trim()}`);
      else passed.push(id);
    }
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log("Course lab execution check");
console.log(JSON.stringify({ total: Object.keys(labs).length, passed: passed.length, failed: errors.length, temporaryFilesCleaned: !fs.existsSync(tempRoot) }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 96 节课程实验均真实执行并匹配预期输出。");
