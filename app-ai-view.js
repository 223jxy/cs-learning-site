"use strict";

function renderAIModuleCard(module) {
  const lessons = getAIData().lessons.filter((lesson) => lesson.moduleId === module.id);
  const completed = lessons.filter((lesson) => isAILessonComplete(lesson.id)).length;
  const percent = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
  const available = module.status === "open";
  return `<article class="ai-module-card ${available ? "" : "is-planned"}">
    <div class="ai-module-top"><span class="ai-module-icon" aria-hidden="true">${escapeHTML(module.icon)}</span><span class="ai-status ${available ? "" : "is-planned"}">${available ? `${completed} / ${lessons.length} 课` : "后续开放"}</span></div>
    <h3>${escapeHTML(module.id)} · ${escapeHTML(module.title)}</h3><p>${escapeHTML(module.outcome)}</p>
    <div class="ai-progress-track" aria-label="完成 ${percent}%"><span style="width:${percent}%"></span></div>
    <div class="ai-module-foot"><span>${module.duration} 分钟 · ${escapeHTML(module.level)}</span>${available ? `<button class="text-button" type="button" data-ai-module="${module.id}">查看课程 →</button>` : `<span>共 ${module.lessonCount} 课</span>`}</div>
  </article>`;
}

function renderAICourseCard(lesson) {
  const complete = isAILessonComplete(lesson.id);
  return `<article class="ai-course-card">
    <div class="ai-course-meta"><span class="ai-course-code">${escapeHTML(lesson.number)}</span><span class="ai-status">${complete ? "已完成" : "未开始"}</span></div>
    <h3>${escapeHTML(lesson.title)}</h3><p>${escapeHTML(lesson.summary)}</p>
    <div class="ai-tag-row"><span>${escapeHTML(lesson.level)}</span><span>${escapeHTML(lesson.type)}</span><span>${lesson.duration} 分钟</span><span>${escapeHTML(lesson.environment)}</span></div>
    <div class="ai-course-foot"><span>${lesson.quiz.length} 道检查题${lesson.labId ? " · 1 个实验" : ""}</span><button class="complete-button" type="button" data-open-ai-lesson="${lesson.id}">${complete ? "复习课程" : "开始学习"}</button></div>
  </article>`;
}

function renderAIOverview() {
  const data = getAIData();
  const foundation = getAIFoundationData();
  const progress = getAIProgress();
  const next = data.lessons.find((lesson) => !progress.completedLessons.includes(lesson.id)) || data.lessons[0];
  const nextGuide = foundation.guides.find((guide) => !progress.completedGuides.includes(guide.id)) || foundation.guides[0];
  const quizCount = Object.keys(progress.quizResults).length;
  const labCount = Object.keys(progress.labResults).length;
  return `<section class="ai-hero-band">
    <div><span class="section-kicker">下一课 · ${escapeHTML(next?.number || "AI-00-01")}</span><h2>${escapeHTML(next?.title || "AI 到底包含什么")}</h2><p>${escapeHTML(next?.summary || "从完整知识地图开始。")}</p>
      <div class="ai-hero-actions"><button class="complete-button" type="button" data-open-ai-lesson="${next?.id || ""}">继续学习</button><button class="secondary-button" type="button" data-ai-tab="map">打开知识地图</button></div></div>
    <div class="ai-metric-list"><div><strong>${progress.completedLessons.length}/${data.lessons.length}</strong><span>已开放课程</span></div><div><strong>${labCount}/${data.labs.length}</strong><span>已运行实验</span></div><div><strong>${quizCount}</strong><span>已提交检查</span></div><div><strong>${data.modules.length}</strong><span>知识模块</span></div></div>
  </section>
  <section class="ai-beginner-callout">
    <div><span class="section-kicker">第一次学习 AI</span><h2>${escapeHTML(nextGuide?.title || "从 AI 基础开始")}</h2><p>${escapeHTML(nextGuide?.quickView || "先用大白话和最小例子建立概念，再进入正式课程。")}</p></div>
    <div class="ai-beginner-callout-meta"><span><strong>${progress.completedGuides.length}/${foundation.guides.length}</strong> 篇入门教程</span><span><strong>${foundation.terms.length}</strong> 条 AI 术语</span></div>
    <div class="ai-hero-actions"><button class="complete-button" type="button" data-open-ai-guide="${nextGuide?.id || ""}">开始入门</button><button class="secondary-button" type="button" data-ai-tab="glossary">打开 AI 词典</button></div>
  </section>
  <section class="ai-section"><div class="ai-section-heading"><div><span class="section-kicker">学习路径</span><h2>12 个知识模块</h2></div><p>当前已开放至 MLOps、模型交付、安全与治理。</p></div><div class="ai-module-grid">${data.modules.map(renderAIModuleCard).join("")}</div></section>`;
}

