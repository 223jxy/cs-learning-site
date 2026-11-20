"use strict";

// Professional direction courses, references and teaching bridge copy.
const extensionCourses = [
  {
    id: "ext-web-01-01",
    routeCode: "WEB",
    moduleIndex: 0,
    lessonIndex: 0,
    title: "语义结构与页面职责",
    duration: 42,
    level: "扩展入门",
    summary: "从页面结构开始，理解 HTML 不只是把文字放到屏幕上，而是在表达信息层级和功能职责。",
    why: "后续做组件、路由、接口和可访问性时，页面结构是所有交互和样式的地基。结构混乱，CSS 和 JavaScript 会被迫补洞。",
    concepts: ["语义化标签用于表达内容角色", "标题层级影响阅读顺序和辅助技术理解", "表单、列表、导航、主内容区各有职责", "结构先清楚，样式和交互才容易维护"],
    example: "一个课程详情页可以拆成 header、main、section、nav 和 form；CSS 负责外观，JavaScript 只补交互，不应该替 HTML 承担结构职责。",
    practice: "把一个普通 div 堆出来的课程卡片改写成 article、h2、p、button，并说明每个标签承担什么职责。",
    checkpoint: "能指出页面中标题、主内容、导航、按钮和表单分别属于什么结构角色。",
    projectEvidence: "提交一份页面结构草图，标出语义标签和每块内容的职责。",
    references: ["MDN HTML semantics", "WAI 页面结构基础"]
  },
  {
    id: "ext-web-01-02",
    routeCode: "WEB",
    moduleIndex: 0,
    lessonIndex: 1,
    title: "CSS 布局、状态和响应式链路",
    duration: 46,
    level: "扩展入门",
    summary: "把 CSS 从颜色和大小提升为布局、状态和屏幕适配的规则系统。",
    why: "真实页面不是固定尺寸图片。按钮有 hover、focus、disabled，卡片要适应桌面和手机，布局规则必须能解释变化。",
    concepts: ["盒模型决定元素占位", "Flex 和 Grid 解决不同方向的排列问题", "状态类让 UI 变化可控", "响应式布局要先确定断点和优先内容"],
    example: "课程卡片在桌面三列、平板两列、手机一列；同一个卡片通过 is-complete 类显示完成状态。",
    practice: "为一个课程列表写三种宽度下的布局方案，并给当前课程、已完成课程、未开始课程设计状态类。",
    checkpoint: "能解释为什么布局问题优先考虑内容关系，而不是盲目调 margin。",
    projectEvidence: "提交一张响应式布局说明图，包含桌面、平板、手机三种状态。",
    references: ["MDN CSS layout", "CSS Grid and Flexbox basics"]
  },
  {
    id: "ext-web-01-03",
    routeCode: "WEB",
    moduleIndex: 0,
    lessonIndex: 2,
    title: "DOM 事件驱动一个真实交互",
    duration: 48,
    level: "扩展入门",
    summary: "用一次点击、输入或提交，串起 DOM 查询、事件监听、状态修改和页面更新。",
    why: "Web 应用的核心不是写很多函数，而是把用户行为变成可预测的数据变化和界面反馈。",
    concepts: ["DOM 是浏览器中的页面对象树", "事件对象记录用户行为细节", "事件委托可减少重复监听", "状态变化后必须同步 UI"],
    example: "点击课程卡片：找到 lessonId → 读取课程数据 → 渲染弹窗 → 锁定背景滚动 → 焦点进入关闭按钮。",
    practice: "做一个本地筛选器：输入关键词后，只显示标题命中的课程卡片，并显示结果数量。",
    checkpoint: "能沿着一次点击说明事件从哪里触发、数据在哪里读、界面在哪里更新。",
    projectEvidence: "提交一份交互链路记录，包含事件源、状态变化、DOM 更新和异常情况。",
    references: ["MDN DOM events", "Event delegation"]
  },
  {
    id: "ext-web-01-04",
    routeCode: "WEB",
    moduleIndex: 0,
    lessonIndex: 3,
    title: "页面作品验收与可访问性复盘",
    duration: 44,
    level: "扩展入门",
    summary: "用验收清单判断页面是否真的可用，而不是只看起来完成。",
    why: "作品集里的页面要能被别人打开、理解、操作和复现。没有验收，页面只是截图，不是工程证据。",
    concepts: ["可访问性包含键盘、焦点、文本和语义", "验收清单让质量可复查", "空状态和错误状态也是页面的一部分", "README 说明能降低别人运行成本"],
    example: "课程弹窗需要 Escape 关闭、Tab 焦点不跑出弹窗、按钮有文字说明、手机端不横向溢出。",
    practice: "为一个课程详情页写 10 条验收项，并逐项标记通过、失败和修复建议。",
    checkpoint: "能用清单说明页面能否被键盘操作、移动端阅读和他人复现。",
    projectEvidence: "提交页面验收表和一段复盘，说明修复了哪些体验问题。",
    references: ["WCAG intro", "MDN Accessibility"]
  },
  {
    id: "ext-web-02-01",
    routeCode: "WEB",
    moduleIndex: 1,
    lessonIndex: 0,
    title: "为什么要拆组件",
    duration: 44,
    level: "扩展入门",
    summary: "理解组件不是框架专属概念，而是把重复界面、数据和行为封装成稳定单元。",
    why: "页面变复杂后，同一种卡片、按钮、筛选器会不断出现。组件化能让修改集中发生，减少复制粘贴错误。",
    concepts: ["组件是可复用 UI 单元", "输入数据决定组件显示内容", "组件边界应围绕职责划分", "重复结构优先抽象，不急着套框架"],
    example: "课程卡片、术语卡片、专业方向卡片都有标题、摘要、状态和打开动作，可以形成不同层级的组件思维。",
    practice: "选一个页面，圈出至少 5 个可复用组件，并写出每个组件需要哪些输入数据。",
    checkpoint: "能说明什么时候该拆组件，什么时候保留简单 HTML 更合适。",
    projectEvidence: "提交组件拆分草图，包含组件名、职责、输入和输出。",
    references: ["Component design basics", "UI composition"]
  },
  {
    id: "ext-web-02-02",
    routeCode: "WEB",
    moduleIndex: 1,
    lessonIndex: 1,
    title: "状态从哪里来、往哪里去",
    duration: 48,
    level: "扩展入门",
    summary: "把页面状态分成本地状态、持久化状态、服务端状态和派生状态。",
    why: "很多前端 bug 不是语法错误，而是状态来源不清：页面显示一套，保存的是另一套，刷新后又变了。",
    concepts: ["本地状态只影响当前页面交互", "持久化状态需要保存和恢复", "服务端状态来自接口响应", "派生状态应由已有数据计算"],
    example: "完成课程按钮会修改 completedLessons；整体进度不单独保存，而是由 completedLessons 和课程总数计算。",
    practice: "为学习网站列出 8 个状态，并标注它们属于本地、持久化、服务端还是派生状态。",
    checkpoint: "能判断一个状态是否应该保存，还是每次根据已有数据重新计算。",
    projectEvidence: "提交状态表，说明状态名称、来源、生命周期和更新触发点。",
    references: ["State management principles", "localStorage basics"]
  },
  {
    id: "ext-web-02-03",
    routeCode: "WEB",
    moduleIndex: 1,
    lessonIndex: 2,
    title: "路由切换与页面状态保持",
    duration: 46,
    level: "扩展入门",
    summary: "理解单页应用中视图切换、URL、浏览器历史和页面状态之间的关系。",
    why: "当页面从学习台切到课程库，再切回课程弹窗，用户期待状态不要乱跳。路由和状态保持决定使用体验。",
    concepts: ["视图切换可以不刷新页面", "URL 应表达可分享的位置", "浏览器历史影响返回按钮", "临时 UI 状态要有清理时机"],
    example: "当前项目用 data-view 切换主视图；后续若支持 URL hash，可让 #review 直接打开复习笔记页。",
    practice: "设计一个 hash 路由方案，让 dashboard、roadmap、library、review、future 都能通过 URL 打开。",
    checkpoint: "能说明视图切换、URL 变化和状态保存分别解决什么问题。",
    projectEvidence: "提交一份路由表，包含路径、视图、需要读取的数据和进入后的默认状态。",
    references: ["History API basics", "SPA routing concepts"]
  },
  {
    id: "ext-web-02-04",
    routeCode: "WEB",
    moduleIndex: 1,
    lessonIndex: 3,
    title: "用组件做一个可复用页面块",
    duration: 50,
    level: "扩展入门",
    summary: "完成一个可复用组件，从结构、样式、状态和验收四个角度收口。",
    why: "组件学习最终要落到能交付。一个组件如果没有输入规则和验收标准，后续复用会制造更多混乱。",
    concepts: ["组件输入要稳定", "组件内部状态要尽量少", "组件样式不应依赖外层偶然结构", "组件验收要覆盖空状态和异常状态"],
    example: "做一个 ProgressCard：输入标题、当前值、总值、说明文案，输出百分比、进度条和状态文字。",
    practice: "实现一个学习进度卡片组件，至少支持 0%、部分完成、100% 三种状态。",
    checkpoint: "能把组件的输入、显示规则、交互行为和验收项写清楚。",
    projectEvidence: "提交组件 README，包含用法示例、状态截图和验收清单。",
    references: ["Reusable component checklist", "UI state examples"]
  },
  {
    id: "ext-web-03-01",
    routeCode: "WEB",
    moduleIndex: 2,
    lessonIndex: 0,
    title: "API 边界和字段契约",
    duration: 46,
    level: "扩展进阶",
    summary: "把接口看成前端和后端之间的契约，明确路径、方法、字段、错误和版本。",
    why: "接口不是随手返回 JSON。字段不稳定、错误格式不清，会让前后端调试成本暴涨。",
    concepts: ["API 契约规定请求和响应", "HTTP 方法表达操作意图", "字段类型和是否必填必须稳定", "错误响应也属于接口设计"],
    example: "GET /api/courses 返回课程列表；POST /api/courses 创建课程；错误时返回 code、message 和 field。",
    practice: "为课程收藏功能写 5 个接口，列出方法、路径、请求字段、成功响应和错误响应。",
    checkpoint: "能判断一个接口说明是否足够让前端独立开发页面。",
    projectEvidence: "提交一份接口表，包含成功、失败和边界用例。",
    references: ["REST API basics", "HTTP semantics"]
  },
  {
    id: "ext-web-03-02",
    routeCode: "WEB",
    moduleIndex: 2,
    lessonIndex: 1,
    title: "登录、Token、Session 的区别",
    duration: 50,
    level: "扩展进阶",
    summary: "理解登录不是一个按钮，而是身份确认、凭证保存、请求携带和过期处理的链路。",
    why: "很多应用看似能登录，实际没有处理过期、退出、权限和错误提示。鉴权链路不清会直接影响安全。",
    concepts: ["认证确认你是谁", "授权决定你能做什么", "Session 依赖服务端会话", "Token 常随请求携带并需要过期策略"],
    example: "用户提交账号密码 → 服务端校验 → 返回凭证 → 前端保存 → 后续请求带凭证 → 过期后重新登录。",
    practice: "画出登录流程图，标注前端、后端、数据库、浏览器存储分别做什么。",
    checkpoint: "能区分认证失败、权限不足、登录过期三类情况。",
    projectEvidence: "提交登录链路图和错误处理表。",
    references: ["Authentication vs authorization", "Session and token concepts"]
  },
  {
    id: "ext-web-03-03",
    routeCode: "WEB",
    moduleIndex: 2,
    lessonIndex: 2,
    title: "前端表单到后端接口的链路",
    duration: 52,
    level: "扩展进阶",
    summary: "把一次表单提交拆成输入校验、请求发送、服务端处理、数据保存和页面反馈。",
    why: "表单是 Web 应用最常见的数据入口。只做前端校验不安全，只做后端校验体验差，两边要分工。",
    concepts: ["前端校验提升体验", "后端校验保证可信边界", "请求状态需要 loading、success、error", "重复提交要被识别和处理"],
    example: "新增课程：填写标题 → 前端检查非空 → POST /api/courses → 后端校验并写库 → 返回新课程 → 刷新列表。",
    practice: "设计一个新增笔记表单，写出前端校验、后端校验、请求状态和错误提示。",
    checkpoint: "能说明同一个字段为什么前端和后端都要校验。",
    projectEvidence: "提交表单链路表，包含输入、校验、请求、响应和 UI 反馈。",
    references: ["Form validation", "Fetch API workflow"]
  },
  {
    id: "ext-web-03-04",
    routeCode: "WEB",
    moduleIndex: 2,
    lessonIndex: 3,
    title: "写一份接口说明和异常用例",
    duration: 48,
    level: "扩展进阶",
    summary: "把接口设计沉淀成别人能阅读、实现和测试的说明文档。",
    why: "接口文档不是形式主义。它能减少沟通误差，也能直接变成测试和验收依据。",
    concepts: ["接口说明要覆盖正常路径", "异常用例要覆盖权限、格式、缺失和冲突", "示例响应帮助前端联调", "版本变更要记录兼容影响"],
    example: "PATCH /api/notes/:id：标题可选、内容必填；404 表示不存在，403 表示无权限，409 表示版本冲突。",
    practice: "为一个笔记编辑接口写说明，至少包含 3 个成功示例和 5 个异常用例。",
    checkpoint: "能让另一位开发者只看文档就知道如何调用和如何处理错误。",
    projectEvidence: "提交接口说明 Markdown 和异常用例表。",
    references: ["API documentation checklist", "Error response design"]
  },
  {
    id: "ext-web-04-01",
    routeCode: "WEB",
    moduleIndex: 3,
    lessonIndex: 0,
    title: "数据模型与权限边界",
    duration: 50,
    level: "扩展进阶",
    summary: "从数据表、字段和关系出发，判断谁能读取、创建、修改和删除数据。",
    why: "权限不是页面上藏按钮。真正的权限必须落到数据和接口边界上，否则换个请求就能绕过页面限制。",
    concepts: ["数据模型定义业务对象", "权限规则要贴近数据所有权", "前端隐藏不等于后端保护", "审计字段帮助追踪变更"],
    example: "笔记表有 owner_id；查询只能返回自己的笔记；管理员可以看统计但不一定能修改内容。",
    practice: "为课程、笔记、用户三张表设计权限矩阵，标注访客、普通用户、管理员的操作范围。",
    checkpoint: "能说明为什么权限判断必须在后端执行。",
    projectEvidence: "提交数据模型草图和权限矩阵。",
    references: ["Access control basics", "Relational data modeling"]
  },
  {
    id: "ext-web-04-02",
    routeCode: "WEB",
    moduleIndex: 3,
    lessonIndex: 1,
    title: "缓存为什么会脏",
    duration: 44,
    level: "扩展进阶",
    summary: "理解缓存带来速度，也带来过期、一致性和刷新策略问题。",
    why: "真实应用经常出现页面显示旧数据、刷新后才正确、多人编辑冲突等问题，本质都和状态与缓存有关。",
    concepts: ["缓存保存近期结果", "过期策略决定何时重新读取", "写入后需要更新或失效缓存", "一致性要求越高，缓存越难"],
    example: "课程列表缓存了 5 分钟，但新增课程后列表不刷新，用户会以为保存失败。",
    practice: "为课程列表设计缓存策略，说明读取、创建、编辑、删除后如何处理缓存。",
    checkpoint: "能区分性能优化、数据新鲜度和一致性之间的取舍。",
    projectEvidence: "提交缓存策略表，包含触发动作、缓存行为和风险。",
    references: ["HTTP cache basics", "Client side cache invalidation"]
  },
  {
    id: "ext-web-04-03",
    routeCode: "WEB",
    moduleIndex: 3,
    lessonIndex: 2,
    title: "列表查询、分页和筛选",
    duration: 48,
    level: "扩展进阶",
    summary: "把一个数据列表拆成查询条件、排序、分页、空状态和性能边界。",
    why: "列表页看起来简单，却是后台系统最常见、最容易慢、最容易混乱的页面。",
    concepts: ["筛选条件要能映射到查询参数", "分页避免一次加载过多数据", "排序必须有稳定规则", "空状态要说明下一步动作"],
    example: "GET /api/courses?stage=3&status=done&page=2&pageSize=20&sort=updatedAt",
    practice: "设计课程库筛选接口和页面状态，覆盖无结果、加载中、错误、最后一页。",
    checkpoint: "能说明前端筛选和后端筛选分别适合什么场景。",
    projectEvidence: "提交列表查询参数表和页面状态草图。",
    references: ["Pagination patterns", "Query parameter design"]
  },
  {
    id: "ext-web-04-04",
    routeCode: "WEB",
    moduleIndex: 3,
    lessonIndex: 3,
    title: "用数据流复盘一次新增操作",
    duration: 52,
    level: "扩展进阶",
    summary: "把一次新增数据操作从页面事件追到数据库，再追回复合 UI 状态。",
    why: "能复盘完整数据流，才算真正理解 Web + 数据库项目，而不是只会拼页面。",
    concepts: ["用户事件触发数据写入", "接口负责校验和业务边界", "数据库负责持久化和约束", "UI 要处理成功、失败和刷新"],
    example: "新增笔记：按钮点击 → 表单校验 → POST 请求 → INSERT → 返回 note_id → 列表插入新项 → 显示保存成功。",
    practice: "选一个新增操作，写出前端、接口、服务端、数据库、UI 反馈五段链路。",
    checkpoint: "能沿着数据流定位失败可能发生在哪一层。",
    projectEvidence: "提交一份数据流复盘图，包含错误分支和验收证据。",
    references: ["End to end data flow", "CRUD workflow"]
  },
  {
    id: "ext-web-05-01",
    routeCode: "WEB",
    moduleIndex: 4,
    lessonIndex: 0,
    title: "前端测试测什么",
    duration: 46,
    level: "扩展交付",
    summary: "理解测试不是追求数量，而是保护关键行为不被未来修改破坏。",
    why: "页面越复杂，越需要自动或半自动检查关键路径。否则每次修改都靠手点，很快就会漏。",
    concepts: ["单元测试检查纯逻辑", "组件测试检查输入和显示", "端到端测试检查用户路径", "回归测试保护历史问题"],
    example: "课程完成按钮：点击后 completedLessons 增加、进度刷新、按钮文案变化、刷新后状态恢复。",
    practice: "为学习网站写 8 条测试场景，按单元、组件、端到端分类。",
    checkpoint: "能判断一条测试是在保护逻辑、界面还是完整用户路径。",
    projectEvidence: "提交测试场景清单和至少 3 条手动复现步骤。",
    references: ["Testing pyramid", "Frontend test strategy"]
  },
  {
    id: "ext-web-05-02",
    routeCode: "WEB",
    moduleIndex: 4,
    lessonIndex: 1,
    title: "Lighthouse 与性能证据",
    duration: 44,
    level: "扩展交付",
    summary: "用可观察指标判断页面是否快、稳、可访问，而不是凭感觉说优化了。",
    why: "性能优化必须有前后对比。没有指标，压缩图片、减少 JS、改布局都只是猜测。",
    concepts: ["性能指标要有基线", "LCP 关注主要内容出现时间", "CLS 关注布局跳动", "可访问性评分只是线索不是终点"],
    example: "移动端课程页首屏慢，先记录 Lighthouse，再定位图片、字体、脚本或布局问题。",
    practice: "对任意本地页面做一次性能审计，记录 3 个问题、原因猜测和修复建议。",
    checkpoint: "能用指标说明优化前后是否真的变好。",
    projectEvidence: "提交性能审计记录，包含前后指标和截图或文字证据。",
    references: ["Lighthouse basics", "Web Vitals"]
  },
  {
    id: "ext-web-05-03",
    routeCode: "WEB",
    moduleIndex: 4,
    lessonIndex: 2,
    title: "部署、回滚和环境变量",
    duration: 50,
    level: "扩展交付",
    summary: "把本地能跑的页面，整理成别人可以访问、可以诊断、可以回退的交付物。",
    why: "上线不是把文件传上去。真实交付要考虑配置、环境差异、失败日志和回滚路径。",
    concepts: ["构建产物要可复现", "环境变量保存环境差异", "健康检查能发现基本故障", "回滚方案降低发布风险"],
    example: "静态网站可直接部署；带后端时要区分本地数据库、测试数据库、生产数据库配置。",
    practice: "写一份部署清单，包含构建命令、环境变量、健康检查、回滚步骤和常见失败。",
    checkpoint: "能说明一次发布失败后如何判断是代码、配置、网络还是数据问题。",
    projectEvidence: "提交部署 README 和回滚流程表。",
    references: ["Deployment checklist", "Environment variables"]
  },
  {
    id: "ext-web-05-04",
    routeCode: "WEB",
    moduleIndex: 4,
    lessonIndex: 3,
    title: "Web 项目交付清单",
    duration: 52,
    level: "扩展交付",
    summary: "用最终清单把 Web 项目从功能演示变成可展示、可维护、可复盘的作品。",
    why: "作品集不只展示结果，还要展示你如何定义问题、拆分任务、验证质量和处理风险。",
    concepts: ["README 是项目入口", "验收证据比口头说明可靠", "已知问题体现边界意识", "复盘记录能证明成长路径"],
    example: "课程管理后台交付包应包含功能清单、运行方式、截图、接口说明、测试记录、已知问题和下一步。",
    practice: "为一个 Web 小项目写交付 README，至少包含 8 个固定小节。",
    checkpoint: "别人只看 README，就能运行项目、理解功能、看到证据和知道限制。",
    projectEvidence: "提交最终交付清单、README 草稿和项目复盘。",
    references: ["README checklist", "Project handoff guide"]
  }
];

