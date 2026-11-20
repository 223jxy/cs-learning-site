"use strict";

// 返回扩展课所在模块的核心术语解释。
function getExtensionCourseTerms(course) {
  if (!course) return [];
  const sourceIds = getExtensionModuleReferenceConfig(course.routeCode, course.moduleIndex).sourceIds || [];
  return sourceIds.slice(0, 3).map((sourceId) => {
    const fallbackTitle = extensionReferenceLibrary[sourceId]?.title || sourceId;
    return { sourceId, ...(extensionSourceTermCopy[sourceId] || { term: fallbackTitle, explanation: "本模块引用资料中的核心概念，阅读正文时先确认它解决什么问题。" }) };
  });
}

// 渲染引用资料中的术语解释，降低初学者阅读门槛。
function renderExtensionCourseGlossary(course) {
  const terms = getExtensionCourseTerms(course);
  if (!terms.length) return "";
  return `<section class="lesson-section terminology-section">
    <div class="lesson-section-heading">
      <div>
        <h2>引用资料中的术语解释</h2>
        <p>先把本模块资料里最常出现的词讲成人话，再进入关键概念。</p>
      </div>
      <span class="operation-badge">术语 ${terms.length} 个</span>
    </div>
    <div class="terminology-grid">
      ${terms.map((item) => `<article class="term-chip-card">
        <div><h3>${escapeHTML(item.term)}</h3><p>${escapeHTML(item.explanation)}</p></div>
        <small>${escapeHTML(item.sourceId)}</small>
      </article>`).join("")}
    </div>
  </section>`;
}

// 根据扩展课程定位对应的资料组，避免每课手写重复链接。
function getExtensionModuleReferenceConfig(routeCode, moduleIndex) {
  return extensionModuleReferenceMap[routeCode]?.[moduleIndex] || { sourceIds: [] };
}

// 返回指定扩展课应展示的官方资料。
function getExtensionCourseReferences(course) {
  if (!course) return [];
  const sourceIds = getExtensionModuleReferenceConfig(course.routeCode, course.moduleIndex).sourceIds || [];
  return sourceIds.map((sourceId) => ({ id: sourceId, ...extensionReferenceLibrary[sourceId] })).filter((item) => item.title && item.url);
}

// 把资料 URL 归类为学习者容易理解的来源名称，供课程末尾筛选使用。
const referenceProviderLabelMap = Object.freeze({
  "developer.mozilla.org": "MDN",
  "learn.openapis.org": "OpenAPI",
  "owasp.org": "OWASP",
  "www.owasp.org": "OWASP",
  "cheatsheetseries.owasp.org": "OWASP",
  "developer.chrome.com": "Chrome",
  "docs.jupyter.org": "Jupyter",
  "numpy.org": "NumPy",
  "pandas.pydata.org": "pandas",
  "scikit-learn.org": "scikit-learn",
  "mlflow.org": "MLflow",
  "www.mlflow.org": "MLflow",
  "github.com": "GitHub",
  "yara.readthedocs.io": "YARA",
  "sigmahq.io": "Sigma",
  "en.cppreference.com": "cppreference",
  "www.gnu.org": "GNU",
  "gcc.gnu.org": "GCC",
  "docs.zephyrproject.org": "Zephyr",
  "docs.freertos.org": "FreeRTOS",
  "www.freertos.org": "FreeRTOS",
  "docs.godotengine.org": "Godot",
  "docs.unity.cn": "Unity",
  "www.freedesktop.org": "systemd",
  "linux.die.net": "Linux man pages",
  "docs.docker.com": "Docker",
  "kubernetes.io": "Kubernetes",
  "opentelemetry.io": "OpenTelemetry",
  "sre.google": "Google SRE"
});

function getReferenceProvider(reference) {
  const hostname = String(reference?.url || "").match(/^https:\/\/([^/]+)/i)?.[1]?.toLowerCase() || "unknown";
  const label = reference?.provider || referenceProviderLabelMap[hostname] || hostname.replace(/^www\./, "");
  return {
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || hostname,
    label
  };
}

function normalizeResourceURL(url) {
  try {
    const parsed = new URL(String(url || ""));
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase();
    if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    return parsed.toString().replace(/\/$/, "");
  } catch (error) {
    return String(url || "").trim().replace(/\/+$/, "");
  }
}

function getExtensionResourceEntries() {
  return Object.entries(extensionReferenceLibrary).map(([sourceId, reference]) => {
    const provider = getReferenceProvider(reference);
    const usages = [];
    Object.entries(extensionModuleReferenceMap).forEach(([routeCode, modules]) => {
      modules.forEach((moduleConfig, moduleIndex) => {
        if (!moduleConfig.sourceIds.includes(sourceId)) return;
        const route = getFutureRoute(routeCode);
        const module = getExtensionModule(routeCode, moduleIndex);
        usages.push({
          routeCode,
          routeTitle: route.title,
          moduleIndex,
          moduleTitle: module.title,
          courseCount: getExtensionCoursesByModule(routeCode, moduleIndex).length
        });
      });
    });
    const routeCodes = [...new Set(usages.map((usage) => usage.routeCode))];
    const moduleTitles = [...new Set(usages.map((usage) => usage.moduleTitle))];
    const courseCount = usages.reduce((sum, usage) => sum + usage.courseCount, 0);
    return {
      id: sourceId,
      ids: [sourceId],
      title: reference.title,
      url: reference.url,
      provider,
      usages,
      routeCodes,
      moduleTitles,
      courseCount
    };
  });
}

function getAIResourceEntries() {
  const data = getAIData();
  const foundation = getAIFoundationData();
  const references = foundation.sources.length ? foundation.sources : data.references;
  return references.map((reference) => {
    const normalizedURL = normalizeResourceURL(reference.url);
    const matchedLessons = data.lessons.filter((lesson) => lesson.references.some((item) => item.id === reference.id || normalizeResourceURL(item.url) === normalizedURL));
    const matchedGuides = foundation.guides.filter((guide) => guide.sourceIds.includes(reference.id));
    const matchedTerms = foundation.terms.filter((term) => term.sourceIds.includes(reference.id));
    const usages = data.modules.map((module) => {
      const moduleLessons = matchedLessons.filter((lesson) => lesson.moduleId === module.id);
      if (!moduleLessons.length) return null;
      return {
        routeCode: "AI-ZONE",
        routeTitle: "AI 专区",
        moduleId: module.id,
        moduleTitle: `${module.id} · ${module.title}`,
        courseCount: moduleLessons.length
      };
    }).filter(Boolean);
    if (matchedGuides.length || matchedTerms.length) {
      usages.push({
        routeCode: "AI-ZONE",
        routeTitle: "AI 专区",
        moduleId: "AI-FOUNDATIONS",
        moduleTitle: `AI 入门与词典 · ${matchedGuides.length} 篇教程 / ${matchedTerms.length} 条术语`,
        courseCount: matchedGuides.length
      });
    }
    if (!usages.length) {
      usages.push({
        routeCode: "AI-ZONE",
        routeTitle: "AI 专区",
        moduleId: "AI-LIBRARY",
        moduleTitle: "AI 专区资料库",
        courseCount: 0
      });
    }
    return {
      id: reference.id,
      ids: [reference.id],
      title: reference.title,
      url: reference.url,
      provider: getReferenceProvider(reference),
      usages,
      routeCodes: ["AI-ZONE"],
      moduleTitles: [...new Set(usages.map((usage) => usage.moduleTitle))],
      courseCount: matchedLessons.length + matchedGuides.length
    };
  });
}

function getUnifiedResourceIndex() {
  const resourcesByURL = new Map();
  [...getExtensionResourceEntries(), ...getAIResourceEntries()].forEach((resource) => {
    const urlKey = normalizeResourceURL(resource.url);
    const existing = resourcesByURL.get(urlKey);
    if (!existing) {
      resourcesByURL.set(urlKey, {
        ...resource,
        url: urlKey,
        ids: [...resource.ids],
        usages: [...resource.usages],
        routeCodes: [...resource.routeCodes],
        moduleTitles: [...resource.moduleTitles]
      });
      return;
    }
    existing.ids = [...new Set([...existing.ids, ...resource.ids])];
    existing.id = existing.ids[0];
    const usageMap = new Map(existing.usages.map((usage) => [`${usage.routeCode}|${usage.routeTitle}|${usage.moduleId ?? usage.moduleIndex}|${usage.moduleTitle}`, usage]));
    resource.usages.forEach((usage) => {
      const usageKey = `${usage.routeCode}|${usage.routeTitle}|${usage.moduleId ?? usage.moduleIndex}|${usage.moduleTitle}`;
      const previous = usageMap.get(usageKey);
      if (!previous) usageMap.set(usageKey, { ...usage });
      else previous.courseCount = Math.max(previous.courseCount, usage.courseCount);
    });
    existing.usages = [...usageMap.values()];
    existing.routeCodes = [...new Set([...existing.routeCodes, ...resource.routeCodes])];
    existing.moduleTitles = [...new Set(existing.usages.map((usage) => usage.moduleTitle))];
    existing.courseCount = existing.usages.reduce((sum, usage) => sum + usage.courseCount, 0);
  });
  return [...resourcesByURL.values()].sort((a, b) => a.provider.label.localeCompare(b.provider.label, "zh-CN") || a.id.localeCompare(b.id, "zh-CN"));
}

function getFilteredResources(query = "") {
  const normalized = query.trim().toLowerCase();
  return getUnifiedResourceIndex().filter((resource) => {
    const routeMatched = activeResourceRoute === "all" || resource.routeCodes.includes(activeResourceRoute);
    const providerMatched = activeResourceProvider === "all" || resource.provider.id === activeResourceProvider;
    const text = [
      resource.id,
      resource.ids.join(" "),
      resource.title,
      resource.url,
      resource.provider.label,
      resource.routeCodes.join(" "),
      resource.moduleTitles.join(" "),
      resource.usages.map((usage) => `${usage.routeTitle} ${usage.moduleTitle}`).join(" ")
    ].join(" ").toLowerCase();
    return routeMatched && providerMatched && (!normalized || text.includes(normalized));
  });
}

function renderResourceFilters(resources) {
  const routeOptions = [...futureRoutes.map((route) => ({ id: route.code, title: route.code })), { id: "AI-ZONE", title: "AI 专区" }];
  const routeFilters = [{ id: "all", title: "全部分类", count: resources.length }, ...routeOptions.map((route) => ({
    id: route.id,
    title: route.title,
    count: resources.filter((resource) => resource.routeCodes.includes(route.id)).length
  }))];
  document.getElementById("resource-route-filters").innerHTML = routeFilters.map((filter) => `<button class="filter-button ${activeResourceRoute === filter.id ? "is-active" : ""}" type="button" data-resource-route="${escapeHTML(filter.id)}">${escapeHTML(filter.title)} ${filter.count}</button>`).join("");

  const providers = [...new Map(resources.map((resource) => [resource.provider.id, resource.provider])).values()]
    .sort((a, b) => a.label.localeCompare(b.label, "zh-CN"));
  if (activeResourceProvider !== "all" && !providers.some((provider) => provider.id === activeResourceProvider)) {
    activeResourceProvider = "all";
  }
  const providerFilters = [{ id: "all", label: "全部来源", count: resources.length }, ...providers.map((provider) => ({
    id: provider.id,
    label: provider.label,
    count: resources.filter((resource) => resource.provider.id === provider.id).length
  }))];
  document.getElementById("resource-provider-filters").innerHTML = providerFilters.map((filter) => `<button class="filter-button ${activeResourceProvider === filter.id ? "is-active" : ""}" type="button" data-resource-provider="${escapeHTML(filter.id)}">${escapeHTML(filter.label)} ${filter.count}</button>`).join("");
  document.getElementById("resource-provider-count").textContent = `来源 ${providers.length} 类`;
}

