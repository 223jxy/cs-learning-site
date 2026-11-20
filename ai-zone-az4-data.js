(function () {
  "use strict";

  const data = window.aiZoneData;
  if (!data) throw new Error("AI 专区基础数据尚未加载");

  const refs = {
    attention: { id: "AI-S019", title: "Attention Is All You Need", provider: "arXiv", url: "https://arxiv.org/abs/1706.03762" },
    bert: { id: "AI-S020", title: "BERT: Pre-training of Deep Bidirectional Transformers", provider: "arXiv", url: "https://arxiv.org/abs/1810.04805" },
    gpt3: { id: "AI-S021", title: "Language Models are Few-Shot Learners", provider: "arXiv", url: "https://arxiv.org/abs/2005.14165" },
    instructgpt: { id: "AI-S022", title: "Training language models to follow instructions with human feedback", provider: "arXiv", url: "https://arxiv.org/abs/2203.02155" },
    rag: { id: "AI-S023", title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", provider: "arXiv", url: "https://arxiv.org/abs/2005.11401" },
    hfCourse: { id: "AI-S018", title: "Hugging Face LLM Course", provider: "Hugging Face", url: "https://huggingface.co/learn/llm-course/chapter1/1" },
    hfGeneration: { id: "AI-S024", title: "Text generation strategies", provider: "Hugging Face", url: "https://huggingface.co/docs/transformers/generation_strategies" },
    cs224n: { id: "AI-S017", title: "Stanford CS224N", provider: "Stanford", url: "https://web.stanford.edu/class/cs224n/" },
    jsonSchema: { id: "AI-S025", title: "JSON Schema: Creating your first schema", provider: "JSON Schema", url: "https://json-schema.org/learn/getting-started-step-by-step" },
    anthropicAgents: { id: "AI-S027", title: "Building effective agents", provider: "Anthropic", url: "https://www.anthropic.com/engineering/building-effective-agents" },
    owaspGenAI: { id: "AI-S028", title: "OWASP Top 10 for LLM Applications", provider: "OWASP", url: "https://genai.owasp.org/llm-top-10/" },
    datasheets: { id: "AI-S029", title: "Datasheets for Datasets", provider: "arXiv", url: "https://arxiv.org/abs/1803.09010" }
  };

  function makeQuiz(item) {
    const raw = [
      ["本课首先要建立哪项能力？", [item.objectives[0], "只记住产品名称", "只比较参数量", "跳过输入输出检查"], 0, "目标应落到能够解释、运行或验收的能力。"],
      [`“${item.concepts[0][0]}”在本课中指什么？`, [item.concepts[0][1], item.concepts[1][1], "只用于页面展示的标签", "任何自动运行的程序"], 0, "应按本课给出的操作性定义判断。"],
      [`关于“${item.concepts[1][0]}”，哪项准确？`, [item.concepts[1][1], "它与输入数据无关", "它自动保证事实正确", "它只在训练结束后使用"], 0, "该概念在明确的数据或应用链路中承担职责。"],
      ["哪项最符合可靠的 LLM 应用证据？", ["记录输入、配置、中间结果、引用与失败样本", "只保存一次流畅回答", "只比较模型名称", "忽略无答案样本"], 0, "生成结果需要结合过程证据和失败边界复查。"],
      ["结果异常时应优先检查什么？", ["输入契约、上下文、检索结果、停止条件和权限", "立即增加自主循环", "删除所有低分样本", "只提高 temperature"], 0, "先沿可观察链路定位问题，再调整模型或流程。"],
      ["本课方法的适用边界是哪项？", [item.limits[0], "在所有任务上都无需评价", "回答流畅即可直接执行", "上下文越长越可靠"], 0, "限制条件是课程结论的一部分。"]
    ];
    return raw.map(([question, options, answer, explanation], index) => {
      const rotation = (item.id.length + index * 3) % options.length;
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
      type: config.type || "概念",
      status: "open",
      environment: config.labId ? "浏览器" : "无需代码",
      objectives: config.objectives,
      concepts: config.concepts,
      deepDive: config.deepDive,
      workedExamples: [{ title: config.exampleTitle, steps: config.exampleSteps }],
      misconceptions: config.misconceptions,
      limits: config.limits,
      practice: config.practice,
      checkpoint: config.checkpoint || ["能准确解释四个核心概念", "能沿示例追踪输入、操作与输出", "能指出一个失败条件并给出检查证据"],
      references: config.references,
      labId: config.labId || ""
    };
    item.quiz = makeQuiz(item);
    return item;
  }

  const lessons = [
    lesson("AI-08", 1, {
      slug: "tokens-tokenizers-context", title: "Token、Tokenizer、词表与上下文窗口", summary: "沿文本到 token ID 的链路理解模型真正接收的输入。",
      why: "模型处理的是 token 序列而不是人眼看到的字符；分词、特殊 token、截断和词表版本都会改变输入与成本。",
      objectives: ["追踪文本到 token ID 的转换", "解释词表与 embedding 行的对应关系", "计算上下文窗口中的输入与输出预算"],
      concepts: [["Token", "tokenizer 划分后交给模型处理的离散单元"], ["Tokenizer", "把文本编码为 token ID，并把输出 ID 解码为文本的规则与词表"], ["词表", "token 与整数 ID 的固定映射"], ["上下文窗口", "一次模型计算可处理的输入与生成 token 总预算"]],
      deepDive: ["子词 tokenizer 在常见片段和未知词之间折中；一个英文单词、中文短语或标点都可能被拆成不同数量的 token。", "embedding 矩阵第 i 行对应词表 ID=i。替换词表或移动 ID 顺序会让同一模型参数读取错误向量。", "上下文预算通常包含系统指令、对话历史、检索片段、工具结果和待生成 token；超出后必须截断、摘要或拒绝继续。"],
      exampleTitle: "预算一轮问答", exampleSteps: ["窗口上限 4096 token", "系统指令 300", "历史消息 1200", "RAG 片段 1600", "给输出预留 700", "剩余用户输入预算约 296 token"],
      misconceptions: ["一个汉字固定等于一个 token。", "上下文窗口越大，模型就会自动使用所有证据。"], limits: ["token 数依赖具体 tokenizer 和版本。", "窗口允许放入信息，不保证模型能正确检索或遵循。"],
      practice: ["用任意公开 tokenizer 比较中文、英文和代码的 token 数。", "为 8192 token 窗口写一份包含输出预留的预算表。"], references: [refs.hfCourse, refs.cs224n]
    }),
    lesson("AI-08", 2, {
      slug: "qkv-attention", title: "Query、Key、Value 与缩放点积注意力", summary: "用小矩阵手算相似度、softmax 权重与加权输出。",
      why: "Attention 的核心不是模糊的“关注”，而是由 QKᵀ 相似度、mask、softmax 和 V 加权求和组成的可检查计算。",
      objectives: ["写出 scaled dot-product attention 公式", "手算一个 query 对多个 key 的权重", "检查 mask 与每行权重和"],
      concepts: [["Query", "当前位置用来检索相关信息的向量"], ["Key", "每个位置供 query 匹配的索引向量"], ["Value", "匹配后按权重聚合的内容向量"], ["缩放点积注意力", "softmax(QKᵀ/√dₖ)V 的矩阵计算"]],
      deepDive: ["Q、K、V 通常由同一输入经过不同线性投影得到。QKᵀ shape=(query_length,key_length)，每一行是一条 query 对所有 key 的分数。", "除以 √dₖ 可减小维度增大时点积绝对值过大、softmax 过度饱和的问题。", "softmax 后每行非负且和为 1，再对 V 求加权和；因果或 padding mask 应在 softmax 前把禁止位置设为极小值。"],
      exampleTitle: "单个 query", exampleSteps: ["q=[1,0]，k1=[1,0]，k2=[0,1]", "点积分数 [1,0]", "除以 √2 得 [0.707,0]", "softmax 约为 [0.670,0.330]", "若 v1=[2,0]、v2=[0,1]，输出约 [1.340,0.330]"],
      misconceptions: ["Attention 权重就是完整的人类可解释因果。", "Value 也直接参与 QKᵀ 匹配。"], limits: ["权重只描述当前层头的数值混合。", "长序列的标准 self-attention 计算与存储成本随长度平方增长。"],
      practice: ["运行小矩阵实验并核对每行权重和。", "给第三个 key 加 mask，重新说明输出变化。"], references: [refs.attention, refs.cs224n], labId: "ai-lab-attention-matrix", type: "实验", duration: 70
    }),
    lesson("AI-08", 3, {
      slug: "multihead-position-residual", title: "Multi-head、位置编码与残差连接", summary: "理解多个注意力子空间怎样组合，并用位置与残差维持序列和梯度。",
      why: "Self-attention 本身对 token 排列缺少顺序信息；多头、位置表示、残差和归一化共同构成可训练 Transformer block。",
      objectives: ["解释多头拆分与拼接 shape", "说明为何需要位置表示", "追踪残差连接两侧 shape"],
      concepts: [["Multi-head Attention", "在多个投影子空间并行计算注意力后拼接"], ["位置编码", "向表示注入 token 顺序或相对位置的信息"], ["残差连接", "把子层输入加到子层输出的捷径"], ["Layer Normalization", "按特征维规范化单个样本表示的操作"]],
      deepDive: ["若 d_model=512、8 个头，则常见每头 d_head=64；各头输出拼接回 512，再经输出投影。", "没有位置表示时，self-attention 对输入置换主要按同样方式置换输出，难以区分先后角色。", "残差要求相加两侧 shape 相同，提供直接信息与梯度路径；pre-norm 与 post-norm 的归一化位置会影响训练稳定性。"],
      exampleTitle: "8 头 shape 跟踪", exampleSteps: ["输入 (batch,seq,512)", "投影 Q/K/V", "reshape 为 (batch,8,seq,64)", "每头输出 (batch,8,seq,64)", "拼接回 (batch,seq,512)", "与原输入做残差相加"],
      misconceptions: ["每个头都会稳定学习一种固定语言关系。", "位置编码等同于把位置整数直接当 token。"], limits: ["多头增加表示通道，也增加投影和缓存成本。", "位置方案对可外推长度的支持不同。"],
      practice: ["计算 d_model=768、12 头时每头维度。", "检查一个残差相加失败的 shape 例子。"], references: [refs.attention, refs.hfCourse]
    }),
    lesson("AI-08", 4, {
      slug: "encoder-decoder-masks", title: "Encoder、Decoder 与 Causal Mask", summary: "按可见信息和输出方式区分编码器、解码器及编码器-解码器结构。",
      why: "BERT、GPT 和原始 Transformer 的训练目标与可见上下文不同；结构名称必须回到 mask、输入和输出任务理解。",
      objectives: ["区分 encoder-only、decoder-only 与 encoder-decoder", "画出 causal mask", "解释 teacher forcing 中标签位移"],
      concepts: [["Encoder", "让每个位置结合双向上下文形成表示的模块"], ["Decoder", "按已知前缀预测后续 token 的自回归模块"], ["Causal Mask", "禁止当前位置看到未来 token 的上三角屏蔽"], ["Cross-attention", "decoder query 对 encoder 输出 key/value 的注意力"]],
      deepDive: ["Encoder-only 模型适合表示、分类和抽取；decoder-only 模型按前缀生成；encoder-decoder 常用于翻译、摘要等条件生成。", "长度 4 的 causal mask 允许第 t 行只看 0..t；训练可并行计算所有位置，但 mask 保证每个位置不读取未来标签。", "自回归训练常把输入右移，使用前一个真实 token 预测下一个；推理时新 token 来自模型自己的历史输出。"],
      exampleTitle: "四 token 因果矩阵", exampleSteps: ["第 1 个位置只看自己", "第 2 个位置看前两个", "第 3 个位置看前三个", "第 4 个位置看全部四个", "softmax 前屏蔽未来列"],
      misconceptions: ["Decoder 在训练时也必须逐 token 串行计算。", "Encoder 一定不能用于生成系统。"], limits: ["结构类别描述计算方式，不直接给出能力保证。", "自回归误差会在长生成中累积。"],
      practice: ["画出 5×5 causal mask。", "为分类、翻译、续写分别选择基本结构并说明理由。"], references: [refs.attention, refs.bert, refs.hfCourse]
    }),
    lesson("AI-08", 5, {
      slug: "pretraining-objectives", title: "Masked LM、Next-token 与规模化预训练", summary: "比较遮盖预测和下一个 token 预测怎样从大规模语料建立通用参数。",
      why: "预训练目标决定模型能看到什么、预测什么；参数量和数据量只是条件，数据组成、优化和评价同样决定能力与偏差。",
      objectives: ["区分 masked LM 与 next-token prediction", "解释预训练与下游适配的关系", "识别训练语料与知识时效边界"],
      concepts: [["Masked Language Modeling", "遮盖部分 token 并利用双向上下文恢复它们的目标"], ["Next-token Prediction", "根据前缀预测下一个 token 的自回归目标"], ["预训练", "在大规模通用数据上先学习可迁移参数的过程"], ["上下文学习", "通过输入中的指令或示例改变当前预测而不更新参数"]],
      deepDive: ["BERT 随机遮盖输入的一部分并预测原 token，得到双向表示；GPT 类模型按前缀最小化下一 token 的交叉熵。", "预训练损失衡量 token 预测，不等同于事实正确、推理可靠或符合用户意图；这些能力需要单独评价。", "模型参数压缩训练数据中的统计规律，不能被当作可查询且持续更新的数据库；训练截止后事实可能过时。"],
      exampleTitle: "同一句话的两种目标", exampleSteps: ["原句：网络使用协议传输数据", "Masked LM：网络使用 [MASK] 传输数据", "Next-token：输入“网络使用”，目标“协议”", "二者产生不同可见上下文", "下游任务仍需独立测试"],
      misconceptions: ["预训练模型会逐条保存全部训练文档。", "预训练 loss 更低就保证所有任务更可靠。"], limits: ["训练数据来源、去重和时间范围会影响输出。", "基准提升不代表真实使用中每个切片都提升。"],
      practice: ["为一句话分别构造 masked LM 与 next-token 样本。", "列出模型知识可能过时的三个场景。"], references: [refs.bert, refs.gpt3, refs.hfCourse]
    }),
    lesson("AI-08", 6, {
      slug: "decoding-strategies", title: "Greedy、Temperature、Top-k 与 Top-p 解码", summary: "从 logits 到 token 概率，比较确定选择和受限采样。",
      why: "同一模型参数在不同解码配置下会产生不同文本；质量、重复、随机性和可复现性必须结合任务调整。",
      objectives: ["把 logits 转为温度缩放概率", "区分 greedy、top-k 与 top-p", "设计停止条件和可复现配置"],
      concepts: [["Greedy Decoding", "每一步选择当前概率最高 token 的策略"], ["Temperature", "在 softmax 前缩放 logits 以改变分布尖锐程度"], ["Top-k", "只在概率最高的 k 个 token 中采样"], ["Top-p", "在累计概率达到 p 的最小候选集合中采样"]],
      deepDive: ["temperature=T 时使用 softmax(logits/T)；T 较低使分布更尖锐，T 较高增加随机性，但不会创造模型未学到的事实。", "top-k 固定候选数量，top-p 随分布动态变化；两者可组合，但配置越多越需要记录和测试。", "停止由 EOS、最大新 token、停止字符串、工具结果或业务规则共同决定；随机采样还应记录随机种子和模型版本。"],
      exampleTitle: "三 token 分布", exampleSteps: ["logits=[2,1,0]", "greedy 总选第一个 token", "降低 temperature 后第一项更占优势", "top-k=2 排除第三项", "top-p 按累计概率动态保留候选"],
      misconceptions: ["temperature=0 是所有框架通用且完全相同的实现。", "提高随机性可以修复事实错误。"], limits: ["不同运行后端可能有数值与采样差异。", "解码策略只控制输出选择，不验证内容。"],
      practice: ["固定模型与 prompt，对比两组解码配置。", "为 JSON 输出设计停止与重试条件。"], references: [refs.hfGeneration, refs.gpt3]
    }),
    lesson("AI-08", 7, {
      slug: "instruction-alignment-boundaries", title: "指令微调、偏好优化与能力边界", summary: "理解基础模型怎样适配指令，以及流畅、偏好与真实之间的差别。",
      why: "指令跟随来自额外示范与偏好训练，但它优化的是训练中定义的行为；幻觉、时效、冲突指令和分布外输入仍需系统控制。",
      objectives: ["区分预训练、监督指令微调和偏好优化", "解释偏好标签与奖励模型链路", "为幻觉和越权设计外部控制"],
      concepts: [["指令微调", "用指令与期望回答样本继续训练模型"], ["偏好优化", "利用成对偏好或奖励信号调整输出行为"], ["幻觉", "输出形式流畅但缺乏可靠依据或与事实冲突"], ["对齐边界", "训练偏好、系统规则和真实使用目标之间仍可能存在的差距"]],
      deepDive: ["InstructGPT 流程先做监督微调，再收集输出排序训练奖励模型，最后用强化学习优化策略；后续方法可能使用不同偏好目标。", "人类偏好数据受标注指南、群体、语言和任务分布影响；被偏好不等同于事实正确。", "高风险应用应把引用、工具权限、输入隔离、人工确认、日志和停止条件放在模型外部，而不是依赖一句提示词。"],
      exampleTitle: "带资料的事实问答", exampleSteps: ["先检索当前资料", "只把相关片段放入上下文", "要求输出引用 ID", "程序检查引用是否存在", "证据不足时返回明确状态", "执行动作前请求人工确认"],
      misconceptions: ["指令微调后模型会始终遵循任意指令。", "偏好分数等同于事实准确率。"], limits: ["对齐方法依赖标注分布和评价模型。", "模型内部知识有时效、来源与可追溯性限制。"],
      practice: ["把流畅度、帮助性、事实性拆成三个独立指标。", "为自动发邮件场景写出权限与人工确认边界。"], references: [refs.instructgpt, refs.owaspGenAI]
    }),
    lesson("AI-09", 1, {
      slug: "prompt-contracts", title: "Prompt 作为输入契约", summary: "把角色、任务、上下文、约束和输出格式写成可测试接口。",
      why: "Prompt 不是神秘咒语，而是应用传给模型的输入契约；模糊字段、冲突指令和缺失示例会把不确定性推给模型。",
      objectives: ["把模糊需求改写成输入输出契约", "区分指令、数据与示例", "为 prompt 建立版本和测试集"],
      concepts: [["Prompt", "传给模型的指令、上下文、示例与待处理输入"], ["输入契约", "规定必需字段、边界、格式和错误处理的接口约定"], ["Few-shot 示例", "在上下文中展示少量输入输出对以约束当前任务"], ["Prompt Injection", "不可信内容试图改变原有指令或诱导越权的攻击与失效模式"]],
      deepDive: ["稳定契约应明确任务、允许使用的资料、不得推断的内容、输出 schema 和证据不足处理；模型名称不应代替这些定义。", "检索文档、网页和用户输入都应视为数据，不因包含“忽略此前指令”等文本就提升为系统指令。", "Prompt 变更要配固定测试样本，比较正确性、格式合规、拒答/无答案、成本和延迟，而不是凭单次观感。"],
      exampleTitle: "课程摘要契约", exampleSteps: ["输入字段：title、content、audience", "任务：提取 3 个要点", "约束：只依据 content", "输出：JSON 数组", "证据不足：返回 status=insufficient", "测试空正文、超长正文和恶意内嵌指令"],
      misconceptions: ["Prompt 越长越可靠。", "只要写“不要被注入”就完成了防护。"], limits: ["Prompt 无法单独提供权限隔离和事实验证。", "模型或上下文变化后应重新回归测试。"],
      practice: ["把“帮我分析文档”改成完整契约。", "设计三条 prompt injection 测试输入。"], references: [refs.anthropicAgents, refs.owaspGenAI]
    }),
    lesson("AI-09", 2, {
      slug: "structured-output-validation", title: "Structured Output、Schema 校验与重试", summary: "用结构约束、解析、业务校验和有限重试稳定模型输出。",
      why: "看起来像 JSON 不代表可被程序安全消费；类型、必填字段、枚举、范围和跨字段关系都必须由代码验证。",
      objectives: ["写出对象 schema 的必填字段与类型", "区分语法校验和业务校验", "设计有限重试与失败回退"],
      concepts: [["Structured Output", "遵守机器可解析结构的模型输出"], ["Schema", "描述字段、类型、必填项、枚举和嵌套结构的规则"], ["业务校验", "在结构合法后检查范围、引用、权限和跨字段约束"], ["有限重试", "在明确错误类型下限制次数并保留失败证据的再次调用"]],
      deepDive: ["JSON parse 只检查语法；schema 继续检查 required、type、enum、additionalProperties 等；业务层还要验证 courseId 是否存在、引用是否可访问。", "重试提示应包含具体校验错误，保持原输入和版本，限制次数；无限重试会增加成本并隐藏系统性缺陷。", "最终失败应进入可观察状态，例如 validation_error，并保留原始输出摘要、错误路径和人工处理入口。"],
      exampleTitle: "学习建议对象", exampleSteps: ["要求 status 为 ok 或 insufficient", "courseIds 必须是字符串数组", "confidence 限制 0..1", "解析 JSON", "运行 schema 校验", "再检查每个 courseId 是否存在"],
      misconceptions: ["JSON.parse 成功就表示数据可信。", "出错时一直重试最终总会正确。"], limits: ["结构正确不代表内容事实正确。", "严格 schema 可能需要随业务版本迁移。"],
      practice: ["为引用回答写一个 JSON Schema。", "列出语法、schema、业务三层各一个错误。"], references: [refs.jsonSchema, refs.anthropicAgents]
    }),
    lesson("AI-09", 3, {
      slug: "embeddings-chunks-indexes", title: "Embedding、相似度、切块与索引", summary: "把文档拆成可检索单元，并理解向量相似度只是候选证据排序信号。",
      why: "RAG 的上限首先受文档、切块、元数据和检索覆盖影响；embedding 并不会把错误文档自动变成可靠知识。",
      objectives: ["解释 query/document embedding 与相似度", "设计有重叠和元数据的切块", "区分索引构建与在线检索"],
      concepts: [["Embedding", "把文本映射到可比较的稠密向量表示"], ["切块", "把长文档拆成检索与上下文可用片段的过程"], ["向量索引", "支持近邻候选搜索的数据结构或服务"], ["元数据过滤", "按来源、日期、权限或类型预先限制候选集合"]],
      deepDive: ["向量检索常按余弦、点积或距离排序；分数只在特定模型、索引和语料中有意义，阈值需要用标注查询校准。", "切块过小会丢上下文，过大会稀释主题并占用窗口；可按标题、段落和语义边界切分，并保留文档 ID、位置和版本。", "索引构建要固定解析器、embedding 模型与版本；文档更新和删除必须同步索引，否则会返回过时或无权访问内容。"],
      exampleTitle: "课程文档切块", exampleSteps: ["按二级标题切分", "长段落再按句子窗口切分", "相邻块保留少量重叠", "写入 courseId、section、updatedAt", "查询前按可见课程过滤", "取 top-k 候选"],
      misconceptions: ["相似度最高的片段一定能回答问题。", "切块越多，检索效果一定越好。"], limits: ["embedding 对语言、领域和时间有覆盖边界。", "近邻检索可能漏掉关键词精确匹配的重要证据。"],
      practice: ["为一篇 3000 字文档设计切块与元数据。", "比较关键词检索和向量检索各自擅长的查询。"], references: [refs.rag, refs.hfCourse]
    }),
    lesson("AI-09", 4, {
      slug: "rag-retrieve-rerank-cite", title: "RAG：检索、重排、生成与引用链路", summary: "构建从问题到候选证据、上下文、答案和引用的完整链路。",
      why: "RAG 的价值不只是把文档塞给模型，而是让答案可回到具体来源，并在缺少证据时稳定停止。",
      objectives: ["画出 retrieve-rerank-generate-cite 链路", "区分检索候选与最终上下文", "验证答案引用是否支持对应陈述"],
      concepts: [["RAG", "把外部检索结果作为生成条件的知识增强链路"], ["Retriever", "根据查询从语料取回候选片段的组件"], ["Reranker", "使用更精细信号重新排序候选片段的组件"], ["引用链路", "把答案陈述连接到文档 ID、片段和版本的可追踪关系"]],
      deepDive: ["在线流程通常先做查询处理和权限过滤，再召回 top-k，随后重排、去重、压缩并构建上下文；生成只是链路后段。", "引用应来自实际传入模型的片段，并校验 ID、范围和版本。仅列一个相关链接，不证明它支持答案中的具体陈述。", "检索分数低、证据冲突或关键字段缺失时，应返回“证据不足”并展示已检查范围，而不是补写看似合理内容。"],
      exampleTitle: "本地课程问答", exampleSteps: ["问题：RAG 如何处理证据不足", "检索本地知识片段", "按 TF-IDF 分数排序", "只保留超过阈值的片段", "从片段抽取回答并附 [DOC-ID]", "无命中则返回证据不足"],
      misconceptions: ["接入 RAG 后模型就不会幻觉。", "引用数量越多，答案越可靠。"], limits: ["检索不到正确资料时，生成阶段没有可靠依据。", "引用存在仍需检查是否真正支持陈述。"],
      practice: ["运行本地 RAG 实验并查看引用片段。", "输入无关问题，验收是否返回证据不足。"], references: [refs.rag, refs.owaspGenAI], labId: "ai-lab-local-rag", type: "实验", duration: 75
    }),
    lesson("AI-09", 5, {
      slug: "rag-evaluation", title: "RAG 评估：命中、相关性与忠实度", summary: "把检索和生成分开评价，定位答案失败究竟发生在哪一段。",
      why: "只看最终回答会混淆检索漏召回、上下文噪声和生成不忠实；分层指标才能指导具体修复。",
      objectives: ["建立带标准证据的查询集", "分别评价检索命中和上下文相关性", "检查答案陈述对上下文的忠实度"],
      concepts: [["Recall@k", "标准相关片段是否出现在前 k 个候选中的比例"], ["上下文相关性", "传入生成阶段的片段对当前问题是否有用"], ["答案忠实度", "答案陈述是否能被给定上下文支持"], ["无答案评价", "系统在语料缺乏证据时能否正确返回证据不足"]],
      deepDive: ["先为每个查询标注可接受答案、相关文档 ID 和是否应无答案；否则自动分数缺少判断基准。", "检索 Recall@k 低应检查切块、查询、过滤和索引；Recall 高但回答差，应检查重排、上下文构造与生成约束。", "忠实度评价可以人工逐句核对，也可用模型辅助初筛，但评价模型本身要校准并抽样复核。"],
      exampleTitle: "四格故障定位", exampleSteps: ["相关文档未召回：检索问题", "召回但未进入上下文：重排或截断问题", "上下文正确但回答错误：生成忠实度问题", "无答案却强行回答：拒答阈值问题"],
      misconceptions: ["最终答案正确就说明检索链路正确。", "用另一个 LLM 打分即可替代人工标注。"], limits: ["自动评价模型也有偏差和提示敏感性。", "小测试集难覆盖真实查询分布变化。"],
      practice: ["制作 10 条含 3 条无答案的查询集。", "为每条错误标注失败发生的链路位置。"], references: [refs.rag, refs.anthropicAgents]
    }),
    lesson("AI-09", 6, {
      slug: "tools-workflows-agents", title: "Tool Calling、Workflow 与 Agent", summary: "区分模型提出工具调用、代码编排固定流程和模型动态决定下一步。",
      why: "把所有多步 LLM 应用都称为 Agent 会掩盖控制权、失败模式和成本；结构越动态，越需要终止、权限和观察机制。",
      objectives: ["区分 tool calling、workflow 和 agent", "选择顺序、路由、并行或 evaluator 模式", "定义工具输入输出与错误契约"],
      concepts: [["Tool Calling", "模型按声明的工具 schema 提议一次函数调用及参数"], ["Workflow", "由代码预先规定执行路径和步骤关系的系统"], ["Agent", "模型根据目标和观察动态决定过程与工具使用的系统"], ["Orchestration", "组织模型、工具、状态、分支和错误处理的应用控制层"]],
      deepDive: ["模型输出工具名和参数后，真正执行由应用完成；应用必须校验 schema、权限、超时和结果，再决定是否回传模型。", "步骤明确时优先固定 workflow，便于测试和预测；只有路径难以预先写定且收益覆盖成本时，才增加 agent 自主决策。", "常见 workflow 包括 prompt chaining、routing、parallelization、orchestrator-workers 和 evaluator-optimizer；每种模式有不同延迟与错误传播。"],
      exampleTitle: "课程资料更新", exampleSteps: ["固定流程：读取→校验→生成摘要→人工确认→保存", "工具：read_document、validate_schema、save_draft", "模型只能提议工具参数", "代码限制只读目录和保存目标", "任何写入都经过确认", "日志记录每一步输入输出摘要"],
      misconceptions: ["模型返回 function call 就已经执行了工具。", "Agent 总比 workflow 更智能、更适合生产。"], limits: ["动态路径增加成本、延迟和测试空间。", "工具描述清楚也不能替代应用侧权限控制。"],
      practice: ["把一个五步固定任务画成 workflow。", "列出何时值得把其中一步交给 agent 决策。"], references: [refs.anthropicAgents, refs.jsonSchema]
    }),
    lesson("AI-09", 7, {
      slug: "agent-state-permissions-observability", title: "Agent 状态、终止、权限与可观测性", summary: "把自主循环约束为有预算、有权限、有日志、可暂停和可复核的执行系统。",
      why: "Agent 的主要工程风险常来自循环失控、工具越权、状态污染和无法复盘，而不只是某一轮文本回答错误。",
      objectives: ["定义 run 状态机与终止条件", "按最小权限设计工具能力", "记录可复盘 trace 并设置人工确认点"],
      concepts: [["Agent 状态", "目标、历史观察、工具结果、预算和当前阶段的结构化记录"], ["终止条件", "完成、失败、超时、预算耗尽或请求人工确认等停止规则"], ["最小权限", "只授予完成当前任务所需的最小工具、数据和操作范围"], ["可观测性", "记录每步决策、调用、结果、耗时、成本和错误的能力"]],
      deepDive: ["run 应有明确状态机，如 queued→running→waiting_approval→completed/failed/cancelled；不要只靠自然语言判断是否结束。", "工具按读写、资源范围和影响分级。读取公开资料与发送邮件不是同一权限；高影响动作应要求明确参数和人工确认。", "trace 应记录模型/提示版本、工具参数摘要、结果状态、token/时间预算和终止原因，同时对敏感数据做最小化和脱敏。"],
      exampleTitle: "受控资料整理 Agent", exampleSteps: ["最大 8 步或 60 秒", "只读指定 docs 目录", "可写入 drafts 目录", "覆盖文件前进入 waiting_approval", "连续两次同类错误后停止", "最终输出引用和完整执行摘要"],
      misconceptions: ["设置最大轮数就覆盖了所有失控风险。", "完整记录所有原文最利于审计。"], limits: ["日志本身可能包含敏感信息，需控制保留和访问。", "人工确认点过多会降低效率，过少会扩大错误影响。"],
      practice: ["为能读文件和发邮件的 agent 做权限矩阵。", "写出完成、失败、超时和人工确认四类终止条件。"], references: [refs.anthropicAgents, refs.owaspGenAI]
    })
  ];

  function transpose(matrix) {
    return matrix[0].map((_, column) => matrix.map((row) => row[column]));
  }

  function multiply(left, right) {
    return left.map((row) => transpose(right).map((column) => row.reduce((sum, value, index) => sum + value * column[index], 0)));
  }

  function softmaxRows(matrix) {
    return matrix.map((row) => {
      const max = Math.max(...row);
      const exp = row.map((value) => Math.exp(value - max));
      const total = exp.reduce((sum, value) => sum + value, 0);
      return exp.map((value) => value / total);
    });
  }

  function tokenize(text) {
    const normalized = String(text || "").toLowerCase().replace(/[，。！？、；：“”‘’（）【】]/g, " ");
    const chunks = normalized.match(/[a-z0-9_-]+|[\u4e00-\u9fff]+/g) || [];
    const terms = [];
    chunks.forEach((chunk) => {
      if (/^[a-z0-9_-]+$/.test(chunk)) {
        terms.push(chunk);
        return;
      }
      if (chunk.length <= 2) terms.push(chunk);
      else {
        for (let index = 0; index < chunk.length - 1; index += 1) terms.push(chunk.slice(index, index + 2));
      }
    });
    return terms;
  }

  const localDocuments = [
    { id: "DOC-RAG-01", title: "RAG 链路", text: "RAG 先检索候选文档，再重排和构建上下文，最后生成答案并返回引用。引用必须指向实际使用的文档片段。" },
    { id: "DOC-RAG-02", title: "证据不足", text: "当检索分数低、资料冲突或关键证据缺失时，系统应返回证据不足，不应根据语言模型内部印象补写答案。" },
    { id: "DOC-RAG-03", title: "切块与索引", text: "文档切块应保留文档 ID、标题、位置、版本和权限元数据。切块过小会丢上下文，过大会稀释主题。" },
    { id: "DOC-RAG-04", title: "RAG 评估", text: "RAG 评估应分别检查检索 Recall、上下文相关性、答案忠实度和无答案处理，不能只看最终回答是否流畅。" },
    { id: "DOC-AGENT-01", title: "Workflow 与 Agent", text: "Workflow 的路径由代码预先规定；Agent 由模型根据目标和工具结果动态决定下一步。明确任务优先使用可预测的工作流。" },
    { id: "DOC-AGENT-02", title: "工具权限", text: "工具执行由应用完成。应用必须校验参数、权限、超时和结果，高影响写操作应设置人工确认与完整日志。" }
  ];

  function buildTfidfSearch(documents, query) {
    const documentTerms = documents.map((document) => tokenize(`${document.title} ${document.text}`));
    const vocabulary = [...new Set(documentTerms.flat())];
    const idf = Object.fromEntries(vocabulary.map((term) => {
      const frequency = documentTerms.filter((terms) => terms.includes(term)).length;
      return [term, Math.log((1 + documents.length) / (1 + frequency)) + 1];
    }));
    const queryTerms = tokenize(query);
    const queryCounts = Object.create(null);
    queryTerms.forEach((term) => { queryCounts[term] = (queryCounts[term] || 0) + 1; });
    const vectorize = (terms) => {
      const counts = Object.create(null);
      terms.forEach((term) => { counts[term] = (counts[term] || 0) + 1; });
      return vocabulary.map((term) => ((counts[term] || 0) / Math.max(1, terms.length)) * idf[term]);
    };
    const queryVector = vocabulary.map((term) => ((queryCounts[term] || 0) / Math.max(1, queryTerms.length)) * idf[term]);
    const cosine = (left, right) => {
      const dot = left.reduce((sum, value, index) => sum + value * right[index], 0);
      const leftNorm = Math.sqrt(left.reduce((sum, value) => sum + value * value, 0));
      const rightNorm = Math.sqrt(right.reduce((sum, value) => sum + value * value, 0));
      return dot / (leftNorm * rightNorm || 1);
    };
    return documents.map((document, index) => ({
      ...document,
      score: cosine(queryVector, vectorize(documentTerms[index])),
      matchedTerms: [...new Set(queryTerms.filter((term) => documentTerms[index].includes(term)))]
    })).sort((left, right) => right.score - left.score);
  }

  const labs = [
    {
      id: "ai-lab-attention-matrix", number: "AI-LAB-09", lessonId: "ai-08-qkv-attention", title: "Attention 小矩阵计算", environment: "浏览器 JavaScript", duration: 15,
      goal: "用固定 3×2 的 Q、K、V 真实计算缩放分数、逐行 softmax、权重和与最终输出。",
      inputs: "Q=[[1,0],[0,1],[1,1]]，K=[[1,0],[0,1],[1,1]]，V=[[1,0],[0,2],[3,1]]。",
      evidence: ["3×3 缩放分数矩阵", "每行和约等于 1 的 attention weights", "3×2 输出矩阵"],
      controls: [],
      code: "scores = Q @ K.T / sqrt(d_k)\nweights = softmax(scores, dim=-1)\noutput = weights @ V",
      run() {
        const q = [[1, 0], [0, 1], [1, 1]];
        const k = [[1, 0], [0, 1], [1, 1]];
        const v = [[1, 0], [0, 2], [3, 1]];
        const scale = Math.sqrt(k[0].length);
        const scores = multiply(q, transpose(k)).map((row) => row.map((value) => value / scale));
        const weights = softmaxRows(scores);
        const output = multiply(weights, v);
        return { q, k, v, scale, scores, weights, rowSums: weights.map((row) => row.reduce((sum, value) => sum + value, 0)), output };
      },
      formatResult(result) {
        const matrix = (rows) => rows.map((row) => `[${row.map((value) => value.toFixed(4)).join(", ")}]`).join("\n");
        return [`缩放因子 √dₖ = ${result.scale.toFixed(4)}`, "", "scores = QKᵀ/√dₖ", matrix(result.scores), "", "attention weights", matrix(result.weights), "", `每行权重和：${result.rowSums.map((value) => value.toFixed(6)).join("，")}`, "", "output = weights×V", matrix(result.output), "", "边界：权重展示一次前向中的数值混合，不等同于完整因果解释。"].join("\n");
      }
    },
    {
      id: "ai-lab-local-rag", number: "AI-LAB-10", lessonId: "ai-09-rag-retrieve-rerank-cite", title: "本地文档 RAG 与引用检查", environment: "浏览器 JavaScript", duration: 20,
      goal: "对内置文档执行 TF-IDF 检索，返回 top-k 片段、基于证据的回答和引用；低分查询返回证据不足。",
      inputs: "6 条本地课程文档；输入问题与 top-k。实验不调用外部模型或 API。",
      evidence: ["候选文档及相似度", "答案使用的引用 ID 和原文片段", "无关问题触发证据不足"],
      controls: [{ id: "query", label: "问题", value: "RAG 如何处理证据不足？", type: "text" }, { id: "topK", label: "Top-k", value: 3, type: "number" }],
      code: "chunks = load_local_documents()\nhits = tfidf_search(query, chunks, top_k=3)\nif hits[0].score < threshold:\n    return {status: 'insufficient', citations: []}\nreturn answer_from_evidence(hits)",
      run(config = {}) {
        const query = String(config.query || "").trim();
        const topK = Number.isFinite(config.topK) ? Math.max(1, Math.min(5, Math.round(config.topK))) : 3;
        const ranked = buildTfidfSearch(localDocuments, query).slice(0, topK);
        const usable = ranked.filter((item) => item.score >= 0.08 && item.matchedTerms.length);
        if (!query || !usable.length) {
          return { query, status: "insufficient", answer: "证据不足：本地文档中没有达到阈值的相关片段。", hits: ranked, citations: [] };
        }
        const citations = usable.slice(0, 2).map((item) => ({ id: item.id, title: item.title, excerpt: item.text, score: item.score }));
        return {
          query,
          status: "answered",
          answer: citations.map((item) => item.excerpt).join(" "),
          hits: ranked,
          citations
        };
      },
      formatResult(result) {
        return [`查询：${result.query || "（空）"}`, `状态：${result.status === "answered" ? "已找到证据" : "证据不足"}`, "", "Top-k：", ...result.hits.map((item) => `${item.id} | ${item.score.toFixed(4)} | 命中词：${item.matchedTerms.join(",") || "无"} | ${item.title}`), "", `答案：${result.answer}`, "", "引用：", ...(result.citations.length ? result.citations.map((item) => `[${item.id}] ${item.excerpt}`) : ["无"]), "", "边界：该实验只演示检索、阈值和引用链路，不包含真实生成模型。"].join("\n");
      }
    }
  ];

  data.anatomyModes = [
    {
      id: "data", label: "数据", title: "数据怎样进入模型", summary: "从一条样本到可计算张量，检查每一步语义和 shape。",
      steps: [
        { title: "样本", inputShape: "原始记录", outputShape: "1 条样本", operation: "读取文本、图像或结构化字段", evidence: "样本 ID、来源、标签和时间", mistake: "标签与输入错位，或使用预测时不可见的字段" },
        { title: "预处理", inputShape: "1 条样本", outputShape: "规范化样本", operation: "清洗、缩放、tokenize 或 resize", evidence: "处理配置、前后对照和异常计数", mistake: "训练与推理使用不同规则" },
        { title: "特征", inputShape: "规范化样本", outputShape: "(features) 或 (length)", operation: "映射到数值特征或 token ID", evidence: "词表版本、特征名、范围和未知项", mistake: "ID 映射变化或关键值被截断" },
        { title: "Batch", inputShape: "多条变长样本", outputShape: "(batch, length)", operation: "padding、mask、采样与拼批", evidence: "batch ID、真实长度和 mask", mistake: "padding 参与损失或采样分布失衡" },
        { title: "Tensor", inputShape: "(batch, length)", outputShape: "(batch, length, dim)", operation: "embedding 或数值转换并移动到设备", evidence: "dtype、device、shape 和数值范围", mistake: "dtype、轴顺序或设备不一致" }
      ]
    },
    {
      id: "training", label: "训练", title: "参数怎样被一次更新", summary: "沿 forward、loss、backward 和 optimizer step 检查训练闭环。",
      steps: [
        { title: "Forward", inputShape: "(batch, input_dim)", outputShape: "(batch, output_dim)", operation: "使用当前参数计算 logits 或预测", evidence: "中间 shape、激活范围和训练模式", mistake: "误用 eval 模式或输出 shape 错误" },
        { title: "Loss", inputShape: "预测 + 标签", outputShape: "标量", operation: "按任务目标计算并聚合误差", evidence: "逐样本损失、reduction 和基线", mistake: "标签类型、忽略索引或 reduction 错误" },
        { title: "Backward", inputShape: "标量 loss", outputShape: "每个参数的 gradient", operation: "沿计算图应用链式法则", evidence: "梯度范数、缺失梯度和异常值", mistake: "detach、梯度累积或数值爆炸" },
        { title: "Optimizer", inputShape: "参数 + gradient + 状态", outputShape: "新参数", operation: "按学习率和优化规则更新", evidence: "学习率、参数差值和优化器状态", mistake: "忘记 zero_grad 或更新了冻结参数" },
        { title: "Validate", inputShape: "新参数 + 验证集", outputShape: "验证指标", operation: "关闭更新并评估泛化", evidence: "验证损失、切片指标和 checkpoint", mistake: "用测试集调参或未恢复最佳参数" }
      ]
    },
    {
      id: "inference", label: "推理", title: "输入怎样成为最终输出", summary: "区分模型计算、概率或解码与业务决策。",
      steps: [
        { title: "输入", inputShape: "用户或系统输入", outputShape: "模型输入", operation: "校验、预处理并绑定版本", evidence: "请求 ID、schema、token 数和模型版本", mistake: "把不可信数据当指令或输入超预算" },
        { title: "Logits", inputShape: "(batch, length, dim)", outputShape: "(batch, classes/vocab)", operation: "使用冻结参数执行 forward", evidence: "shape、延迟、数值范围和设备", mistake: "预处理不一致或加载错误 checkpoint" },
        { title: "概率/解码", inputShape: "logits", outputShape: "类别、分数或 token", operation: "softmax、阈值或采样", evidence: "阈值、temperature、seed 和候选分布", mistake: "把未校准概率当真实置信度" },
        { title: "后处理", inputShape: "模型输出", outputShape: "结构化业务结果", operation: "schema 校验、映射标签和引用检查", evidence: "校验错误、引用 ID 和规则命中", mistake: "只验证 JSON 语法，不验证业务字段" },
        { title: "决策", inputShape: "结构化结果", outputShape: "展示或动作", operation: "应用权限、人工确认和回退", evidence: "最终动作、操作者和回滚记录", mistake: "让模型输出直接触发高影响操作" }
      ]
    },
    {
      id: "rag", label: "RAG", title: "问题怎样连接到外部证据", summary: "沿检索、重排、上下文、生成与引用定位错误。",
      steps: [
        { title: "问题", inputShape: "query string", outputShape: "规范化查询", operation: "解析意图、权限和检索条件", evidence: "原问题、改写查询和过滤条件", mistake: "查询改写丢失限定词或权限范围" },
        { title: "检索", inputShape: "query embedding/terms", outputShape: "top-k chunks", operation: "关键词、向量或混合召回", evidence: "文档 ID、分数、rank 和索引版本", mistake: "正确文档未召回或返回过期片段" },
        { title: "重排", inputShape: "候选 chunks", outputShape: "精选 chunks", operation: "相关性排序、去重和压缩", evidence: "重排前后名次与被删除原因", mistake: "关键证据被截断或重复片段挤占窗口" },
        { title: "上下文", inputShape: "精选 chunks", outputShape: "带来源的 prompt context", operation: "按预算拼接证据并隔离指令", evidence: "实际输入片段、token 数和来源标记", mistake: "把文档内指令当系统规则" },
        { title: "答案与引用", inputShape: "问题 + context", outputShape: "answer + citations", operation: "生成、schema 校验和逐条引用核对", evidence: "陈述到文档片段的映射", mistake: "引用相关但不支持陈述，或证据不足仍作答" }
      ]
    }
  ];

  data.papers = [
    {
      id: "paper-attention", title: "Attention Is All You Need", year: 2017,
      problem: "序列转换模型如何减少递归计算，并更直接地建模远距离依赖。",
      prerequisites: "矩阵乘法、softmax、RNN/encoder-decoder、attention 基础。",
      contributions: ["提出仅基于 attention 的 Transformer encoder-decoder 架构。", "用 multi-head attention、位置编码、残差与前馈子层组成可并行训练的 block。", "在论文机器翻译实验中取得有竞争力的质量与更高训练效率。"],
      mechanism: "输入表示加入位置编码；encoder 用双向 self-attention，decoder 用 masked self-attention 和 cross-attention，再经前馈网络输出。",
      answered: "论文实验支持 Transformer 在所测翻译任务上的效果、并行性和训练成本优势。",
      notAnswered: "没有证明 attention 权重等于因果解释，也没有回答后续超大语言模型的事实性、对齐和长期部署问题。",
      questions: ["公式 1 中为什么除以 √dₖ？", "多头注意力怎样拆分和拼接 shape？", "decoder mask 在哪一步加入？", "位置编码解决了 self-attention 的什么缺失？", "论文的效率结论基于哪些任务和硬件条件？"],
      url: refs.attention.url,
      citation: "Vaswani, A. et al. (2017). Attention Is All You Need. NeurIPS 30."
    },
    {
      id: "paper-bert", title: "BERT", year: 2018,
      problem: "如何预训练能同时利用左右上下文的通用语言表示，并低成本适配多种理解任务。",
      prerequisites: "Transformer encoder、tokenization、masked language modeling、分类与序列标注。",
      contributions: ["使用深层双向 Transformer encoder 预训练表示。", "采用 masked language model，并在原论文中同时使用 next sentence prediction。", "通过增加小型任务头微调多个 NLP 基准。"],
      mechanism: "把 [CLS]、句子 token 与 [SEP] 编码后送入双向 encoder；预训练恢复被遮盖 token，随后在标注任务上联合微调全部参数。",
      answered: "论文展示了该预训练与微调方案在当时多个语言理解基准上的提升。",
      notAnswered: "没有证明所有后续任务都需要 NSP，也没有覆盖生成式对话、长上下文和多语言公平性。",
      questions: ["双向上下文与 causal mask 的差别是什么？", "MLM 的输入与目标如何构造？", "[CLS] 表示在下游任务中怎样使用？", "预训练和微调阶段哪些参数被更新？", "论文消融实验怎样评价 NSP 和模型规模？"],
      url: refs.bert.url,
      citation: "Devlin, J. et al. (2018). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding. arXiv:1810.04805."
    },
    {
      id: "paper-gpt3", title: "Language Models are Few-Shot Learners", year: 2020,
      problem: "规模化自回归语言模型能否只通过 prompt 中的描述与少量示例完成多种任务，而不更新参数。",
      prerequisites: "decoder-only Transformer、next-token prediction、zero/one/few-shot、语言模型评价。",
      contributions: ["系统比较 175B 参数模型的 zero-shot、one-shot 与 few-shot 表现。", "展示上下文示例可在多任务中改变模型行为而无需梯度更新。", "记录规模增长带来的能力、偏差和若干失效现象。"],
      mechanism: "模型使用 decoder-only causal language modeling 预训练；推理时把任务描述和示例拼入上下文，继续预测答案 token。",
      answered: "论文回答了所测模型规模和基准中，上下文学习性能怎样随规模与示例变化。",
      notAnswered: "没有证明规模会消除幻觉、偏差或数据污染，也没有提供可追溯知识来源。",
      questions: ["few-shot 与 fine-tuning 的参数更新有何区别？", "上下文示例怎样组织？", "哪些任务随规模提升明显，哪些仍失败？", "论文如何讨论数据污染？", "偏差与能耗部分限制了哪些结论？"],
      url: refs.gpt3.url,
      citation: "Brown, T. B. et al. (2020). Language Models are Few-Shot Learners. NeurIPS 33."
    },
    {
      id: "paper-instructgpt", title: "InstructGPT", year: 2022,
      problem: "如何让预训练语言模型更好地遵循用户意图，并减少仅优化 next-token 目标造成的行为偏差。",
      prerequisites: "监督微调、偏好数据、奖励模型、强化学习与评价设计。",
      contributions: ["构建示范与成对排序数据用于指令跟随。", "形成 SFT、奖励模型、PPO 的三阶段训练流程。", "通过人工偏好与若干自动指标比较对齐模型和基础模型。"],
      mechanism: "先对人工示范做监督微调，再用输出排序训练奖励模型，最后通过 PPO 优化语言模型以提高预测奖励并约束偏离。",
      answered: "论文展示了该数据和训练流程在其标注者、提示分布和评价设置中的偏好改进。",
      notAnswered: "没有把偏好等同于事实真值，也没有解决所有语言、群体、越狱或长期自主行为问题。",
      questions: ["SFT、RM、PPO 三阶段各用什么数据？", "奖励模型的输入输出是什么？", "KL 约束为何加入优化？", "人工评价指标怎样定义？", "论文明确列出了哪些局限？"],
      url: refs.instructgpt.url,
      citation: "Ouyang, L. et al. (2022). Training language models to follow instructions with human feedback. NeurIPS 35."
    },
    {
      id: "paper-rag", title: "Retrieval-Augmented Generation", year: 2020,
      problem: "生成模型如何在回答知识密集问题时访问可更新的外部文档记忆。",
      prerequisites: "encoder-decoder、dense retrieval、向量相似度、生成概率与知识问答。",
      contributions: ["把预训练 seq2seq generator 与可微 dense retriever 组合。", "比较按整条序列或逐 token 边缘化检索文档的两种 RAG 形式。", "在论文所测知识密集任务中评估事实性和生成多样性。"],
      mechanism: "query encoder 检索文档向量，取 top-k 文档作为潜变量；generator 在问题与文档条件下生成，并对检索文档概率进行边缘化。",
      answered: "论文证明了其检索增强架构在指定开放域问答与生成任务中的收益。",
      notAnswered: "没有保证每个生成陈述都有可见引用，也没有解决权限过滤、文档注入和生产级索引更新。",
      questions: ["parametric 与 non-parametric memory 分别是什么？", "RAG-Sequence 与 RAG-Token 如何边缘化？", "retriever 和 generator 哪些部分共同训练？", "top-k 文档怎样进入生成概率？", "论文评价事实性的方法有哪些边界？"],
      url: refs.rag.url,
      citation: "Lewis, P. et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. NeurIPS 33."
    },
    {
      id: "paper-datasheets", title: "Datasheets for Datasets", year: 2018,
      problem: "数据集开发和使用中缺少标准化文档，导致动机、组成、采集、处理、用途和风险难以追溯。",
      prerequisites: "数据生命周期、采样、标注、隐私、偏差与模型评价。",
      contributions: ["提出类似电子元件 datasheet 的数据集文档框架。", "给出覆盖动机、组成、采集、预处理、分发、维护和用途的问题清单。", "把文档过程连接到透明度、责任和数据集反思。"],
      mechanism: "数据集创建者在生命周期各阶段回答结构化问题，并随数据版本维护文档，让使用者评估适用性和风险。",
      answered: "论文提供了系统文档框架和问题集合，并论证其对数据集沟通与责任实践的价值。",
      notAnswered: "文档本身不会自动消除偏差、验证全部声明或替代隐私、安全与合规控制。",
      questions: ["为什么借用 datasheet 类比？", "问题清单覆盖哪些生命周期阶段？", "谁应负责填写和维护？", "文档怎样影响数据集选择？", "作者讨论了哪些实施成本与限制？"],
      url: refs.datasheets.url,
      citation: "Gebru, T. et al. (2018). Datasheets for Datasets. arXiv:1803.09010."
    }
  ];

  data.lessons.push(...lessons.map((item, index) => ({ ...item, order: data.lessons.length + index })));
  data.labs.push(...labs);
  for (const moduleId of ["AI-08", "AI-09"]) {
    const module = data.modules.find((item) => item.id === moduleId);
    if (module) module.status = "open";
  }
  const knownReferences = new Set(data.references.map((item) => item.id));
  Object.values(refs).forEach((reference) => {
    if (!knownReferences.has(reference.id)) data.references.push(reference);
  });
}());
