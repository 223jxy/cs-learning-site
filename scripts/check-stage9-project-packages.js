#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

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
vm.runInContext(`${appCode}\nglobalThis.__stage9={getPortfolioProjects,getPortfolioStarterKit,buildPortfolioInitializerFiles};`, context, { filename: "app.js" });

const api = context.__stage9;
const errors = [];
const expected = {
  WEB: ["starter/index.html", "starter/app.js", "starter/server.js", "starter/smoke.js", "starter/data/courses.json", "starter/.env.example", "docs/api.md", "tests/contract.js"],
  CLOUD: ["starter/service.py", "starter/workflow.json", "starter/data/courses.json", "starter/config.example.json", "starter/.env.example", "starter/Dockerfile", "compose.yml", "docs/runbook.md", "tests/contract.py"]
};

for (const project of api.getPortfolioProjects().filter((item) => expected[item.routeCode])) {
  const starter = api.getPortfolioStarterKit(project);
  const paths = new Set(starter.files.map((file) => file.path));
  for (const required of expected[project.routeCode]) {
    if (!paths.has(required)) errors.push(`${project.number}: 缺少 ${required}`);
  }
  const content = Object.fromEntries(starter.files.map((file) => [file.path, String(file.content)]));
  if (project.routeCode === "WEB") {
    if (!content["starter/server.js"].includes("/api/health")) errors.push(`${project.number}: Web server 缺少 health API`);
    if (!content["starter/smoke.js"].includes("missing 404")) errors.push(`${project.number}: Web smoke 缺少 404 契约`);
    if (!content["docs/api.md"].includes("/api/courses")) errors.push(`${project.number}: API 文档缺少课程接口`);
  }
  if (project.routeCode === "CLOUD") {
    if (!content["starter/service.py"].includes("X-Request-Id")) errors.push(`${project.number}: Cloud 服务缺少 request ID`);
    if (content["starter/service.py"].includes("API_TOKEN")) errors.push(`${project.number}: Cloud 服务不应输出秘密字段`);
    if (!content["compose.yml"].includes("healthcheck")) errors.push(`${project.number}: compose 缺少 healthcheck`);
    if (!content["docs/runbook.md"].includes("回滚")) errors.push(`${project.number}: runbook 缺少回滚说明`);
  }
  const packageFiles = api.buildPortfolioInitializerFiles(project);
  const packageRoot = packageFiles.find((file) => file.name.endsWith("/"))?.name || "";
  const packagePaths = new Set(packageFiles.map((file) => file.name.startsWith(packageRoot) ? file.name.slice(packageRoot.length) : file.name));
  for (const required of expected[project.routeCode]) {
    if (!packagePaths.has(required)) errors.push(`${project.number}: ZIP 初始化包缺少 ${required}`);
  }
}

const page = fs.readFileSync(path.join(root, "app.js"), "utf8");
if (!page.includes("启动包目录") || !page.includes("starterFileTree")) errors.push("项目执行页未渲染启动包目录");

console.log("Stage 9 Web/Cloud package check");
console.log(JSON.stringify({
  webProjects: api.getPortfolioProjects().filter((item) => item.routeCode === "WEB").length,
  cloudProjects: api.getPortfolioProjects().filter((item) => item.routeCode === "CLOUD").length,
  errors: errors.length
}, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 阶段 9 Web / Cloud 页面目录、启动文件、文档、测试和 ZIP 初始化包检查通过。");

