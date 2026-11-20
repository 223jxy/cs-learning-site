(function () {
  "use strict";

  const data = window.aiZoneData;
  if (!data) throw new Error("AI 专区基础数据尚未加载");

  const refs = {
    mlflowTracking: { id: "AI-S030", title: "MLflow Tracking", provider: "MLflow", url: "https://mlflow.org/docs/latest/ml/tracking/" },
    mlflowRegistry: { id: "AI-S031", title: "Model Registry Workflows", provider: "MLflow", url: "https://mlflow.org/docs/latest/ml/model-registry/workflow/" },
    onnx: { id: "AI-S032", title: "Introduction to ONNX", provider: "ONNX", url: "https://onnx.ai/onnx/intro/" },
    helm: { id: "AI-S033", title: "Holistic Evaluation of Language Models", provider: "Stanford CRFM", url: "https://crfm.stanford.edu/helm/latest/" },
    modelCards: { id: "AI-S034", title: "Model Cards", provider: "Hugging Face", url: "https://huggingface.co/docs/hub/model-cards" },
    nistRmf: { id: "AI-S035", title: "NIST AI Risk Management Framework", provider: "NIST", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    nistGenAI: { id: "AI-S036", title: "NIST Generative AI Profile", provider: "NIST", url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" },
    oecd: { id: "AI-S037", title: "OECD AI Principles", provider: "OECD", url: "https://oecd.ai/en/ai-principles" },
    unesco: { id: "AI-S038", title: "Recommendation on the Ethics of Artificial Intelligence", provider: "UNESCO", url: "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics" },
    owasp: { id: "AI-S039", title: "OWASP Top 10 for LLM and GenAI Apps 2025", provider: "OWASP", url: "https://genai.owasp.org/llm-top-10/" },
    pair: { id: "AI-S040", title: "People + AI Guidebook", provider: "Google PAIR", url: "https://pair.withgoogle.com/guidebook/" },
    rulesMl: { id: "AI-S041", title: "Rules of Machine Learning", provider: "Google", url: "https://developers.google.com/machine-learning/guides/rules-of-ml/" },
    sre: { id: "AI-S042", title: "Monitoring Distributed Systems", provider: "Google SRE", url: "https://sre.google/sre-book/monitoring-distributed-systems/" },
    docker: { id: "AI-S043", title: "Building best practices", provider: "Docker", url: "https://docs.docker.com/build/building/best-practices/" },
    sklearnRandom: { id: "AI-S044", title: "Controlling randomness", provider: "scikit-learn", url: "https://scikit-learn.org/stable/common_pitfalls.html#controlling-randomness" }
  };

  function makeQuiz(item) {
    const raw = [
      ["本课首先要建立哪项能力？", [item.objectives[0], "只记住工具名称", "只保存最终模型文件", "跳过失败证据"], 0, "目标应落到可复现、可交付或可审计的能力。"],
      [`“${item.concepts[0][0]}”在本课中指什么？`, [item.concepts[0][1], item.concepts[1][1], "页面上的任意状态", "模型输出的自然语言解释"], 0, "应按本课给出的工程定义判断。"],
      [`关于“${item.concepts[1][0]}”，哪项准确？`, [item.concepts[1][1], "它自动保证上线安全", "它与数据版本无关", "只需训练完成后记录"], 0, "该概念位于明确的交付或治理链路中。"],
      ["哪项最符合可靠的 AI 工程证据？", ["记录版本、配置、指标、产物、日志和责任人", "只保留最好的一次截图", "只记录模型名称", "上线后不再复测"], 0, "工程结论需要能沿完整链路复查。"],
      ["出现线上异常时应优先做什么？", ["按版本、输入、指标、日志和变更时间定位并执行预案", "立刻删除旧模型", "只提高阈值", "让模型自行解释原因"], 0, "先收集证据并控制影响，再分析和修复。"],
      ["本课方法的适用边界是哪项？", [item.limits[0], "一份清单适用于所有场景", "平均指标可覆盖所有人群", "模型通过离线测试即可永久运行"], 0, "限制和未测量风险必须进入交付结论。"]
    ];
    return raw.map(([question, options, answer, explanation], index) => {
      const rotation = (item.id.length + index * 2) % options.length;
      return {
        question,
        options: [...options.slice(rotation), ...options.slice(0, rotation)],
        answer: (answer - rotation + options.length) % options.length,
        explanation
      };
    });
  }

  function lesson(moduleId, sequence, config) {
    const module = data.modules.find((item) => item.id === moduleId);
    const item = {
      id: `ai-${moduleId.slice(3)}-${config.slug}`,
      number: `${moduleId}-${String(sequence).padStart(2, "0")}`,
      moduleId,
      title: config.title,
      summary: config.summary,
      why: config.why,
      duration: config.duration || 60,
      level: module.level,
      type: config.type || "工程",
      status: "open",
      environment: config.labId ? "浏览器" : "无需代码",
      objectives: config.objectives,
      concepts: config.concepts,
      deepDive: config.deepDive,
      workedExamples: [{ title: config.exampleTitle, steps: config.exampleSteps }],
      misconceptions: config.misconceptions,
      limits: config.limits,
      practice: config.practice,
      checkpoint: config.checkpoint || ["能解释四个核心概念", "能沿示例追踪版本、证据和决策", "能指出一个失败条件及对应控制"],
      references: config.references,
      labId: config.labId || ""
    };
    item.quiz = makeQuiz(item);
    return item;
  }

  const lessons = [
    lesson("AI-10", 1, {
      slug: "reproducible-environments", title: "环境、依赖、随机性与可复现运行", summary: "把一次成功实验变成可以在明确条件下重新执行的工程记录。",
      why: "相同代码在依赖、硬件、随机种子或数据顺序变化后可能得到不同结果；可复现首先是锁定输入条件和允许的波动范围。",
      objectives: ["列出一次运行必须固定的环境字段", "区分确定性、随机种子与统计复现", "设计从空环境开始的复现命令"],
      concepts: [["运行环境", "代码执行所依赖的操作系统、运行时、库、硬件和配置组合"], ["依赖锁定", "记录包的精确版本及来源，使安装结果可追踪"], ["随机种子", "初始化伪随机序列的输入，不等同于完全确定性"], ["复现容差", "对随机算法允许的指标波动和判断范围"]],
      deepDive: ["环境记录至少包含 Python/Node 版本、依赖锁文件、操作系统、CPU/GPU、驱动和关键环境变量名称；密钥值不写入产物。", "种子要覆盖数据切分、采样、初始化和框架随机源，但并行、硬件内核和库实现仍可能带来差异，因此应报告多次运行分布。", "复现步骤应从获取数据版本开始，依次安装依赖、运行命令、生成产物并校验摘要，而不是只写“运行 notebook”。"],
      exampleTitle: "复现一个分类基线", exampleSteps: ["固定 data-v3 与切分清单", "记录 Python 3.x 和 requirements.lock", "设置 split_seed=42、model_seed=17", "执行 train 命令", "比较 Accuracy 容差 ±0.01", "保存日志和产物哈希"],
      misconceptions: ["设置一个 random_state 就保证所有机器逐位相同。", "只记录 pip freeze 就包含了数据和系统环境。"], limits: ["某些硬件算子仍可能非确定。", "完全逐位复现可能牺牲性能，需按风险选择目标。"],
      practice: ["为现有 Python 实验写环境清单。", "设计一次三种种子的重复实验并报告均值和范围。"], references: [refs.sklearnRandom, refs.docker]
    }),
    lesson("AI-10", 2, {
      slug: "lineage-versions-artifacts", title: "数据、代码、配置、指标与产物血缘", summary: "用稳定 ID 把一次模型结果连接到所有上游输入和下游文件。",
      why: "只有模型文件名无法回答它用什么数据、代码和参数训练，也无法安全回滚或复查异常。",
      objectives: ["设计 run、dataset、code、artifact 的版本字段", "建立从指标到产物的反向追踪", "区分可变别名和不可变版本"],
      concepts: [["实验 Run", "一次带唯一 ID 的训练或评价执行记录"], ["数据版本", "能唯一定位数据快照、切分和处理规则的标识"], ["Artifact", "模型、图表、日志、词表或报告等运行产物"], ["血缘", "产物与数据、代码、配置和上游步骤之间的可追踪关系"]],
      deepDive: ["run 记录 code commit 或内容哈希、dataset ID、配置、环境、开始时间、指标和 artifact URI；任何一个缺失都会削弱复查能力。", "生产别名如 champion 可以指向新版本，但 model-v17 本身应不可变；部署记录同时保存别名解析后的具体版本。", "模型之外的 tokenizer、标签映射、预处理器和特征 schema 同属交付产物，版本不一致会让参数含义发生变化。"],
      exampleTitle: "从线上预测追到训练", exampleSteps: ["请求日志记录 model-v17", "model-v17 指向 run-20260727-04", "run 绑定 data-v8 与 code hash", "配置保存阈值和种子", "artifact 保存模型、词表和 schema", "报告引用同一 run ID"],
      misconceptions: ["文件名带日期就是完整版本管理。", "数据库中的 latest 永远能代表当时上线版本。"], limits: ["血缘记录保证可追踪，不保证数据本身正确。", "外部服务版本可能需要额外保存响应和契约。"],
      practice: ["为一个模型设计 manifest.json 字段。", "从一条预测日志画出反向血缘链。"], references: [refs.mlflowTracking, refs.mlflowRegistry]
    }),
    lesson("AI-10", 3, {
      slug: "tracking-registry-model-card", title: "实验追踪、模型注册与 Model Card", summary: "把大量实验筛选、候选模型审批和用途边界纳入统一交付记录。",
      why: "实验追踪回答“发生过什么”，模型注册回答“哪些版本可部署”，Model Card 回答“应怎样使用和理解限制”。",
      objectives: ["区分 tracking、registry 与 Model Card", "为候选模型定义晋级条件", "写出用途、限制、数据和评价字段"],
      concepts: [["实验追踪", "集中记录 run 的参数、指标、标签和产物"], ["模型注册", "管理模型名称、不可变版本、别名、状态和来源 run"], ["Model Card", "说明模型用途、限制、数据、评估和风险的文档"], ["晋级门槛", "模型进入候选或生产状态前必须满足的自动与人工条件"]],
      deepDive: ["Tracking 中的最好分数不是自动生产版本；还要检查数据切片、稳定性、延迟、安全、文档和审批。", "Registry 保存版本、来源、签名、标签和别名。别名便于切换，但部署日志必须解析到具体版本，避免审计时只剩可变名称。", "Model Card 至少写模型描述、预期用途、不适用用途、训练数据、评价结果、偏差、限制、许可和维护信息；它不是营销页面。"],
      exampleTitle: "候选模型晋级", exampleSteps: ["run-31 离线 F1=0.88", "关键切片 Recall 均高于 0.80", "p95 延迟低于 120ms", "smoke test 全部通过", "Model Card 已更新", "审批后把 candidate 别名指向 model-v12"],
      misconceptions: ["模型注册表就是存放权重的文件夹。", "Model Card 写了限制就等于限制已被控制。"], limits: ["文档依赖持续维护，过期说明会误导使用者。", "晋级阈值必须结合用途和错误成本。"],
      practice: ["为一个文本分类器写 Model Card 目录。", "设计自动门槛与人工审批各三项。"], references: [refs.mlflowRegistry, refs.modelCards]
    }),
    lesson("AI-10", 4, {
      slug: "batch-online-serving", title: "批处理、在线推理、接口契约与 Smoke Test", summary: "按时效、规模和错误成本选择推理方式，并用最小请求验证版本与契约。",
      why: "模型离线可运行不代表服务可用；生产入口还要处理 schema、超时、并发、错误响应和版本确认。",
      objectives: ["区分 batch 与 online inference", "定义预测接口的输入输出 schema", "设计覆盖版本、边界和延迟的 smoke test"],
      concepts: [["批处理推理", "定时或一次性对成批数据执行预测的模式"], ["在线推理", "按单个请求低延迟返回预测的服务模式"], ["模型签名", "输入列、类型、shape 与输出结构的机器可检查契约"], ["Smoke Test", "部署后快速验证核心入口、版本和基本结果的最小测试"]],
      deepDive: ["批处理更适合大吞吐、允许等待和可重跑任务；在线服务关注尾延迟、并发、超时、幂等和降级。", "接口响应应包含 requestId、modelVersion、结果和错误码；不要只返回裸数组，否则难以追踪具体版本和部分失败。", "Smoke test 使用少量固定样本检查健康端点、输入 schema、版本、输出范围和 p95 预算，但不能替代完整回归与压力测试。"],
      exampleTitle: "预测服务最小验收", exampleSteps: ["GET /health 返回 ready", "POST /predict 提交固定样本", "响应 modelVersion=model-v12", "结果字段通过 schema", "三个边界样本无异常", "耗时低于门槛并记录 requestId"],
      misconceptions: ["HTTP 200 就表示预测内容正确。", "平均延迟低就说明所有请求都快。"], limits: ["浏览器实验只模拟接口契约，不承载真实并发。", "Smoke test 覆盖面小，不能发现所有数据和负载问题。"],
      practice: ["为分类服务写请求与响应 JSON。", "运行版本 smoke test 并观察失败门槛。"], references: [refs.mlflowRegistry, refs.sre], labId: "ai-lab-model-release-smoke", type: "实验", duration: 75
    }),
    lesson("AI-10", 5, {
      slug: "onnx-runtime-compatibility", title: "模型导出、ONNX 与运行时兼容", summary: "理解模型交换格式的图、算子、opset、shape 和精度边界。",
      why: "导出成功只说明生成了文件；目标运行时是否支持算子、动态 shape、预处理和数值精度仍需逐项验证。",
      objectives: ["解释 ONNX graph、node、initializer 与 opset", "设计源框架和目标运行时对照测试", "记录导出产物的签名与兼容矩阵"],
      concepts: [["ONNX Graph", "由输入、输出、节点、初始化参数和属性组成的计算图"], ["Operator", "图中执行具体计算的标准或扩展算子"], ["Opset", "规定一组算子定义版本的标识"], ["运行时兼容", "目标环境对算子、类型、shape 和数值行为的支持程度"]],
      deepDive: ["导出时把框架操作映射为 ONNX 节点；自定义或新算子可能没有目标运行时实现，因此需要算子清单和 fallback。", "opset 不是越新越好，应与导出器和部署运行时共同选择并记录；升级后重新执行代表性和边界输入对照。", "比较源模型与导出模型的输出误差、shape、性能和预处理；浮点容差要按 dtype 和用途定义，不能要求所有后端逐位相同。"],
      exampleTitle: "导出线性分类器", exampleSteps: ["固定输入 shape=(None,4)", "选择受运行时支持的 opset", "导出 graph 和权重", "运行 checker 与 shape inference", "用 20 条样本比较输出误差", "保存 runtime 与 opset 兼容记录"],
      misconceptions: ["ONNX 是一个通用训练框架。", "模型能加载就代表预测与源框架一致。"], limits: ["并非所有动态控制流和自定义算子都能直接转换。", "量化与不同硬件会带来额外数值误差。"],
      practice: ["列出导出验收的六项证据。", "解释 opset、运行时版本和模型版本为什么要一起记录。"], references: [refs.onnx, refs.mlflowRegistry]
    }),
    lesson("AI-10", 6, {
      slug: "drift-monitoring-alerts", title: "输入漂移、概念漂移与线上监控", summary: "把数据、模型质量和服务健康拆成可观察指标与可处理告警。",
      why: "线上标签常延迟到达，单看 Accuracy 会太晚；需要同时监控输入、输出、服务和抽样人工反馈。",
      objectives: ["区分数据漂移、概念漂移和训练-服务偏差", "设计模型与服务两组监控指标", "把告警连接到具体处置动作"],
      concepts: [["数据漂移", "线上输入分布相对基准发生变化"], ["概念漂移", "输入与真实目标之间的关系发生变化"], ["训练-服务偏差", "训练与线上特征计算或数据时点不一致"], ["告警", "指标越过带持续时间和处置说明的阈值后触发通知"]],
      deepDive: ["输入漂移可监控缺失率、类别比例、数值分布、文本长度和 embedding 摘要；它提示环境变化，但不等同于性能下降。", "服务层至少观察 latency、traffic、errors、saturation；模型层观察输出分布、置信度、拒答率、切片表现和延迟标签。", "告警要有基准窗口、阈值、持续时间、负责人和 runbook。没有动作的高噪声告警会被忽略。"],
      exampleTitle: "课程推荐监控", exampleSteps: ["基准记录课程类别与得分分布", "线上比较缺失率和 PSI/距离", "监控 p95 延迟与错误率", "每周回填采纳和复测标签", "关键切片下降触发调查", "确认影响后回滚或重训"],
      misconceptions: ["检测到输入漂移就必须立即重训。", "无 HTTP 500 就表示模型服务健康。"], limits: ["没有及时标签时只能使用代理信号。", "漂移统计对样本量、窗口和季节性敏感。"],
      practice: ["为一个文本分类器列出 8 个线上指标。", "给两个告警写阈值、持续时间和处理人。"], references: [refs.rulesMl, refs.sre]
    }),
    lesson("AI-10", 7, {
      slug: "rollout-rollback-retraining-cost", title: "灰度发布、回滚、再训练与成本闭环", summary: "用分阶段流量、停止条件和版本化回滚降低模型变更风险。",
      why: "离线更优的模型可能在真实流量、延迟或人群切片上退化；发布必须能够暂停、比较和恢复。",
      objectives: ["设计 shadow、canary 与 A/B 的使用边界", "定义自动停止和回滚条件", "把再训练触发与成本纳入决策"],
      concepts: [["Shadow", "复制真实请求给候选模型但不影响用户结果的验证方式"], ["Canary", "先让少量真实流量使用新版本并逐步扩大"], ["回滚", "把服务恢复到已知可靠版本及其配套配置"], ["再训练触发", "由时间、数据、性能、漂移或事件条件启动的新训练流程"]],
      deepDive: ["shadow 可比较延迟和输出但看不到真实决策影响；canary 能观察实际效果，却必须限制流量并定义快速停止条件。", "回滚对象包含模型、预处理、阈值、特征和依赖，不只是权重；上线前应验证旧版本仍可加载和服务。", "再训练不应只靠固定周期。结合标签积累、漂移、切片退化、数据修复和重大事件，并比较训练与推理成本。"],
      exampleTitle: "model-v13 灰度", exampleSteps: ["离线门槛通过", "shadow 24 小时比较输出", "canary 5% 流量", "监控错误率、p95、关键切片与成本", "任一停止条件触发回滚 v12", "稳定后逐步扩大并更新 Model Card"],
      misconceptions: ["A/B test 可以代替安全检查。", "回滚只需要保留旧模型文件。"], limits: ["低流量阶段难检测罕见风险。", "实验分流还要处理用户一致性和统计效力。"],
      practice: ["为 canary 写五个停止条件。", "列出完整回滚包中的文件与配置。"], references: [refs.sre, refs.rulesMl]
    }),
    lesson("AI-11", 1, {
      slug: "risk-context-stakeholders", title: "使用情境、利益相关者与影响分级", summary: "从谁受影响、怎样使用和错误后果开始，而不是从抽象风险词表开始。",
      why: "相同模型用于娱乐推荐和重要资格审核时，风险、证据和人工监督要求完全不同。",
      objectives: ["写出用途、使用者、受影响者和禁用场景", "按影响与可能性做初步分级", "定义 go/no-go 和人工监督边界"],
      concepts: [["使用情境", "AI 系统运行的目的、环境、用户、流程与社会条件"], ["利益相关者", "开发、运营、使用或受到结果影响的个人与组织"], ["影响分级", "按后果严重度、范围、可逆性和可能性划分风险"], ["风险容忍度", "组织在特定用途下愿意接受的残余风险水平"]],
      deepDive: ["风险地图要区分直接用户、被决策者、运营人员、数据主体和外部群体，并记录谁有权纠正、申诉和停止系统。", "严重度不仅看概率，还看影响人数、可逆性、持续时间和是否触及基本权利；未知风险应作为不确定性记录。", "在 Map 阶段就可得出不采用 AI、缩小自动化范围或要求人工最终决定的结论，而不是默认必须上线。"],
      exampleTitle: "学习推荐与自动评分对比", exampleSteps: ["学习推荐只建议复习，用户可忽略", "自动评分影响成绩和机会", "识别学生、教师、管理员与家长", "分别评估错误严重度和可逆性", "自动评分要求申诉与人工复核", "证据不足时限制用途"],
      misconceptions: ["模型准确率相同就代表风险相同。", "只有最终用户才是利益相关者。"], limits: ["分级依赖具体情境和组织责任。", "低概率高影响事件仍需专门控制。"],
      practice: ["为一个 AI 功能画利益相关者表。", "写出三项禁用场景和 go/no-go 条件。"], references: [refs.nistRmf, refs.unesco]
    }),
    lesson("AI-11", 2, {
      slug: "privacy-minimization-retention", title: "隐私、敏感数据、最小化与保留期限", summary: "沿收集、训练、日志、推理和删除链路控制个人与机密信息。",
      why: "敏感信息可能进入数据集、prompt、检索库、日志、缓存和模型输出；只在入口做脱敏无法覆盖完整生命周期。",
      objectives: ["识别数据生命周期中的敏感信息位置", "应用目的限制和数据最小化", "设计访问、保留、删除和事件证据"],
      concepts: [["数据最小化", "只收集和处理实现明确目的所必需的数据"], ["目的限制", "数据只用于已说明且兼容的用途"], ["保留期限", "数据、日志和备份允许保存的时间及删除规则"], ["敏感信息泄露", "个人、机密或受限数据被非预期暴露给模型、日志或用户"]],
      deepDive: ["建立字段级数据清单：来源、目的、合法依据、敏感级别、访问角色、保存位置和删除时间；训练副本与备份也在范围内。", "Prompt 和工具日志默认可能包含原文，记录时应最小化、分级访问并设置保留；调试便利不是无限保存的理由。", "删除请求要追踪原始库、派生特征、向量索引、缓存和后续训练集。对于已训练参数，需记录技术边界与可用处置。"],
      exampleTitle: "本地文档问答隐私表", exampleSteps: ["只索引课程资料目录", "排除含账号和私人笔记的路径", "检索前做用户权限过滤", "日志仅存文档 ID 与错误摘要", "30 天删除调试日志", "泄露告警触发停用和调查"],
      misconceptions: ["数据匿名化后就永远没有隐私风险。", "只要不训练模型，prompt 就不需要数据治理。"], limits: ["去标识数据仍可能被重新识别。", "具体处理还要遵守适用地区和行业规则。"],
      practice: ["为问答应用做字段级数据清单。", "设计日志保留、删除和访问矩阵。"], references: [refs.nistGenAI, refs.unesco]
    }),
    lesson("AI-11", 3, {
      slug: "fairness-slices-representation", title: "偏差、公平性、分组指标与代表性", summary: "按受影响群体和使用条件检查错误分布，而不是只看总体平均分。",
      why: "高样本量群体会主导总体指标；少数群体可能同时面临样本不足、标签偏差和更高错误成本。",
      objectives: ["区分数据、标签、模型和部署偏差", "建立分组指标与样本量报告", "记录无法代表的人群和用途限制"],
      concepts: [["代表性", "数据对目标人群、环境和条件的覆盖程度"], ["分组指标", "按群体或条件分别计算的性能与错误指标"], ["公平性", "结合具体用途讨论利益、负担和错误分配的要求"], ["交叉切片", "同时按多个属性形成的群体或条件组合"]],
      deepDive: ["公平不是一个通用公式。应先明确决策、受影响者和哪类错误更严重，再选择分组 Recall、FPR、校准或机会指标。", "每个切片同时报告样本数和不确定性；极小样本的高低分都不稳定，需补采数据和质性审查。", "训练数据代表性、历史标签、测量误差和上线反馈循环都会产生偏差。指标差异是调查信号，不自动说明唯一原因。"],
      exampleTitle: "语音识别切片", exampleSteps: ["总体字错率 8%", "按语言、口音、噪声和设备切片", "报告样本数与置信区间", "抽样检查高错误组", "补充数据或限制用途", "上线后继续收集自愿反馈"],
      misconceptions: ["移除敏感属性就消除了偏差。", "所有分组指标完全相等才算公平。"], limits: ["群体定义可能不完整或涉及隐私。", "不同公平目标之间可能存在冲突。"],
      practice: ["为一个分类任务设计六个评估切片。", "写出总体分提升但某切片退化的发布决策。"], references: [refs.nistRmf, refs.unesco]
    }),
    lesson("AI-11", 4, {
      slug: "transparency-explainability-cards", title: "透明度、可解释性与系统文档", summary: "为不同受众提供与情境相称的模型、数据、决策和申诉信息。",
      why: "透明不等于公开所有源码；有效信息应帮助用户理解能力、限制、数据来源、具体结果和纠正路径。",
      objectives: ["区分系统透明度与单次结果解释", "为开发者、运营者和受影响者选择信息", "连接 Model Card、Dataset Card 与变更记录"],
      concepts: [["透明度", "披露 AI 使用方式、能力、限制、数据和责任信息"], ["可解释性", "提供有助于理解系统或具体输出的原因信息"], ["可质疑性", "让受影响者能够反馈、申诉和请求人工复核"], ["系统文档", "Model Card、Dataset Card、评估报告和变更日志的组合"]],
      deepDive: ["一般系统解释说明用途、输入、输出、主要限制和已知错误；具体输出解释说明本次使用了哪些信息和规则，二者面向不同问题。", "解释应与决策重要性匹配，并避免暴露私人数据、安全控制或误导性的“完整原因”。无法可靠解释时应明确边界和提供人工渠道。", "Model Card 记录模型，Dataset Card 记录数据，部署变更记录实际版本；三者必须能由线上 requestId 反向定位。"],
      exampleTitle: "学习风险提示", exampleSteps: ["告知用户正在使用 AI", "说明输入来自哪些学习记录", "展示影响建议的主要可见因素", "标注模型并非成绩判定", "提供纠错和人工联系入口", "链接当前版本说明与更新日期"],
      misconceptions: ["开放源代码就自动满足可解释性。", "展示 attention 权重就是完整解释。"], limits: ["解释可能简化复杂模型并造成过度信任。", "透明度需与隐私、安全和知识产权权衡。"],
      practice: ["为学生和管理员分别写一份说明。", "为一条高影响输出设计申诉流程。"], references: [refs.oecd, refs.modelCards, refs.pair]
    }),
    lesson("AI-11", 5, {
      slug: "llm-application-security", title: "Prompt Injection、泄露、输出处理与过度授权", summary: "把 LLM 视为不可信决策组件，用权限、校验和边界控制应用风险。",
      why: "系统 prompt 无法形成安全边界；用户输入、检索文档、工具结果和模型输出都可能携带不可信内容。",
      objectives: ["画出 LLM 应用的信任边界", "区分 prompt injection、泄露和不安全输出", "限制工具权限、步骤、成本和人工确认"],
      concepts: [["Prompt Injection", "不可信内容试图改变原有指令、数据边界或工具行为"], ["不安全输出处理", "应用未经校验就把模型输出交给解释器、数据库或下游系统"], ["过度授权", "模型或 Agent 获得超出当前任务需要的工具、数据或动作范围"], ["资源失控", "输入、循环或工具调用缺少预算导致成本、延迟或容量耗尽"]],
      deepDive: ["直接注入来自用户输入，间接注入来自网页、邮件和 RAG 文档。防护重点是把数据与指令隔离，并在应用侧执行权限和 schema 校验。", "模型输出进入 HTML、SQL、Shell、邮件或文件系统前按对应上下文编码、参数化和审批；“来自模型”不等于可信。", "Agent 设置最大步骤、时间、token、并发和费用；工具按最小权限限制资源范围，高影响写入要求人工确认和可回滚记录。"],
      exampleTitle: "本地问答威胁模型", exampleSteps: ["资产：私人文档、系统规则和工具权限", "边界：用户→应用→模型→检索库→工具", "威胁：文档注入诱导导出其他文件", "控制：检索前权限过滤和只读工具", "输出：引用与 schema 校验", "事件：异常调用触发停止并保留 trace"],
      misconceptions: ["把系统 prompt 隐藏起来就安全。", "模型拒绝危险请求可替代权限控制。"], limits: ["没有单一提示词能覆盖所有注入变体。", "控制需要随工具、模型和数据源变化复测。"],
      practice: ["运行 LLM 威胁建模实验。", "为一个写文件工具设计参数、权限和确认规则。"], references: [refs.owasp, refs.nistGenAI], labId: "ai-lab-llm-threat-model", type: "安全", duration: 80
    }),
    lesson("AI-11", 6, {
      slug: "supply-chain-integrity", title: "模型、数据与依赖供应链完整性", summary: "追踪权重、数据、容器、代码和依赖的来源、许可、哈希与变更。",
      why: "AI 应用依赖大量第三方模型、数据和包；来源不明或可变标签会让恶意修改、后门和许可问题进入交付链。",
      objectives: ["建立 AI 供应链物料清单", "验证来源、哈希、签名、许可和扫描结果", "设计第三方模型进入生产的隔离与晋级流程"],
      concepts: [["供应链", "从数据、模型、代码、依赖到构建和发布的上游组件网络"], ["来源证明", "说明产物由谁、在何时、用哪些输入和步骤生成的证据"], ["完整性校验", "用哈希、签名或证明检测产物是否被非预期修改"], ["数据/模型投毒", "恶意或有缺陷内容进入训练、微调、embedding 或权重并影响行为"]],
      deepDive: ["模型清单记录来源仓库、具体 revision、许可证、文件哈希、架构、训练资料说明和扫描结果；不要只保存可变的 latest 标签。", "数据清单记录采集来源、授权、版本、异常检测和人工抽样；RAG 文档更新同样属于供应链变更。", "构建依赖锁版本与校验和，容器基础镜像可固定 digest；更新仍需按流程测试，固定版本不等于永远安全。"],
      exampleTitle: "引入第三方 embedding 模型", exampleSteps: ["确认发布者与许可证", "固定仓库 revision", "校验文件哈希", "在隔离环境加载", "运行恶意样本和质量基线", "登记 SBOM/模型清单后再进入候选环境"],
      misconceptions: ["开源模型天然可信。", "固定依赖版本后就无需安全更新。"], limits: ["哈希证明文件未变，不能证明文件没有恶意逻辑。", "上游训练数据通常无法完全审计。"],
      practice: ["为模型、数据、依赖各列五个清单字段。", "设计第三方权重的隔离验收流程。"], references: [refs.owasp, refs.docker]
    }),
    lesson("AI-11", 7, {
      slug: "nist-risk-incident-response", title: "Govern、Map、Measure、Manage 与事件响应", summary: "把组织责任、情境分析、测试度量和风险处置贯穿 AI 生命周期。",
      why: "治理不是上线前的一次打勾；风险、用途、模型、数据和外部环境持续变化，需要明确责任和循环复查。",
      objectives: ["解释 NIST AI RMF 四个函数的职责", "把生命周期证据映射到风险决策", "设计人工监督、事件分级和复盘闭环"],
      concepts: [["Govern", "建立政策、角色、责任、文化和持续治理结构"], ["Map", "理解用途、情境、利益相关者、影响和风险来源"], ["Measure", "用定量、定性与独立测试分析风险和控制效果"], ["Manage", "排序、处置、监控、沟通并接受或降低风险"]],
      deepDive: ["Govern 是贯穿其他函数的基础，不只是第一步；Map 提供情境，Measure 选择与执行测试，Manage 根据证据做 go/no-go、缓解、监控和停止决策。", "框架不是固定顺序的万能清单。组织按用途和风险选择活动，并记录未测量风险、责任人、复审时间和残余风险接受者。", "事件响应包含发现、限制影响、保存证据、通知、恢复、根因分析和控制改进；AI 事件还要固定模型、prompt、数据、工具和决策 trace 版本。"],
      exampleTitle: "错误推荐事件", exampleSteps: ["监控发现特定切片异常", "暂停自动推荐并切回规则基线", "保存请求、模型和数据版本", "通知负责人并评估影响范围", "修复数据映射并重新测量", "更新风险登记、Model Card 和告警"],
      misconceptions: ["NIST Playbook 是必须逐项完成的有序清单。", "治理只由法务或安全团队负责。"], limits: ["框架提供结构，不替代具体行业判断和适用规则。", "风险无法全部量化，定性证据也需要记录。"],
      practice: ["把一个 AI 功能映射到四个函数。", "写一份包含检测、控制、恢复和复盘的事件流程。"], references: [refs.nistRmf, refs.nistGenAI, refs.oecd]
    })
  ];

  function stableHash(value) {
    let hash = 2166136261;
    for (const character of String(value)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  const labs = [
    {
      id: "ai-lab-model-release-smoke", number: "AI-LAB-11", lessonId: "ai-10-batch-online-serving", title: "模型版本、接口契约与 Smoke Test", environment: "浏览器 JavaScript", duration: 20,
      goal: "构造候选模型 manifest，运行确定性预测和接口检查，按准确率、p95 延迟、版本与 schema 门槛决定是否可发布。",
      inputs: "固定二分类线性模型和 5 条 smoke 样本；可调整候选版本、最低准确率和最大 p95 延迟。",
      evidence: ["不可变版本与 artifact hash", "请求/响应 schema 和 modelVersion", "逐项发布门槛与最终结论"],
      controls: [
        { id: "version", label: "候选版本", value: "model-v12", type: "text" },
        { id: "minAccuracy", label: "最低准确率", value: 0.8, type: "number" },
        { id: "maxLatency", label: "最大 p95(ms)", value: 120, type: "number" }
      ],
      code: "manifest = load_candidate_manifest()\nassert manifest.version == response.modelVersion\nvalidate_schema(request, response)\nrun_fixed_smoke_cases()\nassert accuracy >= min_accuracy\nassert p95_latency_ms <= max_latency",
      run(config = {}) {
        const version = String(config.version || "").trim();
        const minAccuracy = Number.isFinite(config.minAccuracy) ? Math.max(0, Math.min(1, config.minAccuracy)) : 0.8;
        const maxLatency = Number.isFinite(config.maxLatency) ? Math.max(1, config.maxLatency) : 120;
        const model = { weight: 1.2, bias: -0.4 };
        const samples = [
          { id: "smoke-01", x: -2, label: 0, latency: 42 },
          { id: "smoke-02", x: -0.5, label: 0, latency: 58 },
          { id: "smoke-03", x: 0.5, label: 1, latency: 71 },
          { id: "smoke-04", x: 2, label: 1, latency: 96 },
          { id: "smoke-05", x: 4, label: 1, latency: 109 }
        ];
        const rows = samples.map((sample) => {
          const score = model.weight * sample.x + model.bias;
          const prediction = score >= 0 ? 1 : 0;
          return {
            ...sample,
            request: { requestId: sample.id, features: [sample.x] },
            response: { requestId: sample.id, modelVersion: version, prediction, score },
            correct: prediction === sample.label
          };
        });
        const accuracy = rows.filter((row) => row.correct).length / rows.length;
        const sortedLatency = rows.map((row) => row.latency).sort((left, right) => left - right);
        const p95Latency = sortedLatency[Math.ceil(sortedLatency.length * 0.95) - 1];
        const manifest = {
          version,
          codeVersion: "code-7f3c",
          dataVersion: "data-v8",
          dependencyLock: "deps-2026-07",
          signature: { input: "features:number[1]", output: "prediction:0|1, score:number" },
          artifactHash: stableHash(JSON.stringify(model))
        };
        const checks = [
          { id: "version", label: "版本格式", passed: /^model-v\d+$/.test(version), evidence: version || "空值" },
          { id: "hash", label: "产物哈希", passed: /^[0-9a-f]{8}$/.test(manifest.artifactHash), evidence: manifest.artifactHash },
          { id: "schema", label: "接口契约", passed: rows.every((row) => row.response.requestId === row.request.requestId && row.response.modelVersion === version && Number.isFinite(row.response.score)), evidence: "5/5 请求响应字段完整" },
          { id: "accuracy", label: "准确率门槛", passed: accuracy >= minAccuracy, evidence: `${accuracy.toFixed(2)} >= ${minAccuracy.toFixed(2)}` },
          { id: "latency", label: "p95 延迟门槛", passed: p95Latency <= maxLatency, evidence: `${p95Latency}ms <= ${maxLatency}ms` }
        ];
        return { manifest, rows, accuracy, p95Latency, checks, releasable: checks.every((check) => check.passed) };
      },
      formatResult(result) {
        return [
          `版本：${result.manifest.version || "（空）"}`,
          `artifact hash：${result.manifest.artifactHash}`,
          `血缘：${result.manifest.codeVersion} / ${result.manifest.dataVersion} / ${result.manifest.dependencyLock}`,
          `签名：${result.manifest.signature.input} -> ${result.manifest.signature.output}`,
          "",
          "检查项 | 结果 | 证据",
          ...result.checks.map((check) => `${check.label} | ${check.passed ? "通过" : "失败"} | ${check.evidence}`),
          "",
          `发布结论：${result.releasable ? "可以进入候选发布" : "门槛未通过，停止发布"}`,
          "边界：本实验模拟本地接口契约与发布门槛，不替代真实服务的并发、故障和安全测试。"
        ].join("\n");
      }
    },
    {
      id: "ai-lab-llm-threat-model", number: "AI-LAB-12", lessonId: "ai-11-llm-application-security", title: "LLM 应用威胁建模", environment: "浏览器 JavaScript", duration: 25,
      goal: "根据本地问答应用的输入源、工具和最大步骤，生成资产、信任边界、六类风险、控制与检测证据。",
      inputs: "自定义不可信输入源、可用工具和 Agent 最大步骤；所有分析只在浏览器内完成。",
      evidence: ["资产与信任边界", "风险、攻击面、控制和检测信号", "高风险动作的人工确认点"],
      controls: [
        { id: "inputSources", label: "不可信输入源", value: "用户输入、检索文档、网页内容", type: "text" },
        { id: "tools", label: "可用工具", value: "搜索、读取文档、保存草稿", type: "text" },
        { id: "maxSteps", label: "最大步骤", value: 6, type: "number" }
      ],
      code: "assets = inventory_data_models_tools()\nboundaries = map_trust_boundaries()\nfor risk in owasp_llm_risks:\n    record(attack_surface, control, evidence, owner)\nrequire_human_approval(high_impact_actions)\nset_step_time_token_cost_budgets()",
      run(config = {}) {
        const inputSources = String(config.inputSources || "").split(/[、,，]/).map((item) => item.trim()).filter(Boolean);
        const tools = String(config.tools || "").split(/[、,，]/).map((item) => item.trim()).filter(Boolean);
        const maxSteps = Number.isFinite(config.maxSteps) ? Math.max(1, Math.min(20, Math.round(config.maxSteps))) : 6;
        const assets = ["本地文档内容", "用户查询与日志", "系统指令", "工具权限", "模型与依赖版本"];
        const boundaries = [
          `外部输入（${inputSources.join(" / ") || "未填写"}）→ 应用`,
          "应用 → 模型上下文",
          "应用 → 检索索引",
          `模型建议 → 工具执行（${tools.join(" / ") || "无工具"}）`
        ];
        const risks = [
          { id: "LLM01", name: "Prompt Injection", severity: "高", surface: inputSources.join("、") || "外部内容", control: "隔离指令与数据；检索前权限过滤；工具参数由代码校验", evidence: "注入测试集、被阻止调用、trace" },
          { id: "LLM02", name: "敏感信息泄露", severity: "高", surface: "上下文、日志、引用和工具结果", control: "数据最小化、字段脱敏、访问控制和保留期限", evidence: "敏感字段扫描、访问日志、删除记录" },
          { id: "LLM03", name: "供应链", severity: "中", surface: "模型、embedding、依赖和文档来源", control: "固定 revision、哈希、许可、隔离扫描与晋级", evidence: "模型清单、SBOM、校验结果" },
          { id: "LLM05", name: "不安全输出处理", severity: "高", surface: "HTML、文件、数据库和下游命令", control: "schema 校验、上下文编码、参数化接口和禁止直接执行", evidence: "校验失败日志、下游安全测试" },
          { id: "LLM06", name: "过度授权", severity: tools.length ? "高" : "中", surface: tools.join("、") || "当前未配置工具", control: "最小权限、资源范围、写操作人工确认与回滚", evidence: "权限矩阵、确认记录、工具审计日志" },
          { id: "LLM10", name: "资源失控", severity: maxSteps > 8 ? "高" : "中", surface: `最多 ${maxSteps} 步的模型与工具循环`, control: "步骤、时间、token、并发和费用预算；重复错误停止", evidence: "预算计数、终止原因、成本指标" }
        ];
        const highRisks = risks.filter((risk) => risk.severity === "高").length;
        return {
          inputSources,
          tools,
          maxSteps,
          assets,
          boundaries,
          risks,
          highRisks,
          approvalRequired: tools.some((tool) => /保存|发送|删除|写|发布/.test(tool)),
          complete: risks.every((risk) => risk.control && risk.evidence)
        };
      },
      formatResult(result) {
        return [
          `资产：${result.assets.join("；")}`,
          "",
          "信任边界：",
          ...result.boundaries.map((item, index) => `${index + 1}. ${item}`),
          "",
          "风险 | 等级 | 攻击面 | 控制 | 检测证据",
          ...result.risks.map((risk) => `${risk.id} ${risk.name} | ${risk.severity} | ${risk.surface} | ${risk.control} | ${risk.evidence}`),
          "",
          `高风险项：${result.highRisks}`,
          `人工确认：${result.approvalRequired ? "检测到写入或发布类工具，必须设置" : "当前工具未命中高影响写操作，仍需按权限复核"}`,
          `最大步骤：${result.maxSteps}`,
          `验收：${result.complete ? "每项风险均包含控制和检测证据" : "威胁模型字段不完整"}`
        ].join("\n");
      }
    }
  ];

  data.governanceStages = [
    {
      id: "requirements", label: "需求与治理", rmf: "Govern / Map",
      objective: "明确用途、责任、风险容忍度、利益相关者和是否应该使用 AI。",
      assets: ["用途声明", "责任矩阵", "风险登记", "禁用场景"],
      stakeholders: ["产品负责人", "技术负责人", "受影响者代表", "安全与治理人员"],
      failures: ["目标只写“提高智能化”", "没有最终责任人", "默认所有场景都可自动化"],
      questions: ["谁会直接或间接受影响？", "错误是否可逆、可申诉？", "什么条件下停止或不采用 AI？"],
      evidence: ["用途与禁用场景", "利益相关者清单", "go/no-go 记录", "人工监督方案"],
      controls: ["按影响分级", "高风险用途人工最终决定", "定期治理复审", "明确退役负责人"],
      frameworks: ["NIST Govern", "NIST Map", "UNESCO 人权与比例原则"]
    },
    {
      id: "data", label: "数据", rmf: "Map / Measure",
      objective: "控制数据来源、授权、代表性、敏感信息、污染和生命周期。",
      assets: ["原始数据", "标签", "切分清单", "向量索引", "数据卡"],
      stakeholders: ["数据主体", "采集与标注团队", "数据工程师", "隐私负责人"],
      failures: ["未来信息泄漏", "样本群体缺失", "敏感字段进入日志", "来源和许可不明"],
      questions: ["数据为何收集、可保存多久？", "哪些群体和条件未覆盖？", "删除如何传播到派生数据？"],
      evidence: ["Dataset Card", "授权与来源记录", "切片统计", "敏感信息扫描", "删除日志"],
      controls: ["数据最小化", "分级访问", "去重与污染检查", "版本化和保留期限"],
      frameworks: ["NIST Map / Measure", "UNESCO 隐私与公平", "OWASP 数据与模型投毒"]
    },
    {
      id: "training", label: "训练与选模", rmf: "Measure",
      objective: "让训练过程、候选选择、第三方组件和资源消耗可复现、可比较。",
      assets: ["训练代码", "依赖", "模型权重", "配置", "实验日志"],
      stakeholders: ["模型开发者", "平台工程师", "安全审查者", "模型供应商"],
      failures: ["只保留最好结果", "候选模型来源不明", "不同种子波动被忽略", "恶意或脆弱依赖进入构建"],
      questions: ["能否从空环境复现？", "候选版本为何晋级？", "第三方权重和依赖如何校验？"],
      evidence: ["run ID", "依赖锁与产物哈希", "多次运行分布", "模型清单与许可证"],
      controls: ["实验追踪", "隔离加载第三方产物", "固定版本与校验和", "晋级门槛"],
      frameworks: ["NIST Measure", "OWASP Supply Chain", "Model Card"]
    },
    {
      id: "evaluation", label: "评估", rmf: "Measure / Manage",
      objective: "同时评价任务质量、切片、公平、安全、鲁棒、延迟、成本和无答案行为。",
      assets: ["测试集", "红队样本", "评价指标", "人工评价指南", "评估报告"],
      stakeholders: ["评价人员", "领域专家", "安全团队", "受影响者代表"],
      failures: ["只报告平均准确率", "测试集反复调参", "自动评价未经校准", "高影响切片样本不足"],
      questions: ["指标是否对应真实用途？", "哪些风险尚未测量？", "失败样本和切片是否公开记录？"],
      evidence: ["多维指标表", "样本量与区间", "错误图库", "红队结果", "残余风险"],
      controls: ["冻结测试集", "独立复核", "分组与无答案测试", "发布前风险接受"],
      frameworks: ["HELM 多维评估", "NIST Measure", "OECD 公平与稳健"]
    },
    {
      id: "integration", label: "集成", rmf: "Manage",
      objective: "隔离不可信输入和模型输出，限制 RAG、工具、Agent 与下游系统权限。",
      assets: ["系统指令", "工具凭据", "检索资料", "应用状态", "输出接口"],
      stakeholders: ["应用开发者", "工具所有者", "内容与安全运营", "最终用户"],
      failures: ["文档注入改变工具行为", "输出直接进入解释器", "Agent 权限过大", "循环没有预算"],
      questions: ["每条边界上什么内容不可信？", "谁真正执行工具？", "哪些动作必须人工确认？"],
      evidence: ["威胁模型", "权限矩阵", "注入测试", "schema 校验日志", "Agent trace"],
      controls: ["指令数据隔离", "最小权限", "输出校验与编码", "步骤/时间/费用上限"],
      frameworks: ["OWASP LLM Top 10 2025", "NIST GenAI Profile"]
    },
    {
      id: "deployment", label: "部署", rmf: "Manage",
      objective: "用版本、smoke test、灰度、停止条件和回滚包控制发布影响。",
      assets: ["生产模型", "接口契约", "容器", "配置", "回滚版本"],
      stakeholders: ["发布工程师", "服务所有者", "值班人员", "业务负责人"],
      failures: ["latest 指向未知版本", "健康端点正常但预测错误", "只回滚权重不回滚预处理", "灰度没有停止条件"],
      questions: ["实际服务的是哪个不可变版本？", "回滚包是否已验证？", "哪些指标会自动停止发布？"],
      evidence: ["部署清单", "smoke test", "canary 对照", "审批与变更记录", "回滚演练"],
      controls: ["固定 artifact hash", "分阶段流量", "自动停止门槛", "一键回滚与降级"],
      frameworks: ["NIST Manage", "Google SRE", "Model Registry"]
    },
    {
      id: "operations", label: "监控与事件响应", rmf: "Govern / Measure / Manage",
      objective: "持续发现漂移、错误、滥用和社会影响，并完成控制、恢复和复盘。",
      assets: ["请求日志", "模型指标", "告警", "事件记录", "反馈与申诉"],
      stakeholders: ["值班与运营", "模型团队", "安全响应", "治理负责人", "受影响用户"],
      failures: ["只有 HTTP 监控", "告警没有负责人", "事件时模型版本不可追踪", "修复后不更新文档"],
      questions: ["最早的异常信号是什么？", "如何限制影响并保存证据？", "何时回滚、停用或通知利益相关者？"],
      evidence: ["延迟/流量/错误/饱和度", "漂移与切片指标", "事件时间线", "恢复验证", "复盘改进项"],
      controls: ["分级告警与 runbook", "人工接管", "事件保存与通知", "复盘后更新风险登记"],
      frameworks: ["NIST Govern / Measure / Manage", "Google SRE", "OECD 问责"]
    }
  ];

  data.governanceRisks = [
    { id: "LLM01", title: "Prompt Injection", stage: "integration", severity: "高", signal: "指令冲突、异常工具参数、跨文档访问尝试", control: "隔离不可信内容、权限过滤、应用侧工具校验" },
    { id: "LLM02", title: "敏感信息泄露", stage: "data", severity: "高", signal: "输出或日志出现敏感字段模式", control: "最小化、脱敏、访问控制、保留与删除" },
    { id: "LLM03", title: "供应链", stage: "training", severity: "高", signal: "哈希变化、来源未知、依赖或模型扫描异常", control: "固定来源与 revision、完整性校验、隔离晋级" },
    { id: "LLM05", title: "不安全输出处理", stage: "integration", severity: "高", signal: "模型输出直接进入 HTML、数据库、Shell 或写操作", control: "schema、参数化、上下文编码和人工确认" },
    { id: "LLM06", title: "过度授权", stage: "integration", severity: "高", signal: "工具访问超出任务资源范围或发生未确认写入", control: "最小权限、资源白名单、可撤销确认和回滚" },
    { id: "LLM10", title: "资源失控", stage: "operations", severity: "中", signal: "token、循环、并发、费用或延迟持续增长", control: "预算、配额、终止条件、熔断和容量告警" }
  ];

  data.lessons.push(...lessons.map((item, index) => ({ ...item, order: data.lessons.length + index })));
  data.labs.push(...labs);
  for (const moduleId of ["AI-10", "AI-11"]) {
    const module = data.modules.find((item) => item.id === moduleId);
    if (module) module.status = "open";
  }
  const knownReferences = new Set(data.references.map((item) => item.id));
  Object.values(refs).forEach((reference) => {
    if (!knownReferences.has(reference.id)) data.references.push(reference);
  });
}());
