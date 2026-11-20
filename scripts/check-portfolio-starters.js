#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");
const { createHash } = require("crypto");

const root = path.resolve(__dirname, "..");
const context = {
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: {},
  Blob,
  TextEncoder,
  URL,
  FileReader: function FileReader() {}
};
context.window = context;
vm.createContext(context);

for (const file of [
  "foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js",
  "foundation-practice-labs.js",
  "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js",
  "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js",
  "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js"
]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += "globalThis.__starterCheck={getPortfolioProjects,getPortfolioStarterKit,buildPortfolioInitializerFiles,getPortfolioTemplateBaseName};";
vm.runInContext(appCode, context, { filename: "app.js" });

const api = context.__starterCheck;
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "computer-map-starters-"));
const failures = [];
const passedByDirection = {};
const workflowIds = new Set();
const starterFingerprints = new Set();

function resolvePythonExecutable() {
  const candidates = [process.env.PYTHON, process.env.PYTHON_EXE, "python", "py", "python3"].filter(Boolean);
  for (const command of candidates) {
    const args = command === "py" ? ["-3", "--version"] : ["--version"];
    const result = spawnSync(command, args, { encoding: "utf8", timeout: 5000, windowsHide: true });
    if (!result.error && result.status === 0) return command;
  }
  return "";
}

const pythonExecutable = resolvePythonExecutable();

try {
  for (const project of api.getPortfolioProjects()) {
    const starter = api.getPortfolioStarterKit(project);
    workflowIds.add(starter.workflow.id);
    starterFingerprints.add(createHash("sha256").update(starter.files.filter((file) => file.path.startsWith("starter/")).map((file) => `${file.path}\n${file.content}`).join("\n---\n")).digest("hex"));
    const base = api.getPortfolioTemplateBaseName(project);
    for (const file of api.buildPortfolioInitializerFiles(project)) {
      const target = path.join(temporaryRoot, ...file.name.split("/"));
      if (file.name.endsWith("/")) fs.mkdirSync(target, { recursive: true });
      else {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, String(file.content || ""), "utf8");
      }
    }
    const verifier = path.join(temporaryRoot, base, "scripts", "verify-project.ps1");
    const result = spawnSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", verifier, "-StructureOnly", "-RunStarter"], {
      cwd: path.join(temporaryRoot, base),
      encoding: "utf8",
      timeout: 20000,
      env: { ...process.env, ...(pythonExecutable ? { PYTHON: pythonExecutable } : {}) }
    });
    if (result.status !== 0) failures.push(`${project.number}: ${result.stderr || result.stdout || `exit ${result.status}`}`.trim());
    else passedByDirection[project.routeCode] = (passedByDirection[project.routeCode] || 0) + 1;
  }
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

if (workflowIds.size !== api.getPortfolioProjects().length) failures.push(`workflow ids: expected 18, got ${workflowIds.size}`);
if (starterFingerprints.size !== api.getPortfolioProjects().length) failures.push(`starter fingerprints: expected 18, got ${starterFingerprints.size}`);

console.log("Portfolio starter execution check");
console.log(JSON.stringify({ total: api.getPortfolioProjects().length, passed: api.getPortfolioProjects().length - failures.length, workflowIds: workflowIds.size, uniqueStarterFingerprints: starterFingerprints.size, passedByDirection, temporaryFilesCleaned: !fs.existsSync(temporaryRoot) }, null, 2));
for (const failure of failures) console.error(`FAIL ${failure}`);
if (failures.length) process.exitCode = 1;
else console.log("PASS: 18 个项目专属启动代码均唯一并通过真实 smoke test。");