function buildExtensionCourses(routeCode, modules) {
  return modules.reduce((courses, lessons, moduleIndex) => {
    const generated = lessons.map((lesson, lessonIndex) => ({
      id: `ext-${routeCode.toLowerCase()}-${String(moduleIndex + 1).padStart(2, "0")}-${String(lessonIndex + 1).padStart(2, "0")}`,
      routeCode,
      moduleIndex,
      lessonIndex,
      ...lesson
    }));
    return courses.concat(generated);
  }, []);
}

const aiExtensionLessons = [
  [
    {
      title: "Notebook、脚本与 REPL 的分工",
      duration: 42,
      level: "扩展入门",
      summary: "先分清探索、复现和批处理各自适合什么载体，再决定数据分析过程放在哪一种环境里。",
      why: "AI 和数据项目很容易把试验过程写成一堆零散单元格。先选对载体，后面才知道哪些步骤要保留、哪些步骤要固化成脚本。",
      concepts: ["Notebook 适合观察和讲解过程", "脚本适合批量运行和交付", "REPL 适合快速试一个表达式", "可复现分析需要固定输入和顺序"],
      example: "先在 Notebook 里查看 CSV 的列名、缺失值和样本，再把确认过的步骤搬进 `clean_data.py` 和 `train_model.py`。",
      practice: "把一份数据分析流程拆成探索版 Notebook 和可重复运行的脚本版，并写出每一步为什么放在那个载体里。",
      checkpoint: "能说清楚为什么同一段处理不一定都该留在 Notebook 里。",
      projectEvidence: "提交一个能从头运行的 Notebook 和对应脚本，说明输入、输出和依赖。",
      references: ["Jupyter Notebook 官方文档", "Python 官方教程"]
    },
    {
      title: "pandas 表格和 NumPy 数组",
      duration: 44,
      level: "扩展入门",
      summary: "认识表格数据和数值数组这两个最常见的数据容器，以及它们各自适合做什么。",
      why: "清洗、统计、特征工程和建模都建立在基础数据结构上。容器不清楚，后面的代码就会到处绕弯。",
      concepts: ["DataFrame 适合表格数据", "Series 表示单列数据", "ndarray 适合数值计算", "dtype 会影响性能和结果"],
      example: "用 DataFrame 读入课程数据，按列统计缺失值，再把数值列转成 NumPy 数组做标准化。",
      practice: "准备一个包含数值列、文本列和日期列的小表，分别用 DataFrame、Series 和 ndarray 做一次对比操作。",
      checkpoint: "能解释什么时候该用表格结构，什么时候该用数组。",
      projectEvidence: "提交一页数据结构对比笔记，包含三个容器的用途、优点和限制。",
      references: ["pandas User Guide", "NumPy 快速入门"]
    },
    {
      title: "读取、检查和清洗 CSV",
      duration: 46,
      level: "扩展入门",
      summary: "把一份原始 CSV 变成可用数据，顺手建立检查、清洗和记录的习惯。",
      why: "真实项目几乎都从脏数据开始。先学会读数据、看结构、找异常，再谈建模，才不会把问题全推给模型。",
      concepts: ["编码和分隔符会影响读取结果", "空值、重复值和异常值需要分别处理", "日期字段常常需要显式转换", "清洗动作要留下记录"],
      example: "读取 `courses.csv` 后，先检查列名和行数，再处理重复行、缺失分类和日期解析问题。",
      practice: "找一份有缺失值和重复值的 CSV，记录清洗前后的行数变化，并说明每一步的处理依据。",
      checkpoint: "能说明每一个清洗动作是在修正什么问题，而不是只会 `dropna()`。",
      projectEvidence: "提交清洗后的 CSV 和一份简短的处理日志。",
      references: ["pandas read_csv 文档", "数据清洗检查清单"]
    },
    {
      title: "输出可复现的分析笔记",
      duration: 44,
      level: "扩展入门",
      summary: "把分析过程写成别人能重跑、能检查、能接手的笔记。",
      why: "结果只有在别人能复现时才有价值。没有依赖说明、输入说明和结论，Notebook 只是一份个人草稿。",
      concepts: ["固定随机种子帮助结果稳定", "输入数据和版本要写清楚", "图表和结论必须对应", "笔记应保留假设和未解决问题"],
      example: "分析报告里同时保留代码、图表、结论和数据来源，别人按顺序运行就能复现同样的输出。",
      practice: "把一次数据分析整理成一份可重跑的笔记，要求包含输入、步骤、图表和结论。",
      checkpoint: "能让另一位学习者不猜步骤就重跑出同样的结果。",
      projectEvidence: "提交一个分析笔记、运行说明和结果截图。",
      references: ["可复现研究基础", "Jupyter 最佳实践"]
    }
  ],
  [
    {
      title: "脏数据从哪里来",
      duration: 42,
      level: "扩展入门",
      summary: "先看脏数据是怎么来的，再决定清洗策略，而不是上来就删除。",
      why: "很多清洗失败不是方法不够多，而是没看懂脏数据来源。来源不同，处理方式也完全不同。",
      concepts: ["录入错误会制造错别字和空值", "重复上报会制造重复行", "格式混乱会制造解析错误", "业务规则变化会制造不一致分类"],
      example: "同一用户从导出表、手工表单和日志里三次进入系统，导致姓名、时间和状态字段格式不统一。",
      practice: "挑 10 条异常记录，给每条标注它更像是采集、解析、重复还是业务规则问题。",
      checkpoint: "能说出问题源头，而不只是说这条数据“不干净”。",
      projectEvidence: "提交一张脏数据来源映射表。",
      references: ["数据质量维度", "ETL 基础"]
    },
    {
      title: "缺失、重复和异常值怎么处理",
      duration: 48,
      level: "扩展入门",
      summary: "学会按业务语义处理缺失、重复和异常值，而不是一律删除。",
      why: "清洗的目标不是把数据变少，而是把数据变得可解释、可建模、可复查。",
      concepts: ["缺失值可删除、填补或保留标记", "重复值有完全重复和近似重复之分", "异常值可能是错误也可能是真实极端", "处理前后要比较影响"],
      example: "价格字段里出现极大值时，先确认是不是录入错误，再决定截断、保留还是单独标记。",
      practice: "同一份数据试两种清洗策略，比较样本数、分布和后续统计结果的变化。",
      checkpoint: "能说明什么时候该保留缺失作为信号，什么时候该补齐。",
      projectEvidence: "提交一份清洗决策表，写明每类问题的处理方式和理由。",
      references: ["pandas 缺失数据处理", "基础异常值分析"]
    },
    {
      title: "特征构造与基础图表",
      duration: 48,
      level: "扩展入门",
      summary: "把原始字段转换成模型更容易理解的特征，并用图表先看数据分布。",
      why: "模型不会自己理解业务语义。特征做得好不好，往往比换更复杂的模型更重要。",
      concepts: ["日期字段可以拆成周几、月份和是否周末", "类别字段可以做统计汇总", "直方图和箱线图看分布", "散点图和柱状图看关系"],
      example: "从订单表里构造下单时段、客单价和用户复购次数，再分别画出分布图和关系图。",
      practice: "基于一张样本表，构造 5 个新特征，并画出 3 张图解释这些特征在业务里的含义。",
      checkpoint: "能说明每个特征为什么有用，而不是只会拼字段。",
      projectEvidence: "提交特征清单和图表截图。",
      references: ["matplotlib 基础", "seaborn 基础"]
    },
    {
      title: "数据质量报告验收",
      duration: 44,
      level: "扩展入门",
      summary: "把清洗结果整理成可交付的质量报告，让别人知道数据是否能进入建模阶段。",
      why: "数据处理不能只靠口头说“已经洗干净了”。报告、指标和剩余风险才是交付证据。",
      concepts: ["质量基线要先记录", "缺失率和重复率要可比较", "剩余异常要明确说明", "未解决问题要写进报告"],
      example: "一份质量报告同时列出清洗前后行数、缺失率、重复行和仍待确认的字段。",
      practice: "为一份清洗后的数据写一页验收报告，要求包含前后对比和下一步建议。",
      checkpoint: "能判断数据是否已经达到建模或分析的最低可用标准。",
      projectEvidence: "提交数据质量报告和清洗前后对比表。",
      references: ["数据剖析基础", "质量检查清单"]
    }
  ],
  [
    {
      title: "训练集、验证集和测试集",
      duration: 46,
      level: "扩展进阶",
      summary: "先把数据切开，再谈模型效果，避免拿测试集当训练工具。",
      why: "模型评估最怕偷看答案。先分出训练、验证和测试，才能诚实地看出模型到底能不能泛化。",
      concepts: ["训练集负责拟合参数", "验证集负责选模型和调参", "测试集只用于最终评估", "时间序列要考虑时间切分"],
      example: "用户流失预测按照时间切分训练和测试，避免未来数据泄漏到过去。",
      practice: "针对三个不同数据场景，分别写出切分方案和理由。",
      checkpoint: "能说清每个数据集的职责，以及为什么不能混用。",
      projectEvidence: "提交数据切分方案图和说明。",
      references: ["train_test_split", "交叉验证基础"]
    },
    {
      title: "分类、回归和基线模型",
      duration: 48,
      level: "扩展进阶",
      summary: "先判断任务类型，再选一个可解释的基线模型。",
      why: "很多建模失败不是模型不够强，而是一开始就把分类、回归和评估目标搞混了。",
      concepts: ["分类输出类别", "回归输出连续值", "基线模型提供最低参考线", "简单模型先帮你发现问题"],
      example: "流失预测适合分类，销售预测适合回归；先用多数类分类器或均值预测器作为基线。",
      practice: "拿三份不同数据，分别判断它们属于分类还是回归，并写出对应的基线模型。",
      checkpoint: "能解释为什么没有基线就很难证明模型真的进步。",
      projectEvidence: "提交模型类型判断表和基线比较结果。",
      references: ["scikit-learn 监督学习", "基线建模思路"]
    },
    {
      title: "训练一个可解释小模型",
      duration: 50,
      level: "扩展进阶",
      summary: "先训练一个容易读懂的小模型，再看特征和参数怎么影响结果。",
      why: "复杂模型不一定更适合入门。能解释的模型更容易发现数据问题，也更容易和业务对齐。",
      concepts: ["pipeline 统一预处理和建模", "线性模型便于看权重", "树模型便于看分裂", "特征重要性不是因果关系"],
      example: "用逻辑回归预测是否流失，先做标准化和编码，再查看影响最大的几个特征。",
      practice: "完成一个包含预处理、训练和评估的小模型，并解释前 5 个重要特征。",
      checkpoint: "能读懂模型输出，不只是把分数报出来。",
      projectEvidence: "提交一个可运行的小模型 Notebook 和特征解释记录。",
      references: ["scikit-learn pipeline", "模型可解释性基础"]
    },
    {
      title: "用指标选择模型",
      duration: 48,
      level: "扩展进阶",
      summary: "根据业务目标选择评价指标，而不是默认只看准确率。",
      why: "不同任务的错误代价不同。用错指标，模型可能在纸面上很好看，实际却很差。",
      concepts: ["准确率不适合所有任务", "precision 和 recall 关注不同错误", "F1 兼顾两类错误", "回归常看 MAE 或 RMSE"],
      example: "垃圾邮件过滤更看重误报和漏报的平衡，价格预测更适合看 MAE 或 RMSE。",
      practice: "比较两个模型在两种指标下的表现，并说明你会选哪一个。",
      checkpoint: "能把指标选择和业务目标联系起来。",
      projectEvidence: "提交模型指标对比表和选择说明。",
      references: ["评估指标基础", "业务指标对齐"]
    }
  ],
  [
    {
      title: "准确率为什么不够",
      duration: 44,
      level: "扩展进阶",
      summary: "认识准确率在类别不平衡或错误代价不对称时的局限。",
      why: "模型看起来很准，并不代表它真的有用。错误分布一旦不均匀，准确率就很容易误导人。",
      concepts: ["混淆矩阵能拆出具体错误", "类别不平衡会抬高准确率", "不同错误的代价可能不同", "阈值会影响最终表现"],
      example: "欺诈检测里 99% 都是正常交易时，只报准确率几乎没有意义。",
      practice: "给一组预测结果计算混淆矩阵，并分别解释四个格子的含义。",
      checkpoint: "能说明为什么准确率在某些任务里不够用。",
      projectEvidence: "提交混淆矩阵和指标解释卡片。",
      references: ["混淆矩阵", "类别不平衡基础"]
    },
    {
      title: "过拟合、欠拟合和数据泄漏",
      duration: 48,
      level: "扩展进阶",
      summary: "区分模型能力不足、模型太复杂和训练数据偷看答案这三类问题。",
      why: "很多模型效果异常，不是参数没调好，而是数据本身或者切分方式已经出错了。",
      concepts: ["过拟合是记住训练集", "欠拟合是连训练集都学不好", "数据泄漏会让评估虚高", "学习曲线能提供线索"],
      example: "把目标字段的后续结果提前放进特征里，会让模型在测试时表现异常好。",
      practice: "列出 3 个可能发生泄漏的场景，并写出对应修正方法。",
      checkpoint: "能辨认过拟合、欠拟合和泄漏的不同症状。",
      projectEvidence: "提交一次错误诊断记录。",
      references: ["过拟合与正则化", "数据泄漏基础"]
    },
    {
      title: "查看错误样本",
      duration: 46,
      level: "扩展进阶",
      summary: "不要只看平均分，要去看模型到底在哪些样本上错了。",
      why: "平均指标会掩盖细节。错误样本往往直接告诉你下一步该补什么特征、清什么数据或者改什么标签。",
      concepts: ["按错误分桶能看出模式", "分群分析比单一平均更有用", "置信度能帮助识别边界样本", "错误样本常暴露标签问题"],
      example: "模型在新用户、长尾类别和低频时间段里错得最多，于是优先补这些样本。",
      practice: "把一组错误预测按人群、时间或类别分组，并总结每组的共同点。",
      checkpoint: "能从错误样本反推下一步改进方向。",
      projectEvidence: "提交错误样本分析表。",
      references: ["error analysis", "slice-based evaluation"]
    },
    {
      title: "误差分析复盘",
      duration: 48,
      level: "扩展进阶",
      summary: "把错误样本的观察转成可执行的改进计划。",
      why: "模型优化不是凭感觉堆参数，而是根据证据决定先改数据、特征还是模型。",
      concepts: ["根因分析要和样本证据对应", "数据修正、特征修正和模型修正是不同层次", "复盘要记录变化前后", "改动后必须重新评估"],
      example: "补充日期特征后，某一类错误下降，但另一个类别仍然偏高，于是继续检查标签定义。",
      practice: "写一份误差分析复盘，至少包含 3 个发现和 3 个下一步动作。",
      checkpoint: "能区分这是数据问题、特征问题还是模型问题。",
      projectEvidence: "提交误差分析报告和后续行动表。",
      references: ["模型调试基础", "复盘写法"]
    }
  ],
  [
    {
      title: "模型如何变成接口",
      duration: 48,
      level: "扩展交付",
      summary: "把训练好的模型包装成可调用的预测接口，并补齐输入校验和输出格式。",
      why: "模型只有被实际系统调用才有价值。接口、输入格式和错误响应决定它是不是能被稳定使用。",
      concepts: ["预测接口需要稳定 schema", "输入校验防止脏请求", "延迟和吞吐决定服务可用性", "模型版本必须可追踪"],
      example: "提供 `POST /predict`，输入特征向量后返回预测标签、置信度和模型版本。",
      practice: "给一个简单模型设计接口说明，列出请求字段、响应字段和失败时的返回。",
      checkpoint: "能说清楚模型服务的输入、输出和失败边界。",
      projectEvidence: "提交接口草案和调用示例。",
      references: ["FastAPI 官方文档", "模型服务基础"]
    },
    {
      title: "输入输出记录和版本",
      duration: 46,
      level: "扩展交付",
      summary: "记录每一次推理请求、预测结果和模型版本，方便追踪和回放。",
      why: "没有记录就无法定位线上问题，也无法知道某个结果到底由哪一版模型产生。",
      concepts: ["模型版本要和输出绑定", "输入样本要保留必要上下文", "trace id 方便跨系统追踪", "日志是回放和审计的基础"],
      example: "每条预测日志保存请求时间、输入摘要、模型版本、输出值和最终业务结果。",
      practice: "为模型服务定义一套最小日志字段，并说明每个字段的用途。",
      checkpoint: "能从一条预测结果追回当时使用的是哪版模型和哪份输入。",
      projectEvidence: "提交日志字段设计表。",
      references: ["模型注册表基础", "实验追踪基础"]
    },
    {
      title: "指标漂移与再训练信号",
      duration: 50,
      level: "扩展交付",
      summary: "监控数据分布和模型表现的变化，判断什么时候该提醒、什么时候该再训练。",
      why: "模型上线后不会永远稳定。数据漂移、概念漂移和业务变化都会让效果慢慢变差。",
      concepts: ["分布变化会影响预测", "监控指标需要阈值", "漂移不一定等于模型失效", "再训练需要触发条件"],
      example: "用户行为模式变化后，模型置信度和命中率一起下降，于是触发再训练评估。",
      practice: "为一个模型设置 3 个监控指标和对应阈值，并说明为什么选它们。",
      checkpoint: "能区分监控告警和再训练动作。",
      projectEvidence: "提交模型监控方案。",
      references: ["data drift", "模型监控基础"]
    },
    {
      title: "模型应用交付清单",
      duration: 52,
      level: "扩展交付",
      summary: "把模型、数据、代码、指标和说明整理成别人可以接手的交付物。",
      why: "AI 项目交付的不只是模型文件，而是能运行、能解释、能复查的一整套材料。",
      concepts: ["交付包需要可复现", "README 要说明环境和运行方式", "已知问题和限制要写明", "回滚和下一步要保留"],
      example: "模型应用包包含数据说明、训练脚本、推理脚本、指标记录、已知问题和下次迭代计划。",
      practice: "为一个小模型写一份交付清单，至少包含 8 个固定小节。",
      checkpoint: "别人只看交付文件就能跑起来，并知道它能做什么、不能做什么。",
      projectEvidence: "提交模型交付 README 和复盘摘要。",
      references: ["MLOps 基础", "交付清单模板"]
    }
  ]
];