function renderAIGuides() {
  const foundation = getAIFoundationData();
  const progress = getAIProgress();
  const completed = progress.completedGuides.length;
  return `<div class="ai-section-heading"><div><span class="section-kicker">零基础路径</span><h2>24 篇教程，把陌生名词连成完整链路</h2></div><p>已完成 ${completed} / ${foundation.guides.length}，每篇约 18–26 分钟。</p></div>
    <div class="ai-guide-paths">${foundation.paths.map((path) => {
      const guides = foundation.guides.filter((guide) => guide.pathId === path.id);
      const pathCompleted = guides.filter((guide) => progress.completedGuides.includes(guide.id)).length;
      return `<section class="ai-guide-path">
        <header><span>${String(path.order + 1).padStart(2, "0")}</span><div><h3>${escapeHTML(path.title)}</h3><p>${escapeHTML(path.summary)}</p></div><strong>${pathCompleted}/${guides.length}</strong></header>
        <div class="ai-guide-list">${guides.map((guide) => {
          const complete = progress.completedGuides.includes(guide.id);
          return `<button type="button" class="ai-guide-row ${complete ? "is-complete" : ""}" data-open-ai-guide="${guide.id}">
            <span class="ai-guide-status">${complete ? "✓" : String((guide.order % 3) + 1).padStart(2, "0")}</span>
            <span><strong>${escapeHTML(guide.title)}</strong><small>${escapeHTML(guide.question)}</small></span>
            <em>${guide.duration} 分钟</em>
          </button>`;
        }).join("")}</div>
      </section>`;
    }).join("")}</div>`;
}

function getAITermSearchText(term) {
  return [
    term.nameZh, term.nameEn, term.abbreviation, ...term.aliases, ...term.keywords,
    term.quickDefinition, term.plainExplanation, term.technicalDefinition
  ].join(" ").toLowerCase();
}

function isAITermLearned(term) {
  const progress = getAIProgress();
  return term.lessonIds.some((lessonId) => progress.completedLessons.includes(lessonId))
    || term.guideIds.some((guideId) => progress.completedGuides.includes(guideId));
}

function getFilteredAITerms() {
  const query = (document.getElementById("ai-glossary-search")?.value || "").trim().toLowerCase();
  const terms = getAIFoundationData().terms.filter((term) => {
    const categoryMatched = activeAIGlossaryCategory === "all" || term.categoryId === activeAIGlossaryCategory;
    const levelMatched = activeAIGlossaryLevel === "all" || term.level === activeAIGlossaryLevel;
    const learned = isAITermLearned(term);
    const statusMatched = activeAIGlossaryStatus === "all"
      || (activeAIGlossaryStatus === "learned" && learned)
      || (activeAIGlossaryStatus === "unlearned" && !learned)
      || (activeAIGlossaryStatus === "favorite" && isAITermFavorite(term.id));
    return categoryMatched && levelMatched && statusMatched && (!query || getAITermSearchText(term).includes(query));
  });
  if (!query) return terms;
  return terms.sort((a, b) => {
    const exactA = [a.nameZh, a.nameEn, a.abbreviation, ...a.aliases].some((value) => value?.toLowerCase() === query);
    const exactB = [b.nameZh, b.nameEn, b.abbreviation, ...b.aliases].some((value) => value?.toLowerCase() === query);
    return Number(exactB) - Number(exactA) || a.order - b.order;
  });
}

