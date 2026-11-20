# 计算机学习地图

An interactive, offline-first learning website that takes a complete beginner from file names, paths, Windows basics and networking fundamentals through to Python, algorithms, the web, databases, computer systems and software engineering — with persistent local progress tracking.

**Stack:** HTML5 · CSS3 · vanilla JavaScript · `localStorage` — no build step, no runtime dependencies, no backend. Open `index.html` and it runs.

面向完全零基础学习者的本地学习网站。从文件名、路径、Windows 和网络常识开始，逐步进入 Python、算法、Web、数据库、计算机系统和软件工程。

## 技术栈

- HTML5
- CSS3
- 原生 JavaScript
- `localStorage` 本地学习进度
- 无构建步骤、无第三方运行依赖

## 运行方式

直接双击 `index.html` 即可使用。

也可以在项目目录启动本地静态服务器：

```powershell
python -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173
```

## 功能

- 0–9 共 10 个学习阶段、152 节课程，其中阶段 0 扩展为 20 节基础课，阶段 1–3 各 12 节，阶段 4–9 各 16 节。
- 阶段 0 的 20 节基础课已全部采用完整正文，包含知识点表、原理详解、分步骤示范、误区、排查、分层练习、6 道小测和官方引用资料。
- 阶段 0–3 首批 16 节基础课已挂接可运行半自动实验，覆盖文件、路径、压缩包、编码、系统摘要、进程、目录、权限、DNS、端口、HTTP、排障、Shell、参数和对象管道。
- 阶段 1 的 12 节课程已全部采用完整正文，覆盖硬件、进程、目录、启动、安装、权限、环境、性能、服务、驱动和磁盘恢复。
- 阶段 2 的 12 节课程已全部完成详细正文，覆盖网络拓扑、IP、NAT、Wi-Fi、DNS、端口、TCP/UDP、HTTP、HTTPS、Network 面板和综合排障。
- 阶段 3 的 12 节课程已全部完成详细正文，覆盖 Shell、参数、路径、文件操作、管道、搜索、环境、观察命令、错误策略和脚本复现。
- 阶段 4–9 的 96 节课程已全部完成详细正文，覆盖 Python、算法、Web、数据库、计算机系统、软件工程和专业方向选择。
- 阶段 4–9 每节课新增独立动手实验，展示运行环境、实验文件、完整代码、命令、预期输出、边界案例和验收清单；96 份实验可由脚本在临时目录自动执行。
- 阶段 9 的 `web-path` 已升级为可运行 Node Web starter：自启本地 HTTP 服务，验收 HTML 首页、`/api/health` JSON 和 404；`cloud-platform-path` 已升级为本地云交付模拟，覆盖健康检查、配置隔离、request ID 日志和失败回滚。
- 阶段 4–8 的 80 节课程使用课程级官方资料映射，不再只复用阶段通用资料。
- 学习台、完整路线、课程库、术语表、复习笔记、AI 专区、专业方向、项目作品集、资源索引九个主视图。
- 课程库支持阶段、完成状态组合筛选，支持路线顺序、时长升序和时长降序，并显示当前课程数量与合计学习时长。
- AI 专区已完成 12 模块、84 节正式课程，AI-00 至 AI-11 每个模块各 7 节；另有 8 条入门路径、24 篇零基础教程和 320 条 AI 术语。
- AI 实验室提供 12 个浏览器实验，覆盖机器学习、训练、视觉、文本、Attention、RAG、模型版本发布和 LLM 威胁建模。
- 模型解剖页提供数据、训练、推理、RAG 四种可步进流程，逐步显示输入、输出、核心操作、观察证据和常见错误。
- 论文导读页收录 Attention、BERT、GPT-3、InstructGPT、RAG、Datasheets for Datasets 六篇论文，支持未开始、阅读中、已完成三档本地进度，并能反向进入对应课程。
- 安全治理页按需求、数据、训练、评估、集成、部署、运营七个生命周期阶段展示资产、利益相关者、失效、检查问题、证据和控制，并映射 NIST 与 OWASP 风险。
- AI 课程支持 6 题知识检查、笔记与标签、统一搜索和错题复习、阅读到底自动完成及学习数据导入导出；正文末尾提供相关术语、关联论文和同模块前后课程入口。
- AI 入门指南采用“30 秒先看懂 → 分步图解 → 浏览器练习 → 3 题检查 → 正式课程”的过渡结构；AI 词典支持中英文、缩写、别名、分类、难度、学习状态和收藏筛选。
- AI 教程、词条与 84 节正式课程双向关联；教程笔记进入统一搜索与 Markdown 导出，教程阅读断点、完成状态、术语收藏和最近查看均保存在本机。
- 专业方向展示 6 个方向模块，WEB、AI、SEC、IOT、GAME、CLOUD 各提供 20 节正式方向课程，并明确前置条件、建议项目与验收抓手。
- 专业方向支持课程搜索、方向笔记、方向知识检查、课程末尾引用链接和完成记录。
- 专业方向新增“全部方向 / Web / AI / 安全 / 系统”家族筛选；系统家族聚合 IOT、GAME、CLOUD 三条路线，方向数据仍保持独立。
- WEB、AI、SEC、IOT、GAME、CLOUD 六个方向均已接入“本课的教学借鉴”正文段，并增加“引用资料中的术语解释”。
- 方向课程末尾引用资料支持按来源筛选，并提供本地引用结构/断链检查脚本。
- 项目作品集页自动汇总 WEB、AI、SEC、IOT、GAME、CLOUD 六个方向的 18 个建议项目，并给出前置、推荐课程、交付物和验收抓手。
- 18 个作品集项目均可打开详细执行页，包含需求说明、建议文件结构、开发步骤、验收清单，并支持“未开始 / 进行中 / 已完成”项目状态。
- 每个作品集执行页可下载自动带入本项目内容的技术栈启动代码包、PowerShell 验收脚本、README 模板和 Markdown 验收清单。
- 启动代码包按 WEB、AI、SEC、IOT、GAME、CLOUD 生成 6 类技术栈源码，并为 18 个项目分别写入唯一 `workflow.id`、业务步骤和运行证据；包含 `START-HERE.md`、真实启动代码、启动脚本、smoke test、项目目录骨架和验收资料。
- 资源索引页统一汇总专业方向、AI 正式课程与 AI 基础教程资料，按 URL 合并为 124 条去重资源，可按分类、来源和关键词检索，并展示课程与模块使用关系。
- 每节课包含学习原因、关键概念、链路示例、练习和验收标准。
- 每节主线课使用 6 道知识检查题，提交后即时显示得分和解析提示。
- 每节课支持本地学习笔记，按课程保存到当前浏览器。
- 主线课程动手实验支持记录运行结果、失败现象和截图说明，学习证据导出时默认脱敏明显敏感字段。
- 每项主线练习保存时会对已记录的命令、输出和复盘进行本地规则判定，生成通过、未通过或待复核结果，并保留近期尝试历史。
- 112 节具备固定实验的课程将“进阶练习”绑定真实验收脚本；导入结构化 JSON 后按真实 exit code、逐项 checks、实验指纹和结果指纹判定，优先替代该项练习的规则推断。
- 主线与方向笔记均支持最多 8 个标签；复习页可按标签筛选、跨课程勾选，并分别导出当前结果或已选笔记 Markdown。
- 标签库支持跨主线、方向、AI 课程和 AI 入门笔记统一重命名、合并与去重。
- 阶段复盘按基础、进阶、项目化练习统计均分和通过率，并展示最近 8 次自动判定的变化趋势。
- 复习笔记页统一搜索主线课程笔记与方向课程笔记，可按课程名、阶段、方向、模块、标签和正文检索，命中词会高亮。
- 错题可按主线/方向课程、具体阶段或专业方向、未复习/已复习筛选；每道错题可标记完成或撤销，总数、未复习数与当前筛选数分开展示。
- 阶段 0–3 操作图示提供四个可切换步骤，联动显示操作、观察证据和完成判断。
- 支持学习数据导出与导入，覆盖课程进度、每日任务、知识检查结果、主线/方向/AI 笔记、错题复习、阅读断点、AI 学习记录和作品集项目状态。
- 课程内容在桌面端以居中阅读工作区打开，手机端切换为全屏阅读。
- 知识路线默认只展示并展开当前阶段，可切换为展开全部 10 个阶段；从学习台跳转到其他阶段时会自动显示完整路线。
- 主线课程、方向课程、方向模块和项目执行页按实际二级标题生成粘性章节目录，显示章节计数与阅读百分比，点击定位、随滚动高亮并支持返回顶部。
- 学习台可选择课程完成方式：默认自行标记，也可设置为主线、方向和 AI 课程浏览到底后自动完成。
- 学习台可选择是否记住阅读位置；默认记录主线、方向和 AI 正式课程的章节、章节内偏移与整体比例，重开课程后可继续阅读或一键从头开始。
- 学习台提供字号、阅读间距、高对比度和减少动效设置，作用于当前浏览器并随学习数据导出。
- 学习台每日任务增加近 7 日轻量统计和本地时区日期；学习数据区按首次备份、过期更新和正常状态显示备份提醒。
- 学习台“最近阅读”按更新时间汇总三类课程，显示完成/练习状态；可按全部、主线、方向和 AI 筛选，支持课程名、阶段、方向和章节关键词搜索、练习记录筛选，以及未完成优先、最近更新、阅读进度高到低、阅读进度低到高、主线阶段和课程类型排序；默认展示当前结果最近 6 节，并支持展开、继续阅读、单课清除和确认后清除当前结果。
- 通过 HTTP/HTTPS 打开时支持 PWA 安装、静态资源离线缓存、更新状态和缓存清理；直接打开 HTML 时自动降级为普通本地页面。
- 全局课程与术语搜索，支持 `Ctrl + K` 聚焦。
- 课程完成状态、每日任务和学习日期保存在当前浏览器。
- 桌面端、平板和移动端响应式布局。
- 键盘可访问的课程卡片、焦点样式和减少动画偏好支持。

