# AI 专区知识库

## 1. 文档目标

本知识库是“计算机学习地图”新增 AI 专区的内容基线。它负责回答四个问题：

1. AI 知识之间是什么关系。
2. 零基础学习者应按什么顺序学习。
3. 每个知识模块应讲到什么深度、配什么实验。
4. 课程事实和工程建议分别依据哪些原始资料。

本文不是课程正文，也不是链接收藏夹。后续课程必须从这里选择知识点、实验和引用，再按《课程高密度改造标准》展开正文。

## 2. 与现有内容的边界

现有“AI 与数据工程”专业方向包含 20 节方向课程，重点是 Python 数据栈、数据清洗、监督学习、模型评估、模型服务和监控。AI 专区采用以下边界：

- AI 专区：解释 AI 的完整知识体系，覆盖概念、原理、实验、论文和风险。
- 专业方向：承接专项训练和作品集项目，强调工程交付。
- 主线阶段 4–8：继续提供 Python、算法、Web、系统和工程前置知识。
- 项目作品集：继续记录项目状态和交付证据，不重复维护课程进度。

AI 专区不应变成“模型新闻页”“提示词合集”或单一厂商 API 教程。

## 3. 资料筛选规则

### 3.1 来源等级

| 等级 | 来源 | 用途 | 使用限制 |
| --- | --- | --- | --- |
| S | 原始论文、标准、大学正式课程 | 定义核心机制、历史脉络、评估框架 | 论文结论不能无条件外推到所有模型 |
| A | 官方框架文档、官方教程 | API、张量、训练、部署和工具行为 | 版本相关内容必须标注框架与版本 |
| B | 大学实验、权威研究机构指南 | 教学顺序、案例、可视化和实验设计 | 不把单门课程的取舍写成唯一标准 |
| C | 高质量社区材料 | 只用于补充解释或发现资料 | 核心事实仍需回到 S/A/B 级来源 |

### 3.2 事实边界

- 数学公式、算法定义和论文贡献必须能定位到教材、课程或原论文。
- “更好”“更强”“最先进”必须写清任务、数据集、指标、比较对象和时间。
- 模型输出是条件概率分布上的生成结果，不写成“模型真正理解”或“模型绝不会出错”。
- 大语言模型、RAG 和 Agent 必须同时讲能力边界、评估方式、权限边界和失败模式。
- 代码示例优先使用小数据、小模型和 CPU 可运行方案；大型训练只讲资源估算与流程。
- 厂商文档适合解释其产品接口，不承担通用理论的唯一依据。

## 4. AI 知识总图

```text
人工智能 Artificial Intelligence
├─ 基于规则与搜索
│  ├─ 状态空间、搜索、启发式
│  ├─ 约束满足、规划
│  └─ 知识表示与推理
├─ 机器学习 Machine Learning
│  ├─ 监督学习：分类、回归、排序
│  ├─ 无监督学习：聚类、降维、密度估计
│  ├─ 自监督学习：从数据本身构造监督信号
│  └─ 强化学习：状态、动作、奖励、策略
├─ 深度学习 Deep Learning
│  ├─ 多层感知机、反向传播、优化
│  ├─ CNN 与视觉表示
│  ├─ RNN、序列建模
│  └─ Attention 与 Transformer
├─ 生成式 AI Generative AI
│  ├─ 语言模型、视觉语言模型、扩散模型
│  ├─ 提示、结构化输出、工具调用
│  ├─ 检索增强生成 RAG
│  └─ 工作流与 Agent
└─ AI 工程与治理
   ├─ 数据、实验、评估、部署、监控
   ├─ 隐私、安全、偏差、可解释性
   ├─ 文档、审计和人工监督
   └─ 风险管理与社会影响
```

关键包含关系：AI 的范围大于机器学习，机器学习的范围大于深度学习；生成式 AI 与深度学习高度重叠，但“AI”不等于“大语言模型”。

## 5. 课程知识树

建议首版采用 12 个模块、84 节课程。每个模块 7 节，结构统一为：概念地图、核心原理、两个可运行实验、错误分析、综合练习、知识检查和来源。

### AI-00：AI 全景与问题定义

目标：先分清 AI、算法、模型、数据、训练、推理和产品之间的关系。

1. AI、机器学习、深度学习和生成式 AI。
2. 规则程序与学习系统的区别。
3. 模型、参数、超参数、训练和推理。
4. 分类、回归、生成、排序、聚类和控制任务。
5. 数据、目标函数、优化器和评估指标的闭环。
6. AI 系统的输入、模型、工具、数据源和输出链路。
7. 能力边界：概率输出、分布变化、不确定性和人工监督。