function renderAITermCard(term, query = "") {
  const category = getAIFoundationData().categories.find((item) => item.id === term.categoryId);
  const learned = isAITermLearned(term);
  return `<article class="ai-term-card ${learned ? "is-learned" : ""}">
    <div class="ai-term-card-top"><span>${escapeHTML(category?.title || "AI 术语")}</span><button type="button" data-toggle-ai-term-favorite="${term.id}" aria-pressed="${isAITermFavorite(term.id)}" title="${isAITermFavorite(term.id) ? "取消收藏" : "收藏术语"}">${isAITermFavorite(term.id) ? "★" : "☆"}</button></div>
    <h3>${highlightSearchTerm(term.nameZh, query)}${term.abbreviation ? `<code>${highlightSearchTerm(term.abbreviation, query)}</code>` : ""}</h3>
    ${term.nameEn !== term.nameZh ? `<small>${highlightSearchTerm(term.nameEn, query)}</small>` : ""}
    <p>${highlightSearchTerm(term.quickDefinition, query)}</p>
    <div class="ai-term-card-foot"><span>${escapeHTML(term.level)} · ${term.lessonIds.length} 节关联课程</span><button class="text-button" type="button" data-open-ai-term="${term.id}">查看解释 →</button></div>
  </article>`;
}

function renderAIGlossary() {
  const foundation = getAIFoundationData();
  const progress = getAIProgress();
  const query = document.getElementById("ai-glossary-search")?.value || "";
  const filtered = getFilteredAITerms();
  const levels = [...new Set(foundation.terms.map((term) => term.level))];
  const recentTerms = progress.recentTermIds.map(getAITerm).filter(Boolean).slice(0, 6);
  const favoriteTerms = progress.favoriteTermIds.map(getAITerm).filter(Boolean).slice(0, 6);
  return `<div class="ai-section-heading"><div><span class="section-kicker">AI 基础词典</span><h2>先查懂名词，再回到课程理解链路</h2></div><p id="ai-glossary-visible-count">${filtered.length} / ${foundation.terms.length} 条术语</p></div>
    ${(recentTerms.length || favoriteTerms.length) ? `<section class="ai-glossary-shortcuts">
      ${recentTerms.length ? `<div><strong>最近查看</strong><div>${recentTerms.map((term) => `<button type="button" data-open-ai-term="${term.id}">${escapeHTML(term.nameZh)}</button>`).join("")}</div></div>` : ""}
      ${favoriteTerms.length ? `<div><strong>我的收藏</strong><div>${favoriteTerms.map((term) => `<button type="button" data-open-ai-term="${term.id}">${escapeHTML(term.nameZh)}</button>`).join("")}</div></div>` : ""}
    </section>` : ""}
    <section class="ai-glossary-tools">
      <label class="ai-glossary-search"><span aria-hidden="true">⌕</span><input id="ai-glossary-search" type="search" value="${escapeHTML(query)}" placeholder="搜索中文、英文、缩写或别名" aria-label="搜索 AI 术语"></label>
      <label>分类<select id="ai-glossary-category"><option value="all">全部 12 类</option>${foundation.categories.map((category) => `<option value="${category.id}" ${activeAIGlossaryCategory === category.id ? "selected" : ""}>${escapeHTML(category.title)} · ${category.targetCount}</option>`).join("")}</select></label>
      <label>难度<select id="ai-glossary-level"><option value="all">全部难度</option>${levels.map((level) => `<option value="${escapeHTML(level)}" ${activeAIGlossaryLevel === level ? "selected" : ""}>${escapeHTML(level)}</option>`).join("")}</select></label>
      <label>状态<select id="ai-glossary-status"><option value="all">全部状态</option><option value="unlearned" ${activeAIGlossaryStatus === "unlearned" ? "selected" : ""}>待学习</option><option value="learned" ${activeAIGlossaryStatus === "learned" ? "selected" : ""}>已接触</option><option value="favorite" ${activeAIGlossaryStatus === "favorite" ? "selected" : ""}>已收藏</option></select></label>
    </section>
    <div class="ai-term-grid" id="ai-term-grid">${filtered.length ? filtered.map((term) => renderAITermCard(term, query)).join("") : `<div class="ai-empty-panel"><strong>没有匹配术语</strong><p>换一个中文名、英文名或缩写，也可以清空筛选。</p></div>`}</div>`;
}

