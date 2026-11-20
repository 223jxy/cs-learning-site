#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const http = require("http");
const { spawn, spawnSync } = require("child_process");

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
const dataFiles = [
  "foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js",
  "foundation-practice-labs.js",
  "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js",
  "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js",
  "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js"
];
for (const file of dataFiles) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
const appCode = [
  "app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js",
  "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"
].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
vm.runInContext(`${appCode}\nglobalThis.__runtime={getPortfolioProjects,buildPortfolioInitializerFiles};`, context, { filename: "app.js" });

const api = context.__runtime;
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "computer-stage9-runtime-"));
const errors = [];
const results = [];

function findPython() {
  const candidates = [process.env.PYTHON, process.env.PYTHON_EXE, "python", "py", "python3"].filter(Boolean);
  for (const command of candidates) {
    const args = command === "py" ? ["-3", "--version"] : ["--version"];
    const probe = spawnSync(command, args, { encoding: "utf8", windowsHide: true, timeout: 5000 });
    if (!probe.error && probe.status === 0) return { command, prefix: command === "py" ? ["-3"] : [] };
  }
  return null;
}

function writePackage(project) {
  const files = api.buildPortfolioInitializerFiles(project);
  const packageRoot = files.find((file) => file.name.endsWith("/")).name.replace(/\/$/, "");
  const absoluteRoot = path.join(tempRoot, packageRoot);
  for (const file of files) {
    const target = path.join(tempRoot, ...file.name.split("/"));
    if (file.name.endsWith("/")) fs.mkdirSync(target, { recursive: true });
    else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, String(file.content || ""), "utf8");
    }
  }
  return absoluteRoot;
}

function run(command, args, cwd, timeout = 15000) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
    timeout,
    env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" }
  });
  if (result.error || result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr || result.error?.message || result.stdout}`);
  return `${result.stdout || ""}\n${result.stderr || ""}`;
}

function request(port, pathname) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: "127.0.0.1", port, path: pathname }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.setTimeout(3000, () => req.destroy(new Error("request timeout")));
    req.on("error", reject);
  });
}

async function waitForService(port, child) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    if (child.exitCode != null) throw new Error(`service exited with ${child.exitCode}`);
    try { return await request(port, "/health"); } catch {}
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("service did not become ready");
}

async function checkWeb(project) {
  const packageRoot = writePackage(project);
  const smoke = run(process.execPath, [path.join("starter", "smoke.js")], packageRoot);
  const contract = run(process.execPath, [path.join("tests", "contract.js")], packageRoot);
  if (!smoke.includes("WEB starter smoke: PASS") || !contract.includes("WEB contract metadata: PASS")) {
    throw new Error(`${project.number}: Web smoke output incomplete`);
  }
  return { project: project.number, route: "WEB", smoke: "PASS", apiContract: "PASS" };
}

async function checkCloud(project, python) {
  const packageRoot = writePackage(project);
  const smoke = run(python.command, [...python.prefix, path.join("starter", "service.py"), "--smoke"], packageRoot);
  const contract = run(python.command, [...python.prefix, path.join("tests", "contract.py")], packageRoot);
  if (!smoke.includes('"health"') || !contract.includes("CLOUD contract metadata: PASS")) {
    throw new Error(`${project.number}: Cloud smoke output incomplete`);
  }
  const port = 18080 + Math.floor(Math.random() * 500);
  const child = spawn(python.command, [...python.prefix, path.join("starter", "service.py")], {
    cwd: packageRoot,
    windowsHide: true,
    env: { ...process.env, PORT: String(port), PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  try {
    const health = await waitForService(port, child);
    const courses = await request(port, "/api/courses");
    if (health.status !== 200 || !health.headers["x-request-id"]) throw new Error(`${project.number}: /health contract failed`);
    if (courses.status !== 200 || !JSON.parse(courses.body).items?.length) throw new Error(`${project.number}: /api/courses contract failed`);
  } finally {
    child.kill();
    if (child.exitCode == null) await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return { project: project.number, route: "CLOUD", smoke: "PASS", liveHealth: "PASS", liveCourses: "PASS" };
}

(async () => {
  const projects = api.getPortfolioProjects().filter((project) => project.routeCode === "WEB" || project.routeCode === "CLOUD");
  const python = findPython();
  if (!python) throw new Error("未找到 Python，请设置 PYTHON 后重试。");
  for (const project of projects) {
    try {
      results.push(project.routeCode === "WEB" ? await checkWeb(project) : await checkCloud(project, python));
    } catch (error) {
      errors.push(error.message);
    }
  }
})().catch((error) => errors.push(error.message)).finally(() => {
  fs.rmSync(tempRoot, { recursive: true, force: true });
  console.log("Stage 9 runtime check");
  console.log(JSON.stringify({ projects: results.length, expected: 6, results, errors: errors.length, temporaryFilesCleaned: !fs.existsSync(tempRoot) }, null, 2));
  for (const error of errors) console.error(`FAIL ${error}`);
  if (errors.length || results.length !== 6) process.exitCode = 1;
  else console.log("PASS: 阶段 9 Web / Cloud 启动包完成真实入口、健康接口、课程接口和契约测试验收。");
});