## 目录结构

```text
计算机学习网站/
├─ assets/
│  ├─ computer-learning.jpg   首页视觉资产
│  ├─ favicon.svg             浏览器标签图标
│  └─ learning-guide-avatar.svg 左侧学习向导头像
├─ index.html                 页面结构
├─ styles.css                 样式入口，按顺序导入 styles/ 下的模块文件
├─ styles/                    基础布局、课程库、阅读器、AI 专区等样式模块
├─ app-core-data.js           核心常量入口
├─ data/
│  ├─ mainline-data.js        主线阶段、术语、每日任务和阶段辅助文案
│  └─ extension-data.js       专业方向课程、引用映射和教学桥接文案
├─ app-project-tools.js       资源索引、作品集详情、初始化包和 ZIP 生成
├─ app-state.js               版本 15 状态结构、旧数据清洗与本地持久化
├─ app-model.js               课程派生、练习判定、通用工具和 AI/方向数据访问器
├─ app-ai-view.js             AI 专区总览、教程、词典、课程和治理视图
├─ app-reading.js             最近阅读、章节目录、断点恢复和自动完成
├─ app-review-notes.js        错题复习、笔记搜索、标签筛选和 Markdown 导出
├─ app-review-tools.js        错题排序、标签库管理和学习证据导出
├─ app-stage-review.js        主线阶段复盘、能力趋势、下一步建议和阶段 Markdown 导出
├─ app-course-views.js        主线、方向和 AI 课程阅读正文渲染
├─ app.js                     课程打开、状态切换、搜索、事件与启动逻辑
├─ ai-foundation-data.js      320 条 AI 术语、8 条路径、24 篇入门教程及关系数据
├─ ai-foundation-depth-data.js 30 个核心术语、24 篇教程练习与关联题库的二次深写层
├─ ai-zone-data.js            AI 专区模块、课程、测验、实验和引用数据
├─ ai-zone-az2-data.js        AI-02 至 AI-04 课程、实验与资料映射
├─ ai-zone-az3-data.js        AI-05 至 AI-07 课程、实验与资料映射
├─ ai-zone-az4-data.js        AI-08 至 AI-09、模型解剖、论文与实验数据
├─ ai-zone-az5-data.js        AI-10 至 AI-11、交付实验与安全治理数据
├─ ai-zone-az6-data.js        AI-01 剩余数学课程与最终顺序补全
├─ foundation-high-density.js 阶段 0 高密度课程资料层
├─ stage1-high-density.js     阶段 1 高密度样板资料层
├─ stage2-high-density.js     阶段 2 网络高密度样板资料层
├─ stage3-high-density.js     阶段 3 命令行详细样板资料层
├─ stage4-high-density.js     阶段 4 Python 详细样板资料层
├─ lesson-profile-builder.js  阶段 4–9 完整课程字段构建器
├─ course-labs.js             阶段 4–5 可运行课程实验
├─ course-labs-stage6-9.js    阶段 6–9 可运行课程实验
├─ stage4-8-course-references.js 阶段 4–8 课程级官方资料映射
├─ stage4-course-config.js    阶段 4 Python 课程配置
├─ stage5-high-density.js     阶段 5 算法课程配置
├─ stage6-high-density.js     阶段 6 Web 与数据库课程配置
├─ stage7-high-density.js     阶段 7 系统课程配置
├─ stage8-high-density.js     阶段 8 工程课程配置
├─ stage9-high-density.js     阶段 9 方向选择课程配置
├─ 全阶段详细课程执行大纲.md  阶段 4–9 批次执行与验收基线
├─ scripts/
│  ├─ check-reference-links.js 扩展资料引用结构与断链检查脚本
│  ├─ check-app-architecture.js 应用分层、加载顺序和主文件体积门禁
│  ├─ check-ai-foundations.js AI 基础词典、教程、课程映射和版本 15 状态检查
│  ├─ run-practice-verification.js 运行单课固定实验并生成结构化验收 JSON
│  ├─ check-ai-content-quality.js AI 内容重复率、专属度和深度门禁
│  ├─ check-content-uniqueness.js 全站课程跨课重复与低专属度扫描
│  ├─ check-ai-zone.js        AI 专区结构、实验、状态兼容与原有规模检查
│  ├─ check-next-round-features.js 复习、目录和项目包结构检查
│  ├─ check-reading-resume.js 阅读断点、状态兼容和恢复算法检查
│  ├─ check-stage-review.js 主线阶段复盘、下一步建议和导出检查
│  ├─ check-roadmap-controls.js 路线当前阶段、全部阶段与进度推进检查
│  ├─ check-browser-ui.js    Edge headless 四视口真实页面与截图验收
│  ├─ check-portfolio-starters.js 18 个技术栈启动代码真实运行检查
│  ├─ check-stage-samples.js 阶段 0–3 课程自动抽样与 UTF-8 检查
│  ├─ check-dom-keyboard.js HTML 语义、键盘入口和焦点样式静态验收
│  ├─ check-stage9-project-packages.js 阶段 9 Web / Cloud 页面与 ZIP 包检查
│  ├─ check-stage9-runtime.js 阶段 9 Web / Cloud 真实入口与接口回放
│  ├─ build-release-package.js 生成干净静态发布包
│  └─ check-release-package.js 检查发布包部署完整性和排除规则
├─ 同类网站借鉴清单.md         竞品调研与设计决策
├─ UI优化清单.md              UI 审计、实施状态与后续优先级
├─ 网站设计大纲.md             信息架构、视觉系统、状态与响应式规则
├─ 网站长期运行部署与运营规划方案.md  长期运行、静态部署、发布和运营方案
├─ 项目维护手册.md             常用命令、目录边界、发布流程和故障处理
├─ CHANGELOG.md               版本变更记录
├─ 课程高密度改造标准.md       课程正文加密、引用和验收标准
├─ 扩展模块课程细化执行文档.md  专业方向课程细化执行规范
├─ 扩展课程资料引用与完善执行大纲.md  资料池、模块映射与引用执行方案
├─ AI专区知识库.md           AI 全领域知识树、实验建议与可靠来源库
├─ AI专区布局大纲.md         AI 专区信息架构、页面布局与分阶段实施方案
├─ AI内容深度二次改造标准.md  AI 术语、教程、练习与题库的专属度标准
└─ README.md                  项目说明
```