function renderResourceIndex(query = document.getElementById("resource-search-input")?.value || "") {
  const allResources = getUnifiedResourceIndex();
  const visibleResources = getFilteredResources(query);
  renderResourceFilters(allResources);
  const navBadge = document.getElementById("resource-nav-badge");
  if (navBadge) navBadge.textContent = String(allResources.length);
  document.getElementById("resource-visible-count").textContent = `${visibleResources.length} / ${allResources.length}`;
  document.getElementById("resource-grid").innerHTML = visibleResources.length ? visibleResources.map((resource) => {
    const routeLabels = resource.routeCodes.map((routeCode) => `<span>${escapeHTML(routeCode === "AI-ZONE" ? "AI 专区" : routeCode)}</span>`).join("");
    const usageCopy = resource.usages.slice(0, 4).map((usage) => `<li>${escapeHTML(usage.routeCode === "AI-ZONE" ? "AI 专区" : usage.routeCode)} · ${escapeHTML(usage.moduleTitle)} · ${usage.courseCount} 课</li>`).join("");
    const extraUsage = resource.usages.length > 4 ? `<li>还有 ${resource.usages.length - 4} 个模块使用</li>` : "";
    return `<article class="resource-card">
      <div class="resource-card-top">
        <span class="resource-provider">${escapeHTML(resource.provider.label)}</span>
        <code title="${escapeHTML(resource.ids.join("、"))}">${escapeHTML(resource.ids.length > 1 ? `${resource.id} +${resource.ids.length - 1}` : resource.id)}</code>
      </div>
      <h3>${escapeHTML(resource.title)}</h3>
      <div class="resource-route-tags">${routeLabels}</div>
      <ul class="resource-usage-list">${usageCopy}${extraUsage}</ul>
      <div class="resource-card-footer">
        <span>${resource.courseCount ? `${resource.courseCount} 节课程引用` : "资料库收录"}</span>
        <a class="reference-link" href="${escapeHTML(resource.url)}" target="_blank" rel="noopener noreferrer">打开资料 <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }).join("") : `<div class="review-empty">
    <strong>没有匹配的资料</strong>
    <p>换一个关键词，或清空方向/来源筛选后再试。</p>
  </div>`;
}

const portfolioLevelLabels = ["入门作品", "综合作品", "优化复盘"];
const portfolioModuleIndexMap = [[0, 1], [2, 3], [4]];
const portfolioEvidenceMap = {
  WEB: [
    ["页面截图与移动端截图", "组件/状态拆分表", "筛选、编辑、权限、草稿保存演示", "README 运行说明"],
    ["接口文档与数据库模型", "登录链路图", "表单到 API 再到数据库的录屏", "异常用例表"],
    ["Lighthouse 报告", "3 个体验问题修复记录", "修复前后指标对比", "上线/回滚说明"]
  ],
  AI: [
    ["样本字段说明", "推荐打分规则或模型说明", "指标解释表", "可解释推荐案例"],
    ["CSV 清洗脚本", "图表输出", "异常样本清单", "业务结论 Markdown"],
    ["预测 API", "输入输出样本日志", "评估指标截图", "模型版本与回滚记录"]
  ],
  SEC: [
    ["登录链路资产表", "风险复现记录", "权限边界矩阵", "修复建议清单"],
    ["静态字符串证据", "运行轨迹截图", "行为时间线", "结论与不确定性说明"],
    ["检测规则文件", "匹配样本日志", "误报/漏报复盘", "修复闭环报告"]
  ],
  IOT: [
    ["接线/接口说明", "采集数据表", "校准记录", "异常读数处理说明"],
    ["消息协议说明", "下发与确认日志", "失败重试记录", "离线状态处理表"],
    ["固件版本表", "升级/回滚流程", "断电保护验证", "设备安全边界说明"]
  ],
  GAME: [
    ["可运行 Demo", "角色与敌人状态表", "关卡数据文件", "胜负反馈截图"],
    ["关卡编辑器界面", "数据结构说明", "保存版本样例", "读取失败处理说明"],
    ["Profiler 截图", "掉帧定位记录", "优化前后 FPS 对比", "打包发布说明"]
  ],
  CLOUD: [
    ["Dockerfile 与镜像说明", "配置注入方式", "健康检查结果", "容器运行日志"],
    ["日志/指标/追踪字段表", "观测面板截图", "告警规则", "一次请求追踪记录"],
    ["故障注入记录", "恢复步骤", "复盘报告", "容量与成本影响说明"]
  ]
};

const portfolioStatusOptions = [
  { id: "not-started", label: "未开始", shortLabel: "未开始" },
  { id: "in-progress", label: "进行中", shortLabel: "进行中" },
  { id: "done", label: "已完成", shortLabel: "已完成" }
];

const portfolioExecutionDetails = {
  "portfolio-web-1": {
    requirement: "做一个课程管理后台，让管理员能查看课程列表、筛选课程、编辑课程基础信息，并把未发布修改保存为草稿。",
    requirements: ["课程列表支持阶段、状态、关键词筛选。", "课程编辑表单至少包含标题、摘要、阶段、时长和发布状态。", "普通用户只能查看，管理员可以编辑和保存草稿。", "草稿保存后刷新页面仍可恢复，发布前要有确认提示。"],
    fileTree: ["web-course-admin/", "├─ README.md", "├─ index.html", "├─ src/", "│  ├─ data/courses.json", "│  ├─ components/course-table.js", "│  ├─ components/course-editor.js", "│  ├─ auth/permission.js", "│  └─ main.js", "└─ tests/admin-flow-checklist.md"],
    steps: ["画出后台首页、课程表格、编辑弹窗和草稿提示四个界面草图。", "准备 courses.json，至少放入 20 条课程样例，字段保持稳定。", "实现筛选、选中课程、打开编辑表单和本地状态更新。", "增加 role 判断：viewer 隐藏编辑入口，admin 显示保存草稿和发布按钮。", "把草稿写入 localStorage，并在刷新后恢复未发布修改。", "写 README，说明账号角色、数据字段、运行方式和验收步骤。"],
    acceptance: ["筛选条件组合使用时结果数量正确。", "viewer 角色看不到编辑按钮，admin 可以保存草稿。", "刷新页面后草稿仍存在，清除草稿后恢复原数据。", "编辑空标题、非法时长等异常时有明确提示。", "README 能让别人 5 分钟内打开并复现主要流程。"]
  },
  "portfolio-web-2": {
    requirement: "做一个可登录笔记站，完整串起前端表单、后端 API、登录凭证、笔记数据库和错误处理。",
    requirements: ["用户可以注册或使用预置账号登录。", "登录后才能创建、编辑、删除自己的笔记。", "接口返回统一的成功和错误 JSON 结构。", "笔记至少包含标题、正文、更新时间和 owner 字段。"],
    fileTree: ["login-notes-app/", "├─ README.md", "├─ frontend/", "│  ├─ index.html", "│  ├─ src/api.js", "│  ├─ src/auth.js", "│  └─ src/notes.js", "├─ server/", "│  ├─ app.js", "│  ├─ routes/auth.js", "│  ├─ routes/notes.js", "│  └─ db/schema.sql", "└─ docs/api.md"],
    steps: ["写接口表：登录、退出、获取笔记、创建笔记、编辑笔记、删除笔记。", "设计 users 和 notes 两张表，明确 owner_id 与权限边界。", "先做前端静态表单，再用 fetch 接入本地 API。", "实现登录凭证保存、请求携带和登录过期处理。", "后端对每个笔记接口都校验登录状态和 owner。", "补 docs/api.md，记录字段、成功示例和异常示例。"],
    acceptance: ["未登录访问笔记接口会得到明确错误。", "A 用户看不到 B 用户的笔记。", "创建、编辑、删除后列表状态和数据库状态一致。", "刷新页面后登录态和笔记列表处理合理。", "API 文档覆盖成功、未登录、无权限、字段非法四类情况。"]
  },
  "portfolio-web-3": {
    requirement: "对一个移动端页面做体验审计，用 Lighthouse 或手工清单找出 3 个问题，修复后给出前后对比证据。",
    requirements: ["选择一个已有页面或自建课程详情页作为审计对象。", "至少覆盖性能、可访问性、响应式和交互反馈中的 3 类问题。", "每个问题都要有复现步骤、原因判断、修复方案和修复后截图。", "保留修复前后指标或现象对比。"],
    fileTree: ["mobile-audit-report/", "├─ README.md", "├─ before/", "│  ├─ lighthouse.json", "│  └─ screenshots/", "├─ after/", "│  ├─ lighthouse.json", "│  └─ screenshots/", "├─ src/", "│  ├─ index.html", "│  ├─ styles.css", "│  └─ main.js", "└─ audit-report.md"],
    steps: ["确定审计页面和目标设备宽度，例如 390px 手机宽度。", "运行 Lighthouse 或用手工清单记录首轮问题。", "按影响排序，选择 3 个最值得修的问题。", "逐项修复布局溢出、图片尺寸、焦点状态、按钮间距或加载阻塞。", "再次审计并记录前后对比。", "写 audit-report.md，说明哪些问题暂不处理以及原因。"],
    acceptance: ["手机宽度下页面没有整体横向滚动。", "3 个问题都有前后截图或指标证据。", "修复没有破坏桌面端布局。", "按钮、输入框和链接有可见焦点状态。", "报告能说明问题、原因、改法和结果。"]
  },
  "portfolio-ai-1": {
    requirement: "做一个课程推荐打分器，用用户学习行为和课程标签生成可解释推荐结果。",
    requirements: ["输入至少包含已完成课程、感兴趣方向、最近错题或笔记关键词。", "输出推荐课程列表、推荐分数和推荐理由。", "推荐规则或模型必须可解释，不能只输出黑盒结果。", "提供 3 组不同用户样例做对比。"],
    fileTree: ["course-recommender/", "├─ README.md", "├─ data/", "│  ├─ courses.csv", "│  └─ users.json", "├─ notebooks/exploration.ipynb", "├─ src/", "│  ├─ features.py", "│  ├─ score.py", "│  └─ explain.py", "└─ reports/recommendation-cases.md"],
    steps: ["整理课程字段：阶段、方向、关键词、难度和前置要求。", "设计用户画像字段：完成记录、兴趣方向、薄弱概念。", "写特征函数，把用户和课程转成可计算分数。", "实现推荐排序，并输出每门课的加分原因。", "用 3 个用户样例检查推荐是否符合直觉。", "写报告说明规则局限、偏差来源和下一轮改进。"],
    acceptance: ["每条推荐都有分数和至少 2 条理由。", "不同用户得到不同推荐，不是固定列表。", "能解释某门课为什么排第一。", "输入缺少兴趣方向时也有默认策略。", "报告说明数据不足和冷启动风险。"]
  },
  "portfolio-ai-2": {
    requirement: "做一个 CSV 分析报告器，读取表格后自动输出数据质量、基础图表、异常记录和业务结论。",
    requirements: ["支持读取一个本地 CSV 文件并识别字段类型。", "输出缺失、重复、异常值和基础统计。", "至少生成 3 张图表或表格摘要。", "最终生成一份 Markdown 或 HTML 报告。"],
    fileTree: ["csv-report-generator/", "├─ README.md", "├─ data/sample.csv", "├─ src/", "│  ├─ load_data.py", "│  ├─ profile_data.py", "│  ├─ charts.py", "│  └─ report.py", "├─ outputs/", "│  ├─ figures/", "│  └─ report.md", "└─ tests/test_profile_data.py"],
    steps: ["准备一份样例 CSV，包含缺失值、重复行和异常数值。", "实现读取、字段类型识别和基础统计。", "增加数据质量检查：缺失、重复、范围异常、类别异常。", "生成图表或摘要表，例如分布、Top N、趋势或相关关系。", "把分析结果写成 report.md，附上结论和注意事项。", "用另一份 CSV 跑一遍，检查字段变化时是否有清晰错误。"],
    acceptance: ["样例 CSV 能生成完整报告。", "缺失、重复、异常值数量与人工检查一致。", "图表或摘要文件路径在报告中可找到。", "字段不存在或格式错误时提示清楚。", "报告包含至少 3 条业务结论或下一步问题。"]
  },
  "portfolio-ai-3": {
    requirement: "做一个轻量模型 API，把训练好的小模型包装成预测接口，并记录输入输出样本用于复盘。",
    requirements: ["训练或加载一个简单分类/回归模型。", "提供 /predict 接口，输入 JSON，输出预测结果和置信信息。", "记录请求时间、输入摘要、输出结果和模型版本。", "保留模型评估指标与回滚说明。"],
    fileTree: ["light-model-api/", "├─ README.md", "├─ model/", "│  ├─ train.py", "│  ├─ model.pkl", "│  └─ metrics.json", "├─ app/", "│  ├─ main.py", "│  ├─ schemas.py", "│  └─ logger.py", "├─ logs/predictions.jsonl", "└─ tests/test_predict_api.py"],
    steps: ["选一个小数据集，先训练 baseline 模型并保存指标。", "定义请求和响应 schema，明确字段类型和错误格式。", "实现 /predict 接口和输入校验。", "给每次预测写 JSONL 日志，避免记录敏感原文。", "增加模型版本号和加载失败处理。", "写 README，说明训练、启动、调用和回滚流程。"],
    acceptance: ["/predict 对合法输入返回稳定 JSON。", "非法字段、缺失字段、类型错误都有明确响应。", "每次预测能在日志中找到时间、版本和结果。", "metrics.json 能说明模型不是随机输出。", "README 中有 curl 或 fetch 调用示例。"]
  },
  "portfolio-sec-1": {
    requirement: "做一次登录审计演练，对本地测试系统检查弱口令、越权访问和异常访问日志，形成修复闭环。",
    requirements: ["目标限定为本地靶场或自建测试登录系统。", "梳理账号角色、登录接口、权限页面和日志字段。", "验证弱口令、未登录访问、越权访问和异常重试记录。", "输出开发者能执行的修复建议。"],
    fileTree: ["login-audit-lab/", "├─ README.md", "├─ target-notes/", "│  ├─ assets.md", "│  ├─ roles.md", "│  └─ log-fields.md", "├─ checks/", "│  ├─ weak-password.md", "│  ├─ access-control.md", "│  └─ abnormal-login.md", "└─ report/fix-plan.md"],
    steps: ["画出登录链路：页面、接口、会话、数据库和日志。", "列出角色矩阵：访客、普通用户、管理员。", "用少量本地测试账号验证弱口令和错误提示。", "验证未登录、低权限访问高权限资源时的响应。", "检查日志是否记录时间、账号、来源、结果和原因。", "写 fix-plan.md，把风险、证据、影响和修复建议分开。"],
    acceptance: ["每个风险点都有复现步骤和证据。", "报告区分漏洞、利用条件和业务影响。", "修复建议能落到接口、权限、日志或密码策略。", "复测项能证明修复是否有效。", "不把真实账号、密码或敏感日志写进报告。"]
  },
  "portfolio-sec-2": {
    requirement: "做一个本地样本行为分析报告，从静态字符串、文件结构和运行轨迹整理证据链。",
    requirements: ["样本使用本地自建程序或公开教学样本。", "静态分析至少记录文件信息、字符串、导入或配置。", "动态观察至少记录进程、文件、网络或日志行为。", "结论必须标注证据来源和不确定性。"],
    fileTree: ["sample-behavior-analysis/", "├─ README.md", "├─ sample-info/", "│  ├─ hashes.txt", "│  ├─ strings.txt", "│  └─ imports.md", "├─ runtime-observation/", "│  ├─ process.md", "│  ├─ filesystem.md", "│  └─ network.md", "└─ report/behavior-timeline.md"],
    steps: ["记录样本来源、文件名、大小、哈希和运行环境。", "提取可见字符串、配置项、路径和明显函数名。", "在隔离本地环境中运行样本，观察进程、文件和网络变化。", "把静态线索与运行行为按时间线合并。", "区分已观察事实、推断和未验证结论。", "写行为报告和可复查的操作记录。"],
    acceptance: ["报告中每个结论都能追到静态或动态证据。", "时间线能说明行为发生顺序。", "未验证项明确标注，不装作确定结论。", "保留原始记录路径，例如 strings.txt、process.md。", "分析环境、工具和样本哈希写清楚。"]
  },
  "portfolio-sec-3": {
    requirement: "做一组检测规则包，为几类可观察攻击行为编写日志匹配规则，并记录误报与漏报复盘。",
    requirements: ["选定日志来源，例如 Web 访问日志、认证日志或应用审计日志。", "至少写 5 条检测规则。", "为每条规则准备命中样例和不应命中的反例。", "输出规则说明、字段依赖和调优记录。"],
    fileTree: ["detection-rule-pack/", "├─ README.md", "├─ logs/", "│  ├─ positive-samples.log", "│  └─ negative-samples.log", "├─ rules/", "│  ├─ auth-anomaly.yml", "│  ├─ path-traversal.yml", "│  └─ suspicious-errors.yml", "└─ report/rule-review.md"],
    steps: ["确定日志字段：时间、来源、账号、路径、状态码、错误码。", "整理正样本和反样本，先人工标注预期结果。", "为每类行为写第一版规则，并说明匹配条件。", "用样本日志测试命中情况，记录误报和漏报。", "调整阈值、字段组合或排除条件。", "写 rule-review.md，总结规则适用范围和维护方式。"],
    acceptance: ["至少 5 条规则都有说明和样例。", "正样本能命中，反样本不过度误报。", "每条规则写清字段依赖和适用日志类型。", "复盘报告记录至少 2 次调优原因。", "规则目录结构清楚，后续可继续添加。"]
  },
  "portfolio-iot-1": {
    requirement: "做一个温湿度采集器，稳定读取传感器数据，完成基础校准、异常值处理和数据记录。",
    requirements: ["可以使用真实开发板，也可以用模拟传感器数据。", "采集数据包含时间、温度、湿度、设备编号和状态。", "实现简单校准参数和异常值过滤。", "输出可复查的数据记录和采集报告。"],
    fileTree: ["temp-humidity-collector/", "├─ README.md", "├─ firmware/", "│  ├─ main.c", "│  ├─ sensor.c", "│  └─ sensor.h", "├─ simulator/sensor_sim.py", "├─ data/readings.csv", "└─ report/calibration.md"],
    steps: ["确定硬件或模拟方案，写清传感器接口和采样周期。", "实现读取函数，先输出原始值。", "增加校准参数，例如 offset 和 scale。", "过滤明显异常值，并记录异常原因。", "把数据写入 CSV 或串口日志。", "写 calibration.md，说明校准方法和误差范围。"],
    acceptance: ["连续采集 10 分钟无明显中断。", "数据记录字段完整，时间顺序正确。", "异常值不会直接污染最终报告。", "校准前后有对比数据。", "README 能说明真实硬件和模拟模式如何切换。"]
  },
  "portfolio-iot-2": {
    requirement: "做一个远程灯控节点，完成消息下发、执行确认、失败重试和离线状态处理。",
    requirements: ["支持 on/off/toggle 三类命令。", "每条命令有唯一编号和确认结果。", "通信失败时能重试并记录失败原因。", "设备离线时界面或日志能明确显示状态。"],
    fileTree: ["remote-light-node/", "├─ README.md", "├─ device/", "│  ├─ main.c", "│  ├─ command.c", "│  └─ network.c", "├─ controller/", "│  ├─ send_command.py", "│  └─ dashboard.html", "└─ logs/command-history.jsonl"],
    steps: ["设计命令格式：command_id、device_id、action、timestamp。", "实现设备端命令解析和执行结果返回。", "实现控制端下发命令和等待确认。", "加入超时、重试次数和最终失败状态。", "模拟设备离线、重复命令和非法命令。", "写命令历史日志和复盘说明。"],
    acceptance: ["on/off/toggle 能改变设备状态或模拟状态。", "每条命令能看到 pending、success、failed 状态。", "网络超时后按设定次数重试。", "重复命令不会造成不可预测状态。", "日志能复原一次命令从下发到确认的全过程。"]
  },
  "portfolio-iot-3": {
    requirement: "做一次固件更新演练，验证版本检查、升级流程、失败回滚和断电保护思路。",
    requirements: ["固件包包含版本号、校验值和更新说明。", "升级前检查版本、设备型号和文件完整性。", "升级失败时保留回滚路径。", "用文档或模拟脚本验证断电/中断场景。"],
    fileTree: ["firmware-update-drill/", "├─ README.md", "├─ firmware/", "│  ├─ v1.bin", "│  ├─ v2.bin", "│  └─ manifest.json", "├─ updater/", "│  ├─ verify.py", "│  ├─ update.py", "│  └─ rollback.py", "└─ report/update-drill.md"],
    steps: ["定义 manifest 字段：version、device、hash、size、notes。", "写 verify.py，检查版本、型号和哈希。", "写 update.py 模拟写入流程和进度记录。", "设计失败点：文件损坏、中途断开、版本不兼容。", "实现或描述 rollback.py 的回滚策略。", "写演练报告，记录每个失败场景的处理结果。"],
    acceptance: ["错误固件不会通过校验。", "低版本、同版本、高版本处理逻辑清楚。", "升级中断后能说明设备如何回到可用状态。", "manifest 与实际文件一致。", "报告包含成功路径、失败路径和回滚证据。"]
  },
  "portfolio-game-1": {
    requirement: "做一个 2D 闯关小品，包含角色移动、敌人、关卡、碰撞、胜负反馈和可运行 Demo。",
    requirements: ["角色支持左右移动、跳跃或基础攻击。", "至少有 2 类敌人或障碍。", "至少有 2 个关卡或 2 段难度变化。", "有开始、胜利、失败和重新开始反馈。"],
    fileTree: ["mini-2d-platformer/", "├─ README.md", "├─ assets/", "│  ├─ sprites/", "│  └─ audio/", "├─ src/", "│  ├─ main.js", "│  ├─ player.js", "│  ├─ enemy.js", "│  ├─ levels.js", "│  └─ collision.js", "└─ docs/playtest.md"],
    steps: ["确定引擎或技术栈，例如 Canvas、Godot 或 Unity。", "实现游戏循环、输入处理和角色移动。", "加入地图数据、碰撞检测和敌人行为。", "增加胜利、失败、重开和暂停状态。", "做两轮试玩，记录卡点和手感问题。", "写 README 和 playtest.md，说明玩法、操作和已知问题。"],
    acceptance: ["Demo 可启动并完成一局。", "角色、敌人、关卡和胜负状态完整。", "碰撞结果稳定，不出现明显穿墙或卡死。", "至少 2 条试玩反馈被记录或修复。", "README 中有操作说明和运行方式。"]
  },
  "portfolio-game-2": {
    requirement: "做一个关卡编辑器，用数据驱动生成场景，并能保存、加载和管理关卡版本。",
    requirements: ["能添加、移动、删除基础关卡元素。", "关卡保存为 JSON 或同类数据文件。", "支持加载已有关卡并继续编辑。", "保存时记录版本号、更新时间和作者备注。"],
    fileTree: ["level-editor/", "├─ README.md", "├─ editor/", "│  ├─ index.html", "│  ├─ editor.js", "│  ├─ palette.js", "│  └─ serializer.js", "├─ levels/", "│  ├─ level-001.json", "│  └─ level-002.json", "└─ docs/data-format.md"],
    steps: ["设计关卡数据结构：尺寸、元素类型、坐标、属性和版本。", "做编辑器画布和元素面板。", "实现添加、选中、拖动、删除和撤销的最小能力。", "实现保存 JSON、加载 JSON 和格式校验。", "把保存的关卡接入一个简单预览器。", "写 data-format.md，说明字段含义和兼容策略。"],
    acceptance: ["编辑器能创建并保存一个新关卡。", "加载后元素位置和属性不丢失。", "非法关卡文件有清晰报错。", "预览器能按 JSON 生成场景。", "数据格式文档能指导后续新增元素类型。"]
  },
  "portfolio-game-3": {
    requirement: "做一次性能修复记录，定位并优化一个掉帧问题，用指标证明优化收益。",
    requirements: ["选择一个可复现的掉帧场景。", "记录优化前 FPS、帧耗时或 profiler 数据。", "定位瓶颈来源，例如渲染、资源加载、碰撞或脚本逻辑。", "修复后保留前后对比和副作用说明。"],
    fileTree: ["game-performance-fix/", "├─ README.md", "├─ captures/", "│  ├─ before-profile.png", "│  └─ after-profile.png", "├─ src/", "│  ├─ before/", "│  └─ after/", "└─ report/performance-fix.md"],
    steps: ["定义复现场景：关卡、角色位置、操作步骤和设备环境。", "采集优化前数据，截图或导出 profiler。", "按渲染、物理、脚本、资源四类排查瓶颈。", "只改一个主要问题，避免多项改动混在一起。", "再次采集数据并对比。", "写 performance-fix.md，说明收益、代价和未处理问题。"],
    acceptance: ["掉帧场景可以按步骤复现。", "优化前后至少有一组客观指标。", "报告能指出瓶颈所在模块。", "优化没有破坏玩法或画面关键效果。", "保留可回退的 before/after 代码或记录。"]
  },
  "portfolio-cloud-1": {
    requirement: "把课程 API 容器化，构建镜像、注入配置、运行服务并提供健康检查。",
    requirements: ["API 至少提供课程列表和课程详情两个接口。", "Dockerfile 使用清晰的构建步骤。", "运行配置通过环境变量注入。", "健康检查能反映服务是否可用。"],
    fileTree: ["course-api-container/", "├─ README.md", "├─ Dockerfile", "├─ compose.yml", "├─ app/", "│  ├─ main.js", "│  ├─ routes/courses.js", "│  └─ config.js", "├─ data/courses.json", "└─ docs/container-checklist.md"],
    steps: ["先实现本地可运行的课程 API。", "整理配置项，例如 PORT、DATA_PATH、LOG_LEVEL。", "编写 Dockerfile，明确复制文件、安装依赖和启动命令。", "用 compose.yml 注入环境变量并挂载测试数据。", "增加 /healthz 接口，检查配置和数据是否可读。", "写容器运行、查看日志和回滚镜像的说明。"],
    acceptance: ["本地和容器内 API 响应一致。", "容器启动后 /healthz 返回可用状态。", "配置改动无需修改代码。", "镜像构建过程没有复制无关大文件。", "README 包含 build、run、logs、stop 四类命令。"]
  },
  "portfolio-cloud-2": {
    requirement: "做一个观测面板，把延迟、错误率、资源占用和请求追踪串起来，帮助定位服务问题。",
    requirements: ["定义至少 5 个关键指标。", "日志、指标和追踪字段要能通过 request_id 关联。", "面板展示正常、异常和趋势变化。", "输出一次问题定位示例。"],
    fileTree: ["observability-dashboard/", "├─ README.md", "├─ app/", "│  ├─ service.js", "│  ├─ logger.js", "│  └─ metrics.js", "├─ dashboard/", "│  ├─ index.html", "│  └─ charts.js", "├─ samples/logs.jsonl", "└─ report/trace-walkthrough.md"],
    steps: ["定义指标：请求量、延迟 P95、错误率、CPU、内存。", "给每次请求生成 request_id，并写入日志。", "采集或模拟指标数据，形成固定样例。", "做面板展示：数字卡片、趋势图、错误列表。", "选一次异常请求，从面板跳到日志和追踪记录。", "写 walkthrough，说明如何从用户报错定位到服务原因。"],
    acceptance: ["面板能展示至少 5 个指标。", "错误请求能通过 request_id 找到关联日志。", "正常和异常样例在面板上可区分。", "定位示例包含现象、证据、原因和处理建议。", "README 说明数据来源和字段含义。"]
  },
  "portfolio-cloud-3": {
    requirement: "做一次故障演练，模拟服务不可用，完成发现、定位、恢复和复盘报告。",
    requirements: ["选定一个服务不可用场景，例如端口错误、依赖不可读或配置缺失。", "记录故障注入方式和开始时间。", "按日志、指标、配置、进程顺序定位。", "恢复后写复盘报告和预防措施。"],
    fileTree: ["incident-drill/", "├─ README.md", "├─ scenarios/", "│  ├─ bad-config.md", "│  ├─ port-conflict.md", "│  └─ dependency-down.md", "├─ runbooks/", "│  └─ restore-service.md", "├─ evidence/", "│  ├─ logs.txt", "│  └─ metrics.md", "└─ report/postmortem.md"],
    steps: ["选择一个低风险本地服务作为演练对象。", "写故障场景和预期现象。", "注入故障并记录时间线。", "按 runbook 检查端口、进程、日志、配置和依赖。", "执行恢复动作并验证服务恢复。", "写 postmortem.md，总结影响、根因、处理过程和预防项。"],
    acceptance: ["故障能被稳定复现和恢复。", "时间线包含发现、定位、恢复、验证四个节点。", "证据目录保存关键日志或指标。", "复盘报告不只写结论，还写根因和改进项。", "runbook 可被另一个人照着执行。"]
  }
};

function splitPortfolioProject(projectCopy) {
  const [rawTitle, ...summaryParts] = String(projectCopy).split(/[：:]/);
  return {
    title: rawTitle.trim(),
    summary: summaryParts.join("：").trim() || "按方向课程要求完成一个可演示、可复盘、可验收的项目。"
  };
}

function getPortfolioEvidence(routeCode, projectIndex) {
  return portfolioEvidenceMap[routeCode]?.[projectIndex] || [
    "可运行作品或演示截图",
    "README 运行说明",
    "关键链路复盘",
    "验收清单"
  ];
}

function getPortfolioModuleIndexes(projectIndex, moduleCount) {
  const indexes = portfolioModuleIndexMap[projectIndex] || [projectIndex];
  return indexes.filter((index) => index >= 0 && index < moduleCount);
}

let portfolioProjectsCache = null;

function getPortfolioProjects() {
  if (portfolioProjectsCache) return portfolioProjectsCache;
  portfolioProjectsCache = futureRoutes.flatMap((route) => route.projects.map((projectCopy, projectIndex) => {
    const copy = splitPortfolioProject(projectCopy);
    const moduleIndexes = getPortfolioModuleIndexes(projectIndex, route.modules.length);
    const modules = moduleIndexes.map((moduleIndex) => getExtensionModule(route.code, moduleIndex)).filter(Boolean);
    const suggestedCourses = modules.flatMap((module) => getExtensionCoursesByModule(route.code, module.index));
    return {
      id: `portfolio-${route.code.toLowerCase()}-${projectIndex + 1}`,
      number: `${route.code}-${String(projectIndex + 1).padStart(2, "0")}`,
      routeCode: route.code,
      routeTitle: route.title,
      routeTone: route.tone,
      prerequisite: route.prerequisite,
      title: copy.title,
      summary: copy.summary,
      level: portfolioLevelLabels[projectIndex] || "方向作品",
      modules,
      topics: route.topics,
      checks: route.checks,
      evidence: getPortfolioEvidence(route.code, projectIndex),
      suggestedCourses,
      execution: portfolioExecutionDetails[`portfolio-${route.code.toLowerCase()}-${projectIndex + 1}`] || null
    };
  }));
  return portfolioProjectsCache;
}

function getFilteredPortfolioProjects(query = "") {
  const normalized = query.trim().toLowerCase();
  return getPortfolioProjects().filter((project) => {
    const routeMatched = activePortfolioRoute === "all" || project.routeCode === activePortfolioRoute;
    const text = [
      project.number,
      project.routeCode,
      project.routeTitle,
      project.prerequisite,
      project.title,
      project.summary,
      project.level,
      project.topics.join(" "),
      project.modules.map((module) => module.title).join(" "),
      project.checks.join(" "),
      project.evidence.join(" "),
      project.execution?.requirement || "",
      project.execution?.requirements?.join(" ") || "",
      project.execution?.fileTree?.join(" ") || "",
      project.execution?.steps?.join(" ") || "",
      project.execution?.acceptance?.join(" ") || "",
      project.suggestedCourses.map((course) => `${course.title} ${course.summary} ${course.practice}`).join(" ")
    ].join(" ").toLowerCase();
    return routeMatched && (!normalized || text.includes(normalized));
  });
}

function renderPortfolioFilters(projects) {
  const routeFilters = [{ id: "all", title: "全部方向", count: projects.length }, ...futureRoutes.map((route) => ({
    id: route.code,
    title: route.code,
    count: projects.filter((project) => project.routeCode === route.code).length
  }))];
  document.getElementById("portfolio-route-filters").innerHTML = routeFilters.map((filter) => `<button class="filter-button ${activePortfolioRoute === filter.id ? "is-active" : ""}" type="button" data-portfolio-route="${escapeHTML(filter.id)}">${escapeHTML(filter.title)} ${filter.count}</button>`).join("");
  const statusCounts = portfolioStatusOptions.map((status) => ({
    ...status,
    count: projects.filter((project) => getPortfolioProjectStatus(project.id) === status.id).length
  }));
  document.getElementById("portfolio-route-count").textContent = statusCounts.map((status) => `${status.shortLabel} ${status.count}`).join(" · ");
}

function renderPortfolioStatusTag(projectId) {
  const status = getPortfolioStatusMeta(getPortfolioProjectStatus(projectId));
  return `<span class="portfolio-status-tag status-${escapeHTML(status.id)}">${escapeHTML(status.label)}</span>`;
}

function renderPortfolioStatusControls(projectId, compact = false) {
  const currentStatus = getPortfolioProjectStatus(projectId);
  return `<div class="portfolio-status-switch ${compact ? "is-compact" : ""}" role="group" aria-label="设置项目状态">
    ${portfolioStatusOptions.map((status) => `<button class="${currentStatus === status.id ? "is-active" : ""}" type="button" data-portfolio-project="${escapeHTML(projectId)}" data-portfolio-status="${escapeHTML(status.id)}" aria-pressed="${currentStatus === status.id}">${escapeHTML(compact ? status.shortLabel : status.label)}</button>`).join("")}
  </div>`;
}

function renderPortfolioProjects(query = document.getElementById("portfolio-search-input")?.value || "") {
  const allProjects = getPortfolioProjects();
  const visibleProjects = getFilteredPortfolioProjects(query);
  renderPortfolioFilters(allProjects);
  const navBadge = document.getElementById("portfolio-nav-badge");
  if (navBadge) navBadge.textContent = String(allProjects.length);
  document.getElementById("portfolio-visible-count").textContent = `${visibleProjects.length} / ${allProjects.length}`;
  document.getElementById("portfolio-grid").innerHTML = visibleProjects.length ? visibleProjects.map((project) => {
    const moduleTags = project.modules.map((module) => `<span>${escapeHTML(module.index + 1)} · ${escapeHTML(module.title)}</span>`).join("");
    const coursePreview = project.suggestedCourses.slice(0, 5).map((course) => `<li>${escapeHTML(course.title)}</li>`).join("");
    const extraCourses = project.suggestedCourses.length > 5 ? `<li>另 ${project.suggestedCourses.length - 5} 节方向课程</li>` : "";
    return `<article class="portfolio-card portfolio-card-${escapeHTML(project.routeTone)}">
      <div class="portfolio-card-top">
        <span class="portfolio-route-badge">${escapeHTML(project.routeCode)}</span>
        <div class="portfolio-card-status">${renderPortfolioStatusTag(project.id)}<code>${escapeHTML(project.number)}</code></div>
      </div>
      <div class="portfolio-card-title">
        <span>${escapeHTML(project.level)}</span>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.summary)}</p>
      </div>
      <dl class="portfolio-meta-list">
        <div><dt>方向</dt><dd>${escapeHTML(project.routeTitle)}</dd></div>
        <div><dt>前置</dt><dd>${escapeHTML(project.prerequisite)}</dd></div>
      </dl>
      <div class="portfolio-module-tags" aria-label="建议先学模块">${moduleTags}</div>
      <div class="portfolio-card-columns">
        <div>
          <strong>照着做的交付物</strong>
          <ul>${project.evidence.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>推荐先补课程</strong>
          <ul>${coursePreview}${extraCourses}</ul>
        </div>
      </div>
      <div class="portfolio-checks">
        <strong>验收抓手</strong>
        <ul>${project.checks.map((check) => `<li>${escapeHTML(check)}</li>`).join("")}</ul>
      </div>
      ${renderPortfolioStatusControls(project.id, true)}
      <div class="portfolio-card-footer">
        <span>${project.suggestedCourses.length} 节关联方向课程</span>
        <button class="text-button" type="button" data-open-portfolio-project="${escapeHTML(project.id)}">打开执行页 <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
  }).join("") : `<div class="review-empty">
    <strong>没有匹配的项目</strong>
    <p>换一个关键词，或清空方向筛选后再试。</p>
  </div>`;
}

