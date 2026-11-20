"use strict";

(function registerLessonProfileBuilder(global) {
  const configs = global.lessonProfileStageConfigs = global.lessonProfileStageConfigs || {};

  global.registerLessonProfileStage = function registerLessonProfileStage(stageId, config) {
    configs[stageId] = config;
  };

  const clean = (text) => String(text || "").replace(/[。；;]+$/, "");
  const asSentence = (text) => `${clean(text)}。`;
  const conceptTerm = (concept, index) => {
    const source = clean(concept);
    const candidate = source.split(/[，,:：]/)[0].split(/(?:是|用于|可以|负责|通过|根据|由|按|为)/)[0].trim();
    return candidate && candidate.length <= 18 ? candidate : `${source.slice(0, 16)}${source.length > 16 ? "…" : ""}` || `核心概念 ${index + 1}`;
  };

  function makeKnowledgePoints(lesson, config) {
    const concepts = (lesson.concepts || []).slice(0, 4).map((concept, index) => ({
      term: conceptTerm(concept, index),
      detail: asSentence(concept),
      misconception: `只背诵“${clean(concept).slice(0, 18)}”而不验证它在输入、处理和输出中的作用。`
    }));
    const lenses = (config.lenses || []).map(([term, detail, misconception]) => ({
      term,
      detail: `${lesson.title}中，${asSentence(detail)}`,
      misconception
    }));
    return [...concepts, ...lenses].slice(0, 8);
  }

  function makeQuiz(lesson, points) {
    const central = clean(lesson.summary);
    const first = clean(lesson.concepts?.[0] || lesson.summary);
    const second = clean(lesson.concepts?.[1] || lesson.why);
    return [
      { prompt: `“${lesson.title}”主要解决什么问题？`, options: [central, "只改变界面颜色", "只记忆命令拼写", "跳过输入与结果验证"], answerIndex: 0, explanation: asSentence(lesson.why) },
      { prompt: "开始实践前，哪种做法最可靠？", options: ["先写清输入、预期输出和边界", "直接在重要数据上试", "只保留成功截图", "忽略工具版本"], answerIndex: 0, explanation: "明确输入、输出和边界，才能判断结果是否正确。" },
      { prompt: `关于本课，哪项表述正确？`, options: [first, "所有异常都应忽略", "示例通过就覆盖了全部边界", "术语名称比可观察证据更重要"], answerIndex: 0, explanation: asSentence(lesson.concepts?.[0] || lesson.summary) },
      { prompt: "出现与预期不同的结果时，第一步是什么？", options: ["固定输入并记录实际现象", "同时修改多处", "删除全部记录", "只重新启动电脑"], answerIndex: 0, explanation: "固定现场后才能稳定复现并逐层排除。" },
      { prompt: `哪项属于“${lesson.title}”的有效验收证据？`, options: [`能解释并复现：${second}`, "只说已经看懂", "只保存源文件名", "只记录学习时长"], answerIndex: 0, explanation: "证据应同时体现理解、操作和可复现结果。" },
      { prompt: "完成课程后，怎样降低回归风险？", options: ["保存正常、边界和失败案例并重新验证", "删除失败样例", "只测一次正常路径", "依赖记忆判断"], answerIndex: 0, explanation: "稳定的案例与验收记录能发现后续修改造成的行为变化。" }
    ];
  }

  global.buildStageLessonProfile = function buildStageLessonProfile(lesson, stageId) {
    const config = configs[stageId];
    if (!config || !config.ids.includes(lesson.id)) return {};
    const points = makeKnowledgePoints(lesson, config);
    const references = (config.referencesById?.[lesson.id] || config.references || []).slice(0, 3);
    const exampleText = lesson.example || lesson.concepts?.join("\n") || lesson.summary;
    const lab = global.courseLabs?.[lesson.id];
    return {
      density: "high-density-v1",
      prerequisites: config.prerequisites.slice(0, 3),
      objectives: [
        `用自己的话解释“${lesson.title}”以及它解决的问题。`,
        `在${config.systemName}链路中，标出“${lesson.title}”接收的输入、执行的处理和产生的输出。`,
        `独立完成“${lesson.practice}”并保留可检查结果。`,
        "覆盖正常输入、边界输入和失败路径，写出复盘记录。"
      ],
      knowledgePoints: points,
      deepDive: [
        `${asSentence(lesson.summary)}学习时先确定对象与边界，再观察它与上下游的关系。${asSentence(lesson.why)}`,
        `本课的核心链路是“输入或前置状态 → ${clean(lesson.title)}相关处理 → 可观察结果”。处理过程中要记录关键状态；若结果不同，沿数据、控制条件和外部依赖逐层定位。`,
        `工程上要用“${lesson.title}”的正常案例、边界案例和失败案例验证适用范围；重点检查空值、重复值、极端规模、权限或依赖失败。验收标准是：${asSentence(lesson.checkpoint)}`
      ],
      systemPosition: `${lesson.title}位于${config.systemName}知识链路中；上游提供输入、配置或状态，本课机制完成转换，下游通过输出、日志、测试或交付物验证。`,
      lab,
      workedExamples: [
        {
          title: "跟随示例观察完整链路",
          scenario: `使用最小输入观察“${lesson.title}”的关键行为。`,
          steps: ["在独立练习目录保存输入和环境信息。", "按示例执行，逐行或逐步骤解释发生了什么。", "记录实际输出，并与预期结果逐项比较。", "改变一个输入条件后再次运行，确认因果关系。"],
          input: exampleText,
          output: `得到可复现结果，并能说明：${lesson.checkpoint}`,
          checkpoints: ["命令、代码或操作步骤完整。", "实际结果与解释同时保留。", "练习不操作重要原始数据。"]
        },
        {
          title: "边界与失败路径验证",
          scenario: `把“${lesson.practice}”扩展为正常、边界、失败三组案例。`,
          steps: ["先写正常案例及预期结果。", "增加空值、重复值或最小/最大规模中的相关案例。", "制造一个可恢复失败，记录错误类型或现象。", "修正后重跑全部案例，确认旧行为没有退化。"],
          input: `任务：${lesson.practice}\n案例：正常 / 边界 / 失败`,
          output: "案例表、实际结果、修正说明和复测结论",
          checkpoints: ["每个案例只有一个主要变量。", "失败有原因而非只写‘报错’。", "复测覆盖此前通过的案例。"]
        }
      ],
      mistakes: points.slice(0, 4).map((point) => ({
        wrong: point.misconception,
        why: `这会遗漏“${point.term}”对应的实际机制和边界。`,
        correct: `用最小案例验证：${point.detail}`
      })),
      troubleshooting: [
        `先复述目标：${lesson.summary}`,
        "记录工具/运行时版本、当前目录、输入和完整错误信息。",
        "缩小为稳定复现问题的最小案例，一次只改变一个条件。",
        "从输入格式、处理条件、状态变化和输出位置四层逐项检查。",
        "对照官方资料确认术语、默认值、版本差异和边界约束。",
        `修复后按“${clean(lesson.checkpoint)}”重新验收，并保留回归案例。`
      ],
      practices: [
        { level: "基础练习", title: "概念与链路", task: `画出“${lesson.title}”的输入、处理、输出，并解释 8 个知识点。`, evidence: "提交链路图或表格，以及自己的解释。" },
        { level: "进阶练习", title: "边界案例", task: `${lesson.practice}；至少加入一个边界和一个失败案例。`, evidence: "提交步骤、输入、实际输出和错误修正记录。" },
        { level: "项目化练习", title: "可复现交付", task: `把“${lesson.title}”能力接入一个小项目，补运行入口、检查步骤和回滚办法。`, evidence: "另一个人可按说明复现并通过验收。" }
      ],
      quiz: makeQuiz(lesson, points),
      projectLinks: [`${lesson.title}可作为${config.projectName}中的独立能力模块。`, `围绕“${lesson.title}”保存输入样例、失败样例、验证结果和版本信息。`, `交付“${lesson.title}”时，用 README 写清运行入口、适用限制和回滚动作。`],
      references,
      takeaways: [asSentence(lesson.summary), ...points.slice(0, 3).map((point) => point.detail), asSentence(lesson.checkpoint)]
    };
  };
})(window);
