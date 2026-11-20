#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const packageRoot = path.join(root, "outputs", "release", "computer-learning-site");
const errors = [];
const warnings = [];

function expect(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function collectFiles(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
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

const requiredFiles = [
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "sw.js",
  "styles/base.css",
  "styles/ai-zone.css",
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
  "app.js",
  "foundation-practice-labs.js",
  "stage4-9-sample-deep-dives.js",
  "scripts/run-practice-verification.js",
  "README.md",
  "DEPLOYMENT.md",
  "release-manifest.json",
  "网站长期运行部署与运营规划方案.md",
  "同步架构边界.md"
];

expect(fs.existsSync(packageRoot), "Release package does not exist. Run node scripts/build-release-package.js first.");

const files = collectFiles(packageRoot);
const fileSet = new Set(files);
for (const file of requiredFiles) {
  expect(fileSet.has(file), `Missing release file: ${file}`);
}

const forbiddenPatterns = [
  /^\.git\//,
  /^work\//,
  /^\.playwright-mcp\//,
  /(^|\/)node_modules\//,
  /(^|\/)Crashpad\//,
  /(^|\/)Cache\//,
  /(^|\/)Code Cache\//,
  /(^|\/)GPUCache\//,
  /\.(pid|log|err|out)$/i,
  /\.(zip|7z|tar|tgz|tar\.gz)$/i
];
for (const file of files) {
  for (const pattern of forbiddenPatterns) {
    expect(!pattern.test(file), `Forbidden file in release package: ${file}`);
  }
}

const totalBytes = files.reduce((sum, file) => sum + fs.statSync(path.join(packageRoot, file)).size, 0);
warn(totalBytes < 15 * 1024 * 1024, `Release package is large: ${totalBytes} bytes`);

const html = fs.existsSync(path.join(packageRoot, "index.html"))
  ? fs.readFileSync(path.join(packageRoot, "index.html"), "utf8")
  : "";
const scriptRefs = [...html.matchAll(/<script\s+src=["']([^"']+)["']/g)].map((match) => match[1]);
const styleRefs = [...html.matchAll(/<link[^>]+href=["']([^"']+\.css)["']/g)].map((match) => match[1]);
for (const ref of [...scriptRefs, ...styleRefs]) {
  expect(fileSet.has(ref), `HTML references missing release asset: ${ref}`);
}

function collectCssImports(file, seen = new Set()) {
  if (seen.has(file)) return [];
  seen.add(file);
  const absolute = path.join(packageRoot, file);
  if (!fs.existsSync(absolute)) return [file];
  const css = fs.readFileSync(absolute, "utf8");
  const imports = [...css.matchAll(/@import\s+url\(["']?([^"')]+)["']?\);/g)].map((match) => match[1]);
  return imports.flatMap((importPath) => [
    importPath,
    ...collectCssImports(importPath, seen)
  ]);
}
for (const cssRef of styleRefs) {
  for (const imported of collectCssImports(cssRef)) {
    expect(fileSet.has(imported), `CSS import missing release asset: ${imported}`);
  }
}

const sw = fs.existsSync(path.join(packageRoot, "sw.js"))
  ? fs.readFileSync(path.join(packageRoot, "sw.js"), "utf8")
  : "";
expect(sw.includes("CACHE_NAME") && sw.includes("STATIC_ASSETS") && sw.includes("event.respondWith"), "Release service worker is incomplete.");
const staticAssetsSource = sw.match(/const STATIC_ASSETS = \[(.*?)\];/s)?.[1] || "";
const staticAssets = [...staticAssetsSource.matchAll(/[\"']([^\"']+)[\"']/g)].map((match) => match[1]);
expect(staticAssets.length >= 10, "Release service worker cache list is incomplete.");
for (const asset of staticAssets) {
  const releaseAsset = asset === "./" ? "index.html" : asset.replace(/^\.\//, "");
  expect(fileSet.has(releaseAsset), `Release service worker cache asset is missing: ${asset}`);
}

try {
  for (const jsFile of files.filter((file) => file.endsWith(".js"))) {
    new vm.Script(fs.readFileSync(path.join(packageRoot, jsFile), "utf8"), { filename: jsFile });
  }
} catch (error) {
  errors.push(`Release JavaScript syntax failed: ${error.message}`);
}

let manifest = null;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "release-manifest.json"), "utf8"));
  expect(manifest.entry === "index.html", "Release manifest entry is not index.html.");
  expect(manifest.files + 2 === files.length, "Release manifest file count does not match generated package.");
} catch (error) {
  errors.push(`Release manifest is invalid: ${error.message}`);
}

console.log("Release package check");
console.log(JSON.stringify({
  packageRoot,
  files: files.length,
  bytes: totalBytes,
  scriptRefs: scriptRefs.length,
  styleRefs: styleRefs.length,
  warnings: warnings.length,
  errors: errors.length
}, null, 2));
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: release package is deployable and excludes local runtime clutter.");
