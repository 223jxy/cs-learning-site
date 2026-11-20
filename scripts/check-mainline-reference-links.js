#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const online = process.argv.includes("--online");
const files = ["foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js", "foundation-practice-labs.js", "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js", "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js", "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js"];
const context = { console, localStorage: { getItem: () => null, setItem: () => {} }, document: {}, Blob: function Blob() {}, URL, FileReader: function FileReader() {} };
context.window = context;
vm.createContext(context);
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
  let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += "globalThis.__references=getAllLessons().flatMap((lesson)=>lesson.references.map((reference)=>({lessonId:lesson.id,...reference})));";
vm.runInContext(appCode, context, { filename: "app.js" });

const references = context.__references;
const errors = [];
for (const reference of references) {
  if (!reference.title || !reference.usage || !reference.url?.startsWith("https://")) errors.push(`${reference.lessonId}: 引用字段不完整或不是 HTTPS`);
  try { new URL(reference.url); } catch { errors.push(`${reference.lessonId}: URL 格式错误 ${reference.url}`); }
}
const unique = [...new Map(references.map((item) => [item.url, item])).values()];
console.log("Mainline reference check");
console.log(JSON.stringify({ lessons: 152, referenceEntries: references.length, uniqueUrls: unique.length }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 主线课程引用字段与 URL 格式检查通过。");

async function checkUrl(reference) {
  const request = async (method) => fetch(reference.url, { method, redirect: "follow", signal: AbortSignal.timeout(12000), headers: { "user-agent": "computer-learning-map-link-check/1.0" } });
  try {
    let response = await request("HEAD");
    if (response.status < 200 || response.status >= 400) response = await request("GET");
    return { ...reference, status: response.status, ok: response.status >= 200 && response.status < 400 };
  } catch (headError) {
    try {
      const response = await request("GET");
      return { ...reference, status: response.status, ok: response.status >= 200 && response.status < 400 };
    } catch (getError) {
      return { ...reference, status: getError.name || headError.name || "ERROR", ok: false };
    }
  }
}

async function runOnline() {
  if (!online || errors.length) return;
  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < unique.length) results.push(await checkUrl(unique[cursor++]));
  }
  await Promise.all(Array.from({ length: Math.min(5, unique.length) }, worker));
  for (const result of results) console.log(`${result.ok ? "OK" : "FAIL"} ${result.status} ${result.url}`);
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

runOnline().catch((error) => { console.error(error); process.exitCode = 1; });

