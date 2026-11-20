#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const mode = (process.argv[2] || "standard").toLowerCase();
const allowedModes = new Set(["quick", "standard", "full"]);

function runProbe(command, args = ["--version"]) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    timeout: 5000,
    env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" }
  });
  return !result.error && result.status === 0 ? { command, prefix: command === "py" ? ["-3"] : [] } : null;
}

function resolvePython() {
  const bundledPython = "C:\\Users\\JXY\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
  const candidates = [
    process.env.PYTHON,
    process.env.PYTHON_EXE,
    fs.existsSync(bundledPython) ? bundledPython : null,
    "python",
    "py",
    "python3"
  ].filter(Boolean);
  for (const command of candidates) {
    const probe = runProbe(command, command === "py" ? ["-3", "--version"] : ["--version"]);
    if (probe) return probe;
  }
  return null;
}

function scriptExists(scriptPath) {
  return fs.existsSync(path.join(root, scriptPath));
}

const quick = [
  { name: "syntax: app-project-tools", command: process.execPath, args: ["--check", "app-project-tools.js"] },
  { name: "syntax: app-stage-review", command: process.execPath, args: ["--check", "app-stage-review.js"] },
  { name: "syntax: app", command: process.execPath, args: ["--check", "app.js"] },
  { name: "environment", command: process.execPath, args: ["scripts/check-env.js"] },
  { name: "architecture", command: process.execPath, args: ["scripts/check-app-architecture.js"] },
  { name: "user-facing-copy", command: process.execPath, args: ["scripts/check-user-facing-copy.js"] },
  { name: "dom-keyboard", command: process.execPath, args: ["scripts/check-dom-keyboard.js"] }
];

const standard = [
  ...quick,
  { name: "stage samples", command: process.execPath, args: ["scripts/check-stage-samples.js"] },
  { name: "foundation practice labs", command: process.execPath, args: ["scripts/check-foundation-practice-labs.js"] },
  { name: "practice evidence", command: process.execPath, args: ["scripts/check-practice-evidence.js"] },
  { name: "stage sample deep dives", command: process.execPath, args: ["scripts/check-stage-sample-deep-dives.js"] },
  { name: "all-stage density", command: process.execPath, args: ["scripts/check-all-stage-density.js"] },
  { name: "library controls", command: process.execPath, args: ["scripts/check-library-controls.js"] },
  { name: "roadmap controls", command: process.execPath, args: ["scripts/check-roadmap-controls.js"] },
  { name: "dashboard week and backup", command: process.execPath, args: ["scripts/check-dashboard-week.js"] },
  { name: "display settings", command: process.execPath, args: ["scripts/check-display-settings.js"] },
  { name: "future route scopes", command: process.execPath, args: ["scripts/check-future-route-scopes.js"] },
  { name: "pwa offline", command: process.execPath, args: ["scripts/check-pwa.js"] },
  { name: "sync boundary", command: process.execPath, args: ["scripts/check-sync-boundary.js"] },
  { name: "reading resume", command: process.execPath, args: ["scripts/check-reading-resume.js"] },
  { name: "stage review", command: process.execPath, args: ["scripts/check-stage-review.js"] },
  { name: "stage9 project packages", command: process.execPath, args: ["scripts/check-stage9-project-packages.js"] },
  { name: "stage9 runtime", command: process.execPath, args: ["scripts/check-stage9-runtime.js"], needsPython: true }
];

const full = [
  ...standard,
  { name: "ai foundations", command: process.execPath, args: ["scripts/check-ai-foundations.js"] },
  { name: "ai zone", command: process.execPath, args: ["scripts/check-ai-zone.js"] },
  { name: "ai content quality", command: process.execPath, args: ["scripts/check-ai-content-quality.js"] },
  { name: "content uniqueness", command: process.execPath, args: ["scripts/check-content-uniqueness.js"] },
  { name: "course labs", command: process.execPath, args: ["scripts/check-course-labs.js"] },
  { name: "course lab runtime", command: process.execPath, args: ["scripts/run-course-lab-checks.js"], needsPython: true },
  { name: "portfolio starters", command: process.execPath, args: ["scripts/check-portfolio-starters.js"], needsPython: true },
  { name: "reference links", command: process.execPath, args: ["scripts/check-reference-links.js"] },
  { name: "browser UI", command: process.execPath, args: ["scripts/check-browser-ui.js"], timeout: 180000 },
  { name: "release package build", command: process.execPath, args: ["scripts/build-release-package.js"] },
  { name: "release package check", command: process.execPath, args: ["scripts/check-release-package.js"] }
];

const suites = { quick, standard, full };

if (!allowedModes.has(mode)) {
  console.error(`FAIL Unknown mode "${mode}". Use quick, standard, or full.`);
  process.exit(1);
}

const python = resolvePython();
const selected = suites[mode];
const results = [];

console.log(`Unified regression check: ${mode}`);

for (const task of selected) {
  const scriptPath = task.args.find((arg) => /^scripts[\\/].+\.js$/.test(arg));
  const startedAt = Date.now();
  if (scriptPath && !scriptExists(scriptPath)) {
    const result = {
      name: task.name,
      command: [task.command, ...task.args].join(" "),
      status: 1,
      durationMs: Date.now() - startedAt,
      skipped: false,
      error: `Missing script: ${scriptPath}`
    };
    results.push(result);
    console.error(`FAIL ${task.name}: ${result.error}`);
    continue;
  }

  const env = { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" };
  if (task.needsPython) {
    if (!python) {
      const result = {
        name: task.name,
        command: [task.command, ...task.args].join(" "),
        status: 1,
        durationMs: Date.now() - startedAt,
        skipped: false,
        error: "Python is required but was not found."
      };
      results.push(result);
      console.error(`FAIL ${task.name}: ${result.error}`);
      continue;
    }
    env.PYTHON = python.command;
    env.PYTHON_EXE = python.command;
  }

  console.log(`\n[RUN] ${task.name}`);
  console.log(`$ ${[task.command, ...task.args].join(" ")}`);
  const child = spawnSync(task.command, task.args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    timeout: task.timeout || 120000,
    env
  });
  const output = `${child.stdout || ""}${child.stderr || ""}`.trim();
  if (output) console.log(output);
  const result = {
    name: task.name,
    command: [task.command, ...task.args].join(" "),
    status: child.error ? 1 : child.status,
    durationMs: Date.now() - startedAt,
    skipped: false,
    error: child.error ? child.error.message : ""
  };
  results.push(result);
  console.log(`[DONE] ${task.name} status=${result.status} durationMs=${result.durationMs}`);
}

const failed = results.filter((result) => result.status !== 0);
const summary = {
  mode,
  total: results.length,
  passed: results.length - failed.length,
  failed: failed.length,
  python: python ? { command: python.command, prefix: python.prefix } : null,
  results
};

console.log("\nRegression summary");
console.log(JSON.stringify(summary, null, 2));
if (failed.length) process.exitCode = 1;
else console.log(`PASS: ${mode} regression suite completed.`);