## 工程架构

- **页面层**：`index.html` 只维护九个主视图和课程阅读工作区的稳定 DOM 骨架，`styles.css` 作为样式入口，具体规则拆到 `styles/`。
- **课程资料层**：`app-core-data.js` 只保留核心常量；主线数据在 `data/mainline-data.js`，专业方向数据在 `data/extension-data.js`；各阶段资料、实验和引用映射保存在独立 JavaScript 文件中。
- **AI 基础深写层**：`ai-foundation-depth-data.js` 在不改变 320 条词典 ID、24 篇教程 ID 和 84 节正式课程编号的前提下，覆盖首批核心术语、教程练习和关联题库。
- **项目工具层**：`app-project-tools.js` 负责统一资源索引、18 个作品集执行页、启动代码和本地 ZIP 生成。
- **状态层**：`app-state.js` 定义版本 15 状态、旧数据清洗和本地持久化；待模型访问层就绪后再读取 `computer-learning-map-v1`。
- **模型访问层**：`app-model.js` 负责课程派生缓存、文本转义与高亮、方向/AI 数据访问和状态初始化。
- **AI 视图层**：`app-ai-view.js` 负责 AI 总览、教程、词典、知识地图、课程、实验、论文和治理页面。
- **阅读交互层**：`app-reading.js` 负责最近阅读、章节目录、阅读断点保存/恢复和浏览到底自动完成。
- **复习笔记层**：`app-review-notes.js` 负责错题聚合、复习状态、笔记搜索、标签筛选和 Markdown 导出。
- **复习工具层**：`app-review-tools.js` 负责错题排序、标签库搜索/批量选择/统计和学习证据 Markdown 导出。
- **阶段复盘层**：`app-stage-review.js` 负责主线阶段聚合、练习能力趋势、下一步建议和阶段 Markdown 导出。
- **课程视图层**：`app-course-views.js` 负责主线课程、方向课程、AI 课程、AI 入门教程和 AI 词条的阅读正文渲染。
- **主应用层**：`app.js` 负责课程打开、完成状态、笔记保存、知识检查、全局搜索、事件委托和页面启动。
- **验收层**：`scripts/` 检查课程规模、内容字段、引用、实验和项目包；`work/` 只存放本地 QA 截图、浏览器临时目录和生成包，不参与网站运行。

