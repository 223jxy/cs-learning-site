(function () {
  "use strict";

  const aiData = window.aiZoneData || { lessons: [], labs: [], references: [] };

  const categories = [
    ["ai-overview", "AI 全景与基本方法", "先分清 AI、算法、模型、数据与产品", 20],
    ["ai-math", "数学与统计直觉", "用小数字理解向量、概率、损失与梯度", 34],
    ["ai-data", "数据、样本与特征", "理解模型真正看见的数据及其质量边界", 28],
    ["ai-ml", "经典机器学习", "掌握分类、回归、聚类和可解释基线", 34],
    ["ai-evaluation", "评估与实验方法", "学会用正确指标、切分与错误分析建立证据", 26],
    ["ai-deep-learning", "神经网络与深度学习", "沿张量流理解训练循环和网络结构", 30],
    ["ai-multimodal", "视觉、语音与多模态", "理解图像、语音和多种输入怎样进入模型", 20],
    ["ai-llm", "NLP、Transformer 与 LLM", "从文本表示进入注意力和大语言模型", 40],
    ["ai-applications", "生成式 AI、RAG 与 Agent", "把模型接入检索、工具和工作流", 28],
    ["ai-mlops", "AI 工程与 MLOps", "让实验能够复现、部署、监控和回滚", 22],
    ["ai-governance", "安全、伦理与治理", "识别隐私、偏差、攻击面和责任边界", 20],
    ["ai-runtime", "工具、硬件与运行环境", "看懂 Notebook、框架、CPU、GPU 和依赖环境", 18]
  ].map(([id, title, summary, targetCount], index) => ({ id, title, summary, targetCount, order: index }));

  const paths = [
    ["ai-path-overview", "认识 AI", "从常见产品回到 AI、模型、数据和评价的基本关系"],
    ["ai-path-data", "认识数据", "理解样本、标签、切分、泄漏和数据偏差"],
    ["ai-path-math", "数学不恐惧", "只用必要数学解释 shape、概率、损失和梯度"],
    ["ai-path-ml", "第一个机器学习系统", "完成任务定义、基线、训练、评估和误差分析"],
    ["ai-path-dl", "神经网络入门", "跟踪神经网络一次完整的训练更新"],
    ["ai-path-llm", "大语言模型入门", "从 Token、Attention 进入生成与能力边界"],
    ["ai-path-app", "AI 应用入门", "理解 Prompt、RAG、工具调用和 Agent"],
    ["ai-path-delivery", "交付与责任", "把环境、部署、监控、安全和治理连成闭环"]
  ].map(([id, title, summary], index) => ({ id, title, summary, order: index, guideCount: 3 }));

  const sourceMap = new Map((aiData.references || []).map((source) => [source.id, source]));
  const extraSources = [
    { id: "AIF-S001", title: "Machine Learning Crash Course", provider: "Google for Developers", url: "https://developers.google.com/machine-learning/crash-course" },
    { id: "AIF-S002", title: "Machine Learning Glossary", provider: "Google for Developers", url: "https://developers.google.com/machine-learning/glossary" },
    { id: "AIF-S003", title: "AI for Beginners", provider: "Microsoft", url: "https://microsoft.github.io/AI-For-Beginners/" },
    { id: "AIF-S004", title: "Elements of AI", provider: "University of Helsinki / MinnaLearn", url: "https://www.elementsofai.com/" },
    { id: "AIF-S005", title: "LLM Course", provider: "Hugging Face", url: "https://huggingface.co/learn/llm-course/chapter1/1" },
    { id: "AIF-S006", title: "Machine learning in Python with scikit-learn", provider: "Inria", url: "https://inria.github.io/scikit-learn-mooc/" },
    { id: "AIF-S007", title: "Practical Deep Learning for Coders", provider: "fast.ai", url: "https://course.fast.ai/" },
    { id: "AIF-S008", title: "Made With ML", provider: "Made With ML", url: "https://madewithml.com/" },
    { id: "AIF-S009", title: "Learn the Basics", provider: "PyTorch", url: "https://pytorch.org/tutorials/beginner/basics/intro.html" }
  ];
  extraSources.forEach((source) => {
    if (!sourceMap.has(source.id)) sourceMap.set(source.id, source);
  });
  const sources = [...sourceMap.values()];

  const englishNames = {
    "人工智能": "Artificial Intelligence", "机器学习": "Machine Learning", "模型": "Model", "智能体": "Agent",
    "规则": "Rule", "特征": "Feature", "权重": "Weight", "泛化": "Generalization", "样本单位": "Unit of Observation",
    "目标变量": "Target Variable", "基线": "Baseline", "验收指标": "Acceptance Metric", "参数": "Parameter",
    "超参数": "Hyperparameter", "损失函数": "Loss Function", "推理": "Inference", "监督学习": "Supervised Learning",
    "无监督学习": "Unsupervised Learning", "强化学习": "Reinforcement Learning", "标签": "Label", "验证集": "Validation Set",
    "测试集": "Test Set", "误差分析": "Error Analysis", "可复现性": "Reproducibility", "生命周期": "Lifecycle",
    "分布漂移": "Distribution Shift", "人工监督": "Human Oversight", "回滚": "Rollback", "标量": "Scalar",
    "向量": "Vector", "矩阵": "Matrix", "张量": "Tensor", "函数": "Function", "预测值": "Prediction",
    "均方误差": "Mean Squared Error", "目标函数": "Objective Function", "梯度": "Gradient", "学习率": "Learning Rate",
    "前向计算": "Forward Pass", "参数更新": "Parameter Update", "点积": "Dot Product", "矩阵乘法": "Matrix Multiplication",
    "线性变换": "Linear Transformation", "基": "Basis", "均值": "Mean", "方差": "Variance", "协方差": "Covariance",
    "标准化": "Standardization", "条件概率": "Conditional Probability", "贝叶斯公式": "Bayes' Theorem",
    "似然": "Likelihood", "独立": "Independence", "偏导数": "Partial Derivative", "链式法则": "Chain Rule",
    "数值稳定性": "Numerical Stability", "样本": "Sample", "训练集": "Training Set", "切分单元": "Split Unit",
    "缺失值": "Missing Value", "异常值": "Outlier", "重复样本": "Duplicate Sample", "标签噪声": "Label Noise",
    "编码": "Encoding", "缩放": "Scaling", "目标泄漏": "Target Leakage", "时间穿越": "Look-ahead Leakage",
    "实体泄漏": "Entity Leakage", "预处理泄漏": "Preprocessing Leakage", "类别不平衡": "Class Imbalance",
    "采样偏差": "Sampling Bias", "代表性": "Representativeness", "类别权重": "Class Weight",
    "数据版本": "Data Version", "数据血缘": "Data Lineage", "实验记录": "Experiment Record",
    "线性回归": "Linear Regression", "系数": "Coefficient", "残差": "Residual", "决策阈值": "Decision Threshold",
    "正则化": "Regularization", "距离度量": "Distance Metric", "邻居数 k": "Number of Neighbors k",
    "维度灾难": "Curse of Dimensionality", "决策树": "Decision Tree", "分裂": "Split", "不纯度": "Impurity",
    "叶节点": "Leaf Node", "特征随机性": "Feature Randomness", "集成": "Ensemble", "聚类": "Clustering",
    "无监督边界": "Limits of Unsupervised Learning", "比较协议": "Comparison Protocol", "错误样本": "Error Example",
    "欠拟合": "Underfitting", "过拟合": "Overfitting", "偏差": "Bias", "交叉验证": "Cross-validation",
    "分层切分": "Stratified Split", "分组切分": "Group Split", "混淆矩阵": "Confusion Matrix",
    "阈值": "Threshold", "残差图": "Residual Plot", "校准": "Calibration", "可靠性图": "Reliability Diagram",
    "置信度": "Confidence", "不确定性": "Uncertainty", "评估切片": "Evaluation Slice",
    "错误分类法": "Error Taxonomy", "置信区间": "Confidence Interval", "基线比较": "Baseline Comparison",
    "神经元": "Neuron", "线性层": "Linear Layer", "激活函数": "Activation Function", "表达能力": "Expressive Capacity",
    "前向传播": "Forward Propagation", "计算图": "Computational Graph", "反向传播": "Backpropagation",
    "自动微分": "Automatic Differentiation", "梯度累积": "Gradient Accumulation", "优化器": "Optimizer",
    "初始化": "Initialization", "归一化层": "Normalization Layer", "权重衰减": "Weight Decay",
    "训练循环": "Training Loop", "验证循环": "Validation Loop", "早停": "Early Stopping", "显存": "GPU Memory",
    "混合精度": "Mixed Precision", "梯度缩放": "Gradient Scaling", "像素": "Pixel", "通道": "Channel",
    "归一化": "Normalization", "数据增广": "Data Augmentation", "卷积核": "Convolution Kernel",
    "感受野": "Receptive Field", "特征图": "Feature Map", "下采样": "Downsampling", "分类头": "Classification Head",
    "全局平均池化": "Global Average Pooling", "错误图库": "Error Gallery", "边界框": "Bounding Box",
    "迁移学习": "Transfer Learning", "预训练模型": "Pretrained Model", "冻结": "Freezing", "微调": "Fine-tuning",
    "鲁棒性": "Robustness", "遮挡": "Occlusion", "分辨率变化": "Resolution Shift", "对抗性输入": "Adversarial Input",
    "文本规范化": "Text Normalization", "分词": "Tokenization", "词表": "Vocabulary", "未知词": "Out-of-vocabulary Token",
    "词袋": "Bag of Words", "稀疏矩阵": "Sparse Matrix", "余弦相似度": "Cosine Similarity",
    "分布假设": "Distributional Hypothesis", "静态表示": "Static Representation", "序列": "Sequence",
    "位置表示": "Positional Representation", "上下文": "Context", "文本分类": "Text Classification",
    "序列标注": "Sequence Labeling", "抽取式问答": "Extractive Question Answering", "生成式问答": "Generative Question Answering",
    "隐藏状态": "Hidden State", "语言覆盖": "Language Coverage", "分词覆盖": "Tokenizer Coverage", "数据偏差": "Data Bias",
    "上下文窗口": "Context Window", "缩放点积注意力": "Scaled Dot-product Attention", "位置编码": "Positional Encoding",
    "残差连接": "Residual Connection", "预训练": "Pretraining", "上下文学习": "In-context Learning",
    "指令微调": "Instruction Tuning", "偏好优化": "Preference Optimization", "幻觉": "Hallucination",
    "对齐边界": "Alignment Limit", "输入契约": "Input Contract", "业务校验": "Business Validation",
    "有限重试": "Bounded Retry", "切块": "Chunking", "向量索引": "Vector Index", "元数据过滤": "Metadata Filtering",
    "引用链路": "Citation Chain", "上下文相关性": "Context Relevance", "答案忠实度": "Answer Faithfulness",
    "无答案评价": "Unanswerable Evaluation", "终止条件": "Termination Condition", "最小权限": "Least Privilege",
    "可观测性": "Observability", "运行环境": "Runtime Environment", "依赖锁定": "Dependency Pinning",
    "随机种子": "Random Seed", "复现容差": "Reproducibility Tolerance", "血缘": "Lineage",
    "实验追踪": "Experiment Tracking", "模型注册": "Model Registry", "晋级门槛": "Promotion Gate",
    "批处理推理": "Batch Inference", "在线推理": "Online Inference", "模型签名": "Model Signature",
    "运行时兼容": "Runtime Compatibility", "数据漂移": "Data Drift", "概念漂移": "Concept Drift",
    "训练-服务偏差": "Training-serving Skew", "告警": "Alert", "再训练触发": "Retraining Trigger",
    "使用情境": "Context of Use", "利益相关者": "Stakeholder", "影响分级": "Impact Tier",
    "风险容忍度": "Risk Tolerance", "数据最小化": "Data Minimization", "目的限制": "Purpose Limitation",
    "保留期限": "Retention Period", "敏感信息泄露": "Sensitive Information Disclosure", "分组指标": "Group Metric",
    "公平性": "Fairness", "交叉切片": "Intersectional Slice", "透明度": "Transparency", "可解释性": "Explainability",
    "可质疑性": "Contestability", "系统文档": "System Documentation", "不安全输出处理": "Unsafe Output Handling",
    "过度授权": "Excessive Agency", "资源失控": "Unbounded Resource Consumption", "供应链": "Supply Chain",
    "来源证明": "Provenance", "完整性校验": "Integrity Verification", "数据/模型投毒": "Data or Model Poisoning",
    "算法": "Algorithm", "数据集": "Dataset", "大语言模型": "Large Language Model", "人工神经网络": "Artificial Neural Network", "训练数据": "Training Data",
    "评估数据": "Evaluation Data", "模型服务": "Model Serving", "向量数据库": "Vector Database",
    "大模型": "Foundation Model", "生成式人工智能": "Generative AI", "多模态模型": "Multimodal Model"
  };

  const abbreviationMap = {
    "人工智能": "AI", "机器学习": "ML", "大语言模型": "LLM", "均方误差": "MSE", "Logistic Regression": "LR",
    "k-NN": "k-NN", "Random Forest": "RF", "k-means": "k-means", "PCA": "PCA", "Pipeline": "Pipeline",
    "Precision": "Precision", "Recall": "Recall", "F1": "F1", "ROC 曲线": "ROC", "PR 曲线": "PR",
    "AUC": "AUC", "MAE": "MAE", "MSE": "MSE", "RMSE": "RMSE", "GPU": "GPU", "IoU": "IoU",
    "NMS": "NMS", "mAP": "mAP", "One-hot": "One-hot", "TF-IDF": "TF-IDF", "Embedding": "Embedding",
    "RNN": "RNN", "BPTT": "BPTT", "LSTM": "LSTM", "Token": "Token", "Tokenizer": "Tokenizer",
    "Query": "Q", "Key": "K", "Value": "V", "Multi-head Attention": "MHA", "Encoder": "Encoder",
    "Decoder": "Decoder", "Masked Language Modeling": "MLM", "Next-token Prediction": "NTP", "Top-p": "Top-p",
    "Prompt": "Prompt", "Prompt Injection": "Prompt Injection", "Structured Output": "Structured Output",
    "Schema": "Schema", "RAG": "RAG", "Retriever": "Retriever", "Reranker": "Reranker",
    "Recall@k": "Recall@k", "Tool Calling": "Tool Calling", "Workflow": "Workflow", "Agent": "Agent",
    "Orchestration": "Orchestration", "实验 Run": "Run", "Artifact": "Artifact", "Model Card": "Model Card",
    "Smoke Test": "Smoke Test", "ONNX Graph": "ONNX", "Operator": "Operator", "Opset": "Opset",
    "Shadow": "Shadow", "Canary": "Canary", "Govern": "Govern", "Map": "Map", "Measure": "Measure", "Manage": "Manage"
  };

  const moduleCategory = {
    "AI-00": "ai-overview", "AI-01": "ai-math", "AI-02": "ai-data", "AI-03": "ai-ml",
    "AI-04": "ai-evaluation", "AI-05": "ai-deep-learning", "AI-06": "ai-multimodal", "AI-07": "ai-llm",
    "AI-08": "ai-llm", "AI-09": "ai-applications", "AI-10": "ai-mlops", "AI-11": "ai-governance"
  };

  const categoryPatterns = {
    "ai-runtime": /GPU|显存|混合精度|运行环境|依赖|随机种子|复现容差|Jupyter|Notebook|CPU|框架|API|Operator|Opset|运行时|模型服务/,
    "ai-governance": /风险|隐私|公平|偏差|治理|安全|投毒|泄露|透明|解释|监督|利益相关者|影响|最小权限|授权|完整性|来源证明|供应链|数据最小化|目的限制|保留期限|可质疑/,
    "ai-mlops": /版本|血缘|实验追踪|模型注册|Artifact|Run|部署|监控|漂移|告警|Shadow|Canary|回滚|再训练|批处理推理|在线推理|模型签名|Smoke Test|ONNX/,
    "ai-applications": /Prompt|RAG|Retriever|Reranker|引用|忠实度|Tool Calling|Workflow|Agent|Orchestration|Structured Output|Schema|切块|向量索引|元数据过滤|终止条件|上下文相关性|无答案/,
    "ai-llm": /文本|词|Token|Embedding|序列|RNN|LSTM|Attention|Query|Key|Value|位置|Encoder|Decoder|Mask|Language|预训练|上下文|Decoding|Temperature|Top-p|指令|偏好|幻觉|对齐/,
    "ai-multimodal": /像素|通道|图像|卷积|Stride|Padding|感受野|特征图|池化|Top-|错误图库|边界框|IoU|NMS|mAP|迁移学习|遮挡|分辨率|对抗性|多模态/,
    "ai-deep-learning": /神经|线性层|激活|前向|计算图|logits|reduction|反向|自动微分|梯度累积|Batch|Epoch|优化器|初始化|归一化层|Dropout|权重衰减|训练循环|验证循环|Checkpoint|早停/,
    "ai-evaluation": /评估|误差|验证集|测试集|泛化|欠拟合|过拟合|交叉验证|混淆矩阵|Precision|Recall|F1|ROC|PR|AUC|阈值|MAE|MSE|RMSE|残差图|校准|可靠性|置信|切片|基线比较/,
    "ai-ml": /线性回归|Logistic|sigmoid|正则化|k-NN|距离|邻居|维度灾难|决策树|分裂|不纯度|叶节点|Random Forest|bootstrap|集成|聚类|k-means|PCA|Pipeline|分类|回归/,
    "ai-data": /样本|目标变量|特征|标签|训练集|切分|缺失|异常|重复|噪声|编码|缩放|泄漏|类别不平衡|采样偏差|代表性|Dataset Card|数据集|数据版本|数据血缘/,
    "ai-math": /标量|向量|矩阵|张量|函数|均方误差|目标函数|梯度|学习率|点积|线性变换|基$|均值|方差|协方差|标准化|概率|贝叶斯|似然|独立|偏导|链式|数值稳定/,
    "ai-overview": /人工智能|机器学习|模型|智能体|规则|基线|参数|超参数|监督学习|无监督学习|强化学习|生命周期|算法|生成式人工智能|大模型/
  };

  function normalizeTermName(name) {
    return String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  function getEnglishName(name) {
    if (englishNames[name]) return englishNames[name];
    if (/^[\x00-\x7F]+$/.test(name)) return name;
    return name;
  }

  function getAbbreviation(name, englishName) {
    if (abbreviationMap[name]) return abbreviationMap[name];
    if (/^[A-Z][A-Z0-9@-]{1,12}$/.test(name)) return name;
    if (englishName !== name) {
      const words = englishName.match(/[A-Za-z]+/g) || [];
      const candidate = words.map((word) => word[0]).join("").toUpperCase();
      if (candidate.length >= 2 && candidate.length <= 6) return candidate;
    }
    return "";
  }

  function getCategoryScore(term, categoryId) {
    let score = moduleCategory[term.primaryModuleId] === categoryId ? 5 : 0;
    if (categoryPatterns[categoryId]?.test(term.name)) score += 10;
    if (categoryPatterns[categoryId]?.test(term.definition)) score += 3;
    return score;
  }

  function assignCategories(terms) {
    const unassigned = new Set(terms);
    const assignmentOrder = [
      "ai-runtime", "ai-governance", "ai-mlops", "ai-applications", "ai-multimodal", "ai-llm",
      "ai-deep-learning", "ai-evaluation", "ai-ml", "ai-data", "ai-math", "ai-overview"
    ];
    assignmentOrder.forEach((categoryId) => {
      const target = categories.find((category) => category.id === categoryId).targetCount;
      [...unassigned]
        .sort((a, b) => getCategoryScore(b, categoryId) - getCategoryScore(a, categoryId) || a.order - b.order)
        .slice(0, target)
        .forEach((term) => {
          term.categoryId = categoryId;
          unassigned.delete(term);
        });
    });
  }

  const termSeeds = [];
  const seedByName = new Map();
  (aiData.lessons || []).forEach((lesson) => {
    (lesson.concepts || []).forEach(([name, definition]) => {
      const key = normalizeTermName(name);
      let seed = seedByName.get(key);
      if (!seed) {
        seed = {
          name,
          definition,
          order: termSeeds.length,
          primaryModuleId: lesson.moduleId,
          occurrences: []
        };
        seedByName.set(key, seed);
        termSeeds.push(seed);
      }
      seed.occurrences.push({ lesson, definition });
    });
  });

  const extraTerms = [
    ["算法", "为解决一类问题而定义的有限步骤与规则。"],
    ["数据集", "围绕特定任务组织的一组样本、标签、元数据和说明。"],
    ["大语言模型", "在大规模文本数据上训练、以 Token 序列建模为核心的语言模型。"],
    ["生成式人工智能", "根据输入条件生成文本、图像、音频或其他内容的 AI 系统。"],
    ["多模态模型", "能够接收、关联或生成两种以上数据模态的模型。"],
    ["人工神经网络", "由可训练层和连接组成的参数化模型家族。"],
    ["训练数据", "训练阶段用于更新模型参数的数据。"],
    ["评估数据", "用于估计模型在未参与当前参数更新的数据上表现的数据。"],
    ["模型服务", "把模型包装为批处理任务或在线接口供其他系统调用。"],
    ["向量数据库", "针对向量相似度检索和相关元数据过滤优化的存储系统。"],
    ["大模型", "具有较大参数规模、通常在广泛数据上预训练并可适配多种任务的模型。"]
  ];
  for (const [name, definition] of extraTerms) {
    if (termSeeds.length >= 320) break;
    if (seedByName.has(normalizeTermName(name))) continue;
    const seed = { name, definition, order: termSeeds.length, primaryModuleId: "AI-00", occurrences: [] };
    seedByName.set(normalizeTermName(name), seed);
    termSeeds.push(seed);
  }

  assignCategories(termSeeds);

  const terms = termSeeds.slice(0, 320).map((seed, index) => {
    const first = seed.occurrences[0];
    const lesson = first?.lesson;
    const relatedNames = lesson?.concepts?.map(([name]) => name).filter((name) => name !== seed.name) || [];
    const referenceIds = [...new Set((seed.occurrences.length ? seed.occurrences : [{ lesson: aiData.lessons[0] }])
      .flatMap((item) => item.lesson?.references || [])
      .map((source) => source.id)
      .filter(Boolean))];
    const example = lesson?.workedExamples?.[0];
    const englishName = getEnglishName(seed.name);
    return {
      id: `ai-term-${String(index + 1).padStart(3, "0")}`,
      nameZh: seed.name,
      nameEn: englishName,
      abbreviation: getAbbreviation(seed.name, englishName),
      aliases: [...new Set([englishName, abbreviationMap[seed.name]].filter((alias) => alias && alias !== seed.name))],
      categoryId: seed.categoryId,
      level: lesson?.level || (seed.categoryId === "ai-overview" ? "零基础" : "基础"),
      order: index,
      quickDefinition: seed.definition,
      plainExplanation: `先把“${seed.name}”理解为：${seed.definition} 学习时先找它在输入、处理和输出链路中的位置，不必一开始背完整公式。`,
      technicalDefinition: lesson?.deepDive?.find((paragraph) => paragraph.includes(seed.name)) || seed.definition,
      analogy: example ? `${example.title}：${example.steps?.[0] || seed.definition}` : `它像完整 AI 链路中的一个有明确职责的零件，必须结合输入、输出和评价方式理解。`,
      example: example ? example.steps.join(" → ") : `在一个最小任务中，指出“${seed.name}”对应的数据、计算或判断位置。`,
      misconception: lesson?.misconceptions?.[0] || `只记住“${seed.name}”的名称，而没有说明它解决什么问题、依赖什么输入。`,
      confusion: relatedNames.slice(0, 2),
      limitations: lesson?.limits?.slice(0, 2) || ["定义必须结合具体任务和使用情境解释。"],
      relatedTermIds: [],
      lessonIds: [...new Set(seed.occurrences.map((item) => item.lesson.id))],
      guideIds: [],
      labIds: [...new Set(seed.occurrences.map((item) => item.lesson.labId).filter(Boolean))],
      sourceIds: referenceIds.length ? referenceIds.slice(0, 3) : ["AIF-S001"],
      keywords: [...new Set([seed.name, englishName, abbreviationMap[seed.name], lesson?.title, lesson?.moduleId].filter(Boolean))]
    };
  });

  const termByName = new Map(terms.map((term) => [normalizeTermName(term.nameZh), term]));
  terms.forEach((term) => {
    const related = new Set();
    term.lessonIds.forEach((lessonId) => {
      const lesson = aiData.lessons.find((item) => item.id === lessonId);
      (lesson?.concepts || []).forEach(([name]) => {
        const target = termByName.get(normalizeTermName(name));
        if (target && target.id !== term.id) related.add(target.id);
      });
    });
    term.relatedTermIds = [...related].slice(0, 6);
  });

  const guideSpecs = [
    ["aif-guide-01", "ai-path-overview", "AI、机器学习和深度学习是什么关系", "聊天模型只是 AI 的一个分支，怎样看清完整范围？", ["人工智能", "机器学习", "模型", "监督学习", "强化学习", "生成式人工智能"], ["ai-00-overview"], "用三个同心圆写出 AI、机器学习和深度学习的包含关系，再把一个聊天应用放到正确位置。", "AI 是更大的问题领域，机器学习是其中一类方法，深度学习又是机器学习的一类方法。"],
    ["aif-guide-02", "ai-path-overview", "规则程序和学习系统怎样选择", "什么时候写 if/else，什么时候训练模型？", ["规则", "特征", "权重", "泛化", "基线", "算法"], ["ai-00-rules-vs-learning"], "为垃圾邮件判断写两条规则，再列出规则没有覆盖的两个表达。", "边界明确、必须审计的条件常适合规则；模式复杂且有代表性样本时才考虑学习系统。"],
    ["aif-guide-03", "ai-path-overview", "数据、模型和 AI 产品怎样连起来", "一个能使用的 AI 产品除了模型还需要什么？", ["数据集", "模型", "训练", "推理", "验收指标", "生命周期"], ["ai-00-model-training-inference", "ai-00-lifecycle-risk"], "画出输入→预处理→模型→后处理→用户界面→反馈的六步链路。", "模型只是产品链路中的计算组件，数据、接口、权限、评价和监控共同决定结果。"],
    ["aif-guide-04", "ai-path-data", "样本、特征和标签", "表格里的一行、一列和答案分别是什么？", ["样本", "样本单位", "特征", "标签", "目标变量", "数据类型"], ["ai-02-samples-features-labels"], "用三名学生的学习记录设计一个小表，明确每行代表谁、输入列是什么、目标列是什么。", "先固定样本单位和预测时点，再决定特征和标签，能避免一行数据代表多个对象。"],
    ["aif-guide-05", "ai-path-data", "训练集、验证集和测试集", "为什么不能在同一套题上练习、选答案又宣布成绩？", ["训练集", "验证集", "测试集", "切分单元", "交叉验证", "可复现性"], ["ai-02-train-validation-test", "ai-04-cross-validation"], "把 100 条带时间的数据按 60/20/20 划分，并说明为什么随机打乱可能泄漏未来信息。", "训练集更新参数，验证集选择方案，测试集在方案冻结后估计最终表现。"],
    ["aif-guide-06", "ai-path-data", "数据质量、泄漏和偏差", "模型分数很高，为什么仍可能完全不可用？", ["数据泄漏", "目标泄漏", "时间穿越", "标签噪声", "采样偏差", "代表性"], ["ai-02-data-quality", "ai-02-data-leakage", "ai-02-imbalance-representativeness"], "检查一张数据表，圈出预测时拿不到的列、重复实体和缺失标签。", "泄漏会让模型提前看到答案，偏差会让数据不能代表真实用户，两者都会制造虚假信心。"],
    ["aif-guide-07", "ai-path-math", "向量、矩阵、张量和 shape", "为什么 AI 代码总在打印 shape？", ["标量", "向量", "矩阵", "张量", "矩阵乘法", "Batch"], ["ai-01-vectors-tensors", "ai-01-dot-products-linear-maps"], "写出 32 张 28×28 灰度图像的四个轴，并判断 (32,784)×(784,10) 的输出 shape。", "shape 同时说明每个轴的长度和语义，是检查数据能否进入下一层的第一证据。"],
    ["aif-guide-08", "ai-path-math", "概率、均值、方差和不确定性", "一个 80% 概率到底表达什么？", ["均值", "方差", "条件概率", "贝叶斯公式", "置信度", "不确定性"], ["ai-01-probability-bayes-likelihood", "ai-04-calibration-uncertainty"], "比较两组平均分相同但波动不同的数据，并解释只看平均值丢失了什么。", "概率和统计量描述当前假设与数据下的不确定性，不是对单次事件的绝对保证。"],
    ["aif-guide-09", "ai-path-math", "损失、梯度和学习率", "模型怎样知道参数该往哪边调？", ["损失函数", "梯度", "梯度下降", "学习率", "参数更新", "数值稳定性"], ["ai-01-gradient-step", "ai-05-backprop-autograd"], "用 w←w-ηg，分别代入 η=0.01 和 η=0.5，比较一步更新是否越过最低点。", "损失衡量当前误差，梯度给出局部变化方向，学习率控制每一步走多远。"],
    ["aif-guide-10", "ai-path-ml", "分类、回归和聚类", "不同任务为什么需要不同输出和指标？", ["监督学习", "无监督学习", "线性回归", "Logistic Regression", "聚类", "k-means"], ["ai-00-learning-types", "ai-03-linear-regression", "ai-03-logistic-regression"], "把房价预测、垃圾邮件识别和用户分群分别归入回归、分类和聚类。", "任务类型由目标和反馈决定，不由算法名字决定。"],
    ["aif-guide-11", "ai-path-ml", "基线、Pipeline 和公平比较", "为什么复杂模型要先和简单方法比？", ["基线", "Pipeline", "比较协议", "预处理泄漏", "交叉验证", "实验记录"], ["ai-03-pipeline-baselines", "ai-04-cross-validation"], "为一个二分类任务写多数类基线、固定数据切分和统一预处理流程。", "没有统一数据、预处理和指标的比较，模型分数没有可解释性。"],
    ["aif-guide-12", "ai-path-ml", "过拟合、指标和错误分析", "训练分数很高，为什么新数据表现变差？", ["过拟合", "欠拟合", "混淆矩阵", "Precision", "Recall", "误差分析"], ["ai-04-under-overfitting", "ai-04-classification-metrics", "ai-04-slices-significance"], "为漏报代价更高的任务选择指标，并从混淆矩阵找出需要复查的错误类型。", "总体分数只是入口，可靠结论还要看独立数据、错误样本和不同切片。"],
    ["aif-guide-13", "ai-path-dl", "神经元、线性层和激活函数", "神经网络的一层到底计算了什么？", ["神经元", "线性层", "激活函数", "权重", "偏差", "表达能力"], ["ai-05-neurons-layers-activations"], "用两个输入、两组权重和一个偏置手算线性输出，再经过 ReLU。", "线性层先做加权求和，激活函数引入非线性，多层组合才能表示复杂关系。"],
    ["aif-guide-14", "ai-path-dl", "前向传播和反向传播", "一次训练更新经历哪些步骤？", ["前向传播", "计算图", "logits", "损失函数", "反向传播", "自动微分"], ["ai-05-forward-loss-graph", "ai-05-backprop-autograd"], "按 forward→loss→zero_grad→backward→step 排列训练步骤，并说明漏掉清零会发生什么。", "前向计算输出与损失，反向传播沿计算图计算梯度，优化器再更新参数。"],
    ["aif-guide-15", "ai-path-dl", "Batch、Epoch、优化器和 checkpoint", "模型训练为什么不是一次把全部数据算完？", ["Batch", "Epoch", "优化器", "训练循环", "验证循环", "Checkpoint"], ["ai-05-batch-epoch-optimizer", "ai-05-training-loop"], "给 1000 条样本和 batch size 100，计算每个 epoch 有多少次参数更新。", "Batch 控制一次计算的数据量，Epoch 表示完整遍历，checkpoint 保存可恢复的模型状态。"],
    ["aif-guide-16", "ai-path-llm", "Token、Tokenizer 和上下文窗口", "模型为什么按 Token 而不是按自然语言中的词工作？", ["Token", "Tokenizer", "词表", "上下文窗口", "未知词", "分词覆盖"], ["ai-08-tokens-tokenizers-context", "ai-07-normalization-tokenization"], "把同一句中英文文本分别按字符、词和子词切分，比较数量与信息损失。", "Tokenizer 把文本变成 Token ID；上下文窗口限制一次推理能够直接处理的 Token 数量。"],
    ["aif-guide-17", "ai-path-llm", "Attention 和 Transformer", "模型怎样让当前位置参考其他位置？", ["Query", "Key", "Value", "缩放点积注意力", "Multi-head Attention", "Transformer"], ["ai-08-qkv-attention", "ai-08-multihead-position-residual"], "用三个词的小矩阵观察 softmax 后每行权重和为什么等于 1。", "Attention 用 Query 与 Key 计算权重，再加权汇总 Value；Transformer 把注意力与前馈层等结构组合起来。"],
    ["aif-guide-18", "ai-path-llm", "生成、Temperature、幻觉和对齐", "语言模型为什么会流畅地说错？", ["Next-token Prediction", "Temperature", "Top-p", "指令微调", "幻觉", "对齐边界"], ["ai-08-decoding-strategies", "ai-08-instruction-alignment-boundaries"], "比较低温度和高温度下三个候选 Token 的采样分布，并记录稳定性变化。", "模型依据上下文生成概率分布；流畅度不等于事实正确，解码和对齐也不会消除所有错误。"],
    ["aif-guide-19", "ai-path-app", "Prompt、输入契约和结构化输出", "怎样让模型输出能被程序可靠处理？", ["Prompt", "输入契约", "Structured Output", "Schema", "业务校验", "有限重试"], ["ai-09-prompt-contracts", "ai-09-structured-output-validation"], "为课程摘要写一个包含输入字段、输出 schema、失败状态和长度限制的契约。", "Prompt 负责描述任务，schema 约束结构，业务校验仍需在模型外执行。"],
    ["aif-guide-20", "ai-path-app", "Embedding、向量检索和 RAG", "模型怎样先查资料再回答？", ["Embedding", "余弦相似度", "切块", "向量索引", "RAG", "引用链路"], ["ai-09-embeddings-chunks-indexes", "ai-09-rag-retrieve-rerank-cite"], "把一篇短文切成三段，为问题选择最相关片段，并要求答案标明片段编号。", "RAG 把检索证据放进生成上下文；它需要同时评估检索命中、上下文相关性和答案忠实度。"],
    ["aif-guide-21", "ai-path-app", "Tool Calling、Workflow 和 Agent", "模型调用工具与真正的 Agent 有什么区别？", ["Tool Calling", "Workflow", "Agent", "Agent 状态", "终止条件", "最小权限"], ["ai-09-tools-workflows-agents", "ai-09-agent-state-permissions-observability"], "把“查天气→生成建议”和“循环搜索直到满足条件”分别画成 Workflow 与 Agent 状态图。", "Tool Calling 是一次结构化请求；Workflow 是预定义流程；Agent 还要管理状态、选择动作和终止条件。"],
    ["aif-guide-22", "ai-path-delivery", "CPU、GPU、API 和运行环境", "为什么同一份模型代码在另一台电脑上会失败？", ["运行环境", "依赖锁定", "GPU", "显存", "混合精度", "模型服务"], ["ai-05-gpu-memory-mixed-precision", "ai-10-reproducible-environments"], "记录 Python、框架、模型、设备和依赖版本，写出 CPU 回退方案。", "模型运行依赖代码、权重、预处理、框架和硬件；版本与设备差异必须进入交付记录。"],
    ["aif-guide-23", "ai-path-delivery", "版本、部署、监控和回滚", "模型上线后怎样知道它仍然可靠？", ["模型注册", "Model Card", "在线推理", "Smoke Test", "数据漂移", "回滚"], ["ai-10-tracking-registry-model-card", "ai-10-batch-online-serving", "ai-10-drift-monitoring-alerts"], "为候选模型写版本号、最低准确率、最大延迟和一条回滚条件。", "交付需要固定版本、接口契约、发布门槛、监控信号和可执行回滚。"],
    ["aif-guide-24", "ai-path-delivery", "隐私、安全、公平和治理", "技术上能做的 AI 功能是否就应该直接上线？", ["数据最小化", "公平性", "Prompt Injection", "敏感信息泄露", "人工监督", "Govern"], ["ai-11-privacy-minimization-retention", "ai-11-fairness-slices-representation", "ai-11-llm-application-security", "ai-11-nist-risk-incident-response"], "列出一个 AI 功能的用户、数据、最坏后果、人工确认点和停止条件。", "治理从用途和影响对象开始，贯穿数据、模型、集成、部署、监控和事件处理。"]
  ];

  function makeGuideQuiz(spec, termIds) {
    const firstTerm = terms.find((term) => term.id === termIds[0]);
    return [
      {
        question: "这篇入门教程首先希望你建立什么能力？",
        options: [spec[3], "记住全部厂商和产品名称", "跳过数据直接选择最大模型", "只保留一次成功截图"],
        answer: 0,
        explanation: "入门教程以真实问题和可验证能力为起点。"
      },
      {
        question: `“${firstTerm?.nameZh || "核心术语"}”更接近哪项解释？`,
        options: [firstTerm?.quickDefinition || spec[7], "任何自动运行的软件", "只在论文中出现的名称", "一种固定的网页样式"],
        answer: 0,
        explanation: firstTerm?.quickDefinition || spec[7]
      },
      {
        question: "完成小练习后，哪种记录最有助于复查？",
        options: ["输入、步骤、输出、错误现象和判断依据", "只写“已经看懂”", "只复制最终答案", "删掉失败过程"],
        answer: 0,
        explanation: "学习证据需要保留上下文、过程、输出和验收条件。"
      }
    ];
  }

  const guides = guideSpecs.map((spec, index) => {
    const [id, pathId, title, question, termNames, lessonIds, practice, takeaway] = spec;
    const termIds = termNames.map((name) => termByName.get(normalizeTermName(name))?.id).filter(Boolean);
    const sourceIds = [...new Set(lessonIds.flatMap((lessonId) => aiData.lessons.find((lesson) => lesson.id === lessonId)?.references || []).map((source) => source.id))];
    return {
      id, pathId, title, number: `AIF-${String(index + 1).padStart(2, "0")}`, order: index,
      duration: 18 + (index % 3) * 4,
      level: "零基础",
      question,
      quickView: takeaway,
      prerequisites: index < 3 ? ["会使用浏览器打开课程。", "愿意用自己的话复述概念。"] : ["建议先完成同一路径的上一篇教程。", "不要求提前背公式或安装框架。"],
      objectives: [`能用自己的话回答：${question}`, `能解释 ${termNames.slice(0, 3).join("、")} 的关系。`, "能完成最小练习并记录证据。"],
      scenario: `你正在判断或搭建一个真实 AI 功能，需要先回答：${question}`,
      steps: [
        `先写出问题中的输入、输出和判断标准。`,
        `找到 ${termNames.slice(0, 3).join("、")} 在链路中的位置。`,
        `用最小例子检查结论，不先追求复杂模型。`,
        `记录失败条件，再进入关联正式课程。`
      ],
      demo: takeaway,
      practice,
      expected: `能够完成任务，并用一句话说明 ${termNames[0]} 与 ${termNames[1]} 的区别。`,
      errorExample: `只复制名词解释，没有指出输入、输出、证据或适用边界。`,
      misconception: `把“看过术语”当成“已经会用”；正确做法是完成练习并解释结果。`,
      nextStep: lessonIds,
      termIds,
      sourceIds: sourceIds.length ? sourceIds.slice(0, 4) : ["AIF-S001", "AIF-S003"],
      quiz: []
    };
  });
  guides.forEach((guide, index) => {
    guide.quiz = makeGuideQuiz(guideSpecs[index], guide.termIds);
    guide.termIds.forEach((termId) => {
      const term = terms.find((item) => item.id === termId);
      if (term && !term.guideIds.includes(guide.id)) term.guideIds.push(guide.id);
    });
  });

  (aiData.lessons || []).forEach((lesson) => {
    lesson.termIds = (lesson.concepts || [])
      .map(([name]) => termByName.get(normalizeTermName(name))?.id)
      .filter(Boolean)
      .slice(0, 8);
    const modulePathMap = {
      "AI-00": "ai-path-overview", "AI-01": "ai-path-math", "AI-02": "ai-path-data", "AI-03": "ai-path-ml",
      "AI-04": "ai-path-ml", "AI-05": "ai-path-dl", "AI-06": "ai-path-dl", "AI-07": "ai-path-llm",
      "AI-08": "ai-path-llm", "AI-09": "ai-path-app", "AI-10": "ai-path-delivery", "AI-11": "ai-path-delivery"
    };
    const relatedGuides = guides
      .filter((guide) => guide.nextStep.includes(lesson.id) || guide.termIds.some((termId) => lesson.termIds.includes(termId)))
      .map((guide) => guide.id)
      .slice(0, 3);
    const fallbackGuides = guides.filter((guide) => guide.pathId === modulePathMap[lesson.moduleId]).map((guide) => guide.id);
    lesson.guideIds = [...new Set([...relatedGuides, ...fallbackGuides])].slice(0, 3);
  });

  window.aiFoundationData = {
    categories,
    paths,
    terms,
    guides,
    sources,
    meta: {
      version: 1,
      termCount: terms.length,
      guideCount: guides.length,
      generatedFromLessonCount: aiData.lessons.length,
      sourceCheckedAt: "2026-07-27"
    }
  };
})();