extensionCourses.push(...buildExtensionCourses("AI", aiExtensionLessons));

const secExtensionLessons = [
  [
    {
      title: "什么是威胁建模",
      duration: 42,
      level: "扩展入门",
      summary: "先识别资产、攻击者目标、入口和潜在损失，再决定安全工作从哪里开始。",
      why: "安全工作不能只靠临时扫描和补洞。先画出威胁模型，后面测试和修复才知道重点在哪。",
      concepts: ["资产决定保护目标", "攻击者目标决定风险方向", "入口决定暴露面", "信任边界决定检查位置"],
      example: "一个课程平台的资产包括账号、笔记、后台和 API 密钥；登录页、上传接口和管理页都是高优先级入口。",
      practice: "为一个你熟悉的应用画出威胁模型，至少标出 4 个资产和 4 个入口。",
      checkpoint: "能说清楚这个系统最值得保护的是什么，以及最可能被攻击的地方在哪里。",
      projectEvidence: "提交一张威胁建模草图。",
      references: ["STRIDE 基础", "OWASP 威胁建模"]
    },
    {
      title: "资产、入口和信任边界",
      duration: 44,
      level: "扩展入门",
      summary: "区分哪些东西是资产，哪些地方是入口，哪些位置跨过了信任边界。",
      why: "很多漏洞都出现在边界上。边界不清，权限、校验和日志就容易缺位。",
      concepts: ["资产清单帮助判断保护范围", "公开接口就是主要入口", "内部服务和外部请求属于不同信任区", "跨边界时需要额外校验"],
      example: "浏览器 → API → 数据库这条链路跨过多个信任边界，每一层都要做自己的检查。",
      practice: "列出一个小系统的资产、入口和信任边界，并标出最敏感的那几处。",
      checkpoint: "能解释为什么跨边界的位置最值得优先检查。",
      projectEvidence: "提交资产清单和边界图。",
      references: ["攻击面基础", "信任边界概念"]
    },
    {
      title: "攻击面与优先级",
      duration: 46,
      level: "扩展入门",
      summary: "根据暴露程度、影响范围和滥用难度，给接口和功能排优先级。",
      why: "不是每个接口都要同样投入。先处理高暴露、高权限、高影响的地方，收益最大。",
      concepts: ["攻击面就是可被触达的地方", "影响越大优先级越高", "权限越高越值得优先看", "容易被滥用的入口要提前防护"],
      example: "登录、上传、支付和后台接口通常比静态页面更值得先检查。",
      practice: "把一个系统里的 10 个入口按优先级排序，并写出排序理由。",
      checkpoint: "能说清楚为什么某些入口应该先做安全控制。",
      projectEvidence: "提交一张风险优先级表。",
      references: ["风险评估基础", "攻击面管理"]
    },
    {
      title: "风险清单与修复顺序",
      duration: 44,
      level: "扩展入门",
      summary: "把威胁模型转成修复清单，并按严重度和修复成本排顺序。",
      why: "安全任务如果不排顺序，就会变成随机打补丁。清单化能让修复和验证都更稳。",
      concepts: ["严重度描述影响大小", "可利用性描述被打中的容易程度", "业务影响决定优先级", "修复成本影响排期"],
      example: "先修权限绕过，再修提醒文案；因为前者能直接造成数据暴露，后者只是体验问题。",
      practice: "为一个系统列出 8 个安全风险，并按优先级写出修复顺序。",
      checkpoint: "能说明为什么这个风险要先修，而不是先修别的。",
      projectEvidence: "提交修复 backlog 和排期说明。",
      references: ["风险登记", "安全 backlog"]
    }
  ],
  [
    {
      title: "输入、输出和权限边界",
      duration: 44,
      level: "扩展入门",
      summary: "理解所有不可信输入都要验证，所有敏感输出都要按上下文处理，所有权限都要在服务端判断。",
      why: "大多数 Web 安全问题都起于边界混乱。输入、输出和权限只要有一个边界松了，漏洞就会出现。",
      concepts: ["验证和编码不是一回事", "授权必须在服务端执行", "不同上下文需要不同输出处理", "最小权限能降低损失"],
      example: "文件名、评论文本和 URL 参数都属于不同输入场景，不能只用同一种过滤方式。",
      practice: "给一个表单列出输入验证规则、输出编码规则和服务端权限检查点。",
      checkpoint: "能区分验证输入和处理输出这两个动作。",
      projectEvidence: "提交一份安全编码检查表。",
      references: ["OWASP Secure Coding", "输入校验基础"]
    },
    {
      title: "XSS、SQLi 和越权的本质",
      duration: 48,
      level: "扩展入门",
      summary: "从边界失守的角度理解常见 Web 漏洞，而不是只记漏洞名字。",
      why: "名字只是标签，本质是哪个边界没守住。理解本质，才能写出正确修复。",
      concepts: ["XSS 是脚本注入", "SQLi 是查询被篡改", "越权是访问控制失效", "参数化和编码是基础防线"],
      example: "查询层用参数化语句，HTML 层按上下文编码，权限层在服务端做最终判断。",
      practice: "把 6 个样例问题分类为 XSS、SQLi、越权或其他边界问题，并说明依据。",
      checkpoint: "能解释每类漏洞为什么会发生，而不是只会背名字。",
      projectEvidence: "提交漏洞分类表。",
      references: ["OWASP Top 10", "预编译语句基础"]
    },
    {
      title: "安全测试用例",
      duration: 46,
      level: "扩展入门",
      summary: "把风险假设写成可执行的测试用例，明确输入、预期和失败条件。",
      why: "安全测试只有被写进用例，修复和回归才有抓手。否则问题很容易修完又回来。",
      concepts: ["正向用例验证正常行为", "负向用例验证拒绝路径", "权限用例验证访问控制", "篡改用例验证边界强度"],
      example: "登录失败、角色错误、参数缺失和 token 过期，都应该有明确预期。",
      practice: "围绕登录或笔记编辑流程，写出 10 条安全测试用例。",
      checkpoint: "能说出每条测试通过和失败分别意味着什么。",
      projectEvidence: "提交安全测试清单。",
      references: ["安全测试设计", "abuse case 基础"]
    },
    {
      title: "修复建议验收",
      duration: 46,
      level: "扩展入门",
      summary: "把安全修复写成可验证的验收标准，而不是只留一句“已修复”。",
      why: "没有验收标准的修复很容易回归。安全修复必须能被开发和测试共同验证。",
      concepts: ["补丁需要对应问题根因", "回归检查避免新问题", "说明文档帮助复查", "必要时写回滚说明"],
      example: "修掉 IDOR 之后，要能确认低权限账号不能访问别人的记录。",
      practice: "为一条安全修复写出验证步骤、回归检查和失败时的回退思路。",
      checkpoint: "开发者和测试者都能按这份说明复查同一件事。",
      projectEvidence: "提交修复说明和验证记录。",
      references: ["安全修复流程", "验证清单"]
    }
  ],
  [
    {
      title: "HTTP 证据怎么看",
      duration: 44,
      level: "扩展进阶",
      summary: "把请求和响应当作证据链来看，而不是只看一条接口返回了什么。",
      why: "排障和安全分析都离不开原始流量。只看页面现象，很容易错过真正的问题点。",
      concepts: ["方法决定操作类型", "头部承载上下文", "状态码反映结果", "重定向和 cookie 也是证据"],
      example: "一次 302 跳转后带上了 set-cookie，再访问受保护资源，整条链路才算完整。",
      practice: "挑一段抓包内容，标出请求方法、关键头部、状态码和响应体的作用。",
      checkpoint: "能指出一次请求里哪些字段是关键证据。",
      projectEvidence: "提交一份 HTTP 请求/响应标注稿。",
      references: ["HTTP 基础", "Web 流量分析"]
    },
    {
      title: "Cookie、Token 与会话风险",
      duration: 48,
      level: "扩展进阶",
      summary: "区分会话状态、令牌存储、过期和 CSRF 风险。",
      why: "认证问题通常不是“能不能登录”这么简单，而是整段生命周期是否稳。",
      concepts: ["cookie 属性影响安全性", "Bearer token 需要正确保存和轮换", "退出登录必须真正失效", "过期策略和 CSRF 防护都重要"],
      example: "UI 看起来已经退出，但本地还保留旧 token，服务端依然接受它。",
      practice: "为一个小系统设计安全的会话存储和轮换规则。",
      checkpoint: "能说清楚哪一边负责保存凭证，哪一边负责校验。",
      projectEvidence: "提交会话流程图。",
      references: ["Session management", "Token security"]
    },
    {
      title: "从日志还原一次请求",
      duration: 46,
      level: "扩展进阶",
      summary: "把应用、代理和服务端日志串起来，还原一次用户动作的完整时间线。",
      why: "事故分析和 bug 排查都需要时间线。没有日志链路，就只能猜。",
      concepts: ["关联 ID 连接多段日志", "时间戳帮助排序", "用户 ID 和源地址帮助定位", "错误码帮助区分失败层次"],
      example: "日志显示先收到请求，再认证失败，然后重试，最后才成功进入受保护页面。",
      practice: "给一份样例日志，重建一次请求的完整时间线。",
      checkpoint: "能不用猜测就说出这次请求到底发生了什么。",
      projectEvidence: "提交一份时间线复盘。",
      references: ["日志分析基础", "事件时间线"]
    },
    {
      title: "认证链路复盘报告",
      duration: 48,
      level: "扩展进阶",
      summary: "把认证流程、失败点和加固建议写成一份可交付的复盘报告。",
      why: "把链路写下来，盲点就会暴露出来。复盘报告也是后续修复的工作单。",
      concepts: ["认证顺序要完整", "失败模式要记录", "证据要能复查", "修复建议要可执行"],
      example: "从登录、刷新、权限判断到退出，逐段标注谁做了什么、哪里失败、怎么加固。",
      practice: "写一页认证流程复盘，至少列出 3 个风险点和 3 个加固建议。",
      checkpoint: "报告可以直接交给开发继续改。",
      projectEvidence: "提交认证复盘文档。",
      references: ["认证复盘", "取证写法"]
    }
  ],
  [
    {
      title: "文件格式和字符串证据",
      duration: 44,
      level: "扩展进阶",
      summary: "从文件类型、分区和字符串开始看样本，不急着下结论。",
      why: "逆向工作的第一步不是猜，而是看得见的证据。文件格式和字符串往往已经暴露了大半行为。",
      concepts: ["魔数确认文件类型", "段和节说明结构", "字符串能暴露配置和路径", "元数据提供基础上下文"],
      example: "样本里的字符串直接暴露了 URL、配置键和功能开关，足以先建立初始假设。",
      practice: "拿一个样本记录文件类型、关键字符串和你能推测出的用途。",
      checkpoint: "能区分事实证据和猜测。",
      projectEvidence: "提交初步三项分析记录。",
      references: ["文件格式基础", "strings 初筛"]
    },
    {
      title: "函数、调用和控制流",
      duration: 48,
      level: "扩展进阶",
      summary: "顺着调用和分支读代码，理解程序到底怎么走。",
      why: "逆向时很多名字会丢失，但控制流还在。读懂控制流，就能读懂行为。",
      concepts: ["调用图能看出依赖关系", "分支体现条件判断", "循环体现重复逻辑", "返回值决定后续路径"],
      example: "输入先经过解析、校验、转换，再进入输出路径，整段链路就能串起来。",
      practice: "给 5 个未知函数按作用改名，并写出你判断的依据。",
      checkpoint: "能不逐行硬读就说出一条关键路径。",
      projectEvidence: "提交函数映射表。",
      references: ["控制流分析", "调用图基础"]
    },
    {
      title: "读一个小样本行为",
      duration: 46,
      level: "扩展进阶",
      summary: "用一个小样本完整走一遍分析流程，把行为写成人话。",
      why: "一个完整案例比一堆术语更容易真正学会逆向阅读。",
      concepts: ["输入解析决定入口", "状态决定后续动作", "输出决定结果呈现", "错误处理也是行为的一部分"],
      example: "一个小工具读取文件、检查标志位，再决定写入哪个结果文件。",
      practice: "选一个小样本，写一段不超过半页的行为摘要。",
      checkpoint: "能说清楚程序在什么条件下进入主行为。",
      projectEvidence: "提交样本行为笔记。",
      references: ["样本三步法", "binary triage"]
    },
    {
      title: "逆向笔记模板",
      duration: 44,
      level: "扩展进阶",
      summary: "把分析过程写成别人能接手的笔记，而不是只给自己看。",
      why: "逆向分析是一项接力工作。笔记写得越清楚，后面补证据、做复盘就越快。",
      concepts: ["基本信息记录对象", "发现要和证据对应", "未解问题要单列", "下一步动作要具体"],
      example: "笔记里同时记录文件信息、字符串命中、函数用途和当前假设。",
      practice: "用一个模板把当前分析会话整理成可继续的笔记。",
      checkpoint: "别人接手后能无缝继续分析。",
      projectEvidence: "提交一份规范逆向笔记。",
      references: ["分析模板", "研究日志"]
    }
  ],
  [
    {
      title: "IOC 和检测规则",
      duration: 46,
      level: "扩展交付",
      summary: "把确认过的行为转成可检测的指标和规则。",
      why: "防守工作需要可重复的检测逻辑，而不是一次性的口头判断。",
      concepts: ["IOC 是可观测标记", "规则需要明确匹配范围", "置信度要写清", "误报是规则调优的一部分"],
      example: "某个可疑路径加上特定命令模式后，可以写成一条日志匹配规则。",
      practice: "围绕一个确认行为写一条简单检测规则，并说明它想捕获什么。",
      checkpoint: "能说清规则会抓什么，也会漏掉什么。",
      projectEvidence: "提交规则文件和说明。",
      references: ["Sigma 基础", "IOC 提取"]
    },
    {
      title: "误报、漏报和上下文",
      duration: 44,
      level: "扩展交付",
      summary: "理解规则为什么会误报、漏报，以及如何用上下文去调优。",
      why: "好的检测不是只会报，而是知道什么时候该报、什么时候不该报。",
      concepts: ["准确率和召回率都要看", "例外规则要谨慎", "基线能帮助识别异常", "白名单必须可解释"],
      example: "某个管理员脚本的行为很像攻击，但因为上下文不同，应该被排除。",
      practice: "给一条规则加一个例外和一个附加条件，观察误报变化。",
      checkpoint: "能解释为什么误报会发生。",
      projectEvidence: "提交一份规则调优记录。",
      references: ["检测调优", "告警上下文"]
    },
    {
      title: "写一条日志检测规则",
      duration: 48,
      level: "扩展交付",
      summary: "实现一条可以落地的日志检测规则，并拿样本验证它。",
      why: "只有写出并验证过一条规则，才算真正走通检测流程。",
      concepts: ["模式匹配要明确", "字段匹配要稳定", "严重度要合理", "关联条件能减少噪音"],
      example: "连续认证失败后紧接着出现高权限访问，就可以作为可疑链路来捕获。",
      practice: "写一条规则，并用正负样本各跑一次，检查命中是否符合预期。",
      checkpoint: "规则只在目标行为上触发。",
      projectEvidence: "提交测试过的规则和样本输出。",
      references: ["日志检测", "规则验证"]
    },
    {
      title: "安全报告交付清单",
      duration: 50,
      level: "扩展交付",
      summary: "把发现、影响、复现、修复和验证整理成正式交付包。",
      why: "报告是给工程和管理都能看懂的最终交付物。没有结构，证据就很难被采纳。",
      concepts: ["摘要先说结论", "证据要能复查", "复现步骤要简洁", "修复和复测要对应"],
      example: "一份报告包含时间线、截图、影响说明、修复建议和复测结果。",
      practice: "为一个已确认问题写出报告大纲，至少包含 6 个固定小节。",
      checkpoint: "读者能从报告里知道发生了什么、为什么重要、下一步怎么做。",
      projectEvidence: "提交安全报告模板。",
      references: ["安全报告格式", "交付清单"]
    }
  ]
];

