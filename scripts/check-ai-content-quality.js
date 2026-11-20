#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { console };
context.window = context;
vm.createContext(context);

const files = [
  "ai-zone-data.js", "ai-zone-az2-data.js", "ai-zone-az3-data.js",
  "ai-zone-az4-data.js", "ai-zone-az5-data.js", "ai-zone-az6-data.js",
  "ai-foundation-data.js", "ai-foundation-depth-data.js"
];
for (const file of files) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

const foundation = context.aiFoundationData;
const aiData = context.aiZoneData;
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
const normalized = (value) => String(value || "").trim().replace(/\s+/g, " ");
const questionSkeleton = (value) => normalized(value)
  .replace(/“[^”]*”/g, "“#”")
  .replace(/`[^`]*`/g, "`#`")
  .replace(/\b\d+(?:\.\d+)?\b/g, "#");
const maxFrequency = (values) => {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return Math.max(0, ...counts.values());
};

const coreTerms = foundation.terms.filter((term) => term.depthLevel === "core");
expect(coreTerms.length === 30, `核心术语应为 30 条，实际 ${coreTerms.length}`);
expect(new Set(coreTerms.map((term) => normalized(term.technicalDefinition))).size === coreTerms.length, "核心术语技术定义存在重复");
expect(new Set(coreTerms.map((term) => normalized(term.example))).size === coreTerms.length, "核心术语最小实例存在重复");
expect(new Set(coreTerms.map((term) => normalized(term.analogy))).size === coreTerms.length, "核心术语类比存在重复");
expect(new Set(coreTerms.map((term) => normalized(term.misconception))).size === coreTerms.length, "核心术语误区存在重复");

for (const term of coreTerms) {
  expect(term.depthVersion === 2, `${term.nameZh}: 缺少二次改造版本`);
  expect(normalized(term.technicalDefinition) !== normalized(term.quickDefinition), `${term.nameZh}: 技术定义仍等于一句话定义`);
  expect(term.technicalDefinition.length >= 45, `${term.nameZh}: 技术定义过短`);
  expect(term.plainExplanation.length >= 35, `${term.nameZh}: 大白话解释过短`);
  expect(term.example.length >= 25, `${term.nameZh}: 最小实例过短`);
  expect(term.confusion?.length >= 2, `${term.nameZh}: 易混淆对比不足`);
  expect(term.limitations?.length >= 2, `${term.nameZh}: 边界不足`);
  expect(term.sourceIds?.length >= 2, `${term.nameZh}: 核心术语来源不足两条`);
  expect(!/完整 AI 链路中的一个有明确职责的零件/.test(term.analogy), `${term.nameZh}: 仍使用通用零件类比`);
}

const guides = foundation.guides;
expect(guides.length === 24, `教程应为 24 篇，实际 ${guides.length}`);
expect(guides.every((guide) => guide.depthVersion === 2), "存在未完成二次改造的教程");
expect(new Set(guides.map((guide) => normalized(guide.errorExample))).size === guides.length, "教程错误示例没有全部专属");
expect(new Set(guides.map((guide) => normalized(guide.misconception))).size === guides.length, "教程误区没有全部专属");
expect(new Set(guides.flatMap((guide) => guide.quiz.map((item) => normalized(item.question)))).size === 72, "72 道教程检查题存在重复");
const guideQuestionSkeletons = guides.flatMap((guide) => guide.quiz.map((item) => questionSkeleton(item.question)));
expect(maxFrequency(guideQuestionSkeletons) <= 2, `教程题去除专有名词后句式复用过多，最高 ${maxFrequency(guideQuestionSkeletons)} 次`);
expect(new Set(guides.map((guide) => guide.quizStyleId)).size === 12, "24 篇教程应使用 12 套专属任务句式");