function refreshAIGlossaryResults() {
  const grid = document.getElementById("ai-term-grid");
  if (!grid) return;
  const query = document.getElementById("ai-glossary-search")?.value || "";
  const filtered = getFilteredAITerms();
  grid.innerHTML = filtered.length ? filtered.map((term) => renderAITermCard(term, query)).join("") : `<div class="ai-empty-panel"><strong>没有匹配术语</strong><p>换一个中文名、英文名或缩写，也可以清空筛选。</p></div>`;
  const count = document.getElementById("ai-glossary-visible-count");
  if (count) count.textContent = `${filtered.length} / ${getAIFoundationData().terms.length} 条术语`;
}

function renderAIMap() {
  const groups = [["基础层", ["AI-00", "AI-01", "AI-02"]], ["模型层", ["AI-03", "AI-04"]], ["深度层", ["AI-05", "AI-06", "AI-07"]], ["生成与应用", ["AI-08", "AI-09"]], ["交付与治理", ["AI-10", "AI-11"]]];
  return `<div class="ai-section-heading"><div><span class="section-kicker">知识依赖</span><h2>从基础到交付的有序地图</h2></div><p>先理解前置，再进入后续模块。</p></div><div class="ai-map-layers">${groups.map(([label, ids]) => `<section class="ai-map-layer"><strong>${label}</strong><div class="ai-map-row">${ids.map((id) => renderAIModuleCard(getAIModule(id))).join("")}</div></section>`).join("")}</div>`;
}

function getFilteredAILessons() {
  const query = (document.getElementById("ai-course-search")?.value || "").trim().toLowerCase();
  return getAIData().lessons.filter((lesson) => {
    const moduleMatch = activeAIModule === "all" || lesson.moduleId === activeAIModule;
    const typeMatch = activeAIType === "all" || lesson.type === activeAIType;
    const text = [lesson.number, lesson.title, lesson.summary, ...lesson.objectives, ...lesson.concepts.flat()].join(" ").toLowerCase();
    return moduleMatch && typeMatch && (!query || text.includes(query));
  });
}

function renderAICourses() {
  const moduleOptions = getAIData().modules.filter((module) => module.status === "open").map((module) => `<option value="${module.id}">${module.id} · ${escapeHTML(module.title)}</option>`).join("");
  const typeOptions = [...new Set(getAIData().lessons.map((lesson) => lesson.type))].map((type) => `<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`).join("");
  return `<div class="ai-filter-bar"><label>搜索课程<input id="ai-course-search" type="search" placeholder="课程、概念或编号"></label><label>模块<select id="ai-module-filter"><option value="all">全部开放模块</option>${moduleOptions}</select></label><label>类型<select id="ai-type-filter"><option value="all">全部类型</option>${typeOptions}</select></label></div><div class="ai-course-grid" id="ai-course-grid">${getFilteredAILessons().map(renderAICourseCard).join("")}</div>`;
}

function renderAILabs() {
  return `<div class="ai-section-heading"><div><span class="section-kicker">浏览器实验</span><h2>用运行结果检查原理</h2></div><p>无需安装依赖，结果只保存在本机。</p></div><div class="ai-lab-grid">${getAIData().labs.map((lab) => {
    const result = getAIProgress().labResults[lab.id];
    const defaultControls = lab.id === "ai-lab-gradient-step"
      ? [{ id: "x", label: "x", value: 2 }, { id: "y", label: "y", value: 6 }, { id: "w", label: "w", value: 1 }, { id: "learningRate", label: "学习率", value: 0.1 }]
      : lab.id === "ai-lab-rules-vs-learning" ? [{ id: "threshold", label: "分类阈值", value: 0 }] : [];
    const labControls = Array.isArray(lab.controls) ? lab.controls : defaultControls;
    const controls = labControls.length ? `<div class="ai-lab-controls">${labControls.map((control) => {
      const valueType = control.type === "text" ? "text" : "number";
      return `<label class="ai-lab-control ${valueType === "text" ? "is-wide" : ""}">${escapeHTML(control.label)}<input data-ai-lab-input="${escapeHTML(control.id)}" data-ai-lab-value-type="${valueType}" type="${valueType === "text" ? "text" : "number"}" value="${escapeHTML(control.value)}"${valueType === "number" ? ' inputmode="decimal"' : ""}></label>`;
    }).join("")}</div>` : "";
    return `<article class="ai-lab-card" data-ai-lab-card="${lab.id}"><div class="ai-lab-meta"><span class="ai-lab-code">${lab.number}</span><span class="ai-status">${result ? "已运行" : "未运行"}</span></div><h3>${escapeHTML(lab.title)}</h3><p>${escapeHTML(lab.goal)}</p>${lab.code ? `<details class="ai-lab-code-details"><summary>查看框架对应代码</summary><pre class="lesson-code">${escapeHTML(lab.code)}</pre></details>` : ""}${controls}<button class="complete-button" type="button" data-run-ai-lab="${lab.id}">运行实验</button><pre class="ai-lab-output" data-ai-lab-output="${lab.id}">${escapeHTML(result?.summary || "等待运行。")}</pre></article>`;
  }).join("")}</div>`;
}

