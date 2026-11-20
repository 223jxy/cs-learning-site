(function () {
  "use strict";

  const data = window.aiZoneData;
  if (!data) throw new Error("AI 专区基础数据尚未加载");

  const refs = {
    cs229: { id: "AI-S008", title: "Stanford CS229: Machine Learning", provider: "Stanford", url: "https://cs229.stanford.edu/" },
    googleData: { id: "AI-S009-D", title: "Machine Learning Crash Course: Data", provider: "Google for Developers", url: "https://developers.google.com/machine-learning/crash-course/data" },
    googleGeneralization: { id: "AI-S009-G", title: "Machine Learning Crash Course: Generalization", provider: "Google for Developers", url: "https://developers.google.com/machine-learning/crash-course/overfitting/generalization" },
    googleClassification: { id: "AI-S009-C", title: "Machine Learning Crash Course: Classification", provider: "Google for Developers", url: "https://developers.google.com/machine-learning/crash-course/classification" },
    sklearnStart: { id: "AI-S010", title: "scikit-learn Getting Started", provider: "scikit-learn", url: "https://scikit-learn.org/stable/getting_started.html" },
    sklearnPitfalls: { id: "AI-S010-P", title: "Common pitfalls and recommended practices", provider: "scikit-learn", url: "https://scikit-learn.org/stable/common_pitfalls.html" },
    sklearnPreprocess: { id: "AI-S010-R", title: "Preprocessing data", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/preprocessing.html" },
    sklearnImpute: { id: "AI-S010-I", title: "Imputation of missing values", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/impute.html" },
    sklearnModelSelection: { id: "AI-S010-M", title: "Cross-validation: evaluating estimator performance", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/cross_validation.html" },
    sklearnMetrics: { id: "AI-S010-E", title: "Metrics and scoring", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/model_evaluation.html" },
    sklearnLinear: { id: "AI-S010-L", title: "Linear models", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/linear_model.html" },
    sklearnNeighbors: { id: "AI-S010-N", title: "Nearest Neighbors", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/neighbors.html" },
    sklearnTree: { id: "AI-S010-T", title: "Decision Trees", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/tree.html" },
    sklearnEnsemble: { id: "AI-S010-F", title: "Ensemble methods", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/ensemble.html" },
    sklearnClustering: { id: "AI-S010-U", title: "Clustering", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/clustering.html" },
    sklearnDecomposition: { id: "AI-S010-D", title: "Decomposing signals in components", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/decomposition.html" },
    sklearnCalibration: { id: "AI-S010-K", title: "Probability calibration", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/calibration.html" },
    datasheets: { id: "AI-S012", title: "Datasheets for Datasets", provider: "Gebru et al.", url: "https://arxiv.org/abs/1803.09010" }
  };

  function makeQuiz(lesson) {
    const raw = [
      ["本课首先要求确认什么？", [lesson.objectives[0], "模型参数越多越好", "训练集分数必须为 100%", "先删除所有困难样本"], 0, "问题定义和可观察证据应先于模型复杂度。"],
      [`“${lesson.concepts[0][0]}”的正确含义是哪项？`, [lesson.concepts[0][1], lesson.concepts[1][1], "一种固定的软件界面", "只在深度学习中成立的规则"], 0, "按课程给出的操作性定义判断。"],
      [`关于“${lesson.concepts[1][0]}”，哪项描述正确？`, [lesson.concepts[1][1], "它与数据和目标无关", "它总能消除所有误差", "它只影响图表颜色"], 0, "该概念在数据或评估链路中有明确职责。"],
      ["哪项做法更符合可靠实验流程？", ["固定划分与处理流程，记录输入、配置和结果", "查看测试集后继续反复调参", "只报告最好的一次运行", "把缺失值直接替换为标签"], 0, "可靠实验要求隔离评价数据并保留可复查记录。"],
      ["结果异常时应优先检查什么？", ["数据定义、切分、预处理和评价代码", "立即换成更复杂模型", "删掉所有预测错误记录", "只提高训练轮数"], 0, "先排除链路错误，才能把差异归因给模型。"],
      ["本课方法的边界是什么？", [lesson.limits[0], "适用于所有数据且无需验证", "运行成功就代表可以部署", "单一平均分足以回答所有问题"], 0, "适用条件与限制也是课程结论。"]
    ];
    return raw.map(([question, options, answer, explanation], index) => {
      const rotation = (lesson.id.length + index * 3) % options.length;
      return { question, options: [...options.slice(rotation), ...options.slice(0, rotation)], answer: (answer - rotation + options.length) % options.length, explanation };
    });
  }

  function lesson(moduleId, sequence, config) {
    const module = data.modules.find((item) => item.id === moduleId);
    const item = {
      id: `ai-${moduleId.slice(3).toLowerCase()}-${config.slug}`,
      number: `${moduleId}-${String(sequence).padStart(2, "0")}`,
      moduleId,
      title: config.title,
      summary: config.summary,
      why: config.why,
      duration: config.duration || 50,
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
      checkpoint: ["能准确解释本课四个核心概念", "能复现示例中的判断过程", "能指出至少一个泄漏、偏差或误用风险"],
      references: config.references,
      labId: config.labId || ""
    };
    item.quiz = makeQuiz(item);
    return item;
  }

  const lessons = [
    lesson("AI-02", 1, {
      slug: "samples-features-labels", title: "样本、特征与标签", summary: "明确数据表中每一行、每一列和预测目标分别代表什么。",
      why: "同一张表既可能表示用户、事件，也可能表示某个时间点的快照。样本单位和预测时点不清，会造成重复计数、未来信息混入和错误标签。",
      objectives: ["写出样本单位和预测时点", "区分输入特征、标签和标识符", "按数值、类别、序列和非结构化数据选择表示"],
      concepts: [["样本", "一次独立观测及其在预测时点可见的信息"], ["特征", "模型输入的可测量变量"], ["标签", "监督学习希望预测的已知结果"], ["目标变量", "业务问题在数据中的可操作化结果"]],
      deepDive: ["先写一句样本定义，例如“一行是一名学生在完成课程当天的状态”，同时写清预测发生时间。", "ID 用于关联记录，不应默认当作数值特征；目标编码、用户编号和时间戳都可能泄露结构。", "数据类型决定预处理：连续数值可缩放，类别需要编码，文本和图像需要保持语义结构。"],
      exampleTitle: "课程复习预测表", exampleSteps: ["样本：一次课程完成记录", "预测时点：课程结束当天", "特征：用时、练习次数、首次得分", "标签：七天后复测是否答对", "排除：七天后的复习次数"],
      misconceptions: ["表中所有列都能作为特征。", "一名用户出现多行时每行必然独立。"], limits: ["样本定义正确不代表标签可靠。", "代理目标可能偏离真实业务目标。"],
      practice: ["为垃圾邮件识别写出样本、特征、标签和预测时点。", "检查一张自拟数据表，圈出 ID、目标和预测后才产生的列。"], references: [refs.googleData, refs.datasheets]
    }),
    lesson("AI-02", 2, {
      slug: "train-validation-test", title: "训练集、验证集与测试集", summary: "用三个互不混淆的数据角色完成拟合、选择与最终评估。",
      why: "用同一批数据训练又评价，只能说明模型记住或适配了这批数据，不能估计面对新样本时的表现。",
      objectives: ["说明三种数据集的不同职责", "根据实体和时间选择切分策略", "识别反复查看测试集造成的间接过拟合"],
      concepts: [["训练集", "用于估计模型参数的数据"], ["验证集", "用于选择模型、特征和超参数的数据"], ["测试集", "方案冻结后用于一次性估计泛化表现的数据"], ["切分单元", "必须整体落入同一分组的实体或时间块"]],
      deepDive: ["常见随机切分假设样本近似独立同分布；同一用户、设备或文档的派生记录必须成组切分。", "时间预测应按时间向前切分，训练只使用过去，验证和测试模拟未来。", "每次根据测试结果修改方案，都把测试信息带回开发过程；此时测试集已变成验证集。"],
      exampleTitle: "按学生分组切分", exampleSteps: ["列出唯一学生 ID", "按 ID 分成训练、验证、测试组", "把同一学生的全部记录放入同一组", "只在训练集拟合预处理", "方案冻结后查看测试结果"],
      misconceptions: ["随机打散总是最佳切分。", "测试集不参与梯度更新就不会泄漏。"], limits: ["小数据切分后的估计方差可能很大。", "历史测试集仍可能无法代表未来漂移。"],
      practice: ["为时间序列销量预测设计切分。", "解释同一患者影像落入训练和测试会造成什么问题。"], references: [refs.sklearnModelSelection, refs.googleGeneralization]
    }),
    lesson("AI-02", 3, {
      slug: "data-quality", title: "缺失、异常、重复与标签错误", summary: "把数据质量问题转成可统计、可定位、可复查的处理规则。",
      why: "静默填充值、删除异常值或去重可能改变样本分布；处理动作必须说明原因并只从训练数据估计参数。",
      objectives: ["区分缺失机制与异常现象", "识别完全重复和实体重复", "抽样审查标签一致性并记录修正规则"],
      concepts: [["缺失值", "在应有位置没有观测到的值"], ["异常值", "偏离常见范围但可能真实存在的观测"], ["重复样本", "同一事件或实体被重复记录"], ["标签噪声", "目标值错误、不一致或定义模糊"]],
      deepDive: ["先统计每列缺失率并按来源、时间和目标分组，缺失本身可能携带流程信息。", "异常值要区分录入错误与真实极端案例；直接删除会让模型看不到重要边界。", "标签审查需要明确标注指南、双人一致性或抽样复核；修正后保留原值与原因。"],
      exampleTitle: "数据质量审计", exampleSteps: ["按列统计缺失和唯一值", "检查数值范围与单位", "按业务键查重复实体", "分层抽取标签样本复核", "生成处理前后数量对照表"],
      misconceptions: ["所有缺失值都填 0。", "异常值一定是错误数据。"], limits: ["统计规则不能替代领域判断。", "修复标签不会自动消除采样偏差。"],
      practice: ["为年龄列设计缺失和异常检查。", "写出保留重复样本所需的证据。"], references: [refs.sklearnImpute, refs.googleData]
    }),
    lesson("AI-02", 4, {
      slug: "preprocessing", title: "编码、缩放与输入预处理", summary: "让训练和推理使用完全一致、且只在训练集拟合的转换链。",
      why: "预处理是模型的一部分。类别映射、均值方差或词表在全量数据上拟合，会泄漏验证和测试信息。",
      objectives: ["按数据类型选择转换", "区分 fit 与 transform", "把预处理与模型封装为同一流水线"],
      concepts: [["编码", "把类别或文本转换成数值表示"], ["缩放", "根据训练数据统计量调整数值尺度"], ["fit", "从数据估计转换参数"], ["transform", "使用已估计参数转换新数据"]],
      deepDive: ["标准化使用训练集均值和标准差；验证、测试和线上输入只能复用这些值。", "One-hot 编码要定义未知类别策略，否则线上新类别会导致失败或列错位。", "Pipeline 把转换和估计器绑定，使交叉验证的每一折都只在该折训练部分执行 fit。"],
      exampleTitle: "正确的预处理顺序", exampleSteps: ["先划分训练和验证", "在训练集拟合缺失值填充器", "在训练集拟合编码器和缩放器", "依次转换训练与验证", "把全部步骤封装并版本化"],
      misconceptions: ["先标准化全量数据再切分没有影响。", "树模型完全不需要任何输入检查。"], limits: ["统一缩放不适合所有稀疏表示。", "预处理一致仍不能解决语义漂移。"],
      practice: ["写出包含数值和类别列的处理顺序。", "说明未知类别上线时的两种处理策略。"], references: [refs.sklearnPreprocess, refs.sklearnPitfalls]
    }),
    lesson("AI-02", 5, {
      slug: "data-leakage", title: "数据泄漏与时间穿越", summary: "识别目标派生特征、全量拟合和重复实体导致的虚高分数。",
      why: "泄漏会让验证结果看起来非常优秀，却在真实预测时失效。它通常发生在数据定义和处理顺序，而不是模型代码本身。",
      objectives: ["识别三类常见数据泄漏", "从预测时点检查特征可用性", "用流水线和分组切分修复泄漏"],
      concepts: [["目标泄漏", "输入特征直接或间接包含目标结果"], ["时间穿越", "使用预测时点之后才产生的信息"], ["实体泄漏", "同一实体的相似记录跨越训练与评价集"], ["预处理泄漏", "使用评价数据估计转换参数"]],
      deepDive: ["逐列追问“线上作出预测的那一刻能否取得此值”，能排除大量目标泄漏和时间穿越。", "随机行切分无法阻止同一实体的模板、图像或文本副本跨组出现，应按实体或组切分。", "修复后分数下降是评价恢复真实的证据，不应为了保住旧分数重新引入泄漏。"],
      exampleTitle: "退款预测中的泄漏", exampleSteps: ["目标：下单时预测未来是否退款", "发现特征：退款处理完成时间", "判断：该字段在预测时点不存在", "删除字段并按用户分组切分", "重新训练并记录真实下降后的分数"],
      misconceptions: ["只有把标签列直接放进输入才算泄漏。", "验证分数越高越能证明没有泄漏。"], limits: ["自动相关性检查发现不了所有时间语义问题。", "去除已知泄漏后仍需审查数据生成流程。"],
      practice: ["列出信用违约预测中三个可能的未来字段。", "运行泄漏实验并解释修复后分数下降为何是好事。"], references: [refs.sklearnPitfalls, refs.googleData], labId: "ai-lab-data-leakage", type: "实验", duration: 60
    }),
    lesson("AI-02", 6, {
      slug: "imbalance-representativeness", title: "类别不平衡、采样偏差与代表性", summary: "区分标签比例不均与目标人群覆盖不足，并选择对应检查方法。",
      why: "少数类很少不等于数据无效；真正的问题是指标是否忽略它，以及样本是否代表系统将服务的人群和情境。",
      objectives: ["计算类别比例并建立多数类基线", "区分重采样、类别权重和阈值调整", "按来源与人群检查覆盖差异"],
      concepts: [["类别不平衡", "不同标签的样本数量差异显著"], ["采样偏差", "进入数据集的机制与目标总体不一致"], ["代表性", "数据对预期使用人群和场景的覆盖程度"], ["类别权重", "在损失中提高特定类别错误的代价"]],
      deepDive: ["99% 阴性数据上总预测阴性也有 99% Accuracy，因此需查看混淆矩阵、Precision 和 Recall。", "重采样只应作用于训练数据；在测试集改变类别比例会扭曲实际部署条件下的指标。", "代表性要按设备、地区、时间、语言等使用情境切片，而不是只看总体样本数。"],
      exampleTitle: "故障检测数据", exampleSteps: ["统计故障占比 1%", "建立全阴性基线", "训练集尝试类别权重", "测试集保持真实比例", "分别报告漏报率和误报率"],
      misconceptions: ["平衡数据就是把测试集也做成 50:50。", "类别权重一定提高所有指标。"], limits: ["调整比例不能创造缺失的人群信息。", "合成样本可能放大错误模式。"],
      practice: ["解释欺诈识别为何不能只看 Accuracy。", "设计按三个用户群体统计覆盖率的表格。"], references: [refs.googleClassification, refs.sklearnMetrics]
    }),
    lesson("AI-02", 7, {
      slug: "dataset-cards-versioning", title: "Dataset Card、版本与实验记录", summary: "记录数据为何产生、如何处理、适合什么用途以及发生过哪些变化。",
      why: "只有一个 CSV 文件名无法回答来源、授权、切分、清洗和限制。数据文档与版本是复现实验和追责变化的基础。",
      objectives: ["编写最小 Dataset Card", "为原始数据、处理脚本和派生数据建立版本关系", "记录可重现实验所需字段"],
      concepts: [["Dataset Card", "描述数据动机、组成、采集、处理、用途和维护的文档"], ["数据版本", "能唯一定位某次数据内容的标识"], ["数据血缘", "从来源经转换到训练输入的可追踪关系"], ["实验记录", "数据、代码、配置、随机性和结果的组合证据"]],
      deepDive: ["Dataset Card 需要说明谁收集、为谁服务、包含和排除什么，以及不推荐用途。", "版本不只是文件名日期；至少保存内容哈希、生成脚本版本、参数和上游来源。", "实验记录应能从一次结果反查数据版本和代码版本，也能从版本查到生成的指标与产物。"],
      exampleTitle: "最小数据卡", exampleSteps: ["用途与不适用用途", "样本单位和字段字典", "来源、许可与隐私处理", "切分和清洗规则", "已知偏差、维护人和版本号"],
      misconceptions: ["README 写了列名就等于完整数据卡。", "文件内容不变时处理脚本版本不重要。"], limits: ["文档提高透明度但不会自动消除偏差。", "敏感来源可能要求更严格的访问与删除流程。"],
      practice: ["为泄漏实验数据写五段式数据卡。", "设计一个包含数据哈希、代码版本和参数的实验记录。"], references: [refs.datasheets, refs.sklearnStart]
    }),

    lesson("AI-03", 1, {
      slug: "linear-regression", title: "线性回归、残差与均方误差", summary: "用线性组合建立可解释回归基线，并检查残差结构。",
      why: "线性回归训练快、系数可检查，是连续目标的重要基线；即使最终使用复杂模型，也能暴露尺度、异常值和非线性问题。",
      objectives: ["解释系数与截距", "从预测计算残差和 MSE", "用残差图识别系统性误差"],
      concepts: [["线性回归", "用特征加权和预测连续目标的模型"], ["系数", "其他条件不变时特征单位变化对应的预测变化"], ["残差", "真实值减预测值的差"], ["均方误差", "残差平方的平均值"]],
      deepDive: ["多特征模型写作 ŷ=wᵀx+b；系数解释依赖特征尺度、编码方式和共线性。", "最小二乘放大大残差，因此异常值会显著影响拟合。", "若残差随预测值呈弧形或漏斗形，说明线性或恒定方差假设可能不合适。"],
      exampleTitle: "学习时长预测得分", exampleSteps: ["拟合 ŷ=5x+50", "x=6 时预测 80", "真实值 74，残差 -6", "平方误差 36", "检查多个样本残差是否随时长系统偏移"],
      misconceptions: ["相关系数高就证明因果关系。", "系数绝对值越大特征越重要。"], limits: ["线性关系和误差假设可能不成立。", "强共线性会让单个系数不稳定。"],
      practice: ["手算三条预测的残差与 MSE。", "画一组带弧形模式的残差并解释。"], references: [refs.sklearnLinear, refs.cs229]
    }),
    lesson("AI-03", 2, {
      slug: "logistic-regression", title: "Logistic Regression、概率与阈值", summary: "把线性得分压缩成 0–1 概率，再用阈值转成分类决策。",
      why: "Logistic Regression 是可解释且稳定的分类基线。它把排序分数、概率估计和最终行动分开，便于按错误成本调整阈值。",
      objectives: ["解释 logit、sigmoid 和概率输出", "区分概率分数与类别决定", "说明正则化对系数的影响"],
      concepts: [["Logistic Regression", "对特征线性得分应用 sigmoid 的概率分类模型"], ["sigmoid", "把任意实数映射到 0 与 1 之间的函数"], ["决策阈值", "把连续分数转换为类别的切点"], ["正则化", "限制参数复杂度以降低过拟合风险"]],
      deepDive: ["模型先计算 z=wᵀx+b，再得到 p=1/(1+e^-z)。p 增大表示模型在当前数据假设下更支持正类。", "默认 0.5 不是自然法则；漏报成本较高时可以降低阈值，但误报通常会上升。", "L1 可产生稀疏系数，L2 平滑限制大系数；正则强度应通过验证数据选择。"],
      exampleTitle: "退款风险决策", exampleSteps: ["模型输出 0.62", "阈值 0.5 时判为高风险", "阈值 0.7 时判为普通", "比较两种阈值的漏报与误报", "根据人工审核容量选择行动点"],
      misconceptions: ["输出 0.8 就代表现实中必然有 80% 概率。", "阈值越高模型越准确。"], limits: ["概率可能需要额外校准。", "线性决策边界难以表达复杂交互。"],
      practice: ["给五个概率分别应用 0.3 和 0.7 阈值。", "解释降低阈值对 Recall 的典型影响。"], references: [refs.sklearnLinear, refs.googleClassification]
    }),
    lesson("AI-03", 3, {
      slug: "knn-distance", title: "k-NN 与距离度量", summary: "依据附近已标注样本投票，并理解尺度和维度为何决定邻居。",
      why: "k-NN 几乎没有显式训练过程，适合观察表示与距离的作用；它也清楚展示了高维、尺度和推理成本问题。",
      objectives: ["手算欧氏距离和邻居投票", "解释 k 对偏差与方差的影响", "说明缩放为何改变邻居"],
      concepts: [["k-NN", "使用距离最近的 k 个训练样本进行预测"], ["距离度量", "量化两个特征向量差异的函数"], ["邻居数 k", "参与投票或平均的样本数量"], ["维度灾难", "高维空间中距离区分度和样本密度快速恶化"]],
      deepDive: ["欧氏距离受单位影响：收入的数值范围可能完全压过年龄，因此通常先在训练集拟合缩放。", "k=1 边界灵活但易受噪声影响；较大 k 更平滑，却可能吞没局部少数模式。", "预测要遍历或索引训练样本，数据量大时内存与延迟成为主要成本。"],
      exampleTitle: "二维邻居投票", exampleSteps: ["待测点 (2,2)", "计算到四个训练点的距离", "取最近 3 个", "按标签多数投票", "再把第一维乘 100，观察邻居改变"],
      misconceptions: ["k-NN 不训练所以不会过拟合。", "所有数值特征可以直接计算距离。"], limits: ["高维稀疏数据中的距离可能失去意义。", "类别不平衡会主导邻居投票。"],
      practice: ["手算三个二维点到原点的距离。", "比较 k=1 与 k=5 对孤立噪声点的响应。"], references: [refs.sklearnNeighbors, refs.cs229]
    }),
    lesson("AI-03", 4, {
      slug: "decision-tree", title: "决策树、分裂规则与过拟合", summary: "递归选择特征切分样本，得到可读但容易长得过深的规则树。",
      why: "决策树能表示非线性和特征交互，也能处理不同尺度；它的高方差特性让验证、剪枝和最小叶节点约束非常重要。",
      objectives: ["读取从根到叶的决策路径", "解释不纯度下降如何选择分裂", "通过深度和叶节点样本数限制过拟合"],
      concepts: [["决策树", "通过一系列特征条件把样本递归分区的模型"], ["分裂", "按特征阈值或类别把节点样本分到子节点"], ["不纯度", "衡量节点中标签混杂程度的量"], ["叶节点", "输出最终预测的终止节点"]],
      deepDive: ["分类树寻找能最大降低 Gini 或熵等不纯度的分裂；回归树常最小化平方误差。", "树不断生长可把训练样本分得很细，训练误差下降但边界对微小数据变化敏感。", "限制 max_depth、min_samples_leaf 或剪枝，并在验证集选择复杂度。"],
      exampleTitle: "读取一棵审核树", exampleSteps: ["根节点：金额 > 1000", "是：检查账户年龄 < 7 天", "否：输出低风险", "到达叶节点读取正类比例", "检查叶节点只有 1 条样本是否可靠"],
      misconceptions: ["树图能读懂就代表模型稳定。", "树模型不需要处理缺失和类别语义。"], limits: ["单棵深树通常方差较高。", "轴对齐分裂可能需要很多节点表达斜边界。"],
      practice: ["根据三条规则画一棵两层树。", "说明把最大深度从 3 提到 30 的风险。"], references: [refs.sklearnTree, refs.cs229]
    }),
    lesson("AI-03", 5, {
      slug: "random-forest", title: "Random Forest 与集成思想", summary: "通过样本和特征随机性组合多棵树，降低单树预测的方差。",
      why: "多个有差异的模型平均后可以抵消部分偶然误差。理解集成的收益来源，也能避免把更多树误解为自动消除偏差。",
      objectives: ["解释 bootstrap 和特征随机采样", "区分单树与森林的方差", "读取袋外评估和特征重要性的限制"],
      concepts: [["Random Forest", "对多棵随机化决策树进行平均或投票的集成模型"], ["bootstrap", "从训练集有放回抽样构造子训练集"], ["特征随机性", "每次分裂只考虑随机选取的一部分特征"], ["集成", "组合多个模型以改善稳定性或性能"]],
      deepDive: ["若所有树完全相同，平均不会降低方差；样本与特征随机性用于降低树之间相关性。", "分类通常多数投票或平均概率，回归平均预测。树数增加主要改善稳定性，收益会逐渐饱和。", "基于不纯度的重要性可能偏爱高基数特征，解释时应结合置换重要性和领域检查。"],
      exampleTitle: "五棵树投票", exampleSteps: ["五棵树输出 [1,1,0,1,0]", "多数投票得到 1", "计算正类比例 3/5", "检查各树训练样本不同", "比较单树和森林在验证集上的波动"],
      misconceptions: ["树越多就一定修复数据偏差。", "特征重要性等同于因果影响。"], limits: ["森林体积和推理成本高于单树。", "平滑外推和极高维稀疏任务未必合适。"],
      practice: ["解释为什么完全相同的十棵树没有集成收益。", "列出特征重要性的两个误读。"], references: [refs.sklearnEnsemble, refs.sklearnTree]
    }),
    lesson("AI-03", 6, {
      slug: "clustering-pca", title: "聚类、降维与无监督边界", summary: "在没有标签时寻找结构，同时避免把几何分组直接解释成真实类别。",
      why: "聚类和降维适合探索、压缩与可视化，但结果依赖表示、尺度、距离和超参数，没有唯一正确答案。",
      objectives: ["解释 k-means 的分配与更新", "说明 PCA 保留方差的含义", "用稳定性和下游价值评价无监督结果"],
      concepts: [["聚类", "按相似性把未标注样本组织成组"], ["k-means", "最小化样本到所属质心平方距离的算法"], ["PCA", "寻找数据方差最大的正交方向进行线性投影"], ["无监督边界", "没有目标标签时结构解释必须依赖额外证据"]],
      deepDive: ["k-means 交替把点分给最近质心，再计算每组均值；初始化和 k 会改变结果。", "PCA 最大化投影方差，不保证保留分类信息，也不等于自动得到可解释语义。", "评价应结合不同随机种子稳定性、轮廓系数、领域可解释性和下游任务收益。"],
      exampleTitle: "用户行为探索", exampleSteps: ["在训练数据拟合缩放", "尝试 k=2、3、4", "用多个随机种子重复", "比较分组稳定性和轮廓系数", "由业务专家检查分组是否可行动"],
      misconceptions: ["聚类编号就是天然人群标签。", "二维 PCA 图上分开就证明高维中可分类。"], limits: ["k-means 假设近似球形且尺度相近的簇。", "降维可能丢失低方差但重要的信息。"],
      practice: ["说明经纬度和消费金额直接聚类的问题。", "写出选择 k 时需要的三类证据。"], references: [refs.sklearnClustering, refs.sklearnDecomposition]
    }),
    lesson("AI-03", 7, {
      slug: "pipeline-baselines", title: "Pipeline、基线与模型比较", summary: "在相同切分和预处理条件下比较简单基线与三个经典模型。",
      why: "如果模型使用不同数据、不同预处理或不同测试集，分数不可直接比较。统一 Pipeline 和评价协议才能归因差异。",
      objectives: ["建立多数类或均值基线", "用 Pipeline 隔离每次拟合", "在同一测试协议下比较性能、延迟和解释成本"],
      concepts: [["基线", "用于判断复杂方案是否真正增益的简单方案"], ["Pipeline", "按固定顺序组合预处理与估计器"], ["比较协议", "所有候选共享的切分、指标和运行约束"], ["错误样本", "用于解释模型差异的具体失败记录"]],
      deepDive: ["分类先计算多数类、规则或随机基线；回归先计算均值或中位数基线。", "Pipeline 在交叉验证每一折内部拟合预处理，避免把验证折信息用于转换。", "比较表不只放分数，还要记录训练时间、推理时间、模型大小、主要错误切片和维护成本。"],
      exampleTitle: "三模型基线比较", exampleSteps: ["固定一次训练/测试划分", "定义多数类基线", "用相同特征训练 Logistic、树和森林", "报告 Accuracy 与少数类 Recall", "逐条比较三者错误样本"],
      misconceptions: ["分数最高的模型必然最适合上线。", "每个模型单独调到最好后直接比最高分最公平。"], limits: ["单次切分的排序可能受随机波动影响。", "离线比较不能替代线上成本和漂移评估。"],
      practice: ["设计包含四列指标和两列工程成本的比较表。", "运行基线实验并解释至少一条模型分歧。"], references: [refs.sklearnStart, refs.sklearnPitfalls], labId: "ai-lab-model-baselines", type: "实验", duration: 65
    }),

    lesson("AI-04", 1, {
      slug: "under-overfitting", title: "欠拟合、过拟合、偏差与方差", summary: "用训练和验证误差的组合判断模型容量问题。",
      why: "只看验证分数不知道改动方向。训练误差和验证误差的差距能帮助判断是模型学不够，还是对训练细节过度适配。",
      objectives: ["根据训练与验证误差识别欠拟合和过拟合", "解释偏差与方差的直觉", "选择增加容量、正则化或数据的方向"],
      concepts: [["欠拟合", "模型连训练数据中的主要规律也未捕获"], ["过拟合", "训练表现很好但新数据表现明显下降"], ["偏差", "模型假设过强导致的系统性误差倾向"], ["方差", "模型对训练样本变化过于敏感的程度"]],
      deepDive: ["训练和验证都差通常指向欠拟合、特征不足或优化失败；训练好验证差通常指向过拟合或分布不一致。", "增加容量通常降低训练偏差但可能提高方差；正则化、更多代表性数据和集成可降低部分方差。", "学习曲线随训练样本数绘制两类误差，比单个终点分数更能判断增加数据是否有价值。"],
      exampleTitle: "读取学习曲线", exampleSteps: ["小数据时训练 99%、验证 70%", "增加数据后训练 94%、验证 86%", "差距缩小说明方差降低", "若二者都停在 65%，检查偏差或特征", "同时确认切分和指标没有变化"],
      misconceptions: ["训练准确率 100% 就代表模型最好。", "过拟合只会发生在深度学习。"], limits: ["偏差/方差是诊断框架，不是唯一根因。", "数据分布变化也会制造类似过拟合的差距。"],
      practice: ["给三组训练/验证分数判断问题。", "为高方差模型提出三种不同层面的改进。"], references: [refs.googleGeneralization, refs.cs229]
    }),
    lesson("AI-04", 2, {
      slug: "cross-validation", title: "交叉验证与超参数选择", summary: "轮换训练与验证折，估计模型选择结果对数据划分的敏感度。",
      why: "单次验证集可能偶然容易或困难。交叉验证利用多次划分给出均值和波动，但仍必须保留最终测试集。",
      objectives: ["解释 k 折交叉验证流程", "为分组和时间数据选择正确变体", "避免在测试集上选择超参数"],
      concepts: [["交叉验证", "轮流用不同数据折验证、其余折训练的评价方法"], ["超参数", "训练前选择且不由模型直接拟合的配置"], ["分层切分", "让各折近似保持类别比例"], ["分组切分", "确保同一实体不会跨越训练折与验证折"]],
      deepDive: ["k 折产生 k 个验证分数，应报告均值与离散程度，而不只报告最好一折。", "类别任务可分层，重复实体用 GroupKFold 思路，时间数据需保持先后顺序。", "网格或随机搜索本质上多次使用验证信息，因此最终泛化估计仍来自未参与选择的测试集。"],
      exampleTitle: "五折模型选择", exampleSteps: ["预留最终测试集", "训练部分划成五折", "每组超参数运行五次训练验证", "按均值和波动选择", "用全部训练部分重训后只评估一次测试集"],
      misconceptions: ["交叉验证后不再需要测试集。", "随机 k 折适用于任何时间序列。"], limits: ["交叉验证增加计算成本。", "各折仍来自同一历史分布。"],
      practice: ["为同一用户多条记录选择切分器。", "解释为何报告 0.82±0.08 比只报 0.86 更完整。"], references: [refs.sklearnModelSelection, refs.cs229]
    }),
    lesson("AI-04", 3, {
      slug: "classification-metrics", title: "混淆矩阵、Precision、Recall 与 F1", summary: "从四种分类结果计算指标，并把指标选择连接到错误成本。",
      why: "Accuracy 会把不同类型错误混在一起。混淆矩阵让误报和漏报可见，Precision、Recall 与 F1 分别回答不同问题。",
      objectives: ["正确识别 TP、FP、FN、TN", "手算 Precision、Recall 和 F1", "根据业务成本选择主指标"],
      concepts: [["混淆矩阵", "统计预测类别与真实类别组合的四格表"], ["Precision", "预测为正的样本中实际为正的比例 TP/(TP+FP)"], ["Recall", "实际为正的样本中被找出的比例 TP/(TP+FN)"], ["F1", "Precision 与 Recall 的调和平均"]],
      deepDive: ["正类必须由任务明确，交换正负类会改变 Precision 和 Recall 的含义。", "高 Precision 关注自动处理结果有多可信，高 Recall 关注目标事件漏掉多少。", "F1 在两者间折中但不使用 TN，也不表达不同错误的真实成本。"],
      exampleTitle: "手算故障检测", exampleSteps: ["TP=18, FP=6, FN=2, TN=74", "Precision=18/24=0.75", "Recall=18/20=0.90", "F1=2×0.75×0.90/(0.75+0.90)=0.818", "根据漏报代价判断是否接受"],
      misconceptions: ["Precision 高就表示漏报少。", "F1 高就代表所有场景都好。"], limits: ["指标依赖类别定义和样本分布。", "单一总体指标可能掩盖群体差异。"],
      practice: ["用 TP=8、FP=2、FN=4、TN=86 计算四项指标。", "为垃圾邮件和疾病筛查分别说明更关注哪种错误。"], references: [refs.sklearnMetrics, refs.googleClassification]
    }),
    lesson("AI-04", 4, {
      slug: "roc-pr-thresholds", title: "ROC、PR 曲线与阈值选择", summary: "观察所有阈值下的权衡，并在真实类别比例和成本下选择行动点。",
      why: "AUC 汇总排序能力，但产品必须落到具体阈值。类别稀少时，PR 曲线通常比 ROC 更直接显示正类预测质量。",
      objectives: ["解释 ROC 的 TPR/FPR 坐标", "解释 PR 曲线与类别基准", "用成本和容量选择阈值"],
      concepts: [["ROC 曲线", "不同阈值下 TPR 与 FPR 的关系"], ["PR 曲线", "不同阈值下 Precision 与 Recall 的关系"], ["AUC", "对整条曲线进行汇总的面积指标"], ["阈值", "把连续分数转换为行动的切点"]],
      deepDive: ["ROC-AUC 可解释为随机正样本得分高于随机负样本的概率式排序度量。", "正类极少时，大量 TN 会让 FPR 看起来很小，PR 曲线更直接暴露 FP 对 Precision 的影响。", "阈值选择需要验证集上的混淆矩阵、人工处理容量、漏报与误报成本；测试集只报告冻结后的选择。"],
      exampleTitle: "审核容量选择", exampleSteps: ["每天 10000 条，人工只能审核 200 条", "比较阈值 0.3/0.5/0.7", "记录各阈值预测正类数", "排除超过容量的方案", "在可行方案中比较 Recall 与错误成本"],
      misconceptions: ["AUC 最高就不需要选阈值。", "固定使用 0.5 最客观。"], limits: ["曲线不直接包含具体业务成本。", "类别比例变化会显著影响 Precision。"],
      practice: ["运行阈值实验并为高漏报成本场景选择阈值。", "解释为何类别比例变化时 ROC-AUC 可能不变而 Precision 改变。"], references: [refs.sklearnMetrics, refs.googleClassification], labId: "ai-lab-threshold-tradeoff", type: "实验", duration: 65
    }),
    lesson("AI-04", 5, {
      slug: "regression-metrics", title: "MAE、MSE、RMSE 与残差图", summary: "根据误差单位、异常值敏感度和决策成本选择回归指标。",
      why: "多个回归指标可能给出不同模型排序。必须理解误差怎样聚合，以及指标是否与实际损失相符。",
      objectives: ["手算 MAE、MSE 和 RMSE", "比较它们对大误差的敏感性", "从残差图发现分段偏差"],
      concepts: [["MAE", "绝对误差平均值，与目标同单位"], ["MSE", "平方误差平均值，较重惩罚大误差"], ["RMSE", "MSE 开平方后恢复到目标单位"], ["残差图", "把残差与预测值或特征并列观察的诊断图"]],
      deepDive: ["MAE 对极端误差更稳健，最优常数预测对应中位数；MSE 的最优常数对应均值。", "RMSE 与目标同单位便于解释，但排序与 MSE 完全一致。", "总体误差相同的模型，可能在高价区、夜间或特定设备上有不同系统偏差，需做残差切片。"],
      exampleTitle: "三条回归误差", exampleSteps: ["真实 [10,20,30]，预测 [12,18,36]", "绝对误差 [2,2,6]，MAE=3.33", "平方误差 [4,4,36]，MSE=14.67", "RMSE≈3.83", "观察第三条大误差对 MSE 的影响"],
      misconceptions: ["RMSE 比 MAE 天然更科学。", "残差平均接近零就说明模型没有问题。"], limits: ["指标选择取决于误差成本。", "聚合值无法定位误差发生在哪些样本。"],
      practice: ["计算一组四条样本的三个指标。", "为配送时长和房价预测分别讨论大误差成本。"], references: [refs.sklearnMetrics, refs.sklearnLinear]
    }),
    lesson("AI-04", 6, {
      slug: "calibration-uncertainty", title: "概率校准、不确定性与置信度误用", summary: "区分模型分数、校准概率和对未知情境的不确定性。",
      why: "分类器输出 0.9 不自动等于现实中 90% 会发生。概率若用于排序、拒答或资源分配，需要单独检查校准。",
      objectives: ["解释完美校准的频率含义", "读取可靠性图", "区分数据噪声与模型未知区域"],
      concepts: [["校准", "预测概率与长期观察频率的一致程度"], ["可靠性图", "按预测概率分箱比较平均预测与真实比例"], ["置信度", "模型对当前输出给出的内部分数"], ["不确定性", "来自数据随机性、模型知识不足或分布变化的未知程度"]],
      deepDive: ["若大量样本预测约 0.8，理想校准意味着其中约 80% 实际为正；这与排序是否优秀是不同问题。", "可在独立校准集上使用 sigmoid 或 isotonic 等方法，不能在测试集拟合校准器。", "分布外输入可能得到高置信错误，单个 softmax 最大值不足以证明输入可靠。"],
      exampleTitle: "检查 0.8 分箱", exampleSteps: ["收集预测在 0.75–0.85 的样本", "统计共 100 条", "实际正类只有 60 条", "判断模型在该区间过度自信", "在独立数据拟合校准并重新验证"],
      misconceptions: ["概率高就代表事实确定。", "校准后模型分类准确率必然提高。"], limits: ["校准关系会随数据分布变化。", "小样本分箱估计波动很大。"],
      practice: ["解释“预测 0.7”正确的频率含义。", "写出校准器训练、验证、测试的安全划分。"], references: [refs.sklearnCalibration, refs.sklearnMetrics]
    }),
    lesson("AI-04", 7, {
      slug: "slices-significance", title: "分组评估、错误切片与显著性意识", summary: "从总体平均数深入到人群、来源、时间和错误类型，并报告不确定性。",
      why: "总体分数可能由大群体主导，掩盖小群体或关键情境的失败。模型差 0.3 个百分点也可能只是抽样波动。",
      objectives: ["设计互不混淆的评估切片", "建立错误类型表并抽样复核", "用置信区间或重复实验表达波动"],
      concepts: [["评估切片", "按人群、来源、时间或条件拆分的指标子集"], ["错误分类法", "用可行动原因组织失败样本的类别体系"], ["置信区间", "表达指标估计在抽样不确定性下的合理范围"], ["基线比较", "把模型差异与简单方案和运行波动同时对照"]],
      deepDive: ["切片应在看结果前由用途和风险定义，同时允许误差分析发现新切片；样本数必须随指标一起报告。", "错误分类先建立少量互斥或明确可多选的原因，再由两人抽样标注检查一致性。", "模型比较要固定测试样本，使用配对结果、bootstrap 或重复切分观察差异稳定性，而不只看一个小数点。"],
      exampleTitle: "完整误差报告", exampleSteps: ["报告总体指标和样本数", "按设备、语言、时间切片", "列出每组混淆矩阵", "抽取高置信错误建立分类法", "报告模型差异范围和仍未验证的结论"],
      misconceptions: ["总体提升就代表所有群体都提升。", "测试集上高 0.1% 就证明新模型更好。"], limits: ["切片过多会产生偶然发现。", "极小群体指标需要更宽的不确定性说明和定性证据。"],
      practice: ["为学习推荐设计四个评估切片。", "写一段同时包含均值、样本量和波动范围的结论。"], references: [refs.sklearnMetrics, refs.googleGeneralization]
    })
  ];

  const labs = [
    {
      id: "ai-lab-data-leakage", number: "AI-LAB-03", lessonId: "ai-02-data-leakage", title: "数据泄漏复现与修复", environment: "浏览器 JavaScript", duration: 15,
      goal: "比较真实可用特征和由标签派生的泄漏特征，观察验证准确率为何虚高。",
      inputs: "8 条固定验证样本；cleanSignal 在预测时可用，postOutcome 在结果发生后才产生。",
      evidence: ["清洁特征与泄漏特征的逐条预测", "两种方案的准确率", "被泄漏特征掩盖的错误样本"],
      controls: [],
      run() {
        const rows = [
          { cleanSignal: 0.9, postOutcome: 1, label: 1 }, { cleanSignal: 0.7, postOutcome: 1, label: 1 },
          { cleanSignal: 0.6, postOutcome: 0, label: 0 }, { cleanSignal: 0.2, postOutcome: 0, label: 0 },
          { cleanSignal: 0.8, postOutcome: 0, label: 0 }, { cleanSignal: 0.3, postOutcome: 1, label: 1 },
          { cleanSignal: 0.55, postOutcome: 1, label: 1 }, { cleanSignal: 0.45, postOutcome: 0, label: 0 }
        ];
        const details = rows.map((row, index) => ({ index: index + 1, label: row.label, cleanPrediction: row.cleanSignal >= 0.5 ? 1 : 0, leakedPrediction: row.postOutcome }));
        const accuracy = (key) => details.filter((row) => row[key] === row.label).length / details.length;
        return { details, cleanAccuracy: accuracy("cleanPrediction"), leakedAccuracy: accuracy("leakedPrediction"), leakedFeature: "postOutcome" };
      },
      formatResult(result) {
        return ["样本 | 标签 | 清洁预测 | 泄漏预测", ...result.details.map((row) => `${row.index} | ${row.label} | ${row.cleanPrediction} | ${row.leakedPrediction}`), "", `清洁验证准确率：${(result.cleanAccuracy * 100).toFixed(1)}%`, `泄漏验证准确率：${(result.leakedAccuracy * 100).toFixed(1)}%`, `修复：移除预测时点后才出现的 ${result.leakedFeature}，接受更真实的分数。`].join("\n");
      }
    },
    {
      id: "ai-lab-model-baselines", number: "AI-LAB-04", lessonId: "ai-03-pipeline-baselines", title: "三个经典模型基线比较", environment: "浏览器 JavaScript", duration: 20,
      goal: "在同一二维训练/测试集上比较 Logistic Regression、决策树桩和 k-NN，并查看具体分歧。",
      inputs: "10 条训练样本、6 条测试样本，统一使用两个数值特征。",
      evidence: ["三个模型的测试准确率", "逐条测试预测", "模型之间不一致的样本"], controls: [],
      run() {
        const train = [[-2,-1,0],[-1,-2,0],[-1,0,0],[0,-1,0],[1,1,1],[2,1,1],[1,2,1],[2,2,1],[0.3,0.4,1],[-0.4,-0.2,0]];
        const test = [[-1.5,-0.5,0],[1.5,0.5,1],[0.2,-0.1,0],[0.4,0.2,1],[-0.2,0.5,1],[0.8,-0.4,0]];
        let w1 = 0, w2 = 0, b = 0;
        for (let epoch = 0; epoch < 250; epoch += 1) {
          train.forEach(([x1,x2,y]) => { const p = 1 / (1 + Math.exp(-(w1*x1+w2*x2+b))); const e = p-y; w1 -= 0.08*e*x1; w2 -= 0.08*e*x2; b -= 0.08*e; });
        }
        const logistic = ([x1,x2]) => (1/(1+Math.exp(-(w1*x1+w2*x2+b))) >= 0.5 ? 1 : 0);
        let bestStump = { errors: Infinity, feature: 0, threshold: 0, direction: 1 };
        for (let feature = 0; feature < 2; feature += 1) {
          const values = [...new Set(train.map((row) => row[feature]))].sort((a, c) => a - c);
          const thresholds = [values[0] - 1, ...values.slice(0, -1).map((value, index) => (value + values[index + 1]) / 2), values[values.length - 1] + 1];
          for (const threshold of thresholds) for (const direction of [1, -1]) {
            const predict = (row) => direction === 1 ? (row[feature] >= threshold ? 1 : 0) : (row[feature] < threshold ? 1 : 0);
            const errors = train.filter((row) => predict(row) !== row[2]).length;
            if (errors < bestStump.errors) bestStump = { errors, feature, threshold, direction };
          }
        }
        const stump = (row) => bestStump.direction === 1 ? (row[bestStump.feature] >= bestStump.threshold ? 1 : 0) : (row[bestStump.feature] < bestStump.threshold ? 1 : 0);
        const knn = ([x1,x2]) => train.map(([a,c,y]) => ({d:(a-x1)**2+(c-x2)**2,y})).sort((m,n)=>m.d-n.d).slice(0,3).reduce((sum,row)=>sum+row.y,0) >= 2 ? 1 : 0;
        const details = test.map(([x1,x2,label], index) => ({ index:index+1,label,logistic:logistic([x1,x2]),stump:stump([x1,x2]),knn:knn([x1,x2]) }));
        const score = (key) => details.filter((row) => row[key] === row.label).length / details.length;
        return { details, scores: { logistic: score("logistic"), stump: score("stump"), knn: score("knn") }, stumpRule: `x${bestStump.feature + 1} ${bestStump.direction === 1 ? ">=" : "<"} ${bestStump.threshold}` };
      },
      formatResult(result) {
        return ["模型 | Accuracy", `Logistic Regression | ${(result.scores.logistic*100).toFixed(1)}%`, `Decision Stump | ${(result.scores.stump*100).toFixed(1)}%`, `k-NN (k=3) | ${(result.scores.knn*100).toFixed(1)}%`, `树桩从训练集学到的规则：${result.stumpRule}`, "", "样本 | 标签 | Logistic | Stump | k-NN", ...result.details.map((row)=>`${row.index} | ${row.label} | ${row.logistic} | ${row.stump} | ${row.knn}`)].join("\n");
      }
    },
    {
      id: "ai-lab-threshold-tradeoff", number: "AI-LAB-05", lessonId: "ai-04-roc-pr-thresholds", title: "分类阈值与 Precision/Recall", environment: "浏览器 JavaScript", duration: 15,
      goal: "在同一组概率分数上移动阈值，观察预测正类数、Precision、Recall 和 F1 的联动变化。",
      inputs: "12 条固定的分数与真实标签，阈值为 0.3、0.5、0.7。",
      evidence: ["每个阈值的混淆矩阵", "Precision、Recall 与 F1", "高漏报成本场景的阈值理由"], controls: [],
      run() {
        const rows = [[.95,1],[.82,1],[.76,0],[.69,1],[.61,0],[.58,1],[.49,0],[.43,1],[.35,0],[.28,1],[.17,0],[.08,0]];
        return [.3,.5,.7].map((threshold) => {
          let tp=0,fp=0,fn=0,tn=0;
          rows.forEach(([score,label])=>{ const pred=score>=threshold?1:0; if(pred&&label)tp++; else if(pred&&!label)fp++; else if(!pred&&label)fn++; else tn++; });
          const precision=tp/(tp+fp||1), recall=tp/(tp+fn||1), f1=2*precision*recall/(precision+recall||1);
          return { threshold,tp,fp,fn,tn,precision,recall,f1,predictedPositive:tp+fp };
        });
      },
      formatResult(result) {
        return ["阈值 | TP FP FN TN | Precision | Recall | F1 | 预测正类", ...result.map((row)=>`${row.threshold.toFixed(1)} | ${row.tp} ${row.fp} ${row.fn} ${row.tn} | ${row.precision.toFixed(3)} | ${row.recall.toFixed(3)} | ${row.f1.toFixed(3)} | ${row.predictedPositive}`), "", "观察：阈值升高时预测正类通常减少，Precision 与 Recall 的变化必须结合错误成本判断。"].join("\n");
      }
    }
  ];

  data.lessons.push(...lessons.map((item, index) => ({ ...item, order: data.lessons.length + index })));
  data.labs.push(...labs);
  for (const moduleId of ["AI-02", "AI-03", "AI-04"]) {
    const module = data.modules.find((item) => item.id === moduleId);
    if (module) module.status = "open";
  }
  const existingReferenceIds = new Set(data.references.map((item) => item.id));
  Object.values(refs).forEach((reference) => { if (!existingReferenceIds.has(reference.id)) data.references.push(reference); });
}());
