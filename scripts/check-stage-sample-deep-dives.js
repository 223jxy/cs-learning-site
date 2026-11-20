#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const dataFiles = [
  "foundation-high-density.js",
  "stage1-high-density.js",
  "stage2-high-density.js",
  "stage3-high-density.js",
  "course-labs.js",
  "course-labs-stage6-9.js",
  "lesson-profile-builder.js",
  "stage4-course-config.js",
  "stage4-high-density.js",
  "stage5-high-density.js",
  "stage6-high-density.js",
  "stage7-high-density.js",
  "stage8-high-density.js",
  "stage9-high-density.js",
  "stage4-9-sample-deep-dives.js",
  "stage4-8-course-references.js"
];

const appFiles = [
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
  "app.js"
];

const expected = {
  4: {
    "python-run": ["Python", "解释器", "退出码"],
    "files-pathlib": ["pathlib", "编码", "路径"]
  },
  5: {
    complexity: ["Big-O", "二分", "哈希", "规模"],
    "dynamic-programming": ["状态", "转移", "背包"]
  },
  6: {
    "devtools-network": ["Network", "状态码", "缓存"],
    "sql-query-join": ["JOIN", "LEFT", "INNER", "笛卡尔积"]
  },
  7: {
    "virtual-memory": ["虚拟地址", "页表", "缺页"],
    "os-concurrency": ["竞态", "锁", "死锁"]
  },
  8: {
    git: ["工作区", "暂存区", "提交"],
    deployment: ["发布包", "健康检查", "回滚"]
  },
  9: {
    "web-path": ["API", "前后端", "移动端"],
    "cloud-platform-path": ["容器", "观测", "回滚"]
  }
};

const context = {
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: {},
  Blob: function Blob() {},
  URL,
  FileReader: function FileReader() {}
};
context.window = context;
vm.createContext(context);

for (const file of dataFiles) {
  vm.runInContext(read(file), context, { filename: file });
}

let appCode = appFiles.map(read).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += "\nglobalThis.__deepDiveCheck={stages,getAllLessons,renderHighDensityLessonSections};";
vm.runInContext(appCode, context, { filename: "combined-app.js" });

const profileMap = context.stageSampleDeepDiveProfiles || {};
const profileIds = Object.keys(profileMap).sort();
const expectedIds = Object.values(expected).flatMap((stageMap) => Object.keys(stageMap)).sort();

expect(profileIds.length === 12, `抽样深写课程数量应为 12，实际为 ${profileIds.length}`);
expect(JSON.stringify(profileIds) === JSON.stringify(expectedIds), "抽样深写课程 ID 与计划清单不一致");

for (const [stageId, stageMap] of Object.entries(expected)) {
  const ids = Object.keys(stageMap);
  expect(ids.length === 2, `阶段 ${stageId} 应配置 2 节抽样深写课程`);
}

for (const [id, profile] of Object.entries(profileMap)) {
  expect(profile.sampleDeepDive === true, `${id}: sampleDeepDive 标记缺失`);
  expect(profile.sampleDeepDiveVersion === "2026-08-04", `${id}: 版本标记不一致`);
  expect(profile.deepDive?.length >= 4, `${id}: deepDive 少于 4 条`);
  expect(profile.workedExamples?.length >= 2, `${id}: workedExamples 少于 2 个`);
  expect(profile.mistakes?.length >= 4, `${id}: mistakes 少于 4 条`);
  expect(profile.practices?.length >= 3, `${id}: practices 少于 3 个`);
  expect(profile.troubleshooting?.length >= 5, `${id}: troubleshooting 少于 5 条`);
  expect(profile.takeaways?.length >= 5, `${id}: takeaways 少于 5 条`);
}

const lessons = context.__deepDiveCheck.getAllLessons();
expect(lessons.length === 152, `主线课程数量应保持 152，实际为 ${lessons.length}`);

const byId = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));
for (const [stageId, stageMap] of Object.entries(expected)) {
  for (const [id, keywords] of Object.entries(stageMap)) {
    const lesson = byId[id];
    expect(lesson, `${id}: 合并后课程缺失`);
    if (!lesson) continue;
    expect(String(lesson.stageId) === String(stageId), `${id}: 阶段应为 ${stageId}，实际为 ${lesson.stageId}`);
    expect(lesson.sampleDeepDive === true, `${id}: 合并后未读到 sampleDeepDive`);
    const mergedText = [
      lesson.title,
      lesson.summary,
      ...(lesson.deepDive || []),
      ...(lesson.workedExamples || []).flatMap((item) => [item.title, item.scenario, item.input, item.output, ...(item.steps || []), ...(item.checkpoints || [])]),
      ...(lesson.mistakes || []).flatMap((item) => [item.wrong, item.why, item.correct]),
      ...(lesson.practices || []).flatMap((item) => [item.level, item.title, item.task, item.evidence]),
      ...(lesson.troubleshooting || []),
      ...(lesson.takeaways || [])
    ].join("\n");
    for (const keyword of keywords) {
      expect(mergedText.includes(keyword), `${id}: 缺少课程专属关键词 ${keyword}`);
    }
    const html = context.__deepDiveCheck.renderHighDensityLessonSections(lesson);
    expect(html.includes("density-overview"), `${id}: 阅读正文缺少概览结构`);
    expect(!/模板感|深写|sampleDeepDive|sample-v/i.test(html), `${id}: 用户可见正文包含内部工程词`);
  }
}

console.log("Stage 4-9 sample deep dive check");
console.log(JSON.stringify({
  profileCount: profileIds.length,
  stages: Object.keys(expected).map(Number),
  mergedLessons: lessons.length,
  errors: errors.length
}, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 阶段 4-9 抽样深写课程已按阶段合并、保持数量稳定，并通过专属内容检查。");
