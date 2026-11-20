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
  "stage8-high-density.js", "stage9-high-density.js", "stage4-9-sample-deep-dives.js", "stage4-8-course-references.js", "ai-zone-data.js", "ai-zone-az2-data.js", "ai-zone-az3-data.js", "ai-zone-az4-data.js", "ai-zone-az5-data.js", "ai-zone-az6-data.js", "ai-foundation-data.js", "ai-foundation-depth-data.js"
];
for (const file of dataFiles) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });

let appCode = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n").replace(/\r?\ninit\(\);\s*$/, "");
appCode += `globalThis.__aiCheck={normalizeStateJSON:(value)=>normalizeState(JSON.parse(value)),getAIData,getAILesson,getAILab,getAIProgress,getAllLessons,getAllExtensionCourses,getPortfolioProjects,getNoteResults,getMissedAIQuizItems,getUnifiedResourceIndex,normalizeResourceURL,getRelatedAITerms,getGlossaryRelatedAILessons,getPaperRelatedAILessons,getRelatedAIPapers,renderAILessonConnections,aiPaperLessonMap,glossary,setState:(value)=>{state=normalizeState(JSON.parse(value))}};`;
vm.runInContext(appCode, context, { filename: "app.js" });

const api = context.__aiCheck;
const data = api.getAIData();
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

expect(data.modules.length === 12, `AI 模块应为 12，实际 ${data.modules.length}`);
expect(data.lessons.length === 84, `开放课程应为 84，实际 ${data.lessons.length}`);
expect(data.labs.length === 12, `可运行实验应为 12，实际 ${data.labs.length}`);
expect(data.papers.length === 6, `论文导读应为 6，实际 ${data.papers.length}`);
expect(data.lessons.filter((lesson) => lesson.moduleId === "AI-00").length === 7, "AI-00 应开放 7 节课程");
expect(data.lessons.filter((lesson) => lesson.moduleId === "AI-01").length === 7, "AI-01 应开放 7 节课程");
for (const moduleId of ["AI-02", "AI-03", "AI-04", "AI-05", "AI-06", "AI-07", "AI-08", "AI-09", "AI-10", "AI-11"]) expect(data.lessons.filter((lesson) => lesson.moduleId === moduleId).length === 7, `${moduleId} 应开放 7 节课程`);
expect(new Set([...data.modules, ...data.lessons, ...data.labs].map((item) => item.id)).size === 108, "AI 模块、课程或实验 ID 存在重复");
expect(new Set(data.papers.map((paper) => paper.id)).size === data.papers.length, "论文 ID 存在重复");
expect(new Set(data.references.map((reference) => reference.id)).size === data.references.length, "AI 引用 ID 存在重复");
const ai01Lessons = data.lessons.filter((lesson) => lesson.moduleId === "AI-01");
expect(ai01Lessons.map((lesson) => lesson.number).join(",") === ["AI-01-01", "AI-01-02", "AI-01-03", "AI-01-04", "AI-01-05", "AI-01-06", "AI-01-07"].join(","), "AI-01 课程编号或数组顺序不连续");
expect(data.lessons.every((lesson, index) => lesson.order === index), "AI 课程 order 与数组顺序不一致");

for (const lesson of data.lessons) {
  expect(lesson.quiz?.length === 6, `${lesson.id}: 检查题不是 6 道`);
  expect(lesson.references?.length >= 2, `${lesson.id}: 引用少于 2 条`);
  expect(lesson.references?.every((item) => item.title && item.provider && item.url?.startsWith("https://")), `${lesson.id}: 引用字段不完整或不是 HTTPS`);
  expect(lesson.objectives?.length >= 3 && lesson.concepts?.length >= 4 && lesson.deepDive?.length >= 3, `${lesson.id}: 正文核心字段不足`);
  expect(lesson.practice?.length >= 2 && lesson.checkpoint?.length >= 3 && lesson.limits?.length >= 2, `${lesson.id}: 练习、验收或边界不足`);
}

