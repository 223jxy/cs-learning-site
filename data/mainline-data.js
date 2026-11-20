"use strict";

// Mainline stages, glossary, daily tasks and stage-level helper copy.
const stages = [
  {
    id: 0,
    title: "电脑使用基础",
    subtitle: "文件、路径、命名、格式、压缩、下载与备份",
    color: "green",
    lessons: [
      {
        id: "file-basics",
        title: "文件、文件夹与扩展名",
        duration: 48,
        level: "起步",
        summary: "理解文件、文件夹、扩展名、真实格式、打开方式和伪装风险之间的关系。",
        why: "文件是数据容器，文件夹是整理容器，扩展名是系统和应用判断文件类型的重要线索。先看懂扩展名，才能判断文件能用什么打开、改名会改变什么、下载文件为什么可能危险。",
        concepts: [
          "文件是存放数据的对象，可以是文本、图片、视频、程序、压缩包或配置。",
          "文件夹是组织文件和其他文件夹的容器，本身也有名称和路径。",
          "文件名通常包含基础名称和扩展名，例如 学习计划.docx。",
          "扩展名位于最后一个点号后面，用来提示文件类型和默认打开程序。",
          "扩展名不是文件内容本身，改名不会把一种格式真正转换成另一种格式。",
          "Windows 可以隐藏已知文件类型的扩展名，学习阶段应主动显示扩展名。",
          "同一个扩展名可能被多个程序打开，同一个程序也可能支持多种扩展名。",
          "真实文件格式还可能由文件头、MIME type 或应用解析结果判断，不能只看后缀。",
          "照片.jpg.exe 这类双扩展名文件在隐藏扩展名时容易伪装成图片。",
          "同一文件夹内不能有两个完全同名的文件，系统或应用会添加 (1)、副本或编号。",
          "Windows 文件名不能使用反斜杠等保留字符，也不建议以空格或句点结尾。",
          "清晰命名应包含主题、日期和版本，例如 2026-07-21_课程笔记_文件系统_v01.md。"
        ],
        example: "学习计划.docx\n├─ 学习计划  ← 人能读懂的名称\n└─ .docx     ← 格式扩展名\n\n照片.jpg.exe  ← 若隐藏扩展名，可能被误看成图片",
        practice: "在资源管理器中开启“查看 → 显示 → 文件扩展名”，再找出图片、文档、压缩包和程序文件的完整名称。",
        checkpoint: "你能解释为什么修改扩展名不等于转换文件格式，并能识别隐藏扩展名、双扩展名和命名冲突带来的风险。",
        density: "sample-v1",
        prerequisites: [
          "能打开 Windows 文件资源管理器。",
          "能创建一个测试文件夹，不在重要资料目录里做实验。",
          "知道文件和文件夹都可以被重命名。"
        ],
        objectives: [
          "区分文件、文件夹、文件名、扩展名和文件格式。",
          "在 Windows 文件资源管理器中显示文件扩展名。",
          "判断改扩展名会改变什么、不会改变什么。",
          "识别照片.jpg.exe 这类伪装文件风险。",
          "设计一套适合学习资料的文件命名规则。"
        ],
        knowledgePoints: [
          { term: "文件", detail: "存放数据的基本对象，内容可以是文本、图片、程序、压缩包或结构化数据。", misconception: "文件不是只指 Word 文档，程序和图片也是文件。" },
          { term: "文件夹", detail: "用于组织文件和子文件夹，让路径形成层级结构。", misconception: "文件夹不是文件内容格式，它主要负责位置和组织。" },
          { term: "基础名称", detail: "文件名中给人看的主体部分，例如 学习计划.docx 里的 学习计划。", misconception: "基础名称改了通常不改变文件内容。" },
          { term: "扩展名", detail: "最后一个点号后的后缀，例如 .docx、.jpg、.exe，用来提示类型和打开方式。", misconception: "扩展名不是格式转换器。" },
          { term: "默认打开程序", detail: "系统根据扩展名和关联设置决定双击时用哪个应用打开。", misconception: "打不开不一定是文件坏了，也可能是没有合适程序。" },
          { term: "真实格式", detail: "文件内部数据结构才决定真实格式，扩展名只是重要线索。", misconception: "把 .txt 改成 .jpg 不会自动变成图片。" },
          { term: "隐藏扩展名", detail: "Windows 可隐藏已知文件类型扩展名，导致 文件.jpg.exe 只显示成 文件.jpg。", misconception: "看见图标像图片不代表它真是图片。" },
          { term: "命名冲突", detail: "同一文件夹内完整文件名必须可区分，下载或复制时常出现 (1) 或 副本。", misconception: "出现 (1) 不是系统乱命名，而是在避免覆盖。" },
          { term: "保留字符", detail: "Windows 路径用某些字符表达层级和设备含义，所以文件名不能随便使用。", misconception: "所有符号都能放进文件名是错误的。" },
          { term: "MIME type", detail: "Web 场景中服务器会用 Content-Type 说明资源类型，浏览器处理网页资源时主要看它。", misconception: "网页下载和本地 Windows 打开文件完全不是同一套判断机制。" },
          { term: "magic number / 文件头", detail: "很多格式开头有特征字节，可辅助判断真实类型，但也不是所有类型都有可靠标记。", misconception: "只看扩展名就能 100% 判断文件真实类型。" },
          { term: "版本命名", detail: "学习资料建议用 日期_主题_版本，方便排序、回退和复盘。", misconception: "最终版2真的最终版 不是可维护命名。" }
        ],
        deepDive: [
          "当你在 Windows 里看到一个文件，屏幕上显示的是名称、图标、大小、修改时间等元数据；文件真正的数据存放在磁盘或其他存储介质中。文件夹提供组织层级，路径把层级串起来，例如 D:\\ComputerLearning\\notes\\学习计划.docx。",
          "扩展名是文件名的一部分，不是文件内容本身。Microsoft 的 Windows 帮助说明，扩展名会告诉电脑哪个应用创建或可以打开该文件，以及在文件资源管理器中显示什么图标；同时，修改扩展名不会把文件转换成另一种格式，只会改变文件名和关联线索。",
          "这就是为什么 学习计划.txt 改名为 学习计划.jpg 后，文件不会自动变成照片。真正的图片文件内部要符合 JPEG、PNG 等格式结构；纯文本文件内部仍然只是文本。某些程序可能尝试打开它，但通常会报错、显示异常或提示格式不受支持。",
          "Windows 文件资源管理器可以隐藏已知文件类型扩展名。对新手来说这会制造风险：照片.jpg.exe 在隐藏扩展名时可能只露出 照片.jpg，加上图标伪装，就容易误判。学习计算机时应先打开“文件扩展名”显示，先看完整名称再双击。",
          "在 Web 里还会遇到 MIME type。MDN 说明，浏览器处理网络资源时依赖服务器发送的 MIME type，而不是只看 URL 里的后缀；文件后缀、MIME type、文件头都是判断类型的线索，但任何单一线索都不应被当成绝对真相。"
        ],
        systemPosition: "文件名和扩展名位于“用户界面 / 文件系统 / 应用程序关联”交界处。资源管理器负责展示文件，文件系统负责保存名称与数据，应用程序负责解析具体格式，浏览器还会使用 MIME type 处理网络资源。后续学习路径、命令行、编程读写文件、Web 下载、安全分析时，都会不断遇到这些边界。",
        workedExamples: [
          {
            title: "示范 A：拆解一个文件名",
            scenario: "判断 2026-07-21_课程笔记_文件系统_v01.md 每一段是什么意思。",
            steps: [
              "找到最后一个点号：.md。",
              "点号前面是基础名称：2026-07-21_课程笔记_文件系统_v01。",
              "日期 2026-07-21 用于排序和追踪时间。",
              "主题 课程笔记_文件系统 用于搜索。",
              "版本 v01 用于后续迭代，避免 最终版 这类混乱命名。",
              "扩展名 .md 表示 Markdown 文本文件，通常可用 VS Code、记事本或 Markdown 编辑器打开。"
            ],
            input: "2026-07-21_课程笔记_文件系统_v01.md",
            output: "基础名称：2026-07-21_课程笔记_文件系统_v01\n扩展名：.md\n可能类型：Markdown 文本\n推荐打开程序：VS Code / 记事本 / Markdown 编辑器",
            checkpoints: ["能找出最后一个点号。", "能区分主题、日期、版本。", "能说明 .md 只是类型线索，不是内容保证。"]
          },
          {
            title: "示范 B：改扩展名为什么不等于格式转换",
            scenario: "把 demo.txt 改名成 demo.jpg，观察为什么它不是图片。",
            steps: [
              "新建 test-file-lab 文件夹。",
              "新建 demo.txt，写入 hello computer。",
              "打开文件扩展名显示。",
              "把 demo.txt 改名为 demo.jpg。",
              "尝试用图片查看器打开，记录错误现象。",
              "再用记事本打开，观察内容仍是 hello computer。",
              "结论：文件名变了，但内部数据结构没有变。"
            ],
            input: "demo.txt 内容：hello computer",
            output: "demo.jpg 仍然是文本内容；图片查看器可能提示格式不支持。",
            checkpoints: ["能解释文件名变化和内容变化的区别。", "能记录哪个程序如何报错。"]
          },
          {
            title: "示范 C：识别双扩展名风险",
            scenario: "判断 照片.jpg.exe 为什么危险。",
            steps: [
              "先打开文件扩展名显示。",
              "观察完整文件名的最后扩展名是 .exe。",
              "认识 .exe 通常表示 Windows 可执行程序。",
              "不要只看图标或前半段 .jpg。",
              "来源不明的可执行文件不要双击，先删除或放入隔离测试目录。"
            ],
            input: "照片.jpg.exe",
            output: "最后扩展名：.exe；风险判断：不是普通图片，应按可执行文件处理。",
            checkpoints: ["能说明为什么看最后一个扩展名。", "能说明图标不等于真实类型。"]
          }
        ],
        mistakes: [
          { wrong: "把 .txt 改成 .jpg 就变成图片。", why: "扩展名只是文件名的一部分，不会重写文件内部数据结构。", correct: "需要用真正的转换工具或导出功能生成目标格式。" },
          { wrong: "看图标像 Word 文档，就一定安全。", why: "图标可能来自文件关联或伪装，不能证明内容安全。", correct: "先看完整扩展名、来源、大小和属性，来源不明不要运行。" },
          { wrong: "Windows 不显示扩展名也没关系。", why: "隐藏扩展名会降低判断能力，尤其容易误判双扩展名文件。", correct: "学习阶段建议始终显示文件扩展名。" },
          { wrong: "下载文件出现 (1) 是系统出错。", why: "通常是同名文件已存在，系统或浏览器为避免覆盖而自动编号。", correct: "检查是否已有旧文件，再按日期或版本重命名。" },
          { wrong: "文件夹名可以随便用任何符号。", why: "Windows 路径和设备名有保留规则，某些字符或名称不能用于普通文件名。", correct: "避免 \\ / : * ? \" < > | 和 CON、NUL 等保留名。" }
        ],
        troubleshooting: [
          "打不开文件：先确认扩展名，再确认是否安装了能打开该格式的应用。",
          "文件看起来是图片但打不开：检查是否只是改了扩展名，或文件是否损坏。",
          "找不到刚下载的文件：按修改时间排序，检查是否被命名为 文件名 (1)。",
          "无法重命名：检查是否用了 Windows 保留字符、保留设备名，或文件正在被程序占用。",
          "担心文件伪装：打开扩展名显示，查看属性，确认最后扩展名和来源，不运行来源不明的 .exe、.bat、.cmd、.msi。",
          "同名文件太多：按 主题_日期_版本 重命名，并把旧版本移动到 archive 文件夹。"
        ],
        practices: [
          {
            level: "基础练习",
            title: "显示扩展名并分类",
            task: "在一个测试文件夹中放入或新建 .txt、.jpg、.zip、.docx 四类文件；若要观察 .exe，只记录一个已知来源的系统程序或安装程序文件名，不要把空白文本文件改名后双击运行。打开扩展名显示后，写出每个文件的基础名称、扩展名和可能打开程序。",
            evidence: "提交一张表格：完整文件名 / 基础名称 / 扩展名 / 可能类型 / 打开方式，并标注哪些只是名称观察、哪些是真实可执行文件。"
          },
          {
            level: "进阶练习",
            title: "验证改名不等于转换",
            task: "创建 demo.txt，写入一行文字，把它改名为 demo.jpg；先用记事本打开验证内容仍是文本，再由系统提示选择图片查看器时取消，不要把它当作真实图片运行或上传。",
            evidence: "提交观察记录：哪个程序打开失败，哪个程序仍能看到原文本。"
          },
          {
            level: "项目化练习",
            title: "整理自己的课程资料命名规则",
            task: "建立 computer-learning-notes 文件夹，设计 5 个课程笔记文件名，必须包含日期、主题和版本号。",
            evidence: "提交命名规则说明和 5 个示例文件名。"
          }
        ],
        quiz: [
          {
            prompt: "学习计划.docx 中，哪一部分是扩展名？",
            options: ["学习计划", ".docx", "学习", "计划.docx"],
            answerIndex: 1,
            explanation: "扩展名通常是最后一个点号后的部分，这里是 .docx。"
          },
          {
            prompt: "把 demo.txt 改名为 demo.jpg 后，最准确的说法是？",
            options: ["它一定变成图片", "它的文件名变了，但内容格式不一定变", "Windows 会自动转换格式", "它会自动损坏"],
            answerIndex: 1,
            explanation: "改扩展名只改文件名和类型线索，不会自动改写内部数据结构。"
          },
          {
            prompt: "为什么建议初学者显示文件扩展名？",
            options: ["可以让电脑运行更快", "可以更容易判断文件类型和伪装风险", "可以自动删除病毒", "可以减少文件大小"],
            answerIndex: 1,
            explanation: "显示完整扩展名能帮助识别 .exe、.bat 等可执行文件和双扩展名伪装。"
          },
          {
            prompt: "照片.jpg.exe 最后一个扩展名是什么？",
            options: [".jpg", ".exe", ".jpg.exe", "没有扩展名"],
            answerIndex: 1,
            explanation: "Windows 判断文件名后缀时要看最后一个扩展名，.exe 通常表示可执行程序。"
          },
          {
            prompt: "同一文件夹里下载同名文件后出现 报告 (1).pdf，通常说明什么？",
            options: ["系统随机命名", "原来已有 报告.pdf，浏览器为避免覆盖而编号", "PDF 文件损坏", "文件被自动压缩"],
            answerIndex: 1,
            explanation: "出现 (1) 多数是命名冲突处理，不是格式转换。"
          },
          {
            prompt: "以下哪组字符不适合作为 Windows 文件名的一部分？",
            options: ["中文、数字和下划线", "日期和主题", "\\ / : * ? \" < > |", "短横线和版本号"],
            answerIndex: 2,
            explanation: "这些字符在 Windows 路径或系统接口中有特殊含义，通常不能用于文件名。"
          }
        ],
        projectLinks: [
          "阶段 0 资料整理项目：建立 computer-learning-notes 文件夹。",
          "项目作品集准备：后续所有项目 README、截图、日志都要靠稳定命名保存。",
          "安全方向准备：识别双扩展名和可执行文件是基础风险判断能力。"
        ],
        references: [
          {
            title: "Microsoft Support：Common file name extensions in Windows",
            url: "https://support.microsoft.com/en-US/Windows/Experience/Storage-FileManagement/common-file-name-extensions-in-windows",
            usage: "扩展名由文件名和后缀组成、提示打开程序；修改扩展名不会转换格式。"
          },
          {
            title: "Microsoft Support：File Explorer in Windows",
            url: "https://support.microsoft.com/en-us/windows/view-hidden-files-and-folders-in-windows-97fbc472-c603-9d90-91d0-1166d1d9f4b5",
            usage: "Windows 11 / Windows 10 显示文件扩展名的入口。"
          },
          {
            title: "Microsoft Learn：Naming Files, Paths, and Namespaces",
            url: "https://learn.microsoft.com/windows/win32/fileio/naming-a-file",
            usage: "Windows 文件名、路径分隔符、保留字符、保留设备名和结尾空格/句点规则。"
          },
          {
            title: "MDN：Media types / MIME types",
            url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types",
            usage: "Web 场景中文件后缀不是唯一判断依据，浏览器处理资源时依赖 MIME type。"
          },
          {
            title: "MDN：Common media types",
            url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types",
            usage: "常见扩展名与 MIME type 对照，用于解释 Web 下载和浏览器处理文件。"
          }
        ],
        takeaways: [
          "文件名是给人和系统看的线索，文件内容才决定真实格式。",
          "扩展名会影响默认打开程序和图标，但不会自动转换文件内容。",
          "学习阶段应显示 Windows 文件扩展名，减少误判。",
          "双扩展名文件要看最后一个扩展名，尤其警惕 .exe、.bat、.cmd、.msi。",
          "命名冲突出现 (1) 通常是为了避免覆盖旧文件。",
          "稳定命名规则能降低后续学习、编程和项目整理成本。"
        ]
      },
      {
        id: "paths",
        title: "路径、盘符与当前位置",
        duration: 20,
        level: "起步",
        summary: "学会看懂 D:\\资料\\笔记.md 这样的路径。",
        why: "系统和程序需要准确定位数据。许多“找不到文件”错误，本质上都是路径、当前位置或权限不正确。",
        concepts: [
          "D: 是 Windows 为磁盘卷分配的盘符。",
          "反斜杠 \\ 是 Windows 的目录分隔符。",
          "绝对路径从盘符或根目录开始，相对路径从当前目录开始。",
          ". 表示当前目录，.. 通常表示上一级目录。"
        ],
        example: "绝对路径：D:\\ComputerLearning\\01-notes\\文件系统.md\n相对路径：01-notes\\文件系统.md\n上一级：..\\04-resources\\参考资料.pdf",
        practice: "在电脑上找到一个文件，按住 Shift 后右键复制其完整路径，再手工指出盘符、每级文件夹和文件名。",
        checkpoint: "给定当前目录后，你能判断一个相对路径最终指向哪里。"
      },
      {
        id: "file-naming",
        title: "系统为什么这样命名文件",
        duration: 22,
        level: "重点",
        summary: "理解“新建文本文档”“下载 (1)”和日期编号等默认名称的来源。",
        why: "文件系统只要求名称合法且在当前目录内可区分，真正的默认名称通常由创建文件的软件决定。",
        concepts: [
          "资源管理器、浏览器、相机和编辑器都有自己的命名模板。",
          "同一目录不能有两个完全相同的名称，所以软件会添加 (1)、副本或递增编号。",
          "Windows 禁止 \\ / : * ? \" < > |，因为这些字符被路径和系统接口保留。",
          "清楚的命名应包含主题，必要时加入 YYYY-MM-DD 和 v01。"
        ],
        example: "计算机学习计划_2026-07-17_v01.docx\n课程笔记_操作系统_进程.md\ncomputer-learning/\nuser_profile.py\n\n避免：最终版2真的最终版.docx",
        practice: "建立一个 test-naming 文件夹，连续新建三个同名文本文件，观察系统怎样处理冲突；再按“主题_日期_版本”重新命名。",
        checkpoint: "你能说清默认文件名由谁生成、为什么会出现 (1)、以及哪些字符不能使用。"
      },
      {
        id: "copy-move-delete",
        title: "复制、移动、删除与备份",
        duration: 24,
        level: "基础",
        summary: "区分副本、移动、删除和回收站。",
        why: "日常数据事故往往不是不会保存，而是把同步当备份、把快捷方式当原文件，或不知道文件被移动到了哪里。",
        concepts: [
          "复制产生第二份数据；移动改变原文件所在路径。",
          "删除通常先进入回收站，回收站只是有限保护，不是长期备份。",
          "Shift+Delete 之类的永久删除会绕过回收站。",
          "可靠备份需要独立副本和恢复验证。"
        ],
        example: "原文件 → 复制 → 两份独立数据\n原文件 → 移动 → 路径变化\n原文件 → 删除 → 先进入回收站",
        practice: "创建一个测试文件，依次复制、移动、删除并还原，观察每一步路径和文件数量变化。",
        checkpoint: "你能判断复制、移动、删除和还原分别改变了什么。"
      },
      {
        id: "clipboard-shortcuts",
        title: "剪贴板、拖拽与快捷方式",
        duration: 20,
        level: "基础",
        summary: "弄清文本、文件和快捷方式在搬运时分别去了哪里。",
        why: "剪贴板让跨窗口移动信息更快，但快捷方式和原文件不是同一个东西。",
        concepts: [
          "剪贴板只保存临时内容。",
          "Ctrl+C / Ctrl+X / Ctrl+V / Ctrl+Z / F2 / Win+E 是最常见的基础快捷键。",
          "拖拽时按住 Ctrl 或 Shift 会改变复制或移动行为。",
          "快捷方式只是指向目标的入口，删除快捷方式通常不删除原文件。"
        ],
        example: "Ctrl+C / Ctrl+V 复制粘贴\nCtrl+X / Ctrl+V 剪切移动\n拖拽到桌面创建快捷方式",
        practice: "把一个文件拖到桌面创建快捷方式，再删除桌面图标，检查原文件是否仍然存在。",
        checkpoint: "你能区分剪贴板、原文件和快捷方式三个概念。"
      },
      {
        id: "search-rename",
        title: "搜索、重命名与整理",
        duration: 20,
        level: "基础",
        summary: "让文件多了以后依然找得到、看得懂、排得顺。",
        why: "真正能长期使用的资料库，需要搜索、排序和重命名一起配合。",
        concepts: [
          "资源管理器可以按名称、日期、类型和大小排序。",
          "搜索框帮助定位目标，文件名越清楚越容易找回。",
          "F2 或重命名命令可以快速修改名称。",
          "稳定命名规则比临时想法更重要。"
        ],
        example: "按名称搜索“课程笔记” → 按日期排序 → 用 F2 重命名为 2026-07-17_课程笔记_v01.md",
        practice: "搜索一个文件，再按“主题_日期_版本”重命名并放入对应文件夹。",
        checkpoint: "你能设计一套别人也看得懂的命名规则。"
      },
      {
        id: "file-properties",
        title: "文件属性、大小与时间戳",
        duration: 18,
        level: "基础",
        summary: "学会从属性页判断文件的真实状态。",
        why: "文件的大小、时间和属性经常比名字更可靠。",
        concepts: [
          "属性页可以查看位置、大小、占用空间和修改时间。",
          "创建时间、修改时间和访问时间不是同一个概念。",
          "只读和隐藏等属性会影响文件的编辑和显示。",
          "同一个文件的大小和占用空间可能不完全一样。"
        ],
        example: "同一个文件在属性页里会显示大小、占用空间和修改时间，有时这三个值并不完全一样。",
        practice: "查看一个文档和一个图片的属性页，记录大小、修改时间和是否只读。",
        checkpoint: "你能从属性页判断文件是不是刚改过、是否只读、是否在正确位置。"
      },
      {
        id: "file-types",
        title: "默认程序、打开方式与文件关联",
        duration: 20,
        level: "重点",
        summary: "理解 Windows 如何根据扩展名和文件关联选择默认打开程序。",
        why: "同一个文件可以被多个程序读取，默认程序只决定双击入口，不决定文件真实格式。",
        concepts: [
          "文件关联把扩展名与一个或多个可打开应用连接起来。",
          "默认程序决定双击后由哪个应用打开文件。",
          "打开方式可以查看或临时切换，但不等于修改文件内容。",
          "更改默认程序通常会同时改变该扩展名的显示图标。",
          "应用不支持内部格式时，即使被设为默认程序也可能打开失败。"
        ],
        example: "同一个 .md 文件可以被记事本、VS Code 或浏览器打开；默认程序只决定双击时先调用谁。",
        practice: "对一个测试 .txt 文件使用“打开方式”，临时选择另一个文本编辑器，再查看默认应用设置；不要勾选永久更改，除非明确知道影响。",
        checkpoint: "你能区分真实格式、可打开应用、临时打开方式和默认程序。"
      },
      {
        id: "archives",
        title: "压缩包、解压与归档",
        duration: 22,
        level: "基础",
        summary: "理解压缩和打包为什么常常一起出现。",
        why: "压缩能省空间，也能把一组文件打包成一个整体传递。",
        concepts: [
          "ZIP、7z 和 RAR 都是常见压缩格式。",
          "压缩是减少体积，打包是把多个文件放进一个归档。",
          "解压会把归档内容还原成普通文件和文件夹。",
          "加密压缩包需要密码才能打开。"
        ],
        example: "课程资料/ → 压缩成 课程资料.zip → 发送或备份更方便",
        practice: "把一个文件夹压缩成 ZIP，再解压到新位置，对比原始文件和归档文件的大小。",
        checkpoint: "你能说出压缩和打包不是同一个动作。"
      },
      {
        id: "downloads",
        title: "下载目录、浏览器保存与重复下载",
        duration: 20,
        level: "重点",
        summary: "知道浏览器把文件放到哪里，也知道为什么会出现重复命名。",
        why: "浏览器下载和文件保存是最容易堆成垃圾堆的地方。",
        concepts: [
          "浏览器通常有默认下载文件夹，也可以在设置中更改。",
          "下载历史能帮助你重新找到刚刚保存的文件。",
          "同名文件再次保存时，系统会追加编号或类似后缀以避免冲突。",
          "下载文件夹不是临时缓存，积累太久也需要整理。"
        ],
        example: "同一个 报告.pdf 连续下载两次，常会变成 报告 (1).pdf 之类的名字。",
        practice: "下载一个文件两次，分别找到它们在下载目录和浏览器历史中的位置。",
        checkpoint: "你能快速找到浏览器刚下载的文件。"
      },
      {
        id: "software-sources",
        title: "软件来源、安装包与桌面快捷方式",
        duration: 24,
        level: "重点",
        summary: "分清程序本体、安装包和桌面图标。",
        why: "程序本体、安装包和桌面图标不是一回事。",
        concepts: [
          "官方站点、应用商店和便携版是常见的软件来源。",
          "EXE、MSI 和 ZIP 都可能是不同形式的安装或分发载体。",
          "桌面快捷方式只是入口，不是软件本体。",
          "卸载应优先使用设置或软件自带卸载器。"
        ],
        example: "桌面图标 → 入口\n安装包 → 安装用文件\n便携版 → 解压后直接运行",
        practice: "找到一款已安装软件的快捷方式目标和实际安装目录，只观察不修改。",
        checkpoint: "你能解释删除桌面图标为什么不等于卸载软件。"
      },
      {
        id: "screenshots",
        title: "截图、录屏与屏幕分享",
        duration: 18,
        level: "实践",
        summary: "把屏幕上的问题变成可保存、可分享的证据。",
        why: "截图和录屏是记录问题、分享步骤和提交作业的最短路径。",
        concepts: [
          "PrtSc、Win+Shift+S 和截图工具是常见截图入口。",
          "截图有时先进入剪贴板，有时会直接保存成文件。",
          "录屏记录的是连续操作过程，不是单张画面。",
          "截图前最好先确认目标窗口和保存位置。"
        ],
        example: "Win + Shift + S → 选区 → 复制到剪贴板 → 粘贴到聊天或文档",
        practice: "截取一个文件属性窗口，分别尝试粘贴到文档和保存成文件。",
        checkpoint: "你能在不截整屏的情况下只截目标区域。"
      },
      {
        id: "pdf-docs",
        title: "PDF、文档导出与阅读",
        duration: 20,
        level: "基础",
        summary: "认识 PDF 为什么常被用来分享和归档。",
        why: "PDF 是最常见的固定版式文档，适合阅读和分享。",
        concepts: [
          "PDF 版式固定，便于不同设备查看相同页面。",
          "导出 PDF 和打印为 PDF 都是常见生成方式。",
          "浏览器通常可以直接打开 PDF。",
          "PDF 适合阅读与批注，但不等于原始可编辑文档。"
        ],
        example: "Word → 导出 PDF\n网页 → 打印 → 保存为 PDF",
        practice: "把一份笔记导出成 PDF，再比较它和原始文档的页面效果。",
        checkpoint: "你能解释 PDF 和可编辑文档的区别。"
      },
      {
        id: "backup-sync",
        title: "备份、同步与版本",
        duration: 24,
        level: "重点",
        summary: "知道备份保护什么，同步又会带来什么。",
        why: "备份解决误删和故障，同步只负责保持一致。",
        concepts: [
          "本机、外置硬盘和云端可以构成多层备份。",
          "同步会把变化传播到其他设备，包含误删。",
          "版本历史能回到更早的文件状态。",
          "备份不等于保存，恢复验证才算真正完成。"
        ],
        example: "本机资料 → 外置硬盘 → 云端副本",
        practice: "把一个小文件夹备份到外部位置，再恢复其中一个文件。",
        checkpoint: "你能说出同步误删为什么会传播。"
      },
      {
        id: "recovery-security",
        title: "误删恢复、数据恢复边界与基础安全",
        duration: 24,
        level: "实践",
        summary: "知道什么时候还能救，什么时候必须先停手。",
        why: "真正的风险往往来自误删后继续写入，或者误把危险文件当成普通文件。",
        concepts: [
          "回收站是第一层保护，Shift+Delete 会绕过它。",
          "数据恢复的前提是尽量减少继续写入。",
          "先看扩展名，再看图标，能减少被假文件名误导。",
          "来源不明的 .exe、.bat、.js 和 .lnk 需要特别警惕。"
        ],
        example: "photo.jpg.exe\ninvoice.pdf.lnk\n来源不明的 setup.exe",
        practice: "检查一个样例文件夹，标出可疑文件名、可疑扩展名和不可信来源。",
        checkpoint: "你能给出误删后第一时间的正确处理动作，以及哪些文件不该随便运行。"
      },
      {
        id: "file-format-atlas",
        title: "常见文件格式与用途图谱",
        duration: 52,
        level: "扩展基础",
        summary: "按文本、文档、图片、音视频、压缩包、数据、代码和程序建立文件格式图谱。",
        why: "扩展名很多，但不需要死背。先按数据用途和内部结构分类，才能判断用什么软件打开、能否编辑、是否适合分享，以及转换时会损失什么。",
        concepts: [
          "纯文本格式保存字符，常见扩展名有 .txt、.md、.csv、.json、.xml。",
          "办公文档格式可能同时保存文字、样式、图片和结构，例如 .docx、.xlsx、.pptx。",
          "JPEG 适合照片，PNG 支持无损压缩和透明通道，SVG 是基于 XML 的矢量图。",
          "音视频文件常是容器；MP4 容器内部还需要具体视频和音频编码。",
          "ZIP、7z、RAR 是归档格式，负责打包并可选压缩多个文件。",
          "PDF 偏向固定版式交付，不等同于原始可编辑文档。",
          "HTML、CSS、JS、PY 等代码文件通常是纯文本，但由对应工具链解释或执行。",
          "EXE、MSI、BAT、CMD、PS1 等可能触发安装或执行，来源不明时风险高于普通文档。",
          "ISO 是光盘镜像，LNK 是 Windows 快捷方式，它们都不是普通文件夹。",
          "格式转换会重新编码或重建数据，只改扩展名不会完成转换。"
        ],
        example: "照片：.jpg / .png / .webp\n矢量图：.svg\n文档：.docx / .pdf / .md\n数据：.csv / .json / .xml\n音频：.mp3 / .wav / .flac\n视频容器：.mp4 / .mkv / .webm\n归档：.zip / .7z / .rar\n程序与脚本：.exe / .msi / .bat / .ps1",
        practice: "从下载目录选 12 个文件，按用途分类，并记录扩展名、默认程序、是否可直接编辑、是否可能执行。",
        checkpoint: "你能按用途解释至少 20 种常见扩展名，并说明容器、编码、压缩、格式转换和改名的区别。",
        density: "high-density-v1",
        prerequisites: ["完成“文件、文件夹与扩展名”。", "已经在 Windows 中显示文件扩展名。", "会在独立测试目录中复制并查看文件属性。"],
        objectives: ["按用途分类常见格式。", "为文件选择合适的打开程序。", "区分容器、编码、压缩和格式转换。", "识别可能执行代码的文件类型。"],
        knowledgePoints: [
          { term: "纯文本", detail: "只保存按字符编码表示的文本，可被多种编辑器读取。", misconception: ".txt 之外的文件就不是文本。" },
          { term: "结构化数据", detail: "CSV、JSON、XML 用约定结构表达字段、记录或层级。", misconception: "CSV 就是完整电子表格格式。" },
          { term: "办公文档", detail: "DOCX、XLSX、PPTX 保存内容、结构和样式，现代 Office 格式本质上是 ZIP 包装的 XML 资源集合。", misconception: "改成 .zip 就是可靠的格式转换。" },
          { term: "位图", detail: "JPEG、PNG、WebP 等用像素网格表示图像。", misconception: "所有图片放大后都不会模糊。" },
          { term: "矢量图", detail: "SVG 用图形指令描述形状，适合图标和可缩放图形。", misconception: "SVG 和照片 JPEG 的用途完全相同。" },
          { term: "有损与无损", detail: "有损压缩舍弃部分信息换取体积，无损压缩允许还原原数据。", misconception: "压缩一定会降低画质。" },
          { term: "容器", detail: "MP4、MKV 等负责封装音视频轨道、字幕和元数据。", misconception: ".mp4 能唯一说明内部编码。" },
          { term: "编码器 / 解码器", detail: "Codec 决定媒体数据怎样压缩和还原。", misconception: "播放器支持容器就一定支持里面的编码。" },
          { term: "归档格式", detail: "ZIP、7z、RAR 把多个文件组织进一个归档，并可使用压缩算法。", misconception: "把文件夹放进 ZIP 后原文件会自动消失。" },
          { term: "可执行与脚本", detail: "EXE、MSI、BAT、CMD、PS1 等可能运行代码或改变系统。", misconception: "只有 .exe 才可能执行操作。" },
          { term: "磁盘镜像", detail: "ISO 保存光盘文件系统映像，可被挂载或写入介质。", misconception: "ISO 是普通压缩包。" },
          { term: "快捷方式", detail: "LNK 保存目标入口和启动参数，不是目标文件副本。", misconception: "删除快捷方式等于删除原程序。" }
        ],
        deepDive: [
          "文件格式是一套数据组织约定。应用程序只有理解这套约定，才能把字节解释成文字、图片、音频或表格。扩展名帮助系统选择应用，但真正解析仍由应用完成。",
          "媒体领域要区分容器与编码。MP4 是容器，可以装入不同编码的视频、音频和字幕；设备能识别 .mp4，却仍可能因为不支持内部 codec 而播放失败。",
          "格式转换是读取源格式并按目标格式重新写入。JPEG 转 PNG 会得到合法 PNG，但被 JPEG 有损压缩丢掉的细节不会回来；DOCX 导出 PDF 会保留固定版式，却通常降低继续编辑结构的便利性。",
          "安全判断不能只看文件是不是 .exe。脚本、快捷方式、宏文档、安装包也可能触发操作。完整扩展名、来源、数字签名和实际用途需要一起判断。"
        ],
        systemPosition: "文件格式连接存储层与应用层：文件系统保存字节和元数据，扩展名与关联设置选择应用，应用根据格式规范解析内容；Web 传输时还会用 MIME type 描述媒体类型。",
        workedExamples: [
          { title: "给学习资料选格式", scenario: "为笔记、最终报告、截图和数据交换选择格式。", steps: ["笔记需要持续编辑，选择 .md 或 .docx。", "最终报告强调固定版式，导出 .pdf。", "界面截图需要清晰文字，优先 .png。", "表格数据要给程序读取，简单二维数据可用 .csv。", "记录选择理由，而不是只写扩展名。"], input: "课程笔记、提交报告、UI 截图、成绩表", output: "笔记.md / 报告.pdf / 截图.png / 成绩.csv", checkpoints: ["格式与用途匹配。", "保留原始可编辑文件。"] },
          { title: "判断视频为什么打不开", scenario: "同为 .mp4，一个视频能播放，另一个提示编码不支持。", steps: ["确认两个文件的容器都是 MP4。", "用媒体信息工具查看内部视频编码。", "比较播放器支持的 codec。", "升级播放器或转码为支持的编码。", "转码后核对画质、音轨和字幕。"], input: "video-a.mp4：H.264\nvideo-b.mp4：设备不支持的编码", output: "容器相同不代表编码相同；问题位于 codec 支持。", checkpoints: ["能区分容器和编码。", "不通过改后缀处理播放问题。"] }
        ],
        mistakes: [
          { wrong: "把 .jpg 改成 .png 就完成了转换。", why: "内部数据仍是 JPEG。", correct: "用图像软件打开后导出为 PNG。" },
          { wrong: "PDF 一定能像 Word 一样编辑。", why: "PDF 主要保存固定版式。", correct: "保留 DOCX 等源文件，PDF 用于交付。" },
          { wrong: "MP4 就是一种视频编码。", why: "MP4 是容器。", correct: "同时检查容器和内部 codec。" },
          { wrong: "ZIP 只负责压缩。", why: "ZIP 也负责打包多个文件和目录结构。", correct: "分别理解归档与压缩。" },
          { wrong: "不是 EXE 就不会执行。", why: "脚本、安装包、快捷方式也可能触发代码。", correct: "结合完整扩展名和来源判断。" }
        ],
        troubleshooting: ["打不开：确认完整扩展名与默认应用。", "媒体打不开：检查容器内 codec。", "乱码：检查文本编码，不要先改后缀。", "压缩包报错：确认是否完整下载及工具是否支持格式。", "转换后质量差：确认是否发生有损重编码。", "文件可疑：查看最后扩展名、来源和签名。"],
        practices: [
          { level: "基础练习", title: "格式分类表", task: "把 20 种扩展名分到文本、文档、图像、媒体、归档、程序六类。", evidence: "提交带打开方式与风险等级的表格。" },
          { level: "进阶练习", title: "格式选择说明", task: "为 8 个真实使用场景选择格式并解释取舍。", evidence: "提交场景、格式、优点、限制四列表。" },
          { level: "项目化练习", title: "个人格式手册", task: "建立一页个人常用格式速查表。", evidence: "提交 Markdown 或 PDF 手册。" }
        ],
        quiz: [
          { prompt: "MP4 更准确地属于什么？", options: ["视频容器", "唯一视频编码", "图片格式", "文本编码"], answerIndex: 0, explanation: "MP4 是媒体容器，内部可以包含不同编码的音视频轨道。" },
          { prompt: "哪种格式更适合带透明背景的界面截图？", options: ["PNG", "TXT", "MP3", "MSI"], answerIndex: 0, explanation: "PNG 支持无损压缩和透明通道。" },
          { prompt: "把 DOCX 改名成 PDF 会怎样？", options: ["自动转换", "只改变文件名线索", "自动打印", "自动压缩"], answerIndex: 1, explanation: "合法转换需要应用读取 DOCX 并输出 PDF。" },
          { prompt: "哪一组都可能执行代码？", options: ["EXE、BAT、PS1", "JPG、PNG、SVG", "TXT、CSV、MD", "MP3、WAV、FLAC"], answerIndex: 0, explanation: "EXE 是程序，BAT 和 PS1 是脚本。" },
          { prompt: "CSV 最适合表达什么？", options: ["简单二维表格数据", "固定版式页面", "可执行程序", "无损音频"], answerIndex: 0, explanation: "CSV 用分隔符表达行列数据，不保存完整电子表格功能。" },
          { prompt: "视频容器支持但仍无法播放，下一步优先检查什么？", options: ["内部 codec", "文件名颜色", "桌面壁纸", "文件夹图标"], answerIndex: 0, explanation: "容器内的编码可能不受播放器支持。" }
        ],
        projectLinks: ["所有作品集项目都应保留源文件和交付格式。", "Web 项目要正确设置静态资源 MIME type。", "数据项目经常交换 CSV 与 JSON。"],
        references: [
          { title: "MDN：Common media types", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types", usage: "常见扩展名与媒体类型。" },
          { title: "MDN：Media types", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types", usage: "MIME type 与浏览器资源处理。" },
          { title: "Microsoft Support：Common file name extensions in Windows", url: "https://support.microsoft.com/en-us/windows/common-file-name-extensions-in-windows-da4a4430-8e76-89c5-59f7-1cdbbc75cb01", usage: "Windows 常见扩展名、打开方式与改名边界。" },
          { title: "Microsoft Learn：Open XML file formats", url: "https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk", usage: "现代 Office Open XML 文档结构背景。" }
        ],
        takeaways: ["先按用途分类，再记扩展名。", "扩展名不等于内部格式。", "容器和编码是两层概念。", "转换需要重新读取和写入数据。", "程序、脚本、安装包和快捷方式都需关注来源。"]
      },
      {
        id: "text-encoding-line-endings",
        title: "文本编码、乱码与换行符",
        duration: 46,
        level: "扩展基础",
        summary: "理解字符、Unicode、UTF-8、乱码、BOM 和 Windows/Unix 换行差异。",
        why: "文本看起来简单，实际必须把字符映射成字节。编码不一致会产生乱码，换行约定不同会影响脚本、Git 和跨系统文件。",
        concepts: ["字符是抽象符号，字节是存储单位。", "字符集定义可表示的字符集合。", "Unicode 为字符分配 code point。", "UTF-8 是 Unicode 的一种可变长编码。", "同一字节用错误编码解读会产生乱码。", "BOM 可提示编码，但 UTF-8 并不要求 BOM。", "Windows 常用 CRLF，Unix/Linux 常用 LF。", "纯文本不保存字体、字号等富文本样式。", "保存文件时要明确编码。", "跨平台项目通常统一 UTF-8 和换行策略。"],
        example: "字符：阳\nUnicode code point：U+9633\nUTF-8 字节：E9 98 B3\nWindows 换行：CRLF（\\r\\n）\nLinux/macOS 常见换行：LF（\\n）",
        practice: "分别用 UTF-8 和另一种编码保存包含中文的测试文本，观察用错误编码打开时的现象，再恢复为 UTF-8。",
        checkpoint: "你能解释乱码为什么产生，并能检查文本编码与 CRLF/LF 换行。",
        density: "high-density-v1",
        prerequisites: ["知道文本文件也是字节序列。", "能使用记事本或代码编辑器另存文件。", "会保留原文件副本后再做编码实验。"],
        objectives: ["区分字符、code point、编码和字节。", "解释 UTF-8 的作用。", "定位常见乱码。", "区分 CRLF 与 LF。"],
        knowledgePoints: [
          { term: "字符", detail: "人理解的文字或符号。", misconception: "一个字符永远等于一个字节。" },
          { term: "Code point", detail: "Unicode 分配给字符的编号，例如 U+0041。", misconception: "code point 就是磁盘上的最终字节。" },
          { term: "字符编码", detail: "把字符编号转换成字节以及反向解码的规则。", misconception: "所有文本文件都自动使用同一种编码。" },
          { term: "UTF-8", detail: "Unicode 的可变长编码，与 ASCII 前 128 个字符兼容。", misconception: "UTF-8 中每个字符固定一个字节。" },
          { term: "UTF-16", detail: "以 16-bit code unit 为基础的 Unicode 编码。", misconception: "UTF-16 永远每字符两个字节。" },
          { term: "乱码", detail: "写入编码和读取编码不一致时出现的错误字符。", misconception: "乱码一定代表文件损坏。" },
          { term: "BOM", detail: "文件开头的编码签名字节，可用于提示字节序或编码。", misconception: "所有 UTF-8 文件都必须带 BOM。" },
          { term: "CRLF", detail: "回车加换行，Windows 文本常用。", misconception: "所有系统换行字节完全相同。" },
          { term: "LF", detail: "单个换行符，Unix/Linux 和现代 macOS 常用。", misconception: "LF 文件在 Windows 一定打不开。" },
          { term: "纯文本", detail: "保存字符内容和少量控制字符，不含复杂排版对象。", misconception: ".md 不是纯文本。" }
        ],
        deepDive: ["电脑存储的是字节，不直接存储人类概念中的汉字。Unicode 统一编号，UTF-8 决定这些编号怎样写成一串字节。", "乱码往往不是原始字节消失，而是读取方选择了错误编码。重新用正确编码打开可能恢复；如果错误解码后又覆盖保存，恢复会更困难。", "换行也是字符约定。CRLF 和 LF 在编辑器里看起来都像换行，但 Git、shell 脚本和部分工具会观察到字节差异。", "新项目通常选择 UTF-8，并用编辑器设置或 .editorconfig 统一编码与换行。"],
        systemPosition: "编码位于文本含义与文件字节之间；编辑器负责按编码读写，操作系统和工具链处理字节，终端字体还决定字符能否正确显示。",
        workedExamples: [
          { title: "追踪一次乱码", scenario: "UTF-8 中文被按错误编码读取。", steps: ["保留原文件副本。", "查看编辑器当前编码。", "用 UTF-8 重新打开而不是直接覆盖。", "确认文字恢复。", "以 UTF-8 另存并再次打开验证。"], input: "UTF-8 文本：计算机", output: "错误解码可能显示乱码；使用 UTF-8 重新解码恢复。", checkpoints: ["先备份。", "区分重新打开与转换保存。"] },
          { title: "检查换行", scenario: "脚本在不同系统出现整行或 ^M 问题。", steps: ["在编辑器状态栏查看 CRLF/LF。", "确认项目要求。", "转换换行格式。", "保存后查看 diff。", "在目标环境重新运行。"], input: "Windows CRLF 脚本", output: "按目标项目转换为 LF，并验证行为。", checkpoints: ["只改变换行，不改变正文。", "核对版本差异。"] }
        ],
        mistakes: [
          { wrong: "一个汉字就是两个字节。", why: "字节数取决于编码。", correct: "先说明编码，再讨论字节数。" },
          { wrong: "乱码就是文件坏了。", why: "也可能只是错误解码。", correct: "保留副本并尝试正确编码。" },
          { wrong: "UTF-8 必须有 BOM。", why: "UTF-8 可有可无 BOM。", correct: "遵循工具链和项目约定。" },
          { wrong: "CRLF 和 LF 完全一样。", why: "视觉接近但字节不同。", correct: "跨平台项目统一换行。" },
          { wrong: "字体缺字也是编码错误。", why: "正确字符可能因字体无字形而显示方框。", correct: "区分解码结果与字体渲染。" }
        ],
        troubleshooting: ["先复制原文件，避免覆盖。", "查看编辑器检测到的编码。", "尝试按来源常见编码重新打开。", "检查终端 code page 与字体。", "检查 CRLF/LF。", "确认是否曾在乱码状态下覆盖保存。"],
        practices: [
          { level: "基础练习", title: "编码观察", task: "用 UTF-8 保存中英文文本并查看文件大小。", evidence: "记录字符数、字节数和编码。" },
          { level: "进阶练习", title: "乱码恢复", task: "制作一份错误解码样例并写恢复步骤。", evidence: "提交前后截图与步骤。" },
          { level: "项目化练习", title: "编辑器统一配置", task: "为练习目录创建 .editorconfig，统一 UTF-8 与换行。", evidence: "提交配置文件和验证记录。" }
        ],
        quiz: [
          { prompt: "UTF-8 是什么？", options: ["Unicode 的字符编码", "文件夹", "压缩格式", "图片容器"], answerIndex: 0, explanation: "UTF-8 把 Unicode code point 编码为字节。" },
          { prompt: "乱码最常见原因是什么？", options: ["读写编码不一致", "屏幕太小", "文件名太短", "鼠标故障"], answerIndex: 0, explanation: "相同字节按错误规则解码会显示错误字符。" },
          { prompt: "Windows 文本常见换行是什么？", options: ["CRLF", "JPEG", "UTF-8", "ZIP"], answerIndex: 0, explanation: "Windows 通常使用 CRLF。" },
          { prompt: "UTF-8 文件是否必须包含 BOM？", options: ["不必须", "必须", "只要中文就必须", "只在图片中必须"], answerIndex: 0, explanation: "UTF-8 不要求 BOM，是否使用取决于约定和工具。" },
          { prompt: "看到方框字符一定是编码错误吗？", options: ["不一定，也可能是字体缺字形", "一定", "一定是硬盘坏了", "一定是换行错误"], answerIndex: 0, explanation: "编码与字体渲染是不同环节。" },
          { prompt: "处理乱码文件第一步更稳妥的是？", options: ["复制备份", "立即覆盖保存", "改扩展名", "删除文件"], answerIndex: 0, explanation: "保留原始字节才便于尝试不同解码方式。" }
        ],
        projectLinks: ["代码项目通常统一 UTF-8。", "Git 项目需要统一换行。", "CSV 导入错误常与编码有关。"],
        references: [
          { title: "Unicode Standard：UTF-8", url: "https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/", usage: "Unicode 字符、编码形式与 UTF-8 基础。" },
          { title: "Microsoft Learn：Character encoding in .NET", url: "https://learn.microsoft.com/en-us/dotnet/standard/base-types/character-encoding-introduction", usage: "字符、code point、UTF 编码和 fallback 概念。" },
          { title: "GitHub Docs：Configuring Git to handle line endings", url: "https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings", usage: "跨平台 CRLF/LF 与 Git 配置。" },
          { title: "EditorConfig Specification", url: "https://spec.editorconfig.org/", usage: "统一字符集、行尾和文件格式设置。" }
        ],
        takeaways: ["字符不等于字节。", "Unicode 编号，UTF-8 编码。", "乱码常来自解码规则不一致。", "CRLF 与 LF 的字节不同。", "修改前先保留原文件。"]
      },
      {
        id: "windows-command-basics",
        title: "Windows 常用命令与 PowerShell 基础",
        duration: 58,
        level: "扩展基础",
        summary: "掌握查看位置、列目录、切换目录、创建、复制、移动、重命名、读取和搜索文件的基础命令。",
        why: "图形界面适合观察，命令行适合精确、重复和可记录操作。先学只读命令，再在测试目录练习写操作，能为编程、Git 和系统排查打基础。",
        concepts: ["终端是交互窗口，Shell 解释命令。", "PowerShell 与传统 cmd 语法并不完全相同。", "Get-Location 查看当前位置。", "Get-ChildItem 列目录，别名有 ls、dir。", "Set-Location 切换目录，别名有 cd。", "New-Item 创建文件或目录。", "Copy-Item、Move-Item、Rename-Item 操作路径。", "Get-Content 读取文本。", "Select-String 搜索文本。", "Get-Command 与 Get-Help 查命令。", "Tab 可补全路径。", "写操作前应先核对当前位置和目标路径。"],
        example: "Get-Location\nGet-ChildItem\nSet-Location .\\test-lab\nNew-Item -ItemType Directory -Name notes\nNew-Item -ItemType File -Path .\\notes\\demo.txt\nGet-Content .\\notes\\demo.txt\nSelect-String -Path .\\notes\\*.txt -Pattern 'PATH'",
        practice: "在 test-command-lab 中只用 PowerShell 创建 notes 目录和 demo.txt，复制、重命名并列出结果；不要在个人资料目录练习删除。",
        checkpoint: "你能说明终端、Shell、命令、参数和路径的关系，并在测试目录完成一组可复现文件操作。",
        density: "high-density-v1",
        prerequisites: ["完成路径课程。", "会创建独立测试目录。", "知道绝对路径和相对路径。"],
        objectives: ["区分终端、PowerShell 和 cmd。", "使用 10 个常用 PowerShell 命令。", "阅读命令帮助。", "在写操作前核对路径。"],
        knowledgePoints: [
          { term: "终端", detail: "承载命令行输入输出的窗口应用。", misconception: "终端本身就是所有命令的实现。" },
          { term: "Shell", detail: "解析命令并调用系统或程序，PowerShell 是一种 Shell。", misconception: "PowerShell 和 cmd 完全相同。" },
          { term: "Cmdlet", detail: "PowerShell 的动词-名词命令，例如 Get-ChildItem。", misconception: "大小写不同就一定是不同命令。" },
          { term: "参数", detail: "控制命令行为的命名输入，例如 -Path。", misconception: "参数顺序和含义可以随便猜。" },
          { term: "当前位置", detail: "相对路径解析的起点。", misconception: "命令会自动在想象中的文件夹运行。" },
          { term: "管道", detail: "用 | 把前一个命令输出的对象传给下一个命令。", misconception: "PowerShell 管道只传普通文本。" },
          { term: "通配符", detail: "* 和 ? 用于匹配一组名称。", misconception: "通配符不会扩大操作范围。" },
          { term: "Tab 补全", detail: "补全命令、参数和路径，减少拼写错误。", misconception: "补全只为了打字快。" },
          { term: "只读命令", detail: "Get 类命令通常用于观察状态。", misconception: "所有 Get 命令都绝对没有副作用。" },
          { term: "写操作", detail: "创建、复制、移动、重命名会改变文件系统。", misconception: "运行前无需核对目标。" },
          { term: "帮助系统", detail: "Get-Help 和 Get-Command 用于查语法与可用命令。", misconception: "命令必须全靠背。" },
          { term: "退出码 / 错误流", detail: "命令成功与否应看输出、错误和状态，而不是只看窗口有没有关闭。", misconception: "没看到红字就一定成功。" }
        ],
        deepDive: ["PowerShell 把命令输出视作对象，这和传统只传文本的 shell 思维不同。初学阶段先掌握位置、目录、文件和帮助命令，再学习管道。", "相对路径永远依赖当前位置。执行 New-Item 或 Move-Item 前先运行 Get-Location 和 Get-ChildItem，能避免把文件写到错误位置。", "别名便于交互，但学习和脚本中应认识完整命令名。ls 在 PowerShell 中通常是 Get-ChildItem 的别名，不等同于所有环境中的同名程序。", "删除和递归操作扩大影响范围。本课只在明确的 test-command-lab 内练习创建、复制、移动和重命名。"],
        systemPosition: "终端提供窗口，PowerShell 解析命令，cmdlet 调用文件系统和操作系统接口，输出对象再交给屏幕或管道中的下一条命令。",
        workedExamples: [
          { title: "建立测试目录", scenario: "从当前位置安全创建练习结构。", steps: ["运行 Get-Location。", "运行 Get-ChildItem 确认内容。", "运行 New-Item -ItemType Directory -Name test-command-lab。", "Set-Location .\\test-command-lab。", "再次 Get-Location 验证。", "创建 notes 子目录。"], input: "Get-Location\nNew-Item -ItemType Directory -Name test-command-lab", output: "当前目录下出现 test-command-lab，位置切换后路径以它结尾。", checkpoints: ["确认在测试位置。", "每次写操作后列目录验证。"] },
          { title: "复制并搜索文本", scenario: "创建笔记副本并搜索关键词。", steps: ["创建 notes\\demo.txt。", "写入一行 PATH 学习记录。", "Copy-Item 生成 demo-copy.txt。", "Get-ChildItem 查看两个文件。", "Select-String 搜索 PATH。", "记录命中的文件和行。"], input: "Copy-Item .\\notes\\demo.txt .\\notes\\demo-copy.txt\nSelect-String -Path .\\notes\\*.txt -Pattern 'PATH'", output: "两份文件均被列出；搜索结果显示文件、行号和匹配文本。", checkpoints: ["源路径与目标路径正确。", "通配符只匹配测试目录文本。"] }
        ],
        mistakes: [
          { wrong: "直接复制网上命令运行。", why: "路径和环境可能不同。", correct: "先读懂命令、参数和影响范围。" },
          { wrong: "cd 永远切到同一目录。", why: "目标取决于参数和当前位置。", correct: "切换后用 Get-Location 验证。" },
          { wrong: "ls 在所有系统都完全相同。", why: "PowerShell 中常是别名。", correct: "用 Get-Command ls 查看实际解析。" },
          { wrong: "通配符只会匹配一个文件。", why: "* 可能匹配大量对象。", correct: "先用 Get-ChildItem 预览匹配。" },
          { wrong: "命令成功无需验证。", why: "可能写错位置或只完成部分操作。", correct: "检查输出并再次列目录或读取文件。" }
        ],
        troubleshooting: ["CommandNotFound：检查拼写并用 Get-Command。", "PathNotFound：运行 Get-Location，核对引号和路径。", "AccessDenied：确认目录权限，不要盲目提权。", "文件已存在：检查目标名称和覆盖行为。", "通配符结果异常：先列出匹配对象。", "命令参数不明：使用 Get-Help 命令名 -Examples。"],
        practices: [
          { level: "基础练习", title: "目录导航", task: "使用 Get-Location、Get-ChildItem、Set-Location 浏览测试结构。", evidence: "提交命令和关键输出。" },
          { level: "进阶练习", title: "文件操作链", task: "创建、复制、移动、重命名一个测试文本。", evidence: "提交操作前后目录树。" },
          { level: "项目化练习", title: "可复现操作记录", task: "写 commands.md，记录建立课程资料目录的命令和验证。", evidence: "另一个人可按记录复现。" }
        ],
        quiz: [
          { prompt: "哪个命令查看当前位置？", options: ["Get-Location", "Get-Content", "Select-String", "Rename-Item"], answerIndex: 0, explanation: "Get-Location 返回当前工作位置。" },
          { prompt: "PowerShell 中 ls 通常是什么？", options: ["Get-ChildItem 的别名", "删除命令", "网络协议", "文本编码"], answerIndex: 0, explanation: "可用 Get-Command ls 验证别名解析。" },
          { prompt: "相对路径以什么为起点？", options: ["当前位置", "桌面", "C 盘根目录", "下载目录"], answerIndex: 0, explanation: "相对路径必须结合当前工作目录解析。" },
          { prompt: "运行带 * 的写操作前应先做什么？", options: ["预览匹配对象", "关闭屏幕", "改扩展名", "清空回收站"], answerIndex: 0, explanation: "通配符可能匹配大量对象。" },
          { prompt: "哪个命令搜索文本内容？", options: ["Select-String", "Set-Location", "Move-Item", "Get-Date"], answerIndex: 0, explanation: "Select-String 按模式搜索文本。" },
          { prompt: "不清楚命令参数时优先使用什么？", options: ["Get-Help", "凭感觉尝试", "管理员运行", "删除后重来"], answerIndex: 0, explanation: "帮助系统提供语法和示例。" }
        ],
        projectLinks: ["后续 Python、Git、云计算都依赖命令行。", "项目 README 应提供可复现命令。", "排错记录应保存命令与输出。"],
        references: [
          { title: "Microsoft Learn：PowerShell documentation", url: "https://learn.microsoft.com/en-us/powershell/", usage: "PowerShell 官方文档入口。" },
          { title: "Microsoft Learn：Get-ChildItem", url: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem", usage: "列出文件系统对象与参数。" },
          { title: "Microsoft Learn：about Aliases", url: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_aliases", usage: "PowerShell 别名机制。" },
          { title: "Microsoft Learn：Get-Help", url: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-help", usage: "查询命令帮助和示例。" }
        ],
        takeaways: ["终端不等于 Shell。", "PowerShell 命令常用动词-名词命名。", "相对路径依赖当前位置。", "写操作前后都要验证。", "命令不用死背，先会查帮助。"]
      },
      {
        id: "keyboard-shortcuts-atlas",
        title: "常用快捷键与键盘操作图谱",
        duration: 44,
        level: "扩展基础",
        summary: "按编辑、窗口、系统、文件、浏览器和截图场景掌握常用快捷键。",
        why: "快捷键不是越多越好，而是把高频操作变成稳定动作。按场景分组学习，并理解焦点和应用差异，才能提高效率而不误操作。",
        concepts: ["快捷键由修饰键和普通键组合。", "键盘焦点决定命令作用对象。", "Ctrl+C/X/V 复制、剪切、粘贴。", "Ctrl+Z/Y 撤销与重做，但应用支持可能不同。", "Ctrl+A/S/F 常用于全选、保存、查找。", "Alt+Tab 切换窗口，Alt+F4 关闭当前应用。", "Win+E/I/D/L 打开资源管理器、设置、桌面和锁屏。", "Win+V 打开剪贴板历史，首次使用需启用。", "Win+Shift+S 截取区域。", "F2 重命名，F5 刷新。", "Ctrl+Shift+Esc 打开任务管理器。", "浏览器 Ctrl+L/T/W/Shift+T 管理地址栏与标签页。"],
        example: "编辑：Ctrl+C / X / V / Z / Y / A / S / F\n文件：F2 / Delete / Shift+Delete\n窗口：Alt+Tab / Alt+F4 / Win+D\n系统：Win+E / I / L / V / Ctrl+Shift+Esc\n截图：Win+Shift+S\n浏览器：Ctrl+L / T / W / Shift+T",
        practice: "在一个测试文本和浏览器窗口中完成复制、撤销、查找、标签恢复、窗口切换、截图和文件重命名，记录每个快捷键作用的焦点对象。",
        checkpoint: "你能按场景使用 25 个高频快捷键，并在操作前判断当前焦点和不可逆风险。",
        density: "high-density-v1",
        prerequisites: ["会使用鼠标完成对应操作。", "准备无重要内容的测试文本和测试文件。", "知道当前活动窗口和键盘焦点会决定快捷键作用对象。"],
        objectives: ["按场景记忆快捷键。", "判断键盘焦点。", "恢复误关闭标签页。", "避免 Shift+Delete 等高风险误操作。"],
        knowledgePoints: [
          { term: "修饰键", detail: "Ctrl、Alt、Shift、Windows 键会改变其他键的含义。", misconception: "组合键必须完全同时按下。" },
          { term: "焦点", detail: "当前接收键盘输入的窗口或控件。", misconception: "快捷键总作用于鼠标指针位置。" },
          { term: "剪贴板", detail: "复制或剪切内容的临时交换区。", misconception: "复制后原内容会消失。" },
          { term: "撤销栈", detail: "应用记录可逆操作历史。", misconception: "Ctrl+Z 能撤销任何系统动作。" },
          { term: "窗口切换", detail: "Alt+Tab 在已打开窗口间切换。", misconception: "它会关闭当前窗口。" },
          { term: "系统快捷键", detail: "Windows 键组合通常由操作系统处理。", misconception: "所有应用都能重定义系统快捷键。" },
          { term: "功能键", detail: "F1–F12 在系统和应用中承担快捷动作。", misconception: "F2 在任何环境都只表示重命名。" },
          { term: "标签页恢复", detail: "多数浏览器用 Ctrl+Shift+T 恢复最近关闭标签。", misconception: "关闭后只能重新搜索。" },
          { term: "剪贴板历史", detail: "Win+V 显示近期项目，需在系统中启用。", misconception: "它默认永久保存所有复制内容。" },
          { term: "永久删除", detail: "Shift+Delete 常绕过回收站。", misconception: "和普通 Delete 风险相同。" }
        ],
        deepDive: ["快捷键是否生效取决于焦点。例如 Ctrl+F 在浏览器中查网页文字，在编辑器中查文档，在文件资源管理器中可能把焦点放到搜索框。动作相似，但对象由当前应用决定。", "应先学习跨应用稳定的高频组合，再学习某个软件专用快捷键。复制、保存、查找、窗口切换、资源管理器和截图覆盖了日常大部分场景。", "快捷键也有风险。Shift+Delete、Alt+F4、Ctrl+W 可能关闭或删除当前对象；操作前要看焦点，并理解应用是否会提示保存。", "无障碍场景中，Tab、Shift+Tab、Enter、Space、方向键和 Esc 组成基本键盘导航体系。"],
        systemPosition: "键盘事件先由当前焦点窗口接收；系统保留的组合键由 Windows 处理，其他组合键由应用根据上下文解释。",
        workedExamples: [
          { title: "不用鼠标整理一个文件", scenario: "在资源管理器中重命名并复制测试文件。", steps: ["Win+E 打开资源管理器。", "方向键选中测试文件。", "F2 重命名并 Enter 确认。", "Ctrl+C 复制。", "进入目标目录后 Ctrl+V。", "F5 刷新并检查。"], input: "test.txt", output: "2026-07-21_test_v01.txt 及其目标目录副本", checkpoints: ["焦点在文件列表。", "没有选中重要文件。"] },
          { title: "恢复浏览器工作现场", scenario: "误关标签页后恢复并定位地址栏。", steps: ["Ctrl+W 关闭测试标签。", "Ctrl+Shift+T 恢复。", "Ctrl+L 聚焦地址栏。", "输入地址或关键词。", "Alt+Left 返回上一页。"], input: "一个可随时关闭的测试标签页", output: "标签恢复，地址栏聚焦并完成导航。", checkpoints: ["不在表单未保存页面练习。", "理解 Ctrl+W 与 Alt+F4 的范围不同。"] }
        ],
        mistakes: [
          { wrong: "快捷键作用于鼠标所在位置。", why: "主要取决于键盘焦点。", correct: "先观察当前窗口和选中对象。" },
          { wrong: "Ctrl+Z 什么都能恢复。", why: "应用只撤销其记录的操作。", correct: "重要操作仍需备份。" },
          { wrong: "Delete 和 Shift+Delete 一样。", why: "后者常绕过回收站。", correct: "普通删除也要核对对象，高风险组合更谨慎。" },
          { wrong: "Ctrl+W 和 Alt+F4 一样。", why: "前者常关标签或文档，后者关窗口。", correct: "根据应用层级选择。" },
          { wrong: "快捷键记得越多效率越高。", why: "低频组合会增加认知负担。", correct: "先练高频场景形成稳定动作。" }
        ],
        troubleshooting: ["快捷键无反应：检查焦点。", "功能键行为异常：检查 Fn 锁。", "Win+V 不显示：在设置中启用剪贴板历史。", "Ctrl+Shift+T 无效：确认浏览器或应用支持。", "输入法抢占组合键：查看输入法热键。", "远程桌面中失效：确认快捷键发送到本机还是远端。"],
        practices: [
          { level: "基础练习", title: "十键循环", task: "练习复制、粘贴、撤销、保存、查找、切换窗口、资源管理器、锁屏、截图、重命名。", evidence: "记录每个键对应动作。" },
          { level: "进阶练习", title: "全键盘导航", task: "用 Tab、Shift+Tab、Enter、Space、Esc 完成一个网页表单测试。", evidence: "记录焦点顺序。" },
          { level: "项目化练习", title: "个人快捷键卡", task: "按编辑、窗口、系统、文件、浏览器制作速查表。", evidence: "提交一页速查卡。" }
        ],
        quiz: [
          { prompt: "快捷键作用对象主要由什么决定？", options: ["键盘焦点", "鼠标颜色", "壁纸", "文件大小"], answerIndex: 0, explanation: "焦点窗口或控件接收键盘输入。" },
          { prompt: "恢复最近关闭浏览器标签常用什么？", options: ["Ctrl+Shift+T", "Win+L", "F2", "Ctrl+P"], answerIndex: 0, explanation: "多数浏览器支持 Ctrl+Shift+T。" },
          { prompt: "打开资源管理器常用什么？", options: ["Win+E", "Win+L", "Alt+F4", "Ctrl+W"], answerIndex: 0, explanation: "Win+E 打开文件资源管理器。" },
          { prompt: "区域截图常用什么？", options: ["Win+Shift+S", "Ctrl+Y", "F5", "Alt+Tab"], answerIndex: 0, explanation: "该组合调用 Windows 截图入口。" },
          { prompt: "哪项通常风险更高？", options: ["Shift+Delete", "Ctrl+C", "Ctrl+F", "Win+E"], answerIndex: 0, explanation: "Shift+Delete 常绕过回收站。" },
          { prompt: "Win+V 第一次无反应应检查什么？", options: ["剪贴板历史是否启用", "图片扩展名", "硬盘格式", "浏览器缓存"], answerIndex: 0, explanation: "剪贴板历史需要在系统中启用。" }
        ],
        projectLinks: ["学习网站支持 Ctrl+K 搜索。", "代码编辑与调试大量依赖快捷键。", "键盘可访问性是 Web 项目验收项。"],
        references: [
          { title: "Microsoft Support：Keyboard shortcuts in Windows", url: "https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec", usage: "Windows 系统、窗口、资源管理器快捷键。" },
          { title: "Microsoft Support：Windows keyboard shortcuts for accessibility", url: "https://support.microsoft.com/en-us/windows/windows-keyboard-shortcuts-for-accessibility-021bcb62-45c8-e4ef-1e4f-41b8c1fc87fd", usage: "键盘导航和辅助功能快捷键。" },
          { title: "Google Chrome Help：Chrome keyboard shortcuts", url: "https://support.google.com/chrome/answer/157179", usage: "浏览器标签、地址栏和页面快捷键。" }
        ],
        takeaways: ["按场景学习快捷键。", "焦点决定作用对象。", "先掌握高频组合。", "关闭和删除类组合要谨慎。", "Tab 与 Esc 是键盘导航基础。"]
      },
      {
        id: "windows-system-tools",
        title: "Windows 常用系统工具与运行命令",
        duration: 48,
        level: "扩展基础",
        summary: "认识设置、任务管理器、系统信息、设备管理器、磁盘管理、服务和事件查看器的职责与只读观察方法。",
        why: "系统出现卡顿、空间不足、设备异常或程序无法启动时，不能只靠重启。先知道每个系统工具观察什么，再沿现象选择入口，才能建立基础排查能力。",
        concepts: ["Win+I 打开设置。", "Ctrl+Shift+Esc 打开任务管理器。", "msinfo32 查看系统信息。", "dxdiag 查看图形、声音和 DirectX 诊断信息。", "devmgmt.msc 打开设备管理器。", "diskmgmt.msc 打开磁盘管理。", "eventvwr.msc 打开事件查看器。", "services.msc 查看服务。", "resmon 打开资源监视器。", "cleanmgr 在部分版本中提供磁盘清理入口。", "工具的观察权限与修改权限不同。", "不了解影响时只观察和导出，不禁用设备、服务或分区。"],
        example: "Win+R → msinfo32：系统摘要\nCtrl+Shift+Esc：进程、性能、启动应用\nWin+R → devmgmt.msc：硬件设备与驱动状态\nWin+R → eventvwr.msc：系统和应用事件\nWin+R → resmon：CPU、内存、磁盘、网络活动",
        practice: "依次打开任务管理器、系统信息和资源监视器，只记录 CPU、内存、系统型号和一个活跃进程，不结束进程、不修改启动项。",
        checkpoint: "你能根据卡顿、硬件异常、磁盘空间和应用崩溃四类现象选择正确工具，并区分观察与修改操作。",
        density: "high-density-v1",
        prerequisites: ["能使用 Win+R。", "知道进程、内存、磁盘和设备是不同对象。", "本课只做只读观察。"],
        objectives: ["说出 8 个系统工具的职责。", "从任务管理器读取资源占用。", "从系统信息读取硬件与系统摘要。", "为常见现象选择排查工具。"],
        knowledgePoints: [
          { term: "设置", detail: "面向日常配置的现代系统入口。", misconception: "所有底层管理功能都只在设置中。" },
          { term: "任务管理器", detail: "观察进程、性能、启动应用和用户会话。", misconception: "占用最高的进程就一定有问题。" },
          { term: "资源监视器", detail: "进一步观察 CPU、内存、磁盘和网络活动。", misconception: "和任务管理器展示内容完全相同。" },
          { term: "系统信息", detail: "汇总系统型号、BIOS、内存和组件信息。", misconception: "msinfo32 用来直接修改 BIOS。" },
          { term: "设备管理器", detail: "查看硬件设备、驱动和设备状态。", misconception: "看到未知设备就应立即卸载。" },
          { term: "磁盘管理", detail: "查看磁盘、卷、分区和盘符。", misconception: "调整分区和查看分区风险相同。" },
          { term: "事件查看器", detail: "查看应用、系统和安全等事件记录。", misconception: "出现 Error 就能直接证明根因。" },
          { term: "服务", detail: "后台长期运行并提供系统或应用能力的进程类型。", misconception: "不认识的服务都可以禁用。" },
          { term: "启动应用", detail: "登录后自动启动的应用，会影响启动时间和后台资源。", misconception: "禁用启动等于卸载应用。" },
          { term: "性能快照", detail: "某一时刻的数据只能作为线索，需要结合持续现象。", misconception: "一次 100% 占用就一定是永久故障。" }
        ],
        deepDive: ["Windows 管理工具各有边界。任务管理器回答谁在消耗资源，资源监视器提供更细活动，系统信息回答机器是什么配置，设备管理器回答硬件和驱动状态，事件查看器提供按时间记录的系统证据。", "排查应从现象出发：卡顿先看 CPU、内存和磁盘；设备失效看设备管理器；应用崩溃结合事件查看器；磁盘空间或盘符问题看存储设置和磁盘管理。", "事件日志中的警告和错误只是证据，不自动等于根因。需要匹配发生时间、来源、事件 ID、上下文和可复现现象。", "系统工具包含修改能力。结束关键进程、禁用服务、卸载设备或修改分区可能影响系统，所以初学阶段只观察、截图和导出。"],
        systemPosition: "这些工具是操作系统状态的观察窗口：进程调度、内存、存储、设备驱动、后台服务和事件日志分别由不同管理界面呈现。",
        workedExamples: [
          { title: "排查一次电脑卡顿", scenario: "打开多个程序后操作变慢。", steps: ["Ctrl+Shift+Esc 打开任务管理器。", "观察 CPU、内存、磁盘总占用。", "按对应列排序。", "记录占用高的进程名和时间。", "打开资源监视器观察持续活动。", "关闭自己确认可退出的普通应用后复测。"], input: "现象：窗口切换缓慢、磁盘指示持续高", output: "证据：资源总占用、主要进程、持续时间和复测结果。", checkpoints: ["不结束系统关键进程。", "一次峰值不直接定性。"] },
          { title: "记录系统基本信息", scenario: "安装软件前确认系统版本和内存。", steps: ["Win+R。", "输入 msinfo32。", "记录操作系统名称和版本。", "记录系统类型。", "记录已安装物理内存。", "关闭窗口，不修改配置。"], input: "软件要求：64-bit Windows、8GB RAM", output: "本机系统类型和内存是否满足要求。", checkpoints: ["区分已安装内存与可用内存。", "不在公开截图中泄露设备标识。"] }
        ],
        mistakes: [
          { wrong: "任务管理器里 CPU 第一名就是病毒。", why: "正常任务也会短时高占用。", correct: "结合进程来源、持续时间和行为判断。" },
          { wrong: "事件查看器 Error 就是根因。", why: "日志可能是结果、伴随事件或已恢复问题。", correct: "按时间线与复现现象关联。" },
          { wrong: "禁用不认识的服务能加速。", why: "服务可能支撑系统或应用功能。", correct: "先查职责和依赖，本课只观察。" },
          { wrong: "磁盘管理只看不改和删除分区一样安全。", why: "删除、格式化、调整卷属于高影响操作。", correct: "初学阶段仅记录布局。" },
          { wrong: "设备异常就先卸载驱动。", why: "会丢失当前可用配置。", correct: "先记录状态和错误码，再查官方资料。" }
        ],
        troubleshooting: ["卡顿：任务管理器看资源总量和持续占用。", "磁盘忙：资源监视器看具体读写进程和文件。", "设备异常：设备管理器查看状态和错误码。", "程序崩溃：事件查看器按时间筛选应用事件。", "系统配置不明：msinfo32 查看摘要。", "工具打不开：确认拼写、版本和当前账户权限。"],
        practices: [
          { level: "基础练习", title: "工具职责匹配", task: "把 8 个系统现象和对应工具配对。", evidence: "提交现象、工具、观察字段表。" },
          { level: "进阶练习", title: "五分钟性能观察", task: "记录静置和打开浏览器时的 CPU、内存、磁盘变化。", evidence: "提交两组数据和解释。" },
          { level: "项目化练习", title: "本机基线报告", task: "整理不含敏感标识的系统、内存、磁盘和启动应用摘要。", evidence: "提交 Markdown 基线报告。" }
        ],
        quiz: [
          { prompt: "哪个工具优先查看进程资源占用？", options: ["任务管理器", "画图", "记事本", "计算器"], answerIndex: 0, explanation: "任务管理器展示进程和总体性能。" },
          { prompt: "msinfo32 主要用于什么？", options: ["查看系统信息", "格式化磁盘", "编辑图片", "压缩文件"], answerIndex: 0, explanation: "系统信息汇总硬件与系统配置。" },
          { prompt: "设备出现驱动错误优先看什么？", options: ["设备管理器", "剪贴板", "浏览器历史", "回收站"], answerIndex: 0, explanation: "设备管理器展示设备与驱动状态。" },
          { prompt: "事件日志出现 Error 应如何理解？", options: ["作为证据结合时间线分析", "直接等于根因", "全部删除", "立即重装系统"], answerIndex: 0, explanation: "日志级别不能单独证明因果。" },
          { prompt: "初学者打开磁盘管理后更稳妥的动作是？", options: ["只观察卷和盘符", "删除陌生分区", "随意格式化", "改变系统盘大小"], answerIndex: 0, explanation: "修改分区有较高影响，本课只读观察。" },
          { prompt: "观察磁盘具体活动可用什么？", options: ["资源监视器", "字符映射表", "截图工具", "字体设置"], answerIndex: 0, explanation: "资源监视器提供进程和文件级磁盘活动线索。" }
        ],
        projectLinks: ["阶段 1 的 Windows 与硬件课程会继续使用这些工具。", "软件工程排错需要保存系统证据。", "云计算方向会扩展到服务器进程、日志和指标。"],
        references: [
          { title: "Microsoft Learn：Task Manager", url: "https://learn.microsoft.com/en-us/shows/inside/task-manager", usage: "任务管理器入口、进程和性能观察。" },
          { title: "Microsoft Learn：System Information tool", url: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/msinfo32", usage: "msinfo32 命令与系统信息。" },
          { title: "Microsoft Learn：Event Viewer", url: "https://learn.microsoft.com/en-us/shows/inside/event-viewer", usage: "事件查看器与事件日志观察。" },
          { title: "Microsoft Learn：Using Device Manager", url: "https://learn.microsoft.com/en-us/windows-hardware/drivers/install/using-device-manager", usage: "设备管理器和设备状态。" }
        ],
        takeaways: ["从现象选择工具。", "资源占用需要看持续时间和上下文。", "日志是证据而非自动结论。", "初学阶段只观察系统工具。", "修改前先记录状态和影响范围。"]
      }
    ]
  },
  {
    id: 1,
    title: "Windows 与硬件",
    subtitle: "硬件、启动、目录、权限、环境变量与系统工具",
    color: "yellow",
    lessons: [
      {
        id: "hardware",
        title: "CPU、内存、硬盘与外设",
        duration: 25,
        level: "基础",
        summary: "理解 CPU、内存、硬盘和外设在电脑里的分工。",
        why: "只有分清计算、临时工作区和长期存储，才能解释程序为什么会卡、文件为何关机后仍然存在。",
        concepts: [
          "CPU 负责读取并执行指令。",
          "RAM 是程序运行时的临时工作区。",
          "SSD/HDD 用来长期保存系统、程序和文件。",
          "外设负责输入和输出，例如键盘、鼠标、显示器和打印机。"
        ],
        example: "双击程序 → 从硬盘读取 → 装入内存 → CPU 执行 → 屏幕输出",
        practice: "打开任务管理器，在启动浏览器前后分别记录 CPU、内存和磁盘变化。",
        checkpoint: "你能用自己的话解释内存不足与硬盘空间不足的区别。"
      },
      {
        id: "program-process",
        title: "程序、进程与线程",
        duration: 24,
        level: "基础",
        summary: "理解磁盘上的程序和运行中的进程不是同一个概念。",
        why: "任务管理、性能排查和后续编程都依赖进程模型。",
        concepts: [
          "程序是存储在磁盘上的指令和资源。",
          "进程是程序一次运行形成的实例。",
          "同一个程序可以启动多个进程。",
          "线程是进程内部安排执行工作的单位，通常共享进程内存。"
        ],
        example: "chrome.exe（程序文件）\n├─ 浏览器进程\n├─ 页面进程\n└─ GPU 进程",
        practice: "打开任务管理器，观察浏览器、记事本和资源管理器对应的进程。",
        checkpoint: "你能解释为什么关闭窗口后，有时进程仍然存在。"
      },
      {
        id: "windows-folders",
        title: "Windows 目录、用户文件夹与程序位置",
        duration: 24,
        level: "基础",
        summary: "认识系统目录、用户目录、安装目录和常见默认文件夹。",
        why: "很多找不到文件、找不到配置和找不到程序的根源，都是没分清这些默认位置。",
        concepts: [
          "C:\\Windows 和 C:\\Windows\\System32 属于系统目录，通常不要随便改动。",
          "C:\\Users\\用户名 是当前用户的主目录，桌面、下载、文档通常都在里面。",
          "C:\\Program Files 和 C:\\Program Files (x86) 常用于存放安装后的程序。",
          "AppData 常保存用户级配置、缓存和程序数据，通常是隐藏目录。"
        ],
        example: "C:\\Users\\Alice\\Downloads\\report.pdf\nC:\\Program Files\\App\\app.exe\nC:\\Windows\\System32\\cmd.exe",
        practice: "找出自己的用户主目录、桌面、下载、Program Files 和 AppData，只观察位置，不修改内容。",
        checkpoint: "你能区分个人文件应该放哪里、安装软件通常放哪里。"
      },
      {
        id: "startup-chain",
        title: "启动过程、登录界面与开机自启",
        duration: 26,
        level: "基础",
        summary: "看懂从通电到桌面的基本启动链路。",
        why: "电脑变慢不一定是程序太多，也可能是启动链、登录流程或自启项太重。",
        concepts: [
          "UEFI/BIOS、引导加载器、Windows 内核和登录界面共同构成启动链。",
          "用户登录后，桌面环境和自启程序才会逐步出现。",
          "启动项过多会拖慢开机和登录速度。",
          "安全模式保留最少启动组件，适合观察故障。"
        ],
        example: "电源按钮 → 固件 → 启动加载器 → Windows → 登录 → 桌面 → 自启程序",
        practice: "打开任务管理器的“启动应用”页，记录两项启动项及其影响等级，只观察不更改。",
        checkpoint: "你能区分开机启动、登录后启动和普通手动启动。"
      },
      {
        id: "install-path",
        title: "安装、卸载与 PATH",
        duration: 28,
        level: "重点",
        summary: "看懂安装程序复制了什么，以及命令为什么会提示找不到。",
        why: "安装不只是放一个图标，它还可能写入配置、注册组件、创建快捷方式并修改 PATH。",
        concepts: [
          "桌面快捷方式不是程序本体。",
          "安装目录常位于 Program Files、用户目录或应用自带目录。",
          "PATH 是系统搜索可执行程序的一组目录。",
          "卸载应优先使用设置界面或软件自带卸载器。"
        ],
        example: "输入 python\n→ 系统在当前目录与 PATH 中查找 python.exe\n→ 找到后启动，否则提示无法识别命令",
        practice: "找到一个已安装软件的快捷方式目标和实际安装目录，不修改其中内容。",
        checkpoint: "你能解释删除桌面图标为什么不等于卸载软件。"
      },
      {
        id: "accounts-permissions",
        title: "用户账户、管理员与 UAC",
        duration: 26,
        level: "重点",
        summary: "理解普通用户、管理员、用户配置文件和 UAC。",
        why: "权限限制保护系统和其他用户的数据，提高权限也会放大误操作的影响。",
        concepts: [
          "不同账户拥有不同的身份和用户配置文件。",
          "普通用户和管理员的默认权限范围不同。",
          "UAC 会在需要更高权限时提示确认。",
          "以管理员身份运行是临时提升，不是万能修复按钮。"
        ],
        example: "普通程序 → 请求修改系统目录 → UAC 提示 → 用户确认或拒绝",
        practice: "查看一个个人文件与 Program Files 目录的属性和安全选项，只观察不修改。",
        checkpoint: "你能说出哪些操作可能需要管理员权限，以及为什么。"
      },
      {
        id: "file-permissions",
        title: "文件权限、所有者与继承",
        duration: 24,
        level: "重点",
        summary: "看懂读取、写入、执行和所有者对文件访问的影响。",
        why: "权限决定谁能碰什么，错误权限会造成打不开、改不了和装不了。",
        concepts: [
          "ACL 用来记录对象允许哪些用户或组做什么。",
          "所有者通常可以修改权限设置。",
          "权限可以从父文件夹继承到子文件夹和文件。",
          "Access denied 和文件被占用是两类不同问题。"
        ],
        example: "个人文件通常允许你读写；系统目录可能只允许特定用户组修改。",
        practice: "打开一个文件夹的“安全”选项卡，观察用户、组、权限和继承关系，只记录不修改。",
        checkpoint: "你能分辨文件打不开是路径问题、权限问题还是被占用。"
      },
      {
        id: "environment-registry",
        title: "环境变量、注册表与搜索路径",
        duration: 24,
        level: "重点",
        summary: "理解 PATH、TEMP、USERPROFILE 和注册表各管什么。",
        why: "程序运行时需要配置，Windows 用环境变量和注册表保存不同层级的设置。",
        concepts: [
          "环境变量通常随进程传递，适合保存路径、临时目录和用户主目录等信息。",
          "PATH 决定命令行怎样寻找可执行程序。",
          "TEMP 和 TMP 指向临时文件目录，USERPROFILE 指向当前用户主目录。",
          "注册表保存系统和应用的持久配置，但不是所有设置都在注册表里。"
        ],
        example: "echo %PATH%\necho %TEMP%\necho %USERPROFILE%",
        practice: "在系统环境变量里找到 PATH、TEMP 和 USERPROFILE，只观察其含义和位置。",
        checkpoint: "你能区分环境变量、路径变量和注册表配置。"
      },
      {
        id: "task-manager",
        title: "任务管理器、性能与启动项",
        duration: 26,
        level: "重点",
        summary: "用任务管理器观察进程、资源和开机启动。",
        why: "先学会观察，再谈修改，是稳定排障的基本顺序。",
        concepts: [
          "进程页能查看程序当前占用的 CPU、内存和磁盘。",
          "性能页能观察整体资源趋势和瓶颈。",
          "启动页能查看哪些程序会在登录后自动运行。",
          "结束任务是最后手段，不是第一反应。"
        ],
        example: "浏览器卡顿 → 看 CPU、内存、磁盘 → 再判断是网页、插件还是系统瓶颈",
        practice: "记录三个资源占用最高的进程名称和数值，不结束任何进程。",
        checkpoint: "你能从任务管理器读出系统卡顿更像哪一类瓶颈。"
      },
      {
        id: "services-events",
        title: "服务、计划任务与事件查看器",
        duration: 26,
        level: "实践",
        summary: "认识后台常驻、定时触发和日志证据。",
        why: "有些功能没有窗口，却一直在后台运行；有些故障只能靠日志追。",
        concepts: [
          "服务通常在后台常驻，可以设置为自动、手动或禁用。",
          "计划任务可以按时间、登录或事件触发。",
          "事件查看器记录系统、应用和安全相关日志。",
          "日志中的错误、警告和信息是排障证据。"
        ],
        example: "Windows Update 服务在后台运行；事件查看器里可能记录启动失败或驱动问题。",
        practice: "打开 services.msc 和 eventvwr.msc，分别找出一个服务和一条最近的警告记录，只观察不修改。",
        checkpoint: "你能区分服务、计划任务和事件日志各自解决什么问题。"
      },
      {
        id: "device-manager",
        title: "设备管理器、驱动与外设",
        duration: 24,
        level: "实践",
        summary: "理解 Windows 如何识别硬件和驱动。",
        why: "硬件问题很多时候不是“坏了”，而是驱动、接口或识别流程出了问题。",
        concepts: [
          "设备管理器按类别列出系统识别到的硬件。",
          "驱动是操作系统和硬件之间的软件翻译层。",
          "黄色感叹号通常表示设备存在问题或驱动异常。",
          "外设故障可能来自驱动、线缆、接口或供电。"
        ],
        example: "USB 鼠标插上后出现新设备；网卡驱动异常时网络图标可能显示错误。",
        practice: "在设备管理器中找到一个设备条目，记录其类别、驱动提供者和版本，只查看不修改。",
        checkpoint: "你能说出驱动和设备不是同一个东西。"
      },
      {
        id: "disk-management",
        title: "磁盘管理、系统还原与虚拟化",
        duration: 28,
        level: "重点",
        summary: "认识分区、盘符、系统还原点和虚拟机。",
        why: "磁盘、分区和系统恢复是安装、升级和排障时最容易被忽视的底层条件。",
        concepts: [
          "磁盘、分区和卷不是同一个概念。",
          "格式化会创建或重建文件系统。",
          "盘符只是 Windows 给卷分配的入口名，可能变化。",
          "系统还原回滚的是系统文件和设置，不等于完整备份。",
          "虚拟化可以在一台电脑里运行另一套操作系统。"
        ],
        example: "新 SSD → 创建分区 → 分配盘符 → 安装系统；出现问题时可用还原点回退系统设置。",
        practice: "打开磁盘管理，识别磁盘、分区、文件系统、容量和状态，只做观察记录。",
        checkpoint: "你能解释分区、卷、盘符、还原点和备份的差别。"
      }
    ]
  },
  {
    id: 2,
    title: "网络与互联网",
    subtitle: "局域网、IP、DNS、端口、HTTP、HTTPS 与排障",
    color: "blue",
    lessons: [
      {
        id: "network-map",
        title: "局域网、互联网与路由器",
        duration: 26,
        level: "基础",
        summary: "建立设备、路由器、运营商和互联网之间的连接图。",
        why: "网络不是一个抽象的云，而是一跳一跳转发数据的设备和链路。",
        concepts: [
          "局域网连接家中或单位内部设备。",
          "路由器在不同网络之间转发数据。",
          "网关是本设备离开当前网络时先交给的出口。",
          "带宽描述单位时间能传多少数据，延迟描述一次往返需要多久。"
        ],
        example: "电脑 → Wi-Fi 路由器 → 运营商网络 → 目标服务器",
        practice: "画出自己电脑、手机、路由器、运营商和一个网站之间的大致路径。",
        checkpoint: "你能画出自己设备访问互联网的大致链路。"
      },
      {
        id: "ip-addressing",
        title: "IP 地址、子网掩码与默认网关",
        duration: 28,
        level: "重点",
        summary: "看懂 ipconfig 里的 IPv4 地址、子网掩码和默认网关。",
        why: "IP 地址帮助网络定位设备，子网掩码和网关决定数据是留在本地还是发出去。",
        concepts: [
          "IP 地址用于标识网络接口，而不是直接标识一个人。",
          "子网掩码帮助判断目标是否在同一个本地网络。",
          "默认网关通常是路由器在本地网络中的地址。",
          "DHCP 可以自动分配 IP、网关和 DNS 配置。"
        ],
        example: "IPv4 地址：192.168.1.23\n子网掩码：255.255.255.0\n默认网关：192.168.1.1",
        practice: "运行 ipconfig，记录 IPv4 地址、子网掩码、默认网关和 DNS 服务器。",
        checkpoint: "你能解释 IP 地址、子网掩码和默认网关分别解决什么问题。"
      },
      {
        id: "private-public-nat",
        title: "公网 IP、私网 IP 与 NAT",
        duration: 28,
        level: "重点",
        summary: "理解家里多台设备为什么能共用一条互联网出口。",
        why: "公网、私网和 NAT 是家庭网络、公司网络和端口转发的基础。",
        concepts: [
          "192.168.x.x、10.x.x.x 和 172.16–31.x.x 常见于私网。",
          "公网 IP 能在互联网范围内被路由，私网 IP 主要在局域网内部使用。",
          "NAT 让多台私网设备共享一个公网出口。",
          "端口转发是把外部请求转交给内网某台设备的规则。"
        ],
        example: "手机 192.168.1.20 和电脑 192.168.1.23 → 路由器 NAT → 同一个公网出口",
        practice: "查看自己设备的本地 IP，再打开浏览器搜索“what is my ip”，比较二者差异。",
        checkpoint: "你能解释为什么本机 IP 和网站看到的公网 IP 可能不同。"
      },
      {
        id: "wifi-ethernet",
        title: "Wi-Fi、网线与信号质量",
        duration: 24,
        level: "基础",
        summary: "区分无线连接、网线连接、信号强度和实际速度。",
        why: "网络慢不一定是宽带问题，也可能是 Wi-Fi 信号、干扰、距离或设备性能问题。",
        concepts: [
          "以太网用网线连接，通常更稳定。",
          "Wi-Fi 使用无线信号，容易受距离、墙体和干扰影响。",
          "信号满格不等于互联网出口一定快。",
          "2.4GHz 覆盖较远但更拥挤，5GHz 速度更高但穿墙较弱。"
        ],
        example: "同一宽带下，靠近路由器的 5GHz Wi-Fi 可能比隔两堵墙的 2.4GHz 更快。",
        practice: "在同一设备上比较靠近路由器和远离路由器时的网页加载体验。",
        checkpoint: "你能区分 Wi-Fi 信号问题和网站服务器慢。"
      },
      {
        id: "dns-resolution",
        title: "域名、DNS 与解析缓存",
        duration: 28,
        level: "重点",
        summary: "理解域名怎样变成网络可以使用的地址。",
        why: "人记域名，网络转发需要地址；DNS 是二者之间的查询系统。",
        concepts: [
          "DNS 把域名查询为 IP 地址或其他记录。",
          "A 记录常指向 IPv4，AAAA 记录常指向 IPv6。",
          "CNAME 可以把一个名称指向另一个名称。",
          "浏览器、系统和 DNS 服务器都可能缓存解析结果。"
        ],
        example: "example.com → DNS 查询 → 93.184.216.34 → 连接目标服务器",
        practice: "使用 nslookup 查询一个熟悉域名，记录返回的地址和所用 DNS 服务器。",
        checkpoint: "你能解释域名、DNS 记录和 IP 地址之间的关系。"
      },
      {
        id: "ports-protocols-localhost",
        title: "端口、协议与 localhost",
        duration: 28,
        level: "重点",
        summary: "理解一台电脑为什么能同时运行多种网络服务。",
        why: "IP 帮助找到设备，端口帮助操作系统把数据交给正确程序。",
        concepts: [
          "端口是操作系统区分网络服务的数字标识。",
          "HTTP 常用 80，HTTPS 常用 443，开发服务器常用 3000、5173 或 8000 等端口。",
          "localhost 通常指当前电脑，常见地址是 127.0.0.1 或 ::1。",
          "协议规定双方怎样组织和解释数据。"
        ],
        example: "127.0.0.1:4173 → 当前电脑上的 4173 端口服务",
        practice: "访问一个本地静态服务地址，指出其中的主机名和端口号。",
        checkpoint: "你能区分 IP、端口、协议和 localhost。"
      },
      {
        id: "tcp-udp",
        title: "TCP、UDP 与连接",
        duration: 30,
        level: "基础",
        summary: "理解可靠连接和轻量传输的差异。",
        why: "很多网络现象来自传输层：连接失败、丢包、延迟和重试都和它有关。",
        concepts: [
          "TCP 面向连接，关注可靠、有序传输。",
          "UDP 不保证可靠到达，开销更小，适合部分实时场景。",
          "HTTP/HTTPS 传统上常运行在 TCP 之上，现代 HTTP/3 使用 QUIC。",
          "连接失败可能发生在地址、端口、防火墙或服务未启动等层面。"
        ],
        example: "网页加载通常需要建立连接；实时语音更重视低延迟。",
        practice: "观察浏览器刷新页面时 Network 面板里的多个请求，不需要抓包。",
        checkpoint: "你能用“可靠性”和“延迟”解释 TCP 与 UDP 的基本差异。"
      },
      {
        id: "http",
        title: "浏览器、HTTP 请求与响应",
        duration: 32,
        level: "重点",
        summary: "跟踪一次网页请求从地址栏到屏幕的全过程。",
        why: "Web 开发、接口调用和安全分析都建立在请求与响应模型之上。",
        concepts: [
          "浏览器是客户端，网站后台通常运行在服务器。",
          "HTTP 使用请求和响应交换数据。",
          "请求方法、URL、请求头、响应头和响应体共同描述一次交换。",
          "状态码表示请求结果类别，例如 200、301、404 和 500。"
        ],
        example: "GET /index.html HTTP/1.1\nHost: example.com\n\nHTTP/1.1 200 OK\nContent-Type: text/html",
        practice: "打开浏览器开发者工具 Network 面板，刷新页面并观察一个文档请求。",
        checkpoint: "你能指出 URL、请求方法、状态码和响应类型。"
      },
      {
        id: "https-certificates",
        title: "HTTPS、证书与安全提示",
        duration: 28,
        level: "重点",
        summary: "理解浏览器地址栏小锁和证书错误在提醒什么。",
        why: "HTTPS 不只是加密内容，还帮助确认你连接的是谁。",
        concepts: [
          "HTTPS 在 HTTP 外加入 TLS 加密和身份验证。",
          "证书用于证明站点身份，并由受信任的证书机构签发。",
          "证书过期、域名不匹配或不受信任都会触发浏览器警告。",
          "HTTPS 不能保证网页内容一定可信，只说明连接本身受保护。"
        ],
        example: "https://example.com → TLS 握手 → 验证证书 → 加密传输 HTTP 内容",
        practice: "打开一个 HTTPS 网站，查看浏览器地址栏中的连接信息和证书摘要。",
        checkpoint: "你能解释 HTTPS 保护了什么，也能说出它不保护什么。"
      },
      {
        id: "browser-network-panel",
        title: "浏览器 Network 面板读法",
        duration: 30,
        level: "实践",
        summary: "用 Network 面板观察请求、状态码、类型、大小和耗时。",
        why: "这是看见网页真实网络行为的最直观入口。",
        concepts: [
          "Document、Script、Stylesheet、Image 和 Fetch/XHR 表示不同资源类型。",
          "状态码告诉你请求是否成功、重定向或失败。",
          "Size 和 Time 帮助判断下载体积和等待时间。",
          "Disable cache 可以帮助观察未缓存时的真实加载。"
        ],
        example: "刷新页面 → Network 出现 HTML、CSS、JS、图片和接口请求",
        practice: "打开任意网页的 Network 面板，找出主文档、一个图片请求和一个脚本请求。",
        checkpoint: "你能在 Network 面板中找到至少三类资源，并解释它们的作用。"
      },
      {
        id: "network-tools",
        title: "ipconfig、ping、nslookup 与 tracert",
        duration: 32,
        level: "实践",
        summary: "用只读命令观察地址、连通性、DNS 和路径。",
        why: "这些命令能把“感觉网络坏了”变成可验证的证据。",
        concepts: [
          "ipconfig 查看本机网络配置。",
          "ping 常用于测试能否收到目标响应，但目标可能禁用响应。",
          "nslookup 查询 DNS 解析结果。",
          "tracert 显示到目标路径上的中间跳点，结果可能受防火墙影响。"
        ],
        example: "ipconfig\nping example.com\nnslookup example.com\ntracert example.com",
        practice: "分别运行 ipconfig、nslookup 和 ping，记录命令输出里最关键的一行。",
        checkpoint: "你能说出每个命令观察的是网络链路的哪一层。"
      },
      {
        id: "network-troubleshooting",
        title: "网络故障的分层排查",
        duration: 34,
        level: "实践",
        summary: "按设备、链路、地址、DNS、端口和应用逐层定位问题。",
        why: "有顺序的排查比反复重启更能找到真实原因。",
        concepts: [
          "先确认设备、网线、Wi-Fi 和路由器状态。",
          "再确认 IP、网关和局域网连通。",
          "随后检查 DNS 是否能解析。",
          "再看端口、代理、VPN、防火墙和目标服务。",
          "最后看浏览器缓存、Cookie、证书和网站自身状态。"
        ],
        example: "能 ping 通 IP 但打不开域名\n→ IP 链路可能正常\n→ 优先检查 DNS",
        practice: "记录一次网络异常的现象、范围、已验证层级和最终原因。",
        checkpoint: "你能按从底到上的顺序列出至少六步排查动作。"
      }
    ]
  },
  {
    id: 3,
    title: "命令行与工具",
    subtitle: "PowerShell、参数、管道、文件、观察命令与脚本安全",
    color: "coral",
    lessons: [
      {
        id: "shell",
        title: "什么是终端、Shell 与 PowerShell",
        duration: 22,
        level: "基础",
        summary: "理解终端窗口、Shell、命令和 PowerShell 的关系。",
        why: "命令行让操作可精确描述、重复执行并组合自动化。",
        concepts: [
          "终端负责显示和输入。",
          "Shell 读取并解释命令。",
          "PowerShell 是 Windows 的现代 Shell，输出主要是对象而不只是文本。",
          "命令通常由命令名、参数和值组成。"
        ],
        example: "Get-Date\nGet-Location\nGet-Help Get-ChildItem",
        practice: "打开 PowerShell，运行 Get-Date、Get-Location 和 Get-Help Get-ChildItem。",
        checkpoint: "你能区分终端、Shell、PowerShell 和具体命令。"
      },
      {
        id: "cmdlets-parameters",
        title: "命令名、参数、帮助与 Tab 补全",
        duration: 24,
        level: "基础",
        summary: "看懂 Get-ChildItem -Path . -Force 这类命令结构。",
        why: "不会读参数，就容易把命令当咒语；会查帮助，才开始真正可自学。",
        concepts: [
          "PowerShell cmdlet 常使用 动词-名词 命名，例如 Get-ChildItem。",
          "参数名通常以 - 开头，例如 -Path、-Filter、-Recurse。",
          "Get-Help 可以查看命令说明和示例。",
          "Tab 补全能减少路径和命令拼写错误。"
        ],
        example: "Get-Help Get-ChildItem -Examples\nGet-ChildItem -Path . -Force",
        practice: "查询 Get-ChildItem 的三个示例，记录命令名、参数名和参数值。",
        checkpoint: "你能把一条命令拆成命令名、参数和值。"
      },
      {
        id: "shell-path",
        title: "当前位置、路径切换与目录浏览",
        duration: 25,
        level: "实践",
        summary: "使用 Get-Location、Set-Location 和 Get-ChildItem 浏览目录。",
        why: "命令默认作用于当前位置，路径错误会直接改变命令结果。",
        concepts: [
          "Get-Location 显示当前位置。",
          "Set-Location 切换目录。",
          "Get-ChildItem 列出目录内容。",
          "相对路径依赖当前位置，绝对路径不依赖当前位置。"
        ],
        example: "Get-Location\nGet-ChildItem\nSet-Location D:\\ComputerLearning",
        practice: "只使用 PowerShell 进入学习目录、列出文件，再返回上一级。",
        checkpoint: "你能在执行命令前确认当前目录，并判断相对路径指向哪里。"
      },
      {
        id: "safe-practice-folder",
        title: "建立安全练习目录",
        duration: 22,
        level: "实践",
        summary: "先把命令练习限制在专门测试目录中。",
        why: "初学命令行最怕误操作真实资料，所以先把边界画清楚。",
        concepts: [
          "练习目录应和真实资料分开。",
          "New-Item 可以创建文件夹或文件。",
          "Get-ChildItem 用于确认命令结果。",
          "每次修改前先确认当前位置和目标路径。"
        ],
        example: "Get-Location\n$root = Join-Path $HOME 'shell-practice'\nNew-Item -Path $root -ItemType Directory -Force\nSet-Location -LiteralPath $root\nGet-Location",
        practice: "先用 Get-Location 记录当前位置，再用基于 $HOME 的绝对路径创建 shell-practice，最后用 Resolve-Path 确认目标在练习根内。",
        checkpoint: "你能证明接下来的文件命令只会影响测试目录。"
      },
      {
        id: "shell-files",
        title: "创建、复制、移动与重命名测试文件",
        duration: 30,
        level: "实践",
        summary: "练习 New-Item、Copy-Item、Move-Item 和 Rename-Item。",
        why: "文件命令的效果清楚可见，是学习命令参数和路径最合适的练习。",
        concepts: [
          "New-Item 创建项目。",
          "Copy-Item 复制。",
          "Move-Item 移动。",
          "Rename-Item 重命名。"
        ],
        example: "New-Item note.txt -ItemType File\nCopy-Item note.txt note-copy.txt\nRename-Item note-copy.txt review.txt",
        practice: "在 shell-practice 目录复现示例，并用 Get-ChildItem 验证每一步。",
        checkpoint: "你能在不触碰真实资料的情况下完成创建、复制、移动和重命名。"
      },
      {
        id: "remove-safety",
        title: "删除命令、确认参数与危险边界",
        duration: 26,
        level: "重点",
        summary: "理解 Remove-Item 为什么必须谨慎使用。",
        why: "命令行删除往往不像资源管理器那样容易从回收站恢复，尤其是递归删除。",
        concepts: [
          "Remove-Item 会删除文件或目录。",
          "-WhatIf 可以预览将要发生的操作。",
          "-Confirm 可以要求执行前确认。",
          "-Recurse 会影响子目录，必须先确认目标路径。"
        ],
        example: "Remove-Item old.txt -WhatIf\nRemove-Item old.txt -Confirm",
        practice: "只在 shell-practice 目录中，用 -WhatIf 预览删除一个测试文件，不删除真实资料。",
        checkpoint: "你能说出执行删除命令前必须检查的三件事。"
      },
      {
        id: "pipeline-objects",
        title: "管道、对象、筛选与排序",
        duration: 32,
        level: "重点",
        summary: "理解 PowerShell 管道传递的是对象，筛选和排序依赖属性。",
        why: "管道是命令行组合能力的核心，也是自动化的起点。",
        concepts: [
          "| 把前一个命令的输出传给后一个命令。",
          "Where-Object 用于筛选对象。",
          "Sort-Object 用于排序。",
          "Select-Object 用于挑选属性或数量。"
        ],
        example: "Get-Process | Sort-Object -Property CPU -Descending | Select-Object -First 5 -Property Name, CPU\n注意：CPU 是进程累计的处理器时间，不等于任务管理器的瞬时占用率。",
        practice: "列出按累计 CPU 时间排名靠前的 5 个进程，只记录名称和 CPU 数值，并在报告中标注它不是瞬时百分比。",
        checkpoint: "你能解释这条管道每一段输入和输出了什么。"
      },
      {
        id: "text-search-output",
        title: "文本搜索、输出保存与编码",
        duration: 28,
        level: "实践",
        summary: "用 Select-String 搜索文本，用 Out-File 保存结果。",
        why: "命令行不只是看屏幕，还要能留下可复查的记录。",
        concepts: [
          "Select-String 可以在文本中查找模式。",
          "Out-File 可以把输出写入文件。",
          "编码影响中文是否正常显示。",
          "覆盖写入和追加写入要分清。"
        ],
        example: "Select-String -Path .\\notes.txt -Pattern \"路径\"\nGet-Process | Out-File .\\processes.txt -Encoding utf8",
        practice: "在测试文本中搜索一个词，并把搜索结果保存到 result.txt。",
        checkpoint: "你能说明输出到屏幕和输出到文件的区别。"
      },
      {
        id: "environment-commands",
        title: "环境变量、PATH 与命令查找",
        duration: 26,
        level: "重点",
        summary: "用命令观察 PATH、USERPROFILE 和 TEMP。",
        why: "很多“找不到命令”不是软件没装，而是命令查找路径不对。",
        concepts: [
          "$env:NAME 可以读取环境变量。",
          "$env:PATH 保存多个命令搜索目录。",
          "Get-Command 可以查看命令来自哪里。",
          "修改 PATH 前应先备份原值。"
        ],
        example: "$env:USERPROFILE\n$env:TEMP\nGet-Command python",
        practice: "查看 USERPROFILE、TEMP 和 PATH，并用 Get-Command 查询一个已安装命令。",
        checkpoint: "你能解释系统如何从 PATH 中找到可执行程序。"
      },
      {
        id: "process-tools",
        title: "进程、网络与 DNS 观察命令",
        duration: 30,
        level: "实践",
        summary: "使用只读命令观察系统和网络状态。",
        why: "先掌握观察，再学习修改，是稳定排障的基本顺序。",
        concepts: [
          "Get-Process 查看进程。",
          "Get-NetTCPConnection 查看 TCP 连接。",
          "Resolve-DnsName 查询 DNS。",
          "命令输出可以继续筛选和排序。"
        ],
        example: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10\nResolve-DnsName example.com",
        practice: "查看 CPU 使用靠前的进程，并查询一个域名，只记录结果不结束进程。",
        checkpoint: "你能说明观察命令不会自动等于修复命令。"
      },
      {
        id: "errors-policy-admin",
        title: "报错、权限、管理员与执行策略",
        duration: 30,
        level: "重点",
        summary: "读懂命令错误，分清权限问题和脚本执行策略。",
        why: "错误信息是证据，不是噪音；盲目管理员运行会放大风险。",
        concepts: [
          "错误信息通常包含命令、位置和原因。",
          "Access denied 常和权限有关。",
          "Execution Policy 控制 PowerShell 脚本执行策略，但不是完整安全边界。",
          "管理员权限只在明确需要时使用。"
        ],
        example: "File cannot be loaded because running scripts is disabled on this system.",
        practice: "运行一条不存在的命令，记录错误类型、提示信息和可能原因。",
        checkpoint: "你能把错误信息拆成现象、原因线索和下一步验证。"
      },
      {
        id: "scripts-reproducibility",
        title: "脚本、历史记录与可复现操作",
        duration: 32,
        level: "实践",
        summary: "把多步命令整理成可复查、可重复的脚本或记录。",
        why: "真正有价值的命令行能力，是让操作可复现、可审查、可交给别人运行。",
        concepts: [
          "Get-History 可以查看当前会话执行过的命令。",
          "脚本文件通常使用 .ps1 扩展名。",
          "脚本应写明运行目录、输入、输出和风险。",
          "复杂操作先写注释和检查命令，再执行修改命令。"
        ],
        example: "# 进入测试目录\nSet-Location .\\shell-practice\nGet-ChildItem",
        practice: "把本阶段三条只读命令整理到 notes.ps1，并在注释中说明用途。",
        checkpoint: "另一个人能按你的记录复现观察步骤。"
      }
    ]
  },
  {
    id: 4,
    title: "编程思维与 Python",
    subtitle: "问题分解、Python 运行、类型、流程、函数、文件、测试与项目",
    color: "green",
    lessons: [
      {
        id: "programming-model",
        title: "程序、算法与问题分解",
        duration: 28,
        level: "基础",
        summary: "把输入、处理、输出和状态变化写成明确步骤。",
        why: "编程首先是描述过程，其次才是记住某种语言的写法。",
        concepts: [
          "算法是一组有限且明确的步骤。",
          "程序是算法用编程语言写出的可执行表达。",
          "输入经过处理产生输出。",
          "边界情况决定程序是否可靠。"
        ],
        example: "输入：下载目录\n处理：识别文件类型并分类\n输出：移动后的文件和操作记录",
        practice: "不用代码，写出“整理下载文件夹”的逐步算法、异常情况和验收标准。",
        checkpoint: "步骤足够明确，另一个人无需猜测即可执行。"
      },
      {
        id: "python-run",
        title: "安装 Python、解释器与脚本运行",
        duration: 30,
        level: "起步",
        summary: "理解 Python 文件、解释器、交互模式和脚本运行。",
        why: "很多初学问题不是语法问题，而是 Python 没装好、命令找错了或运行了错误文件。",
        concepts: [
          "Python 解释器读取并执行 .py 文件。",
          "交互模式适合小实验，脚本文件适合保存完整步骤。",
          "python --version 用于确认命令指向哪个 Python。",
          "__name__ == \"__main__\" 常用于区分直接运行和被导入。"
        ],
        example: "python --version\n若命令不可用，Windows 可尝试 py --version\npython hello.py",
        practice: "创建 hello.py，打印一行中文和当前 Python 版本，记录实际使用的命令、解释器路径和运行目录。",
        checkpoint: "你能说清是在运行哪个 Python、哪个文件、从哪个目录运行。"
      },
      {
        id: "variables-types",
        title: "变量、值与基本类型",
        duration: 34,
        level: "编程",
        summary: "学习值如何被命名，以及字符串、数字和布尔值怎样表达信息。",
        why: "变量和类型是程序保存状态、做判断和处理数据的基础。",
        concepts: [
          "变量名引用一个对象，不是把盒子永久绑定给某种值。",
          "str、int、float、bool 是常见基本类型。",
          "type() 可以观察一个值的类型。",
          "类型不同，支持的操作也不同。"
        ],
        example: "filename = \"notes.txt\"\nsize = 120\nis_text = filename.endswith(\".txt\")",
        practice: "写一个脚本，保存文件名、大小、是否为文本文件，并打印每个值和类型。",
        checkpoint: "你能解释每个变量引用了什么值，值属于什么类型。"
      },
      {
        id: "strings-formatting",
        title: "字符串、格式化与常用方法",
        duration: 32,
        level: "编程",
        summary: "处理文件名、路径片段和用户输入中的文本。",
        why: "真实脚本经常从文件名、命令行和配置中读到字符串。",
        concepts: [
          "字符串是字符序列。",
          "索引和切片可以取出字符串的一部分。",
          "常用方法包括 strip、lower、split、replace、endswith。",
          "f-string 适合把变量格式化进输出文本。"
        ],
        example: "name = \" Notes.TXT \"\nclean = name.strip().lower()\nprint(f\"文件名：{clean}\")",
        practice: "输入一个文件名，输出小写形式、扩展名判断和格式化描述。",
        checkpoint: "你能不用猜测地解释字符串方法调用前后值发生了什么变化。"
      },
      {
        id: "containers-basics",
        title: "列表、字典与数据组织",
        duration: 36,
        level: "编程",
        summary: "用列表保存顺序数据，用字典保存带名字的数据。",
        why: "程序处理的通常不是一个值，而是一组文件、一批记录或一个对象的多个属性。",
        concepts: [
          "list 按顺序保存多个值。",
          "dict 使用键和值保存带名字的数据。",
          "len、in 和 for 常用于读取容器。",
          "容器可以嵌套，但过深会让程序难读。"
        ],
        example: "files = [\"a.txt\", \"b.jpg\"]\ninfo = {\"name\": \"a.txt\", \"size\": 120}",
        practice: "用列表保存三个文件名，用字典描述其中一个文件，再打印它们。",
        checkpoint: "你能说明什么时候用列表，什么时候用字典。"
      },
      {
        id: "conditions",
        title: "条件判断、布尔逻辑与边界情况",
        duration: 34,
        level: "编程",
        summary: "用 if、elif、else 根据条件选择路径。",
        why: "程序可靠性常常取决于有没有处理边界情况和异常输入。",
        concepts: [
          "if 根据布尔表达式选择分支。",
          "elif 处理多个互斥条件。",
          "and、or、not 组合条件。",
          "边界情况包括空输入、未知格式和不符合预期的数据。"
        ],
        example: "if filename == \"\":\n    print(\"缺少文件名\")\nelif \".\" not in filename:\n    print(\"没有扩展名\")",
        practice: "写一个文件名分类脚本，处理空字符串、无扩展名和常见扩展名。",
        checkpoint: "你能列出正常输入和至少三个边界输入。"
      },
      {
        id: "loops",
        title: "循环、遍历与重复处理",
        duration: 34,
        level: "编程",
        summary: "用 for 和 while 处理重复任务。",
        why: "电脑最擅长重复执行明确规则，循环是自动化的核心。",
        concepts: [
          "for 适合遍历已知集合。",
          "while 适合条件满足时持续执行。",
          "break 可以提前结束循环。",
          "循环中要避免条件永远不变导致死循环。"
        ],
        example: "for filename in files:\n    print(filename)\n\nwhile retries < 3:\n    retries += 1",
        practice: "遍历文件名列表，统计其中 .txt 文件数量。",
        checkpoint: "你能说明循环从哪里开始、何时结束、每轮处理什么。"
      },
      {
        id: "functions-modules",
        title: "函数、参数、返回值与作用域",
        duration: 38,
        level: "编程",
        summary: "把职责明确的操作封装起来，避免重复代码。",
        why: "函数让程序可理解、可测试，模块让相关函数形成清晰边界。",
        concepts: [
          "函数应有清楚输入与输出。",
          "参数把外部数据传入函数。",
          "return 返回结果。",
          "局部变量只在函数内部有效。"
        ],
        example: "def get_extension(filename):\n    return filename.rsplit(\".\", 1)[-1] if \".\" in filename else \"\"",
        practice: "把文件名检查脚本拆成 get_extension 和 describe_file 两个函数。",
        checkpoint: "每个函数只承担一个清楚职责，并能单独测试。"
      },
      {
        id: "modules-imports",
        title: "模块、import 与标准库",
        duration: 34,
        level: "编程",
        summary: "使用标准库复用别人已经写好的能力。",
        why: "Python 的实用性很大一部分来自标准库和模块边界。",
        concepts: [
          "模块是一个可导入的 Python 文件或包。",
          "import 把模块能力引入当前文件。",
          "标准库随 Python 提供，不需要额外安装。",
          "模块名不要和标准库重名。"
        ],
        example: "import pathlib\npath = pathlib.Path(\"notes.txt\")\nprint(path.suffix)",
        practice: "使用 pathlib 判断一个路径的文件名、扩展名和父目录。",
        checkpoint: "你能解释 import 后使用的是哪个模块里的能力。"
      },
      {
        id: "files-pathlib",
        title: "文件读写、路径与 pathlib",
        duration: 40,
        level: "实践",
        summary: "用 Python 读取文本、写入记录，并安全处理路径。",
        why: "脚本常见用途就是读取文件、整理数据和生成结果。",
        concepts: [
          "Path 对象可以表达路径并提供常用方法。",
          "read_text 和 write_text 可用于简单文本读写。",
          "编码决定文本怎样变成字节。",
          "写文件前应确认目标路径，避免覆盖重要内容。"
        ],
        example: "from pathlib import Path\np = Path(\"notes.txt\")\ntext = p.read_text(encoding=\"utf-8\")",
        practice: "读取一个测试文本文件，统计行数，再写入 summary.txt。",
        checkpoint: "你能说明脚本读了哪个文件、写了哪个文件、使用什么编码。"
      },
      {
        id: "exceptions",
        title: "异常、traceback 与错误处理",
        duration: 36,
        level: "重点",
        summary: "读错误信息并在合适位置处理可预期失败。",
        why: "能定位错误比一次写对更重要，这是长期工程能力的核心。",
        concepts: [
          "异常表示程序运行中出现了无法按当前路径继续的情况。",
          "traceback 提供调用链、文件名和行号。",
          "try/except 用于处理可预期错误。",
          "不要用裸 except 吞掉所有错误。"
        ],
        example: "try:\n    text = path.read_text(encoding=\"utf-8\")\nexcept FileNotFoundError:\n    print(\"文件不存在\")",
        practice: "故意读取不存在的文件，记录异常类型和行号，再增加清楚的错误提示。",
        checkpoint: "你能提交一份包含现象、原因、修复和验证的调试记录。"
      },
      {
        id: "debugging",
        title: "调试、最小复现与 pdb",
        duration: 38,
        level: "实践",
        summary: "缩小问题范围，观察变量，而不是盲目改代码。",
        why: "调试能力决定你能否独立穿过真实项目里的错误。",
        concepts: [
          "最小复现把问题缩到能稳定出现的最小代码。",
          "print 调试适合快速观察少量变量。",
          "pdb 可以暂停程序并逐步执行。",
          "一次只验证一个假设。"
        ],
        example: "import pdb\npdb.set_trace()\n# 运行到这里后观察变量",
        practice: "给一个分类函数制造错误，用 print 或 pdb 找到错误行。",
        checkpoint: "你能说清自己验证了哪个假设，证据是什么。"
      },
      {
        id: "testing",
        title: "断言、unittest 与回归测试",
        duration: 38,
        level: "实践",
        summary: "用自动检查固定已经确认的行为。",
        why: "测试让你修改代码后知道旧功能是否还正常。",
        concepts: [
          "assert 可以表达简单预期。",
          "unittest 是 Python 标准库里的测试框架。",
          "测试用例应覆盖正常、边界和错误输入。",
          "回归测试防止已修复问题再次出现。"
        ],
        example: "assert get_extension(\"notes.txt\") == \"txt\"\nassert get_extension(\"README\") == \"\"",
        practice: "为 get_extension 写正常文件、无扩展名、隐藏文件三类测试。",
        checkpoint: "修改函数后，所有旧测试仍通过，并新增对应测试。"
      },
      {
        id: "cli-argparse",
        title: "命令行参数与 argparse",
        duration: 36,
        level: "实践",
        summary: "让 Python 脚本从命令行接收输入。",
        why: "脚本如果只能改代码里的变量，就很难复用；参数让脚本变成工具。",
        concepts: [
          "命令行参数来自用户运行脚本时输入的文本。",
          "argparse 是标准库里的参数解析工具。",
          "参数应有清楚名称、类型和帮助说明。",
          "错误参数应给出可理解提示。"
        ],
        example: "python organize.py --source Downloads --dry-run",
        practice: "写一个脚本，接收 --filename 参数并输出扩展名说明。",
        checkpoint: "你能用 --help 看懂脚本支持哪些参数。"
      },
      {
        id: "venv-pip",
        title: "虚拟环境、pip 与依赖记录",
        duration: 40,
        level: "重点",
        summary: "理解为什么项目需要隔离依赖和记录包版本。",
        why: "真实项目常常因为不同包版本互相影响而出问题，虚拟环境能把项目隔离开。",
        concepts: [
          "venv 用于创建项目级虚拟环境。",
          "pip 用于安装 Python 包。",
          "requirements.txt 常用于记录依赖。",
          "虚拟环境目录不应当作为课程源码重点提交或复制。"
        ],
        example: "python -m venv .venv\n.\\.venv\\Scripts\\python -m pip install requests\npython -m pip freeze > requirements.txt",
        practice: "只在测试项目中创建虚拟环境，查看 Python 路径，不安装额外包也可以完成观察。",
        checkpoint: "你能解释全局 Python、虚拟环境和项目依赖的区别。"
      },
      {
        id: "python-project-structure",
        title: "脚本项目结构、README 与小项目闭环",
        duration: 42,
        level: "项目",
        summary: "把零散脚本整理成可运行、可测试、可说明的小项目。",
        why: "会写几行代码只是起点，能交付一个别人能运行的小工具才算形成闭环。",
        concepts: [
          "项目应包含源码、测试、样例输入、README 和忽略规则。",
          "README 写清运行方式、输入输出和已知限制。",
          "小项目先做 dry-run，再执行真实修改。",
          "项目完成要有验收记录。"
        ],
        example: "file-organizer/\n├─ organizer.py\n├─ tests/\n├─ examples/\n└─ README.md",
        practice: "设计一个文件整理小工具项目结构，只在 examples 测试目录中运行。",
        checkpoint: "另一个人能按 README 运行脚本、看到输出、理解限制。"
      }
    ]
  },
  {
    id: 5,
    title: "数据结构与算法",
    subtitle: "编码、容器、复杂度与常用算法",
    color: "yellow",
    lessons: [
      {
        id: "encoding",
        title: "二进制、字节、文本与编码",
        duration: 36,
        level: "原理",
        summary: "理解字符、数字和文件内容最终怎样落到字节上。",
        why: "文件、网络和内存传递的都是字节；编码决定人类文字与字节序列怎样互相转换。",
        concepts: [
          "bit 是 0 或 1，byte 通常由 8 bit 组成。",
          "文本不是直接保存“字”，而是按编码规则保存字节。",
          "UTF-8 使用变长字节表示 Unicode 字符，是 Web 和代码文件中的常见选择。",
          "乱码通常来自“用错误编码解释正确字节”。"
        ],
        example: "字符“中” → UTF-8 字节 E4 B8 AD → 按 UTF-8 解码还原为“中”",
        practice: "用编辑器分别保存中英文文本，查看 UTF-8 文件大小，并尝试用错误编码重新打开。",
        checkpoint: "能区分字符、编码、字节和字体显示问题。"
      },
      {
        id: "data-structures",
        title: "数组、列表与顺序存储",
        duration: 38,
        level: "算法",
        summary: "理解按位置组织数据的结构，以及随机访问和插入删除的成本。",
        why: "列表是最常用的数据容器，很多算法都从顺序数据开始。",
        concepts: [
          "数组把元素按连续位置编号，适合通过下标访问。",
          "Python list 是动态数组，能自动扩容。",
          "末尾追加通常很快，中间插入或删除需要移动后续元素。",
          "遍历列表时要注意下标范围和空列表。"
        ],
        example: "scores = [88, 92, 75]\nscores[1] 读取第二个成绩\nscores.append(100) 在末尾追加",
        practice: "用 Python list 保存 5 个文件名，完成追加、按下标读取、删除和遍历输出。",
        checkpoint: "能说明“按位置访问”和“中间插入”为什么成本不同。"
      },
      {
        id: "linked-list",
        title: "链表与引用关系",
        duration: 36,
        level: "算法",
        summary: "认识通过引用连接节点的数据结构。",
        why: "链表帮助理解引用、节点、指针和非连续存储，是树、图等结构的前置概念。",
        concepts: [
          "链表由节点组成，每个节点保存数据和指向下一个节点的引用。",
          "链表不依赖连续内存，插入节点时常修改引用关系。",
          "按位置查找通常需要从头逐个走到目标节点。",
          "空链表、头节点和尾节点是常见边界条件。"
        ],
        example: "A 节点.next → B 节点\n插入 X：A.next → X，X.next → B",
        practice: "在纸上画出三节点链表，并演示在第一个节点后插入新节点需要改哪两条引用。",
        checkpoint: "能解释链表快在改引用，慢在按下标查找。"
      },
      {
        id: "stack-queue-deque",
        title: "栈、队列与双端队列",
        duration: 42,
        level: "算法",
        summary: "用受限的进出规则表达撤销、排队和广度遍历。",
        why: "很多系统行为不是随便取数据，而是遵守明确的先进先出或后进先出规则。",
        concepts: [
          "栈遵循 LIFO：后进先出，常用于撤销、函数调用和括号匹配。",
          "队列遵循 FIFO：先进先出，常用于排队任务和消息处理。",
          "双端队列允许两端加入或移除元素。",
          "Python `collections.deque` 适合高效从两端操作。"
        ],
        example: "浏览器后退：栈\n打印任务：队列\n滑动窗口：双端队列",
        practice: "用 list 模拟栈，再用 deque 模拟队列，记录每一步元素顺序。",
        checkpoint: "给出一个场景时，能判断应该用栈、队列还是双端队列。"
      },
      {
        id: "hash-table-set",
        title: "哈希表、集合与字典",
        duration: 44,
        level: "算法",
        summary: "理解按键快速查找、去重和成员判断。",
        why: "哈希结构是工程中最常用的性能工具之一，能把许多查找任务从遍历变成按键定位。",
        concepts: [
          "哈希表通过 hash 函数把 key 映射到存储位置。",
          "字典保存 key → value，集合只保存不重复元素。",
          "平均情况下，查找、插入和删除通常很快。",
          "可哈希对象需要在生命周期内保持 hash 值稳定。"
        ],
        example: "phone_book['小洛'] = '10086'\nseen.add('readme.md')\n'name' in user",
        practice: "统计一段文字中每个词出现次数，并用 set 找出不重复词。",
        checkpoint: "能解释列表查找和字典按键查找的差异。"
      },
      {
        id: "complexity",
        title: "复杂度、增长趋势与 Big-O",
        duration: 42,
        level: "算法",
        summary: "用增长趋势比较算法，而不是只看某次运行秒数。",
        why: "数据规模变大时，算法成本差异会被迅速放大。",
        concepts: [
          "Big-O 描述输入规模增大时成本的上界增长趋势。",
          "O(1) 通常表示成本基本不随输入增长。",
          "O(n) 常见于完整遍历，O(log n) 常见于折半缩小范围。",
          "复杂度忽略机器、语言和常数差异，重点看规模效应。"
        ],
        example: "查字典：按拼音范围折半接近 O(log n)\n逐页找名字接近 O(n)",
        practice: "分别估算访问列表第一个元素、遍历列表、二分查找的增长趋势。",
        checkpoint: "能用趋势解释为什么大数据量下算法选择比电脑快慢更关键。"
      },
      {
        id: "space-complexity",
        title: "空间复杂度与时间/空间取舍",
        duration: 36,
        level: "算法",
        summary: "分析算法除了耗时以外还会占用多少额外存储。",
        why: "很多优化不是白来的，常见做法是用额外内存换更快查询或更少重复计算。",
        concepts: [
          "空间复杂度关注输入之外额外占用的内存。",
          "缓存、索引和哈希表常用空间换时间。",
          "原地算法尽量在原容器上完成修改。",
          "递归会消耗调用栈空间。"
        ],
        example: "用 set 记录已见元素：查重更快，但需要额外存储 seen",
        practice: "比较两种查重方式：双重循环不额外存储；set 查重需要额外集合。",
        checkpoint: "能说明一个优化到底是在省时间、费内存，还是相反。"
      },
      {
        id: "algorithms",
        title: "线性查找、二分查找与前提条件",
        duration: 44,
        level: "算法",
        summary: "掌握最基础的查找方式，并牢记算法适用前提。",
        why: "算法不是背模板，关键是知道它依赖什么条件，什么时候会失效。",
        concepts: [
          "线性查找逐个检查元素，不要求数据有序。",
          "二分查找每次排除一半范围，但要求数据已有序并可按位置访问。",
          "循环不变量帮助确认 low、mid、high 的含义始终正确。",
          "空列表、单元素、目标不存在是必要测试。"
        ],
        example: "low / mid / high 不断缩小搜索范围，直到找到目标或范围为空",
        practice: "手写二分查找并测试空列表、一个元素、目标在开头、末尾和不存在。",
        checkpoint: "能说出二分查找不能直接用于无序列表的原因。"
      },
      {
        id: "sorting-stability",
        title: "排序算法与稳定性",
        duration: 42,
        level: "算法",
        summary: "理解排序的目标、常见取舍和稳定排序的意义。",
        why: "排序常作为其他算法的前置步骤，也常在用户界面和数据处理中出现。",
        concepts: [
          "排序把元素按比较规则重新排列。",
          "稳定排序会保留相等关键字元素原有相对顺序。",
          "选择、插入、归并、快速排序体现不同时间和空间取舍。",
          "Python `sorted()` 和 `list.sort()` 提供稳定排序。"
        ],
        example: "先按姓名排序，再按班级稳定排序，可保留同班级内姓名顺序",
        practice: "对学生记录分别按分数和姓名排序，观察稳定排序对相同分数的影响。",
        checkpoint: "能解释“稳定性”和“是否原地排序”不是同一个问题。"
      },
      {
        id: "recursion-call-stack",
        title: "递归、调用栈与终止条件",
        duration: 44,
        level: "算法",
        summary: "把问题缩小为同类子问题，并理解函数调用怎样层层返回。",
        why: "递归是树、分治、动态规划等思想的入口，但也最容易因为边界错误失控。",
        concepts: [
          "递归函数会调用自己处理更小规模的问题。",
          "每次调用都有自己的局部变量和返回位置。",
          "终止条件必须能覆盖最小问题。",
          "递归深度过大可能触发调用栈限制。"
        ],
        example: "factorial(4) = 4 × factorial(3)，直到 factorial(1) 返回 1",
        practice: "画出 factorial(4) 的调用和返回过程，再实现递归求和。",
        checkpoint: "能指出一个递归函数的递推关系和终止条件。"
      },
      {
        id: "divide-and-conquer",
        title: "分治思想",
        duration: 38,
        level: "算法",
        summary: "把大问题拆成相似小问题，分别解决后合并结果。",
        why: "分治是归并排序、二分查找和许多高效算法的共同骨架。",
        concepts: [
          "分治通常包含拆分、解决子问题、合并结果三步。",
          "子问题结构应与原问题相似。",
          "拆分是否均衡会影响复杂度。",
          "合并成本也必须计入整体算法。"
        ],
        example: "归并排序：拆成左右两半 → 分别排序 → 合并两个有序列表",
        practice: "用纸牌模拟归并排序，记录每次拆分和合并。",
        checkpoint: "能区分“拆任务清单”和真正的分治算法。"
      },
      {
        id: "tree-traversal",
        title: "树、二叉树与遍历",
        duration: 46,
        level: "算法",
        summary: "学习层级结构，以及深度优先和广度优先遍历。",
        why: "文件夹、HTML DOM、组织架构和语法结构都天然呈树形。",
        concepts: [
          "树由节点和边组成，有根、父节点、子节点和叶子节点。",
          "二叉树中每个节点最多有两个子节点。",
          "DFS 深度优先常配合递归或栈。",
          "BFS 广度优先常配合队列。"
        ],
        example: "文件夹树：项目根目录 → src / tests / README.md",
        practice: "画出一个目录树，并分别写出前序 DFS 和按层 BFS 的访问顺序。",
        checkpoint: "能说明 DFS 和 BFS 的访问顺序差异。"
      },
      {
        id: "heap-priority-queue",
        title: "堆与优先队列",
        duration: 40,
        level: "算法",
        summary: "用堆快速取得当前最小或最大优先级元素。",
        why: "调度、排行榜、最短路径和 Top K 问题都常用优先队列。",
        concepts: [
          "堆是一种满足父子节点优先级关系的树形结构。",
          "优先队列按优先级取出元素，而不是按进入顺序。",
          "Python `heapq` 提供最小堆操作。",
          "插入和取最小值通常是 O(log n)。"
        ],
        example: "任务队列按截止时间排序：最早到期的任务先弹出",
        practice: "用 heapq 保存若干任务 `(deadline, name)`，不断弹出最早截止任务。",
        checkpoint: "能区分普通队列的 FIFO 和优先队列的按优先级出队。"
      },
      {
        id: "graph-traversal",
        title: "图、节点、边与遍历",
        duration: 48,
        level: "算法",
        summary: "认识更一般的关系结构，并用 BFS/DFS 避免重复访问。",
        why: "社交关系、网页链接、地图路线、依赖关系和网络拓扑都可以抽象成图。",
        concepts: [
          "图由节点和边组成，边可以有方向或权重。",
          "邻接表常用于保存每个节点连接到谁。",
          "遍历图时需要 visited 集合避免环导致无限循环。",
          "BFS 可用于无权图最短步数，DFS 适合连通性和路径探索。"
        ],
        example: "A: [B, C]\nB: [D]\nC: [D]\nvisited 防止重复访问 D",
        practice: "把 5 个网页链接画成图，用邻接表写出 BFS 访问顺序。",
        checkpoint: "能解释树是特殊图，而普通图可能有环。"
      },
      {
        id: "dynamic-programming",
        title: "动态规划入门",
        duration: 50,
        level: "算法",
        summary: "识别重复子问题，并保存中间结果减少重复计算。",
        why: "动态规划是从暴力搜索走向高效算法的重要思维训练。",
        concepts: [
          "动态规划适合存在重叠子问题和最优子结构的问题。",
          "memoization 自顶向下缓存递归结果。",
          "tabulation 自底向上填表。",
          "状态定义和转移关系比代码模板更重要。"
        ],
        example: "fib(n) = fib(n-1) + fib(n-2)，缓存后每个 n 只计算一次",
        practice: "先写普通递归 Fibonacci，再加入字典缓存并比较调用次数。",
        checkpoint: "能说出一个 DP 问题的状态、初始值和转移关系。"
      },
      {
        id: "algorithm-testing",
        title: "算法测试、边界用例与性能观察",
        duration: 42,
        level: "实践",
        summary: "用测试和测量确认算法正确性，而不是只凭样例通过。",
        why: "算法错误常藏在空输入、重复元素、边界位置和规模变化中。",
        concepts: [
          "测试应覆盖正常、边界和异常输入。",
          "排序后应检查顺序和元素是否丢失。",
          "查找算法要测试目标存在和不存在两类结果。",
          "性能观察可用 `timeit` 或计数器，但要避免只看一次偶然结果。"
        ],
        example: "二分查找测试：[]、[1]、[1, 3, 5]、目标 1/5/2",
        practice: "为二分查找和排序函数写 8 个测试用例，并记录最大输入下的运行时间。",
        checkpoint: "能列出一个算法至少 5 个必须测试的边界场景。"
      }
    ]
  },
  {
    id: 6,
    title: "Web 与数据库",
    subtitle: "页面、接口、SQL 与数据建模",
    color: "blue",
    lessons: [
      {
        id: "web-basics",
        title: "HTML 文档结构与语义化",
        duration: 38,
        level: "Web",
        summary: "用正确的元素表达页面内容结构，而不是只堆文字和盒子。",
        why: "HTML 是网页的内容骨架，语义清楚会影响可访问性、搜索理解和后续样式维护。",
        concepts: [
          "HTML 由元素、属性和嵌套结构组成。",
          "标题、段落、列表、链接、图片和表格都有各自语义。",
          "语义化元素如 header、main、nav、section、article、footer 描述页面区域。",
          "浏览器会把 HTML 解析成 DOM 树。"
        ],
        example: "<main>\n  <h1>课程列表</h1>\n  <article>阶段 0：电脑使用基础</article>\n</main>",
        practice: "写一个课程介绍页面，只使用语义清楚的 HTML，不写任何 CSS。",
        checkpoint: "能解释为什么不能把所有内容都写成 div。"
      },
      {
        id: "css-box-layout",
        title: "CSS 选择器、盒模型与层叠",
        duration: 42,
        level: "Web",
        summary: "理解样式怎样选中元素，以及尺寸、边距和优先级怎样计算。",
        why: "CSS 问题多数来自选错元素、盒模型误判或层叠优先级不清楚。",
        concepts: [
          "选择器决定样式应用到哪些元素。",
          "盒模型包含 content、padding、border 和 margin。",
          "层叠根据来源、重要性、选择器权重和顺序决定最终样式。",
          "`box-sizing: border-box` 常用于降低布局尺寸计算复杂度。"
        ],
        example: ".card {\n  box-sizing: border-box;\n  padding: 16px;\n  border: 1px solid #ddd;\n}",
        practice: "创建三张卡片，分别修改 padding、border 和 margin，观察占用空间变化。",
        checkpoint: "能说明元素实际占宽为什么可能大于 width。"
      },
      {
        id: "css-layout-responsive",
        title: "Flex、Grid 与响应式布局",
        duration: 46,
        level: "Web",
        summary: "用现代布局能力处理横向排列、二维网格和不同屏幕宽度。",
        why: "真实页面必须在桌面、平板和手机上都能阅读和操作。",
        concepts: [
          "Flexbox 适合一维排列和对齐。",
          "Grid 适合二维区域和规则卡片网格。",
          "媒体查询根据视口条件切换样式。",
          "响应式布局应避免页面级横向滚动。"
        ],
        example: ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n}",
        practice: "把课程卡片做成桌面三列、手机一列，并检查 390px 宽度下是否溢出。",
        checkpoint: "能判断一个布局问题更适合 Flex 还是 Grid。"
      },
      {
        id: "javascript-dom",
        title: "JavaScript、DOM 查询与页面更新",
        duration: 44,
        level: "Web",
        summary: "用 JavaScript 读取页面元素、修改内容和维护简单状态。",
        why: "交互页面的核心是状态变化后，把正确结果同步到 DOM。",
        concepts: [
          "JavaScript 负责页面行为和数据处理。",
          "`querySelector`、`textContent`、`classList` 是常见 DOM 操作入口。",
          "状态是页面当前事实，视图是状态的显示结果。",
          "直接拼接 HTML 时要注意输入来源和安全边界。"
        ],
        example: "const title = document.querySelector('h1');\ntitle.textContent = '已开始学习';",
        practice: "做一个按钮，点击后切换课程卡片的完成状态和文案。",
        checkpoint: "能区分修改数据状态和修改页面显示。"
      },
      {
        id: "events-state",
        title: "事件、表单与输入校验",
        duration: 46,
        level: "Web",
        summary: "响应用户点击、输入和提交，并在前端做基础校验。",
        why: "用户输入是不确定的，前端需要提供即时反馈，但不能替代后端校验。",
        concepts: [
          "事件监听器接收用户操作或浏览器状态变化。",
          "表单控件有 name、value、required、type 等关键属性。",
          "前端校验提升体验，后端校验保证可信边界。",
          "错误提示应明确告诉用户哪里错、怎么改。"
        ],
        example: "form.addEventListener('submit', (event) => {\n  event.preventDefault();\n});",
        practice: "制作报名表单，要求课程名不能为空、邮箱格式正确，并显示中文错误提示。",
        checkpoint: "能说明为什么只靠前端校验不安全。"
      },
      {
        id: "accessibility-basics",
        title: "可访问性、键盘操作与基础 UX",
        duration: 38,
        level: "Web",
        summary: "让页面能被键盘、屏幕阅读器和不同使用场景的人操作。",
        why: "可访问性不是额外装饰，它直接影响网页是否真正可用。",
        concepts: [
          "按钮、链接、输入框应使用合适的原生元素。",
          "交互元素需要清楚的焦点状态。",
          "图片应根据用途决定 alt 文本。",
          "颜色不能作为传达状态的唯一方式。"
        ],
        example: "<button type=\"button\" aria-expanded=\"false\">打开目录</button>",
        practice: "不用鼠标，只用 Tab、Enter 和 Esc 操作一个页面，记录卡住的位置。",
        checkpoint: "能指出一个页面至少三个可访问性风险。"
      },
      {
        id: "client-server",
        title: "客户端、服务器、URL 与 HTTP",
        duration: 42,
        level: "Web",
        summary: "把浏览器访问页面拆成地址、请求、响应和资源加载。",
        why: "Web 应用不是一个文件在运行，而是客户端和服务器按协议交换资源。",
        concepts: [
          "客户端发起请求，服务器返回响应。",
          "URL 描述协议、主机、端口、路径和查询参数。",
          "HTTP 方法表达操作意图，常见有 GET、POST、PUT、PATCH、DELETE。",
          "状态码用三位数字表达请求结果类别。"
        ],
        example: "GET /api/courses?page=1 HTTP/1.1\nHost: example.com\n\nHTTP/1.1 200 OK",
        practice: "打开一个网页，记录主文档 URL，并拆出协议、域名、路径和查询参数。",
        checkpoint: "能区分网页地址、资源地址和接口地址。"
      },
      {
        id: "api-json-fetch",
        title: "API、JSON 与 Fetch",
        duration: 48,
        level: "Web",
        summary: "用约定好的接口交换结构化数据，并在页面中处理结果。",
        why: "现代 Web 常通过 API 获取数据，而不是每次都整页刷新。",
        concepts: [
          "API 是前端与后端之间的调用约定。",
          "JSON 用对象、数组、字符串、数字、布尔值和 null 表达数据。",
          "Fetch API 返回 Promise，需要处理成功、失败和解析步骤。",
          "接口字段名、类型和错误格式应稳定。"
        ],
        example: "fetch('/api/courses')\n  .then((res) => res.json())\n  .then((data) => render(data));",
        practice: "读取一个公开 JSON 响应，列出 URL、方法、状态码、字段和异常情况。",
        checkpoint: "能解释 HTTP 成功不等于业务一定成功。"
      },
      {
        id: "devtools-network",
        title: "浏览器 DevTools 与 Network 面板",
        duration: 40,
        level: "调试",
        summary: "用浏览器开发者工具观察页面资源、接口、状态码和耗时。",
        why: "Web 问题不能只看页面表面，Network 面板能直接看到请求链路证据。",
        concepts: [
          "Network 面板记录文档、样式、脚本、图片和 Fetch/XHR 请求。",
          "Headers 显示 URL、方法、状态码、请求头和响应头。",
          "Preview/Response 可查看返回内容。",
          "Timing 能帮助判断慢在 DNS、连接、等待还是下载。"
        ],
        example: "刷新页面 → 找到 /api/courses → 查看 Status、Headers、Response",
        practice: "打开任意网页，找出一个 HTML、一个 CSS、一个 JS 和一个接口请求。",
        checkpoint: "能用 Network 证据说明请求是否真的发出、服务器返回了什么。"
      },
      {
        id: "browser-storage-security",
        title: "同源策略、CORS 与浏览器存储",
        duration: 46,
        level: "Web",
        summary: "理解浏览器为什么限制跨站访问，以及本地数据能存什么、不能存什么。",
        why: "浏览器安全模型决定前端代码能访问哪些资源，也决定隐私数据的边界。",
        concepts: [
          "同源由协议、主机和端口共同决定。",
          "CORS 是服务器声明允许哪些跨源请求的机制。",
          "localStorage 适合保存非敏感的小型本地状态。",
          "不要把密码、token、私钥等敏感信息硬编码或明文存入前端。"
        ],
        example: "https://a.example 与 https://b.example 不同源；http 与 https 也不同源",
        practice: "比较两个 URL 是否同源，并在测试页面保存和读取一条 localStorage 记录。",
        checkpoint: "能解释跨域报错不是“浏览器坏了”，而是安全策略在生效。"
      },
      {
        id: "backend-routing",
        title: "后端路由、请求处理与 MVC 分层",
        duration: 42,
        level: "后端",
        summary: "认识服务器怎样把 URL 和方法映射到处理逻辑。",
        why: "即使先做静态网站，也要理解真实应用如何在服务器侧处理业务和数据。",
        concepts: [
          "路由把 HTTP 方法和路径映射到处理函数。",
          "请求处理通常包含参数读取、校验、业务逻辑、数据访问和响应。",
          "MVC 或类似分层把界面、业务和数据职责拆开。",
          "后端需要统一处理错误和返回格式。"
        ],
        example: "GET /courses → 查询课程列表\nPOST /courses → 校验输入并创建课程",
        practice: "为课程系统设计 5 个 API 路由，写出方法、路径、输入和输出。",
        checkpoint: "能区分路由、业务逻辑和数据库访问。"
      },
      {
        id: "sql",
        title: "关系模型、表、主键与外键",
        duration: 46,
        level: "数据",
        summary: "用表、行、列和关系组织结构化数据。",
        why: "数据库设计是否清楚，会直接影响查询、约束和后续功能扩展。",
        concepts: [
          "表描述一类实体或关系，行是一条记录，列是字段。",
          "主键唯一标识一行记录。",
          "外键表达表之间的引用关系。",
          "约束用于让非法数据尽早被拒绝。"
        ],
        example: "students(id, name)\ncourses(id, title)\nenrollments(student_id, course_id)",
        practice: "为课程、阶段和学习记录画出三张表，并标出主键与外键。",
        checkpoint: "能解释主键和外键分别解决什么问题。"
      },
      {
        id: "sql-query-join",
        title: "SQL 查询、过滤、排序与 JOIN",
        duration: 50,
        level: "数据",
        summary: "用 SQL 从表中取出需要的数据，并连接多张表。",
        why: "应用的大部分数据展示，本质都是把存储数据查询、过滤、排序和组合出来。",
        concepts: [
          "SELECT 指定要返回的列。",
          "WHERE 过滤记录，ORDER BY 排序，LIMIT 限制数量。",
          "JOIN 根据关联条件组合多张表的数据。",
          "聚合函数和 GROUP BY 可按分组统计。"
        ],
        example: "SELECT s.name, c.title\nFROM enrollments e\nJOIN students s ON s.id = e.student_id\nJOIN courses c ON c.id = e.course_id;",
        practice: "用 SQLite 建立学生、课程、报名表，查询每个学生报名的课程标题。",
        checkpoint: "能说出 WHERE 和 JOIN 条件分别在控制什么。"
      },
      {
        id: "schema-design-normalization",
        title: "数据建模、范式与迁移",
        duration: 44,
        level: "数据",
        summary: "把真实业务拆成表结构，并控制重复、冗余和结构变更。",
        why: "数据库不是随手建表；结构设计会影响一致性、维护和查询复杂度。",
        concepts: [
          "实体、属性和关系是建模的基本对象。",
          "范式用于减少不必要重复和更新异常。",
          "反规范化有时用于性能，但应有明确原因。",
          "迁移记录数据库结构如何从一个版本变化到下一个版本。"
        ],
        example: "不要在 lessons 表重复保存 stage_name；保存 stage_id，再关联 stages 表",
        practice: "把一个 Excel 学习记录表拆成 3 张关系表，并说明为什么这样拆。",
        checkpoint: "能指出一个表里哪些字段可能造成重复和更新异常。"
      },
      {
        id: "transactions-indexes",
        title: "事务、索引与查询计划",
        duration: 50,
        level: "数据",
        summary: "理解一组修改为何要共同成功，以及查询为何需要索引。",
        why: "数据系统不仅要能存，还要在并发、故障和大量数据下保持正确与可用。",
        concepts: [
          "事务把一组相关修改作为整体提交或回滚。",
          "ACID 描述原子性、一致性、隔离性和持久性。",
          "索引用额外空间提高特定查询速度，但会增加写入维护成本。",
          "查询计划显示数据库准备怎样执行查询。"
        ],
        example: "转账：扣款与入账必须共同提交，否则共同回滚\nCREATE INDEX idx_lessons_stage ON lessons(stage_id);",
        practice: "设计课程报名事务，并为按 stage_id 查询课程的语句添加索引。",
        checkpoint: "能说明事务、备份和索引解决的是三类不同问题。"
      },
      {
        id: "web-db-project",
        title: "Web + 数据库小项目闭环",
        duration: 54,
        level: "项目",
        summary: "把页面、API、数据库和调试方法串成一个可运行小系统。",
        why: "阶段 6 的目标不是背概念，而是能解释一条数据从输入到存储再到显示的完整链路。",
        concepts: [
          "页面负责输入与展示，API 负责约定，后端负责业务，数据库负责持久化。",
          "每个接口都应定义输入、输出、错误和权限边界。",
          "调试时先确认前端事件，再看 Network 请求，再看后端日志和数据库记录。",
          "README 应写清运行方式、数据表、接口和已知限制。"
        ],
        example: "新增课程：表单提交 → POST /courses → INSERT INTO courses → 返回 JSON → 页面刷新列表",
        practice: "设计一个课程收藏小项目，写出页面草图、API 表、数据库表和验收用例。",
        checkpoint: "能沿着一次新增数据操作说清前端、后端和数据库各自做了什么。"
      }
    ]
  },
  {
    id: 7,
    title: "计算机系统原理",
    subtitle: "CPU、内存、操作系统与并发",
    color: "coral",
    lessons: [
      {
        id: "binary-logic",
        title: "二进制、十六进制与位运算",
        duration: 42,
        level: "底层",
        summary: "从 bit、进制转换和位运算进入计算机内部表示。",
        why: "计算机硬件最终处理的是固定宽度的 0/1，十六进制只是更紧凑的人类阅读方式。",
        concepts: [
          "二进制使用 0 和 1 表示数值。",
          "十六进制每一位正好对应 4 个 bit，常用于地址和机器码显示。",
          "AND、OR、XOR、NOT、左移、右移是常见位运算。",
          "固定宽度决定了能表示的范围。"
        ],
        example: "00000101₂ = 5₁₀ = 0x05\n00000101 AND 00000011 = 00000001",
        practice: "手工完成 0 到 31 的二进制与十六进制转换，并计算 5 AND 3、5 OR 3、5 XOR 3。",
        checkpoint: "能解释 0xFF 为什么等于 255。"
      },
      {
        id: "integer-representation",
        title: "整数表示、补码与溢出",
        duration: 44,
        level: "底层",
        summary: "理解同一串 bit 怎样被解释为无符号数或有符号数。",
        why: "很多底层 bug、安全问题和语言边界都来自固定宽度整数和溢出。",
        concepts: [
          "无符号整数只表示非负数。",
          "补码是现代计算机常用的有符号整数表示方式。",
          "同一组 bit 在不同解释规则下可能得到不同数值。",
          "溢出表示计算结果超出当前位宽可表达范围。"
        ],
        example: "8 位无符号 11111111 = 255\n8 位补码 11111111 = -1",
        practice: "写出 8 位补码下 -1、-2、127、-128 的 bit 形式。",
        checkpoint: "能解释为什么 8 位有符号整数范围通常是 -128 到 127。"
      },
      {
        id: "boolean-circuits",
        title: "布尔逻辑、门电路与组合电路",
        duration: 38,
        level: "硬件",
        summary: "用逻辑门理解硬件如何把 bit 变成计算结果。",
        why: "CPU 再复杂，也建立在逻辑门、加法器和组合/时序电路之上。",
        concepts: [
          "布尔值只有真和假，对应硬件中的两种稳定状态。",
          "与、或、非、异或可组成更复杂逻辑。",
          "组合电路输出只由当前输入决定。",
          "加法器可以由逻辑门组合出来。"
        ],
        example: "半加器：sum = A XOR B，carry = A AND B",
        practice: "画出半加器真值表，并手算四种输入的 sum 与 carry。",
        checkpoint: "能说明“软件加法”最终依赖硬件电路完成。"
      },
      {
        id: "machine-code-assembly",
        title: "机器码、汇编与指令集",
        duration: 46,
        level: "底层",
        summary: "认识高级语言最终会落到 CPU 能执行的指令形式。",
        why: "理解指令集可以把代码、编译、调试和逆向分析连接起来。",
        concepts: [
          "机器码是 CPU 直接执行的二进制指令。",
          "汇编是机器指令的人类可读表示。",
          "指令集规定 CPU 支持哪些操作、寄存器和寻址方式。",
          "不同架构的指令集不同，例如 x86-64、ARM、RISC-V。"
        ],
        example: "add x1, x2, x3 约等于：把 x2 和 x3 相加，结果放入 x1",
        practice: "查看一个最小 C 程序或 Python 字节码示例，标出“源代码”和“低层指令表示”的差异。",
        checkpoint: "能解释汇编不是另一种高级语言，而是贴近机器指令的表示。"
      },
      {
        id: "cpu-instructions",
        title: "CPU、寄存器与取指执行循环",
        duration: 48,
        level: "底层",
        summary: "理解取指、译码、执行以及寄存器的角色。",
        why: "程序运行不是魔法，而是 CPU 按程序计数器一步步取出并执行指令。",
        concepts: [
          "指令通常存放在内存中。",
          "程序计数器记录下一条要执行的指令位置。",
          "寄存器是 CPU 内部的高速存储。",
          "取指、译码、执行、写回构成基本执行循环。"
        ],
        example: "PC 指向指令地址 → 取指 → 译码 → 读取寄存器 → 执行加法 → 写回寄存器 → PC 更新",
        practice: "画出一条加法指令从内存到寄存器再到结果写回的流程。",
        checkpoint: "能描述一条加法指令涉及的数据流。"
      },
      {
        id: "memory-hierarchy-cache",
        title: "内存层级、缓存与局部性",
        duration: 44,
        level: "底层",
        summary: "理解寄存器、缓存、内存和磁盘为什么速度差异巨大。",
        why: "性能优化常常不是少写一行代码，而是让数据更符合内存层级的访问规律。",
        concepts: [
          "寄存器最快但容量最小。",
          "CPU Cache 用来保存近期可能再次访问的数据。",
          "时间局部性表示刚访问过的数据可能很快再次访问。",
          "空间局部性表示相邻数据可能很快被访问。"
        ],
        example: "连续遍历数组通常比随机访问大量对象更容易命中缓存",
        practice: "比较顺序读取列表和随机读取列表的访问模式，说明哪一种更有空间局部性。",
        checkpoint: "能解释为什么“内存里”也不等于同样快。"
      },
      {
        id: "memory",
        title: "栈、运行时堆、地址与生命周期",
        duration: 50,
        level: "底层",
        summary: "理解程序怎样组织函数调用、局部变量和动态分配数据。",
        why: "内存错误、性能和安全问题都依赖对地址空间和生命周期的理解。",
        concepts: [
          "栈常保存函数调用帧、返回地址和局部变量。",
          "运行时堆用于动态分配生命周期不固定的数据。",
          "指针或引用本质上指向某个对象或内存位置。",
          "生命周期决定数据什么时候有效、什么时候不该再访问。"
        ],
        example: "调用函数 → 新建栈帧 → 局部变量存在于当前调用期间 → 函数返回后栈帧释放",
        practice: "画出 main 调用 helper 时的栈帧变化，并标出局部变量生命周期。",
        checkpoint: "能区分变量的值、地址和生命周期。"
      },
      {
        id: "virtual-memory",
        title: "虚拟地址空间、页表与缺页",
        duration: 52,
        level: "操作系统",
        summary: "理解每个进程为什么像是拥有自己的连续内存。",
        why: "虚拟内存提供隔离、保护和更灵活的内存管理，是现代操作系统的核心机制。",
        concepts: [
          "每个进程通常看到自己的虚拟地址空间。",
          "页表把虚拟页映射到物理内存页或其他后备存储。",
          "缺页表示访问的页当前不可用，需要操作系统介入处理。",
          "地址空间隔离能减少进程互相破坏。"
        ],
        example: "进程虚拟地址 0x400000 → 页表转换 → 物理页框 → 实际内存",
        practice: "用图画出两个进程各自虚拟地址相同，但映射到不同物理页的情况。",
        checkpoint: "能解释虚拟地址和物理地址不是同一个概念。"
      },
      {
        id: "kernel-user-mode",
        title: "内核态、用户态与保护边界",
        duration: 42,
        level: "操作系统",
        summary: "理解普通程序为什么不能直接随意操作硬件和内核数据。",
        why: "操作系统必须在可用性和安全之间建立边界，防止一个程序破坏整个系统。",
        concepts: [
          "用户态运行普通应用程序。",
          "内核态运行操作系统核心代码，权限更高。",
          "CPU 权限级别和内存保护共同限制程序能做什么。",
          "越过边界需要通过受控入口。"
        ],
        example: "应用想读文件 → 不能直接控制磁盘 → 通过系统调用请求内核完成",
        practice: "列出浏览器、驱动、内核、普通脚本分别更接近用户态还是内核态。",
        checkpoint: "能说明为什么普通程序崩溃通常不应该拖垮整个系统。"
      },
      {
        id: "system-calls",
        title: "系统调用、异常与中断",
        duration: 48,
        level: "操作系统",
        summary: "认识程序请求内核服务，以及硬件事件如何打断 CPU 当前执行。",
        why: "文件、网络、进程和时间等资源最终都要通过操作系统受控访问。",
        concepts: [
          "系统调用是用户程序请求内核服务的入口。",
          "异常通常由当前指令执行中的特殊情况触发。",
          "中断常由外部设备或定时器触发。",
          "陷入内核后，系统保存现场、处理事件，再返回或调度其他任务。"
        ],
        example: "read(fd, buffer, size) → 进入内核 → 检查权限与文件状态 → 拷贝数据 → 返回结果",
        practice: "为“读取一个文件”画出应用、系统调用、文件系统、磁盘之间的调用链。",
        checkpoint: "能区分系统调用、异常和中断的触发来源。"
      },
      {
        id: "process-lifecycle",
        title: "进程、可执行文件与上下文切换",
        duration: 46,
        level: "操作系统",
        summary: "理解程序从文件变成运行中进程，以及 CPU 如何在进程间切换。",
        why: "任务管理器里看到的进程不是静态文件，而是一组正在被系统管理的资源。",
        concepts: [
          "可执行文件保存代码和元数据。",
          "进程是程序的一次运行实例，拥有地址空间、句柄和执行状态。",
          "上下文包含寄存器、程序计数器、栈等运行现场。",
          "上下文切换让一个 CPU 在多个任务之间轮流执行。"
        ],
        example: "双击程序 → 加载可执行文件 → 建立地址空间 → 创建主线程 → 进入调度队列",
        practice: "打开任务管理器，选择一个进程，记录 PID、CPU、内存和线程数量，只观察不结束。",
        checkpoint: "能解释程序文件、进程和线程三者区别。"
      },
      {
        id: "threads-scheduling",
        title: "线程、调度与时间片",
        duration: 44,
        level: "操作系统",
        summary: "理解线程作为 CPU 调度单位，以及并发任务怎样轮流运行。",
        why: "系统流畅度取决于调度、优先级、阻塞和资源竞争，而不是单纯“CPU 越高越好”。",
        concepts: [
          "线程是进程内部可被调度执行的工作单元。",
          "调度器决定哪个线程下一步使用 CPU。",
          "时间片让多个可运行线程轮流推进。",
          "阻塞状态表示线程在等待 I/O、锁或其他事件。"
        ],
        example: "浏览器主进程、渲染线程、网络线程同时存在，但由系统调度执行",
        practice: "观察一个多标签浏览器的进程和线程数量，记录 CPU 占用变化。",
        checkpoint: "能解释并发不等于一定在同一瞬间并行。"
      },
      {
        id: "os-concurrency",
        title: "并发、竞态条件、锁与死锁",
        duration: 54,
        level: "操作系统",
        summary: "理解多个执行流共享数据时为什么会出现不稳定结果。",
        why: "并发 bug 往往不是每次复现，但一旦出现在核心系统里影响很大。",
        concepts: [
          "竞态条件来自多个执行流以不可控顺序访问共享状态。",
          "锁用于把关键区保护成同一时间只能一个执行流进入。",
          "死锁常见于多个任务互相等待对方持有的资源。",
          "消息传递和不可变数据也可以降低共享状态风险。"
        ],
        example: "两个线程同时执行 count = count + 1，读写交错可能导致一次更新丢失",
        practice: "写出两个任务争用文件写入的时序图，再说明如何用锁或队列协调。",
        checkpoint: "能指出一个并发场景中的共享资源和关键区。"
      },
      {
        id: "io-drivers",
        title: "I/O 设备、驱动与缓冲",
        duration: 42,
        level: "操作系统",
        summary: "理解键盘、磁盘、网卡等设备如何与操作系统协作。",
        why: "程序读写文件、网络和外设时，背后都有设备、驱动、缓冲和中断参与。",
        concepts: [
          "驱动是操作系统和硬件设备之间的软件接口。",
          "缓冲区用于平衡 CPU、内存和设备速度差异。",
          "异步 I/O 允许程序发起操作后等待完成通知。",
          "设备错误需要通过状态码、日志或事件暴露。"
        ],
        example: "键盘按下 → 设备产生中断 → 驱动处理 → 操作系统交给前台应用",
        practice: "用设备管理器查看一个设备的驱动信息，只记录设备类别、提供者和版本。",
        checkpoint: "能说明驱动、设备和应用程序分别负责什么。"
      },
      {
        id: "filesystem-storage",
        title: "文件系统、块存储与缓存一致性",
        duration: 46,
        level: "操作系统",
        summary: "理解文件名、目录、权限和磁盘块如何连接起来。",
        why: "文件系统让程序用路径访问数据，但底层还要处理块、元数据、缓存和故障恢复。",
        concepts: [
          "文件系统管理文件内容、目录结构和元数据。",
          "磁盘或 SSD 通常按块读写。",
          "操作系统可能缓存文件数据以提升性能。",
          "崩溃恢复和日志机制用于减少突然断电后的损坏。"
        ],
        example: "D:\\notes\\a.txt → 目录项 → 文件元数据 → 数据块 → 存储设备",
        practice: "选择一个文件，记录路径、大小、创建/修改时间和权限，只观察不修改。",
        checkpoint: "能解释路径名不是文件内容本身，而是找到内容的入口。"
      },
      {
        id: "system-observability",
        title: "系统观察、性能瓶颈与最小复现",
        duration: 48,
        level: "实践",
        summary: "用证据判断程序慢、卡、崩或占资源的原因。",
        why: "系统问题需要观察链路：CPU、内存、磁盘、网络、进程、日志和复现步骤。",
        concepts: [
          "CPU 高可能表示计算繁忙，也可能是死循环。",
          "内存持续增长可能表示缓存增长或泄漏。",
          "磁盘和网络等待会让程序看起来像“卡住”。",
          "最小复现能把问题从复杂环境中拆出来。"
        ],
        example: "现象：程序卡顿 → 任务管理器看 CPU/内存/磁盘 → 事件查看器看错误 → 缩小复现步骤",
        practice: "设计一张系统问题排查记录表，包含现象、时间、进程、资源占用、日志和复现步骤。",
        checkpoint: "能用观察证据支持一个性能或崩溃判断。"
      }
    ]
  },
  {
    id: 8,
    title: "软件工程",
    subtitle: "Git、测试、日志、部署与协作",
    color: "green",
    lessons: [
      {
        id: "git",
        title: "Git 工作区、暂存区与提交",
        duration: 40,
        level: "工程",
        summary: "用版本控制记录有意义的变化，让项目可以追踪、比较和恢复。",
        why: "工程不是只写代码，还要知道每次改动从哪里来、解决什么问题、能否回退。",
        concepts: [
          "工作区保存当前文件状态。",
          "暂存区记录准备进入下一次提交的改动。",
          "提交是仓库历史中的一个快照和说明。",
          "提交信息应说明为什么改，而不只是改了什么。"
        ],
        example: "修改文件 → git diff → git add → git commit → 形成可追踪历史",
        practice: "为练习项目建立仓库，完成三个职责单一的提交，并写清提交信息。",
        checkpoint: "能解释 working tree、index、commit 三者区别。"
      },
      {
        id: "branching-merging",
        title: "分支、合并、冲突与回滚",
        duration: 46,
        level: "工程",
        summary: "在不破坏主线的情况下开发功能，并处理多人或多任务改动碰撞。",
        why: "分支让实验和功能开发隔离；冲突处理和回滚能力决定项目是否可控。",
        concepts: [
          "分支是指向某个提交历史位置的可移动引用。",
          "合并把不同分支的改动整合到一起。",
          "冲突表示同一位置的改动需要人工判断。",
          "回滚应优先理解影响范围，再选择 revert、restore 或 reset。"
        ],
        example: "main 稳定发布\nfeature/search 开发搜索\nmerge 时 README 同一行冲突 → 人工选择结果",
        practice: "创建 feature 分支，分别修改同一文件两处内容，合并后观察是否产生冲突。",
        checkpoint: "能说明 revert 和 reset 的风险差异。"
      },
      {
        id: "remote-pr-review",
        title: "远程仓库、Pull Request 与 Code Review",
        duration: 44,
        level: "协作",
        summary: "把本地历史同步到远程，并通过评审保护主分支质量。",
        why: "团队协作需要公开讨论改动、保留证据，并在合并前发现问题。",
        concepts: [
          "远程仓库用于共享提交历史。",
          "push 上传本地提交，pull/fetch 获取远程变化。",
          "Pull Request 把一组改动提交给他人评审和合并。",
          "Code Review 重点看正确性、可维护性、安全和测试覆盖。"
        ],
        example: "feature 分支 push → 创建 PR → 自动检查通过 → reviewer 留意见 → 修改后合并",
        practice: "为一个假想修复写 PR 描述：问题、方案、测试、风险和截图。",
        checkpoint: "能区分 commit、branch、remote 和 PR。"
      },
      {
        id: "project-readme",
        title: "项目结构、README 与开发约定",
        duration: 40,
        level: "工程",
        summary: "让别人能找到入口、运行项目、理解目录和限制。",
        why: "没有文档的项目会把知识藏在作者脑子里，后续维护成本很高。",
        concepts: [
          "目录结构应按职责组织，而不是按随手创建顺序堆放。",
          "README 至少说明功能、技术栈、安装、运行、测试和已知问题。",
          "示例输入输出能降低使用门槛。",
          "约定文件命名、提交规则和检查命令能减少协作摩擦。"
        ],
        example: "src/ 业务代码\ntests/ 测试\nREADME.md 运行说明\nCHANGELOG.md 版本变化",
        practice: "为当前学习网站写一份三分钟可读的 README 目录草稿。",
        checkpoint: "新同学能按 README 在干净目录里运行项目。"
      },
      {
        id: "testing-logging",
        title: "测试分层、断言与回归保护",
        duration: 48,
        level: "工程",
        summary: "用自动化测试确认代码符合预期，并防止修复旧问题时引入新问题。",
        why: "人肉点页面无法覆盖所有路径；自动测试能让修改后的风险更可见。",
        concepts: [
          "单元测试验证小范围函数或模块行为。",
          "集成测试验证多个模块协作是否正确。",
          "端到端测试从用户视角验证完整流程。",
          "回归测试用于防止已经修复的问题再次出现。"
        ],
        example: "输入：无扩展名文件\n预期：返回空扩展名而不是抛异常\n断言：parseName('README').ext === ''",
        practice: "给文件名解析函数补正常、无扩展名、隐藏文件、多个点四类测试。",
        checkpoint: "修改后所有旧测试仍通过，并新增对应测试。"
      },
      {
        id: "logging-errors",
        title: "日志、错误处理与可诊断性",
        duration: 44,
        level: "工程",
        summary: "让程序失败时留下足够证据，而不是只显示“出错了”。",
        why: "稳定的软件必须能回答：什么时候失败、在哪失败、输入是什么、影响范围多大。",
        concepts: [
          "日志应包含时间、级别、位置和必要上下文。",
          "错误要在能处理它的边界处理，不能到处吞掉。",
          "用户提示应清楚可行动，内部日志应保留排查证据。",
          "异常链和堆栈信息能帮助定位真实原因。"
        ],
        example: "ERROR importCourses failed file=lessons.csv reason=invalid_header row=1",
        practice: "为一个文件导入脚本设计 info、warning、error 三类日志示例。",
        checkpoint: "看到一条日志时，能判断是否足够复现和定位问题。"
      },
      {
        id: "architecture",
        title: "模块、接口与架构边界",
        duration: 46,
        level: "工程",
        summary: "按职责组织代码，让变化尽量局部发生。",
        why: "架构不是画图，而是决定数据、依赖和错误怎样流动。",
        concepts: [
          "模块应有明确职责。",
          "接口定义外部可以依赖的行为。",
          "高内聚让相关逻辑放在一起。",
          "低耦合减少一个模块变化对其他模块的影响。"
        ],
        example: "界面层 → 业务层 → 数据访问层 → 数据库",
        practice: "把一个脚本的输入输出、业务判断和文件访问拆成三个边界。",
        checkpoint: "新增一种存储方式时，不需要重写业务判断。"
      },
      {
        id: "code-quality-refactor",
        title: "代码风格、Lint、格式化与重构边界",
        duration: 42,
        level: "工程",
        summary: "用一致规则减少低级错误，并在不改变行为的前提下改善结构。",
        why: "工程质量来自可重复的检查，而不是每个人凭感觉维护。",
        concepts: [
          "格式化统一排版，降低无意义 diff。",
          "Lint 检查潜在 bug、坏味道和风格问题。",
          "重构应保持外部行为不变。",
          "大重构前需要测试或可复现验收保护。"
        ],
        example: "先跑测试确认当前行为 → 小步提取函数 → 再跑测试确认行为未变",
        practice: "找一个超过 40 行的函数，写出可安全拆分的步骤，但不一次性大改。",
        checkpoint: "能区分功能修改、格式化和重构。"
      },
      {
        id: "dependencies-versions",
        title: "依赖管理、版本约束与锁定文件",
        duration: 44,
        level: "工程",
        summary: "明确项目依赖哪些库、版本如何选择，以及如何复现安装环境。",
        why: "依赖漂移会导致“昨天能跑、今天不能跑”，也是安全和发布风险来源。",
        concepts: [
          "依赖清单记录项目需要哪些包。",
          "版本约束描述允许安装的版本范围。",
          "锁定文件记录一次可复现安装的精确版本。",
          "升级依赖需要查看变更、运行测试和记录风险。"
        ],
        example: "requirements.txt 描述依赖；package-lock.json / pnpm-lock.yaml 锁定实际安装版本",
        practice: "阅读一个项目的依赖文件，标出直接依赖、开发依赖和锁定文件。",
        checkpoint: "能解释为什么只写“安装最新版本”不利于复现。"
      },
      {
        id: "configuration-secrets",
        title: "配置、环境变量与敏感信息边界",
        duration: 42,
        level: "工程",
        summary: "把环境差异从代码里拆出来，同时保护密钥和账号信息。",
        why: "配置混在代码中会让开发、测试、生产相互污染；泄露密钥会造成真实风险。",
        concepts: [
          "配置描述环境差异，如端口、数据库地址和开关。",
          "环境变量常用于注入运行环境配置。",
          "密钥、token、cookie、私钥不应提交到仓库。",
          "示例配置应只提供字段名和假值。"
        ],
        example: ".env.example:\nAPI_BASE_URL=http://localhost:3000\nAPI_TOKEN=replace_me",
        practice: "为一个小 Web 项目设计 `.env.example`，并列出哪些字段不能提交真实值。",
        checkpoint: "能指出配置、代码和秘密三者的边界。"
      },
      {
        id: "ci-pipeline",
        title: "CI、自动化检查与质量门禁",
        duration: 46,
        level: "工程",
        summary: "让每次提交或合并前自动运行语法、测试和构建检查。",
        why: "自动化检查能把“我忘了跑测试”变成系统性可见问题。",
        concepts: [
          "CI 在代码变更后自动运行检查。",
          "常见步骤包括安装依赖、lint、test、build。",
          "质量门禁决定检查失败时是否允许合并。",
          "CI 结果应能定位失败命令和日志。"
        ],
        example: "push → GitHub Actions → npm ci → npm test → npm run build → 通过后允许合并",
        practice: "为静态网站写一份 CI 步骤清单：检查 JS 语法、扫描旧课程数、验证文件存在。",
        checkpoint: "能说明 CI 和本地测试分别解决什么问题。"
      },
      {
        id: "docker-containers",
        title: "Docker、镜像、容器与 Compose",
        duration: 48,
        level: "部署",
        summary: "用容器封装应用运行环境，减少跨机器差异。",
        why: "很多部署失败来自环境差异；容器让运行时依赖更明确。",
        concepts: [
          "镜像是可运行环境和应用文件的打包模板。",
          "容器是镜像运行起来的实例。",
          "Dockerfile 描述如何构建镜像。",
          "Compose 可用一个配置描述多服务本地环境。"
        ],
        example: "Dockerfile → docker build 生成镜像 → docker run 启动容器",
        practice: "阅读一个最小 Dockerfile，标出基础镜像、复制文件、安装依赖和启动命令。",
        checkpoint: "能解释镜像和容器不是同一个东西。"
      },
      {
        id: "deployment",
        title: "部署、健康检查与回滚",
        duration: 50,
        level: "部署",
        summary: "把本机可运行的程序稳定交付到其他环境。",
        why: "发布不是把文件传上去就结束，还要确认服务健康、日志可查、失败能退回。",
        concepts: [
          "部署前应明确构建产物、配置和启动命令。",
          "健康检查用于判断服务是否可用。",
          "灰度或分批发布能降低一次性影响范围。",
          "回滚方案要在发布前准备好。"
        ],
        example: "构建 → 上传产物 → 设置配置 → 启动服务 → 健康检查 → 监控 → 必要时回滚",
        practice: "为小项目写部署 checklist：前置检查、部署命令、验证命令、回滚步骤。",
        checkpoint: "另一台干净环境能按文档运行并验证项目。"
      },
      {
        id: "observability-monitoring",
        title: "监控、指标、日志与追踪",
        duration: 46,
        level: "运维",
        summary: "上线后用证据观察系统是否健康，而不是等用户反馈。",
        why: "软件交付后的真实状态需要持续观察，尤其是错误率、延迟和资源占用。",
        concepts: [
          "日志记录离散事件和上下文。",
          "指标记录可聚合的数值，如请求数、错误率、延迟。",
          "追踪展示一次请求跨服务的路径。",
          "告警应对应可行动的问题，而不是制造噪音。"
        ],
        example: "请求变慢 → 指标显示 P95 延迟升高 → 日志显示数据库超时 → 追踪定位慢查询",
        practice: "为课程 API 设计 5 个需要监控的指标和 3 条关键日志。",
        checkpoint: "能区分日志、指标和追踪分别回答什么问题。"
      },
      {
        id: "security-release",
        title: "安全基线、依赖风险与发布边界",
        duration: 44,
        level: "工程",
        summary: "在交付前检查敏感信息、依赖风险和公开范围。",
        why: "工程交付不仅要能运行，还要避免把密钥、私有数据和高风险配置一起发布出去。",
        concepts: [
          "发布前应扫描密钥、token、cookie 和私钥。",
          "依赖漏洞需要结合影响范围和可用修复评估。",
          "调试开关、测试账号和本地路径不应出现在公开产物中。",
          "公开版本要与私有数据、样本和日志分离。"
        ],
        example: "发布前检查：.env 未提交、测试数据脱敏、依赖扫描通过、README 无私人路径",
        practice: "为 GitHub 上传版项目写一份安全发布 checklist。",
        checkpoint: "能列出至少 5 类不能公开提交的信息。"
      },
      {
        id: "delivery-retrospective",
        title: "交付验收、变更记录与复盘",
        duration: 42,
        level: "工程",
        summary: "把一次开发收束成可验收、可追踪、可复盘的交付结果。",
        why: "做完不等于交付；交付需要证明需求满足、风险已知、下一步清楚。",
        concepts: [
          "验收标准要对应用户目标和可观察结果。",
          "变更记录说明本次新增、修复、调整和破坏性变化。",
          "复盘记录关键判断、问题、证据和改进。",
          "下一步规划应区分 P0、P1 和长期优化。"
        ],
        example: "完成内容 → 修改文件 → 验证命令 → 未验证风险 → 下一步优先级",
        practice: "为本学习网站本轮阶段扩展写一份交付摘要和复盘清单。",
        checkpoint: "别人能根据交付记录知道改了什么、如何验证、还剩什么。"
      }
    ]
  },
  {
    id: 9,
    title: "专业方向选择",
    subtitle: "Web、AI、安全、嵌入式与云",
    color: "blue",
    lessons: [
      {
        id: "direction-decision",
        title: "方向选择方法：兴趣、能力、市场与证据",
        duration: 34,
        level: "方向",
        summary: "建立一套不靠热度、不靠焦虑的方向判断方法。",
        why: "专业方向选择应建立在实际任务体验、基础匹配和持续投入意愿上，而不是只看语言排行榜。",
        concepts: [
          "兴趣表示你愿不愿意长期接触这类问题。",
          "能力表示当前基础与方向门槛的匹配度。",
          "市场表示岗位、应用场景和长期需求。",
          "证据来自短项目、学习记录、作品和复盘。"
        ],
        example: "方向评分 = 兴趣证据 + 能力证据 + 项目证据 + 岗位证据，而不是“听说很火”",
        practice: "列出 3 个候选方向，为每个方向写下喜欢点、担心点、已有基础和一个可验证小项目。",
        checkpoint: "能用证据说明为什么暂选某个方向，而不是只说“感觉适合”。"
      },
      {
        id: "web-path",
        title: "Web 前端、后端与全栈方向",
        duration: 38,
        level: "方向",
        summary: "比较浏览器体验、服务器业务、数据库和全栈协作。",
        why: "Web 是最容易形成可见作品的方向，也最能串起网络、数据库和软件工程。",
        concepts: [
          "前端重视界面、交互、可访问性和浏览器平台。",
          "后端重视业务逻辑、数据、接口和服务可靠性。",
          "全栈需要理解端到端链路，但不等于每层都同样深入。",
          "先完成一个小型 Web 项目再判断偏前端还是后端。"
        ],
        example: "前端：课程页面与交互\n后端：账户、进度和数据库\n共同契约：API",
        practice: "完成一个带本地数据的页面，再给它增加一个简单 API 设计文档。",
        checkpoint: "能说出自己更喜欢界面交互、业务数据还是端到端整合，并给出证据。"
      },
      {
        id: "backend-api-path",
        title: "后端、API 与数据服务方向",
        duration: 38,
        level: "方向",
        summary: "认识服务端工程、接口设计、数据库和可靠性任务。",
        why: "很多产品的核心价值藏在后端业务规则、数据一致性和服务稳定性中。",
        concepts: [
          "后端负责处理请求、执行业务规则并访问数据。",
          "API 需要稳定的输入、输出、错误和权限约定。",
          "数据库设计、事务和索引影响功能正确性与性能。",
          "后端工程还要关注日志、监控、限流和部署。"
        ],
        example: "POST /orders → 校验库存 → 创建订单 → 写入数据库 → 返回订单状态",
        practice: "为“课程收藏”设计 6 个 API，并写出每个接口的输入、输出和错误场景。",
        checkpoint: "能说明一个后端接口从请求到数据库再到响应的完整链路。"
      },
      {
        id: "ai-data-path",
        title: "数据分析、AI 与机器学习方向",
        duration: 42,
        level: "方向",
        summary: "了解从数据问题、统计分析到模型评估的基本链路。",
        why: "AI 方向不是只调用模型，还需要数据质量、实验方法、指标和误差分析。",
        concepts: [
          "数据分析关注描述、解释和决策。",
          "机器学习从样本中拟合规律。",
          "训练、验证和测试数据职责不同。",
          "模型结果需要指标、基线和误差分析。"
        ],
        example: "问题定义 → 数据收集 → 清洗 → 特征 → 建模 → 评估 → 部署与监控",
        practice: "使用一份小型 CSV 完成统计、可视化、简单预测和结论记录。",
        checkpoint: "能区分演示效果和经过验证的模型能力。"
      },
      {
        id: "ml-engineering-path",
        title: "模型应用、数据工程与 MLOps 入门",
        duration: 40,
        level: "方向",
        summary: "认识把模型能力稳定接入真实应用时需要的工程能力。",
        why: "能跑通 notebook 不等于能上线；模型工程需要数据、版本、评估和监控闭环。",
        concepts: [
          "数据集版本和特征处理会影响模型可复现性。",
          "离线指标和线上表现可能不一致。",
          "模型服务需要接口、延迟、成本和安全边界。",
          "MLOps 关注训练、部署、监控和迭代流程。"
        ],
        example: "文本分类模型：训练脚本 → 评估报告 → API 服务 → 线上日志 → 错误样本回收",
        practice: "为一个“课程标题分类器”写出数据字段、评估指标和上线风险清单。",
        checkpoint: "能说明模型应用为什么也需要软件工程。"
      },
      {
        id: "security-path",
        title: "网络安全、Web 安全与代码审计方向",
        duration: 42,
        level: "方向",
        summary: "从资产、入口、信任边界和数据流理解安全研究。",
        why: "安全不是脱离工程的技巧，而是对系统、网络、代码和权限边界的严格验证。",
        concepts: [
          "安全研究先明确资产、入口和信任边界。",
          "Web 安全常围绕认证、授权、输入处理和数据暴露。",
          "代码审计从输入流向敏感操作追踪链路。",
          "安全结论必须对应可复现证据和修复建议。"
        ],
        example: "登录接口 → 参数校验 → 权限判断 → 数据查询 → 响应是否暴露不该看的字段",
        practice: "审查一个自写 API 设计，标出输入、权限、敏感数据和可能的错误处理问题。",
        checkpoint: "能把一个安全问题写成发现、影响、复现、修复和验证。"
      },
      {
        id: "reverse-forensics-path",
        title: "逆向工程、二进制分析与取证方向",
        duration: 44,
        level: "方向",
        summary: "用静态与动态证据恢复程序行为、协议和数据格式。",
        why: "逆向方向高度依赖系统、汇编、文件格式、调试和证据记录能力。",
        concepts: [
          "静态分析观察文件结构、字符串、导入和反编译结果。",
          "动态分析观察运行时行为、文件、网络和内存变化。",
          "取证强调证据完整性、时间线和可复现过程。",
          "逆向结论要区分已观察事实、推断和未验证假设。"
        ],
        example: "样本识别 → 字符串和导入 → 关键函数 → 动态验证 → 行为报告",
        practice: "分析一个自写程序的文件读写行为，记录进程、路径、输入、输出和证据截图位置。",
        checkpoint: "结论能对应具体日志、代码位置或运行证据。"
      },
      {
        id: "systems-path",
        title: "系统方向总览：嵌入式、游戏与云基础设施",
        duration: 34,
        level: "方向",
        summary: "比较三类偏系统方向的任务重心和基础要求。",
        why: "这些方向都依赖系统、网络和工程基础，但日常问题完全不同。",
        concepts: [
          "嵌入式关注硬件接口、资源限制和实时性。",
          "游戏关注实时循环、图形、输入和性能。",
          "云基础设施关注自动化、弹性、可靠性和可观测性。",
          "应通过短项目体验任务类型，而不是只看岗位名称。"
        ],
        example: "嵌入式：传感器读取\n游戏：可交互场景\n云：容器化服务与监控",
        practice: "分别阅读三个最小项目结构，记录最吸引和最排斥的任务。",
        checkpoint: "能说明三个方向的核心约束分别是什么。"
      },
      {
        id: "embedded-iot-path",
        title: "嵌入式、物联网与硬件接口方向",
        duration: 40,
        level: "方向",
        summary: "认识在资源受限硬件上编写程序、读取传感器和控制外设。",
        why: "嵌入式把代码和物理世界连接起来，要求理解硬件、时序、功耗和可靠性。",
        concepts: [
          "嵌入式系统通常运行在资源受限设备上。",
          "GPIO、I2C、SPI、UART 是常见硬件通信接口。",
          "实时性表示任务必须在规定时间内完成。",
          "物联网还涉及网络连接、设备管理和安全更新。"
        ],
        example: "温湿度传感器 → 单片机读取 → 串口输出 → 网关上传 → 后台展示",
        practice: "设计一个传感器数据采集项目，写出硬件、数据格式、采样频率和失败场景。",
        checkpoint: "能说明嵌入式为什么不能只按普通电脑思路开发。"
      },
      {
        id: "game-graphics-path",
        title: "游戏开发、图形与实时交互方向",
        duration: 40,
        level: "方向",
        summary: "认识游戏循环、输入、物理、渲染和性能预算。",
        why: "游戏开发把用户交互、图形表现和实时性能放在同一个高压场景里。",
        concepts: [
          "游戏循环持续处理输入、更新状态和渲染画面。",
          "帧率和延迟直接影响体验。",
          "引擎提供场景、资源、脚本和物理等基础能力。",
          "性能优化需要观察 CPU、GPU、内存和资源加载。"
        ],
        example: "读取键盘 → 更新角色位置 → 碰撞检测 → 渲染下一帧",
        practice: "设计一个 2D 小游戏原型，列出角色、输入、胜负条件和性能目标。",
        checkpoint: "能解释为什么游戏里的“能跑”和“流畅”是两回事。"
      },
      {
        id: "cloud-platform-path",
        title: "云计算、平台工程与 SRE 方向",
        duration: 42,
        level: "方向",
        summary: "认识容器、集群、自动化、监控和可靠性工程。",
        why: "云平台方向的核心不是“会点云服务”，而是让服务在变化和故障中稳定运行。",
        concepts: [
          "容器封装应用运行环境。",
          "编排系统负责调度、扩缩容和服务发现。",
          "SRE 关注可靠性目标、告警、故障响应和复盘。",
          "基础设施即代码让环境变化可审查、可复现。"
        ],
        example: "应用镜像 → Kubernetes 部署 → Service 暴露 → 指标告警 → 故障复盘",
        practice: "为一个 Web API 画出云端运行图：镜像、数据库、网关、日志、监控和回滚。",
        checkpoint: "能说明平台工程和业务后端的关注点差异。"
      },
      {
        id: "mobile-app-path",
        title: "移动应用与跨平台方向",
        duration: 38,
        level: "方向",
        summary: "认识 Android、iOS 和跨平台应用开发的任务边界。",
        why: "移动端接近用户真实设备，必须处理系统权限、网络变化、性能和发布流程。",
        concepts: [
          "移动应用需要适配不同设备尺寸、权限和生命周期。",
          "原生开发更贴近系统平台能力。",
          "跨平台框架追求多端复用，但仍要理解平台差异。",
          "移动发布涉及签名、应用商店审核和版本管理。"
        ],
        example: "登录页 → 本地缓存 token → 请求 API → 离线提示 → 应用商店发布",
        practice: "设计一个移动端学习打卡应用，列出页面、权限、离线场景和发布风险。",
        checkpoint: "能说明移动端比网页多出的三个系统约束。"
      },
      {
        id: "open-source-docs-path",
        title: "开源协作、技术写作与社区方向",
        duration: 34,
        level: "方向",
        summary: "认识通过文档、issue、示例和贡献参与真实项目。",
        why: "不是所有技术成长都从大功能开始；清晰文档、复现问题和小修复同样是工程能力。",
        concepts: [
          "开源贡献可以从文档、测试、示例和 bug 复现开始。",
          "Issue 应包含环境、步骤、期望、实际结果和证据。",
          "技术写作要求准确、可验证和面向读者。",
          "社区协作需要尊重维护者流程和项目规范。"
        ],
        example: "发现 README 命令失效 → 最小复现 → 提交 issue → 修正文档 → PR",
        practice: "选择一个公开项目，阅读贡献指南，写一份不提交的 issue 草稿。",
        checkpoint: "能判断一个贡献是否足够小、清楚、可评审。"
      },
      {
        id: "portfolio-projects",
        title: "作品集、GitHub 与项目证据",
        duration: 42,
        level: "职业",
        summary: "把学习过程变成能被别人理解和验证的作品证据。",
        why: "方向选择和求职都需要作品证明：你做过什么、怎么想、如何验证。",
        concepts: [
          "作品集应展示问题、方案、截图、运行方式和验证结果。",
          "GitHub 仓库需要清理隐私、依赖和运行说明。",
          "项目复盘比堆功能更能体现成长。",
          "小而完整的作品通常比半成品大项目更有说服力。"
        ],
        example: "项目页：背景 → 功能 → 技术栈 → 运行命令 → 测试结果 → 已知问题 → 下一步",
        practice: "从 3 个候选方向各设计一个作品集项目，并写出验收标准。",
        checkpoint: "别人能根据作品集独立运行或理解项目价值。"
      },
      {
        id: "learning-plan-selection",
        title: "三个月方向试炼计划",
        duration: 38,
        level: "规划",
        summary: "用短周期试炼验证方向，而不是一次性押注。",
        why: "方向选择需要真实摩擦；三个月足够做出初步证据，也足够及时调整。",
        concepts: [
          "第一个月补方向前置基础。",
          "第二个月完成一个可运行小项目。",
          "第三个月优化、写文档、复盘并对外展示。",
          "每周记录学习时长、卡点、产出和情绪反馈。"
        ],
        example: "Web 试炼：第 1 月页面/API/SQL；第 2 月课程收藏项目；第 3 月部署和作品集",
        practice: "为最想尝试的方向写 12 周计划，包含每周目标、产物和验收方式。",
        checkpoint: "计划里每周都有可观察产物，而不是只写“继续学习”。"
      },
      {
        id: "career-review-next-roadmap",
        title: "方向复盘、取舍与下一阶段路线",
        duration: 40,
        level: "规划",
        summary: "根据证据做出下一步路线，而不是永远停留在选择焦虑里。",
        why: "选择方向不是终身判决，而是基于当前证据做下一阶段投入。",
        concepts: [
          "复盘要区分喜欢的任务、擅长的任务和外部需求。",
          "取舍意味着暂时放弃一些方向，换取主线深度。",
          "下一阶段路线应包含基础、项目、工程化和展示。",
          "保留观察清单，定期重新评估。"
        ],
        example: "结论：主线 Web 后端，辅线安全；下一阶段：HTTP/API/数据库/部署 + 一个审计练习",
        practice: "写一页方向决策报告：候选方向、证据、暂定主线、放弃项、三个月计划。",
        checkpoint: "能给出一个主线方向、一个备选方向和明确的下一步行动。"
      }
    ]
  }
];

const glossary = [
  ["文件", "File", "保存在存储设备上的一组有结构或无结构的数据。", "像一个装有特定内容的盒子。"],
  ["文件夹", "Folder / Directory", "用于组织文件和其他目录的目录项。", "像目录树上的一个分类节点。"],
  ["扩展名", "Extension", "文件名末尾用于提示格式的部分，例如 .txt。", "是格式标签，不是格式转换器。"],
  ["路径", "Path", "定位文件、目录或其他资源的一串位置描述。", "像数据在目录树中的地址。"],
  ["盘符", "Drive Letter", "Windows 为磁盘卷分配的标识，例如 C:、D:。", "是卷的入口名，不一定等于一块物理硬盘。"],
  ["快捷方式", "Shortcut", "指向另一个文件、目录或程序的入口。", "像书签，不是原内容的副本。"],
  ["CPU", "Central Processing Unit", "读取并执行机器指令的核心处理器。", "负责按步骤计算与控制。"],
  ["内存", "RAM", "程序运行时使用的快速临时存储。", "像正在工作的桌面，关机后通常清空。"],
  ["硬盘", "SSD / HDD", "长期保存系统、程序和用户数据的设备。", "像长期存放资料的柜子。"],
  ["程序", "Program", "以文件形式保存的指令和资源集合。", "运行前位于存储设备上。"],
  ["进程", "Process", "程序的一次运行实例及其资源。", "程序运行起来后的状态。"],
  ["线程", "Thread", "进程内部可被调度执行的工作单元。", "一个进程可以安排多条执行线。"],
  ["操作系统", "Operating System", "管理硬件、程序、文件、用户和权限的系统软件。", "位于应用与硬件之间。"],
  ["权限", "Permission", "规定主体能否读取、修改或执行对象的规则。", "决定谁能对什么做哪些事。"],
  ["环境变量", "Environment Variable", "进程运行环境中的命名配置值。", "PATH 是常见环境变量之一。"],
  ["终端", "Terminal", "负责显示命令输出并接收输入的交互窗口。", "像命令行的屏幕和键盘入口。"],
  ["Shell", "Shell", "读取、解释并执行命令的程序。", "像命令和系统之间的翻译员。"],
  ["PowerShell", "PowerShell", "Windows 上常用的现代 Shell 与自动化平台。", "比传统命令行更擅长处理对象。"],
  ["cmdlet", "Cmdlet", "PowerShell 中按 动词-名词 命名的轻量命令。", "例如 Get-Process、Set-Location。"],
  ["管道", "Pipeline", "把一个命令输出传给下一个命令继续处理的机制。", "像流水线一样一站接一站处理结果。"],
  ["执行策略", "Execution Policy", "PowerShell 控制脚本加载条件的一组策略。", "它是安全提示边界，不是完整防护墙。"],
  ["IP 地址", "IP Address", "用于在 IP 网络中标识网络接口的地址。", "负责网络层定位。"],
  ["DNS", "Domain Name System", "把域名等名称查询为网络记录的分布式系统。", "常把域名解析为 IP 地址。"],
  ["端口", "Port", "操作系统区分网络服务的数字标识。", "让数据交给正确的进程。"],
  ["HTTP", "Hypertext Transfer Protocol", "Web 客户端和服务器交换请求与响应的应用层协议。", "规定双方怎样描述请求和结果。"],
  ["HTTPS", "Hypertext Transfer Protocol Secure", "在 HTTP 外增加 TLS 加密与身份验证的传输方式。", "像给网页通信套上加锁的信封。"],
  ["TLS", "Transport Layer Security", "为网络传输提供加密和身份验证的协议。", "像通信通道的锁和验身份证。"],
  ["网关", "Gateway", "局域网把数据送到外部网络时先经过的出口。", "像本地网络离开小区前先经过的大门。"],
  ["子网掩码", "Subnet Mask", "用来判断 IP 所在网络范围的掩码。", "像划分同一小区边界的标记。"],
  ["DHCP", "Dynamic Host Configuration Protocol", "自动分配 IP、网关和 DNS 等配置的协议。", "像网络里的自动领号台。"],
  ["NAT", "Network Address Translation", "把内网地址转换成公网地址的技术。", "像多人共用一个对外门牌。"],
  ["TCP", "Transmission Control Protocol", "面向连接、尽量保证可靠有序传输的协议。", "像带签收和重发的快递。"],
  ["UDP", "User Datagram Protocol", "不保证可靠到达、但开销更小的传输协议。", "像直接喊一声，不等回执。"],
  ["localhost", "Localhost", "通常指当前电脑本机的主机名。", "像“我自己这台机器”的代号。"],
  ["数据库", "Database", "按一定模型组织、保存和查询数据的系统。", "不仅保存，还负责约束与查询。"],
  ["编码", "Encoding", "在字符、数字或其他信息与字节表示之间建立映射。", "编码不一致可能产生乱码。"],
  ["API", "Application Programming Interface", "软件组件之间约定的可调用接口。", "定义如何请求能力和返回结果。"],
  ["HTML", "HyperText Markup Language", "用于描述网页内容结构的标记语言。", "像网页的骨架和语义标签。"],
  ["CSS", "Cascading Style Sheets", "用于描述网页视觉样式和布局规则的样式语言。", "负责页面看起来怎样。"],
  ["JavaScript", "JavaScript", "浏览器中常用的脚本语言，用于处理交互、状态和数据。", "让页面能对用户操作作出反应。"],
  ["DOM", "Document Object Model", "浏览器把文档解析成可被程序访问和修改的对象树。", "像页面在程序里的树状模型。"],
  ["语义化", "Semantic HTML", "使用符合内容含义的 HTML 元素表达结构。", "不是只看样子，而是让标签说明内容角色。"],
  ["表单", "Form", "收集用户输入并提交数据的一组控件。", "像网页里的信息填写单。"],
  ["JSON", "JavaScript Object Notation", "一种轻量数据交换格式，常用于 API 请求和响应。", "像前后端都容易读懂的数据小纸条。"],
  ["Fetch", "Fetch API", "浏览器中用于发起网络请求的 Web API。", "让页面在不整页刷新的情况下拿数据。"],
  ["同源策略", "Same-Origin Policy", "浏览器限制不同源页面互相读取资源的安全机制。", "像浏览器给网页设的访问边界。"],
  ["CORS", "Cross-Origin Resource Sharing", "服务器声明允许哪些跨源请求的机制。", "跨域不是前端单方面能打开的门。"],
  ["localStorage", "Web Storage", "浏览器提供的键值形式本地存储能力。", "适合保存非敏感的小状态。"],
  ["SQL", "Structured Query Language", "用于定义、查询和修改关系数据库数据的语言。", "和数据库对话的标准化语言。"],
  ["主键", "Primary Key", "在表中唯一标识一行记录的字段或字段组合。", "像每条记录的唯一身份证。"],
  ["外键", "Foreign Key", "引用另一张表主键或唯一键的字段，用于表达关系和约束。", "像把两张表连起来的引用线。"],
  ["JOIN", "Join", "SQL 中按关联条件组合多张表数据的操作。", "把分散在不同表里的信息拼回一个结果。"],
  ["索引", "Index", "数据库为加快特定查询而维护的辅助数据结构。", "像书后的索引页，查得快但维护也有成本。"],
  ["事务", "Transaction", "数据库中一组需要整体成功或整体失败的操作。", "像转账，扣款和入账不能只成功一半。"],
  ["ACID", "Atomicity Consistency Isolation Durability", "描述事务可靠性的四个核心性质。", "保证关键数据操作更像一个可靠整体。"],
  ["补码", "Two's Complement", "现代计算机常用的有符号整数二进制表示方式。", "让加减法可以用统一硬件处理正负数。"],
  ["位运算", "Bitwise Operation", "直接对整数的二进制位进行与、或、异或、取反、移位等操作。", "像逐个开关做逻辑计算。"],
  ["寄存器", "Register", "CPU 内部容量很小但速度极快的存储位置。", "CPU 手边正在用的小纸条。"],
  ["指令集", "Instruction Set Architecture", "处理器能理解的指令、寄存器和行为约定。", "CPU 的操作说明书。"],
  ["程序计数器", "Program Counter", "保存下一条将要执行指令地址的寄存器。", "像 CPU 当前读到哪一行代码的书签。"],
  ["汇编", "Assembly", "机器指令的人类可读文本表示。", "比高级语言更贴近 CPU 指令。"],
  ["机器码", "Machine Code", "CPU 可直接执行的二进制指令编码。", "真正喂给处理器执行的指令形态。"],
  ["局部性", "Locality", "程序倾向于重复访问近期数据或相邻数据的现象。", "让缓存预测“接下来可能还会用什么”。"],
  ["虚拟内存", "Virtual Memory", "操作系统为进程提供的抽象地址空间和映射机制。", "让每个进程像有自己的内存世界。"],
  ["页表", "Page Table", "把虚拟页映射到物理页或后备存储的数据结构。", "像虚拟地址到真实位置的翻译表。"],
  ["内核", "Kernel", "操作系统中负责资源管理和硬件控制的核心部分。", "系统最核心、权限最高的管家。"],
  ["用户态", "User Mode", "普通应用程序运行的受限 CPU 权限状态。", "能做日常工作，但不能随意碰系统核心。"],
  ["内核态", "Kernel Mode", "操作系统内核运行的高权限 CPU 状态。", "能访问硬件和核心系统资源。"],
  ["系统调用", "System Call", "用户程序请求操作系统内核服务的受控入口。", "应用向系统办事窗口递申请。"],
  ["中断", "Interrupt", "硬件或定时器等事件打断 CPU 当前执行并转入处理程序的机制。", "像设备敲门提醒 CPU 有事要处理。"],
  ["上下文切换", "Context Switch", "操作系统保存一个执行流现场并恢复另一个执行流现场的过程。", "让 CPU 像在不同任务间换档。"],
  ["调度器", "Scheduler", "操作系统中决定哪个线程或进程获得 CPU 的组件。", "像安排谁先上 CPU 的调度员。"],
  ["竞态条件", "Race Condition", "多个执行流以不确定顺序访问共享状态导致结果不稳定的问题。", "谁先谁后变了，结果也跟着变。"],
  ["死锁", "Deadlock", "多个任务互相等待对方持有的资源而无法继续的状态。", "像两个人各拿一把钥匙，都等对方先交出来。"],
  ["文件系统", "File System", "管理文件内容、目录、元数据和存储位置的系统组件。", "把存储设备组织成人能用的文件和文件夹。"],
  ["Git", "Version Control System", "跟踪文件变化并管理版本历史的工具。", "GitHub 是托管平台，不等于 Git。"],
  ["提交", "Commit", "Git 仓库历史中的一次快照和说明。", "像给项目状态拍照并写下原因。"],
  ["分支", "Branch", "指向某条提交历史线的可移动引用。", "像从主线分出去做实验的工作线。"],
  ["合并", "Merge", "把不同分支的提交历史整合到一起。", "把两条工作线汇到一起。"],
  ["Pull Request", "Pull Request", "请求把一组分支改动评审后合并到目标分支的协作流程。", "让别人先看一眼再进主线。"],
  ["Code Review", "Code Review", "对代码改动进行正确性、可维护性、安全和测试等方面的评审。", "不是挑刺，是给项目加护栏。"],
  ["回归测试", "Regression Test", "用于防止已修复问题再次出现的测试。", "修过的坑以后自动再踩一遍。"],
  ["Lint", "Lint", "静态检查代码风格、潜在错误和坏味道的工具或过程。", "像代码的拼写和规则检查。"],
  ["重构", "Refactoring", "在不改变外部行为的前提下改善代码结构。", "换骨架，不换功能。"],
  ["依赖", "Dependency", "项目运行或开发需要的外部库、工具或服务。", "项目借用的外部零件。"],
  ["锁定文件", "Lockfile", "记录依赖解析后精确版本的文件。", "让别人安装出同一套零件版本。"],
  ["CI", "Continuous Integration", "在代码变更后自动运行构建、测试和检查的流程。", "每次改动都让机器先检查一遍。"],
  ["CD", "Continuous Delivery / Deployment", "把通过检查的变更自动或半自动交付到目标环境的流程。", "让发布步骤更稳定可复现。"],
  ["Docker", "Docker", "用于构建、分发和运行容器化应用的平台。", "把应用和运行环境打包起来。"],
  ["镜像", "Image", "容器运行所需文件系统和配置的只读模板。", "容器启动前的模板包。"],
  ["容器", "Container", "由镜像启动的隔离运行实例。", "镜像跑起来后的应用小环境。"],
  ["健康检查", "Health Check", "用于判断服务是否正常可用的自动检查。", "上线后先问一句：你还好吗？"],
  ["可观测性", "Observability", "通过日志、指标和追踪理解系统内部状态的能力。", "系统自己留下足够证据让人看懂。"],
  ["指标", "Metric", "可聚合的数值型运行数据，例如错误率、延迟和请求数。", "把运行状态变成可看趋势的数字。"],
  ["追踪", "Trace", "记录一次请求跨组件执行路径和耗时的数据。", "像一次请求的行程记录。"],
  ["回滚", "Rollback", "把系统恢复到先前可用版本或状态的操作。", "发布翻车时准备好的退路。"],
  ["前端", "Frontend", "面向用户界面和交互体验的软件部分。", "用户直接看见和操作的那一面。"],
  ["后端", "Backend", "处理业务逻辑、数据访问和服务接口的软件部分。", "用户看不见但支撑功能的后台。"],
  ["全栈", "Full Stack", "能理解并实现前端、后端、数据和部署链路的开发方式。", "不是每层都最深，而是能打通全链路。"],
  ["数据分析", "Data Analysis", "通过清洗、统计、可视化和解释数据支持判断的过程。", "把数据变成能回答问题的证据。"],
  ["机器学习", "Machine Learning", "从样本数据中学习规律并用于预测或决策的方法。", "让程序从数据里总结模式。"],
  ["MLOps", "Machine Learning Operations", "管理模型训练、部署、监控和迭代的工程实践。", "把模型当成需要长期运维的软件。"],
  ["人工智能", "Artificial Intelligence", "让机器执行感知、推理、预测、生成或决策等任务的方法与系统集合。", "它是一个大领域，机器学习只是其中一种实现路径。"],
  ["模型", "Model", "把输入映射为输出、并由结构与参数共同决定行为的计算对象。", "像一套从输入算出结果的可调规则。"],
  ["参数", "Parameter", "模型在训练中被更新、并直接影响输出的内部数值。", "训练就是不断调整这些内部旋钮。"],
  ["训练", "Training", "使用数据与目标函数更新模型参数的过程。", "让模型通过反馈逐步减少错误。"],
  ["推理", "Inference", "使用已训练模型对新输入计算预测或生成结果的过程。", "模型学完以后真正开始答题。"],
  ["张量", "Tensor", "用于表示多维数值数组及其形状的数据结构。", "标量、向量和矩阵都可以看成不同维度的张量。"],
  ["损失函数", "Loss Function", "把模型输出与目标之间的偏差压缩成可优化数值的函数。", "告诉训练过程这次错了多少。"],
  ["梯度下降", "Gradient Descent", "沿损失函数下降方向迭代更新参数的优化方法。", "根据坡度一步步往更低的误差走。"],
  ["特征", "Feature", "模型用于计算预测的输入变量或表示。", "模型做判断时实际看到的线索。"],
  ["标签", "Label", "监督学习中希望模型预测的目标值。", "训练样本随附的参考答案。"],
  ["数据泄漏", "Data Leakage", "训练或评估过程使用了真实预测时不可获得的信息，导致指标虚高。", "考试时提前看到了答案或未来信息。"],
  ["过拟合", "Overfitting", "模型过度适配训练数据细节，导致面对新数据时表现下降。", "把练习题背熟了，却没有学会规律。"],
  ["交叉验证", "Cross-validation", "通过多次轮换训练集与验证集估计模型泛化表现的方法。", "换几套训练与检查划分，避免只信一次分数。"],
  ["Precision", "Precision", "预测为正的样本中实际为正的比例。", "模型报出来的结果里，有多少是真的。"],
  ["Recall", "Recall", "实际为正的样本中被模型识别出来的比例。", "真正需要找到的目标里，找回了多少。"],
  ["神经网络", "Neural Network", "由可微分的层和参数组合而成、通过数据优化的模型家族。", "许多简单计算层连接起来形成复杂表示。"],
  ["反向传播", "Backpropagation", "利用链式法则从输出误差反向计算各参数梯度的算法。", "从最终错误一路倒推每个参数该承担多少。"],
  ["卷积神经网络", "Convolutional Neural Network", "使用共享卷积核提取局部模式的神经网络，常用于图像任务。", "让同一个小观察窗在图像各处寻找特征。"],
  ["Token", "Token", "文本经 Tokenizer 切分后交给模型处理的离散单位。", "可能是一个字、词的一部分或符号，不一定等于自然语言中的词。"],
  ["Tokenizer", "Tokenizer", "把文本编码为 Token ID，并把模型输出 ID 解码回文本的组件。", "负责文本与模型数字输入之间的翻译。"],
  ["Embedding", "Embedding", "把离散对象映射为稠密向量表示的方法或结果。", "把词、文档等对象放到可计算相似度的坐标空间。"],
  ["注意力机制", "Attention", "根据 Query 与 Key 的匹配为 Value 分配权重并汇总信息的机制。", "让模型按当前问题决定更关注哪些位置。"],
  ["Transformer", "Transformer", "以注意力、前馈网络、残差连接和位置表示为核心的序列模型架构。", "现代大语言模型常用的基础骨架。"],
  ["大语言模型", "Large Language Model", "在大规模文本上训练、以 Token 序列建模为核心的语言模型。", "通过预测和生成 Token 完成多种语言任务。"],
  ["RAG", "Retrieval-Augmented Generation", "先从外部知识源检索证据，再让生成模型基于证据回答的系统模式。", "先查资料，再带着资料回答，并保留引用链。"],
  ["Agent", "AI Agent", "围绕目标管理状态、选择工具、执行步骤并根据结果继续行动的系统。", "模型不只回答，还能在权限边界内安排和执行工作流。"],
  ["Tool Calling", "Tool Calling", "模型按约定结构请求外部工具执行操作，再读取工具结果的机制。", "把计算、搜索或写入交给受控工具完成。"],
  ["Model Card", "Model Card", "记录模型用途、评估、限制、风险和版本信息的结构化文档。", "模型交付时随附的能力与边界说明书。"],
  ["Prompt Injection", "Prompt Injection", "不可信输入试图改变模型原定指令、访问数据或滥用工具的攻击与失效模式。", "外部内容伪装成命令，诱导系统越过原有边界。"],
  ["数据漂移", "Data Drift", "线上输入分布相对训练或基准数据发生变化的现象。", "模型面对的数据环境慢慢变了。"],
  ["Web 安全", "Web Security", "围绕 Web 应用认证、授权、输入、会话和数据暴露等风险的安全领域。", "检查网站链路哪里可能被误用或突破。"],
  ["逆向工程", "Reverse Engineering", "通过分析现有程序、协议或文件恢复其结构和行为的方法。", "从结果倒推它怎么工作。"],
  ["取证", "Digital Forensics", "收集、保全和分析数字证据以还原事件过程的技术。", "重视证据链和时间线。"],
  ["嵌入式", "Embedded System", "运行在特定硬件设备中、通常资源受限的软件系统。", "代码直接贴近硬件和物理世界。"],
  ["物联网", "Internet of Things", "把设备、传感器、网络和云端服务连接起来的系统。", "让物理设备能采集、通信和被管理。"],
  ["游戏引擎", "Game Engine", "提供渲染、场景、输入、物理和资源管理等能力的游戏开发平台。", "帮你少从零造游戏底层轮子。"],
  ["云原生", "Cloud Native", "围绕容器、弹性、自动化和可观测性构建云环境应用的实践。", "让服务更适合在云上运行和演进。"],
  ["SRE", "Site Reliability Engineering", "用软件工程方法提升系统可靠性和运维效率的实践。", "把可靠性当成可工程化的问题。"],
  ["移动开发", "Mobile Development", "面向手机、平板等移动设备构建应用的开发方向。", "要处理设备、权限、网络和发布差异。"],
  ["作品集", "Portfolio", "集中展示项目、能力、过程和验证结果的材料集合。", "让别人看见你真正做过什么。"],
  ["缓存", "Cache", "保存近期或常用结果以减少重复计算或访问。", "更快，但需要处理过期和一致性。"],
  ["解释器", "Interpreter", "逐步读取并执行高级语言代码的程序。", "Python 代码通常由解释器运行。"],
  ["变量", "Variable", "程序中用于引用某个值或对象的名称。", "像给一个值贴上的名字。"],
  ["函数", "Function", "接收输入、执行步骤并可返回结果的代码块。", "把一段可复用动作封装起来。"],
  ["模块", "Module", "可被导入复用的 Python 文件或包。", "像按主题整理好的工具盒。"],
  ["异常", "Exception", "程序运行时出现的可捕获错误或异常情况。", "表示当前路径走不下去了。"],
  ["traceback", "Traceback", "Python 异常发生时显示的调用链和出错位置。", "像错误发生路线图。"],
  ["虚拟环境", "Virtual Environment", "隔离 Python 项目依赖和解释器上下文的环境。", "让每个项目有自己的工具箱。"],
  ["pip", "Package Installer for Python", "Python 常用包安装工具。", "负责安装和管理第三方包。"],
  ["unittest", "Unit Testing Framework", "Python 标准库中的单元测试框架。", "用代码检查代码是否按预期工作。"],
  ["bit", "Binary Digit", "二进制中的最小信息单位，只能表示 0 或 1。", "像一个只能开或关的开关。"],
  ["byte", "Byte", "常见为 8 个 bit 组成的信息单位。", "文件大小和内存容量常以字节为基础。"],
  ["UTF-8", "Unicode Transformation Format - 8-bit", "一种常见的 Unicode 字符编码方式，使用 1 到 4 个字节表示字符。", "让中文、英文和符号能在同一套文本规则里保存。"],
  ["数组", "Array", "按连续位置保存元素、可通过下标访问的数据结构。", "像一排有编号的格子。"],
  ["链表", "Linked List", "由节点通过引用或指针连接而成的数据结构。", "像每节车厢知道下一节在哪里。"],
  ["栈", "Stack", "遵循后进先出规则的数据结构。", "像叠盘子，最后放上去的先拿走。"],
  ["队列", "Queue", "遵循先进先出规则的数据结构。", "像排队，先来先服务。"],
  ["哈希表", "Hash Table", "通过 hash 函数把键映射到存储位置的数据结构。", "像按编号快速找到抽屉。"],
  ["集合", "Set", "保存不重复元素并支持成员判断的数据结构。", "常用于去重和判断是否出现过。"],
  ["Big-O", "Big O Notation", "描述算法成本随输入规模增长的上界趋势。", "关心规模变大后会不会爆炸。"],
  ["递归", "Recursion", "函数在解决问题时调用自身处理更小子问题的方法。", "像一层层拆盒子，必须有最小盒子可停下。"],
  ["树", "Tree", "由节点和边组成的层级结构。", "像文件夹目录或家族谱。"],
  ["堆", "Heap", "满足父子节点优先级关系、常用于优先队列的数据结构。", "能快速拿到当前最优先的元素。"],
  ["图", "Graph", "由节点和边组成、用于表示任意关系网络的数据结构。", "像地图、社交关系或网页链接网。"],
  ["动态规划", "Dynamic Programming", "保存重复子问题结果以减少重复计算的算法思想。", "把算过的小答案记下来，后面直接用。"]
];

const dailyTasks = [
  { id: "extensions", title: "显示文件扩展名", note: "Windows 资源管理器 · 5 分钟" },
  { id: "path", title: "拆解一个完整路径", note: "盘符、目录、文件名 · 10 分钟" },
  { id: "summary", title: "写下今日三个新概念", note: "用自己的话复述 · 10 分钟" }
];

const stageHeroCopy = [
  ["先弄明白电脑每天在做什么", "从文件名、路径和程序开始，把熟悉的操作连接成一套清楚的系统。"],
  ["看懂电脑内部的分工", "连接 CPU、内存、硬盘、进程与权限，理解程序为什么能够运行。"],
  ["跟踪一次真实的网络访问", "从路由器到 DNS 和 HTTPS，弄清网页如何来到屏幕上。"],
  ["用命令精确描述操作", "进入 PowerShell，掌握当前位置、路径、文件和进程观察。"],
  ["把想法写成可执行步骤", "用 Python 建立变量、流程、函数、调试与测试的完整闭环。"],
  ["让数据组织得更高效", "比较数据结构和算法的成本，开始用增长趋势判断程序。"],
  ["连接页面、接口与数据库", "理解客户端和服务器如何协作，完成数据从存储到呈现的链路。"],
  ["进入计算机系统内部", "把二进制、CPU、内存与操作系统连接成统一运行模型。"],
  ["把代码变成可靠项目", "使用 Git、测试、日志、架构和部署方法稳定交付软件。"],
  ["用短项目选择专业方向", "在 Web、AI、安全和系统方向中，用真实体验做出有依据的选择。"]
];

const stageOperationGuides = {
  0: {
    title: "文件资源管理器操作图示",
    subtitle: "阶段 0 重点看文件名、扩展名、路径、默认打开方式和属性。",
    window: "文件资源管理器",
    labels: [
      ["地址栏 / 路径", "看清当前文件夹在 C 盘、D 盘或某个目录下。"],
      ["导航栏", "快速进入桌面、下载、文档和磁盘分区。"],
      ["文件名 + 扩展名", "例如 report.pdf，点号后面通常提示文件格式。"],
      ["详细信息", "大小、修改时间和类型能帮助判断文件来源与版本。"]
    ],
    actions: [
      { action: "单击地址栏，再按 Ctrl+C 复制完整路径。", evidence: "地址栏显示盘符和逐级目录，例如 C:\\Users\\阳\\Downloads。", done: "能指出盘符、父目录和当前目录。", mock: [0] },
      { action: "从左侧导航依次打开下载、文档和一个磁盘分区。", evidence: "每次切换后地址栏都会变化，文件列表也随位置更新。", done: "能区分导航入口与真实文件路径。", mock: [0, 1] },
      { action: "打开“查看”，启用“文件扩展名”，观察两个不同格式文件。", evidence: "文件名末尾出现 .pdf、.exe 等后缀，类型列与之对应。", done: "能把文件名、扩展名和文件类型分别说清楚。", mock: [1, 2, 4, 5, 7, 8] },
      { action: "切换到详细信息视图，按修改日期排序。", evidence: "大小、类型和修改日期列可用于判断版本与来源。", done: "能找到最新文件，并说明判断依据。", mock: [2, 3, 5, 6, 8, 9] }
    ],
    mock: ["C:\\Users\\阳\\Downloads", "文件名", "类型", "修改日期", "report.pdf", "PDF 文档", "今天 09:20", "setup.exe", "应用程序", "昨天 21:11"]
  },
  1: {
    title: "系统状态观察图示",
    subtitle: "阶段 1 重点看进程、性能、启动项、服务和硬件设备。",
    window: "任务管理器",
    labels: [
      ["进程列表", "程序运行后通常会变成一个或多个进程。"],
      ["CPU / 内存", "观察卡顿时先看资源是否被占满。"],
      ["启动项", "开机变慢时检查哪些程序自动启动。"],
      ["服务 / 驱动", "系统后台能力常由服务和驱动支撑。"]
    ],
    actions: [
      { action: "打开任务管理器，在进程页找到浏览器和资源管理器。", evidence: "应用名称、状态和资源占用显示在同一行。", done: "能指出一个程序对应的运行中进程。", mock: [0, 3, 4, 7, 8, 11] },
      { action: "切换到性能页，观察 CPU 和内存在空闲与操作时的变化。", evidence: "百分比和内存用量会随程序活动变化。", done: "能区分瞬时波动与持续占满。", mock: [1, 2, 5, 6, 9, 10] },
      { action: "打开启动应用页，按启动影响排序，但先不禁用项目。", evidence: "每项会显示启用状态和启动影响。", done: "能找到高影响项目并记录名称。", mock: [0, 3, 4, 7] },
      { action: "查看服务页或设备管理器，只观察名称、状态和设备类别。", evidence: "服务有运行状态，设备按硬件类别分组。", done: "能说明进程、服务和驱动不是同一个概念。", mock: [0, 3, 8, 11] }
    ],
    mock: ["进程", "CPU", "内存", "状态", "浏览器", "8%", "620 MB", "运行中", "资源管理器", "1%", "86 MB", "运行中"]
  },
  2: {
    title: "网络访问链路图示",
    subtitle: "阶段 2 重点看 IP、DNS、网关、端口、HTTP 和 HTTPS。",
    window: "浏览器 Network",
    labels: [
      ["URL", "协议、域名、路径和查询参数共同定位资源。"],
      ["DNS / IP", "域名需要解析成 IP，数据才能找到服务器。"],
      ["状态码", "200、301、404、500 等能说明请求结果类型。"],
      ["请求与响应", "Headers、Payload、Response 是排查网络问题的证据。"]
    ],
    actions: [
      { action: "打开开发者工具 Network 面板，刷新当前网页并选择文档请求。", evidence: "Name 列出现 index.html 或当前页面文档。", done: "能从 URL 中拆出协议、域名和路径。", mock: [0, 4] },
      { action: "在 Headers 中查看 Remote Address，并对照域名。", evidence: "域名用于阅读和定位，连接最终指向 IP 与端口。", done: "能说明 DNS 在域名与 IP 之间承担的作用。", mock: [0, 4, 5] },
      { action: "观察 Status 列，再打开一个不存在的路径比较结果。", evidence: "正常资源常见 200，不存在的资源常见 404。", done: "能用状态码先判断成功、重定向、客户端或服务端问题。", mock: [1, 5, 9] },
      { action: "依次查看 Headers、Payload、Preview 和 Response。", evidence: "请求头、请求数据和响应正文分别回答不同排障问题。", done: "能指出请求发了什么、服务器回了什么。", mock: [0, 1, 2, 3, 4, 5, 6, 7] }
    ],
    mock: ["Name", "Status", "Type", "Time", "index.html", "200", "document", "32 ms", "app.js", "200", "script", "18 ms"]
  },
  3: {
    title: "PowerShell 命令图示",
    subtitle: "阶段 3 重点看当前位置、命令名、参数、输出和报错。",
    window: "PowerShell",
    labels: [
      ["提示符", "显示当前所在路径，很多命令都受当前位置影响。"],
      ["命令名", "动词-名词结构能帮助猜测命令作用。"],
      ["参数", "参数改变命令行为，危险参数必须先确认。"],
      ["输出 / 错误", "输出是可复现操作的重要证据。"]
    ],
    actions: [
      { action: "读取提示符中的当前路径，再执行 Get-Location 核对。", evidence: "提示符和 Get-Location 输出应指向同一目录。", done: "执行文件命令前能先确认当前位置。", mock: [0, 3] },
      { action: "输入 Get-ChildItem，只执行命令名，不加参数。", evidence: "命令返回当前目录中的项目。", done: "能指出命令名负责的核心动作。", mock: [0, 1, 2] },
      { action: "增加 -Filter *.txt，再与不加参数的结果比较。", evidence: "输出只保留匹配 .txt 的文件。", done: "能解释参数怎样改变命令行为。", mock: [0, 1, 2] },
      { action: "把命令、输出和一次故意写错的命令保存到练习记录。", evidence: "成功输出与红色错误信息都包含排查线索。", done: "别人能按记录复现操作并定位错误。", mock: [1, 2, 3] }
    ],
    mock: ["PS D:\\learn> Get-ChildItem -Filter *.txt", "Mode   Length Name", "-a---    128 note.txt", "PS D:\\learn> Rename-Item note.txt lesson-note.txt"]
  }
};

const futureRoutes = [
  {
    code: "WEB",
    title: "Web 应用工程",
    summary: "从可访问界面、API 和数据库进入完整产品交付。",
    prerequisite: "阶段 0–6",
    modules: ["HTML / CSS / JavaScript 进阶", "组件、状态与路由", "接口设计与登录鉴权", "数据层、权限与缓存", "测试、性能与上线"],
    projects: ["课程管理后台：完成筛选、编辑、权限和草稿保存", "可登录笔记站：从前端表单到后端 API 再到数据库", "移动端适配审计：用 Lighthouse 找到并修复 3 个体验问题"],
    checks: ["能从页面事件一路讲到数据库写入", "能独立部署、回滚并解释失败日志", "能用指标说明一次性能优化是否有效"],
    topics: ["TypeScript", "前后端协作", "性能与部署"],
    tone: "coral"
  },
  {
    code: "AI",
    title: "AI 与数据工程",
    summary: "连接数据处理、机器学习、模型评估与应用部署。",
    prerequisite: "阶段 0–6",
    modules: ["Python 数据栈与 Notebook", "数据清洗、特征与可视化", "监督学习与模型选择", "评估、偏差与误差分析", "模型服务、监控与再训练"],
    projects: ["课程推荐打分器：用用户行为生成可解释推荐", "CSV 分析报告器：自动输出图表、异常和业务结论", "轻量模型 API：提供预测接口并记录输入输出样本"],
    checks: ["能说清训练集、验证集和测试集的边界", "能用指标解释模型为什么变好或变差", "能识别数据泄漏、偏差和过拟合风险"],
    topics: ["Python 数据栈", "机器学习", "模型工程"],
    tone: "yellow"
  },
  {
    code: "SEC",
    title: "安全与逆向工程",
    summary: "沿代码、系统和网络证据分析真实行为与风险。",
    prerequisite: "阶段 0–8",
    modules: ["威胁建模与资产梳理", "Web 漏洞与安全编码", "协议、认证与日志取证", "二进制基础与逆向阅读", "检测规则、报告与修复闭环"],
    projects: ["登录审计演练：定位弱口令、越权和异常访问", "样本行为分析：从静态字符串到运行轨迹做证据链", "检测规则包：为一组攻击行为编写日志匹配规则"],
    checks: ["能用证据复现风险而不是只给结论", "能写出开发者可执行的修复建议", "能区分漏洞、利用条件和业务影响"],
    topics: ["Web 安全", "二进制分析", "协议与取证"],
    tone: "green"
  },
  {
    code: "IOT",
    title: "嵌入式与物联网",
    summary: "从 C 语言、硬件接口进入资源受限系统开发。",
    prerequisite: "阶段 0–7",
    modules: ["C 语言、编译与内存", "GPIO、串口与调试工具", "传感器采集与硬件通信", "任务调度、RTOS 与功耗", "联网、固件更新与设备安全"],
    projects: ["温湿度采集器：稳定读取并校准传感器数据", "远程灯控节点：完成消息下发、确认和失败重试", "固件更新演练：验证版本、回滚和断电保护"],
    checks: ["能解释一次外设读写从寄存器到业务数据的链路", "能定位常见时序、内存和功耗问题", "能给设备通信设计最小安全边界"],
    topics: ["单片机", "RTOS", "硬件通信"],
    tone: "blue"
  },
  {
    code: "GAME",
    title: "游戏与图形开发",
    summary: "学习实时循环、交互、图形管线和性能分析。",
    prerequisite: "阶段 0–7",
    modules: ["游戏循环、时间步与输入", "场景、状态机与关卡数据", "2D / 3D 渲染与资源管理", "碰撞、音频与反馈", "性能分析、打包与发布"],
    projects: ["2D 闯关小品：完成角色、敌人、关卡和胜负反馈", "关卡编辑器：用数据驱动生成场景并保存版本", "性能修复记录：定位并优化一次掉帧问题"],
    checks: ["能解释一帧从输入到渲染发生了什么", "能用数据配置替代硬编码关卡", "能用 profiler 证明优化收益"],
    topics: ["游戏循环", "图形学", "引擎实践"],
    tone: "coral"
  },
  {
    code: "CLOUD",
    title: "云计算与平台工程",
    summary: "让服务在容器、集群和自动化流水线中可靠运行。",
    prerequisite: "阶段 0–8",
    modules: ["Linux、网络与进程诊断", "容器、镜像与供应链", "编排、服务发现与配置", "日志、指标、追踪与告警", "发布、回滚、容量与成本"],
    projects: ["课程 API 容器化：构建镜像、注入配置并健康检查", "观测面板：把延迟、错误率和资源占用串起来", "故障演练：模拟服务不可用并完成复盘报告"],
    checks: ["能从用户报错追到服务、容器和主机指标", "能设计一次可回滚的发布流程", "能用容量和成本数据解释扩缩容策略"],
    topics: ["Linux", "容器编排", "可观测性"],
    tone: "blue"
  }
];