function getPortfolioTemplateFilename(project, suffix) {
  const base = getPortfolioTemplateBaseName(project);
  return `${base}-${suffix}.md`;
}

function getPortfolioTemplateBaseName(project) {
  return `${project.number}-${project.title}`
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function renderMarkdownChecklist(items) {
  return items.map((item) => `- [ ] ${item}`).join("\n");
}

function buildStaticStarterServer() {
  return `"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname);
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8" };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\\/+/, "");
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep) && target !== root) { response.writeHead(403); response.end("Forbidden"); return; }
  fs.readFile(target, (error, content) => {
    if (error) { response.writeHead(error.code === "ENOENT" ? 404 : 500); response.end("Not found"); return; }
    response.writeHead(200, { "Content-Type": mime[path.extname(target)] || "application/octet-stream" });
    response.end(content);
  });
});
server.listen(8000, "127.0.0.1", () => console.log("Starter: http://127.0.0.1:8000"));
`;
}

function buildWebStarterServer(project, workflow) {
  return `"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname);
const projectMeta = ${JSON.stringify({ number: project.number, title: project.title, workflowId: workflow.id })};
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8" };
function send(response, status, body, contentType = "application/json; charset=utf-8") {
  const data = typeof body === "string" ? body : JSON.stringify(body);
  response.writeHead(status, { "Content-Type": contentType, "Content-Length": Buffer.byteLength(data) });
  response.end(data);
}
function loadCourses() {
  return JSON.parse(fs.readFileSync(path.join(root, "data", "courses.json"), "utf8"));
}
function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    if (request.method !== "GET") return send(response, 405, { error: "method_not_allowed" });
    if (url.pathname === "/api/health") return send(response, 200, { ok: true, service: projectMeta.number, workflowId: projectMeta.workflowId });
    if (url.pathname === "/api/courses") return send(response, 200, { items: loadCourses(), count: loadCourses().length });
    const courseMatch = url.pathname.match(/^\\/api\\/courses\\/(\\d+)$/);
    if (courseMatch) {
      const item = loadCourses().find((course) => String(course.id) === courseMatch[1]);
      return item ? send(response, 200, item) : send(response, 404, { error: "course_not_found" });
    }
    const relative = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\\/+/, "");
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep) && target !== root) return send(response, 403, { error: "forbidden" });
    fs.readFile(target, (error, content) => {
      if (error) return send(response, error.code === "ENOENT" ? 404 : 500, { error: error.code || "read_failed" });
      response.writeHead(200, { "Content-Type": mime[path.extname(target)] || "application/octet-stream" });
      response.end(content);
    });
  });
}
if (require.main === module) {
  const server = createServer();
  const port = Number(process.env.PORT || 8000);
  server.listen(port, "127.0.0.1", () => console.log("Starter: http://127.0.0.1:" + server.address().port));
}
module.exports = { createServer, projectMeta };
`;
}

function buildWebStarterSmoke(project, workflow) {
  return `"use strict";
const fs = require("fs");
const http = require("http");
const path = require("path");
const { createServer } = require("./server");
for (const file of ["index.html", "styles.css", "app.js", "server.js", "workflow.json", "data/courses.json"]) {
  if (!fs.existsSync(path.join(__dirname, file))) throw new Error("missing " + file);
}
function request(port, pathname) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: "127.0.0.1", port, path: pathname }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => resolve({ status: res.statusCode, body, contentType: res.headers["content-type"] || "" }));
    });
    req.on("error", reject);
  });
}
const server = createServer();
server.listen(0, "127.0.0.1", async () => {
  try {
    const page = await request(server.address().port, "/");
    const health = await request(server.address().port, "/api/health");
    const courses = await request(server.address().port, "/api/courses");
    const missing = await request(server.address().port, "/api/courses/9999");
    if (page.status !== 200 || !page.body.includes("<main")) throw new Error("page contract failed");
    if (health.status !== 200 || !JSON.parse(health.body).ok) throw new Error("health contract failed");
    if (courses.status !== 200 || JSON.parse(courses.body).count < 2) throw new Error("course list contract failed");
    if (missing.status !== 404) throw new Error("404 contract failed");
    console.log("${project.number} WEB starter smoke: PASS");
    console.log("workflow ${workflow.id}: page 200, health 200, courses 200, missing 404");
  } finally {
    server.close();
  }
});
`;
}

function buildCloudStarterService(project, workflow) {
  return `import json
import os
import sys
import uuid
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

PROJECT = ${JSON.stringify({ number: project.number, title: project.title, workflowId: workflow.id })}
WORKFLOW = ${JSON.stringify(workflow)}
ROOT = Path(__file__).resolve().parent
VERSION = os.getenv("SERVICE_VERSION", "0.1.0")
PUBLIC_CONFIG = {"SERVICE_NAME": os.getenv("SERVICE_NAME", PROJECT["number"]), "LOG_LEVEL": os.getenv("LOG_LEVEL", "info")}

def request_id():
    return uuid.uuid4().hex[:8]

def payload():
    return {"status": "ok", "project": PROJECT, "workflow": WORKFLOW, "version": VERSION, "config": PUBLIC_CONFIG}

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        rid = request_id()
        if self.path in ("/", "/health"):
            body = payload()
            status = 200
        elif self.path == "/api/courses":
            body = {"items": json.loads((ROOT / "data" / "courses.json").read_text(encoding="utf-8"))}
            status = 200
        else:
            body = {"error": "not_found"}
            status = 404
        raw = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("X-Request-Id", rid)
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)
        print(json.dumps({"event": "request", "request_id": rid, "path": self.path, "status": status}, ensure_ascii=False))

    def log_message(self, format, *args):
        return

if __name__ == "__main__":
    if "--smoke" in sys.argv:
        print(json.dumps({"health": payload(), "checks": ["config-is-public-only", "request-id", "rollback-ready"]}, ensure_ascii=False))
        raise SystemExit(0)
    port = int(os.getenv("PORT", "8080"))
    print("Service: http://127.0.0.1:%s/health" % port)
    HTTPServer(("127.0.0.1", port), Handler).serve_forever()
`;
}

function buildStarterPowerShell(command, relativePath, args = "") {
  const resolver = command === "python" ? `
function Resolve-PythonCommand {
  if ($env:PYTHON -and (Test-Path -LiteralPath $env:PYTHON -PathType Leaf)) {
    return @{ File = $env:PYTHON; Args = @() }
  }
  foreach ($candidate in @('python', 'py', 'python3')) {
    $found = Get-Command $candidate -ErrorAction SilentlyContinue
    if ($found) {
      if ($candidate -eq 'py') { return @{ File = $found.Source; Args = @('-3') } }
      return @{ File = $found.Source; Args = @() }
    }
  }
  throw '未找到 Python。请安装 Python 3，或先执行 $env:PYTHON = "C:\\Path\\To\\python.exe"。'
}
$runtime = Resolve-PythonCommand
& $runtime.File @($runtime.Args + (Join-Path $ProjectRoot '${relativePath}')${args ? ` + @('${args.trim().split(/\s+/).join("','")}')` : ""})
` : `& ${command} (Join-Path $ProjectRoot '${relativePath}')${args ? ` ${args}` : ""}
`;
  return `$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $ProjectRoot
${resolver.trim()}
exit $LASTEXITCODE
`;
}

const portfolioStarterWorkflows = {
  "portfolio-web-1": { id: "web-course-draft", name: "筛选课程并保存草稿", steps: ["载入课程样例", "按状态筛选", "修改课程时长", "保存本地草稿"], evidence: "筛选数量与草稿更新时间" },
  "portfolio-web-2": { id: "web-login-note", name: "登录后创建个人笔记", steps: ["校验演示账号", "建立本地会话", "创建带 owner 的笔记", "退出并清理会话"], evidence: "会话状态与笔记 owner" },
  "portfolio-web-3": { id: "web-mobile-audit", name: "执行移动端审计清单", steps: ["记录 390px 基线", "检查横向溢出", "检查焦点可见性", "生成前后对比"], evidence: "审计项通过数与问题清单" },
  "portfolio-ai-1": { id: "ai-course-recommend", name: "生成可解释课程推荐", steps: ["读取兴趣标签", "计算课程匹配分", "按分数排序", "输出推荐理由"], evidence: "推荐分数与命中标签" },
  "portfolio-ai-2": { id: "ai-csv-profile", name: "分析 CSV 数据质量", steps: ["读取样例行", "识别缺失值", "统计重复记录", "输出质量摘要"], evidence: "行数、缺失数与重复数" },
  "portfolio-ai-3": { id: "ai-model-predict", name: "运行轻量预测接口核心", steps: ["校验输入字段", "计算线性分数", "转换置信度", "记录模型版本"], evidence: "预测值、置信度与版本" },
  "portfolio-sec-1": { id: "sec-login-audit", name: "复核登录与权限事件", steps: ["载入本地认证日志", "统计失败次数", "检查角色边界", "输出修复项"], evidence: "异常来源与修复建议" },
  "portfolio-sec-2": { id: "sec-behavior-timeline", name: "合并样本行为时间线", steps: ["记录样本哈希", "载入静态线索", "合并运行事件", "区分事实与推断"], evidence: "按时间排序的证据链" },
  "portfolio-sec-3": { id: "sec-rule-evaluate", name: "评估检测规则命中", steps: ["载入正反样本", "应用匹配规则", "统计误报漏报", "输出调优记录"], evidence: "命中数、误报数与规则版本" },
  "portfolio-iot-1": { id: "iot-sensor-calibrate", name: "采集并校准温湿度", steps: ["生成原始读数", "应用 offset", "过滤范围异常", "写出采集摘要"], evidence: "校准前后读数与异常数" },
  "portfolio-iot-2": { id: "iot-command-ack", name: "下发灯控命令并确认", steps: ["创建 command_id", "解析 on/off/toggle", "模拟设备确认", "记录最终状态"], evidence: "命令状态与确认时间" },
  "portfolio-iot-3": { id: "iot-firmware-rollback", name: "校验固件并演练回滚", steps: ["读取 manifest", "校验型号和版本", "模拟更新中断", "恢复旧版本"], evidence: "校验结论与回滚版本" },
  "portfolio-game-1": { id: "game-platformer-loop", name: "运行角色移动与目标碰撞", steps: ["读取方向键", "更新角色坐标", "检测目标碰撞", "显示胜利反馈"], evidence: "可完成的一局 Demo" },
  "portfolio-game-2": { id: "game-level-editor", name: "编辑并保存关卡格子", steps: ["点击放置格子", "切换格子类型", "序列化关卡", "恢复已保存版本"], evidence: "关卡 JSON 与版本号" },
  "portfolio-game-3": { id: "game-frame-profiler", name: "观察帧耗时与慢帧", steps: ["采样帧间隔", "计算实时 FPS", "标记慢帧", "输出性能摘要"], evidence: "FPS、慢帧数与采样量" },
  "portfolio-cloud-1": { id: "cloud-container-health", name: "启动课程 API 健康检查", steps: ["载入服务配置", "启动 HTTP 服务", "响应 /health", "输出版本信息"], evidence: "健康响应与服务版本" },
  "portfolio-cloud-2": { id: "cloud-observability-signal", name: "关联日志指标与追踪", steps: ["创建 trace_id", "记录结构化日志", "累计请求指标", "返回观测摘要"], evidence: "trace_id、日志与指标" },
  "portfolio-cloud-3": { id: "cloud-incident-restore", name: "执行故障恢复演练", steps: ["注入配置故障", "识别健康异常", "应用恢复步骤", "输出复盘摘要"], evidence: "恢复时间与复盘结论" }
};

function getPortfolioStarterWorkflow(project) {
  return portfolioStarterWorkflows[project.id] || { id: project.id, name: project.title, steps: project.execution?.steps?.slice(0, 4) || [], evidence: project.evidence?.[0] || "运行记录" };
}

function getPortfolioStarterKit(project) {
  const workflow = getPortfolioStarterWorkflow(project);
  const metadata = JSON.stringify({ number: project.number, title: project.title, direction: project.routeCode, workflowId: workflow.id }, null, 2);
  const workflowJson = JSON.stringify(workflow, null, 2);
  const requirementList = project.execution?.requirements || [project.summary];
  const sharedStartHere = (stack, startCommand, smokeCommand) => `# 从这里开始

- 项目：${project.number} ${project.title}
- 技术栈：${stack}
- 业务流程：${workflow.name}（${workflow.id}）
- 启动：\`${startCommand}\`
- 快速验收：\`${smokeCommand}\`

启动代码只使用对应运行时的标准能力，先确认环境和执行链路，再逐步替换成项目执行页里的完整功能。
`;

  if (project.routeCode === "WEB") {
    const appSource = `"use strict";
const project = ${metadata};
const requirements = ${JSON.stringify(requirementList, null, 2)};
const workflow = ${workflowJson};
document.querySelector("#project-title").textContent = project.title;
document.querySelector("#project-code").textContent = project.number;
document.querySelector("#requirements").innerHTML = requirements.map((item) => "<li>" + item + "</li>").join("");
document.querySelector("#workflow").innerHTML = workflow.steps.map((item) => "<li>" + item + "</li>").join("");
const status = document.querySelector("#status");
document.querySelector("#run-demo").addEventListener("click", () => {
  const result = { workflow: workflow.id, completedSteps: workflow.steps.length, evidence: workflow.evidence, ranAt: new Date().toISOString() };
  status.textContent = JSON.stringify(result, null, 2);
  status.dataset.ready = "true";
});
`;
    const files = [
      { path: "starter/index.html", content: `<!doctype html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(project.title)}</title><link rel="stylesheet" href="styles.css"></head>
<body><main><span id="project-code"></span><h1 id="project-title"></h1><p>这是可直接运行的项目专属 Web 工作流。</p><h2>首轮需求</h2><ul id="requirements"></ul><h2>业务流程</h2><ol id="workflow"></ol><button id="run-demo" type="button">运行工作流</button><pre id="status" aria-live="polite">等待操作</pre></main><script src="app.js"></script></body></html>
` },
      { path: "starter/styles.css", content: `body{margin:0;background:#f3f6f4;color:#1e2a24;font:16px/1.6 system-ui,sans-serif}main{width:min(720px,calc(100% - 32px));margin:48px auto;padding:24px;border:1px solid #ccd8d1;background:#fff}h1{font-size:28px}button{min-height:42px;padding:8px 14px;border:0;background:#176b4d;color:#fff;font:inherit;cursor:pointer}#status[data-ready="true"]{color:#176b4d;font-weight:700}` },
      { path: "starter/app.js", content: appSource },
      { path: "starter/workflow.json", content: workflowJson + "\n" },
      { path: "starter/data/courses.json", content: JSON.stringify([
        { id: 1, title: "文件与路径基础", status: "published", duration: 35 },
        { id: 2, title: "HTTP 请求与响应", status: "draft", duration: 45 },
        { id: 3, title: "课程项目验收", status: "published", duration: 50 }
      ], null, 2) + "\n" },
      { path: "starter/server.js", content: buildWebStarterServer(project, workflow) },
      { path: "starter/smoke.js", content: buildWebStarterSmoke(project, workflow) },
      { path: "starter/.env.example", content: "PORT=8000\nNODE_ENV=development\n" },
      { path: "docs/api.md", content: `# API 契约\n\n- \`GET /api/health\`：返回服务状态、项目编号和 workflow ID。\n- \`GET /api/courses\`：返回课程列表与数量。\n- \`GET /api/courses/:id\`：返回单条课程；不存在时返回 404。\n- 所有错误均返回 JSON，不把内部路径写入响应。\n` },
      { path: "tests/contract.js", content: `"use strict";\nconst fs = require("fs");\nconst workflow = JSON.parse(fs.readFileSync(require("path").join(__dirname, "..", "starter", "workflow.json"), "utf8"));\nif (!workflow.id) throw new Error("workflow id missing");\nconsole.log("WEB contract metadata: PASS");\n` }
    ];
    return { workflow, stack: "HTML / CSS / JavaScript / Node.js", startCommand: ".\\scripts\\start-project.ps1", smokeCommand: ".\\scripts\\smoke-test.ps1", files: [
      ...files,
      { path: "scripts/start-project.ps1", content: buildStarterPowerShell("node", "starter/server.js") },
      { path: "scripts/smoke-test.ps1", content: buildStarterPowerShell("node", "starter/smoke.js") },
      { path: "START-HERE.md", content: sharedStartHere("HTML / CSS / JavaScript / Node.js", ".\\scripts\\start-project.ps1", ".\\scripts\\smoke-test.ps1") }
    ] };
  }

  if (project.routeCode === "GAME") {
    const gameSource = project.id === "portfolio-game-2" ? `"use strict";
const WORKFLOW_ID=${JSON.stringify(workflow.id)},canvas=document.querySelector("#game"),ctx=canvas.getContext("2d"),size=50;
let tiles=JSON.parse(localStorage.getItem("starter-level")||"[]");
canvas.addEventListener("click",event=>{const box=canvas.getBoundingClientRect(),x=Math.floor((event.clientX-box.left)*canvas.width/box.width/size),y=Math.floor((event.clientY-box.top)*canvas.height/box.height/size),key=x+":"+y,index=tiles.indexOf(key);if(index>=0)tiles.splice(index,1);else tiles.push(key);localStorage.setItem("starter-level",JSON.stringify(tiles));draw()});
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.strokeStyle="#cad8d0";for(let x=0;x<canvas.width;x+=size)for(let y=0;y<canvas.height;y+=size)ctx.strokeRect(x,y,size,size);ctx.fillStyle="#326fa8";for(const key of tiles){const [x,y]=key.split(":").map(Number);ctx.fillRect(x*size+2,y*size+2,size-4,size-4)}ctx.fillStyle="#17201c";ctx.font="18px system-ui";ctx.fillText("已保存格子: "+tiles.length,16,28)}draw();
` : project.id === "portfolio-game-3" ? `"use strict";
const WORKFLOW_ID=${JSON.stringify(workflow.id)},canvas=document.querySelector("#game"),ctx=canvas.getContext("2d");let last=performance.now(),samples=[],x=0;
function frame(now){const delta=now-last;last=now;samples.push(delta);if(samples.length>120)samples.shift();const fps=Math.round(1000/(samples.reduce((a,b)=>a+b,0)/samples.length));x=(x+3)%canvas.width;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#176b4d";ctx.fillRect(x,190,36,36);ctx.fillStyle="#17201c";ctx.font="22px system-ui";ctx.fillText("FPS: "+fps+" · samples: "+samples.length,20,38);requestAnimationFrame(frame)}requestAnimationFrame(frame);
` : `"use strict";
const WORKFLOW_ID=${JSON.stringify(workflow.id)},canvas=document.querySelector("#game"),ctx=canvas.getContext("2d");
const player={x:40,y:200,size:28,speed:4},goal={x:720,y:190,size:42},keys=new Set();
addEventListener("keydown",e=>keys.add(e.key));addEventListener("keyup",e=>keys.delete(e.key));
function frame(){if(keys.has("ArrowLeft"))player.x-=player.speed;if(keys.has("ArrowRight"))player.x+=player.speed;if(keys.has("ArrowUp"))player.y-=player.speed;if(keys.has("ArrowDown"))player.y+=player.speed;player.x=Math.max(0,Math.min(canvas.width-player.size,player.x));player.y=Math.max(0,Math.min(canvas.height-player.size,player.y));ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#e1b846";ctx.fillRect(goal.x,goal.y,goal.size,goal.size);ctx.fillStyle="#176b4d";ctx.fillRect(player.x,player.y,player.size,player.size);if(player.x+player.size>goal.x&&player.x<goal.x+goal.size&&player.y+player.size>goal.y&&player.y<goal.y+goal.size){ctx.fillStyle="#17201c";ctx.font="24px system-ui";ctx.fillText("目标达成",320,70)}requestAnimationFrame(frame)}frame();
`;
    const files = [
      { path: "starter/index.html", content: `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(project.title)}</title><style>body{margin:0;background:#17201c;color:#fff;font-family:system-ui}main{width:min(820px,calc(100% - 24px));margin:24px auto}canvas{display:block;width:100%;aspect-ratio:16/9;background:#eef4ef;border:2px solid #6cc59b}p{color:#c9d7cf}</style></head><body><main><h1>${escapeHTML(project.title)}</h1><p>${escapeHTML(workflow.name)}：${escapeHTML(workflow.steps.join(" → "))}</p><canvas id="game" width="800" height="450"></canvas></main><script src="game.js"></script></body></html>` },
      { path: "starter/game.js", content: gameSource },
      { path: "starter/workflow.json", content: workflowJson + "\n" },
      { path: "starter/server.js", content: buildStaticStarterServer() },
      { path: "starter/smoke.js", content: `"use strict";const fs=require("fs"),path=require("path");for(const file of ["index.html","game.js","server.js","workflow.json"]){if(!fs.existsSync(path.join(__dirname,file)))throw new Error("missing "+file)}for(const file of ["game.js","server.js"])new Function(fs.readFileSync(path.join(__dirname,file),"utf8"));if(!fs.readFileSync(path.join(__dirname,"game.js"),"utf8").includes(${JSON.stringify(workflow.id)}))throw new Error("workflow marker missing");if(JSON.parse(fs.readFileSync(path.join(__dirname,"workflow.json"),"utf8")).id!==${JSON.stringify(workflow.id)})throw new Error("workflow mismatch");console.log("${project.number} GAME starter smoke: PASS");` }
    ];
    return { workflow, stack: "Canvas / JavaScript / Node.js", startCommand: ".\\scripts\\start-project.ps1", smokeCommand: ".\\scripts\\smoke-test.ps1", files: [
      ...files,
      { path: "scripts/start-project.ps1", content: buildStarterPowerShell("node", "starter/server.js") },
      { path: "scripts/smoke-test.ps1", content: buildStarterPowerShell("node", "starter/smoke.js") },
      { path: "START-HERE.md", content: sharedStartHere("Canvas / JavaScript / Node.js", ".\\scripts\\start-project.ps1", ".\\scripts\\smoke-test.ps1") }
    ] };
  }

  const pythonPrograms = {
    AI: `import json
PROJECT = ${metadata}
WORKFLOW = ${workflowJson}
COURSES = [{"title": "Python 基础", "tags": ["python", "数据"]}, {"title": "算法入门", "tags": ["算法", "python"]}, {"title": "Web API", "tags": ["web", "服务"]}]
def recommend(interests):
    ranked = []
    for course in COURSES:
        score = len(set(interests) & set(course["tags"]))
        ranked.append({**course, "score": score, "reason": "命中标签：" + "、".join(set(interests) & set(course["tags"])) if score else "基础补全"})
    return {"recommendations": sorted(ranked, key=lambda item: (-item["score"], item["title"]))}
def execute():
    if WORKFLOW["id"] == "ai-csv-profile":
        rows = [{"course":"Python","score":"88"},{"course":"Web","score":""},{"course":"Python","score":"88"}]
        return {"rows":len(rows), "missing":sum(not row["score"] for row in rows), "duplicates":len(rows)-len({tuple(row.items()) for row in rows})}
    if WORKFLOW["id"] == "ai-model-predict":
        value = 0.72
        return {"prediction":"continue", "confidence":round(0.5 + value / 2, 3), "modelVersion":"starter-0.1"}
    return recommend(["python", "数据"])
if __name__ == "__main__":
    print(json.dumps({"project": PROJECT, "workflow":WORKFLOW, "result":execute()}, ensure_ascii=False, indent=2))
`,
    SEC: `import json
PROJECT = ${metadata}
WORKFLOW = ${workflowJson}
EVENTS = [{"account":"demo","result":"failed","source":"127.0.0.1"},{"account":"demo","result":"failed","source":"127.0.0.1"},{"account":"admin","result":"success","source":"127.0.0.1"}]
def execute(events):
    if WORKFLOW["id"] == "sec-behavior-timeline":
        return {"timeline":[{"time":"08:00","fact":"sample hash recorded"},{"time":"08:01","fact":"config file read"}],"inference":"configuration-driven behavior"}
    if WORKFLOW["id"] == "sec-rule-evaluate":
        positive=["login failed","path traversal blocked"]
        negative=["login success"]
        return {"rule":"contains failure or blocked", "hits":sum("failed" in line or "blocked" in line for line in positive+negative), "falsePositives":0}
    failed = {}
    for event in events:
        if event["result"] == "failed": failed[event["source"]] = failed.get(event["source"], 0) + 1
    return {"alerts":[{"rule":"repeated-login-failure","source":source,"count":count} for source,count in failed.items() if count >= 2]}
if __name__ == "__main__":
    print(json.dumps({"project": PROJECT, "workflow":WORKFLOW, "result":execute(EVENTS)}, ensure_ascii=False, indent=2))
`,
    IOT: `import json
from datetime import datetime, timedelta
PROJECT = ${metadata}
WORKFLOW = ${workflowJson}
def collect(count=5, offset=-0.3):
    start = datetime(2026, 1, 1, 8, 0, 0)
    return [{"time": (start + timedelta(seconds=index * 5)).isoformat(), "temperature": round(23 + index * 0.2 + offset, 1), "humidity": 48 + index, "status": "ok"} for index in range(count)]
def execute():
    if WORKFLOW["id"] == "iot-command-ack":
        return {"command_id":"cmd-001","action":"toggle","states":["pending","success"],"device":"lamp-demo"}
    if WORKFLOW["id"] == "iot-firmware-rollback":
        return {"manifest":{"device":"demo-board","version":"2.0","hash":"verified"},"interrupted":True,"restoredVersion":"1.0"}
    readings=collect(); return {"readings":readings,"calibrationOffset":-0.3,"rejected":0}
if __name__ == "__main__":
    print(json.dumps({"project": PROJECT, "workflow":WORKFLOW, "result":execute()}, ensure_ascii=False, indent=2))
`
  };
  if (pythonPrograms[project.routeCode]) {
    const fileName = project.routeCode === "IOT" ? "simulator.py" : "main.py";
    const stack = project.routeCode === "AI" ? "Python 3 / 数据处理" : project.routeCode === "SEC" ? "Python 3 / 本地日志分析" : "Python 3 / 设备模拟器";
    return { workflow, stack, startCommand: ".\\scripts\\start-project.ps1", smokeCommand: ".\\scripts\\smoke-test.ps1", files: [
      { path: `starter/${fileName}`, content: pythonPrograms[project.routeCode] },
      { path: "starter/workflow.json", content: workflowJson + "\n" },
      { path: "starter/requirements.txt", content: "# 当前启动代码只使用 Python 标准库。\n" },
      { path: "scripts/start-project.ps1", content: buildStarterPowerShell("python", `starter/${fileName}`) },
      { path: "scripts/smoke-test.ps1", content: buildStarterPowerShell("python", `starter/${fileName}`) },
      { path: "START-HERE.md", content: sharedStartHere(stack, ".\\scripts\\start-project.ps1", ".\\scripts\\smoke-test.ps1") }
    ] };
  }

  const cloudService = buildCloudStarterService(project, workflow);
  return { workflow, stack: "Python 3 / HTTP / Docker", startCommand: ".\\scripts\\start-project.ps1", smokeCommand: ".\\scripts\\smoke-test.ps1", files: [
    { path: "starter/service.py", content: cloudService },
    { path: "starter/workflow.json", content: workflowJson + "\n" },
    { path: "starter/data/courses.json", content: JSON.stringify([
      { "id": 1, "title": "文件与路径基础", "status": "published" },
      { "id": 2, "title": "HTTP 请求与响应", "status": "draft" }
    ], null, 2) + "\n" },
    { path: "starter/config.example.json", content: JSON.stringify({ SERVICE_NAME: project.number, LOG_LEVEL: "info", PORT: 8080 }, null, 2) + "\n" },
    { path: "starter/.env.example", content: "SERVICE_NAME=course-api\nSERVICE_VERSION=0.1.0\nLOG_LEVEL=info\nPORT=8080\n# API_TOKEN 只通过运行环境注入，不写入仓库\n" },
    { path: "starter/Dockerfile", content: "FROM python:3.12-slim\nWORKDIR /app\nCOPY service.py .\nCOPY data ./data\nEXPOSE 8080\nENV SERVICE_VERSION=0.1.0\nCMD [\"python\", \"service.py\"]\n" },
    { path: "compose.yml", content: "services:\n  course-api:\n    build: ./starter\n    ports:\n      - \"8080:8080\"\n    env_file:\n      - starter/.env.example\n    healthcheck:\n      test: [\"CMD\", \"python\", \"service.py\", \"--smoke\"]\n      interval: 10s\n      timeout: 3s\n      retries: 3\n" },
    { path: "docs/runbook.md", content: `# 运行手册\n\n1. 复制 \`starter/.env.example\` 为本地环境配置，秘密只从环境变量注入。\n2. 本地快速检查：\`.\u005cscripts\u005csmoke-test.ps1\`。\n3. 直接启动：\`.\u005cscripts\u005cstart-project.ps1\`，访问 \`/health\` 和 \`/api/courses\`。\n4. 容器运行：\`docker compose -f compose.yml up --build\`。\n5. 故障恢复与回滚：先看 request ID，再检查健康状态、配置和端口；必要时切回上一版本，恢复后记录复盘。\n` },
    { path: "tests/contract.py", content: "import json\nfrom pathlib import Path\nworkflow = json.loads((Path(__file__).parent.parent / 'starter' / 'workflow.json').read_text(encoding='utf-8'))\nassert workflow['id']\nprint('CLOUD contract metadata: PASS')\n" },
    { path: "scripts/start-project.ps1", content: buildStarterPowerShell("python", "starter/service.py") },
    { path: "scripts/smoke-test.ps1", content: buildStarterPowerShell("python", "starter/service.py", "--smoke") },
    { path: "START-HERE.md", content: sharedStartHere("Python 3 / HTTP / Docker", ".\\scripts\\start-project.ps1", ".\\scripts\\smoke-test.ps1") }
  ] };
}

function buildPortfolioAcceptanceTemplate(project) {
  const detail = project.execution || {};
  return `# ${project.number} ${project.title} - 验收记录

> 专业方向：${project.routeTitle}  
> 项目状态：未开始 / 进行中 / 已完成  
> 验收日期：YYYY-MM-DD  
> 验收人：TODO

## 1. 需求核对

${renderMarkdownChecklist(detail.requirements || [detail.requirement || project.summary])}

## 2. 开发步骤复核

${renderMarkdownChecklist(detail.steps || [])}

## 3. 功能与质量验收

${renderMarkdownChecklist(detail.acceptance || project.checks)}

## 4. 交付证据

${renderMarkdownChecklist(project.evidence)}

## 5. 运行记录

| 检查项 | 命令或操作 | 预期结果 | 实际结果 | 结论 |
| --- | --- | --- | --- | --- |
| 启动 | TODO | 项目正常启动 | TODO | 通过 / 失败 |
| 核心流程 | TODO | 主要流程完整 | TODO | 通过 / 失败 |
| 异常输入 | TODO | 有明确错误处理 | TODO | 通过 / 失败 |

## 6. 问题与结论

- 阻塞问题：TODO
- 已知限制：TODO
- 修复记录：TODO
- 最终结论：通过 / 有条件通过 / 退回修改
`;
}

function buildPortfolioReadmeTemplate(project) {
  const detail = project.execution || {};
  const starter = getPortfolioStarterKit(project);
  const modules = project.modules.map((module) => `${module.index + 1}. ${module.title}`).join("、");
  return `# ${project.title}

${detail.requirement || project.summary}

## 项目概览

- 项目编号：${project.number}
- 专业方向：${project.routeTitle}
- 难度：${project.level}
- 前置阶段：${project.prerequisite}
- 建议模块：${modules}

## 功能需求

${renderMarkdownChecklist(detail.requirements || [detail.requirement || project.summary])}

## 文件结构

\`\`\`text
${(detail.fileTree || ["project/", "├─ README.md", "├─ src/", "└─ report.md"]).join("\n")}
\`\`\`

## 开发步骤

${(detail.steps || []).map((step, index) => `${index + 1}. ${step}`).join("\n")}

## 环境与依赖

- 操作系统：Windows 10/11
- 启动技术栈：${starter.stack}
- 依赖安装：当前启动代码只使用运行时标准能力
- 配置文件或环境变量：按完整项目需要补充，不要提交真实密钥

## 运行方式

\`\`\`powershell
${starter.startCommand}
\`\`\`

## 测试方式

\`\`\`powershell
${starter.smokeCommand}
.\\scripts\\verify-project.ps1 -StructureOnly -RunStarter
\`\`\`

## 验收标准

${renderMarkdownChecklist(detail.acceptance || project.checks)}

## 项目证据

${renderMarkdownChecklist(project.evidence)}

## 已知问题

- TODO：记录仍存在的限制、复现条件和影响范围。

## 后续计划

- [ ] TODO：下一项最小改进
`;
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadTextFile(filename, content) {
  downloadBlob(filename, new Blob(["\uFEFF", content], { type: "text/markdown;charset=utf-8" }));
}

function parsePortfolioFileTree(fileTree = []) {
  const entries = [];
  const directoryStack = [];
  fileTree.slice(1).forEach((line) => {
    const match = String(line).match(/^((?:│  |   )*)(?:├─|└─)\s*(.+)$/);
    if (!match) return;
    const depth = Math.floor(match[1].length / 3);
    const rawName = match[2].trim();
    const directory = rawName.endsWith("/");
    const name = rawName.replace(/\/$/, "").replace(/[<>:"\\|?*]/g, "-");
    if (!name || name === "." || name === "..") return;
    directoryStack.length = depth;
    const relativePath = [...directoryStack, name].join("/");
    entries.push({ path: directory ? `${relativePath}/` : relativePath, directory });
    if (directory) directoryStack[depth] = name;
  });
  return entries;
}

function buildPortfolioVerifierScript(project) {
  const detail = project.execution || {};
  const starter = getPortfolioStarterKit(project);
  const requiredPaths = parsePortfolioFileTree(detail.fileTree).filter((entry) => !entry.directory).map((entry) => entry.path);
  for (const pathName of ["README.md", "ACCEPTANCE.md", ...starter.files.map((file) => file.path)]) {
    if (!requiredPaths.includes(pathName)) requiredPaths.push(pathName);
  }
  const pathLines = requiredPaths.map((item) => `  '${item.replace(/'/g, "''")}'`).join(",\n");
  return `param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [switch]$StructureOnly,
  [switch]$RunStarter
)

$ErrorActionPreference = 'Stop'
$failed = 0
$requiredPaths = @(
${pathLines}
)

Write-Host 'Checking ${project.number} ${project.title}' -ForegroundColor Cyan
foreach ($relativePath in $requiredPaths) {
  $target = Join-Path $ProjectRoot $relativePath
  if (Test-Path -LiteralPath $target -PathType Leaf) {
    Write-Host "PASS file: $relativePath" -ForegroundColor Green
  } else {
    Write-Host "FAIL missing file: $relativePath" -ForegroundColor Red
    $failed += 1
  }
}

if ($RunStarter) {
  $smokePath = Join-Path $ProjectRoot 'scripts\\smoke-test.ps1'
  Write-Host 'Running technology-stack smoke test' -ForegroundColor Cyan
  & $smokePath
  if ($LASTEXITCODE -ne 0) {
    Write-Host 'FAIL starter smoke test' -ForegroundColor Red
    $failed += 1
  } else {
    Write-Host 'PASS starter smoke test' -ForegroundColor Green
  }
}

if (-not $StructureOnly) {
  $readmePath = Join-Path $ProjectRoot 'README.md'
  if (Test-Path -LiteralPath $readmePath) {
    $readme = Get-Content -Raw -Encoding UTF8 -LiteralPath $readmePath
    if ($readme -match 'TODO') {
      Write-Host 'FAIL README.md still contains TODO items' -ForegroundColor Red
      $failed += 1
    } else {
      Write-Host 'PASS README.md has no TODO items' -ForegroundColor Green
    }
  }

  $acceptancePath = Join-Path $ProjectRoot 'ACCEPTANCE.md'
  if (Test-Path -LiteralPath $acceptancePath) {
    $acceptance = Get-Content -Raw -Encoding UTF8 -LiteralPath $acceptancePath
    if ($acceptance -match '(?m)^- \\[ \\]') {
      Write-Host 'FAIL ACCEPTANCE.md still has unchecked items' -ForegroundColor Red
      $failed += 1
    } else {
      Write-Host 'PASS all acceptance items are checked' -ForegroundColor Green
    }
  }
}

if ($failed -gt 0) {
  Write-Host "RESULT: FAIL ($failed checks)" -ForegroundColor Red
  exit 1
}
Write-Host 'RESULT: PASS' -ForegroundColor Green
exit 0
`;
}

function getPortfolioSeedContent(filePath) {
  const filename = filePath.split("/").pop();
  const extension = filename.includes(".") ? filename.split(".").pop().toLowerCase() : "";
  const seedByExtension = {
    md: `# ${filename.replace(/\.md$/i, "")}\n\nTODO：补充内容。\n`,
    json: "{}\n",
    jsonl: "",
    csv: "field,value\n",
    html: "<!doctype html>\n<html lang=\"zh-CN\">\n<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>TODO</title></head>\n<body><main id=\"app\"></main></body>\n</html>\n",
    js: "\"use strict\";\n\n// TODO: implement\n",
    py: "\"\"\"TODO: implement.\"\"\"\n",
    c: "/* TODO: implement */\n",
    h: "/* TODO: declarations */\n",
    sql: "-- TODO: schema or query\n",
    yml: "# TODO: configuration\n",
    yaml: "# TODO: configuration\n"
  };
  return seedByExtension[extension] ?? "";
}

function getZipCrcTable() {
  if (getZipCrcTable.cache) return getZipCrcTable.cache;
  getZipCrcTable.cache = Array.from({ length: 256 }, (_, index) => {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    return value >>> 0;
  });
  return getZipCrcTable.cache;
}

function getZipCrc32(bytes) {
  const table = getZipCrcTable();
  let crc = 0xffffffff;
  bytes.forEach((byte) => { crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8); });
  return (crc ^ 0xffffffff) >>> 0;
}

function writeZipUint16(view, offset, value) {
  view.setUint16(offset, value, true);
}

function writeZipUint32(view, offset, value) {
  view.setUint32(offset, value >>> 0, true);
}

function getZipDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
}

function createStoredZipBlob(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  const { time, date } = getZipDosDateTime();
  let localOffset = 0;
  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name.replace(/\\/g, "/"));
    const dataBytes = file.content instanceof Uint8Array ? file.content : encoder.encode(String(file.content || ""));
    const crc = getZipCrc32(dataBytes);
    const localHeader = new Uint8Array(30);
    const localView = new DataView(localHeader.buffer);
    writeZipUint32(localView, 0, 0x04034b50);
    writeZipUint16(localView, 4, 20);
    writeZipUint16(localView, 6, 0x0800);
    writeZipUint16(localView, 8, 0);
    writeZipUint16(localView, 10, time);
    writeZipUint16(localView, 12, date);
    writeZipUint32(localView, 14, crc);
    writeZipUint32(localView, 18, dataBytes.length);
    writeZipUint32(localView, 22, dataBytes.length);
    writeZipUint16(localView, 26, nameBytes.length);
    writeZipUint16(localView, 28, 0);
    localParts.push(localHeader, nameBytes, dataBytes);

    const centralHeader = new Uint8Array(46);
    const centralView = new DataView(centralHeader.buffer);
    writeZipUint32(centralView, 0, 0x02014b50);
    writeZipUint16(centralView, 4, 20);
    writeZipUint16(centralView, 6, 20);
    writeZipUint16(centralView, 8, 0x0800);
    writeZipUint16(centralView, 10, 0);
    writeZipUint16(centralView, 12, time);
    writeZipUint16(centralView, 14, date);
    writeZipUint32(centralView, 16, crc);
    writeZipUint32(centralView, 20, dataBytes.length);
    writeZipUint32(centralView, 24, dataBytes.length);
    writeZipUint16(centralView, 28, nameBytes.length);
    writeZipUint16(centralView, 30, 0);
    writeZipUint16(centralView, 32, 0);
    writeZipUint16(centralView, 34, 0);
    writeZipUint16(centralView, 36, 0);
    writeZipUint32(centralView, 38, file.name.endsWith("/") ? 0x10 : 0);
    writeZipUint32(centralView, 42, localOffset);
    centralParts.push(centralHeader, nameBytes);
    localOffset += localHeader.length + nameBytes.length + dataBytes.length;
  });
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  writeZipUint32(endView, 0, 0x06054b50);
  writeZipUint16(endView, 8, files.length);
  writeZipUint16(endView, 10, files.length);
  writeZipUint32(endView, 12, centralSize);
  writeZipUint32(endView, 16, localOffset);
  return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
}

