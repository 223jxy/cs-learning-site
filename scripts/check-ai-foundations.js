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
  "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js",
  "ai-zone-data.js", "ai-zone-az2-data.js", "ai-zone-az3-data.js", "ai-zone-az4-data.js",
  "ai-zone-az5-data.js", "ai-zone-az6-data.js", "ai-foundation-data.js", "ai-foundation-depth-data.js"
];
for (const file of dataFiles) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += `
globalThis.__foundationCheck={
  getAIFoundationData,getAIData,getAITerm,getAIGuide,getAITermSearchText,highlightSearchTerm,getNoteResults,getReadingPositionKey,
  normalizeStateJSON:(value)=>normalizeState(JSON.parse(value)),
  getAIProgress,setState:(value)=>{state=normalizeState(JSON.parse(value))}
};`;
vm.runInContext(appCode, context, { filename: "app.js" });

const api = context.__foundationCheck;
const foundation = api.getAIFoundationData();
const aiData = api.getAIData();
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

expect(foundation.categories.length === 12, `术语分类应为 12，实际 ${foundation.categories.length}`);
expect(foundation.paths.length === 8, `入门路径应为 8，实际 ${foundation.paths.length}`);
expect(foundation.terms.length === 320, `AI 术语应为 320，实际 ${foundation.terms.length}`);
expect(foundation.guides.length === 24, `入门教程应为 24，实际 ${foundation.guides.length}`);

const expectedCategoryCounts = [20, 34, 28, 34, 26, 30, 20, 40, 28, 22, 20, 18];
foundation.categories.forEach((category, index) => {
  const count = foundation.terms.filter((term) => term.categoryId === category.id).length;
  expect(count === expectedCategoryCounts[index], `${category.title} 数量应为 ${expectedCategoryCounts[index]}，实际 ${count}`);
});

expect(new Set(foundation.terms.map((term) => term.id)).size === foundation.terms.length, "AI 术语 ID 存在重复");
expect(new Set(foundation.terms.map((term) => term.nameZh.toLowerCase())).size === foundation.terms.length, "AI 术语中文名称存在重复");
expect(new Set(foundation.guides.map((guide) => guide.id)).size === foundation.guides.length, "AI 入门教程 ID 存在重复");
expect(new Set(foundation.sources.map((source) => source.id)).size === foundation.sources.length, "AI 基础来源 ID 存在重复");

const termIds = new Set(foundation.terms.map((term) => term.id));
const guideIds = new Set(foundation.guides.map((guide) => guide.id));
const sourceIds = new Set(foundation.sources.map((source) => source.id));
const lessonIds = new Set(aiData.lessons.map((lesson) => lesson.id));
const labIds = new Set(aiData.labs.map((lab) => lab.id));

for (const term of foundation.terms) {
  expect(term.nameZh && term.nameEn && term.categoryId && term.level, `${term.id}: 中英文名称、分类或难度缺失`);
  expect(term.quickDefinition && term.plainExplanation && term.technicalDefinition, `${term.id}: 双层解释或技术定义缺失`);
  expect(term.analogy && term.example && term.misconception, `${term.id}: 类比、实例或误区缺失`);
  expect(term.limitations?.length >= 1 && term.sourceIds?.length >= 1, `${term.id}: 边界或来源缺失`);
  expect(term.relatedTermIds.every((id) => termIds.has(id) && id !== term.id), `${term.id}: 相关术语 ID 无效`);
  expect(term.lessonIds.every((id) => lessonIds.has(id)), `${term.id}: 课程 ID 无效`);
  expect(term.guideIds.every((id) => guideIds.has(id)), `${term.id}: 教程 ID 无效`);
  expect(term.labIds.every((id) => labIds.has(id)), `${term.id}: 实验 ID 无效`);
  expect(term.sourceIds.every((id) => sourceIds.has(id)), `${term.id}: 来源 ID 无效`);
}

for (const guide of foundation.guides) {
  expect(guide.number && guide.title && guide.question && guide.quickView, `${guide.id}: 标题或 30 秒解释缺失`);
  expect(guide.prerequisites.length >= 2 && guide.objectives.length >= 3 && guide.steps.length >= 4, `${guide.id}: 前置、目标或步骤不足`);
  expect(guide.practice && guide.expected && guide.errorExample && guide.misconception, `${guide.id}: 练习、预期结果或错误示例缺失`);
  expect(guide.quiz?.length === 3, `${guide.id}: 即时检查不是 3 道`);
  expect(guide.termIds.length >= 4 && guide.termIds.every((id) => termIds.has(id)), `${guide.id}: 术语关联不足或无效`);
  expect(guide.nextStep.length >= 1 && guide.nextStep.every((id) => lessonIds.has(id)), `${guide.id}: 正式课程关联无效`);
  expect(guide.sourceIds.length >= 1 && guide.sourceIds.every((id) => sourceIds.has(id)), `${guide.id}: 来源关联无效`);
}