function renderAIAnatomy() {
  const modes = getAIData().anatomyModes || [];
  const mode = modes.find((item) => item.id === activeAIAnatomyMode) || modes[0];
  if (!mode) return `<div class="ai-empty-panel"><strong>模型解剖</strong><p>暂无可用流程。</p></div>`;
  activeAIAnatomyMode = mode.id;
  activeAIAnatomyStep = Math.max(0, Math.min(mode.steps.length - 1, activeAIAnatomyStep));
  const step = mode.steps[activeAIAnatomyStep];
  const percent = Math.round(((activeAIAnatomyStep + 1) / mode.steps.length) * 100);
  return `<div class="ai-section-heading"><div><span class="section-kicker">模型解剖</span><h2>${escapeHTML(mode.title)}</h2></div><p>${escapeHTML(mode.summary)}</p></div>
    <div class="ai-anatomy-modes" role="tablist" aria-label="模型解剖模式">${modes.map((item) => `<button type="button" role="tab" aria-selected="${item.id === mode.id}" class="${item.id === mode.id ? "is-active" : ""}" data-ai-anatomy-mode="${item.id}">${escapeHTML(item.label)}</button>`).join("")}</div>
    <section class="ai-anatomy-workbench">
      <div class="ai-anatomy-progress"><span>步骤 ${activeAIAnatomyStep + 1} / ${mode.steps.length}</span><strong>${percent}%</strong><div class="ai-progress-track"><span style="width:${percent}%"></span></div></div>
      <div class="ai-anatomy-steps" aria-label="${escapeHTML(mode.label)}流程">${mode.steps.map((item, index) => `<button type="button" class="${index === activeAIAnatomyStep ? "is-active" : ""}" aria-current="${index === activeAIAnatomyStep ? "step" : "false"}" data-ai-anatomy-step="${index}"><span>${index + 1}</span>${escapeHTML(item.title)}</button>`).join("")}</div>
      <article class="ai-anatomy-detail">
        <div class="ai-anatomy-detail-head"><span class="ai-course-code">${escapeHTML(mode.label)} · ${String(activeAIAnatomyStep + 1).padStart(2, "0")}</span><h3>${escapeHTML(step.title)}</h3></div>
        <dl class="ai-anatomy-facts">
          <div><dt>输入</dt><dd>${escapeHTML(step.inputShape)}</dd></div>
          <div><dt>核心操作</dt><dd>${escapeHTML(step.operation)}</dd></div>
          <div><dt>输出</dt><dd>${escapeHTML(step.outputShape)}</dd></div>
          <div><dt>可观察证据</dt><dd>${escapeHTML(step.evidence)}</dd></div>
        </dl>
        <div class="ai-anatomy-warning"><strong>常见错误</strong><p>${escapeHTML(step.mistake)}</p></div>
      </article>
      <div class="ai-anatomy-actions">
        <button class="secondary-button ai-icon-button" type="button" title="上一步" aria-label="上一步" data-ai-anatomy-move="-1" ${activeAIAnatomyStep === 0 ? "disabled" : ""}>←</button>
        <button class="secondary-button ai-icon-button" type="button" title="下一步" aria-label="下一步" data-ai-anatomy-move="1" ${activeAIAnatomyStep === mode.steps.length - 1 ? "disabled" : ""}>→</button>
      </div>
    </section>`;
}