function buildPortfolioInitializerFiles(project) {
  const detail = project.execution || {};
  const starter = getPortfolioStarterKit(project);
  const base = getPortfolioTemplateBaseName(project);
  const root = `${base}/`;
  const entries = parsePortfolioFileTree(detail.fileTree || []);
  const files = new Map();
  files.set(root, "");
  entries.forEach((entry) => files.set(`${root}${entry.path}`, entry.directory ? "" : getPortfolioSeedContent(entry.path)));
  files.set(`${root}README.md`, `\uFEFF${buildPortfolioReadmeTemplate(project)}`);
  files.set(`${root}ACCEPTANCE.md`, `\uFEFF${buildPortfolioAcceptanceTemplate(project)}`);
  files.set(`${root}scripts/`, "");
  files.set(`${root}scripts/verify-project.ps1`, `\uFEFF${buildPortfolioVerifierScript(project)}`);
  starter.files.forEach((file) => {
    const needsBom = /\.(?:md|ps1)$/i.test(file.path);
    files.set(`${root}${file.path}`, `${needsBom ? "\uFEFF" : ""}${file.content}`);
  });
  return [...files].map(([name, content]) => ({ name, content }));
}

function downloadPortfolioInitializer(projectId) {
  const project = getPortfolioProject(projectId);
  if (!project) return;
  const filename = `${getPortfolioTemplateBaseName(project)}-启动代码包.zip`;
  downloadBlob(filename, createStoredZipBlob(buildPortfolioInitializerFiles(project)));
  showToast("技术栈启动代码包已生成");
}