const ruleResult = api.getAILab("ai-lab-rules-vs-learning").run();
expect(Array.isArray(ruleResult) && ruleResult.length === 4 && ruleResult.every((row) => typeof row.score === "number"), "规则/统计实验没有返回四条可比较结果");
const gradientResult = api.getAILab("ai-lab-gradient-step").run();
expect(gradientResult.improved && gradientResult.loss === 16 && Math.abs(gradientResult.newLoss - 0.64) < 1e-9, "梯度实验默认一步更新结果错误");
const leakageResult = api.getAILab("ai-lab-data-leakage").run();
expect(leakageResult.leakedAccuracy === 1 && leakageResult.cleanAccuracy < leakageResult.leakedAccuracy, "数据泄漏实验没有产生虚高分数与修复对照");
const baselineResult = api.getAILab("ai-lab-model-baselines").run();
expect(baselineResult.details.length === 6 && Object.keys(baselineResult.scores).length === 3 && /^x[12] (>=|<) /.test(baselineResult.stumpRule), "模型基线实验没有比较三个模型、六条测试样本或真实树桩规则");
const thresholdResult = api.getAILab("ai-lab-threshold-tradeoff").run();
expect(thresholdResult.length === 3 && thresholdResult[0].recall >= thresholdResult[2].recall && thresholdResult[0].predictedPositive >= thresholdResult[2].predictedPositive, "阈值实验的 Recall 或预测正类趋势错误");
const trainingResult = api.getAILab("ai-lab-training-loop").run();
expect(trainingResult.history.length > 2 && trainingResult.earlyStopped && trainingResult.best.loss < trainingResult.history[0].valLoss && Math.abs(trainingResult.restored.w - trainingResult.best.w) < 1e-12, "训练循环没有触发早停、改善验证损失或恢复最佳 checkpoint");
const visionResult = api.getAILab("ai-lab-vision-errors").run();
expect(visionResult.rows.length === 12 && visionResult.errors.length === 4 && visionResult.slices.some((slice) => slice.accuracy < 1), "视觉错误图库缺少样本、错误或失败切片");
const textResult = api.getAILab("ai-lab-text-baseline").run();
expect(textResult.vocab.length > 5 && textResult.details.length === 4 && textResult.details.some((row) => row.unknown.length && !row.correct), "TF-IDF 实验缺少词表、测试样本或未登录词误分类证据");
const attentionResult = api.getAILab("ai-lab-attention-matrix").run();
expect(attentionResult.weights.length === 3 && attentionResult.weights.every((row) => row.length === 3), "Attention 实验权重不是 3×3");
expect(attentionResult.rowSums.every((sum) => Math.abs(sum - 1) < 1e-9), "Attention 实验 softmax 每行权重和不为 1");
expect(attentionResult.output.length === 3 && attentionResult.output.every((row) => row.length === 2), "Attention 实验输出不是 3×2");
const ragLab = api.getAILab("ai-lab-local-rag");
const ragKnown = ragLab.run({ query: "RAG 如何保证答案有引用？", topK: 3 });
const ragUnknown = ragLab.run({ query: "月球背面的火山岩年龄是多少？", topK: 3 });
expect(ragKnown.status === "answered" && ragKnown.citations.length > 0, "本地 RAG 已知问题没有返回引用");
expect(ragUnknown.status === "insufficient" && ragUnknown.citations.length === 0, "本地 RAG 无关问题没有返回证据不足");
const releaseResult = api.getAILab("ai-lab-model-release-smoke").run({ version: "model-v12", minAccuracy: 0.8, maxLatency: 120 });
expect(releaseResult.releasable && releaseResult.checks.length === 5 && releaseResult.checks.every((check) => check.passed), "模型发布 smoke test 默认门槛未全部通过");
expect(releaseResult.manifest.version === "model-v12" && releaseResult.manifest.artifactHash.length === 8, "模型发布 manifest 缺少稳定版本或哈希");
expect(releaseResult.rows.length === 5 && releaseResult.rows.every((row) => row.response.modelVersion === "model-v12"), "模型接口响应没有返回候选版本");
const blockedRelease = api.getAILab("ai-lab-model-release-smoke").run({ version: "latest", minAccuracy: 1, maxLatency: 80 });
expect(!blockedRelease.releasable && blockedRelease.checks.some((check) => !check.passed), "不合法版本或过严延迟门槛没有阻止发布");
const threatResult = api.getAILab("ai-lab-llm-threat-model").run({ inputSources: "用户输入、检索文档", tools: "搜索、保存草稿", maxSteps: 6 });
expect(threatResult.risks.length === 6 && threatResult.complete, "威胁建模实验没有生成六项完整风险");
expect(threatResult.approvalRequired && threatResult.risks.every((risk) => risk.control && risk.evidence), "威胁建模没有识别写操作人工确认或缺少控制证据");

