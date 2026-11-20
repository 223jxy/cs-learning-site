#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const releaseRoot = path.join(root, "outputs", "release");
const packageRoot = path.join(releaseRoot, "computer-learning-site");

const applicationLayerFiles = [
  "app-core-data.js",
  "data/mainline-data.js",
  "data/extension-data.js",
  "app-project-tools.js",
  "app-state.js",
  "app-model.js",
  "app-ai-view.js",
  "app-reading.js",
  "app-review-notes.js",
  "app-review-tools.js",
  "app-stage-review.js",
  "app-course-views.js",
  "app.js"
];

const includeRootFiles = [
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "sw.js",
  ...applicationLayerFiles,
  "foundation-high-density.js",
  "stage1-high-density.js",
  "stage2-high-density.js",
  "stage3-high-density.js",
  "foundation-practice-labs.js",
  "stage4-course-config.js",
  "stage4-high-density.js",
  "stage5-high-density.js",
  "stage6-high-density.js",
  "stage7-high-density.js",
  "stage8-high-density.js",
  "stage9-high-density.js",
  "stage4-9-sample-deep-dives.js",
  "stage4-8-course-references.js",
  "lesson-profile-builder.js",
  "course-labs.js",
  "course-labs-stage6-9.js",
  "ai-zone-data.js",
  "ai-zone-az2-data.js",
  "ai-zone-az3-data.js",
  "ai-zone-az4-data.js",
  "ai-zone-az5-data.js",
  "ai-zone-az6-data.js",
  "ai-foundation-data.js",
  "ai-foundation-depth-data.js",
  "scripts/run-practice-verification.js",
  "README.md",
  "网站介绍文档.md",
  "网站设计大纲.md",
  "网站长期运行部署与运营规划方案.md",
  "同步架构边界.md"
];

const includeDirectories = [
  "assets",
  "data",
  "styles"
];

const excludedNames = new Set([
  ".git",
  ".agents",
  ".codex",
  ".playwright-mcp",
  "work",
  "node_modules",
  "__pycache__",
  ".venv",
  "venv"
]);

function assertInsideWorkspace(target) {
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refuse to write outside workspace: ${target}`);
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(packageRoot, relativePath);
  if (!fs.existsSync(source)) throw new Error(`Missing release source: ${relativePath}`);
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

function copyDirectory(relativeDir) {
  const sourceDir = path.join(root, relativeDir);
  if (!fs.existsSync(sourceDir)) throw new Error(`Missing release directory: ${relativeDir}`);
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    if (excludedNames.has(entry.name)) continue;
    const childRelative = path.join(relativeDir, entry.name);
    const childSource = path.join(root, childRelative);
    if (entry.isDirectory()) {
      copyDirectory(childRelative);
    } else if (entry.isFile()) {
      copyFile(childRelative);
    } else if (entry.isSymbolicLink()) {
      throw new Error(`Symlink is not allowed in release package: ${childRelative}`);
    }
  }
}

function collectFiles(dir, base = dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(absolute, base));
    } else if (entry.isFile()) {
      files.push(path.relative(base, absolute).replace(/\\/g, "/"));
    }
  }
  return files.sort();
}

assertInsideWorkspace(packageRoot);
if (fs.existsSync(packageRoot)) fs.rmSync(packageRoot, { recursive: true, force: true });
ensureDir(packageRoot);

for (const file of includeRootFiles) copyFile(file);
for (const dir of includeDirectories) copyDirectory(dir);

const files = collectFiles(packageRoot);
const bytes = files.reduce((sum, file) => sum + fs.statSync(path.join(packageRoot, file)).size, 0);
const manifest = {
  name: "computer-learning-site",
  generatedAt: new Date().toISOString(),
  entry: "index.html",
  files: files.length,
  bytes,
  includeRootFiles,
  includeDirectories,
  excluded: [...excludedNames].sort(),
  run: {
    localFile: "open index.html",
    localServer: "python -m http.server 8080",
    browserUrl: "http://127.0.0.1:8080/"
  },
  checks: [
    "node scripts/check-all.js standard",
    "node scripts/check-all.js full",
    "node scripts/check-release-package.js"
  ]
};
fs.writeFileSync(path.join(packageRoot, "release-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
fs.writeFileSync(path.join(packageRoot, "DEPLOYMENT.md"), [
  "# 计算机学习地图部署说明",
  "",
  "## 本地预览",
  "",
  "```powershell",
  "python -m http.server 8080",
  "```",
  "",
  "打开：",
  "",
  "```text",
  "http://127.0.0.1:8080/",
  "```",
  "",
  "## 静态托管",
  "",
  "把本目录完整上传到 GitHub Pages、Cloudflare Pages、Netlify、Vercel 或 Nginx 静态目录即可。",
  "",
  "部署后检查首页、课程阅读、专业方向、AI 专区、项目作品集、搜索、笔记和学习状态导出。",
  "通过 HTTP/HTTPS 部署时会注册 manifest.webmanifest 和 sw.js；首次打开后可在断网状态重载已缓存页面。",
  "",
  "## 不包含内容",
  "",
  "- `.git/`",
  "- `work/`",
  "- `.playwright-mcp/`",
  "- 浏览器 profile/cache/Crashpad",
  "- 临时日志、PID、压缩包和依赖目录",
  ""
].join("\n"), "utf8");

console.log("Release package build");
console.log(JSON.stringify({
  packageRoot,
  files: manifest.files,
  bytes: manifest.bytes,
  manifest: "release-manifest.json"
}, null, 2));
console.log("PASS: release package generated.");