function downloadPortfolioVerifier(projectId) {
  const project = getPortfolioProject(projectId);
  if (!project) return;
  const filename = `${getPortfolioTemplateBaseName(project)}-验收脚本.ps1`;
  downloadBlob(filename, new Blob(["\uFEFF", buildPortfolioVerifierScript(project)], { type: "text/plain;charset=utf-8" }));
  showToast("PowerShell 验收脚本已生成");
}

function downloadPortfolioTemplate(projectId, kind) {
  const project = getPortfolioProject(projectId);
  if (!project) return;
  const acceptance = kind === "acceptance";
  const filename = getPortfolioTemplateFilename(project, acceptance ? "验收清单" : "README模板");
  const content = acceptance ? buildPortfolioAcceptanceTemplate(project) : buildPortfolioReadmeTemplate(project);
  downloadTextFile(filename, content);
  showToast(`${acceptance ? "验收清单" : "README 模板"}已生成`);
}

// 根据课程序号拼出本课的借鉴重点，帮助学习者知道这节课为何引用这些资料。
function getExtensionCourseReferenceHint(course) {
  const route = getFutureRoute(course.routeCode);
  const module = getExtensionModule(course.routeCode, course.moduleIndex);
  const lessonHint = extensionLessonFocusCopy[course.lessonIndex] || extensionLessonFocusCopy[0];
  return `${route.title} · ${module.title}：${lessonHint}`;
}

