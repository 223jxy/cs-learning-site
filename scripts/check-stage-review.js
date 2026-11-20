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
  "ai-foundation-data.js",
  "ai-foundation-depth-data.js",
  "ai-zone-data.js",
  "ai-zone-az2-data.js",
  "ai-zone-az3-data.js",
  "ai-zone-az4-data.js",
  "ai-zone-az5-data.js",
  "ai-zone-az6-data.js",
  "foundation-high-density.js",
  "stage1-high-density.js",
  "stage2-high-density.js",
  "stage3-high-density.js",
  "foundation-practice-labs.js",
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

for (const file of dataFiles) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

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
  "app-review-tools.js",
  "app-stage-review.js",
  "app-course-views.js",
  "app.js"
];

let appCode = appFiles.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += `globalThis.__stageReviewCheck={
  stages,
  getAllLessons,
  normalizeStateForCheck:(value)=>normalizeState(JSON.parse(value)),
  setStateForCheck:(value)=>{state=normalizeState(JSON.parse(value))},
  getStageReviewItems,
  buildStageReviewMarkdown,
  setStageReviewIdForCheck:(value)=>{activeStageReviewId=value},
  getStageReviewStage,
  renderStudyReview
};`;
vm.runInContext(appCode, context, { filename: "stage-review-combined.js" });

const api = context.__stageReviewCheck;
const errors = [];
const stage0 = api.stages.find((stage) => stage.id === 0);
const stage0Lessons = api.getAllLessons().filter((lesson) => lesson.stageId === 0);
const labLesson = stage0Lessons.find((lesson) => lesson.lab);
const noteLesson = stage0Lessons[1];
const practice = labLesson ? context.getLessonPractices(labLesson)[0] : null;
if (!stage0 || !labLesson || !noteLesson) errors.push("阶段 0 样本课程或实验课程缺失");

api.setStateForCheck(JSON.stringify({
  completedLessons: [labLesson.id],
  quizResults: {
    [labLesson.id]: { answers: [0, 0, 0], score: 0, total: 3, checkedAt: "2026-08-04T01:00:00.000Z" }
  },
  lessonNotes: {
    [noteLesson.id]: { content: "阶段复盘样本笔记", tags: ["复盘"], updatedAt: "2026-08-04T02:00:00.000Z" }
  },
  practiceEvidence: {
    [labLesson.id]: {
      status: "blocked",
      command: "powershell token=SECRET_VALUE",
      summary: "执行失败，password=123456",
      updatedAt: "2026-08-04T03:00:00.000Z"
    }
  },
  practiceRecords: practice ? {
    [practice.id]: {
      status: "done",
      command: "powershell -File check.ps1",
      output: "PASS exit code 0",
      note: "复测通过并保留边界结果",
      checkedAt: "2026-08-04T05:00:00.000Z",
      assessment: { result: "passed", score: 86, reasons: ["发现通过信号"], checkedAt: "2026-08-04T05:00:00.000Z", version: 1 }
    }
  } : {},
  practiceAttempts: practice ? [
    { practiceId: practice.id, status: "in-progress", assessment: { result: "review", score: 52, reasons: ["证据不足"], checkedAt: "2026-08-03T05:00:00.000Z", version: 1 }, checkedAt: "2026-08-03T05:00:00.000Z" },
    { practiceId: practice.id, status: "done", assessment: { result: "passed", score: 86, reasons: ["发现通过信号"], checkedAt: "2026-08-04T05:00:00.000Z", version: 1 }, checkedAt: "2026-08-04T05:00:00.000Z" }
  ] : [],
  readingPositions: {
    [`main:${noteLesson.id}`]: {
      sectionTitle: "练习",
      sectionIndex: 1,
      sectionOffset: 120,
      ratio: 0.4,
      percent: 40,
      updatedAt: "2026-08-04T04:00:00.000Z"
    }
  }
}));

api.setStageReviewIdForCheck(0);
const review = api.getStageReviewItems(stage0);
if (review.lessons.length !== stage0.lessons.length) errors.push("阶段复盘课程数量不等于阶段课程数量");
if (review.completedLessons.length !== 1 || review.incompleteLessons.length !== stage0.lessons.length - 1) errors.push("阶段复盘完成/未完成统计错误");
if (review.quizzes.length !== 1 || review.pendingMistakes.length < 1) errors.push("阶段复盘未汇总知识检查或未复习错题");
if (review.notes.length !== 1 || review.evidence.length !== 1 || review.reading.length !== 1) errors.push("阶段复盘未汇总笔记、实验记录或阅读断点");
if (review.practiceRecords.length !== 1 || review.abilityTrend.points.length !== 2 || review.abilityTrend.direction !== "上升") errors.push("阶段复盘未汇总逐练习记录或能力趋势");
if (!review.blockedEvidence.length || !review.nextActions.some((item) => item.type === "重跑实验")) errors.push("阶段复盘未把阻塞实验转成下一步动作");

const markdown = api.buildStageReviewMarkdown(stage0);
for (const token of ["阶段 0 复盘", "课程完成：1", "## 下一步", "## 实验记录", "## 阶段能力趋势", "## 错题复习", "## 笔记目录", "[已脱敏]"]) {
  if (!markdown.includes(token)) errors.push(`阶段复盘 Markdown 缺少 ${token}`);
}
if (markdown.includes("SECRET_VALUE") || markdown.includes("123456")) errors.push("阶段复盘导出未脱敏敏感实验记录");

const indexText = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const token of ["stage-review-filter", "stage-review-panel", "export-stage-review", 'src="app-stage-review.js"']) {
  if (!indexText.includes(token)) errors.push(`页面缺少阶段复盘入口：${token}`);
}
if (indexText.indexOf('src="app-review-tools.js"') > indexText.indexOf('src="app-stage-review.js"')) {
  errors.push("阶段复盘脚本必须在复习辅助层之后加载");
}
if (!appCode.includes("renderStageReview") || !appCode.includes("downloadStageReviewMarkdown") || !appCode.includes("setStageReviewId")) {
  errors.push("阶段复盘核心函数未进入应用代码");
}
if (!appCode.includes("renderStudyReview()") || !appCode.includes("typeof renderStageReview")) {
  errors.push("阶段复盘未接入复习页刷新链路");
}

console.log("Stage review check");
console.log(JSON.stringify({
  stage: stage0.id,
  lessons: review.lessons.length,
  completed: review.completedLessons.length,
  notes: review.notes.length,
  evidence: review.evidence.length,
  pendingMistakes: review.pendingMistakes.length,
  nextActions: review.nextActions.length
}, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: 阶段复盘聚合、能力趋势、下一步建议、Markdown 导出和页面入口检查通过。");