extensionCourses.push(...buildExtensionCourses("SEC", secExtensionLessons));

const iotExtensionLessons = [
  [
    {
      title: "C 语言为什么常见于嵌入式",
      duration: 42,
      level: "扩展入门",
      summary: "先理解 C 语言为什么适合贴近硬件，再谈编译、内存和资源控制。",
      why: "嵌入式设备资源少、启动快、接口底层多，C 语言的可控性和接近硬件的能力很重要。",
      concepts: ["C 语言接近机器抽象", "编译器把源码变成可执行文件", "指针帮助处理内存和地址", "资源受限时要控制开销"],
      example: "同一个传感器读取函数，可以通过指针直接操作缓冲区，而不用额外制造很多临时对象。",
      practice: "把一段熟悉的高层语言逻辑改写成 C 风格伪代码，标出输入、输出和内存位置。",
      checkpoint: "能说清楚为什么嵌入式常选 C 而不是完全高层封装。",
      projectEvidence: "提交一页 C 语言与硬件关系笔记。",
      references: ["C 语言基础", "编译原理入门"]
    },
    {
      title: "编译、链接和可执行文件",
      duration: 46,
      level: "扩展入门",
      summary: "理解源码如何变成可运行程序，以及编译错误和链接错误分别意味着什么。",
      why: "嵌入式开发经常要和交叉编译、库缺失和目标架构打交道。知道程序怎么生成，调试才不盲。",
      concepts: ["编译负责翻译单个源文件", "链接负责把目标文件和库拼起来", "头文件只声明不实现", "目标架构决定最终产物"],
      example: "一个驱动模块先生成 `.o`，再和板级支持包一起链接成固件镜像。",
      practice: "区分编译错误、链接错误和运行时错误，并各写一个例子。",
      checkpoint: "能解释为什么改一个头文件有时会触发整项目重编译。",
      projectEvidence: "提交编译链路说明图。",
      references: ["GCC 基础", "链接流程基础"]
    },
    {
      title: "内存布局和栈堆",
      duration: 48,
      level: "扩展入门",
      summary: "把变量放到正确的内存区域，理解栈、堆、静态区和寄存器的大致职责。",
      why: "很多嵌入式 bug 都和内存边界、生命周期和初始化有关。先看清内存结构，后面调试才有抓手。",
      concepts: ["栈适合短生命周期局部变量", "堆适合动态分配但要管理释放", "静态区保存全局和静态数据", "越界和悬空指针都很危险"],
      example: "局部缓冲区在函数结束后失效，若把地址返回给外部，就会形成悬空引用。",
      practice: "画出一个简单程序运行时的内存分布，并标注每个变量可能在哪里。",
      checkpoint: "能判断一个对象的生命周期是否和使用场景一致。",
      projectEvidence: "提交内存布局示意图。",
      references: ["内存模型基础", "C 指针与生命周期"]
    },
    {
      title: "调试信息与断点观察",
      duration: 44,
      level: "扩展入门",
      summary: "学会用调试器观察变量、调用和分支，确认程序到底走了哪条路。",
      why: "嵌入式问题很多不能只靠打印，尤其是时序和硬件交互问题。断点和单步是最直接的证据来源。",
      concepts: ["断点可定位执行位置", "观察窗口能看变量和寄存器", "单步帮助验证分支", "日志和调试器要互相印证"],
      example: "某个初始化函数在板子启动后没有真正写入寄存器，用断点就能看到它提前返回了。",
      practice: "选择一个小程序，用断点和变量观察验证一次条件分支的真实走向。",
      checkpoint: "能说出一个 bug 是在入口、条件还是返回阶段发生的。",
      projectEvidence: "提交调试记录和截图。",
      references: ["GDB 基础", "调试观察清单"]
    }
  ],
  [
    {
      title: "GPIO 是什么",
      duration: 42,
      level: "扩展入门",
      summary: "认识最基础的通用输入输出接口，以及它如何连接按键、灯和简单外设。",
      why: "GPIO 是嵌入式最直观的入口。先学 GPIO，最容易理解“寄存器控制硬件”这件事。",
      concepts: ["输入和输出方向不同", "高低电平代表二值状态", "上拉和下拉影响输入稳定性", "复用功能会改变引脚用途"],
      example: "一个按键输入脚读取低电平代表按下，一个 LED 输出脚写高电平代表点亮。",
      practice: "为按键和 LED 画出连接和状态变化图，并说明电平如何变化。",
      checkpoint: "能解释一个引脚为什么既能做输入，也能做输出。",
      projectEvidence: "提交 GPIO 连接图。",
      references: ["GPIO 基础", "单片机外设入门"]
    },
    {
      title: "串口日志怎么帮忙",
      duration: 44,
      level: "扩展入门",
      summary: "学会用串口把设备内部状态吐出来，作为最常见的排障入口。",
      why: "设备上屏幕少、交互少，串口日志往往就是第一条生命线。不会看串口，很多问题都难以下手。",
      concepts: ["串口常用于调试输出", "波特率和格式必须一致", "日志顺序能反映执行顺序", "启动早期日志尤其重要"],
      example: "设备一上电就打印初始化步骤，卡在哪一步就能从串口里看出来。",
      practice: "设计一组串口日志，覆盖启动、读写外设和异常退出三个阶段。",
      checkpoint: "能通过串口日志判断设备大概卡在哪个环节。",
      projectEvidence: "提交串口日志样例和解释。",
      references: ["UART 基础", "串口调试实践"]
    },
    {
      title: "调试工具链怎么配合",
      duration: 46,
      level: "扩展入门",
      summary: "把串口、示波器、逻辑分析和调试器组合起来看问题，而不是只靠一种工具。",
      why: "单一工具看到的是片段，组合工具才能看到时序、波形和代码执行之间的对应关系。",
      concepts: ["串口看软件输出", "示波器看电平和时序", "逻辑分析仪看协议交互", "调试器看程序内部状态"],
      example: "按键抖动可以先在逻辑分析仪上看到波形，再在代码里确认去抖逻辑是否生效。",
      practice: "选一个外设问题，写出你会依次使用哪些工具和每个工具要看什么。",
      checkpoint: "能解释为什么一个问题要用多个工具交叉验证。",
      projectEvidence: "提交调试工具使用方案。",
      references: ["实验室调试流程", "硬件排障入门"]
    },
    {
      title: "模拟一次输入输出控制",
      duration: 44,
      level: "扩展入门",
      summary: "用一个小例子串起输入采样、状态判断和输出控制。",
      why: "GPIO 学习不是只记概念，而是要能把输入和输出连成一条闭环。",
      concepts: ["输入采样要考虑时序", "状态判断决定输出动作", "输出变化可能要延时", "异常状态也要有输出策略"],
      example: "按键按下后点亮灯，再按一次熄灭，中间要处理抖动和状态翻转。",
      practice: "设计一个按键控制 LED 的流程图，标出采样、判断、输出和异常处理。",
      checkpoint: "能说出整个控制回路的每个步骤在干什么。",
      projectEvidence: "提交控制流程图。",
      references: ["嵌入式控制回路", "去抖基础"]
    }
  ],
  [
    {
      title: "传感器数据从哪来",
      duration: 44,
      level: "扩展进阶",
      summary: "先弄清传感器如何把物理量变成数字，再谈采集和校准。",
      why: "传感器并不是直接给你答案，它先经过采样、量化和协议传输。链路不清，数据就不好信。",
      concepts: ["物理量需要转换", "采样频率会影响结果", "校准能修正偏差", "噪声和漂移要考虑"],
      example: "温湿度传感器读出的原始值，需要按说明书换算成真实温度和湿度。",
      practice: "为一个传感器写出从物理量到业务数据的转换链路。",
      checkpoint: "能解释为什么原始读数不一定能直接当最终结果。",
      projectEvidence: "提交传感器采集链路图。",
      references: ["传感器基础", "采样与校准"]
    },
    {
      title: "I2C、SPI 和 UART",
      duration: 48,
      level: "扩展进阶",
      summary: "区分三种最常见的硬件通信方式，以及它们各自适合什么场景。",
      why: "不同协议的速度、连线和复杂度不同。选错协议，后面调试和扩展都会受影响。",
      concepts: ["I2C 适合少线多设备", "SPI 适合高速全双工", "UART 适合简单点对点", "时钟和从设备管理很重要"],
      example: "温度传感器常走 I2C，显示屏或高速采样外设常走 SPI，调试输出常走 UART。",
      practice: "给三类外设分别选择通信协议，并说明为什么。",
      checkpoint: "能按需求而不是按名字选择协议。",
      projectEvidence: "提交通信协议对比表。",
      references: ["I2C 基础", "SPI 基础", "UART 基础"]
    },
    {
      title: "采集、校准和异常处理",
      duration: 48,
      level: "扩展进阶",
      summary: "把采集结果做校准、滤波和异常识别，得到更可信的数据。",
      why: "现实数据会抖动、跳变或缺失。只会读值不够，还要能判断值是否可信。",
      concepts: ["原始值可能含噪声", "校准系数要可配置", "异常值需要单独标记", "平均和滤波各有代价"],
      example: "连续读取三次传感器，取稳定区间再输出，并在异常跳变时记录告警。",
      practice: "设计一套采集后的处理步骤，包括校准、平滑和异常标记。",
      checkpoint: "能解释为什么数据处理本身也是嵌入式核心能力。",
      projectEvidence: "提交采集处理流程表。",
      references: ["数据滤波基础", "异常检测入门"]
    },
    {
      title: "数据采集报告",
      duration: 44,
      level: "扩展进阶",
      summary: "把传感器采集的结果整理成可检查的报告，而不是只给原始数值。",
      why: "工程交付里，数据报告比一串数字更容易验证和复盘。",
      concepts: ["报告要有样本和结论", "采集条件要写明", "异常样本要特别标注", "报告可以反推硬件问题"],
      example: "温湿度采集报告同时包含采样时间、环境条件、原始读数和校准后结果。",
      practice: "写一份小型传感器采集报告，要求包含条件、结果和异常说明。",
      checkpoint: "能从报告看出这组数据是否可信。",
      projectEvidence: "提交采集报告和原始日志。",
      references: ["实验记录写法", "采集报告模板"]
    }
  ],
  [
    {
      title: "什么是任务调度",
      duration: 44,
      level: "扩展进阶",
      summary: "理解多个任务如何在有限资源上轮流执行，以及为什么需要调度器。",
      why: "设备不止一个动作要做。采集、通信、控制和响应同时存在，就需要调度和优先级。",
      concepts: ["任务表示独立工作单元", "调度器决定谁先运行", "阻塞会影响实时性", "优先级影响响应速度"],
      example: "温度采集、串口输出和按键响应如果都写在一个死循环里，任何一步慢了都可能拖累整体。",
      practice: "把一个单循环程序拆成 3 个任务，并说明每个任务负责什么。",
      checkpoint: "能说出为什么多任务会比纯循环更稳。",
      projectEvidence: "提交任务拆分草图。",
      references: ["任务调度基础", "实时系统入门"]
    },
    {
      title: "RTOS 的基本角色",
      duration: 46,
      level: "扩展进阶",
      summary: "认识 RTOS 提供的任务、队列、信号量和定时器这些核心工具。",
      why: "RTOS 不是为了复杂而复杂，而是为了让多任务和资源共享更可控。",
      concepts: ["任务管理执行顺序", "队列传递数据", "信号量协调资源", "定时器提供周期动作"],
      example: "传感器任务把数据发到队列，显示任务从队列取值更新界面。",
      practice: "为两个任务设计一个用队列传递数据的流程。",
      checkpoint: "能说清楚队列和信号量分别解决什么问题。",
      projectEvidence: "提交 RTOS 组件关系图。",
      references: ["FreeRTOS 概念", "同步原语基础"]
    },
    {
      title: "看一次延迟问题",
      duration: 48,
      level: "扩展进阶",
      summary: "通过观察任务周期、阻塞点和优先级，定位系统为什么变慢。",
      why: "实时系统里，延迟本身就是 bug。理解延迟链路，才能知道瓶颈在任务、资源还是中断。",
      concepts: ["周期任务要可预测", "阻塞会拉长响应时间", "优先级反转要小心", "测量比猜测更重要"],
      example: "串口输出占用时间过长，导致控制任务错过了响应窗口。",
      practice: "分析一次模拟延迟事件，指出延迟可能出现在哪一层。",
      checkpoint: "能把延迟定位到任务、资源或中断。",
      projectEvidence: "提交延迟分析记录。",
      references: ["实时性分析", "调度延迟基础"]
    },
    {
      title: "功耗和稳定性复盘",
      duration: 46,
      level: "扩展进阶",
      summary: "把功耗、响应速度和稳定性一起看，理解为什么低功耗不等于好系统。",
      why: "物联网设备常年运行，电源和稳定性同样重要。只追求省电可能会牺牲响应和可靠性。",
      concepts: ["休眠模式降低功耗", "唤醒开销也要考虑", "稳定性和功耗需要平衡", "记录耗电能帮助复盘"],
      example: "设备频繁唤醒读取状态，虽然单次耗电低，但总功耗可能反而更高。",
      practice: "设计一次功耗优化前后的对比表，说明取舍。",
      checkpoint: "能解释为什么某种省电策略不一定适合所有场景。",
      projectEvidence: "提交功耗复盘卡。",
      references: ["低功耗设计", "稳定性分析"]
    }
  ],
  [
    {
      title: "设备为什么要联网",
      duration: 44,
      level: "扩展交付",
      summary: "从远程控制、数据同步和升级维护三个角度理解设备联网的价值。",
      why: "联网不是为了赶时髦，而是为了让设备有持续交付和维护能力。",
      concepts: ["联网能传输状态", "远程控制需要认证", "同步要考虑断线重试", "联网会带来安全边界"],
      example: "远程灯控节点通过网络接收开关命令并回传当前状态。",
      practice: "列出一个设备联网场景中的输入、输出、失败和重试。",
      checkpoint: "能说清联网到底在业务上解决了什么。",
      projectEvidence: "提交联网场景说明。",
      references: ["物联网连接基础", "设备通信设计"]
    },
    {
      title: "固件更新为什么危险",
      duration: 46,
      level: "扩展交付",
      summary: "理解固件更新的版本、校验、失败回滚和断电风险。",
      why: "更新一旦出错，设备可能直接变砖。固件更新必须设计成可验证、可恢复。",
      concepts: ["版本校验防止错误包", "签名或校验和防篡改", "断电保护避免更新中断", "回滚是恢复最后一道线"],
      example: "设备先验证固件签名，再写入备用区，确认成功后切换启动分区。",
      practice: "画出一次固件更新的安全流程，并标出每个检查点。",
      checkpoint: "能解释更新失败后设备怎么活下来。",
      projectEvidence: "提交更新流程图。",
      references: ["固件升级基础", "安全更新流程"]
    },
    {
      title: "设备安全边界",
      duration: 48,
      level: "扩展交付",
      summary: "把设备上的身份、通信和配置都当成需要保护的边界。",
      why: "设备一旦联网，攻击面就扩展了。安全不是补丁，而是边界设计。",
      concepts: ["设备身份需要唯一", "通信要加密和认证", "配置不能裸露", "默认口令必须清理"],
      example: "设备首次配网时要求生成唯一凭据，并禁止使用默认弱口令。",
      practice: "为一个联网设备写出最小安全边界清单。",
      checkpoint: "能区分设备身份、通信和配置三层风险。",
      projectEvidence: "提交设备安全清单。",
      references: ["IoT 安全基础", "最小权限原则"]
    },
    {
      title: "固件和设备交付清单",
      duration: 50,
      level: "扩展交付",
      summary: "把设备程序、升级方式、日志和安全说明整理成可交付资料。",
      why: "IoT 项目真正交付时，程序文件只是其中一部分。说明、升级和回滚同样重要。",
      concepts: ["交付包要可复现", "说明书要写清连接方式", "日志和故障处理要可查", "安全边界要写入文档"],
      example: "设备交付包包含烧录方式、串口参数、升级步骤、回滚方法和默认配置。",
      practice: "为一个小型 IoT 设备写一份交付 README。",
      checkpoint: "别人能按文档把设备跑起来并知道怎么恢复。",
      projectEvidence: "提交交付说明书。",
      references: ["硬件交付清单", "设备 README 模板"]
    }
  ]
];