expect(Array.isArray(data.anatomyModes) && data.anatomyModes.length === 4, "模型解剖应提供 4 种模式");
for (const mode of data.anatomyModes || []) {
  expect(mode.steps.length >= 4, `${mode.id}: 模型解剖步骤少于 4`);
  expect(mode.steps.every((step) => step.title && step.inputShape && step.outputShape && step.operation && step.evidence && step.mistake), `${mode.id}: 模型解剖步骤字段不完整`);
}
for (const paper of data.papers) {
  expect(paper.questions?.length === 5, `${paper.id}: 阅读问题不是 5 个`);
  expect(paper.contributions?.length > 0 && paper.contributions.length <= 3, `${paper.id}: 贡献数量应为 1–3`);
  expect(paper.problem && paper.prerequisites && paper.mechanism && paper.answered && paper.notAnswered && paper.citation, `${paper.id}: 导读字段不完整`);
  expect(paper.url?.startsWith("https://"), `${paper.id}: 论文 URL 不是 HTTPS`);
}
const allLessonIds = new Set(data.lessons.map((lesson) => lesson.id));
const allPaperIds = new Set(data.papers.map((paper) => paper.id));
expect(Object.keys(api.aiPaperLessonMap).length === data.papers.length, "论文到课程的显式映射数量不完整");
for (const paper of data.papers) {
  const relatedLessons = api.getPaperRelatedAILessons(paper.id);
  expect(relatedLessons.length >= 1, `${paper.id}: 没有关联课程`);
  expect((api.aiPaperLessonMap[paper.id] || []).every((lessonId) => allLessonIds.has(lessonId)), `${paper.id}: 映射了不存在的课程 ID`);
}
expect(Object.keys(api.aiPaperLessonMap).every((paperId) => allPaperIds.has(paperId)), "论文映射包含不存在的论文 ID");
expect(data.lessons.every((lesson) => api.getRelatedAITerms(lesson).length >= 1), "存在没有相关术语的 AI 课程");
expect(api.glossary.filter((term) => api.getGlossaryRelatedAILessons(term).length).length >= 30, "带 AI 课程反向链接的核心术语少于 30 个");
const relationHTML = api.renderAILessonConnections(data.lessons.find((lesson) => lesson.id === "ai-08-qkv-attention"));
expect(relationHTML.includes("data-term-result") && relationHTML.includes("data-open-ai-paper") && relationHTML.includes("data-open-ai-lesson"), "AI 课程关联区缺少术语、论文或前后课程入口");

const unifiedResources = api.getUnifiedResourceIndex();
const unifiedURLs = unifiedResources.map((resource) => api.normalizeResourceURL(resource.url));
expect(unifiedResources.length > 58, "统一资源索引没有纳入 AI 资料");
expect(new Set(unifiedURLs).size === unifiedURLs.length, "统一资源索引仍有重复 URL");
expect(data.references.every((reference) => unifiedURLs.includes(api.normalizeResourceURL(reference.url))), "存在未进入统一资源索引的 AI 资料");
expect(unifiedResources.some((resource) => resource.routeCodes.includes("AI-ZONE")), "统一资源索引缺少 AI 专区分类");
expect(unifiedResources.some((resource) => resource.ids.length > 1), "统一资源索引没有合并同 URL 的重复资料编号");

expect(Array.isArray(data.governanceStages) && data.governanceStages.length === 7, "安全治理应提供 7 个生命周期阶段");
for (const stage of data.governanceStages || []) {
  expect(stage.id && stage.label && stage.rmf && stage.objective, `${stage.id || "unknown"}: 治理阶段基础字段不完整`);
  expect(stage.assets?.length >= 4 && stage.stakeholders?.length >= 4, `${stage.id}: 资产或利益相关者不足`);
  expect(stage.failures?.length >= 3 && stage.questions?.length >= 3 && stage.evidence?.length >= 4 && stage.controls?.length >= 4, `${stage.id}: 失效、问题、证据或控制不足`);
  expect(stage.frameworks?.length >= 2, `${stage.id}: 框架映射不足`);
}
expect(Array.isArray(data.governanceRisks) && data.governanceRisks.length === 6, "LLM 治理风险应为 6 项");
expect(data.governanceRisks.every((risk) => risk.id && risk.title && risk.stage && risk.severity && risk.signal && risk.control), "LLM 治理风险字段不完整");

const legacy = api.normalizeStateJSON(JSON.stringify({ completedLessons: [api.getAllLessons()[0].id], settings: { completionMode: "auto" } }));
expect(legacy.completedLessons.length === 1, "旧主线进度迁移失败");
expect(legacy.settings.completionMode === "auto", "旧完成方式迁移失败");
expect(legacy.aiZoneProgress && legacy.aiZoneProgress.completedLessons.length === 0, "旧数据没有补齐空 AI 状态");
const paperState = api.normalizeStateJSON(JSON.stringify({
  aiZoneProgress: {
    paperProgress: {
      "paper-attention": { status: "reading", updatedAt: "2026-07-27T10:00:00.000Z" },
      "paper-rag": { status: "invalid", updatedAt: "2026-07-27T10:00:00.000Z" },
      "unknown-paper": { status: "done", updatedAt: "2026-07-27T10:00:00.000Z" }
    }
  }
}));
expect(Object.keys(paperState.aiZoneProgress.paperProgress).length === 2, "论文进度没有过滤未知 ID");
expect(paperState.aiZoneProgress.paperProgress["paper-attention"].status === "reading", "论文阅读中状态迁移失败");
expect(paperState.aiZoneProgress.paperProgress["paper-rag"].status === "unread", "非法论文状态没有归一为未开始");