主线课程、方向课程和作品集项目都是静态资料的派生结果。应用启动后只构建一次并复用缓存；课程搜索文本也按课程对象缓存，避免每次输入、渲染或进度计算都重新合并大段正文。

## 学习路线

1. 电脑使用基础
2. Windows 与硬件
3. 网络与互联网
4. 命令行与工具
5. 编程思维与 Python
6. 数据结构与算法
7. Web 与数据库
8. 计算机系统原理
9. 软件工程
10. 专业方向选择

## 验证方式

推荐先使用统一检查入口：

```powershell
node scripts/check-all.js quick
node scripts/check-all.js standard
node scripts/check-all.js full
```

截至 2026-08-10，`node scripts/check-all.js full` 已通过 `34/34 PASS`；报告和浏览器截图位于 `outputs/browser-ui/`。

生成和检查静态发布包：

```powershell
node scripts/build-release-package.js
node scripts/check-release-package.js
```

发布包输出目录：

```text
outputs/release/computer-learning-site/
```

也可以单独执行 JavaScript 语法检查：

```powershell
node --check foundation-high-density.js
node --check app-core-data.js
node --check app-project-tools.js
node --check app-state.js
node --check app-model.js
node --check app-ai-view.js
node --check app-reading.js
node --check app-review-notes.js
node --check app-review-tools.js
node --check app-course-views.js
node --check app.js
```

