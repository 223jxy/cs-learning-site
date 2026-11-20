#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const legacyIds = [
  "paths", "file-naming", "copy-move-delete", "clipboard-shortcuts",
  "search-rename", "file-properties", "file-types", "archives", "downloads",
  "software-sources", "screenshots", "pdf-docs", "backup-sync", "recovery-security"
];

function loadData() {
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
  vm.runInContext(fs.readFileSync(path.join(root, "foundation-high-density.js"), "utf8"), context);
  let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
  appCode += `
    globalThis.__foundationCheck = {
      stages,
      extensionCourses,
      getAllLessons,
      getLessonSearchText,
      renderHighDensityLessonSections,
      normalizeState
    };
  `;
  vm.runInContext(appCode, context, { filename: "app.js" });
  return context;
}

async function checkReferencesOnline(stage0) {
  const references = stage0.flatMap((lesson) => lesson.references.map((reference) => ({ lessonId: lesson.id, ...reference })));
  const failures = [];
  let cursor = 0;
  async function worker() {
    while (cursor < references.length) {
      const reference = references[cursor++];
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        let response = await fetch(reference.url, { method: "HEAD", redirect: "follow", signal: controller.signal });
        if ([403, 405].includes(response.status)) {
          response = await fetch(reference.url, { method: "GET", redirect: "follow", signal: controller.signal });
        }
        if (response.status < 200 || response.status >= 400) failures.push(`${reference.lessonId}: HTTP ${response.status} ${reference.url}`);
      } catch (error) {
        failures.push(`${reference.lessonId}: ${error.name === "AbortError" ? "timeout" : error.message} ${reference.url}`);
      } finally {
        clearTimeout(timer);
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  return { checked: references.length, failures };
}

async function run() {
  const context = loadData();
  const data = context.__foundationCheck;
  const errors = [];
  const profiles = context.foundationHighDensityProfiles || {};
  const allLessons = data.getAllLessons();
  const stage0Ids = new Set(data.stages[0].lessons.map((lesson) => lesson.id));
  const stage0 = allLessons.filter((lesson) => stage0Ids.has(lesson.id));

  const expect = (condition, message) => {
    if (!condition) errors.push(message);
  };

  expect(allLessons.length === 152, `主线课程应为 152，实际 ${allLessons.length}`);
  expect(data.extensionCourses.length === 120, `专业课程应为 120，实际 ${data.extensionCourses.length}`);
  expect(stage0.length === 20, `阶段 0 应为 20 节，实际 ${stage0.length}`);
  expect(stage0.every((lesson) => lesson.density), "阶段 0 存在未启用高密度渲染的课程");
  expect(legacyIds.every((id) => profiles[id]), "14 节旧版课程的 profile 不完整");

  for (const lesson of stage0) {
    expect((lesson.objectives || []).length >= 3, `${lesson.id}: objectives 少于 3`);
    expect((lesson.knowledgePoints || []).length >= 8, `${lesson.id}: knowledgePoints 少于 8`);
    expect((lesson.workedExamples || []).length >= 1, `${lesson.id}: workedExamples 少于 1`);
    expect((lesson.mistakes || []).length >= 3, `${lesson.id}: mistakes 少于 3`);
    expect((lesson.troubleshooting || []).length >= 3, `${lesson.id}: troubleshooting 少于 3`);
    expect((lesson.practices || []).length >= 2, `${lesson.id}: practices 少于 2`);
    expect((lesson.quiz || []).length === 6, `${lesson.id}: quiz 应为 6`);
    expect((lesson.references || []).length >= 2, `${lesson.id}: references 少于 2`);
    for (const reference of lesson.references || []) {
      try {
        expect(new URL(reference.url).protocol === "https:", `${lesson.id}: 引用不是 HTTPS`);
      } catch {
        errors.push(`${lesson.id}: 引用 URL 无效`);
      }
    }
  }

  const backup = allLessons.find((lesson) => lesson.id === "backup-sync");
  expect(data.getLessonSearchText(backup).includes("rpo"), "搜索文本未包含外置 profile 的知识点");
  const rendered = data.renderHighDensityLessonSections(backup);
  expect(rendered.includes("density-overview"), "高密度正文未输出专属结构");
  expect(!rendered.includes("<h2>关键概念</h2>"), "高密度正文重复输出旧版关键概念区");

  vm.runInContext(`globalThis.__normalized = normalizeState({
    quizResults: { paths: { answers: [0, 1, 2, 3, 0, 1], score: 4, total: 6 } }
  });`, context);
  expect(context.__normalized.quizResults.paths?.answers.length === 6, "导入状态截断了高密度课程的 6 道答案");

  console.log("Foundation density check");
  console.log(JSON.stringify({
    mainLessons: allLessons.length,
    stage0Lessons: stage0.length,
    denseStage0Lessons: stage0.filter((lesson) => lesson.density).length,
    externalProfiles: Object.keys(profiles).length,
    extensionCourses: data.extensionCourses.length
  }, null, 2));

  for (const error of errors) console.error(`FAIL ${error}`);
  if (errors.length) process.exitCode = 1;
  else console.log("PASS: 阶段 0 高密度结构、搜索、渲染和状态兼容检查通过。");

  if (process.argv.includes("--online")) {
    const online = await checkReferencesOnline(stage0);
    console.log(`ONLINE: 已检查 ${online.checked} 条阶段 0 引用。`);
    for (const failure of online.failures) console.error(`FAIL ${failure}`);
    if (online.failures.length) process.exitCode = 1;
    else console.log("PASS: 阶段 0 引用链接均可访问。");
  } else {
    console.log("ONLINE SKIPPED: 使用 --online 检查阶段 0 引用可达性。");
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