建议实验：用规则分类器与简单统计分类器解决同一个小任务，对比维护成本和错误类型。

### AI-01：数学直觉与数值基础

目标：理解训练公式在代码里对应什么，不追求脱离应用的公式堆砌。

1. 标量、向量、矩阵、张量与 shape。
2. 向量点积、矩阵乘法与线性变换。
3. 均值、方差、协方差和标准化。
4. 概率、条件概率、贝叶斯公式和似然。
5. 导数、偏导数、梯度与链式法则。
6. 损失函数、梯度下降和学习率。
7. 浮点误差、数值稳定性、随机种子和可复现性。

建议实验：用 NumPy 手算一次线性回归前向计算和梯度更新，并检查 shape 错误。

### AI-02：数据与实验边界

目标：建立“先定义数据和评估，再训练模型”的工作方式。

1. 样本、特征、标签、目标变量和数据类型。
2. 训练集、验证集、测试集的职责。
3. 缺失值、异常值、重复样本和标签错误。
4. 类别编码、缩放、文本和图像预处理。
5. 数据泄漏、时间穿越、重复实体泄漏。
6. 类别不平衡、采样偏差和代表性。
7. Dataset Card、数据版本和实验记录。

建议实验：故意构造数据泄漏，让验证分数虚高，再修复划分流程。

### AI-03：经典机器学习

目标：掌握可解释的基线模型，并知道它们的假设和失败条件。

1. 线性回归、残差和均方误差。
2. Logistic Regression、概率和决策阈值。
3. k-NN 与距离度量。
4. 决策树、分裂规则和过拟合。
5. Random Forest 与集成思想。
6. 聚类、降维和无监督学习边界。
7. Pipeline、特征处理和基线比较。

建议实验：在同一数据集上比较 Logistic Regression、Decision Tree 和 Random Forest，并解释错误样本。

### AI-04：评估、泛化与误差分析

目标：从“分数多少”升级为“模型在哪些条件下可靠”。

1. 过拟合、欠拟合、偏差与方差。
2. 交叉验证和超参数选择。
3. Accuracy、Precision、Recall、F1 与混淆矩阵。
4. ROC-AUC、PR-AUC 和阈值选择。
5. 回归指标 MAE、MSE、RMSE 与残差图。
6. 校准、不确定性和置信度误用。
7. 分组评估、错误切片、基线和显著性意识。

建议实验：改变分类阈值，观察 Precision/Recall 的变化并给出业务选择理由。

### AI-05：神经网络与深度学习

目标：能从张量流解释一个网络如何训练，而不是只会调用 `fit()`。

1. 神经元、线性层、激活函数和表达能力。
2. 前向传播、损失和计算图。
3. 反向传播、自动微分和梯度。
4. Batch、Epoch、学习率和优化器。
5. 初始化、归一化、Dropout 和正则化。
6. 训练循环、验证循环、checkpoint 和早停。
7. GPU、显存、混合精度和资源估算。

建议实验：用 PyTorch 编写完整训练循环，输出训练/验证损失并保存最佳 checkpoint。

### AI-06：计算机视觉

目标：理解图像张量、卷积表示和视觉任务的评估方式。

1. 像素、通道、分辨率、归一化和增广。
2. 卷积核、stride、padding 和感受野。
3. CNN 特征层与分类头。
4. 图像分类与 Top-k 指标。
5. 目标检测的框、IoU、Precision/Recall。
6. 迁移学习和预训练模型。
7. 视觉偏差、遮挡、分辨率变化和对抗性输入概念。

建议实验：用预训练模型完成小型图像分类，并制作混淆矩阵和错误图库。

### AI-07：自然语言处理

目标：从文本预处理进入表示学习，理解序列任务的输入输出。

1. 文本规范化、分词和词表。
2. One-hot、词袋、TF-IDF 和稀疏表示。
3. Word Embedding 与相似度。
4. 序列、位置和上下文。
5. 文本分类、序列标注和问答任务。
6. RNN/LSTM 的动机与限制。
7. NLP 数据偏差、语言覆盖和评估切片。

建议实验：先用 TF-IDF + 线性模型做文本分类基线，再与小型预训练模型比较。

### AI-08：Transformer 与大语言模型

目标：建立从 token 到 logits 再到文本生成的完整链路。

1. Token、tokenizer、词表和上下文窗口。
2. Query、Key、Value 与 scaled dot-product attention。
3. Multi-head attention、位置编码和残差连接。
4. Encoder、Decoder 与 causal mask。
5. 预训练目标：masked language modeling 与 next-token prediction。
6. 解码：greedy、temperature、top-k、top-p 和停止条件。
7. 指令微调、偏好优化、幻觉和知识时效边界。