扩展资料引用结构检查：

```powershell
node scripts/check-foundation-density.js
node scripts/check-stage1-density.js
node scripts/check-stage2-density.js
node scripts/check-stage3-density.js
node scripts/check-stage4-density.js
node scripts/check-stage5-density.js
node scripts/check-stage6-density.js
node scripts/check-stage7-density.js
node scripts/check-stage8-density.js
node scripts/check-stage9-density.js
node scripts/check-all-stage-density.js
node scripts/check-mainline-reference-links.js
node scripts/check-course-labs.js
node scripts/check-next-round-features.js
node scripts/check-portfolio-starters.js
node scripts/check-stage-samples.js
node scripts/check-stage-review.js
node scripts/check-dom-keyboard.js
node scripts/check-stage9-project-packages.js
node scripts/check-stage9-runtime.js
node scripts/run-course-lab-checks.js
node scripts/check-user-facing-copy.js
node scripts/check-reference-links.js
node scripts/check-app-architecture.js
node scripts/check-ai-content-quality.js
node scripts/check-content-uniqueness.js
node scripts/check-ai-foundations.js
node scripts/check-ai-zone.js
node scripts/check-library-controls.js
node scripts/check-roadmap-controls.js
node scripts/check-reading-resume.js
node scripts/check-practice-evidence.js
```

固定脚本练习可先查看清单，再运行单课验收：

```powershell
node scripts\run-practice-verification.js --list
node scripts\run-practice-verification.js --lesson file-basics
node scripts\run-practice-verification.js --lesson file-basics --stdout
```

