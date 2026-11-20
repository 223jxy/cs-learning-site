#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const errors = [];
const warnings = [];

function probe(command, args = ["--version"], options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    timeout: options.timeout || 5000,
    env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" }
  });
  return {
    command,
    args,
    ok: !result.error && result.status === 0,
    status: result.status,
    error: result.error ? result.error.message : "",
    output: `${result.stdout || ""}${result.stderr || ""}`.trim()
  };
}

function firstOk(candidates) {
  const attempts = candidates.map((candidate) => probe(candidate.command, candidate.args));
  return {
    ok: attempts.some((attempt) => attempt.ok),
    selected: attempts.find((attempt) => attempt.ok) || null,
    attempts
  };
}

function existingFile(file) {
  const absolute = path.join(root, file);
  return {
    file,
    exists: fs.existsSync(absolute),
    bytes: fs.existsSync(absolute) ? fs.statSync(absolute).size : 0
  };
}

function findEdge() {
  const candidates = [
    process.env.EDGE_EXE,
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter(Boolean);
  const existing = candidates.find((candidate) => fs.existsSync(candidate));
  return {
    ok: Boolean(existing),
    selected: existing || null,
    candidates
  };
}

const node = probe(process.execPath, ["--version"]);
const bundledPython = "C:\\Users\\JXY\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const python = firstOk([
  ...(process.env.PYTHON ? [{ command: process.env.PYTHON, args: ["--version"] }] : []),
  ...(process.env.PYTHON_EXE ? [{ command: process.env.PYTHON_EXE, args: ["--version"] }] : []),
  ...(fs.existsSync(bundledPython) ? [{ command: bundledPython, args: ["--version"] }] : []),
  { command: "python", args: ["--version"] },
  { command: "py", args: ["-3", "--version"] },
  { command: "python3", args: ["--version"] }
]);
const powershell = firstOk([
  { command: "powershell", args: ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"] },
  { command: "pwsh", args: ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"] }
]);
const edge = findEdge();

const requiredFiles = [
  "index.html",
  "app-core-data.js", "data/mainline-data.js", "data/extension-data.js",
  "app-project-tools.js",
  "app-state.js",
  "app-model.js",
  "app-ai-view.js",
  "app-reading.js",
  "app-review-notes.js",
  "app-review-tools.js",
  "app-stage-review.js",
  "app-course-views.js",
  "app.js",
  "foundation-practice-labs.js",
  "stage4-9-sample-deep-dives.js",
  "styles.css",
  "scripts/check-app-architecture.js"
].map(existingFile);

if (!node.ok) errors.push("Node.js is not available.");
if (!python.ok) errors.push("Python is not available. Set PYTHON or PYTHON_EXE if needed.");
if (!powershell.ok) errors.push("PowerShell is not available.");
for (const file of requiredFiles) {
  if (!file.exists) errors.push(`Missing required file: ${file.file}`);
}
if (!edge.ok) warnings.push("Microsoft Edge executable was not found. Browser visual checks may need manual setup.");

const summary = {
  root,
  tools: {
    node: { ok: node.ok, command: node.command, version: node.output },
    python: {
      ok: python.ok,
      selected: python.selected ? {
        command: python.selected.command,
        args: python.selected.args,
        version: python.selected.output
      } : null,
      attempts: python.attempts.map((attempt) => ({
        command: attempt.command,
        args: attempt.args,
        ok: attempt.ok,
        status: attempt.status,
        error: attempt.error
      }))
    },
    powershell: {
      ok: powershell.ok,
      selected: powershell.selected ? {
        command: powershell.selected.command,
        args: powershell.selected.args,
        version: powershell.selected.output
      } : null
    },
    edge: {
      ok: edge.ok,
      selected: edge.selected,
      required: false
    }
  },
  requiredFiles,
  warnings,
  errors
};

console.log("Environment check");
console.log(JSON.stringify(summary, null, 2));
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: required local runtime and project files are available.");

