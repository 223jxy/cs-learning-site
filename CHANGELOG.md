# 更新日志

## 2026-08-10

### 固定脚本真实验收

- 学习数据升级到版本 15，兼容版本 1–14；`practiceRecords` 与 `practiceAttempts` 可保存经过校验的结构化 runner artifact。
- 112 节具备固定实验的课程将进阶练习绑定 `scripts/run-practice-verification.js`，结果包含真实 exit code、逐项 checks、输出摘要、实验指纹和 artifact 指纹。
- 课程页增加验收命令复制和 JSON 导入；runner 结果通过课程、练习、运行时、命令、实验版本、结果完整性与 checks 一致性校验后，优先替代规则推断。
- 学习证据、阶段复盘和能力趋势标明“脚本通过/未通过”及真实脚本次数；PWA 缓存升级到 `computer-learning-map-v15`。

### 自动判定、能力趋势与标签库

- 学习数据升级到版本 14：逐练习记录增加结构化自动判定，新增最多 1000 条 `practiceAttempts` 历史。
- 保存练习证据时按状态、命令、输出、复盘和通过/失败信号生成 0–100 分结果；自动通过与失败可更新练习状态，证据不足进入复核。
- 阶段复盘新增基础、进阶、项目化三层能力均分、通过率和最近 8 次判定趋势，并同步进入阶段 Markdown。
- 标签库将重命名与合并拆成独立操作：重命名创建新名称，合并只落到已有标签，并跨四类笔记去重。
- PWA 缓存升级到 `computer-learning-map-v14`，专项检查覆盖判定、历史清洗、趋势和标签合并。

### 逐练习证据

- 新增版本 13 `practiceRecords` 数据字段，按 `lessonId:practice-N` 稳定 ID 保存每项分层练习状态。
- 课程阅读页为基础、进阶和项目化练习增加折叠式证据编辑器，支持状态、命令、输出摘要和复盘备注。
- 学习证据 Markdown 与阶段复盘新增逐练习证据统计和脱敏明细；旧版本 1–12 数据导入会自动补齐空记录。
- 新增 `scripts/check-practice-evidence.js`，检查 152 节课程、456 项练习、ID 清洗和脱敏导出，并纳入 `check-all.js standard/full`。

## 2026-08-05

### 学习台与数据

- 每日任务增加近 7 日轻量周视图，按本地时区统计完成项，不使用连续签到激励。
- 学习数据区新增首次备份、过期更新和正常状态提醒；状态记录最近学习活动时间，导出格式升级到版本 12。
- 最近阅读增加未完成优先、练习记录筛选和完成/练习状态标签。
- 新增字号、阅读间距、高对比度和减少动效设置，并随导入导出数据兼容旧版本。

### 专业方向与 PWA

- 专业方向增加 Web、AI、安全、系统四个家族筛选，系统家族聚合 IOT、GAME、CLOUD。
- 新增 `manifest.webmanifest` 和 `sw.js`，支持 HTTP/HTTPS 下离线缓存、更新状态和缓存清理；Edge 断网重载验收通过。
- 新增 `同步架构边界.md`，明确本机优先、版本 12 状态、适配器契约、字段级合并和冲突处理边界。
- `scripts/check-all.js standard` 新增周视图、显示设置、方向家族、PWA 和同步边界专项检查。

### 最近阅读

- 最近阅读新增课程名、阶段、方向和章节关键词搜索。
- 新增最近更新、阅读进度高到低、阅读进度低到高、主线阶段和课程类型排序。
- 搜索结果支持展开、继续阅读、单课清除和确认后批量清除，专项脚本覆盖组合筛选、空状态和排序结果。

### 浏览器验收

- 新增 `scripts/check-browser-ui.js`，使用本机 Edge headless 验证 375、390、768、1440 四个视口。
- 覆盖最近阅读、课程 Tab/Escape 焦点、复习笔记、AI 词典、项目执行页、横向溢出和运行时异常，并输出截图与 JSON 报告。

### 学习路线

- 路线页新增“只看当前阶段 / 展开全部”分段控件和可见阶段计数，默认降低长页面密度。
- 首页跳转到非当前阶段时自动展示完整路线；新增 `scripts/check-roadmap-controls.js` 并纳入标准回归和浏览器截图验收。

## 2026-08-04

### 工程稳定

- 新增统一回归入口：`scripts/check-all.js`，支持 `quick`、`standard`、`full`。
- 新增环境自检：`scripts/check-env.js`，自动识别 Codex 自带 Python。
- 清理 `work/` 中 Edge profile、Cache、Crashpad 等临时目录，项目非 Git 文件体积降到约 8 MB。
- 修复本地 Git 仓库状态，建立可回滚基线。
- 新增 `.gitignore`，排除 `work/`、浏览器缓存、临时日志、依赖目录和发布包输出。

### 架构拆分

- 将 `app-core-data.js` 拆为轻量入口、`data/mainline-data.js` 和 `data/extension-data.js`。
- 将 `styles.css` 拆为入口文件和 `styles/` 下 7 个样式模块。
- 更新架构、DOM、课程库等检查脚本，适配数据和样式拆分后的加载方式。

### 发布与运营

- 新增 `scripts/build-release-package.js`，生成干净静态发布包。
- 新增 `scripts/check-release-package.js`，检查发布包不包含 `.git/`、`work/`、浏览器缓存、日志和压缩包。
- 新增 `网站长期运行部署与运营规划方案.md`，覆盖本地运行、静态部署、HTTPS、缓存、发布检查、内容运营和扩展节奏。
- 新增 `项目维护手册.md`，整理常用命令、目录边界、发布流程和故障处理。

### 内容质量

- 新增 `stage4-9-sample-deep-dives.js`，对阶段 4–9 每阶段抽取 2 节课程补充更具体的案例、错误示例、练习和排障清单。
- 新增 `scripts/check-stage-sample-deep-dives.js`，检查 12 节抽样课程的阶段分布、合并结果、专属关键词、正文结构和主线课程数量稳定性。
- 统一数据加载脚本与发布包清单，确保新增内容在本地检查、发布包和用户界面中保持一致。
- 新增 `foundation-practice-labs.js`，为阶段 0–3 首批 16 节基础课挂接可运行半自动实验。
- 新增 `scripts/check-foundation-practice-labs.js`，真实运行并验证阶段 0–3 的基础实验、临时目录与输出证据。
- 新增主线课程实验证据记录，用户可在课程实验区保存运行结果、失败现象和截图说明。
- 学习证据 Markdown 导出纳入课程实验证据，并默认脱敏 token、password、secret、cookie、authorization 和邮箱片段。
- 学习数据导出格式升级到版本 11，旧数据导入时自动补齐空实验证据字段。
- 新增主线阶段复盘区，聚合阶段完成课程、知识检查、实验记录、笔记、错题和阅读断点。
- 新增阶段复盘 Markdown 导出，实验命令和证据摘要沿用默认脱敏规则。
- 新增 `scripts/check-stage-review.js`，并纳入统一回归入口。

### 验收

- `node scripts\check-all.js quick`：7/7 PASS。
- `node scripts\check-all.js standard`：16/16 PASS。
- `node scripts\check-all.js full`：26/26 PASS。
- 96 节课程实验真实执行通过。
- 18 个作品集项目启动包 smoke test 通过。
- 发布包生成与部署包检查通过。
