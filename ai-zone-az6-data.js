(function () {
  "use strict";

  const data = window.aiZoneData;
  if (!data) throw new Error("AI 专区基础数据尚未加载");

  function reference(id, title, provider, url) {
    return data.references.find((item) => item.url === url) || { id, title, provider, url };
  }

  const refs = {
    mitLinear: reference("AI-S045", "Linear Transformations and their Matrices", "MIT OpenCourseWare", "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/positive-definite-matrices-and-applications/linear-transformations-and-their-matrices/"),
    d2lLinear: reference("AI-S046", "Linear Algebra", "D2L.ai", "https://d2l.ai/chapter_preliminaries/linear-algebra.html"),
    nistScale: reference("AI-S047", "Measures of Scale", "NIST/SEMATECH", "https://itl.nist.gov/div898/handbook/eda/section3/eda356.htm"),
    standardScaler: reference("AI-S048", "StandardScaler", "scikit-learn", "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html"),
    stat110: reference("AI-S007", "Introduction to Probability", "Harvard Stat 110", "https://projects.iq.harvard.edu/stat110/home"),
    d2lProbability: reference("AI-S049", "Probability and Statistics", "D2L.ai", "https://d2l.ai/chapter_preliminaries/probability.html"),
    mitCalculus: reference("AI-S050", "Partial Derivatives, Chain Rule and Gradient", "MIT OpenCourseWare", "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/"),
    pytorchNumerical: reference("AI-S051", "Numerical Accuracy", "PyTorch", "https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html"),
    sklearnRandom: reference("AI-S044", "Controlling randomness", "scikit-learn", "https://scikit-learn.org/stable/common_pitfalls.html#controlling-randomness")
  };

  function makeQuiz(item) {
    const raw = [
      ["本课首先要建立哪项能力？", [item.objectives[0], "只背公式名称", "只记住库函数", "跳过 shape 和数据范围"], 0, "数学直觉必须落到能解释、手算或检查代码。"],
      [`“${item.concepts[0][0]}”在本课中指什么？`, [item.concepts[0][1], item.concepts[1][1], "任何非零数值", "只用于画图的参数"], 0, "应按本课给出的操作性定义判断。"],
      [`关于“${item.concepts[1][0]}”，哪项准确？`, [item.concepts[1][1], "它自动证明因果关系", "它与输入单位无关", "它总能消除异常值影响"], 0, "公式成立还需要明确变量、数据和适用条件。"],
      ["哪项最符合可靠计算？", ["同时检查公式、shape、数值范围和边界样本", "只观察最终输出是否好看", "遇到差异就强制四舍五入", "只运行一次随机实验"], 0, "可靠结论需要能复查输入、过程和误差来源。"],
      ["结果异常时应先检查什么？", ["轴含义、单位、数据切分、dtype 和中间值", "立即增加模型层数", "删除所有极端样本", "只调大学习率"], 0, "先检查可观察的数学和数据链路。"],
      ["本课方法的边界是哪项？", [item.limits[0], "公式对所有数据都无条件成立", "标准化后所有分布都变成正态", "设置种子即可跨平台逐位相同"], 0, "数学工具的假设、估计误差和数值实现都属于结论边界。"]
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

  function lesson(sequence, config) {
    const item = {
      id: `ai-01-${config.slug}`,
      number: `AI-01-${String(sequence).padStart(2, "0")}`,
      moduleId: "AI-01",
      title: config.title,
      summary: config.summary,
      why: config.why,
      duration: config.duration || 60,
      level: "基础",
      type: "数学",
      status: "open",
      environment: "无需代码",
      objectives: config.objectives,
      concepts: config.concepts,
      deepDive: config.deepDive,
      workedExamples: [{ title: config.exampleTitle, steps: config.exampleSteps }],
      misconceptions: config.misconceptions,
      limits: config.limits,
      practice: config.practice,
      checkpoint: ["能准确解释四个核心概念", "能独立完成本课的小数值计算", "能指出公式、数据与数值实现中的一个失败条件"],
      references: config.references,
      labId: ""
    };
    item.quiz = makeQuiz(item);
    return item;
  }

  const lessons = [
    lesson(4, {
      slug: "dot-products-linear-maps",
      title: "点积、矩阵乘法与线性变换",
      summary: "把特征加权、相似度和线性层统一为输入向量经过矩阵得到新表示。",
      why: "线性模型、embedding 相似度和神经网络线性层都依赖点积与矩阵乘法；只会背 shape 仍不足以解释数值从哪里来。",
      objectives: ["手算向量点积并解释加权和", "追踪矩阵乘法每个输出元素的来源", "把矩阵理解为从输入空间到输出空间的线性变换"],
      concepts: [
        ["点积", "两个等长向量对应元素乘积之和，结果是标量"],
        ["矩阵乘法", "左矩阵每一行与右矩阵每一列做点积形成输出"],
        ["线性变换", "保持向量加法和标量乘法结构的映射，可由矩阵表示"],
        ["基", "描述向量坐标所依赖的一组方向；坐标变化不等于对象本身变化"]
      ],
      deepDive: [
        "输入 x=[x1,x2]、权重 w=[w1,w2] 时，x·w=x1w1+x2w2。它既可表示线性模型的加权分数，也可作为未归一化相似度。",
        "A shape=(m,n)、B shape=(n,p) 时，AB shape=(m,p)。输出 C[i,j] 是 A 第 i 行与 B 第 j 列的点积，中间维 n 必须一致。",
        "矩阵不仅是一张数表。乘以向量可缩放、旋转、投影或混合特征；偏置 b 使 y=Wx+b 成为仿射变换，而不是严格线性变换。"
      ],
      exampleTitle: "两特征映射到三维",
      exampleSteps: ["x=[2,-1]", "W=[[1,0,2],[0,3,-1]]", "第一项 2×1+(-1)×0=2", "第二项 2×0+(-1)×3=-3", "第三项 2×2+(-1)×(-1)=5", "输出 y=[2,-3,5]"],
      misconceptions: ["矩阵乘法是对应位置逐元素相乘。", "点积大就必然表示语义相同，忽略了向量长度和表示来源。"],
      limits: ["线性变换不能单独表达任意非线性边界。", "数值相似度只在具体表示和归一化规则下有意义。"],
      practice: ["手算 [1,2,3]·[4,0,-1]。", "判断 (4,3) 输入与 (3,2) 权重相乘后的 shape，并计算一个输出元素。"],
      references: [refs.mitLinear, refs.d2lLinear]
    }),
    lesson(5, {
      slug: "statistics-standardization",
      title: "均值、方差、协方差与标准化",
      summary: "用位置、离散程度和共同变化描述数据，并避免把缩放误当成修复数据。",
      why: "数据分布决定特征尺度、异常值影响和优化难度；训练集统计量若被测试集污染，还会造成隐蔽的数据泄漏。",
      objectives: ["手算均值、方差与标准差", "解释协方差的符号和单位", "只用训练集拟合标准化参数并复用到新数据"],
      concepts: [
        ["均值", "一组数值总和除以数量，用于描述中心位置"],
        ["方差", "数值与均值偏差平方的平均或样本估计，用于描述离散程度"],
        ["协方差", "两个变量相对各自均值的偏差乘积的平均或样本估计"],
        ["标准化", "按训练集统计量执行 z=(x-μ)/σ，使特征中心接近 0、尺度接近 1"]
      ],
      deepDive: [
        "对数据 [1,2,3]，均值为 2；总体方差为 ((-1)²+0²+1²)/3=2/3。样本方差常除以 n-1，必须记录使用哪一种定义。",
        "协方差为正表示两个变量倾向同向偏离均值，为负表示反向变化；其大小受单位影响，不能仅凭协方差比较不同量纲变量的关联强弱。",
        "StandardScaler 的 μ、σ 只在训练集 fit，再对验证、测试和线上输入 transform。先对全量数据求统计量会把测试分布信息泄漏给训练流程。"
      ],
      exampleTitle: "训练集标准化",
      exampleSteps: ["训练值 [10,20,30]，μ=20", "总体 σ≈8.165", "训练值转为约 [-1.225,0,1.225]", "测试值 40 使用同一 μ、σ", "得到约 2.449", "不能为测试值重新计算 μ、σ"],
      misconceptions: ["标准化会把任意数据变成正态分布。", "协方差为零就证明两个变量完全独立。"],
      limits: ["均值、方差和 StandardScaler 对异常值敏感。", "零方差特征无法缩放到单位方差，也通常不提供区分信息。"],
      practice: ["计算 [2,2,6] 的均值和总体方差。", "写出训练、验证、测试三份数据的正确 fit/transform 顺序。"],
      references: [refs.nistScale, refs.standardScaler]
    }),
    lesson(6, {
      slug: "probability-bayes-likelihood",
      title: "条件概率、贝叶斯公式与似然",
      summary: "区分事件概率、看到证据后的更新，以及固定数据时参数对数据的支持程度。",
      why: "分类概率、朴素贝叶斯、生成模型和最大似然都依赖条件概率；把 P(A|B) 与 P(B|A) 混淆会直接造成错误推断。",
      objectives: ["计算条件概率和联合概率", "用贝叶斯公式更新先验", "区分概率、似然与模型输出分数"],
      concepts: [
        ["条件概率", "在事件 B 已发生的条件下事件 A 的概率 P(A|B)=P(A∩B)/P(B)"],
        ["贝叶斯公式", "用似然和先验计算后验 P(A|B)=P(B|A)P(A)/P(B)"],
        ["似然", "固定观测数据后，把模型参数视为变量的数据支持函数"],
        ["独立", "一个事件发生不改变另一个事件概率的关系，需要明确相对于哪个分布"]
      ],
      deepDive: [
        "P(A|B) 与 P(B|A) 一般不同。检测阳性后患病概率还取决于疾病先验和假阳性率，不能只引用检测灵敏度。",
        "贝叶斯分子是 likelihood×prior，分母把所有可能原因归一化。先验不是随意猜测，应来自适用人群、历史数据或明确假设。",
        "概率把参数固定、讨论不同结果；似然把数据固定、比较不同参数。最大似然选择让已观察数据最有支持的参数，但不等于证明参数为真。"
      ],
      exampleTitle: "低基率检测",
      exampleSteps: ["1000 人中先验患病率 1%，约 10 人患病", "灵敏度 90%，约 9 个真阳性", "未患病 990 人，假阳性率 5%，约 49.5 个假阳性", "阳性总数约 58.5", "阳性后患病概率约 9/58.5=15.4%", "高灵敏度不代表阳性结果有 90% 概率患病"],
      misconceptions: ["P(A|B) 与 P(B|A) 可以交换。", "模型输出 0.9 就天然是校准后的真实概率。"],
      limits: ["贝叶斯结果依赖先验、似然模型和数据质量。", "独立性通常是建模假设，需要用领域知识和数据检查。"],
      practice: ["用 2×2 表重新计算示例后验。", "分别用一句话解释概率和似然。"],
      references: [refs.stat110, refs.d2lProbability]
    }),
    lesson(7, {
      slug: "chain-rule-numerical-stability",
      title: "偏导数、链式法则与数值稳定性",
      summary: "沿复合计算图拆解梯度，并检查浮点范围、NaN、梯度近似和随机波动。",
      why: "自动微分能执行链式法则，却不会判断公式、dtype 或中间值是否可靠；梯度正确性和数值稳定性需要独立证据。",
      objectives: ["区分导数、偏导数和梯度", "沿两步复合函数手算链式法则", "用有限差分、isfinite 和重复运行检查数值问题"],
      concepts: [
        ["偏导数", "多变量函数对其中一个变量的变化率，其他变量暂视为固定"],
        ["梯度", "函数对各输入或参数偏导数组成的向量"],
        ["链式法则", "复合函数的总变化率由路径上的局部导数相乘并在分支处汇总"],
        ["数值稳定性", "算法在有限精度、极端输入和舍入误差下保持可用结果的能力"]
      ],
      deepDive: [
        "若 a=wx、L=(a-y)²，则 ∂L/∂w=(∂L/∂a)(∂a/∂w)=2(a-y)x。计算图中的每个节点只需提供局部导数。",
        "有限差分可用 [L(w+ε)-L(w-ε)]/(2ε) 近似梯度，与自动微分结果比较。ε 太大有截断误差，太小会被浮点舍入误差放大。",
        "浮点运算不满足严格结合律，不同设备、批处理路径和 dtype 可能产生微小差异。检查 NaN/Inf、数值范围和多种种子，比强求逐位相同更可靠。"
      ],
      exampleTitle: "链式法则与梯度检查",
      exampleSteps: ["w=2、x=3、y=4，a=6", "L=(6-4)²=4", "∂L/∂a=4", "∂a/∂w=3", "解析梯度 ∂L/∂w=12", "用 ε=0.001 的中心差分得到接近 12 的结果"],
      misconceptions: ["自动微分会自动发现错误损失函数。", "设置随机种子后不同硬件和版本必须逐位一致。"],
      limits: ["不可导点处框架会采用约定的次梯度或实现规则。", "有限差分只适合抽样检查，参数很多时成本很高。"],
      practice: ["手算 L=(2w+1)² 在 w=1 的梯度。", "列出 NaN、Inf、梯度不一致和随机波动的排查顺序。"],
      references: [refs.mitCalculus, refs.pytorchNumerical, refs.sklearnRandom]
    })
  ];

  const lastAI01Index = data.lessons.reduce((lastIndex, item, index) => item.moduleId === "AI-01" ? index : lastIndex, -1);
  data.lessons.splice(lastAI01Index + 1, 0, ...lessons);
  data.lessons.forEach((item, index) => { item.order = index; });

  const knownReferenceIds = new Set(data.references.map((item) => item.id));
  Object.values(refs).forEach((item) => {
    if (!knownReferenceIds.has(item.id)) data.references.push(item);
  });
}());