for (const guide of guides) {
  expect(guide.steps?.length === 4, `${guide.id}: 图解步骤不是 4 步`);
  expect(guide.quiz?.length === 3, `${guide.id}: 检查题不是 3 道`);
  expect(guide.exerciseRules?.requiredAny?.length >= 3, `${guide.id}: 缺少专属练习验收词`);
  expect(guide.exerciseRules?.requiredCount >= 2, `${guide.id}: 专属验收要求不足`);
  expect(!guide.quiz.some((item) => /首先希望你建立什么能力|怎样记录最有助于复查/.test(item.question)), `${guide.id}: 仍使用旧通用题`);
  expect(guide.quiz.every((item) => item.options?.length === 4 && Number.isInteger(item.answer)), `${guide.id}: 题目选项或答案无效`);
  const guideAnchors = [guide.practice, guide.errorExample, guide.misconception].filter(Boolean);
  expect(guide.quiz.filter((item) => guideAnchors.some((anchor) => item.question.includes(anchor))).length >= 2, `${guide.id}: 题干没有充分绑定本篇练习或错误案例`);
}

const rewrittenLessons = aiData.lessons.filter((lesson) => lesson.quizDepthVersion === 2);
expect(rewrittenLessons.length >= 20, `关联正式课程改造不足，实际 ${rewrittenLessons.length}`);
const lessonQuestionSkeletons = rewrittenLessons.flatMap((lesson) => lesson.quiz.map((item) => questionSkeleton(item.question)));
expect(maxFrequency(lessonQuestionSkeletons) <= 2, `正式课程题去除专有名词后句式复用过多，最高 ${maxFrequency(lessonQuestionSkeletons)} 次`);
expect(new Set(rewrittenLessons.map((lesson) => lesson.quizStyleId)).size === 13, "关联正式课程应使用 13 套诊断与迁移句式");
for (const lesson of rewrittenLessons) {
  expect(lesson.quiz?.length === 6, `${lesson.id}: 专属题库不是 6 道`);
  expect(new Set(lesson.quiz.map((item) => normalized(item.question))).size === 6, `${lesson.id}: 课内题干重复`);
  const lessonAnchors = [
    lesson.title,
    lesson.workedExamples?.[0]?.title,
    lesson.misconceptions?.[0],
    lesson.limits?.[0],
    ...lesson.concepts.map(([name]) => name)
  ].filter(Boolean);
  expect(lesson.quiz.filter((item) => lessonAnchors.some((anchor) => item.question.includes(anchor))).length >= 5, `${lesson.id}: 题干绑定本课概念、案例、误区或边界不足 5 道`);
  expect(!lesson.quiz.some((item) => /本课首先要建立哪项能力|结果异常时应优先检查什么|哪项做法更符合可靠实验流程/.test(item.question)), `${lesson.id}: 仍使用旧通用题`);
}

const allRewrittenQuizItems = guides.flatMap((guide) => guide.quiz).concat(rewrittenLessons.flatMap((lesson) => lesson.quiz));
const answerCounts = [0, 1, 2, 3].map((answer) => allRewrittenQuizItems.filter((item) => item.answer === answer).length);
expect(answerCounts.every((count) => count > 0), "改造题库正确答案位置没有覆盖四个选项");
expect(Math.max(...answerCounts) / allRewrittenQuizItems.length < 0.35, "改造题库正确答案位置分布过于集中");

const indexHTML = fs.readFileSync(path.join(root, "index.html"), "utf8");
expect(indexHTML.indexOf("ai-foundation-depth-data.js") > indexHTML.indexOf("ai-foundation-data.js"), "二次改造数据加载顺序错误");
expect(indexHTML.indexOf("ai-foundation-depth-data.js") < indexHTML.indexOf("app.js"), "二次改造数据必须先于 app.js");

console.log("AI content quality check");
console.log(JSON.stringify({
  coreTerms: coreTerms.length,
  rewrittenGuides: guides.filter((guide) => guide.depthVersion === 2).length,
  uniqueGuideErrors: new Set(guides.map((guide) => guide.errorExample)).size,
  uniqueGuideQuestions: new Set(guides.flatMap((guide) => guide.quiz.map((item) => item.question))).size,
  guideQuestionSkeletonMaxReuse: maxFrequency(guideQuestionSkeletons),
  rewrittenLessonQuizzes: rewrittenLessons.length,
  lessonQuestionSkeletonMaxReuse: maxFrequency(lessonQuestionSkeletons),
  answerCounts
}, null, 2));

for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: AI 核心术语、24 篇教程和关联课程专属题库质量门禁通过。");
