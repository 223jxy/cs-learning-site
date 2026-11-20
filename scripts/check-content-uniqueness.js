#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataFiles = [
  "foundation-high-density.js", "stage1-high-density.js", "stage2-high-density.js", "stage3-high-density.js",
  "foundation-practice-labs.js",
  "course-labs.js", "course-labs-stage6-9.js", "lesson-profile-builder.js", "stage4-course-config.js",
  "stage4-high-density.js", "stage5-high-density.js", "stage6-high-density.js", "stage7-high-density.js",
  "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js"
];
const context = {
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: {},
  Blob: function Blob() {},
  URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
  FileReader: function FileReader() {}
};
context.window = context;
vm.createContext(context);
for (const file of dataFiles) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });

const appFiles = [
  "app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js",
  "app-reading.js", "app-review-notes.js", "app-review-tools.js", "app-course-views.js", "app.js"
];
let appCode = appFiles.map((file) => fs.readFileSync(path.join(root, file), "utf8"))
  .join("\n")
  .replace(/\r?\ninit\(\);\s*$/, "");
appCode += "\nglobalThis.__uniquenessCheck={getAllLessons,getAllExtensionCourses};";
vm.runInContext(appCode, context, { filename: "app.js" });

const lessons = [...context.__uniquenessCheck.getAllLessons(), ...context.__uniquenessCheck.getAllExtensionCourses()];
const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
const exactStrings = new Map();
const sentenceStrings = new Map();

function record(map, text, lesson, fieldPath) {
  const current = map.get(text) || new Map();
  const paths = current.get(lesson.id) || [];
  paths.push(fieldPath);
  current.set(lesson.id, paths);
  map.set(text, current);
}

function walk(value, lesson, key = "", fieldPath = "") {
  if (typeof value === "string") {
    const text = normalize(value);
    const inReferences = fieldPath.startsWith("references");
    const inQuiz = fieldPath.startsWith("quiz");
    if (text.length >= 90 && !inReferences && !inQuiz) record(exactStrings, text, lesson, fieldPath || key);
    if (text.length >= 28 && text.length <= 180 && !inReferences && !inQuiz && !["title", "summary", "why", "systemPosition"].includes(key)) {
      text.split(/[.!?;\n。！？；]/).map(normalize).filter((item) => item.length >= 28).forEach((sentence) => {
        record(sentenceStrings, sentence, lesson, fieldPath || key);
      });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, lesson, key, `${fieldPath}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) => {
      walk(childValue, lesson, childKey, fieldPath ? `${fieldPath}.${childKey}` : childKey);
    });
  }
}

lessons.forEach((lesson) => walk(lesson, lesson));

const exactCrossLesson = [...exactStrings.entries()]
  .filter(([, occurrences]) => occurrences.size >= 2)
  .map(([text, occurrences]) => ({ text, lessonCount: occurrences.size, occurrences: [...occurrences.entries()] }));

const sharedSentences = [...sentenceStrings.entries()]
  .filter(([, occurrences]) => occurrences.size >= 3)
  .map(([text, occurrences]) => ({ text, lessonCount: occurrences.size, occurrences: [...occurrences.entries()] }));

const allowedShared = sharedSentences.filter((item) => item.occurrences.every(([, paths]) => paths.some((fieldPath) => fieldPath.startsWith("prerequisites") || fieldPath.startsWith("lab.code") || fieldPath.startsWith("lab.command"))));
const candidates = sharedSentences.filter((item) => !allowedShared.includes(item));
const errors = [];
if (exactCrossLesson.length) errors.push(`发现 ${exactCrossLesson.length} 个跨课程长段落重复`);
if (candidates.length) errors.push(`发现 ${candidates.length} 个疑似低专属度共享句`);

console.log("Content uniqueness check");
console.log(JSON.stringify({
  lessons: lessons.length,
  exactCrossLesson: exactCrossLesson.length,
  sharedSentenceCandidates: candidates.length,
  allowedSharedSentences: allowedShared.length,
  topCandidates: candidates.slice(0, 10).map((item) => ({ count: item.lessonCount, text: item.text, occurrences: item.occurrences.slice(0, 4) }))
}, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 未发现跨课程长段落重复或低专属度共享句。");