function renderAIPapers() {
  const papers = getAIData().papers || [];
  const statusLabels = { unread: "未开始", reading: "阅读中", done: "已完成" };
  const counts = papers.reduce((result, paper) => {
    result[getAIPaperStatus(paper.id)] += 1;
    return result;
  }, { unread: 0, reading: 0, done: 0 });
  return `<div class="ai-section-heading"><div><span class="section-kicker">论文导读</span><h2>按知识依赖阅读六篇关键论文</h2></div><p>已完成 ${counts.done} / ${papers.length}，阅读中 ${counts.reading}。</p></div>
    <div class="ai-paper-list">${papers.map((paper, index) => {
      const status = getAIPaperStatus(paper.id);
      const relatedLessons = getPaperRelatedAILessons(paper.id);
      return `<details class="ai-paper-item" data-ai-paper-id="${escapeHTML(paper.id)}"${status === "reading" ? " open" : ""}>
        <summary><span class="ai-paper-index">${String(index + 1).padStart(2, "0")}</span><span><strong>${escapeHTML(paper.title)}</strong><small>${paper.year} · ${escapeHTML(statusLabels[status])}</small></span><span class="ai-paper-chevron" aria-hidden="true">⌄</span></summary>
        <div class="ai-paper-body">
          <section><h3>论文要解决的问题</h3><p>${escapeHTML(paper.problem)}</p></section>
          <section><h3>阅读前置</h3><p>${escapeHTML(paper.prerequisites)}</p></section>
          <section><h3>关键贡献</h3><ul>${paper.contributions.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
          <section><h3>机制主线</h3><p>${escapeHTML(paper.mechanism)}</p></section>
          <div class="ai-paper-evidence"><section><h3>原文实验回答了什么</h3><p>${escapeHTML(paper.answered)}</p></section><section><h3>原文没有回答什么</h3><p>${escapeHTML(paper.notAnswered)}</p></section></div>
          <section><h3>阅读问题</h3><ol>${paper.questions.map((question) => `<li>${escapeHTML(question)}</li>`).join("")}</ol></section>
          <section class="ai-paper-related"><h3>关联课程</h3><p>先学课程建立概念和实验直觉，再回到论文核对原始证据。</p><div>${relatedLessons.map((lesson) => `<button type="button" data-open-ai-lesson="${lesson.id}"><span>${escapeHTML(lesson.number)}</span>${escapeHTML(lesson.title)}</button>`).join("")}</div></section>
          <section class="ai-paper-source"><h3>原文与引用</h3><p>${escapeHTML(paper.citation)}</p><a href="${escapeHTML(paper.url)}" target="_blank" rel="noreferrer">打开论文原文 ↗</a></section>
          <div class="ai-paper-status-group" role="group" aria-label="${escapeHTML(paper.title)}阅读状态">${Object.entries(statusLabels).map(([value, label]) => `<button type="button" class="${value === status ? "is-active" : ""}" data-ai-paper-status="${paper.id}" data-ai-paper-value="${value}">${label}</button>`).join("")}</div>
        </div>
      </details>`;
    }).join("")}</div>`;
}

function renderAIGovernance() {
  const stages = getAIData().governanceStages || [];
  const risks = getAIData().governanceRisks || [];
  const stage = stages.find((item) => item.id === activeAIGovernanceStage) || stages[0];
  if (!stage) return `<div class="ai-empty-panel"><strong>安全治理</strong><p>暂无可用治理数据。</p></div>`;
  activeAIGovernanceStage = stage.id;
  const linkedRisks = risks.filter((risk) => risk.stage === stage.id);
  const rmfFunctions = [
    ["Govern", "角色、政策、责任与持续治理"],
    ["Map", "用途、情境、利益相关者与影响"],
    ["Measure", "测试、指标、不确定性与控制效果"],
    ["Manage", "排序、缓解、监控、沟通与停止"]
  ];
  return `<div class="ai-section-heading"><div><span class="section-kicker">安全与治理</span><h2>按生命周期控制 AI 风险</h2></div><p>从需求进入监控，每一步都留下责任、证据和处置记录。</p></div>
    <section class="ai-governance-rmf" aria-label="NIST AI RMF 四个函数">${rmfFunctions.map(([name, description]) => `<div><strong>${name}</strong><span>${escapeHTML(description)}</span></div>`).join("")}</section>
    <div class="ai-governance-stage-tabs" role="tablist" aria-label="AI 生命周期阶段">${stages.map((item, index) => `<button type="button" role="tab" aria-selected="${item.id === stage.id}" class="${item.id === stage.id ? "is-active" : ""}" data-ai-governance-stage="${item.id}"><span>${index + 1}</span>${escapeHTML(item.label)}</button>`).join("")}</div>
    <section class="ai-governance-detail">
      <header><div><span class="ai-course-code">${escapeHTML(stage.rmf)}</span><h3>${escapeHTML(stage.label)}</h3></div><p>${escapeHTML(stage.objective)}</p></header>
      <div class="ai-governance-context">
        <section><h4>主要资产</h4><div class="ai-governance-tags">${stage.assets.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div></section>
        <section><h4>利益相关者</h4><div class="ai-governance-tags">${stage.stakeholders.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div></section>
      </div>
      <div class="ai-governance-columns">
        <section><h4>常见失效</h4><ul>${stage.failures.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
        <section><h4>检查问题</h4><ul>${stage.questions.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
        <section><h4>可收集证据</h4><ul>${stage.evidence.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
        <section><h4>控制措施</h4><ul>${stage.controls.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
      </div>
      <footer><strong>框架映射</strong><div class="ai-governance-tags">${stage.frameworks.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div></footer>
    </section>
    <section class="ai-section ai-governance-risk-section">
      <div class="ai-section-heading"><div><span class="section-kicker">LLM 应用风险</span><h2>${linkedRisks.length ? `${escapeHTML(stage.label)}阶段重点` : "六项核心风险"}</h2></div><p>${linkedRisks.length ? `当前阶段关联 ${linkedRisks.length} 项。` : "切换到集成、数据、训练或运营阶段查看重点映射。"}</p></div>
      <div class="ai-governance-risk-grid">${(linkedRisks.length ? linkedRisks : risks).map((risk) => `<article class="ai-governance-risk"><div><span>${escapeHTML(risk.id)}</span><strong class="${risk.severity === "高" ? "is-high" : ""}">${escapeHTML(risk.severity)}风险</strong></div><h3>${escapeHTML(risk.title)}</h3><p><b>检测信号：</b>${escapeHTML(risk.signal)}</p><p><b>主要控制：</b>${escapeHTML(risk.control)}</p></article>`).join("")}</div>
    </section>`;
}

function renderAIZone() {
  const content = document.getElementById("ai-zone-content");
  if (!content) return;
  const progress = getAIProgress();
  document.getElementById("ai-completed-count").textContent = `${progress.completedLessons.length} / ${getAIData().lessons.length}`;
  document.getElementById("ai-nav-badge").textContent = String(getAIData().lessons.length);
  document.querySelectorAll("[data-ai-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.aiTab === activeAITab));
  if (activeAITab === "overview") content.innerHTML = renderAIOverview();
  else if (activeAITab === "guides") content.innerHTML = renderAIGuides();
  else if (activeAITab === "glossary") content.innerHTML = renderAIGlossary();
  else if (activeAITab === "map") content.innerHTML = renderAIMap();
  else if (activeAITab === "courses") { content.innerHTML = renderAICourses(); document.getElementById("ai-module-filter").value = activeAIModule; document.getElementById("ai-type-filter").value = activeAIType; }
  else if (activeAITab === "labs") content.innerHTML = renderAILabs();
  else if (activeAITab === "anatomy") content.innerHTML = renderAIAnatomy();
  else if (activeAITab === "papers") content.innerHTML = renderAIPapers();
  else if (activeAITab === "governance") content.innerHTML = renderAIGovernance();
}

function setAITab(tab) {
  if (!["overview", "guides", "glossary", "map", "courses", "labs", "anatomy", "papers", "governance"].includes(tab)) return;
  activeAITab = tab;
  renderAIZone();
  document.getElementById("ai-view")?.scrollIntoView({ block: "start" });
}

function openAIPaper(paperId) {
  if (!(getAIData().papers || []).some((paper) => paper.id === paperId)) return;
  closeLesson();
  switchView("ai");
  setAITab("papers");
  requestAnimationFrame(() => {
    const paper = document.querySelector(`[data-ai-paper-id="${paperId}"]`);
    if (!paper) return;
    paper.open = true;
    paper.scrollIntoView({ behavior: "smooth", block: "center" });
    paper.querySelector("summary")?.focus();
  });
}