extensionCourses.push(...buildExtensionCourses("IOT", iotExtensionLessons));

const gameExtensionLessons = [
  [
    {
      title: "游戏循环是什么",
      duration: 42,
      level: "扩展入门",
      summary: "先理解游戏为什么需要固定循环，再看输入、更新和渲染如何串起来。",
      why: "游戏不是一次性页面，而是持续变化的状态机。没有循环，就没有连续交互和动画。",
      concepts: ["游戏循环持续推进状态", "输入、更新和渲染是常见三段", "固定步长和变步长各有代价", "帧率和时间步要区分"],
      example: "一帧里先读输入，再更新角色位置，最后把新的画面画出来。",
      practice: "画出一帧游戏循环的处理顺序，并标注每一步的作用。",
      checkpoint: "能说清楚为什么游戏要循环，而普通页面不一定需要。",
      projectEvidence: "提交游戏循环草图。",
      references: ["Game loop basics", "实时更新模型"]
    },
    {
      title: "时间步和帧率",
      duration: 44,
      level: "扩展入门",
      summary: "认识时间步、帧率和速度计算之间的关系，避免“跑得快慢不一致”。",
      why: "如果直接按帧数移动，机器快慢会影响游戏体验。时间步能让变化更稳定。",
      concepts: ["dt 表示时间差", "帧率是每秒画多少帧", "固定步长更稳", "变步长更灵活但更难控制"],
      example: "角色每秒移动 100 像素，不应依赖帧数，而应依赖真实时间差。",
      practice: "用伪代码写出基于时间步的移动逻辑。",
      checkpoint: "能解释为什么“每帧加 1”不一定对。",
      projectEvidence: "提交时间步逻辑说明。",
      references: ["Delta time", "帧率控制"]
    },
    {
      title: "输入处理和反馈",
      duration: 46,
      level: "扩展入门",
      summary: "把键盘、鼠标或手柄输入接进循环，并确保玩家能立刻感知反馈。",
      why: "游戏的手感来自输入到反馈的延迟。输入处理不清，操作就会发飘。",
      concepts: ["输入采样要稳定", "状态变化要立刻反馈", "连续按键和离散按键不同", "输入映射方便重绑定"],
      example: "按下方向键后角色开始移动，同时播放脚步或高亮状态。",
      practice: "为一个角色控制方案设计输入映射表和反馈列表。",
      checkpoint: "能说出输入链路哪里最容易出迟滞。",
      projectEvidence: "提交输入映射表。",
      references: ["Input mapping", "控制反馈基础"]
    },
    {
      title: "做一个可移动角色",
      duration: 44,
      level: "扩展入门",
      summary: "把循环、时间步和输入连起来，做出一个能动起来的最小角色。",
      why: "角色一旦动起来，游戏循环就从抽象变成具体。之后所有系统都更容易理解。",
      concepts: ["位置是状态的一部分", "速度决定每帧位移", "边界限制防止越界", "反馈能让移动更清晰"],
      example: "角色按住右键持续移动，松开后停止，并在边界处阻止继续前进。",
      practice: "实现一个只会水平移动的角色流程图。",
      checkpoint: "能把输入、速度、位置和边界放到一个逻辑里讲清楚。",
      projectEvidence: "提交角色移动示意图。",
      references: ["Movement basics", "游戏状态基础"]
    }
  ],
  [
    {
      title: "场景为什么要分层",
      duration: 44,
      level: "扩展入门",
      summary: "认识场景、UI、关卡和状态之间的关系，避免所有东西挤在一个文件里。",
      why: "游戏复杂后，菜单、关卡和结算页会反复出现。分层和状态机能让切换更稳。",
      concepts: ["场景表示一个交互状态", "UI 层和玩法层可以分开", "关卡数据不等于代码", "切换场景时要清理旧状态"],
      example: "主菜单、游戏中和结算页是三个场景，分别显示不同内容和交互。",
      practice: "列出一个小游戏的 3 个场景，并说明每个场景负责什么。",
      checkpoint: "能区分场景、关卡和界面。",
      projectEvidence: "提交场景划分表。",
      references: ["Scene management", "UI layering"]
    },
    {
      title: "状态机怎么帮关卡切换",
      duration: 46,
      level: "扩展入门",
      summary: "用状态机表达菜单、游戏中、暂停、失败和胜利之间的切换。",
      why: "状态机能让切换关系可读、可测，也能减少乱跳状态。",
      concepts: ["状态定义当前行为", "事件触发状态迁移", "非法迁移要拒绝", "状态图比口头描述更清楚"],
      example: "玩家死亡后从 `playing` 切到 `failed`，再按重试返回 `playing`。",
      practice: "画一个包含至少 5 个状态的游戏状态机。",
      checkpoint: "能说清楚状态和事件的对应关系。",
      projectEvidence: "提交状态机图。",
      references: ["Finite state machine", "游戏流程控制"]
    },
    {
      title: "关卡数据别写死",
      duration: 48,
      level: "扩展入门",
      summary: "把关卡、敌人、道具和触发器做成数据，而不是堆在代码里。",
      why: "数据驱动能让关卡调整更快，也更容易做编辑器和版本管理。",
      concepts: ["数据和代码分离", "关卡配置可迭代", "编辑器能提升制作效率", "版本控制帮助回退"],
      example: "关卡中敌人的位置、速度和生成时机来自配置文件，而不是手写在逻辑里。",
      practice: "把一个关卡的固定内容改写成数据表。",
      checkpoint: "能说明为什么数据驱动比硬编码更好改。",
      projectEvidence: "提交关卡数据样例。",
      references: ["Data-driven design", "关卡配置基础"]
    },
    {
      title: "做一个可切换场景",
      duration: 44,
      level: "扩展入门",
      summary: "完成一个能在菜单、关卡和结果之间切换的最小结构。",
      why: "场景切换是游戏结构的第一道门。做出来之后，后面所有模块都能往里面加。",
      concepts: ["场景入口和退出要清晰", "切换时要保存必要状态", "公共资源要复用", "按钮和键盘都可触发切换"],
      example: "菜单点击开始后进入关卡，结束后返回结果页，再从结果页回到菜单。",
      practice: "设计一个三场景切换流程。",
      checkpoint: "能解释场景切换前后状态要怎么保留。",
      projectEvidence: "提交场景切换流程图。",
      references: ["Scene switch", "状态保存基础"]
    }
  ],
  [
    {
      title: "2D 渲染的基本顺序",
      duration: 44,
      level: "扩展进阶",
      summary: "理解二维画面从背景到角色再到 UI 的绘制顺序。",
      why: "渲染顺序决定了谁挡住谁、谁在前谁在后。顺序乱了，画面就会怪。",
      concepts: ["层级决定前后关系", "背景先画，前景后画", "UI 通常单独层", "重绘代价要控制"],
      example: "先画地图，再画角色，再画血条和分数。",
      practice: "为一张 2D 画面列出绘制顺序并说明原因。",
      checkpoint: "能说清楚为什么 UI 往往最后画。",
      projectEvidence: "提交渲染顺序图。",
      references: ["2D rendering basics", "Layering"]
    },
    {
      title: "3D 资源和模型",
      duration: 46,
      level: "扩展进阶",
      summary: "认识模型、贴图、材质和资源加载之间的关系。",
      why: "3D 不是只会画一个模型。资源组织和加载方式会直接影响性能和开发体验。",
      concepts: ["模型描述几何结构", "贴图提供表面细节", "材质控制外观", "资源加载要可管理"],
      example: "角色模型、武器贴图和材质参数分开管理，方便替换和复用。",
      practice: "把一个角色资源拆成模型、贴图和材质三部分。",
      checkpoint: "能区分模型和贴图的职责。",
      projectEvidence: "提交资源拆解表。",
      references: ["3D asset basics", "Resource management"]
    },
    {
      title: "资源加载和缓存",
      duration: 48,
      level: "扩展进阶",
      summary: "把纹理、音频和场景资源做成可加载、可缓存、可释放的流程。",
      why: "游戏资源大、加载多，管理不好就会卡顿、爆内存或切场景时出问题。",
      concepts: ["懒加载减少首屏压力", "缓存减少重复开销", "释放资源避免泄漏", "预加载提升体验"],
      example: "进入关卡前预载地图和角色资源，切换时只释放不再使用的内容。",
      practice: "给一个关卡设计资源加载顺序。",
      checkpoint: "能说明哪些资源该预加载，哪些可以晚一点再取。",
      projectEvidence: "提交资源加载表。",
      references: ["Loading strategy", "Memory budgeting"]
    },
    {
      title: "关卡编辑器雏形",
      duration: 44,
      level: "扩展进阶",
      summary: "把游戏内容变成可编辑的数据工具，而不是只能改代码。",
      why: "编辑器是游戏内容生产力的核心。哪怕只做最小雏形，也能明显提升效率。",
      concepts: ["编辑器和运行时分离", "数据保存需要版本", "可视化配置减少错误", "导入导出方便协作"],
      example: "关卡编辑器可以拖拽敌人和道具，然后导出 JSON 给游戏读取。",
      practice: "设计一个关卡编辑器最小功能集。",
      checkpoint: "能说出编辑器最先该支持什么。",
      projectEvidence: "提交编辑器功能草图。",
      references: ["Level editor basics", "Data export"]
    }
  ],
  [
    {
      title: "碰撞检测从哪里开始",
      duration: 44,
      level: "扩展进阶",
      summary: "认识方块碰撞、圆形碰撞和简单命中判定的基本思路。",
      why: "碰撞是动作和反馈的入口。没有碰撞，角色和敌人的关系就没法成立。",
      concepts: ["包围盒最常见", "圆形更适合部分运动对象", "命中判定需要稳定边界", "碰撞结果要能驱动反馈"],
      example: "角色和墙体用矩形碰撞，子弹和敌人用更简化的命中判定。",
      practice: "为两个对象选择合适的碰撞方式，并说明原因。",
      checkpoint: "能说出为什么碰撞检测不一定要非常精细。",
      projectEvidence: "提交碰撞方式对比表。",
      references: ["Collision basics", "Hit detection"]
    },
    {
      title: "音频和节奏反馈",
      duration: 46,
      level: "扩展进阶",
      summary: "把音效和节奏反馈纳入游戏体验，而不是事后随便补。",
      why: "声音是游戏反馈的重要一半。操作、命中、失败和胜利都需要音频提示。",
      concepts: ["音效增强动作感", "背景音乐营造节奏", "音量分层避免干扰", "静音和开关也属于体验"],
      example: "跳跃、碰撞和得分分别播放不同音效，帮助玩家理解动作结果。",
      practice: "给一个小游戏列出 5 个音频反馈点。",
      checkpoint: "能说明哪类事件应该有声音，哪类不该太吵。",
      projectEvidence: "提交音频反馈清单。",
      references: ["Game audio basics", "Feedback design"]
    },
    {
      title: "命中反馈和粒子",
      duration: 48,
      level: "扩展进阶",
      summary: "用闪烁、粒子、震动和分数变化，让玩家立刻知道发生了什么。",
      why: "没有反馈的命中像没打中。反馈越清楚，玩家越容易理解规则和节奏。",
      concepts: ["视觉反馈帮助确认命中", "粒子可增强瞬间感", "屏幕震动要克制", "反馈不能盖过主操作"],
      example: "敌人被击中时短暂闪白并喷出粒子，再减少血量。",
      practice: "设计一次命中后的三层反馈：视觉、音频、数值。",
      checkpoint: "能把反馈和规则区分开。",
      projectEvidence: "提交命中反馈说明。",
      references: ["FX basics", "Game feel"]
    },
    {
      title: "交互体验复盘",
      duration: 44,
      level: "扩展进阶",
      summary: "把碰撞、音频和反馈连成一套可解释的体验链路。",
      why: "游戏体验不是单点功能，而是动作、结果和反馈是否同步。",
      concepts: ["反馈要及时", "冲突提示要明确", "失败状态也要有表现", "复盘时看玩家感受"],
      example: "玩家撞墙后立即停住、播放提示音并显示轻微抖动，让失败原因清晰可见。",
      practice: "复盘一次交互链路，写出有哪些反馈是多余的、哪些是缺失的。",
      checkpoint: "能解释体验问题出在哪个环节。",
      projectEvidence: "提交交互复盘表。",
      references: ["UX in games", "Feedback loops"]
    }
  ],
  [
    {
      title: "性能瓶颈从哪看",
      duration: 44,
      level: "扩展交付",
      summary: "从帧率、CPU、GPU 和资源占用看游戏是否真的卡顿。",
      why: "优化不能只凭感觉。先看瓶颈在哪一层，再决定是算法、资源还是渲染问题。",
      concepts: ["帧率是结果，不是原因", "CPU 和 GPU 可能分别卡", "资源过多会拖慢加载", "先测量再优化"],
      example: "某关卡掉帧并不是渲染太复杂，而是每帧都在重复计算大量路径。",
      practice: "给一张性能报告列出 3 个可能瓶颈，并写出验证方式。",
      checkpoint: "能从现象反推瓶颈类型。",
      projectEvidence: "提交性能问题分析表。",
      references: ["Profiler basics", "Performance diagnosis"]
    },
    {
      title: "打包和平台差异",
      duration: 46,
      level: "扩展交付",
      summary: "理解为什么同一个游戏在不同平台上的打包方式和限制不同。",
      why: "开发能跑不等于发布能跑。平台、权限和资源路径差异都要提前考虑。",
      concepts: ["构建产物要和平台匹配", "资源路径可能不同", "依赖库和运行时要检查", "平台限制影响输入和音频"],
      example: "桌面版和 Web 版的资源路径、字体加载和音频支持方式可能完全不同。",
      practice: "为一个小游戏列出两个平台的打包差异。",
      checkpoint: "能说出发布前要检查哪些平台问题。",
      projectEvidence: "提交打包检查清单。",
      references: ["Build pipeline basics", "Platform notes"]
    },
    {
      title: "发布前最后一轮检查",
      duration: 48,
      level: "扩展交付",
      summary: "在发布前确认资源、关卡、按键、声音和错误处理都能过关。",
      why: "游戏发布时最怕遗漏一个小错误就让体验崩掉。最后检查能把明显问题先拦住。",
      concepts: ["检查清单能防遗漏", "试玩路径要覆盖核心功能", "错误状态也要测试", "版本说明要清楚"],
      example: "发布前跑一次完整流程：开始、通关、失败、重试、退出。",
      practice: "写一份小游戏发布前的验收清单。",
      checkpoint: "能按清单自行复查一次完整发布。",
      projectEvidence: "提交发布检查表。",
      references: ["Release checklist", "QA basics"]
    },
    {
      title: "游戏项目交付清单",
      duration: 50,
      level: "扩展交付",
      summary: "把源码、资源、说明、操作和已知问题整理成完整交付包。",
      why: "游戏项目交付要能运行、能试玩、能复盘。没有文档，后续很难接手。",
      concepts: ["README 是入口", "资源说明要完整", "已知问题要可见", "复盘能帮助下次迭代"],
      example: "交付包包含玩法说明、运行方式、控制键位、资源来源和性能限制。",
      practice: "为一个小游戏写交付 README，至少包含 8 个小节。",
      checkpoint: "别人可以照文档启动并理解游戏怎么操作。",
      projectEvidence: "提交交付 README 和复盘摘要。",
      references: ["Game handoff guide", "README checklist"]
    }
  ]
];

