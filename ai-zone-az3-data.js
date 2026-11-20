(function () {
  "use strict";

  const data = window.aiZoneData;
  if (!data) throw new Error("AI 专区基础数据尚未加载");

  const refs = {
    mit: { id: "AI-S013", title: "MIT 6.S191 Introduction to Deep Learning", provider: "MIT", url: "https://introtodeeplearning.com/" },
    pytorchBasics: { id: "AI-S014-B", title: "PyTorch: Learn the Basics", provider: "PyTorch", url: "https://docs.pytorch.org/tutorials/beginner/basics/intro.html" },
    pytorchAutograd: { id: "AI-S014-A", title: "PyTorch: Automatic Differentiation", provider: "PyTorch", url: "https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html" },
    pytorchOptimization: { id: "AI-S014-O", title: "PyTorch: Optimizing Model Parameters", provider: "PyTorch", url: "https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html" },
    pytorchSave: { id: "AI-S014-S", title: "PyTorch: Save and Load the Model", provider: "PyTorch", url: "https://docs.pytorch.org/tutorials/beginner/basics/saveloadrun_tutorial.html" },
    d2l: { id: "AI-S011", title: "Dive into Deep Learning", provider: "D2L.ai", url: "https://d2l.ai/" },
    cs231n: { id: "AI-S016", title: "Stanford CS231n", provider: "Stanford", url: "https://cs231n.stanford.edu/" },
    torchvision: { id: "AI-S014-V", title: "TorchVision Object Detection Finetuning Tutorial", provider: "PyTorch", url: "https://docs.pytorch.org/tutorials/intermediate/torchvision_tutorial.html" },
    cs224n: { id: "AI-S017", title: "Stanford CS224N", provider: "Stanford", url: "https://web.stanford.edu/class/cs224n/" },
    hfCourse: { id: "AI-S018", title: "Hugging Face LLM Course", provider: "Hugging Face", url: "https://huggingface.co/learn/llm-course/chapter1/1" },
    sklearnText: { id: "AI-S010-X", title: "Working With Text Data", provider: "scikit-learn", url: "https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html" },
    sklearnMetrics: { id: "AI-S010-E", title: "Metrics and scoring", provider: "scikit-learn", url: "https://scikit-learn.org/stable/modules/model_evaluation.html" }
  };

  function makeQuiz(item) {
    const raw = [
      ["本课首先要建立哪项能力？", [item.objectives[0], "只记住框架函数名", "只比较模型参数量", "忽略输入和输出形状"], 0, "目标应落到可解释、可运行或可验收的能力。"],
      [`“${item.concepts[0][0]}”在本课中指什么？`, [item.concepts[0][1], item.concepts[1][1], "只用于绘制界面的属性", "任何自动执行的脚本"], 0, "按本课的操作性定义判断。"],
      [`关于“${item.concepts[1][0]}”，哪项准确？`, [item.concepts[1][1], "它与数据表示无关", "它自动保证泛化", "它只在推理后使用"], 0, "该概念位于明确的数据或训练链路中。"],
      ["哪项最符合可靠实验？", ["固定数据、版本和配置，记录中间量与验证结果", "只保留最好的一次输出", "用测试集反复选择参数", "忽略错误样本"], 0, "实验需要能复查输入、过程、结果和判断标准。"],
      ["出现结果异常时应先检查什么？", ["shape、数据范围、训练/验证模式和指标实现", "立即增加网络层数", "删除全部困难样本", "只提高学习率"], 0, "先检查可观察链路，再决定模型调整。"],
      ["本课方法的适用边界是哪项？", [item.limits[0], "适用于任何分布且无需测试", "运行成功即可直接上线", "总体平均分足以覆盖所有输入"], 0, "限制条件是课程结论的一部分。"]
    ];
    return raw.map(([question, options, answer, explanation], index) => {
      const rotation = (item.id.length + index * 2) % options.length;
      return { question, options: [...options.slice(rotation), ...options.slice(0, rotation)], answer: (answer - rotation + options.length) % options.length, explanation };
    });
  }

  function lesson(moduleId, sequence, config) {
    const module = data.modules.find((item) => item.id === moduleId);
    const item = {
      id: `ai-${moduleId.slice(3)}-${config.slug}`,
      number: `${moduleId}-${String(sequence).padStart(2, "0")}`,
      moduleId, title: config.title, summary: config.summary, why: config.why,
      duration: config.duration || 55, level: module.level, type: config.type || "概念", status: "open",
      environment: config.labId ? "浏览器" : "无需代码",
      objectives: config.objectives, concepts: config.concepts, deepDive: config.deepDive,
      workedExamples: [{ title: config.exampleTitle, steps: config.exampleSteps }],
      misconceptions: config.misconceptions, limits: config.limits, practice: config.practice,
      checkpoint: ["能用自己的话解释四个核心概念", "能沿示例追踪输入、操作和输出", "能指出至少一个失败条件并给出检查证据"],
      references: config.references, labId: config.labId || ""
    };
    item.quiz = makeQuiz(item);
    return item;
  }

  const lessons = [
    lesson("AI-05", 1, {
      slug: "neurons-layers-activations", title: "神经元、线性层与激活函数", summary: "从一个加权和开始，理解多层网络为什么需要非线性。",
      why: "堆叠多个不带激活的线性层仍等价于一个线性变换；激活函数让网络能表达弯曲、分段和组合边界。",
      objectives: ["手算单个神经元输出", "追踪线性层的输入与输出 shape", "解释 ReLU 等非线性为何不可省略"],
      concepts: [["神经元", "对输入做加权求和、加偏置并通过激活函数的计算单元"], ["线性层", "执行 y=xW+b 的可训练仿射变换"], ["激活函数", "逐元素或按结构引入非线性映射"], ["表达能力", "模型能够表示的函数集合及其复杂度"]],
      deepDive: ["输入 x shape=(batch,in_features)，权重 W shape=(in_features,out_features)，输出 shape=(batch,out_features)。", "两个纯线性层 W2(W1x+b1)+b2 可合并为一个线性层，因此无法仅靠深度形成非线性边界。", "ReLU=max(0,z) 计算简单但负区梯度为零；sigmoid 输出 0–1，却在大绝对值区域容易梯度变小。"],
      exampleTitle: "两输入单神经元", exampleSteps: ["输入 x=[2,-1]", "权重 w=[0.5,1]，偏置 b=0.2", "线性值 z=2×0.5+(-1)×1+0.2=0.2", "ReLU(z)=0.2", "把输入换成 [0,-1]，观察输出被截为 0"],
      misconceptions: ["网络层数增加就一定增加有效表达能力。", "激活函数只负责把值限制到固定区间。"], limits: ["更强表达能力同时增加过拟合和优化难度。", "单个神经元不能表达 XOR 等非线性关系。"],
      practice: ["手算 shape=(4,3) 输入经过 W shape=(3,2) 的输出 shape。", "比较 z=-2、0、3 时 ReLU 与 sigmoid 输出。"], references: [refs.mit, refs.pytorchBasics]
    }),
    lesson("AI-05", 2, {
      slug: "forward-loss-graph", title: "前向传播、损失与计算图", summary: "把预测拆成可追踪操作，并明确损失怎样连接输出与目标。",
      why: "计算图记录张量如何由参数产生，使自动微分能够沿依赖关系求梯度；shape 或 reduction 错误会直接改变优化目标。",
      objectives: ["描述 forward 的逐层数据流", "区分逐样本损失与 batch reduction", "画出参数到标量损失的计算依赖"],
      concepts: [["前向传播", "从输入依次计算中间激活、预测和损失"], ["计算图", "记录张量操作及依赖关系的有向结构"], ["logits", "分类模型在归一化前输出的实数分数"], ["reduction", "把逐样本或逐元素损失汇总成标量的方式"]],
      deepDive: ["分类网络通常输出 logits，交叉熵实现会内部完成稳定的 log-softmax；先手动 softmax 再传 logits API 可能重复计算。", "loss='mean' 与 'sum' 会改变梯度尺度，batch 大小时尤其明显。", "计算图只连接参与本次前向的操作；条件分支和 detach 会改变梯度能否回传。"],
      exampleTitle: "二分类前向链", exampleSteps: ["输入 X shape=(8,4)", "线性层输出 logits shape=(8,2)", "目标 y shape=(8,)", "交叉熵得到 8 个样本损失", "mean reduction 得到标量 loss"],
      misconceptions: ["logits 必须先变成概率才能计算交叉熵。", "loss 是模型准确率的另一种写法。"], limits: ["低损失不保证概率校准或业务成本最优。", "计算图正确不代表标签和输入对齐。"],
      practice: ["为两层网络写出每一步 shape。", "说明 mean 和 sum 对梯度量级的影响。"], references: [refs.pytorchBasics, refs.d2l]
    }),
    lesson("AI-05", 3, {
      slug: "backprop-autograd", title: "反向传播、链式法则与自动微分", summary: "沿计算图从标量损失反向累积每个参数的梯度。",
      why: "自动微分减少手工推导错误，但不会判断损失、shape 或梯度是否合理；理解链式法则才能排查梯度消失、爆炸和意外累积。",
      objectives: ["手算两步复合函数梯度", "解释 backward 如何沿图传播", "检查 zero_grad、detach 和 requires_grad"],
      concepts: [["反向传播", "从损失沿计算图反向应用链式法则并累积梯度"], ["链式法则", "复合函数导数等于局部导数按路径相乘并汇总"], ["自动微分", "由框架记录操作并自动计算精确程序导数"], ["梯度累积", "多次 backward 默认把新梯度加到已有 gradient"]],
      deepDive: ["若 L=(wx-y)^2，则 dL/dw=2(wx-y)x；反向传播把损失对输出的梯度乘上输出对参数的局部梯度。", "PyTorch 参数的 .grad 会累积，因此典型循环在每次更新前调用 optimizer.zero_grad()。", "detach 会切断图，no_grad 用于不需要构图的推理；误用会让参数没有梯度。"],
      exampleTitle: "手算链式法则", exampleSteps: ["a=wx，w=2，x=3，得到 a=6", "L=(a-4)^2=4", "dL/da=2(a-4)=4", "da/dw=x=3", "dL/dw=4×3=12"],
      misconceptions: ["自动微分等于数值近似梯度。", "每次 backward 会自动清空旧梯度。"], limits: ["梯度正确也可能指向错误的代理目标。", "不连续操作处的梯度需要查看框架定义。"],
      practice: ["手算 L=(2w+1)^2 在 w=1 的梯度。", "解释忘记 zero_grad 后第二个 batch 会发生什么。"], references: [refs.pytorchAutograd, refs.d2l]
    }),
    lesson("AI-05", 4, {
      slug: "batch-epoch-optimizer", title: "Batch、Epoch、学习率与优化器", summary: "理解一次参数更新、一轮数据遍历和优化状态之间的关系。",
      why: "训练轮数、batch 大小与学习率共同决定更新噪声、内存和收敛；参数名相同不代表不同优化器行为相同。",
      objectives: ["区分 sample、batch、step 和 epoch", "解释学习率过大或过小的现象", "区分 SGD 与 Adam 的状态和适用取舍"],
      concepts: [["Batch", "一次前向和反向处理的一组样本"], ["Epoch", "训练集被完整遍历一次"], ["学习率", "控制参数沿优化方向移动尺度的超参数"], ["优化器", "根据梯度及内部状态更新参数的算法"]],
      deepDive: ["1000 条样本、batch=100 时，一轮通常有 10 个 step；最后不足 batch 的处理取决于 drop_last。", "学习率过大可能损失震荡或发散，过小则进展缓慢；应同时观察损失、梯度和参数范围。", "Adam 保存一阶和二阶矩估计，早期常收敛快，但仍需验证正则、泛化和学习率调度。"],
      exampleTitle: "训练计数", exampleSteps: ["训练样本 1050", "batch_size=128 且不丢弃尾批", "每个 epoch 有 ceil(1050/128)=9 step", "训练 20 epoch 共 180 step", "记录每 step loss、每 epoch 验证指标"],
      misconceptions: ["一个 epoch 就等于一次参数更新。", "Adam 不需要设置学习率。"], limits: ["最佳 batch 和学习率依赖模型、硬件与数据。", "训练损失平滑不代表验证表现稳定。"],
      practice: ["计算 5000 样本、batch 64 的每轮 step 数。", "为损失震荡设计三步排查。"], references: [refs.pytorchOptimization, refs.mit]
    }),
    lesson("AI-05", 5, {
      slug: "regularization", title: "初始化、归一化、Dropout 与正则化", summary: "控制信号和梯度尺度，并减少模型对训练细节的过度依赖。",
      why: "深层网络的数值分布会逐层变化。初始化和归一化影响优化，Dropout 与权重衰减影响泛化，但训练和推理行为并不相同。",
      objectives: ["说明初始化与激活方差的关系", "区分 BatchNorm 的训练与推理状态", "解释 Dropout 和权重衰减的不同机制"],
      concepts: [["初始化", "训练开始前设置参数分布与尺度"], ["归一化层", "按规定统计量调整中间激活并学习缩放偏移"], ["Dropout", "训练时随机屏蔽部分激活的正则方法"], ["权重衰减", "在更新中限制参数幅度的正则方式"]],
      deepDive: ["全零初始化会让同层神经元保持对称；Xavier/He 等方法按输入输出规模控制方差。", "BatchNorm 训练时用 batch 统计并更新运行统计，推理时使用保存的运行统计，因此必须切换 model.eval()。", "Dropout 训练时随机丢弃，推理时关闭；若评估忘记 eval，结果会随机波动。"],
      exampleTitle: "训练/推理模式检查", exampleSteps: ["训练前 model.train()", "forward 中启用 Dropout", "更新 BatchNorm 运行均值", "验证前 model.eval()", "在 no_grad 下重复推理，检查结果稳定"],
      misconceptions: ["Dropout 在推理时也随机屏蔽。", "归一化可以修复任何不合理输入范围。"], limits: ["正则过强会造成欠拟合。", "小 batch 下 BatchNorm 统计可能不稳定。"],
      practice: ["解释全零初始化隐藏层的问题。", "列出验证指标随机波动时的模式检查项。"], references: [refs.cs231n, refs.d2l]
    }),
    lesson("AI-05", 6, {
      slug: "training-loop", title: "训练循环、验证、Checkpoint 与早停", summary: "把训练、验证、最佳模型保存和停止条件组成可复现闭环。",
      why: "只保存最后一个 epoch 可能丢失最佳泛化状态；验证循环若更新参数或使用训练模式，也会污染评价。",
      objectives: ["写出完整训练与验证循环顺序", "按验证指标保存最佳 checkpoint", "实现 patience 早停并恢复最佳参数"],
      concepts: [["训练循环", "按 batch 完成 forward、loss、backward 和 optimizer.step 的过程"], ["验证循环", "固定参数并在独立数据上计算指标的过程"], ["Checkpoint", "模型参数、优化器状态、轮次和配置的可恢复快照"], ["早停", "验证指标连续若干轮未改善时停止训练"]],
      deepDive: ["每轮训练先 train 模式，逐 batch 清梯度、前向、计算损失、反向、更新；随后 eval 与 no_grad 完成验证。", "最佳 checkpoint 应保存指标方向、epoch、模型 state_dict、优化器状态和配置，不只保存整个对象。", "早停 patience 是允许短期波动的窗口；停止后应恢复最佳轮参数，而不是保留最后一轮。"],
      exampleTitle: "五步训练闭环", exampleSteps: ["训练一个 epoch 并累计按样本加权的平均 loss", "切换 eval 计算 validation loss", "若改善则复制参数为 best checkpoint", "否则增加无改善计数", "达到 patience 后停止并恢复 best"],
      misconceptions: ["验证时不 backward 就不需要 eval。", "早停应保留触发停止的最后一轮。"], limits: ["验证集噪声会影响早停判断。", "频繁保存大型 checkpoint 会增加 I/O 成本。"],
      practice: ["运行浏览器训练循环并解释最佳 epoch。", "写出一个可恢复 checkpoint 的最小字段清单。"], references: [refs.pytorchOptimization, refs.pytorchSave], labId: "ai-lab-training-loop", type: "实验", duration: 70
    }),
    lesson("AI-05", 7, {
      slug: "gpu-memory-mixed-precision", title: "GPU、显存、混合精度与资源估算", summary: "区分计算设备、参数/激活/优化器内存，并在训练前估算主要资源。",
      why: "GPU 加速来自高并行吞吐，不是所有任务都更快。显存不足常由激活和优化器状态主导，需要从 shape 与 dtype 估算。",
      objectives: ["解释 CPU 与 GPU 适合的工作负载", "估算张量字节数", "说明混合精度的收益和数值风险"],
      concepts: [["GPU", "擅长大量规则并行数值计算的处理器"], ["显存", "GPU 上存放参数、梯度、优化器状态和激活的内存"], ["混合精度", "组合较低与较高精度执行训练以节省资源"], ["梯度缩放", "减少低精度下小梯度下溢的训练技术"]],
      deepDive: ["float32 每元素 4 字节，shape=(32,3,224,224) 输入约 19.3MB；训练还需保存多层激活。", "Adam 常额外保存两份参数尺度的状态，加上参数与梯度后基础占用约为参数字节数的多倍。", "混合精度可减少显存和提升支持硬件上的吞吐，但应监控 NaN、Inf 和最终指标。"],
      exampleTitle: "输入张量估算", exampleSteps: ["元素数 32×3×224×224=4,816,896", "float32 每元素 4 字节", "总计 19,267,584 字节", "约 18.4 MiB", "再估算激活、参数、梯度和优化器状态"],
      misconceptions: ["模型文件 1GB 就只需要 1GB 显存训练。", "把 tensor 移到 GPU 后所有代码都会更快。"], limits: ["精确显存取决于图、算子实现和缓存。", "小任务的数据搬运成本可能超过 GPU 收益。"],
      practice: ["估算 shape=(16,512,768) 的 float16 张量大小。", "列出 OOM 时四种不改变数据含义的处理。"], references: [refs.pytorchBasics, refs.mit]
    }),

    lesson("AI-06", 1, {
      slug: "pixels-channels-augmentation", title: "像素、通道、归一化与增广", summary: "从图像文件进入模型张量，保持通道、范围和标签语义一致。",
      why: "图像能正常显示不代表张量正确。通道顺序、数值范围和训练/推理预处理不一致会让模型性能突然失效。",
      objectives: ["解释 NCHW 图像 shape", "区分缩放与标准化", "设计不破坏标签的随机增广"],
      concepts: [["像素", "图像空间位置上的离散强度或颜色数值"], ["通道", "灰度、RGB 或其他测量维度"], ["归一化", "按训练约定调整数值范围或均值方差"], ["数据增广", "训练时对样本做保持标签语义的随机变换"]],
      deepDive: ["PyTorch 常用 NCHW，例如 32 张 RGB 224×224 图像 shape=(32,3,224,224)；部分框架使用 NHWC。", "把 uint8 除以 255 得到 0–1 只是缩放；按通道减均值除标准差才是标准化。", "翻转对猫狗分类通常安全，对左右方向、文字和医学图像可能改变标签或含义。"],
      exampleTitle: "图像输入检查", exampleSteps: ["读取文件并转 RGB", "resize/crop 到 224×224", "转 tensor 得到 (3,224,224)", "按训练均值方差标准化", "组成 batch 后检查范围、shape 与标签"],
      misconceptions: ["所有图像都能安全水平翻转。", "RGB 和 BGR 只是显示差异，不影响模型。"], limits: ["增广只能模拟已知变化。", "过强变换会改变标签语义。"],
      practice: ["写出 64 张灰度 28×28 图像的 NCHW shape。", "为数字识别列出安全和高风险增广各两项。"], references: [refs.cs231n, refs.pytorchBasics]
    }),
    lesson("AI-06", 2, {
      slug: "convolution", title: "卷积核、Stride、Padding 与感受野", summary: "手算局部卷积并根据核大小、步幅和填充推导输出尺寸。",
      why: "卷积利用局部连接和权重共享提取空间模式；stride 与 padding 同时影响特征图尺寸、边界信息和后续感受野。",
      objectives: ["手算一个 2D 卷积位置", "使用公式计算输出尺寸", "解释多层卷积感受野扩大"],
      concepts: [["卷积核", "在局部窗口共享使用的一组可训练权重"], ["Stride", "卷积窗口每次移动的像素步长"], ["Padding", "在输入边界添加数值以控制尺寸与边界计算"], ["感受野", "某个特征位置能间接依赖的输入区域"]],
      deepDive: ["单维输出大小 floor((input+2p-dilation×(kernel-1)-1)/stride+1)。", "3×3、stride=1、padding=1 通常保持高宽；stride=2 近似减半。", "多层 3×3 卷积让深层单点看到更大输入区域，同时插入非线性。"],
      exampleTitle: "4×4 输入与 2×2 核", exampleSteps: ["输入左上窗口 [[1,2],[0,1]]", "核 [[1,0],[0,-1]]", "逐元素乘积和=1-1=0", "stride=1 无 padding 时输出 3×3", "移动窗口重复计算全部位置"],
      misconceptions: ["卷积核一定是人工指定的边缘算子。", "padding 只影响图像大小，不影响边界值。"], limits: ["标准卷积不天然具有旋转或尺度不变性。", "大 stride 会丢失细小空间信息。"],
      practice: ["计算输入 32、核 5、padding 2、stride 2 的输出大小。", "解释两层 3×3 卷积比一层看到更大区域。"], references: [refs.cs231n, refs.d2l]
    }),
    lesson("AI-06", 3, {
      slug: "cnn-features-head", title: "CNN 特征层与分类头", summary: "沿卷积、激活、下采样和分类头追踪 shape 与语义层级。",
      why: "CNN 不是单个卷积。特征提取器逐层组合局部模式，分类头再把空间表示映射到类别 logits。",
      objectives: ["追踪典型 CNN 的张量 shape", "区分特征提取器与任务头", "解释全局平均池化的作用"],
      concepts: [["特征图", "卷积层输出的多通道空间张量"], ["下采样", "降低空间分辨率并扩大有效感受范围"], ["分类头", "把共享特征转换为类别 logits 的任务层"], ["全局平均池化", "对每个通道的全部空间位置求平均"]],
      deepDive: ["浅层更容易响应边缘和纹理，深层组合更大区域；这是一种常见观察，不代表每个通道都有固定人类语义。", "下采样减少计算并增加有效感受野，但可能丢失小目标或精确位置。", "全局平均池化把 (N,C,H,W) 变为 (N,C)，减少大规模全连接参数。"],
      exampleTitle: "小型 CNN shape", exampleSteps: ["输入 (8,3,64,64)", "conv 输出 (8,16,64,64)", "pool 输出 (8,16,32,32)", "第二组卷积输出 (8,32,16,16)", "全局平均与线性头输出 (8,10) logits"],
      misconceptions: ["通道数等于图像颜色数。", "下采样越多模型越稳健。"], limits: ["特征可视化不能自动证明模型因果依据。", "强下采样不适合精细定位任务。"],
      practice: ["追踪两次 stride=2 后的空间大小。", "比较 flatten 大全连接层与全局平均池化的参数影响。"], references: [refs.cs231n, refs.mit]
    }),
    lesson("AI-06", 4, {
      slug: "classification-topk", title: "图像分类、Top-k 与混淆矩阵", summary: "从 logits 得到类别排序，并按类别和场景检查错误。",
      why: "Top-1 只看最高分，Top-k 关注正确类别是否进入候选集合；类别数量多或标注相似时，两者回答不同问题。",
      objectives: ["从 logits 排序得到 Top-k", "计算每类 Recall 与混淆矩阵", "构建包含图像、预测和条件的错误图库"],
      concepts: [["Top-1", "最高分预测与真实标签一致的比例"], ["Top-k", "真实标签出现在最高 k 个预测中的比例"], ["混淆矩阵", "真实类别与预测类别组合的计数表"], ["错误图库", "按错误类型组织原图、标签、预测和上下文的证据集合"]],
      deepDive: ["Top-5 常用于大类别集合，但若产品只能执行一个动作，仍需重点评估 Top-1 或实际决策链。", "总体准确率应配合每类样本数和 Recall，避免大类掩盖小类。", "错误图库按遮挡、光照、背景、分辨率、相似类别等切片，比只看矩阵更容易定位数据问题。"],
      exampleTitle: "读取 Top-3", exampleSteps: ["五类 logits [1.2,0.1,2.4,1.8,-0.2]", "排序索引 [2,3,0,1,4]", "真实标签 3 不属于 Top-1", "但属于 Top-3", "记录为 Top-1 错误并进入相似类别切片"],
      misconceptions: ["Top-5 高就表示单标签产品可用。", "混淆矩阵能直接说明错误原因。"], limits: ["指标依赖测试集类别和场景分布。", "错误图库需要一致的分类标准。"],
      practice: ["为四条 logits 手算 Top-1 和 Top-2。", "运行视觉错误图库实验并归纳失败模式。"], references: [refs.cs231n, refs.sklearnMetrics], labId: "ai-lab-vision-errors", type: "实验", duration: 65
    }),
    lesson("AI-06", 5, {
      slug: "detection-iou", title: "目标检测、边界框与 IoU", summary: "同时评价对象类别和位置，理解匹配阈值怎样影响 TP、FP 与 FN。",
      why: "检测不是简单分类：一张图有多个对象，预测框必须与真实框匹配，还要处理重复框、漏检和定位偏差。",
      objectives: ["用坐标计算框面积与 IoU", "按 IoU 阈值匹配预测和真实框", "解释 NMS 与检测 Precision/Recall"],
      concepts: [["边界框", "用坐标表示对象空间范围的矩形"], ["IoU", "预测框与真实框交集面积除以并集面积"], ["NMS", "抑制同一对象的高重叠重复预测"], ["mAP", "在类别和阈值设置下汇总 Precision-Recall 的检测指标族"]],
      deepDive: ["框坐标可能采用 xyxy 或 xywh，像素边界是否含端点也要统一，否则面积会出现偏差。", "IoU 达到阈值且类别正确才可匹配为 TP；每个真实框通常只能匹配一次。", "NMS 阈值过低会误删相邻对象，过高会保留重复框。mAP 必须连同具体 IoU 范围和数据集协议报告。"],
      exampleTitle: "手算 IoU", exampleSteps: ["A=(0,0,4,4)，面积 16", "B=(2,2,6,6)，面积 16", "交集为 2×2=4", "并集=16+16-4=28", "IoU=4/28≈0.143"],
      misconceptions: ["分类正确就算检测正确。", "mAP 是单一固定定义。"], limits: ["矩形框不能精确表示不规则轮廓。", "小目标 IoU 对像素偏移非常敏感。"],
      practice: ["手算两组框的 IoU。", "解释提高匹配 IoU 阈值如何影响 TP。"], references: [refs.torchvision, refs.cs231n]
    }),
    lesson("AI-06", 6, {
      slug: "transfer-learning", title: "迁移学习与预训练模型", summary: "复用已学表示，比较冻结特征、微调任务头与全模型微调。",
      why: "小数据视觉任务从头训练通常不稳定。预训练模型能提供通用表示，但输入规范、标签差异和领域偏移必须验证。",
      objectives: ["区分特征提取和全量微调", "替换并初始化任务头", "设置分层学习率和验证策略"],
      concepts: [["迁移学习", "把源任务学到的参数或表示用于目标任务"], ["预训练模型", "已在较大源数据上训练并发布参数的模型"], ["冻结", "训练时不更新指定层参数"], ["微调", "在目标数据上继续更新部分或全部预训练参数"]],
      deepDive: ["先复用预训练要求的 resize、通道顺序与标准化，否则参数面对不同输入分布。", "冻结 backbone 只训练新分类头成本低；数据足够时可逐步解冻并使用更小学习率。", "源数据类别和背景偏差会迁移，必须用目标场景切片和错误图库验证。"],
      exampleTitle: "小数据迁移流程", exampleSteps: ["选择公开预训练 backbone 并记录权重版本", "复用官方 transforms", "替换最后分类层为目标类别数", "先冻结 backbone 训练头", "逐步解冻并比较验证错误切片"],
      misconceptions: ["预训练模型在任何领域都比从头训练好。", "冻结参数后 BatchNorm 等状态无需关注。"], limits: ["领域差异过大时表示迁移收益有限。", "预训练数据的偏差和许可需要审查。"],
      practice: ["写出迁移学习实验的三个对照组。", "列出医学影像迁移时必须重新检查的输入假设。"], references: [refs.pytorchBasics, refs.cs231n]
    }),
    lesson("AI-06", 7, {
      slug: "robustness-bias", title: "视觉偏差、遮挡与分辨率变化", summary: "系统测试模型对采集条件、人群覆盖和小扰动的敏感性。",
      why: "随机测试集平均分无法覆盖遮挡、低光、压缩、设备和背景变化；错误可能集中在现实中重要的少数条件。",
      objectives: ["设计遮挡、模糊和分辨率压力测试", "区分自然分布变化与对抗性输入概念", "按采集条件和人群切片报告"],
      concepts: [["鲁棒性", "输入发生允许范围内变化时保持有效表现的能力"], ["遮挡", "对象部分区域被其他内容覆盖"], ["分辨率变化", "空间采样精细程度改变导致细节丢失"], ["对抗性输入", "为诱导模型错误而有目的构造的微小或受限扰动"]],
      deepDive: ["压力测试应从产品允许的真实变化开始：裁剪、压缩、低光、旋转、设备和背景。", "如果训练数据把类别和背景绑定，模型可能依赖背景捷径而不是对象本身。", "对抗性例子说明局部敏感性，但防护结论必须基于明确威胁模型，普通增广不等于完整对抗防御。"],
      exampleTitle: "错误图库切片", exampleSteps: ["保存原图、标签、预测和置信度", "标注遮挡/低光/小目标/背景等条件", "每个切片统计样本数和准确率", "比较原始与压力测试结果", "选择补数据、改预处理或拒绝策略"],
      misconceptions: ["加入随机噪声就证明模型安全。", "总体准确率稳定就没有群体偏差。"], limits: ["测试只覆盖已定义的变化集合。", "合成扰动可能不代表真实采集流程。"],
      practice: ["为门禁识别设计五个现实压力切片。", "解释背景捷径如何在随机切分中被掩盖。"], references: [refs.cs231n, refs.torchvision]
    }),

    lesson("AI-07", 1, {
      slug: "normalization-tokenization", title: "文本规范化、分词与词表", summary: "把原始字符串转成稳定 token 序列，同时保留任务需要的语义差异。",
      why: "大小写、Unicode、空白和分词规则会改变词表与序列；训练和推理使用不同 tokenizer 会让同一文本得到不同 ID。",
      objectives: ["区分规范化与分词", "解释 token、词表和未知词", "记录 tokenizer 配置并检查序列长度"],
      concepts: [["文本规范化", "按任务规则统一 Unicode、大小写、空白或符号"], ["分词", "把字符串切分为词、子词、字符或其他 token"], ["词表", "token 到整数 ID 的固定映射"], ["未知词", "不在固定词表中、需映射或拆分的输入"]],
      deepDive: ["规范化不是越多越好：情感任务中的感叹号、代码中的大小写和中文空格都可能有含义。", "词级分词词表大且有 OOV，字符级序列长，子词在词表规模和未知词之间折中。", "tokenizer 是模型接口的一部分，词表顺序改变会让同一 ID 对应不同 token。"],
      exampleTitle: "中文文本处理", exampleSteps: ["原文“AI很好！ ”", "统一尾部空白但保留感叹号", "按所选 tokenizer 得到 token", "查词表映射为 ID", "添加特殊 token 并截断/填充到固定长度"],
      misconceptions: ["删除所有标点总能提高质量。", "词表包含同样的词就能任意换顺序。"], limits: ["分词规则会影响不同语言和领域。", "固定长度截断可能删除关键证据。"],
      practice: ["为情感和代码分类分别设计规范化规则。", "解释词级与子词分词处理生词的差异。"], references: [refs.cs224n, refs.hfCourse]
    }),
    lesson("AI-07", 2, {
      slug: "bow-tfidf", title: "One-hot、词袋与 TF-IDF", summary: "把文档表示成稀疏词项向量，建立快速、可解释的文本基线。",
      why: "TF-IDF + 线性模型在许多文本分类任务上是强基线；它训练快、特征可检查，也清楚暴露忽略词序的问题。",
      objectives: ["构造词袋计数向量", "手算 TF 与 IDF", "解释稀疏矩阵和 n-gram 的成本"],
      concepts: [["One-hot", "只有一个词表位置为 1 的 token 表示"], ["词袋", "统计文档中词项出现而忽略顺序的表示"], ["TF-IDF", "用文档内频率与跨文档稀有度共同加权词项"], ["稀疏矩阵", "只存储大量零元素中的非零项及其位置"]],
      deepDive: ["词袋文档向量维度等于词表大小；词序丢失，因此“喜欢不”和“不喜欢”可能需要 bigram 区分。", "常见平滑 IDF 形式 log((1+n)/(1+df))+1，具体实现应记录版本和公式。", "稀疏表示无需转成密集数组；密集化大词表矩阵会造成巨大内存开销。"],
      exampleTitle: "三文档 IDF", exampleSteps: ["三篇文档中“课程”出现在 3 篇", "“梯度”只出现在 1 篇", "梯度的 IDF 高于课程", "同一文档中出现次数形成 TF", "TF×IDF 得到最终权重"],
      misconceptions: ["TF-IDF 会理解词义。", "转成 dense 能让线性模型更准确。"], limits: ["词袋难以表达长距离词序和上下文。", "词表变化会改变特征空间。"],
      practice: ["为三句短文本手工建词袋。", "运行文本基线并查看最高权重词。"], references: [refs.sklearnText, refs.cs224n], labId: "ai-lab-text-baseline", type: "实验", duration: 65
    }),
    lesson("AI-07", 3, {
      slug: "embeddings-similarity", title: "Word Embedding 与相似度", summary: "用稠密向量表示 token，并理解相似度来自训练目标与语料。",
      why: "Embedding 能让相关词在向量空间接近，但距离不是词义真理；语料偏差、多义词和归一化方式会改变结果。",
      objectives: ["区分 one-hot 与 embedding", "手算点积和余弦相似度", "解释静态 embedding 的多义词限制"],
      concepts: [["Embedding", "把离散 token ID 映射为可训练稠密向量"], ["余弦相似度", "向量点积除以长度乘积，衡量方向接近程度"], ["分布假设", "出现在相似上下文的词往往具有相关用法"], ["静态表示", "同一 token 在不同上下文使用同一向量"]],
      deepDive: ["Embedding 矩阵 shape=(vocab_size,dim)，查表得到序列 shape=(batch,length,dim)。", "余弦相似度忽略向量长度，但仍受训练语料、目标和后处理影响。", "静态向量把“苹果公司”和“苹果水果”的多种含义压在一个向量中， contextual representation 才能随句子改变。"],
      exampleTitle: "手算余弦", exampleSteps: ["a=[1,1]，b=[2,0]", "点积=2", "|a|=√2，|b|=2", "cos=2/(2√2)=0.707", "相似度只说明当前表示下方向接近"],
      misconceptions: ["相似度高就证明两个词含义相同。", "embedding 的每个维度都有固定人类语义。"], limits: ["训练语料偏差会进入向量关系。", "相似度阈值必须按具体任务验证。"],
      practice: ["手算两组二维向量余弦。", "列出静态 embedding 处理多义词的失败例子。"], references: [refs.cs224n, refs.d2l]
    }),
    lesson("AI-07", 4, {
      slug: "sequence-position-context", title: "序列、位置与上下文", summary: "理解相同 token 在不同顺序和邻域中为什么需要不同表示。",
      why: "词袋忽略顺序，但自然语言中的否定、指代和修饰依赖位置；序列模型必须保留或注入位置信息。",
      objectives: ["举例说明词序改变语义", "区分局部上下文和长距离依赖", "解释 padding mask 的职责"],
      concepts: [["序列", "按位置排列的 token 集合"], ["位置表示", "让模型区分同一 token 在不同位置的信息"], ["上下文", "影响当前 token 解释的其他 token 与任务信息"], ["Padding Mask", "阻止填充位置参与有效计算或损失"]],
      deepDive: ["“狗追猫”和“猫追狗”词袋相同但角色相反；bigram 能保留局部顺序，仍难覆盖长依赖。", "批处理不同长度序列常补 PAD 到相同长度，必须在注意力或损失中屏蔽。", "截断方向决定保留开头还是结尾，问答和对话中可能直接删除关键证据。"],
      exampleTitle: "变长序列 batch", exampleSteps: ["序列 A 长 3，B 长 5", "补 A 为 [a,b,c,PAD,PAD]", "生成 mask [1,1,1,0,0]", "模型计算时屏蔽 PAD", "损失只统计真实 token"],
      misconceptions: ["加入 padding 不会影响任何计算。", "序列越长上下文一定越充分。"], limits: ["长上下文增加计算与噪声。", "位置表示并不自动解决指代和事实理解。"],
      practice: ["为三条不同长度文本构造 padding mask。", "举两个词袋相同但语义不同的句子。"], references: [refs.cs224n, refs.hfCourse]
    }),
    lesson("AI-07", 5, {
      slug: "nlp-tasks", title: "文本分类、序列标注与问答", summary: "按输出粒度区分整段标签、逐 token 标签与基于上下文的答案。",
      why: "任务名称相似不代表数据和指标相同。先明确输入输出结构，才能选择标注方式、模型头和评价方法。",
      objectives: ["区分三类 NLP 任务的输出 shape", "为序列标注处理 token-label 对齐", "区分抽取式和生成式问答"],
      concepts: [["文本分类", "为整段文本输出一个或多个类别"], ["序列标注", "为序列中每个 token 输出标签"], ["抽取式问答", "从给定上下文中预测答案起止位置"], ["生成式问答", "根据输入生成答案 token 序列"]],
      deepDive: ["分类 logits 常为 (batch,num_classes)；多标签任务各类别独立，不应直接用单标签 softmax。", "子词分词会把一个原词拆开，NER 标签必须定义只标首子词还是传播到全部子词。", "问答评价除字符串匹配，还要检查上下文是否包含证据、答案是否忠实以及无答案情况。"],
      exampleTitle: "NER 标签对齐", exampleSteps: ["原词 Beijing 标签 B-LOC", "tokenizer 拆为 Bei、##jing", "保留 word_ids 映射", "按约定给首子词 B-LOC，其余忽略或 I-LOC", "计算 loss 时屏蔽忽略位置"],
      misconceptions: ["所有文本任务都能用 Accuracy。", "生成式问答答案流畅就代表有证据。"], limits: ["标注规范差异会改变任务定义。", "字符串指标无法完整评价答案事实性。"],
      practice: ["为情感、NER、问答分别写输入输出示例。", "说明多标签分类为何不使用单一 softmax。"], references: [refs.cs224n, refs.hfCourse]
    }),
    lesson("AI-07", 6, {
      slug: "rnn-lstm", title: "RNN、LSTM 的动机与限制", summary: "按时间步更新隐藏状态，理解门控如何缓解但不消除长依赖问题。",
      why: "RNN 展示了序列状态递推的核心思想，也是理解 Transformer 并行性和长依赖改进动机的重要前置。",
      objectives: ["写出 RNN 隐藏状态递推", "解释展开后的反向传播", "说明 LSTM 门控解决什么、仍受什么限制"],
      concepts: [["RNN", "使用共享参数按时间步递推隐藏状态的序列网络"], ["隐藏状态", "汇总截至当前时间步信息的向量"], ["BPTT", "在展开的时间步计算图上执行反向传播"], ["LSTM", "用输入、遗忘和输出门控制状态流的门控 RNN"]],
      deepDive: ["基本递推 h_t=f(Wx_t+Uh_{t-1}+b)，同一参数跨时间共享。", "长序列反向时多次乘 Jacobian，可能造成梯度消失或爆炸；梯度裁剪主要限制爆炸。", "LSTM 的加性 cell state 改善梯度流，但序列计算仍难完全并行，超长依赖也没有保证。"],
      exampleTitle: "三步序列", exampleSteps: ["h0 初始化为零", "输入 x1 得到 h1", "x2 与 h1 得到 h2", "x3 与 h2 得到 h3", "分类头可读取 h3 或全部时间步"],
      misconceptions: ["LSTM 完全解决了梯度消失。", "RNN 每个时间步使用不同参数。"], limits: ["递推依赖限制长序列训练并行度。", "最后隐藏状态可能成为信息瓶颈。"],
      practice: ["画出长度 4 的展开计算图。", "解释梯度裁剪能处理爆炸但不能恢复已消失梯度。"], references: [refs.cs224n, refs.mit]
    }),
    lesson("AI-07", 7, {
      slug: "language-bias-evaluation", title: "语言覆盖、数据偏差与评估切片", summary: "按语言、方言、主题和文本长度检查 NLP 系统的覆盖与失败。",
      why: "总体测试集常被高资源语言和常见写法主导；分词覆盖、标注规范和社会偏差可能集中影响特定人群。",
      objectives: ["统计词表覆盖与未知/子词长度", "按语言和文本条件建立评估切片", "审查标签与语料中的刻板关联"],
      concepts: [["语言覆盖", "训练和评价数据对目标语言、方言与写法的代表程度"], ["分词覆盖", "输入被词表有效表示而不过度碎片化的程度"], ["评估切片", "按语言、长度、主题或群体拆分的指标子集"], ["数据偏差", "采集、标注和历史文本中的系统性不均衡或关联"]],
      deepDive: ["未知词率低不代表公平：子词 tokenizer 可能把低资源语言拆成更长序列，增加截断和计算成本。", "按语言、代码混合、错别字、长度和领域报告样本数与指标，避免只看 micro average。", "偏差审计要检查数据来源、标注指南和模型错误，不把词向量关联直接等同于现实属性。"],
      exampleTitle: "多语言评估表", exampleSteps: ["列出每种语言样本数", "统计平均 token/字符比和截断率", "分别计算 Precision/Recall", "抽样高置信错误并归类", "记录未覆盖语言与禁止用途"],
      misconceptions: ["支持 Unicode 就等于支持所有语言。", "总体 F1 提升代表每种语言都提升。"], limits: ["小语种样本少时指标区间很宽。", "预定义切片无法覆盖所有社会影响。"],
      practice: ["为中文、英文和中英混合文本设计评估表。", "列出 tokenizer 对低资源语言可能造成的三种成本。"], references: [refs.cs224n, refs.hfCourse]
    })
  ];

  const labs = [
    {
      id: "ai-lab-training-loop", number: "AI-LAB-06", lessonId: "ai-05-training-loop", title: "完整训练、验证与早停循环", environment: "浏览器 JavaScript", duration: 20,
      goal: "训练一个单参数回归模型，逐 epoch 记录训练/验证损失，保存最佳参数并按 patience 早停。",
      inputs: "固定训练集和验证集；可调整学习率、最大 epoch 与 patience。",
      evidence: ["逐轮训练/验证损失", "最佳 epoch 与 checkpoint 参数", "早停后恢复最佳参数"],
      controls: [{ id: "learningRate", label: "学习率", value: 0.08 }, { id: "epochs", label: "最大轮数", value: 40 }, { id: "patience", label: "Patience", value: 5 }],
      code: "model.train()\nfor x, y in train_loader:\n    optimizer.zero_grad()\n    loss = criterion(model(x), y)\n    loss.backward()\n    optimizer.step()\nmodel.eval()\nwith torch.no_grad():\n    val_loss = validate(model, val_loader)\n# 保存最低 val_loss 的 state_dict，并按 patience 早停",
      run(config = {}) {
        const lr = Number.isFinite(config.learningRate) ? Math.max(0.001, Math.min(0.5, config.learningRate)) : 0.08;
        const epochs = Number.isFinite(config.epochs) ? Math.max(1, Math.min(100, Math.round(config.epochs))) : 40;
        const patience = Number.isFinite(config.patience) ? Math.max(1, Math.min(20, Math.round(config.patience))) : 5;
        const train = [[-2,-3],[-1,-1],[0,1],[1,3],[2,5]];
        const validation = [[-1.5,-1.25],[-0.5,0.25],[0.5,1.75],[1.5,3.25]];
        let w = 0, b = 0, best = { loss: Infinity, epoch: 0, w, b }, stale = 0;
        const mse = (rows, pw, pb) => rows.reduce((sum,[x,y]) => sum + (pw*x+pb-y)**2, 0) / rows.length;
        const history = [];
        for (let epoch = 1; epoch <= epochs; epoch += 1) {
          let gw = 0, gb = 0;
          train.forEach(([x,y]) => { const error=w*x+b-y; gw += 2*error*x/train.length; gb += 2*error/train.length; });
          w -= lr*gw; b -= lr*gb;
          const trainLoss=mse(train,w,b), valLoss=mse(validation,w,b);
          history.push({epoch,trainLoss,valLoss,w,b});
          if (valLoss < best.loss - 1e-6) { best={loss:valLoss,epoch,w,b}; stale=0; } else stale += 1;
          if (stale >= patience) break;
        }
        return { history, best, stoppedAt: history.length, restored: { w:best.w,b:best.b }, earlyStopped: history.length < epochs };
      },
      formatResult(result) {
        const tail = result.history.slice(-8);
        return ["epoch | train_loss | val_loss | w | b", ...tail.map((row)=>`${row.epoch} | ${row.trainLoss.toFixed(5)} | ${row.valLoss.toFixed(5)} | ${row.w.toFixed(4)} | ${row.b.toFixed(4)}`), "", `最佳 epoch：${result.best.epoch}`, `最佳 val_loss：${result.best.loss.toFixed(6)}`, `恢复 checkpoint：w=${result.restored.w.toFixed(4)}, b=${result.restored.b.toFixed(4)}`, `停止位置：${result.stoppedAt}${result.earlyStopped ? "（早停）" : "（达到最大轮数）"}`].join("\n");
      }
    },
    {
      id: "ai-lab-vision-errors", number: "AI-LAB-07", lessonId: "ai-06-classification-topk", title: "视觉错误图库与压力切片", environment: "浏览器 JavaScript", duration: 15,
      goal: "对一组带条件标签的分类结果生成混淆统计和错误图库，比较遮挡、低光、小目标等切片。",
      inputs: "12 条固定视觉样本记录，包含真实类、预测类、置信度和采集条件。",
      evidence: ["总体和分切片准确率", "具体错误样本", "高置信错误与主要失败条件"], controls: [],
      run() {
        const rows = [
          ["img-01","猫","猫",.94,"清晰"],["img-02","狗","狗",.91,"清晰"],["img-03","猫","狗",.82,"遮挡"],["img-04","狗","狗",.65,"遮挡"],
          ["img-05","鸟","鸟",.88,"清晰"],["img-06","鸟","猫",.76,"小目标"],["img-07","猫","猫",.61,"低光"],["img-08","狗","猫",.79,"低光"],
          ["img-09","鸟","鸟",.57,"压缩"],["img-10","猫","狗",.86,"背景干扰"],["img-11","狗","狗",.72,"小目标"],["img-12","鸟","鸟",.69,"背景干扰"]
        ].map(([id,label,prediction,confidence,slice])=>({id,label,prediction,confidence,slice,correct:label===prediction}));
        const slices = [...new Set(rows.map((row)=>row.slice))].map((slice)=>{ const group=rows.filter((row)=>row.slice===slice); return {slice,count:group.length,accuracy:group.filter((row)=>row.correct).length/group.length}; });
        return { rows, slices, accuracy: rows.filter((row)=>row.correct).length/rows.length, errors: rows.filter((row)=>!row.correct).sort((a,b)=>b.confidence-a.confidence) };
      },
      formatResult(result) {
        return [`总体 Accuracy：${(result.accuracy*100).toFixed(1)}%`, "", "切片 | 样本数 | Accuracy", ...result.slices.map((row)=>`${row.slice} | ${row.count} | ${(row.accuracy*100).toFixed(1)}%`), "", "错误图库：ID | 真实 | 预测 | 置信度 | 条件", ...result.errors.map((row)=>`${row.id} | ${row.label} | ${row.prediction} | ${row.confidence.toFixed(2)} | ${row.slice}`)].join("\n");
      }
    },
    {
      id: "ai-lab-text-baseline", number: "AI-LAB-08", lessonId: "ai-07-bow-tfidf", title: "TF-IDF 文本分类基线", environment: "浏览器 JavaScript", duration: 20,
      goal: "从训练语料拟合词表和 IDF，用类别质心余弦相似度分类测试文本，并输出可解释词权重。",
      inputs: "6 条训练短句、4 条测试短句；仅用训练集拟合词表和 IDF。",
      evidence: ["词表和高 IDF 词", "每条测试文本的类别相似度", "未登录词与误分类样本"], controls: [],
      run() {
        const train = [["课程 学习 笔记","学习"],["复习 练习 课程","学习"],["笔记 知识 复习","学习"],["退款 订单 售后","售后"],["退货 客服 订单","售后"],["售后 退款 处理","售后"]];
        const tests = [["课程 复习","学习"],["订单 退款","售后"],["客服 处理","售后"],["知识 退费","售后"]];
        const tokenize=(text)=>text.trim().split(/\s+/).filter(Boolean);
        const vocab=[...new Set(train.flatMap(([text])=>tokenize(text)))].sort();
        const idf=Object.fromEntries(vocab.map((word)=>{const df=train.filter(([text])=>tokenize(text).includes(word)).length;return [word,Math.log((1+train.length)/(1+df))+1];}));
        const vector=(text)=>{const words=tokenize(text),counts=Object.create(null);words.forEach((word)=>counts[word]=(counts[word]||0)+1);return vocab.map((word)=>(counts[word]||0)/Math.max(1,words.length)*idf[word]);};
        const cosine=(a,b)=>{const dot=a.reduce((s,v,i)=>s+v*b[i],0),na=Math.sqrt(a.reduce((s,v)=>s+v*v,0)),nb=Math.sqrt(b.reduce((s,v)=>s+v*v,0));return dot/(na*nb||1);};
        const classes=[...new Set(train.map(([,label])=>label))];
        const centroids=Object.fromEntries(classes.map((label)=>{const vectors=train.filter(([,y])=>y===label).map(([text])=>vector(text));return [label,vocab.map((_,i)=>vectors.reduce((s,row)=>s+row[i],0)/vectors.length)];}));
        const details=tests.map(([text,label])=>{const scores=Object.fromEntries(classes.map((name)=>[name,cosine(vector(text),centroids[name])]));const prediction=classes.sort((a,b)=>scores[b]-scores[a])[0];const unknown=tokenize(text).filter((word)=>!vocab.includes(word));return {text,label,prediction,scores,unknown,correct:prediction===label};});
        const topTerms=Object.entries(idf).sort((a,b)=>b[1]-a[1]).slice(0,5);
        return {vocab,topTerms,details,accuracy:details.filter((row)=>row.correct).length/details.length};
      },
      formatResult(result) {
        return [`词表大小：${result.vocab.length}`, `最高 IDF：${result.topTerms.map(([word,value])=>`${word}=${value.toFixed(2)}`).join("，")}`, `测试 Accuracy：${(result.accuracy*100).toFixed(1)}%`, "", "文本 | 真实 | 预测 | 学习分 | 售后分 | 未登录词", ...result.details.map((row)=>`${row.text} | ${row.label} | ${row.prediction} | ${row.scores["学习"].toFixed(3)} | ${row.scores["售后"].toFixed(3)} | ${row.unknown.join(",")||"无"}`), "", "边界：该实验是 TF-IDF 基线，不包含预训练语言模型；语义同义词需要额外数据或上下文模型。"].join("\n");
      }
    }
  ];

  data.lessons.push(...lessons.map((item, index) => ({ ...item, order: data.lessons.length + index })));
  data.labs.push(...labs);
  for (const moduleId of ["AI-05", "AI-06", "AI-07"]) {
    const module = data.modules.find((item) => item.id === moduleId);
    if (module) module.status = "open";
  }
  const knownReferences = new Set(data.references.map((item) => item.id));
  Object.values(refs).forEach((reference) => { if (!knownReferences.has(reference.id)) data.references.push(reference); });
}());