expect(aiData.lessons.every((lesson) => lesson.termIds?.length >= 4 && lesson.termIds.length <= 8), "存在没有 4–8 个显式术语的 AI 课程");
expect(aiData.lessons.every((lesson) => lesson.guideIds?.length >= 1 && lesson.guideIds.length <= 3), "存在没有 1–3 篇入门教程的 AI 课程");
expect(aiData.lessons.every((lesson) => lesson.termIds.every((id) => termIds.has(id))), "AI 课程包含无效术语 ID");
expect(aiData.lessons.every((lesson) => lesson.guideIds.every((id) => guideIds.has(id))), "AI 课程包含无效教程 ID");

const normalizedNames = new Set(foundation.terms.flatMap((term) => [term.nameZh, term.nameEn, term.abbreviation, ...term.aliases].filter(Boolean).map((value) => value.trim().toLowerCase())));
const lessonConcepts = [...new Set(aiData.lessons.flatMap((lesson) => lesson.concepts.map(([name]) => name)))];
expect(lessonConcepts.every((name) => normalizedNames.has(name.trim().toLowerCase())), "315 个课程概念没有达到 100% 名称或别名覆盖");

for (const query of ["LLM", "大语言模型", "损失函数", "loss"]) {
  expect(foundation.terms.some((term) => api.getAITermSearchText(term).includes(query.toLowerCase())), `搜索词 ${query} 没有命中 AI 词典`);
}
const highlighted = api.highlightSearchTerm("<img src=x onerror=1>loss", "<img");
expect(!highlighted.includes("<img src=") && highlighted.includes("&lt;img"), "搜索高亮没有转义 HTML");

const migrated = api.normalizeStateJSON(JSON.stringify({
  aiZoneProgress: {
    completedLessons: [aiData.lessons[0].id],
    lessonNotes: { [aiData.lessons[0].id]: { content: "旧版 AI 笔记" } }
  }
}));
expect(migrated.aiZoneProgress.completedLessons.length === 1, "版本 9 AI 课程进度迁移失败");
expect(Array.isArray(migrated.aiZoneProgress.completedGuides) && migrated.aiZoneProgress.completedGuides.length === 0, "旧数据没有补齐教程完成状态");
expect(Object.keys(migrated.aiZoneProgress.guideNotes).length === 0, "旧数据没有补齐教程笔记");
expect(Array.isArray(migrated.aiZoneProgress.favoriteTermIds) && Array.isArray(migrated.aiZoneProgress.recentTermIds), "旧数据没有补齐术语状态");

const sampleGuide = foundation.guides[0];
const sampleTerm = foundation.terms[0];
api.setState(JSON.stringify({
  aiZoneProgress: {
    completedGuides: [sampleGuide.id, "bad-guide"],
    guideNotes: { [sampleGuide.id]: { content: "AI 入门教程笔记", tags: ["入门"] } },
    favoriteTermIds: [sampleTerm.id, "bad-term"],
    recentTermIds: [sampleTerm.id, "bad-term"],
    lastGuideId: sampleGuide.id
  }
}));
expect(api.getAIProgress().completedGuides.length === 1, "教程完成状态没有过滤未知 ID");
expect(Object.keys(api.getAIProgress().guideNotes).length === 1, "教程笔记没有正确归一化");
expect(api.getAIProgress().favoriteTermIds.length === 1 && api.getAIProgress().recentTermIds.length === 1, "术语收藏或最近查看没有过滤未知 ID");
expect(api.getNoteResults("入门教程笔记").some((item) => item.kind === "ai-guide"), "入门教程笔记没有进入统一笔记搜索");
expect(api.getReadingPositionKey("ai-guide", sampleGuide.id) === `ai-guide:${sampleGuide.id}`, "AI 入门教程阅读键错误");

const indexHTML = fs.readFileSync(path.join(root, "index.html"), "utf8");
expect(indexHTML.includes('data-ai-tab="guides"') && indexHTML.includes('data-ai-tab="glossary"'), "AI 入门指南或 AI 词典标签缺失");
expect(
  indexHTML.indexOf("ai-foundation-data.js") > indexHTML.indexOf("ai-zone-az6-data.js")
    && indexHTML.indexOf("ai-foundation-depth-data.js") > indexHTML.indexOf("ai-foundation-data.js")
    && indexHTML.indexOf("ai-foundation-depth-data.js") < indexHTML.indexOf("app.js"),
  "AI 基础与深度数据文件加载顺序错误"
);
expect(/version:\s*15/.test(appCode), "学习数据导出版本不是 15");

console.log("AI foundations check");
console.log(JSON.stringify({
  categories: foundation.categories.length,
  terms: foundation.terms.length,
  paths: foundation.paths.length,
  guides: foundation.guides.length,
  coveredConcepts: lessonConcepts.length,
  linkedLessons: aiData.lessons.filter((lesson) => lesson.termIds?.length >= 4 && lesson.guideIds?.length).length
}, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: AI 基础术语、入门教程、课程映射和版本 15 状态检查通过。");