建议实验：手算一个极小 attention 示例，再观察温度变化如何影响生成分布。

### AI-09：生成式 AI 应用、RAG 与 Agent

目标：把模型放回真实系统，区分模型能力、外部知识和工具权限。

1. Prompt 的输入契约、上下文、示例和输出格式。
2. Structured Output、schema 校验和失败重试。
3. Embedding、向量相似度、切块和索引。
4. RAG 的检索、重排、生成和引用链路。
5. RAG 评估：检索命中、上下文相关性、答案忠实度。
6. Tool Calling、工作流与 Agent 的区别。
7. Agent 状态、终止条件、权限、人工确认和可观测性。

建议实验：构建只读取本地文档的小型 RAG，返回答案、引用片段和“证据不足”状态。

### AI-10：AI 工程与 MLOps

目标：让实验结果能够复现、部署、监控和回滚。

1. 环境、依赖、随机种子和可复现运行。
2. 数据版本、代码版本、参数、指标和产物。
3. 实验追踪、模型注册和 Model Card。
4. 批处理推理、在线推理和延迟/吞吐。
5. 模型导出、ONNX 与运行时兼容。
6. 输入漂移、概念漂移、性能监控和告警。
7. 灰度发布、回滚、再训练触发和成本记录。

建议实验：为一个小模型记录版本、指标和输入摘要，再提供本地 `/predict` 接口和 smoke test。

### AI-11：安全、责任与治理

目标：把风险控制写进需求、数据、评估、部署和运营全过程。

1. AI 风险、影响范围、利益相关者和使用情境。
2. 隐私、敏感数据、数据最小化和保留期限。
3. 偏差、公平性、分组指标和代表性限制。
4. 可解释性、透明度、Model Card 和 Dataset Card。
5. Prompt Injection、敏感信息泄露和不安全输出处理。
6. 模型/数据供应链、依赖、权重来源和完整性。
7. NIST Govern/Map/Measure/Manage、人工监督和事件响应。

建议实验：对一个本地问答应用做威胁建模，列出资产、信任边界、攻击面、检测证据和修复项。

## 6. 贯穿式能力清单

每节课至少关联以下能力中的两项：

- 定义问题：任务、输入、输出、约束、基线。
- 观察数据：分布、缺失、异常、偏差、泄漏。
- 解释模型：假设、参数、目标函数、推理链路。
- 运行实验：环境、种子、参数、指标、产物。
- 分析错误：错误样本、分组指标、边界条件。
- 建立证据：日志、图表、checkpoint、引用、版本。
- 评估风险：隐私、安全、公平性、人工监督。
- 工程交付：接口、测试、监控、回滚、README。

## 7. 建议实验栈

首版遵循“轻依赖、可观察、可验收”：

- 基础计算：Python、NumPy、pandas、Matplotlib。
- 经典机器学习：scikit-learn。
- 深度学习：PyTorch 为主；TensorFlow 作为对照资料，不在同一课程混用训练 API。
- NLP/LLM：Transformers、Datasets、Tokenizers；示例优先小模型或本地静态模拟。
- 服务：标准库 HTTP 或 FastAPI 二选一，沿用项目已有依赖策略。
- 实验追踪：先用 JSON/CSV 讲清结构，再引入 MLflow。
- 模型交换：ONNX 作为部署进阶，不放入初学者第一轮。

任何新增依赖都要记录用途、安装命令、版本和无该依赖时的替代实验。

## 8. 来源知识库

核验日期：2026-07-27。`HTTP 200` 表示命令行在线核验成功；“浏览器核验”表示页面在浏览器中成功加载，但命令行请求受到站点策略或超时影响。

### 8.1 AI 基础与大学课程