默认结果写入 `outputs/practice-verification/{lessonId}.json`，也可用 `--output outputs\practice-verification\result.json` 指定项目内路径。网页不会直接执行本机命令；在课程“进阶练习”中复制命令并运行后，再导入 JSON。结果只有在课程/练习 ID、运行时、命令、实验指纹、结果指纹、exit code 和逐项 checks 全部匹配时才作为 runner 判定。指纹用于匹配当前实验版本和发现文件变更，不是身份认证或数字签名。

需要真实网络可达性检查时使用：

```powershell
node scripts/check-reference-links.js --online
```

页面运行后检查浏览器控制台、桌面端和移动端布局，并操作搜索、课程抽屉、完成状态和筛选功能。发布前可运行 `node scripts\\check-browser-ui.js`，报告和截图写入 `outputs/browser-ui/`。

## 数据说明

学习状态保存在浏览器 `localStorage` 的 `computer-learning-map-v1` 键中。当前导出格式版本为 15，包含课程完成状态、每日任务、知识检查结果、带标签的主线/方向/AI/AI 入门教程笔记、错题复习标记、课程完成方式、阅读显示设置、课程与教程阅读断点、方向课程记录、AI 课程与实验记录、逐练习证据、结构化 runner artifact 与判定历史、AI 入门教程完成记录、术语收藏与最近查看、作品集项目状态、最近学习活动时间和导出时间。版本 1–14 的数据导入后会补齐新增字段，并保留原有课程、实验、论文和作品集状态。每篇笔记最多保留 8 个标签，每个标签最长 24 个字符。方向课程完成状态写入 `extensionProgress.completedExtensionLessons`，AI 学习记录写入 `aiZoneProgress`；完成方式写入 `settings.completionMode`，阅读位置设置写入 `settings.resumeReading`，显示设置写入 `settings.fontSize`、`settings.readingDensity`、`settings.highContrast` 和 `settings.reduceMotion`，阅读断点写入 `readingPositions`，课程级实验写入 `practiceEvidence`，逐练习记录写入 `practiceRecords`，近期判定历史写入 `practiceAttempts`，错题复习状态写入 `reviewedMistakes`。阅读断点使用 `main:`、`extension:`、`ai:`、`ai-guide:` 命名空间，并同时保存章节标题、章节索引、章节内偏移和整体比例；“最近阅读”只是这些断点的排序视图，不额外写入状态。关闭该功能会清除已有断点。项目状态写入 `portfolioProgress`；资源索引只展示资料。清除站点数据会清空进度，可先在学习台导出 JSON 备份。项目当前没有账户系统，学习记录只保存在本机；可选账户与跨设备同步的接口和冲突边界见 `同步架构边界.md`。

作品集项目下载的 PowerShell 脚本可在解压后的项目根目录运行：

```powershell
.\scripts\smoke-test.ps1
.\scripts\verify-project.ps1 -StructureOnly -RunStarter
.\scripts\verify-project.ps1 -StructureOnly
.\scripts\verify-project.ps1
```

第一条单独运行技术栈 smoke test；第二条同时检查必要文件并运行启动代码；第三条只检查必要文件与目录；最后一条还会检查 README 中的 `TODO` 和 `ACCEPTANCE.md` 中尚未勾选的验收项。检查失败返回退出码 1，全部通过返回退出码 0。

如果 Windows 没有把 Python 加入 PATH，可以先指定解释器再运行 Python 类实验或项目包：

```powershell
$env:PYTHON = "C:\Path\To\python.exe"
```

## 已知问题

- 当前版本仍是本机优先的单机静态网站，没有真实账户和跨设备同步。
- PWA 需要通过 HTTP/HTTPS 访问；`file://` 方式会保留本地学习功能，但不注册离线缓存。
- 课程内容是完整知识框架和首轮课文，不替代每个专业方向的大学级教材。
- 知识检查题用于确认概念理解；112 项固定脚本练习可导入真实运行结果，其余 344 项仍分析学习者记录的证据并给出规则判定。

## 后续优化

- P1：为具备固定验收脚本的练习接入结构化真实运行结果，继续校准本地判定规则。
- P2：继续把 starter 从最小业务流程扩充为可迭代的项目第一版。
- P2：增加可选后端账户与跨设备同步。
- P2：按 `同步架构边界.md` 实现内存假适配器和冲突测试，再评估真实身份与存储服务。

完整 UI 审计、已实施优化和后续优先级见 `UI优化清单.md`。

## 视觉资产

首页照片来自 Unsplash 图片服务，原图标识：`photo-1516321318423-f06f85e504b3`。照片仅用于学习主题的页面背景。