extensionCourses.push(...buildExtensionCourses("GAME", gameExtensionLessons));

const cloudExtensionLessons = [
  [
    {
      title: "Linux 上先看什么",
      duration: 42,
      level: "扩展入门",
      summary: "从文件、进程、端口和日志入手，建立对 Linux 服务环境的第一印象。",
      why: "云计算和平台工程离不开 Linux。先会看系统状态，后面的容器、编排和观测才有落点。",
      concepts: ["文件和目录是基本组织单位", "进程承载服务执行", "端口反映网络暴露面", "日志记录系统行为"],
      example: "服务报错时先看进程是否活着、端口是否监听、日志是否持续输出。",
      practice: "对一台 Linux 机器写出你会优先检查的 5 个地方。",
      checkpoint: "能按文件、进程、端口、日志去找问题。",
      projectEvidence: "提交 Linux 初查清单。",
      references: ["Linux 基础命令", "系统诊断入门"]
    },
    {
      title: "进程、端口和日志",
      duration: 46,
      level: "扩展入门",
      summary: "学会把一个服务的运行状态从进程、端口和日志三个维度拼起来看。",
      why: "服务不可用时，单看某一处不够。要把系统状态拼成完整链路。",
      concepts: ["进程决定是否在跑", "端口决定是否在听", "日志决定发生过什么", "三者要互相印证"],
      example: "一个 Web 服务进程在跑，但端口没有监听，日志里显示是配置加载失败。",
      practice: "选一个服务场景，列出进程、端口和日志各自能告诉你什么。",
      checkpoint: "能根据三类证据判断服务到底卡在哪。",
      projectEvidence: "提交服务状态分析表。",
      references: ["ss/netstat", "journalctl 基础"]
    },
    {
      title: "一次服务不可用排查",
      duration: 48,
      level: "扩展入门",
      summary: "把“服务打不开”拆成可排查的几个层次，而不是只看一个报错页面。",
      why: "排障需要顺序。先确认主机、再确认进程、再确认网络、最后确认应用配置。",
      concepts: ["主机是否在线", "进程是否崩溃", "网络是否阻断", "应用是否配置错误"],
      example: "页面 502 时，先看反向代理，再看后端进程，再看配置和日志。",
      practice: "写出一次服务不可用的排查顺序和每一步的判断条件。",
      checkpoint: "能沿着层次逐步缩小问题。",
      projectEvidence: "提交故障排查流程图。",
      references: ["故障排查基础", "服务可用性"]
    },
    {
      title: "诊断报告怎么写",
      duration: 44,
      level: "扩展入门",
      summary: "把一次系统排查写成别人能复核、能复用的报告。",
      why: "报告是把临时判断变成可积累知识的关键。没有报告，问题就只是在脑子里。",
      concepts: ["先写结论再写证据", "时间线帮助回放", "修复建议要具体", "未确认项也要列出"],
      example: "报告中记录主机状态、进程变化、网络端口和最终根因。",
      practice: "写一页服务诊断报告，至少包含现象、证据、结论和建议。",
      checkpoint: "能让别人看完就知道你怎么定位到根因。",
      projectEvidence: "提交诊断报告草稿。",
      references: ["Incident report basics", "时间线写法"]
    }
  ],
  [
    {
      title: "容器为什么有用",
      duration: 42,
      level: "扩展入门",
      summary: "从环境一致性、隔离和交付效率理解容器的价值。",
      why: "开发、测试和发布环境经常不一致。容器把运行环境固定下来，减少“我这里能跑”的扯皮。",
      concepts: ["容器提供一致运行环境", "镜像是可分发的交付物", "隔离能减少互相影响", "镜像层影响构建效率"],
      example: "同一个服务在本地和服务器上都使用同一镜像，配置不同只通过环境变量切换。",
      practice: "写出容器解决了你熟悉的一个环境问题。",
      checkpoint: "能解释容器比直接复制文件更稳定的原因。",
      projectEvidence: "提交容器价值说明。",
      references: ["Docker 基础", "容器概念"]
    },
    {
      title: "Dockerfile 和镜像层",
      duration: 46,
      level: "扩展入门",
      summary: "认识镜像是怎么一点点构建出来的，以及为什么 Dockerfile 要写得稳定。",
      why: "镜像层决定了构建速度和缓存效果。Dockerfile 写不好，镜像就会变大、变慢、变脆。",
      concepts: ["每条指令可能形成一层", "缓存能加速重复构建", "基础镜像影响体积和安全", "构建上下文要尽量小"],
      example: "先装依赖再拷代码，可以让依赖层更容易命中缓存。",
      practice: "为一个简单服务写出 Dockerfile 的主要步骤。",
      checkpoint: "能解释为什么顺序会影响构建速度。",
      projectEvidence: "提交 Dockerfile 草案。",
      references: ["Dockerfile reference", "镜像层基础"]
    },
    {
      title: "供应链和镜像安全",
      duration: 48,
      level: "扩展入门",
      summary: "认识镜像来源、依赖版本和签名校验为什么会影响安全。",
      why: "云环境里的风险不只来自代码，还来自镜像和依赖供应链。",
      concepts: ["镜像来源要可信", "依赖版本要锁定", "扫描能发现已知风险", "签名或摘要帮助验证完整性"],
      example: "构建时锁定依赖版本，避免同一个 Dockerfile 因上游变化产生不同结果。",
      practice: "给一个镜像发布流程增加 3 个安全检查点。",
      checkpoint: "能说出镜像为什么也需要安全审查。",
      projectEvidence: "提交镜像安全清单。",
      references: ["Supply chain security", "镜像扫描基础"]
    },
    {
      title: "容器化一个小服务",
      duration: 44,
      level: "扩展入门",
      summary: "把一个最小服务装进容器，并让它能稳定启动和检查健康状态。",
      why: "只有把服务装进容器，容器化的价值才真正落地。",
      concepts: ["容器入口要明确", "配置通过环境传入", "健康检查能暴露故障", "日志要输出到标准流"],
      example: "一个课程 API 容器启动后暴露 8080 端口，并在 `/health` 返回健康状态。",
      practice: "为一个小项目写出容器化的最小步骤。",
      checkpoint: "能让别人按说明跑起容器并确认它活着。",
      projectEvidence: "提交容器运行说明。",
      references: ["Containerize app", "health check basics"]
    }
  ],
  [
    {
      title: "为什么需要编排",
      duration: 44,
      level: "扩展进阶",
      summary: "理解多个容器、多个副本和自动恢复为什么需要编排系统。",
      why: "单个容器能跑不代表服务能长期稳定运行。副本、调度和恢复都需要编排。",
      concepts: ["编排管理多个实例", "副本提高可用性", "调度决定放在哪台机器", "自愈减少人工干预"],
      example: "一个服务挂掉后，编排系统会拉起新副本替代它。",
      practice: "列出一个多容器服务为什么不能只靠手动启动。",
      checkpoint: "能说出编排比单容器多解决了什么。",
      projectEvidence: "提交编排需求表。",
      references: ["Orchestration basics", "Service resilience"]
    },
    {
      title: "服务发现与配置",
      duration: 46,
      level: "扩展进阶",
      summary: "让服务在变化环境里仍然能找到彼此，并正确读取配置。",
      why: "云环境里地址会变、实例会变，硬编码地址会让系统很脆弱。",
      concepts: ["服务发现避免写死地址", "配置和代码分离", "环境变量管理差异", "配置变更要可追踪"],
      example: "前端调用后端时不写死 IP，而是通过服务名或配置中心解析。",
      practice: "为一个小系统设计服务发现和配置方案。",
      checkpoint: "能解释为什么不能把服务器地址写死在代码里。",
      projectEvidence: "提交服务发现和配置草案。",
      references: ["service discovery", "config management"]
    },
    {
      title: "写一个 Compose 编排",
      duration: 48,
      level: "扩展进阶",
      summary: "用 Compose 把应用、数据库和依赖服务组合起来。",
      why: "Compose 是理解编排最好的入门桥梁。它能把多个服务的关系写清楚。",
      concepts: ["服务依赖要显式表达", "卷用于持久化", "网络用于服务互联", "环境变量用于差异配置"],
      example: "课程系统由 Web、API 和数据库三部分组成，Compose 能一键拉起。",
      practice: "写出一个三服务 Compose 结构，并说明每个服务的职责。",
      checkpoint: "能说明服务之间怎么连、怎么配、怎么持久化。",
      projectEvidence: "提交 Compose 草图。",
      references: ["Docker Compose docs", "multi-service setup"]
    },
    {
      title: "编排复盘",
      duration: 44,
      level: "扩展进阶",
      summary: "把副本、网络、配置和恢复步骤写成一份可检查的复盘材料。",
      why: "编排问题经常是系统性问题。复盘能帮助你看见配置、网络和依赖关系的全貌。",
      concepts: ["问题要分层看", "恢复流程要可复查", "副本和健康检查要记录", "变更要能回滚"],
      example: "某次扩容失败不是代码问题，而是配置映射和网络策略有冲突。",
      practice: "写一页编排故障复盘，标明问题、原因和修复。",
      checkpoint: "能用证据说明编排到底哪里错了。",
      projectEvidence: "提交编排复盘文档。",
      references: ["incident review", "orchestration notes"]
    }
  ],
  [
    {
      title: "日志、指标和追踪",
      duration: 44,
      level: "扩展交付",
      summary: "把三个观测信号拼成一条排障路径，知道什么时候该看哪一种。",
      why: "只看日志会很慢，只看指标会太粗，只看追踪又不够完整。三者要一起用。",
      concepts: ["日志记录细节", "指标看整体趋势", "追踪看请求链路", "三者需要关联 ID", "告警来自阈值和趋势"],
      example: "用户报错后先看指标异常，再用 trace 定位慢链路，最后用日志看具体参数。",
      practice: "为一个服务设计日志、指标和追踪的最小集合。",
      checkpoint: "能说出什么时候该看哪种信号。",
      projectEvidence: "提交观测方案表。",
      references: ["Observability basics", "Tracing fundamentals"]
    },
    {
      title: "设计一组告警",
      duration: 46,
      level: "扩展交付",
      summary: "把系统故障和性能问题转成可行动的告警，而不是噪音。",
      why: "告警太多会失效，太少又会漏事。设计告警要兼顾准确性和可执行性。",
      concepts: ["告警要对应可行动问题", "阈值要结合基线", "分级能减少噪音", "静默和聚合很重要"],
      example: "延迟持续上升、错误率异常和磁盘空间不足应分别进入不同告警级别。",
      practice: "给一个服务设计 3 条告警，并写出触发条件和处理动作。",
      checkpoint: "能说明每条告警响起后人应该做什么。",
      projectEvidence: "提交告警设计表。",
      references: ["alerting best practices", "SRE alert design"]
    },
    {
      title: "观测面板验收",
      duration: 48,
      level: "扩展交付",
      summary: "验证面板是不是能帮你快速定位问题，而不是只好看。",
      why: "观测系统的价值在于排障效率。面板如果不能指向根因，就只是图表集合。",
      concepts: ["面板要覆盖关键路径", "趋势和尖峰都要看", "链接到日志和 trace", "信息密度要适中"],
      example: "面板里同时显示请求量、错误率、延迟、CPU 和异常日志入口。",
      practice: "给一个小服务设计一页观测面板布局。",
      checkpoint: "能用面板定位问题，而不是只看热闹。",
      projectEvidence: "提交观测面板草图。",
      references: ["Dashboard design", "SRE dashboards"]
    },
    {
      title: "观测与故障闭环",
      duration: 44,
      level: "扩展交付",
      summary: "把告警、排障和复盘串成闭环，保证问题能被下一次更快发现。",
      why: "观测不是结束，复盘和修复才是闭环最后一步。",
      concepts: ["问题要能被记录", "修复要能验证", "复盘要转成行动项", "行动项要回到面板和告警"],
      example: "一次故障后新增了一个延迟告警和一个错误日志筛选面板，下一次更快发现问题。",
      practice: "写一份观测闭环说明，描述从发现到修复的整个过程。",
      checkpoint: "能把一次故障变成下一次更好发现的机制。",
      projectEvidence: "提交观测闭环记录。",
      references: ["incident loop", "feedback loop"]
    }
  ],
  [
    {
      title: "发布为什么会失败",
      duration: 44,
      level: "扩展交付",
      summary: "理解发布失败常见来自配置、兼容性、容量和流程，而不是只怪代码。",
      why: "发布是最容易引入问题的阶段。先知道失败来源，才能设计更稳的流程。",
      concepts: ["配置错误很常见", "兼容性问题会在发布时暴露", "容量不足会导致抖动", "流程缺少检查也会失败"],
      example: "新版本上线后报错，不一定是业务逻辑错，也可能是环境变量没配对。",
      practice: "列出一次发布失败的 4 个常见来源。",
      checkpoint: "能从现象判断失败是代码、配置还是容量问题。",
      projectEvidence: "提交发布故障清单。",
      references: ["Release failure modes", "deployment risks"]
    },
    {
      title: "灰度和回滚",
      duration: 46,
      level: "扩展交付",
      summary: "把发布拆成可观察、可暂停、可回退的步骤。",
      why: "发布不可逆很危险。灰度和回滚给系统留下后悔药。",
      concepts: ["灰度先放少量流量", "观察指标决定继续或停止", "回滚要预先演练", "版本切换要可控"],
      example: "新版本先给 10% 用户，若错误率升高就立即切回旧版本。",
      practice: "设计一套小服务灰度发布和回滚步骤。",
      checkpoint: "能说清楚出问题后怎么退回。",
      projectEvidence: "提交灰度流程图。",
      references: ["canary release", "rollback strategy"]
    },
    {
      title: "容量和成本",
      duration: 48,
      level: "扩展交付",
      summary: "学会根据流量、资源和账单判断系统是否需要扩容或降配。",
      why: "云平台不是无限资源。容量和成本决定系统能不能长期跑得住。",
      concepts: ["容量受流量影响", "成本要和价值对齐", "资源利用率要看趋势", "扩缩容策略要有边界"],
      example: "服务白天流量高、夜间低，可以根据趋势做自动伸缩。",
      practice: "为一个小服务写出容量和成本监控表。",
      checkpoint: "能用数据说明为什么要扩容或缩容。",
      projectEvidence: "提交容量分析表。",
      references: ["capacity planning", "cost monitoring"]
    },
    {
      title: "云项目交付清单",
      duration: 50,
      level: "扩展交付",
      summary: "把云服务、镜像、配置、观测和发布都整理成完整交付包。",
      why: "云项目的交付不是单一镜像，而是可以运行、观测和回滚的一整套系统。",
      concepts: ["README 是入口", "配置说明不能缺", "观测和告警要写明", "回滚和限制要可见"],
      example: "交付包包含 Compose、镜像说明、环境变量、健康检查、告警和回滚步骤。",
      practice: "写一份云服务交付 README，至少包含 8 个固定小节。",
      checkpoint: "别人能按文档启动并知道怎么观测和回退。",
      projectEvidence: "提交云项目交付文档。",
      references: ["cloud handoff guide", "SRE checklist"]
    }
  ]
];

extensionCourses.push(...buildExtensionCourses("CLOUD", cloudExtensionLessons));

