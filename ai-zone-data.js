(function () {
  "use strict";

  const references = {
    aima: { id: "AI-S001", title: "Artificial Intelligence: A Modern Approach", provider: "AIMA", url: "https://aima.cs.berkeley.edu/" },
    mit6034: { id: "AI-S002", title: "MIT 6.034 Artificial Intelligence", provider: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/" },
    cs188: { id: "AI-S004", title: "Introduction to Artificial Intelligence", provider: "Berkeley CS188", url: "https://inst.eecs.berkeley.edu/~cs188/" },
    mit1806: { id: "AI-S006", title: "Linear Algebra", provider: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" },
    harvardStat110: { id: "AI-S007", title: "Introduction to Probability", provider: "Harvard Stat 110", url: "https://projects.iq.harvard.edu/stat110/home" },
    googleMl: { id: "AI-S009", title: "Machine Learning Crash Course", provider: "Google for Developers", url: "https://developers.google.com/machine-learning/crash-course" },
    pytorch: { id: "AI-S016", title: "Learn the Basics", provider: "PyTorch", url: "https://pytorch.org/tutorials/beginner/basics/intro.html" },
    nist: { id: "AI-S026", title: "AI Risk Management Framework", provider: "NIST", url: "https://www.nist.gov/itl/ai-risk-management-framework" }
  };

  const modules = [
    ["AI-00", "AI 全景与问题定义", "◉", "起步", 7, "识别 AI 问题、证据与边界", []],
    ["AI-01", "数学直觉", "∑", "基础", 7, "用向量、概率与梯度描述学习过程", ["AI-00"]],
    ["AI-02", "数据与实验边界", "▦", "基础", 7, "构建可追溯数据集并避免数据泄漏", ["AI-00"]],
    ["AI-03", "经典机器学习", "⌁", "基础", 7, "训练并比较分类、回归与聚类基线", ["AI-01", "AI-02"]],
    ["AI-04", "评估、误差与泛化", "✓", "基础", 7, "选择指标并解释模型为何失败", ["AI-02", "AI-03"]],
    ["AI-05", "神经网络与深度学习", "⌘", "进阶", 7, "跟踪完整训练循环和张量形状", ["AI-01", "AI-04"]],
    ["AI-06", "计算机视觉", "▣", "进阶", 7, "建立视觉基线并分析错误样本", ["AI-05"]],
    ["AI-07", "自然语言处理", "文", "进阶", 7, "比较文本特征、表示学习与任务评估", ["AI-05"]],
    ["AI-08", "Transformer 与大语言模型", "T", "进阶", 7, "解释注意力、预训练、微调与解码", ["AI-07"]],
    ["AI-09", "RAG 与 Agent 应用", "↗", "工程", 7, "构建带引用、可评估的 AI 应用链路", ["AI-08"]],
    ["AI-10", "MLOps 与交付", "⚙", "工程", 7, "版本化模型并完成部署、监控和回滚", ["AI-04", "AI-05"]],
    ["AI-11", "安全、伦理与治理", "盾", "工程", 7, "用风险框架审查数据、模型与应用", ["AI-02", "AI-08"]]
  ].map(([id, title, icon, level, lessonCount, outcome, prerequisites], index) => ({
    id, title, icon, level, lessonCount, outcome, prerequisites, index,
    duration: lessonCount * 45,
    status: index < 2 ? "open" : "planned"
  }));

  const lessonBlueprints = [
    {
      id: "ai-00-overview", number: "AI-00-01", moduleId: "AI-00", title: "AI 到底包含什么", type: "概念", duration: 40,
      summary: "从智能体、搜索、推理、学习与生成五条线看清 AI 全貌。",
      why: "如果把 AI 只理解成聊天模型，就会混淆算法、模型、产品和能力边界，也很难判断一个问题究竟需要规则、搜索还是机器学习。",
      objectives: ["区分 AI、机器学习、深度学习和生成式 AI", "把真实任务拆成输入、目标、约束和评价", "识别搜索、推理、学习和生成的不同证据"],
      concepts: [["人工智能", "研究和构建能感知、推理、学习或行动的系统"], ["机器学习", "从数据与目标函数中估计规律，而不是逐条写出全部规则"], ["模型", "把输入映射为预测、分数或生成结果的参数化结构"], ["智能体", "观察环境、选择动作并根据目标影响环境的系统"]],
      deepDive: ["AI 是问题领域，不是单一算法。经典 AI 包含搜索、约束满足、知识表示、概率推理、规划和学习。", "机器学习位于 AI 之内；深度学习又是机器学习的一类方法。生成式 AI 描述输出新内容的能力，不等于所有 AI。", "判断方案时先写任务定义：输入是什么、输出是什么、错误成本是多少、怎样收集反馈。没有评价标准，模型分数就没有业务含义。"],
      workedExamples: [{ title: "垃圾邮件识别", steps: ["输入：邮件文本和元数据", "目标：输出垃圾邮件概率", "约束：漏判与误判成本不同", "证据：独立测试集上的 Precision、Recall 和错误样本"] }],
      misconceptions: ["把自动化都叫 AI：固定条件分支可以是普通程序。", "把流畅回答当作理解：输出形式不是事实正确性的证据。"],
      limits: ["任务边界、数据质量和评价标准比模型名称更早决定可行性。", "模型在训练分布外的行为通常缺少保证。"],
      practice: ["为相册去重、导航规划、客服问答分别判断更适合规则、搜索还是学习。", "任选一个 AI 产品，写出输入、输出、反馈和三个失败条件。"],
      refs: [references.aima, references.mit6034]
    },
    {
      id: "ai-00-rules-vs-learning", number: "AI-00-02", moduleId: "AI-00", title: "规则系统与学习系统", type: "实验", duration: 50, labId: "ai-lab-rules-vs-learning",
      summary: "用同一批文本比较关键词规则与统计分类器，观察泛化差异。",
      why: "规则容易解释和快速上线，学习系统能从样本中估计权重。二者没有绝对优劣，关键是输入变化、维护成本与错误代价。",
      objectives: ["解释规则、特征、权重和阈值", "比较训练样本内与新样本上的行为", "根据约束选择规则、模型或混合方案"],
      concepts: [["规则", "由人明确写出的条件与动作"], ["特征", "供模型使用的可测量输入表示"], ["权重", "模型对不同特征贡献的数值估计"], ["泛化", "在未参与训练的数据上保持有效的能力"]],
      deepDive: ["规则系统的行为来自代码：命中指定关键词就输出某类。它确定、可审计，但同义词和语境变化会快速增加规则数量。", "统计模型把文本转为特征，再依据带标签样本估计特征权重。模型不是记住一句话，而是在当前表示下寻找能降低错误的参数。", "混合系统常用规则处理硬约束，用模型处理模糊判断，再把低置信结果交给人工。"],
      workedExamples: [{ title: "售后消息路由", steps: ["规则：包含‘退款’直接进入售后队列", "模型：根据多个词的权重输出售后分数", "阈值：分数至少 0.6 才自动路由", "复核：统计误路由与漏路由样本"] }],
      misconceptions: ["规则一定落后：边界明确的合规条件通常更适合规则。", "模型会自动理解语义：模型只利用表示中可见且训练中学到的信号。"],
      limits: ["小样本实验只演示机制，不代表生产效果。", "训练数据带有偏差时，统计模型会学习这些偏差。"],
      practice: ["运行实验并加入一个规则未覆盖的同义词。", "改变模型阈值，记录误报和漏报如何变化。"],
      refs: [references.googleMl, references.aima]
    },
    {
      id: "ai-00-problem-framing", number: "AI-00-03", moduleId: "AI-00", title: "把需求写成可验证的 AI 问题", type: "概念", duration: 45,
      summary: "从模糊愿望得到目标变量、数据单元、基线和验收指标。",
      why: "“做一个智能推荐”不是可执行问题；明确预测对象、决策时点和成功标准后，才能判断数据与模型是否匹配。",
      objectives: ["写出样本单位与目标变量", "建立无需训练的最小基线", "区分离线指标和实际结果"],
      concepts: [["样本单位", "数据集中一行或一次观测代表的对象"], ["目标变量", "模型试图预测或生成的结果"], ["基线", "用于比较的简单可复现方案"], ["验收指标", "决定方案是否达到使用要求的量化标准"]],
      deepDive: ["问题定义依次回答：谁在何时根据什么信息做什么决定。时间点很重要，因为预测时不可使用未来信息。", "先建立多数类、平均值、规则或人工流程基线。复杂模型只有稳定超过基线并满足成本约束才有价值。", "离线准确率描述固定数据集表现；线上转化、处理时间和人工复核率才接近产品结果，两者必须建立映射。"],
      workedExamples: [{ title: "预测课程是否需要复习", steps: ["样本：一次课程学习记录", "预测时点：完成课程后的第二天", "可用输入：得分、用时、历史复习次数", "目标：七天内复测是否答对", "基线：知识检查低于 4 分就推荐复习"] }],
      misconceptions: ["先选最强模型再找问题。", "只要准确率高就能上线。"], limits: ["目标变量可能只是业务目标的代理。", "历史标签可能来自不一致的人类判断。"],
      practice: ["把“用 AI 提高学习效率”改写成包含人、时点、输入、输出和指标的定义。", "为该问题写一个无需模型的基线。"], refs: [references.googleMl, references.aima]
    },
    {
      id: "ai-00-model-training-inference", number: "AI-00-04", moduleId: "AI-00", title: "模型、参数、训练与推理", type: "概念", duration: 45,
      summary: "沿数据流理解模型怎样学习参数，又怎样对新输入计算输出。",
      why: "训练与推理使用同一个模型结构，但目标、状态和资源不同；混淆两者会导致数据泄漏、错误评估和部署失败。",
      objectives: ["区分模型结构、参数和超参数", "描述训练循环的四个核心步骤", "说明推理为何不应更新参数"],
      concepts: [["参数", "训练过程中从数据估计的数值"], ["超参数", "训练前选择的配置，如学习率"], ["损失函数", "把预测误差转换为可优化标量的函数"], ["推理", "固定参数后对新输入计算输出"]],
      deepDive: ["模型结构规定允许怎样计算，参数决定当前映射。线性模型 y=wx+b 中，w 与 b 是参数。", "训练循环是 forward 得到预测、计算 loss、求梯度、更新参数。每轮更新后用新参数处理后续 batch。", "推理阶段加载已训练参数并关闭参数更新。部署还要固定预处理、标签映射和版本，否则同一参数也会产生不同结果。"],
      workedExamples: [{ title: "房价线性模型", steps: ["输入 x=面积", "模型 ŷ=wx+b", "损失=(ŷ-y)²", "训练调整 w、b", "推理只代入新面积计算 ŷ"] }],
      misconceptions: ["模型文件就是完整产品：还缺预处理、运行环境和输出解释。", "训练数据越多一定越好：相关性、覆盖范围与标签质量同样关键。"], limits: ["低训练损失不代表对新数据有效。", "推理输出通常仍需阈值、规则或人工决策。"],
      practice: ["用一句话分别描述训练输入、训练输出、推理输入和推理输出。", "列出部署模型时除参数外必须固定的四项内容。"], refs: [references.googleMl, references.pytorch]
    },
    {
      id: "ai-00-learning-types", number: "AI-00-05", moduleId: "AI-00", title: "监督、无监督与强化学习", type: "概念", duration: 45,
      summary: "根据反馈形式区分三类学习设定，而不是死记算法名单。",
      why: "学习类型由可获得的反馈决定；标签、结构和奖励信号不同，数据收集、评价与风险也不同。",
      objectives: ["按反馈信号判断学习类型", "区分分类、回归、聚类与序列决策", "识别反馈延迟和奖励设计问题"],
      concepts: [["监督学习", "从输入与目标标签的配对中学习"], ["无监督学习", "在没有目标标签时寻找结构或表示"], ["强化学习", "智能体通过动作、奖励与环境交互学习策略"], ["标签", "监督任务中期望模型预测的目标值"]],
      deepDive: ["监督学习直接比较预测与标签，常见任务是分类和回归。", "无监督学习没有唯一正确标签，聚类质量需要结合稳定性、业务含义和下游效果判断。", "强化学习的反馈是随动作到来的奖励，动作会改变后续状态，因此还要处理探索、延迟回报和策略风险。"],
      workedExamples: [{ title: "三种课程应用", steps: ["预测考试分数：监督回归", "按学习行为分群：无监督聚类", "按连续反馈安排下一题：序列决策，可建模为强化学习"] }],
      misconceptions: ["无监督等于没有评价。", "有用户点击就一定适合强化学习。"], limits: ["类别名称不会自动保证问题设定合理。", "离线数据中的奖励不一定能可靠评估新策略。"],
      practice: ["为三个现实任务标注学习类型和反馈来源。", "说明把点赞作为奖励可能导致的两个偏差。"], refs: [references.aima, references.cs188]
    },
    {
      id: "ai-00-evidence", number: "AI-00-06", moduleId: "AI-00", title: "AI 结论需要什么证据", type: "评估", duration: 45,
      summary: "从基线、数据切分、指标、误差分析到可复现实验建立证据链。",
      why: "单个演示、训练集得分和主观感觉都容易高估能力；可靠结论需要独立数据、明确比较和失败样本。",
      objectives: ["区分演示、实验和真实部署证据", "解释训练集、验证集和测试集职责", "记录可复现实验所需信息"],
      concepts: [["验证集", "用于选择方案和超参数的数据"], ["测试集", "方案冻结后用于最终估计的数据"], ["误差分析", "按失败类型检查模型行为而不只看平均分"], ["可复现性", "保留数据、代码、参数和环境以重复得到结果"]],
      deepDive: ["训练集用于拟合参数，验证集用于选择方案，测试集应尽量减少反复查看，否则也会被间接拟合。", "总体指标可能掩盖子群差异。应按类别、来源、时间段与置信度检查错误样本。", "实验记录至少包含数据版本、切分规则、代码版本、随机种子、配置、指标和运行产物。"],
      workedExamples: [{ title: "识别夸大结论", steps: ["声明：模型准确率 98%", "追问：在哪个数据集、怎样切分", "比较：多数类或现有系统是多少", "检查：哪些类别最差、是否重复样本", "复现：能否用固定版本重新运行"] }],
      misconceptions: ["测试一次高分就是稳定结果。", "平均准确率足以代表所有用户。"], limits: ["离线测试集仍是现实环境的近似。", "随机性和依赖版本会造成结果波动。"],
      practice: ["为一个模型结论列出五项缺失证据。", "设计包含至少三个子群的误差分析表。"], refs: [references.googleMl, references.nist]
    },
    {
      id: "ai-00-lifecycle-risk", number: "AI-00-07", moduleId: "AI-00", title: "AI 系统生命周期与风险", type: "安全", duration: 50,
      summary: "把数据、训练、评估、部署、监控和退役放进同一风险视图。",
      why: "AI 风险不只来自模型。数据授权、接口滥用、监控缺失和错误自动化都可能让离线表现良好的系统产生实际伤害。",
      objectives: ["画出 AI 系统端到端生命周期", "区分技术指标与使用情境风险", "为高影响决策设计人工控制和回滚"],
      concepts: [["生命周期", "从问题定义到系统退役的连续管理过程"], ["分布漂移", "上线输入或输入与目标关系发生变化"], ["人工监督", "由人审查、覆盖或停止系统决策的机制"], ["回滚", "在异常时恢复到已知可靠版本"]],
      deepDive: ["生命周期从用途与影响对象开始，随后才是数据、模型、验证和部署。每一阶段都要明确负责人和证据。", "上线后监控输入分布、性能代理、延迟、成本和人工反馈；告警必须对应处理动作。", "风险随用途变化：同一个错误率用于娱乐推荐与医疗分诊，后果和控制要求完全不同。"],
      workedExamples: [{ title: "学习推荐系统检查", steps: ["用途：推荐复习内容，不自动改变成绩", "数据：仅使用明确说明的学习记录", "上线：先小范围观察", "监控：推荐采纳率与误推荐反馈", "回滚：关闭模型并恢复规则基线"] }],
      misconceptions: ["模型通过测试后风险工作就结束。", "加一个免责声明就能代替技术和流程控制。"], limits: ["风险框架提供流程，不会替团队替代具体判断。", "无法测量的影响也应记录为不确定性。"],
      practice: ["为一个 AI 功能画六阶段生命周期并标注负责人。", "写出三个触发停止服务或回滚的条件。"], refs: [references.nist, references.aima]
    },
    {
      id: "ai-01-vectors-tensors", number: "AI-01-01", moduleId: "AI-01", title: "标量、向量、矩阵与张量", type: "数学", duration: 55,
      summary: "用 shape 和轴追踪 AI 代码中的数据，而不是只背线性代数术语。",
      why: "模型的大部分输入、参数和中间结果都以张量表示；shape 错误是最常见且最可观察的 AI 编程问题之一。",
      objectives: ["区分标量、向量、矩阵和高阶张量", "读取 shape 并解释每个轴", "检查矩阵乘法的维度条件"],
      concepts: [["标量", "单个数值，shape 可记为 ()"], ["向量", "一维有序数值，shape 为 (d,)"], ["矩阵", "二维数值表，shape 为 (m,n)"], ["张量", "多维数组的统称"]],
      deepDive: ["shape 描述每个轴的长度。例如 32 张 28×28 灰度图像可表示为 (32,1,28,28)，各轴依次是 batch、channel、height、width。", "矩阵 A 的 shape 为 (m,n)，B 为 (n,p) 时，AB 的 shape 是 (m,p)；中间维 n 必须一致。", "转置、reshape、广播都会改变解释。数值数量相同不代表语义正确，必须同时标注轴的含义。"],
      workedExamples: [{ title: "两条样本的线性层", steps: ["输入 X shape=(2,3)", "权重 W shape=(3,4)", "XW shape=(2,4)", "偏置 b shape=(4,) 广播到两条样本", "输出保留 batch 轴"] }],
      misconceptions: ["张量一定是三维以上：标量、向量和矩阵也可视为张量。", "reshape 后数值相同所以意义相同。"], limits: ["shape 检查能发现结构错误，不能发现标签错位。", "不同框架可能采用不同图像轴顺序。"],
      practice: ["为 64 条、每条 10 个特征的 batch 写 shape。", "判断 (5,3) 与 (3,2) 相乘后的 shape。"], refs: [references.mit1806, references.pytorch]
    },
    {
      id: "ai-01-functions-loss", number: "AI-01-02", moduleId: "AI-01", title: "函数、预测与损失", type: "数学", duration: 50,
      summary: "把模型视作函数，用损失衡量单个预测和目标之间的差异。",
      why: "训练并不是模型“自己变聪明”，而是在给定表示和损失下寻找较小误差的参数。损失定义错误会让优化忠实地追逐错误目标。",
      objectives: ["把输入、参数、预测写成函数关系", "手算均方误差", "区分训练损失与业务指标"],
      concepts: [["函数", "把允许的输入映射到输出的规则"], ["预测值", "模型对当前输入计算出的结果"], ["均方误差", "回归中平方误差的平均值"], ["目标函数", "优化过程试图最小化或最大化的量"]],
      deepDive: ["线性预测可写成 ŷ=wx+b。输入 x 和参数 w、b 共同决定输出。", "均方误差 MSE=(1/n)Σ(ŷ-y)²，平方会放大较大误差且保证非负。", "损失用于优化，业务指标用于判断用途是否达标。二者可以相关，但通常不是同一个量。"],
      workedExamples: [{ title: "手算两条样本", steps: ["预测 [2,5]，目标 [3,3]", "误差 [-1,2]", "平方 [1,4]", "MSE=(1+4)/2=2.5"] }],
      misconceptions: ["损失为零才算可用。", "训练损失持续下降就代表测试性能持续提升。"], limits: ["MSE 对异常值敏感。", "可微损失往往只是最终业务目标的代理。"],
      practice: ["计算预测 [1,4,6] 与目标 [2,4,3] 的 MSE。", "说明垃圾邮件任务为什么不直接用准确率作为训练损失。"], refs: [references.googleMl, references.mit1806]
    },
    {
      id: "ai-01-gradient-step", number: "AI-01-03", moduleId: "AI-01", title: "梯度下降的一步更新", type: "实验", duration: 60, labId: "ai-lab-gradient-step",
      summary: "用单参数线性模型手算并运行一次 forward、loss、gradient 和 update。",
      why: "看懂一步更新后，训练循环不再是黑盒；学习率、梯度方向和损失变化都能用具体数字检查。",
      objectives: ["解释梯度的方向与大小", "按 w←w-η∇L 更新参数", "用新参数重新计算损失并判断更新是否有效"],
      concepts: [["梯度", "损失对参数变化率组成的向量"], ["学习率", "每次沿负梯度方向移动的步长系数"], ["前向计算", "由输入和参数得到预测与损失"], ["参数更新", "根据优化规则产生下一组参数"]],
      deepDive: ["设单样本 x=2、y=6，模型 ŷ=wx，损失 L=(ŷ-y)²。w=1 时 ŷ=2，L=16。", "dL/dw=2(wx-y)x，因此当前梯度是 2×(2-6)×2=-16。", "学习率 η=0.1 时，新参数 w=1-0.1×(-16)=2.6；新预测 5.2，新损失 0.64。一步后损失下降，但学习率过大仍可能越过最低点并发散。"],
      workedExamples: [{ title: "完整数字链", steps: ["w=1, x=2, y=6", "ŷ=2", "L=16", "gradient=-16", "w_new=2.6", "L_new=0.64"] }],
      misconceptions: ["梯度本身就是更新量：还要乘学习率并取负方向。", "每一步损失都必须下降：batch 噪声和复杂优化中可能短暂上升。"], limits: ["单参数二次函数只是机制示例。", "真实训练还涉及 batch、正则化、数值稳定性和停止条件。"],
      practice: ["把学习率改为 0.01 和 0.5，比较新损失。", "将目标 y 改为 -2，先预测梯度符号再运行。"], refs: [references.googleMl, references.pytorch]
    }
  ];

  function buildQuiz(lesson) {
    const conceptNames = lesson.concepts.map(([name]) => name);
    const questions = [
      ["本课首先要解决的核心问题是什么？", [lesson.objectives[0], "记住所有产品名称", "只追求更大的参数量", "跳过数据与评价"], 0, "目标必须回到本课列出的可验证能力。"],
      [`“${conceptNames[0]}”在本课中的含义更接近哪一项？`, [lesson.concepts[0][1], lesson.concepts[1][1], "任何自动运行的软件", "只在论文中使用的名词"], 0, "应按当前课程给出的操作性定义判断。"],
      [`“${conceptNames[1]}”与“${conceptNames[0]}”的主要区别是什么？`, [lesson.concepts[1][1], "二者永远完全相同", "前者只表示界面", "后者一定需要联网"], 0, "区别来自两者在问题链路中的职责。"],
      ["下列哪种做法最能形成可靠证据？", ["记录输入、步骤、输出并按验收条件复查", "只保留一次成功截图", "只引用模型名称", "忽略失败样本"], 0, "可复查证据需要上下文、过程、结果和判断标准。"],
      ["遇到与预期不一致的结果时，较合理的第一步是什么？", ["核对输入、假设、版本与可观察输出", "立刻换成最大模型", "删除错误样本", "只调高阈值"], 0, "先验证链路事实，再决定修改方向。"],
      ["对本课知识边界的正确理解是哪项？", [lesson.limits[0], "本课方法适用于任何数据与用途", "只要运行成功就代表可上线", "引用资料可以替代实验"], 0, "课程明确列出的限制也是结论的一部分。"]
    ];
    return questions.map(([question, options, answer, explanation], index) => {
      const rotation = (lesson.id.length + index) % options.length;
      const rotatedOptions = [...options.slice(rotation), ...options.slice(0, rotation)];
      return { question, options: rotatedOptions, answer: (answer - rotation + options.length) % options.length, explanation };
    });
  }

  const lessons = lessonBlueprints.map((lesson, index) => ({
    ...lesson,
    level: modules.find((module) => module.id === lesson.moduleId)?.level || "基础",
    status: "open",
    order: index,
    environment: lesson.labId ? "浏览器" : "无需代码",
    checkpoint: ["能用自己的话解释本课核心概念", "能完成数值例子或任务拆解", "能指出至少一个适用限制"],
    quiz: buildQuiz(lesson),
    references: lesson.refs
  }));

  const labs = [
    {
      id: "ai-lab-rules-vs-learning", number: "AI-LAB-01", lessonId: "ai-00-rules-vs-learning", title: "规则分类器与统计模型对比", environment: "浏览器 JavaScript", duration: 15,
      goal: "在固定小样本上比较关键词规则和朴素统计权重的输出，观察未登录规则的新词如何影响判断。",
      inputs: "四条已标注训练短句与四条测试短句。所有数据只在浏览器内计算。",
      evidence: ["两种方法对每条测试文本的标签", "统计模型的正负分数", "规则与模型不一致的样本"],
      run(config = {}) {
        const threshold = Number.isFinite(Number(config.threshold)) ? Number(config.threshold) : 0;
        const train = [["退款 订单", 1], ["退货 售后", 1], ["课程 学习", 0], ["笔记 复习", 0]];
        const tests = ["申请退款", "订单售后", "想要退费", "学习课程"];
        const weights = Object.create(null);
        train.forEach(([text, label]) => text.split(/\s+/).forEach((word) => { weights[word] = (weights[word] || 0) + (label ? 1 : -1); }));
        return tests.map((text) => {
          const rule = /退款|退货|售后/.test(text) ? "售后" : "普通";
          const score = Object.entries(weights).reduce((sum, [word, weight]) => sum + (text.includes(word) ? weight : 0), 0);
          return { text, rule, model: score > threshold ? "售后" : "普通", score };
        });
      }
    },
    {
      id: "ai-lab-gradient-step", number: "AI-LAB-02", lessonId: "ai-01-gradient-step", title: "梯度下降一步更新", environment: "浏览器 JavaScript", duration: 10,
      goal: "跟踪单参数模型的一次预测、损失、梯度和参数更新，并比较更新前后的损失。",
      inputs: "默认 x=2、y=6、w=1、learningRate=0.1，可修改学习率。",
      evidence: ["旧参数与新参数", "梯度的符号和大小", "更新前后的损失"],
      python: "x, y, w, lr = 2.0, 6.0, 1.0, 0.1\npred = w * x\nloss = (pred - y) ** 2\ngrad = 2 * (pred - y) * x\nnew_w = w - lr * grad\nprint(loss, grad, new_w, (new_w * x - y) ** 2)",
      run(config = {}) {
        const x = Number.isFinite(Number(config.x)) ? Number(config.x) : 2;
        const y = Number.isFinite(Number(config.y)) ? Number(config.y) : 6;
        const w = Number.isFinite(Number(config.w)) ? Number(config.w) : 1;
        const learningRate = Number.isFinite(Number(config.learningRate)) ? Number(config.learningRate) : 0.1;
        const prediction = w * x;
        const loss = (prediction - y) ** 2;
        const gradient = 2 * (prediction - y) * x;
        const newWeight = w - learningRate * gradient;
        const newPrediction = newWeight * x;
        const newLoss = (newPrediction - y) ** 2;
        return { x, y, learningRate, oldWeight: w, prediction, loss, gradient, newWeight, newPrediction, newLoss, improved: newLoss < loss };
      }
    }
  ];

  window.aiZoneData = {
    modules,
    lessons,
    labs,
    papers: [],
    references: Object.values(references)
  };
}());