| 编号 | 资料 | 来源类型 | 用于专区 | 核验 |
| --- | --- | --- | --- | --- |
| AI-S001 | [Artificial Intelligence: A Modern Approach](https://aima.cs.berkeley.edu/) | 教材官方网站 | AI 定义、智能体、搜索、推理、学习全景 | HTTP 200 |
| AI-S002 | [MIT 6.034 Artificial Intelligence](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/) | MIT OpenCourseWare | 搜索、约束、推理、学习的经典课程顺序 | HTTP 200 |
| AI-S003 | [CS50's Introduction to AI with Python](https://cs50.harvard.edu/ai/) | Harvard 公开课程 | 面向 Python 学习者的搜索、知识、学习项目结构 | HTTP 200 |
| AI-S004 | [Berkeley CS188: Introduction to AI](https://inst.eecs.berkeley.edu/~cs188/) | Berkeley 课程 | 状态空间、概率推理、MDP 和强化学习入口 | HTTP 200 |
| AI-S005 | [Stanford AI Index](https://hai.stanford.edu/ai-index) | Stanford HAI 年度报告 | AI 能力、产业、社会影响的当前背景 | HTTP 200；已见 2026 报告入口 |

### 8.2 数学、数据与经典机器学习

| 编号 | 资料 | 来源类型 | 用于专区 | 核验 |
| --- | --- | --- | --- | --- |
| AI-S006 | [MIT 18.06 Linear Algebra](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) | MIT OpenCourseWare | 向量、矩阵、线性变换 | HTTP 200 |
| AI-S007 | [Seeing Theory](https://seeing-theory.brown.edu/) | Brown University 可视化资料 | 概率、分布、统计推断的直觉 | HTTP 200 |
| AI-S008 | [Stanford CS229](https://cs229.stanford.edu/) | Stanford 课程 | 监督学习、泛化、概率模型和学习理论 | HTTP 200；Summer 2026 |
| AI-S009 | [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) | Google 官方课程 | 初学路线、数据、模型、指标与生产 ML | 浏览器核验 |
| AI-S010 | [scikit-learn Getting Started](https://scikit-learn.org/stable/getting_started.html) | 官方文档 | estimator、预处理、pipeline、评估 | HTTP 200 |
| AI-S011 | [Dive into Deep Learning](https://d2l.ai/) | 开放教材 | 数学与代码结合的机器学习/深度学习实验 | HTTP 200 |
| AI-S012 | [Datasheets for Datasets](https://arxiv.org/abs/1803.09010) | 原始论文 | 数据集动机、组成、采集、用途与维护文档 | HTTP 200 |

### 8.3 深度学习、视觉与 NLP

| 编号 | 资料 | 来源类型 | 用于专区 | 核验 |
| --- | --- | --- | --- | --- |
| AI-S013 | [MIT 6.S191 Introduction to Deep Learning](https://introtodeeplearning.com/) | MIT 课程 | 深度学习概览、序列、视觉和生成模型 | HTTP 200 |
| AI-S014 | [PyTorch Tutorials](https://docs.pytorch.org/tutorials/) | PyTorch 官方文档 | 张量、autograd、训练循环、保存加载 | HTTP 200 |
| AI-S015 | [TensorFlow Guide](https://www.tensorflow.org/guide) | TensorFlow 官方文档 | 训练、数据管线和部署概念对照 | 浏览器可访问；命令行超时 |
| AI-S016 | [Stanford CS231n](https://cs231n.stanford.edu/) | Stanford 课程 | CNN、视觉识别、训练技巧 | HTTP 200 |
| AI-S017 | [Stanford CS224N](https://web.stanford.edu/class/cs224n/) | Stanford 课程 | NLP、表示学习、Attention、Transformer | HTTP 200 |
| AI-S018 | [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | 官方课程 | tokenizer、Transformers、Datasets、LLM 应用 | 浏览器核验 |

### 8.4 Transformer、LLM 与生成式 AI 原始资料

| 编号 | 资料 | 关键贡献 | 课程使用边界 | 核验 |
| --- | --- | --- | --- | --- |
| AI-P001 | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | Transformer 编码器/解码器与 self-attention | 用于解释原始结构，不代表所有现代 LLM 的完整实现 | HTTP 200 |
| AI-P002 | [BERT](https://arxiv.org/abs/1810.04805) | 双向 Transformer encoder 预训练 | 用于 masked language modeling 与微调范式 | HTTP 200 |
| AI-P003 | [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) | 规模化自回归语言模型和 in-context learning 观察 | 论文中的模型规模与结果不可当作本地实验要求 | HTTP 200 |
| AI-P004 | [Training language models to follow instructions](https://arxiv.org/abs/2203.02155) | 监督微调与人类反馈对齐流程 | 用于理解指令跟随和偏好数据，不简化成“RLHF 保证安全” | HTTP 200 |
| AI-P005 | [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401) | 检索与生成结合 | 用于 RAG 基本动机，现代系统还需切块、重排、引用和评估 | HTTP 200 |

### 8.5 LLM 应用、Agent、评估与工程

| 编号 | 资料 | 来源类型 | 用于专区 | 核验 |
| --- | --- | --- | --- | --- |
| AI-S019 | [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) | 厂商工程文章 | workflow 与 agent 区分、组合模式、何时保持简单 | HTTP 200，实际重定向到 engineering |
| AI-S020 | [OpenAI API Guides](https://platform.openai.com/docs/guides) | 官方产品文档 | 模型调用、结构化输出、工具和评估的产品示例 | 浏览器可访问；命令行返回 403 |
| AI-S021 | [Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml) | Google 工程指南 | 基线、特征、管线、监控和技术债 | 浏览器可访问；命令行超时 |
| AI-S022 | [MLflow Documentation](https://mlflow.org/docs/latest/) | 官方文档 | 实验追踪、模型注册和部署流程 | HTTP 200 |
| AI-S023 | [ONNX Introduction](https://onnx.ai/onnx/intro/) | 官方文档 | 模型交换、图结构、运行时边界 | HTTP 200 |
| AI-S024 | [HELM](https://crfm.stanford.edu/helm/latest/) | Stanford CRFM | 场景、指标、多维评估和透明报告 | HTTP 200 |
| AI-S025 | [Hugging Face Model Cards](https://huggingface.co/docs/hub/model-cards) | 官方文档 | 模型用途、限制、数据、指标和风险说明 | 浏览器可访问；命令行超时 |

### 8.6 安全、责任与治理

| 编号 | 资料 | 来源类型 | 用于专区 | 核验 |
| --- | --- | --- | --- | --- |
| AI-S026 | [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) | NIST 框架 | Govern、Map、Measure、Manage 风险闭环 | HTTP 200 |
| AI-S027 | [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) | NIST 配套文件 | 生成式 AI 特有风险与控制考虑 | HTTP 200 |
| AI-S028 | [OECD AI Principles](https://oecd.ai/en/ai-principles) | 政策原则 | 可信 AI、透明、公平、稳健和问责 | 浏览器可访问；命令行超时 |
| AI-S029 | [UNESCO Recommendation on the Ethics of AI](https://www.unesco.org/en/artificial-intelligence/recommendation-ethics) | 国际组织建议 | 人权、环境、治理和社会影响 | HTTP 200 |
| AI-S030 | [OWASP Top 10 for LLM and GenAI Apps](https://genai.owasp.org/llm-top-10/) | 开放安全项目 | Prompt Injection、信息泄露、供应链等应用风险 | HTTP 200；页面显示 2025 风险列表 |
| AI-S031 | [People + AI Guidebook](https://pair.withgoogle.com/guidebook/) | Google PAIR 指南 | 用户需求、心理模型、解释、反馈和失败体验 | 浏览器可访问；命令行超时 |

## 9. 资料采用结论

### 采用

- 用 AIMA、MIT 6.034、CS188 建立 AI 不只等于机器学习的全景。
- 用 CS229、Google MLCC、scikit-learn 建立传统机器学习主线。
- 用 MIT 6.S191、PyTorch、CS231n、CS224N 建立深度学习、视觉与 NLP 主线。
- 用五篇原始论文建立 Transformer、LLM、指令对齐和 RAG 的历史链路。
- 用 HELM、NIST、OWASP、Model Card 和 Datasheet 建立评估与治理闭环。

### 不直接采用

- 不按任何单一厂商的产品目录组织整个专区。
- 不把论文摘要直接改写成入门课正文。
- 不把榜单分数、参数量或发布日期作为课程主线。
- 不采用没有来源、只列提示词或宣称“一天精通”的二手教程。

## 10. 后续内容实施检查单

- [ ] 为 12 个模块建立稳定 ID 和课程清单。
- [ ] 每节课绑定至少 2 条来源，其中至少 1 条为 S/A 级。
- [ ] 每节课区分“稳定原理”和“版本相关工具行为”。
- [ ] 每节课提供 CPU 可运行实验或无依赖交互演示。
- [ ] 每个模块提供错误样本、边界条件和综合验收。
- [ ] LLM/RAG/Agent 课程同时加入评估、安全和人工监督。
- [ ] 新增资料进入统一资源索引并执行 URL 结构检查。
- [ ] 完成内容审校后再进入 UI 和代码阶段。

## 11. AI 基础学习层

AI 专区已在 84 节正式课程之前增加两层零基础入口：

- 8 条入门路径、24 篇教程：使用“30 秒解释、现实问题、分步图解、最小案例、浏览器练习、三题检查”完成概念过渡。
- 12 类、320 条 AI 术语：提供中英文、缩写、别名、大白话解释、技术定义、类比、实例、误区、边界、来源和双向课程关系。

315 个正式课程概念已全部映射到稳定术语 ID 或别名；每节正式课程显式关联 4–8 个词条和至少 1 篇入门教程。教程、词条、正式课程与实验均在中央阅读工作区打开，状态数据进入版本 10 导入导出结构。