// 扩展课程资料库：统一收口官方/权威链接，供每节扩展课复用。
const extensionReferenceLibrary = Object.freeze({
  "WEB-HTML-A11Y": { title: "MDN：HTML: A good basis for accessibility", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML" },
  "WEB-SEMANTIC": { title: "MDN Curriculum：Semantic HTML", url: "https://developer.mozilla.org/en-US/curriculum/core/semantic-html/" },
  "WEB-RESPONSIVE": { title: "MDN：Responsive web design", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design" },
  "WEB-FLEX": { title: "MDN：Flexbox", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox" },
  "WEB-GRID": { title: "MDN：CSS grid layout", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids" },
  "WEB-EVENTS": { title: "MDN：Event bubbling", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling" },
  "WEB-FETCH": { title: "MDN：Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" },
  "WEB-STORAGE": { title: "MDN：Web Storage API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API" },
  "WEB-SOP-CORS": { title: "MDN：Same-origin policy and CORS", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy" },
  "WEB-OPENAPI": { title: "OpenAPI Learn：Path Item / Parameters / Responses", url: "https://learn.openapis.org/" },
  "WEB-SESSION": { title: "OWASP：Session Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" },
  "WEB-LIGHTHOUSE": { title: "Chrome for Developers：Lighthouse", url: "https://developer.chrome.com/docs/lighthouse/" },
  "AI-JUPYTER": { title: "Project Jupyter Documentation", url: "https://docs.jupyter.org/en/stable/" },
  "AI-NUMPY": { title: "NumPy User Guide", url: "https://numpy.org/doc/stable/user/index.html" },
  "AI-PANDAS": { title: "pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/index.html" },
  "AI-PANDAS-DUP": { title: "pandas：Indexing and duplicate data", url: "https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html" },
  "AI-SPLIT": { title: "scikit-learn：train_test_split", url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html" },
  "AI-CV": { title: "scikit-learn：Cross-validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html" },
  "AI-METRICS": { title: "scikit-learn：Model evaluation", url: "https://scikit-learn.org/stable/modules/model_evaluation.html" },
  "AI-IMPORTANCE": { title: "scikit-learn：Permutation feature importance", url: "https://scikit-learn.org/stable/modules/permutation_importance.html" },
  "AI-PERSIST": { title: "scikit-learn：Model persistence", url: "https://scikit-learn.org/stable/model_persistence.html" },
  "AI-MLFLOW-DEPLOY": { title: "MLflow：Model Serving", url: "https://mlflow.org/docs/latest/ml/deployment/" },
  "AI-MLFLOW-REG": { title: "MLflow：Model Registry Workflows", url: "https://www.mlflow.org/docs/latest/ml/model-registry/workflow/" },
  "SEC-TM": { title: "OWASP：Threat Model Library", url: "https://owasp.org/www-project-threat-model-library/" },
  "SEC-TM-GUIDE": { title: "OWASP Developer Guide：Threat Modeling", url: "https://owasp.org/www-project-developer-guide/release/design/threat_modeling/" },
  "SEC-WSTG": { title: "OWASP WSTG：Input Validation Testing", url: "https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/" },
  "SEC-XSS": { title: "OWASP：XSS Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" },
  "SEC-SQLI": { title: "OWASP：SQL Injection Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" },
  "SEC-SESSION": { title: "OWASP WSTG：Session Management Testing", url: "https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/06-Session_Management_Testing/06-Testing_for_Logout_Functionality" },
  "SEC-GHIDRA": { title: "Ghidra", url: "https://github.com/NationalSecurityAgency/ghidra" },
  "SEC-YARA": { title: "YARA：Writing rules", url: "https://yara.readthedocs.io/en/stable/writingrules.html" },
  "SEC-SIGMA": { title: "Sigma Specification", url: "https://sigmahq.io/sigma-specification/" },
  "IOT-C": { title: "cppreference：C language", url: "https://en.cppreference.com/w/c/language" },
  "IOT-GNU-COMPILE": { title: "GNU C Manual：Compilation", url: "https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Compilation.html" },
  "IOT-GCC-LINK": { title: "GCC：Link Options", url: "https://gcc.gnu.org/onlinedocs/gcc/Link-Options.html" },
  "IOT-GCC-DEBUG": { title: "GCC：Debugging Options", url: "https://gcc.gnu.org/onlinedocs/ref/gcc/Debugging-Options.html" },
  "IOT-ZEPHYR-GPIO": { title: "Zephyr：GPIO interface", url: "https://docs.zephyrproject.org/latest/doxygen/html/group__gpio__interface.html" },
  "IOT-ZEPHYR-DRIVER": { title: "Zephyr：Device Driver Model", url: "https://docs.zephyrproject.org/latest/kernel/drivers/index.html" },
  "IOT-ZEPHYR-BINDINGS": { title: "Zephyr：Bindings index", url: "https://docs.zephyrproject.org/latest/build/dts/api/bindings.html" },
  "IOT-FREERTOS": { title: "FreeRTOS Documentation", url: "https://docs.freertos.org/" },
  "IOT-FREERTOS-SCHED": { title: "FreeRTOS：Task scheduling", url: "https://www.freertos.org/Documentation/02-Kernel/02-Kernel-features/01-Tasks-and-co-routines/04-Task-scheduling" },
  "GAME-GODOT-TREE": { title: "Godot：Using SceneTree", url: "https://docs.godotengine.org/en/stable/tutorials/scripting/scene_tree.html" },
  "GAME-GODOT-NODE": { title: "Godot：Node", url: "https://docs.godotengine.org/en/3.0/classes/class_node.html" },
  "GAME-MDN-TECH": { title: "MDN：Techniques for game development", url: "https://developer.mozilla.org/en-US/docs/Games/Techniques" },
  "GAME-MDN-COLLISION": { title: "MDN：Collision detection", url: "https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Collision_detection" },
  "GAME-UNITY-PROFILER": { title: "Unity Manual：Profiler overview", url: "https://docs.unity.cn/Manual/Profiler.html" },
  "GAME-UNITY-PHYSICS": { title: "Unity Manual：Physics Profiler module", url: "https://docs.unity.cn/Documentation/Manual/ProfilerPhysics.html" },
  "CLOUD-JOURNAL": { title: "systemd：journalctl", url: "https://www.freedesktop.org/software/systemd/man/latest/journalctl.html" },
  "CLOUD-SS": { title: "ss Linux man page", url: "https://linux.die.net/man/8/ss" },
  "CLOUD-DOCKERFILE": { title: "Docker：Dockerfile reference", url: "https://docs.docker.com/reference/dockerfile" },
  "CLOUD-DOCKER-BEST": { title: "Docker：Building best practices", url: "https://docs.docker.com/build/building/best-practices/" },
  "CLOUD-K8S-SERVICE": { title: "Kubernetes：Service", url: "https://kubernetes.io/docs/concepts/services-networking/service/" },
  "CLOUD-K8S-CONFIG": { title: "Kubernetes：ConfigMap", url: "https://kubernetes.io/docs/concepts/configuration/configmap/" },
  "CLOUD-K8S-SECRET": { title: "Kubernetes：Secrets good practices", url: "https://kubernetes.io/docs/concepts/security/secrets-good-practices/" },
  "CLOUD-K8S-DEPLOY": { title: "Kubernetes：Rolling update deployment", url: "https://kubernetes.io/docs/tasks/run-application/update-deployment-rolling/" },
  "CLOUD-OTEL": { title: "OpenTelemetry：What is OpenTelemetry?", url: "https://opentelemetry.io/docs/what-is-opentelemetry/" },
  "CLOUD-SRE-MON": { title: "Google SRE Workbook：Monitoring", url: "https://sre.google/workbook/monitoring/" },
  "CLOUD-SRE-CANARY": { title: "Google SRE Workbook：Canarying Releases", url: "https://sre.google/workbook/canarying-releases/" }
});

// 扩展课程按方向和模块收口资料，避免 120 节课各自重复写 URL。
const extensionModuleReferenceMap = Object.freeze({
  WEB: [
    { sourceIds: ["WEB-SEMANTIC", "WEB-HTML-A11Y", "WEB-RESPONSIVE", "WEB-FLEX", "WEB-GRID"] },
    { sourceIds: ["WEB-EVENTS", "WEB-STORAGE", "WEB-SOP-CORS", "WEB-LIGHTHOUSE"] },
    { sourceIds: ["WEB-FETCH", "WEB-OPENAPI", "WEB-SESSION", "WEB-SOP-CORS"] },
    { sourceIds: ["WEB-STORAGE", "WEB-SOP-CORS", "WEB-SESSION", "WEB-OPENAPI"] },
    { sourceIds: ["WEB-LIGHTHOUSE", "WEB-RESPONSIVE", "WEB-HTML-A11Y", "WEB-FETCH"] }
  ],
  AI: [
    { sourceIds: ["AI-JUPYTER", "AI-NUMPY", "AI-PANDAS"] },
    { sourceIds: ["AI-PANDAS", "AI-PANDAS-DUP", "AI-NUMPY"] },
    { sourceIds: ["AI-SPLIT", "AI-CV", "AI-METRICS"] },
    { sourceIds: ["AI-METRICS", "AI-CV", "AI-IMPORTANCE"] },
    { sourceIds: ["AI-PERSIST", "AI-MLFLOW-DEPLOY", "AI-MLFLOW-REG"] }
  ],
  SEC: [
    { sourceIds: ["SEC-TM", "SEC-TM-GUIDE"] },
    { sourceIds: ["SEC-WSTG", "SEC-XSS", "SEC-SQLI"] },
    { sourceIds: ["SEC-SESSION", "WEB-FETCH", "WEB-SOP-CORS"] },
    { sourceIds: ["SEC-GHIDRA", "SEC-YARA"] },
    { sourceIds: ["SEC-SIGMA", "SEC-YARA", "SEC-WSTG"] }
  ],
  IOT: [
    { sourceIds: ["IOT-C", "IOT-GNU-COMPILE", "IOT-GCC-LINK", "IOT-GCC-DEBUG"] },
    { sourceIds: ["IOT-ZEPHYR-GPIO", "IOT-ZEPHYR-DRIVER"] },
    { sourceIds: ["IOT-ZEPHYR-BINDINGS", "IOT-ZEPHYR-DRIVER", "IOT-ZEPHYR-GPIO"] },
    { sourceIds: ["IOT-FREERTOS", "IOT-FREERTOS-SCHED"] },
    { sourceIds: ["IOT-FREERTOS", "IOT-ZEPHYR-DRIVER", "CLOUD-SRE-CANARY"] }
  ],
  GAME: [
    { sourceIds: ["GAME-GODOT-TREE", "GAME-GODOT-NODE"] },
    { sourceIds: ["GAME-GODOT-TREE", "GAME-GODOT-NODE"] },
    { sourceIds: ["GAME-MDN-TECH", "GAME-GODOT-TREE"] },
    { sourceIds: ["GAME-MDN-COLLISION", "GAME-MDN-TECH", "GAME-UNITY-PHYSICS"] },
    { sourceIds: ["GAME-UNITY-PROFILER", "GAME-UNITY-PHYSICS"] }
  ],
  CLOUD: [
    { sourceIds: ["CLOUD-JOURNAL", "CLOUD-SS"] },
    { sourceIds: ["CLOUD-DOCKERFILE", "CLOUD-DOCKER-BEST", "CLOUD-K8S-SECRET"] },
    { sourceIds: ["CLOUD-K8S-SERVICE", "CLOUD-K8S-CONFIG", "CLOUD-K8S-SECRET"] },
    { sourceIds: ["CLOUD-OTEL", "CLOUD-SRE-MON"] },
    { sourceIds: ["CLOUD-K8S-DEPLOY", "CLOUD-SRE-CANARY", "CLOUD-SRE-MON"] }
  ]
});

// 扩展课不同序号的教学重心，让第 1–4 课对应“概念、链路、动手、验收”。
const extensionLessonFocusCopy = Object.freeze([
  "第 1 课先抓概念边界，把术语放进真实问题里。",
  "第 2 课优先串工作流和数据流，避免只看定义不看链路。",
  "第 3 课把知识压成一个最小可完成任务。",
  "第 4 课用验收清单和作品证据收尾，形成闭环。"
]);

// WEB 方向的正文改写重点：优先借鉴官方文档，把教学顺序改成“结构 → 交互 → 契约 → 交付”。
const webTeachingBridgeMap = Object.freeze([
  {
    title: "语义结构与页面职责",
    lead: "参考 MDN 的语义 HTML、无障碍和响应式设计，这组课先把页面骨架讲清，再讲布局和交互为什么要依附结构。",
    focus: [
      "先定义页面里谁负责什么，再谈视觉排版。",
      "把 article、header、main、nav、form 当成职责标记，而不是装饰标签。",
      "练习要能说明结构变化会如何影响可访问性和后续维护。"
    ]
  },
  {
    title: "组件、状态与路由",
    lead: "参考事件冒泡、Web Storage、同源策略和 Lighthouse，这组课重点改写为“状态从哪来、去哪、什么时候保留”。",
    focus: [
      "组件不是抽象名词，而是把重复 UI 和状态边界拆开的方法。",
      "路由和状态要一起讲，不然学习者只会切页面，不会保存上下文。",
      "练习要把页面块、状态变化和浏览器历史串成一条链。"
    ]
  },
  {
    title: "接口设计与登录鉴权",
    lead: "参考 Fetch、OpenAPI 和 OWASP Session 资料，这组课要先讲字段契约，再讲登录态、跨域和异常处理。",
    focus: [
      "接口不是“能发请求”就算学会，而是先定义输入、输出、状态码和边界。",
      "登录、Token、Session、Cookie 要放在一次请求链路里解释。",
      "练习要能写出接口说明和异常用例，而不是只会调通一个成功请求。"
    ]
  },
  {
    title: "数据层、权限与缓存",
    lead: "参考 Web Storage、CORS、Session 和 OpenAPI，这组课改成从数据模型、权限边界到缓存一致性的一条线。",
    focus: [
      "先讲数据从哪里来、经过谁、最后落在哪里。",
      "缓存、分页、筛选和权限要放在同一个数据流里理解。",
      "练习要能复盘一次新增、修改或查询操作的完整数据路径。"
    ]
  },
  {
    title: "测试、性能与上线",
    lead: "参考 Lighthouse、响应式设计、无障碍和 Fetch，这组课把重点改成“如何证明它能交付”，而不是只看它能打开。",
    focus: [
      "测试、性能和可访问性都要用可验证证据来讲。",
      "上线前必须把环境变量、回滚和问题记录放到同一份交付清单里。",
      "练习要产出 README、截图、检查项和回滚说明。"
    ]
  }
]);

// AI 方向的正文改写重点：借鉴 Jupyter、NumPy、pandas、scikit-learn 和 MLflow，把 AI 学习改成“数据证据 → 实验方法 → 模型交付”。
const aiTeachingBridgeMap = Object.freeze([
  {
    title: "Python 数据栈与 Notebook",
    lead: "参考 Jupyter、NumPy 和 pandas 官方资料，这组课先讲清 Notebook、脚本、数组和表格分别解决什么问题。",
    focus: [
      "Notebook 用来保留探索过程，脚本用来沉淀可重复执行的步骤。",
      "NumPy 数组强调同类型、批量计算；pandas 表格强调带列名和索引的数据分析。",
      "练习要能从读取 CSV、检查字段到写出可复现分析笔记。"
    ]
  },
  {
    title: "数据清洗、特征与可视化",
    lead: "参考 pandas 的数据处理资料，这组课把脏数据、缺失值、重复值、异常值和特征构造放在同一条质量链里。",
    focus: [
      "清洗不是为了让表格好看，而是为了让后续统计和训练不被坏数据带偏。",
      "缺失、重复和异常值要先记录判断依据，再选择删除、填充或保留。",
      "练习要产出数据质量报告，而不是只跑出一张图。"
    ]
  },
  {
    title: "监督学习与模型选择",
    lead: "参考 scikit-learn 的数据集拆分、交叉验证和模型评估资料，这组课优先建立实验边界和基线意识。",
    focus: [
      "训练集、验证集和测试集承担不同职责，混用会让指标失真。",
      "基线模型用于回答“现在的复杂方案到底有没有更好”。",
      "练习要能用指标比较模型，而不是只说模型跑通。"
    ]
  },
  {
    title: "评估、偏差与误差分析",
    lead: "参考 scikit-learn 的模型评估、交叉验证和特征重要性资料，这组课把准确率、过拟合、欠拟合和错误样本放在一起诊断。",
    focus: [
      "准确率只是一个入口，类别不均衡、业务代价和错误类型会改变判断。",
      "过拟合和数据泄漏通常不是代码语法错，而是实验设计边界错。",
      "练习要回看错误样本，写出模型为什么错、下一步如何验证。"
    ]
  },
  {
    title: "模型服务、监控与再训练",
    lead: "参考 scikit-learn 模型持久化和 MLflow 模型服务/注册资料，这组课把模型从 Notebook 带到可交付接口和版本管理。",
    focus: [
      "模型交付要同时保存模型文件、依赖版本、输入输出格式和评估记录。",
      "服务化不是只开一个接口，还要记录请求、响应、版本和异常。",
      "练习要产出模型应用交付清单，说明如何部署、观测和回退。"
    ]
  }
]);

// SEC 方向的正文改写重点：借鉴 OWASP、Ghidra、YARA 和 Sigma，把安全学习改成“证据 → 风险 → 修复 → 复测”的闭环。
const secTeachingBridgeMap = Object.freeze([
  {
    title: "威胁建模与资产梳理",
    lead: "参考 OWASP 威胁建模资料，这组课先画清系统边界、资产、入口和信任边界，再讨论风险优先级。",
    focus: [
      "先列资产、数据流和外部入口，再判断哪里可能出问题。",
      "资产不只是服务器，也包括账号、数据、接口、日志和配置。",
      "练习要产出风险清单、影响判断和修复顺序。"
    ]
  },
  {
    title: "Web 漏洞与安全编码",
    lead: "参考 OWASP WSTG、XSS 和 SQL Injection Cheat Sheet，这组课把输入、输出、身份、权限和修复验收放到同一条链路。",
    focus: [
      "XSS、SQLi 和越权不要孤立背概念，要回到输入来源、输出上下文和权限边界。",
      "测试用例要覆盖正常输入、异常输入、边界输入和越权访问。",
      "修复建议必须能落到编码规则、配置项或复测步骤。"
    ]
  },
  {
    title: "协议、认证与日志取证",
    lead: "参考 OWASP Session Management 与 Web 请求资料，这组课用一次 HTTP 请求串起 Cookie、Token、Session、状态码和日志时间线。",
    focus: [
      "一次请求要保留 URL、方法、状态码、关键请求头、Cookie/Token 和时间点。",
      "Cookie、Token、Session 要放在认证链路里讲，避免只背字段名。",
      "练习要从日志还原一次请求过程，而不是只看单条孤立日志。"
    ]
  },
  {
    title: "二进制基础与逆向阅读",
    lead: "参考 Ghidra 与 YARA 资料，这组课先训练证据采集：文件格式、字符串、导入、函数和控制流互相印证。",
    focus: [
      "初学逆向先记录观察事实，不急着猜结论。",
      "字符串、导入表、函数调用和控制流要互相验证，避免单点误判。",
      "练习要写逆向笔记，区分已观察事实、推断和未验证点。"
    ]
  },
  {
    title: "检测规则、报告与修复闭环",
    lead: "参考 Sigma、YARA 和 OWASP WSTG，这组课把 IOC、规则、误报漏报、报告和复测整理成可交付安全闭环。",
    focus: [
      "检测规则要写清数据源、字段、匹配条件和上下文证据。",
      "误报和漏报是规则质量的一部分，需要记录样本、原因和调整依据。",
      "报告必须包含证据、影响、复现、修复建议和复测结论。"
    ]
  }
]);

// IOT 方向的正文改写重点：借鉴 C/GCC、Zephyr 和 FreeRTOS，把嵌入式学习改成“硬件接口 → 时序证据 → 可靠性 → 交付”的闭环。
const iotTeachingBridgeMap = Object.freeze([
  {
    title: "C 语言、编译与内存",
    lead: "参考 cppreference、GNU C 和 GCC 资料，这组课先把 C 代码如何变成目标文件、可执行文件和可调试程序讲清楚。",
    focus: [
      "C 语言学习要同时看语法、对象生命周期、内存位置和编译结果。",
      "编译、链接、调试信息不是附加知识，而是定位嵌入式问题的入口。",
      "练习要能解释一个变量在源码、目标文件和运行时分别在哪里。"
    ]
  },
  {
    title: "GPIO、串口与调试工具",
    lead: "参考 Zephyr GPIO 与设备驱动模型，这组课把引脚配置、输入输出、电平变化和串口日志放进同一条观察链。",
    focus: [
      "GPIO 不只是开关灯，要先确认方向、上下拉、电平和设备抽象。",
      "串口日志要记录时间、事件和状态变化，方便复盘硬件交互。",
      "练习要用日志证明输入触发、程序处理和输出变化确实发生。"
    ]
  },
  {
    title: "传感器采集与硬件通信",
    lead: "参考 Zephyr 设备树绑定、驱动和 GPIO 资料，这组课先讲数据从传感器到程序变量的路径，再讲采样、校准和异常。",
    focus: [
      "I2C、SPI、UART 要按连线、时序、地址或片选、数据帧来理解。",
      "传感器数据要记录单位、采样频率、校准方式和异常值处理。",
      "练习要产出采集记录和异常说明，而不是只显示一个数字。"
    ]
  },
  {
    title: "任务调度、RTOS 与功耗",
    lead: "参考 FreeRTOS 任务模型和调度资料，这组课把任务优先级、延迟、抢占、空闲时间和功耗放在一起看。",
    focus: [
      "RTOS 不是让代码更复杂，而是让多个实时任务有明确调度规则。",
      "延迟问题要同时看任务优先级、阻塞等待、中断和共享资源。",
      "练习要写出一次延迟或功耗复盘，说明观察证据和调整依据。"
    ]
  },
  {
    title: "联网、固件更新与设备安全",
    lead: "参考 FreeRTOS、Zephyr 驱动模型和灰度发布思想，这组课把设备联网、固件更新、回滚和安全边界放进交付清单。",
    focus: [
      "设备联网要先确认身份、配置、网络异常和离线状态怎么处理。",
      "固件更新的核心风险是失败后能否恢复、版本能否追踪、配置能否保留。",
      "练习要产出设备交付清单，包含版本、更新、回滚、日志和安全边界。"
    ]
  }
]);

// GAME 方向的正文改写重点：借鉴 Godot、MDN Game 和 Unity Profiler，把游戏学习改成“循环 → 反馈 → 性能预算 → 发布”的闭环。
const gameTeachingBridgeMap = Object.freeze([
  {
    title: "游戏循环、时间步与输入",
    lead: "参考 Godot SceneTree 与 Node 生命周期，这组课先讲输入、更新、物理和渲染如何在每一帧协作。",
    focus: [
      "游戏循环要拆成输入采集、状态更新、物理处理和画面渲染。",
      "帧率和固定时间步要分开理解，避免移动速度跟机器性能绑定。",
      "练习要做一个可移动角色，并说明输入到反馈的完整链路。"
    ]
  },
  {
    title: "场景、状态机与关卡数据",
    lead: "参考 Godot 场景树和节点模型，这组课把场景层级、状态切换和关卡数据拆开讲，避免所有逻辑写死在一个脚本里。",
    focus: [
      "场景树用来表达对象归属和生命周期，不只是编辑器里的文件列表。",
      "状态机用于管理菜单、游玩、暂停、胜利和失败等明确状态。",
      "练习要能切换场景，并把关卡数据从逻辑代码里拆出来。"
    ]
  },
  {
    title: "2D / 3D 渲染与资源管理",
    lead: "参考 MDN 游戏开发技术和 Godot 场景组织，这组课把渲染顺序、相机、资源加载和缓存放进同一个性能视角。",
    focus: [
      "2D 先看绘制顺序、坐标和层级，3D 再看模型、材质、灯光和相机。",
      "资源加载要考虑文件大小、复用、缓存和释放时机。",
      "练习要做一个关卡编辑雏形，并记录资源来源和加载方式。"
    ]
  },
  {
    title: "碰撞、音频与反馈",
    lead: "参考 MDN 碰撞检测和 Unity Physics Profiler，这组课把碰撞盒、判定、音效、粒子和手感反馈放在一起调。",
    focus: [
      "碰撞检测要先确认形状、坐标、触发时机和判定结果。",
      "音频、闪烁、震动和粒子是反馈系统，不是最后随手加的装饰。",
      "练习要复盘一次交互体验，说明命中、失败和奖励反馈是否清楚。"
    ]
  },
  {
    title: "性能分析、打包与发布",
    lead: "参考 Unity Profiler 资料，这组课把 CPU、GPU、内存、物理和打包平台差异整理成发布前验收清单。",
    focus: [
      "性能瓶颈要用 Profiler 或计数证据确认，不凭肉眼猜。",
      "发布前要检查平台差异、输入方式、资源路径、分辨率和存档位置。",
      "练习要产出游戏项目交付清单，包含性能截图、已知问题和回滚版本。"
    ]
  }
]);

// CLOUD 方向的正文改写重点：借鉴 Linux、Docker、Kubernetes、OpenTelemetry 和 SRE Workbook，把云平台学习改成“诊断 → 封装 → 编排 → 观测 → 发布回滚”的闭环。
const cloudTeachingBridgeMap = Object.freeze([
  {
    title: "Linux、网络与进程诊断",
    lead: "参考 journalctl 与 ss 资料，这组课先训练服务不可用时的第一轮证据：进程、端口、日志和时间线。",
    focus: [
      "排障先确认服务是否运行、端口是否监听、日志是否有错误。",
      "日志要按时间线串起来，避免只截取最后一行报错。",
      "练习要写诊断报告，说明现象、证据、判断和下一步验证。"
    ]
  },
  {
    title: "容器、镜像与供应链",
    lead: "参考 Dockerfile Reference、Docker 构建最佳实践和 Kubernetes Secret 建议，这组课把运行环境封装、镜像层和密钥边界放在一起讲。",
    focus: [
      "容器解决的是运行环境一致性，不是自动让应用变可靠。",
      "Dockerfile 要关注基础镜像、层缓存、依赖安装和启动命令。",
      "练习要容器化一个小服务，并列出镜像、端口、配置和敏感信息边界。"
    ]
  },
  {
    title: "编排、服务发现与配置",
    lead: "参考 Kubernetes Service、ConfigMap 和 Secret 资料，这组课把服务发现、配置注入和敏感配置边界放进编排模型。",
    focus: [
      "编排系统要管理副本、服务暴露、配置变更和故障恢复。",
      "Service 解决访问稳定性，ConfigMap/Secret 解决配置和敏感信息注入。",
      "练习要写一个最小编排示例，并说明每个对象承担的职责。"
    ]
  },
  {
    title: "日志、指标、追踪与告警",
    lead: "参考 OpenTelemetry 和 SRE Workbook Monitoring，这组课把日志、指标、追踪、SLI 和告警规则放进观测闭环。",
    focus: [
      "日志回答发生了什么，指标回答趋势如何，追踪回答请求经过哪里。",
      "告警要围绕用户影响和服务目标设计，避免把所有错误都变成噪音。",
      "练习要产出观测面板验收项和一条可解释告警规则。"
    ]
  },
  {
    title: "发布、回滚、容量与成本",
    lead: "参考 Kubernetes 滚动更新和 SRE Canarying Releases，这组课把发布、灰度、回滚、容量和成本放进上线风险控制。",
    focus: [
      "发布不是把新版本推上去，而是控制影响范围并保留回滚路径。",
      "灰度要定义观察指标、放量步骤、停止条件和负责人。",
      "练习要产出云项目交付清单，包含发布步骤、回滚方案、容量假设和成本观察。"
    ]
  }
]);

// 扩展方向到正文桥接配置的索引表，新增方向时只需补映射，避免渲染函数继续堆多层判断。
const extensionTeachingBridgeMaps = Object.freeze({
  WEB: webTeachingBridgeMap,
  AI: aiTeachingBridgeMap,
  SEC: secTeachingBridgeMap,
  IOT: iotTeachingBridgeMap,
  GAME: gameTeachingBridgeMap,
  CLOUD: cloudTeachingBridgeMap
});

// 引用资料术语库：按资料编号解释核心词，课程按模块引用自动取词，避免 120 节扩展课重复硬写。
const extensionSourceTermCopy = Object.freeze(Object.fromEntries([
  ["WEB-SEMANTIC", "Semantic HTML|用合适标签表达内容职责，让页面结构能被浏览器和辅助技术理解。"],
  ["WEB-HTML-A11Y", "Accessibility|让键盘、读屏器和不同设备用户都能完成同一件事。"],
  ["WEB-RESPONSIVE", "Responsive Design|页面根据屏幕宽度和设备能力自动调整布局。"],
  ["WEB-FLEX", "Flexbox|按一条主轴分配空间，适合导航、按钮组和卡片排列。"],
  ["WEB-GRID", "CSS Grid|用行和列组织二维布局，适合页面骨架。"],
  ["WEB-EVENTS", "Event Bubbling|事件从目标元素向外层传播，可用于事件委托。"],
  ["WEB-FETCH", "Fetch API|浏览器发起 HTTP 请求并处理响应的标准接口。"],
  ["WEB-STORAGE", "Web Storage|浏览器本地键值存储，适合非敏感偏好和进度。"],
  ["WEB-SOP-CORS", "Same-origin / CORS|浏览器限制跨来源读取资源的一组安全边界。"],
  ["WEB-OPENAPI", "OpenAPI|用结构化方式描述接口路径、参数、请求体和响应。"],
  ["WEB-SESSION", "Session|维持登录状态和用户上下文的机制。"],
  ["WEB-LIGHTHOUSE", "Lighthouse|检查页面性能、可访问性和最佳实践的工具。"],
  ["AI-JUPYTER", "Notebook|把代码、结果、图表和说明放在一起的实验笔记。"],
  ["AI-NUMPY", "Array|NumPy 中用于批量数值计算的同类型数据容器。"],
  ["AI-PANDAS", "DataFrame|pandas 中带行列标签的表格数据结构。"],
  ["AI-PANDAS-DUP", "Duplicate Data|重复记录，可能来自采集、合并或录入错误。"],
  ["AI-SPLIT", "Train/Test Split|把数据分为训练和测试部分来观察泛化表现。"],
  ["AI-CV", "Cross-validation|多次切分训练和验证，减少一次拆分的偶然性。"],
  ["AI-METRICS", "Metric|评价模型表现的指标，例如准确率、召回率或误差。"],
  ["AI-IMPORTANCE", "Feature Importance|观察哪些特征对预测影响更大。"],
  ["AI-PERSIST", "Model Persistence|保存模型并记录加载环境和版本风险。"],
  ["AI-MLFLOW-DEPLOY", "Model Serving|把模型包装成可调用服务。"],
  ["AI-MLFLOW-REG", "Model Registry|记录模型版本、状态和交付流程。"],
  ["SEC-TM", "Asset|需要保护的数据、账号、接口、日志和配置。"],
  ["SEC-TM-GUIDE", "Trust Boundary|权限、来源或控制者发生变化的位置。"],
  ["SEC-WSTG", "Input Validation|检查输入类型、范围和格式，减少异常数据进入链路。"],
  ["SEC-XSS", "XSS|不可信内容被页面当代码执行的问题。"],
  ["SEC-SQLI", "SQL Injection|输入改变 SQL 查询逻辑的问题。"],
  ["SEC-SESSION", "Session Management|管理 Cookie、Token、会话生命周期和安全属性。"],
  ["SEC-GHIDRA", "Function / String|逆向时用函数、字符串和调用关系互相印证。"],
  ["SEC-YARA", "YARA Rule|用字符串和条件描述样本特征的检测规则。"],
  ["SEC-SIGMA", "Sigma Rule|面向日志检测的通用规则格式。"],
  ["IOT-C", "C Language|贴近内存和硬件的系统编程语言。"],
  ["IOT-GNU-COMPILE", "Compilation|把 C 源码转换为目标文件和可链接程序。"],
  ["IOT-GCC-LINK", "Linking|把目标文件和库组合成可执行文件或固件。"],
  ["IOT-GCC-DEBUG", "Debug Info|保留源码、变量和行号信息，方便断点观察。"],
  ["IOT-ZEPHYR-GPIO", "GPIO|通用输入输出引脚，可读取按钮或控制外设。"],
  ["IOT-ZEPHYR-DRIVER", "Driver Model|操作系统对硬件设备的统一抽象。"],
  ["IOT-ZEPHYR-BINDINGS", "Device Tree|描述硬件连接、外设地址和驱动绑定关系。"],
  ["IOT-FREERTOS", "RTOS Task|实时系统中可被调度的执行单元。"],
  ["IOT-FREERTOS-SCHED", "Scheduler|决定任务运行顺序和响应延迟的内核机制。"],
  ["GAME-GODOT-TREE", "SceneTree|Godot 管理节点、场景和生命周期的树状结构。"],
  ["GAME-GODOT-NODE", "Node|Godot 中组成场景的基础对象。"],
  ["GAME-MDN-TECH", "Game Loop|持续处理输入、更新、物理和渲染的主循环。"],
  ["GAME-MDN-COLLISION", "Collision Detection|判断对象是否接触或重叠的过程。"],
  ["GAME-UNITY-PROFILER", "Profiler|观察 CPU、内存、渲染、物理和音频耗时的工具。"],
  ["GAME-UNITY-PHYSICS", "Physics Step|物理系统按固定间隔更新碰撞和运动。"],
  ["CLOUD-JOURNAL", "journalctl|查看 systemd 服务日志的命令。"],
  ["CLOUD-SS", "Socket|进程进行网络通信的端点。"],
  ["CLOUD-DOCKERFILE", "Dockerfile|描述镜像如何构建的文件。"],
  ["CLOUD-DOCKER-BEST", "Image Layer|镜像构建的分层结果，影响缓存和体积。"],
  ["CLOUD-K8S-SERVICE", "Service|为一组 Pod 提供稳定访问入口的对象。"],
  ["CLOUD-K8S-CONFIG", "ConfigMap|保存非敏感配置并注入到工作负载。"],
  ["CLOUD-K8S-SECRET", "Secret|敏感配置或凭据，需要控制暴露范围。"],
  ["CLOUD-K8S-DEPLOY", "Rolling Update|逐步替换旧版本实例的发布方式。"],
  ["CLOUD-OTEL", "OpenTelemetry|收集日志、指标和追踪数据的观测标准。"],
  ["CLOUD-SRE-MON", "SLI / Alert|用指标表达服务状态，并在需要介入时告警。"],
  ["CLOUD-SRE-CANARY", "Canary Release|先让少量流量使用新版本，再按指标放量。"]
].map(([id, copy]) => {
  const [term, explanation] = copy.split("|");
  return [id, { term, explanation }];
})));