const sample = data.lessons[0];
const sampleAnswers = sample.quiz.map((question) => question.answer);
sampleAnswers[0] = (sampleAnswers[0] + 1) % 4;
api.setState(JSON.stringify({
  aiZoneProgress: {
    completedLessons: [sample.id, "bad-ai-id"],
    lessonNotes: { [sample.id]: { content: "AI 证据链笔记", tags: ["证据"], updatedAt: "2026-07-27T08:00:00.000Z" } },
    quizResults: { [sample.id]: { answers: sampleAnswers, score: 5, total: 6, checkedAt: "2026-07-27T08:30:00.000Z" } },
    labResults: { "ai-lab-gradient-step": { ranAt: "2026-07-27T09:00:00.000Z", passed: true, summary: "loss 下降" } },
    lastLessonId: sample.id
  }
}));
expect(api.getAIProgress().completedLessons.length === 1, "AI 完成状态没有过滤未知 ID");
expect(api.getNoteResults("证据链").some((item) => item.kind === "ai-zone"), "AI 笔记没有进入统一搜索");
expect(api.getMissedAIQuizItems().length === 1, "AI 错题没有进入统一错题数据源");

expect(api.getAllLessons().length === 152, `主线课程数量被改变：${api.getAllLessons().length}`);
expect(api.getAllExtensionCourses().length === 120, `方向课程数量被改变：${api.getAllExtensionCourses().length}`);
expect(api.getPortfolioProjects().length === 18, `作品集数量被改变：${api.getPortfolioProjects().length}`);

const indexHTML = fs.readFileSync(path.join(root, "index.html"), "utf8");
expect(indexHTML.includes('data-view="ai"') && indexHTML.includes('data-view-panel="ai"'), "AI 导航或主视图缺失");
expect(indexHTML.indexOf("ai-zone-data.js") < indexHTML.indexOf("app.js"), "AI 数据文件必须先于 app.js 加载");
expect(indexHTML.indexOf("ai-zone-data.js") < indexHTML.indexOf("ai-zone-az2-data.js") && indexHTML.indexOf("ai-zone-az2-data.js") < indexHTML.indexOf("app.js"), "AZ-2 数据文件加载顺序错误");
expect(indexHTML.indexOf("ai-zone-az2-data.js") < indexHTML.indexOf("ai-zone-az3-data.js") && indexHTML.indexOf("ai-zone-az3-data.js") < indexHTML.indexOf("app.js"), "AZ-3 数据文件加载顺序错误");
expect(indexHTML.indexOf("ai-zone-az3-data.js") < indexHTML.indexOf("ai-zone-az4-data.js") && indexHTML.indexOf("ai-zone-az4-data.js") < indexHTML.indexOf("app.js"), "AZ-4 数据文件加载顺序错误");
expect(indexHTML.indexOf("ai-zone-az4-data.js") < indexHTML.indexOf("ai-zone-az5-data.js") && indexHTML.indexOf("ai-zone-az5-data.js") < indexHTML.indexOf("app.js"), "AZ-5 数据文件加载顺序错误");
expect(indexHTML.indexOf("ai-zone-az5-data.js") < indexHTML.indexOf("ai-zone-az6-data.js") && indexHTML.indexOf("ai-zone-az6-data.js") < indexHTML.indexOf("app.js"), "AZ-6 数据文件加载顺序错误");
expect(appCode.includes("data-ai-anatomy-mode") && appCode.includes("data-ai-paper-status"), "模型解剖或论文状态交互未接入");
expect(appCode.includes("data-open-ai-paper") && appCode.includes("term-related-lessons"), "论文定位或术语反向课程入口未接入");
expect(appCode.includes("data-ai-governance-stage") && appCode.includes("renderAIGovernance"), "安全治理页面或阶段交互未接入");
expect(/version:\s*15/.test(appCode), "学习数据导出版本不是 15");
for (const phrase of ["高密度课", "样板课", "待细化", "不计入主线", "独立进度"]) {
  expect(!indexHTML.includes(phrase), `用户界面出现内部术语：${phrase}`);
}

console.log("AI zone check");
console.log(JSON.stringify({ modules: data.modules.length, lessons: data.lessons.length, labs: data.labs.length, papers: data.papers.length, anatomyModes: data.anatomyModes.length, governanceStages: data.governanceStages.length, governanceRisks: data.governanceRisks.length, resources: unifiedResources.length, linkedGlossaryTerms: api.glossary.filter((term) => api.getGlossaryRelatedAILessons(term).length).length, mainline: api.getAllLessons().length, directions: api.getAllExtensionCourses().length, projects: api.getPortfolioProjects().length }, null, 2));
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: AI 专区数据、实验、状态兼容和原有规模检查通过。");