// 渲染扩展课最后的资料链接，统一放在课程末尾，便于引用和回看。
function renderExtensionCourseReferences(course) {
  const references = getExtensionCourseReferences(course);
  if (!references.length) return "";
  if (activeReferenceCourseId !== course.id) {
    activeReferenceCourseId = course.id;
    activeReferenceProvider = "all";
  }
  const providerOptions = [...new Map(references.map((reference) => {
    const provider = getReferenceProvider(reference);
    return [provider.id, provider];
  })).values()];
  if (activeReferenceProvider !== "all" && !providerOptions.some((provider) => provider.id === activeReferenceProvider)) {
    activeReferenceProvider = "all";
  }
  const visibleReferences = activeReferenceProvider === "all"
    ? references
    : references.filter((reference) => getReferenceProvider(reference).id === activeReferenceProvider);
  const hint = getExtensionCourseReferenceHint(course);
  return `<section class="lesson-section reference-section">
    <div class="lesson-section-heading">
      <div>
        <h2>资料借鉴与延伸阅读</h2>
        <p>${escapeHTML(hint)}</p>
      </div>
      <span class="operation-badge">显示 ${visibleReferences.length} / ${references.length}</span>
    </div>
    <div class="reference-filters" role="group" aria-label="按资料来源筛选">
      <button class="${activeReferenceProvider === "all" ? "is-active" : ""}" type="button" data-reference-provider="all" data-reference-course="${escapeHTML(course.id)}" aria-pressed="${activeReferenceProvider === "all"}">全部 ${references.length}</button>
      ${providerOptions.map((provider) => {
        const count = references.filter((reference) => getReferenceProvider(reference).id === provider.id).length;
        return `<button class="${activeReferenceProvider === provider.id ? "is-active" : ""}" type="button" data-reference-provider="${escapeHTML(provider.id)}" data-reference-course="${escapeHTML(course.id)}" aria-pressed="${activeReferenceProvider === provider.id}">${escapeHTML(provider.label)} ${count}</button>`;
      }).join("")}
    </div>
    <ul class="reference-list">
      ${visibleReferences.map((reference, index) => `<li>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <a class="reference-link" href="${escapeHTML(reference.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(reference.title)}</a>
          <small>${escapeHTML(reference.id)} · ${escapeHTML(getReferenceProvider(reference).label)}</small>
        </div>
      </li>`).join("")}
    </ul>
    <p class="reference-footnote">链接只做资料引用与延伸阅读；正文保持本地课程化表达，不直接照搬原文。</p>
  </section>`;
}

// 把资料借鉴结果写回正文中间，让学习者先看到“为什么这么讲”。
function renderExtensionCourseTeachingBridge(course) {
  const route = getFutureRoute(course.routeCode);
  const module = getExtensionModule(course.routeCode, course.moduleIndex);
  const phaseCopy = extensionLessonFocusCopy[course.lessonIndex] || extensionLessonFocusCopy[0];
  const references = getExtensionCourseReferences(course).slice(0, 2).map((reference) => reference.title);
  const routeTeachingBridgeMap = extensionTeachingBridgeMaps[course.routeCode] || null;
  const bridge = routeTeachingBridgeMap?.[course.moduleIndex] || null;
  const lead = bridge?.lead || `${route.title} · ${module.title} 先把概念、链路、练习和验收串成一条线，再展开正文。`;
  const focusList = bridge?.focus || [
    "先把概念边界讲明白，再进入工作流。",
    "用一个最小练习把抽象知识落地。",
    "用验收清单和作品证据确认是否真正学会。"
  ];
  return `<section class="lesson-section teaching-bridge">
    <div class="lesson-section-heading">
      <div>
        <h2>本课的教学借鉴</h2>
        <p>${escapeHTML(lead)}</p>
      </div>
      <span class="operation-badge">${escapeHTML(route.code)} · ${escapeHTML(module.title)}</span>
    </div>
    <div class="teaching-bridge-body">
      <p class="teaching-bridge-phase">${escapeHTML(phaseCopy)}</p>
      <ul class="teaching-bridge-list">
        ${focusList.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
        <li>引用资料：${escapeHTML(references.join("、") || "见本课末尾引用区")}</li>
      </ul>
    </div>
  </section>`;
}
