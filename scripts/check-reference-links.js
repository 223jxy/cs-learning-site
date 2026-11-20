#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const appPaths = ["app-core-data.js", "data/mainline-data.js", "data/extension-data.js", "app-project-tools.js", "app-state.js", "app-model.js", "app-ai-view.js", "app-reading.js", "app-review-notes.js", "app-course-views.js", "app.js"].map((file) => path.join(projectRoot, file));
const online = process.argv.includes("--online");
const timeoutMs = 10000;
const concurrency = 4;

function loadReferenceData() {
  let code = appPaths.map((file) => fs.readFileSync(file, "utf8")).join("\n").replace(/\ninit\(\);\s*$/, "");
  code += `
    globalThis.__referenceCheck = {
      stages,
      extensionCourses,
      extensionReferenceLibrary,
      extensionModuleReferenceMap,
      extensionSourceTermCopy,
      getExtensionCourseReferences,
      getExtensionCourseTerms,
      getReferenceProvider
    };
  `;
  const context = {
    console,
    localStorage: { getItem: () => null, setItem: () => {} },
    document: {},
    window: {},
    Blob: function Blob() {},
    URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
    FileReader: function FileReader() {}
  };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: "app.js" });
  return context.__referenceCheck;
}

function runOfflineChecks(data) {
  const errors = [];
  const warnings = [];
  const references = Object.entries(data.extensionReferenceLibrary);
  const urls = new Map();

  for (const [id, reference] of references) {
    if (!id || !reference?.title || !reference?.url) {
      errors.push(`${id || "(empty id)"}: title/url 缺失`);
      continue;
    }
    if (!reference.url.startsWith("https://")) {
      errors.push(`${id}: 不是 https:// 链接`);
    }
    try {
      const parsed = new URL(reference.url);
      if (!parsed.hostname) errors.push(`${id}: URL 缺少 hostname`);
    } catch {
      errors.push(`${id}: URL 格式无效`);
    }
    if (urls.has(reference.url)) {
      warnings.push(`${id} 与 ${urls.get(reference.url)} 使用相同 URL`);
    } else {
      urls.set(reference.url, id);
    }
  }

  for (const [routeCode, modules] of Object.entries(data.extensionModuleReferenceMap)) {
    if (!Array.isArray(modules) || modules.length !== 5) {
      errors.push(`${routeCode}: 模块资料映射数量应为 5`);
      continue;
    }
    modules.forEach((module, moduleIndex) => {
      if (!Array.isArray(module.sourceIds) || module.sourceIds.length < 2) {
        errors.push(`${routeCode}[${moduleIndex}]: 至少需要 2 个资料编号`);
      }
      for (const sourceId of module.sourceIds || []) {
        if (!data.extensionReferenceLibrary[sourceId]) {
          errors.push(`${routeCode}[${moduleIndex}]: 未知资料编号 ${sourceId}`);
        }
      }
    });
  }

  for (const course of data.extensionCourses) {
    const courseReferences = data.getExtensionCourseReferences(course);
    const courseTerms = data.getExtensionCourseTerms(course);
    if (courseReferences.length < 2) {
      errors.push(`${course.id}: 引用资料少于 2 项`);
    }
    if (courseTerms.length < 2) {
      errors.push(`${course.id}: 术语解释少于 2 项`);
    }
    for (const term of courseTerms) {
      if (!term.sourceId || !term.term || !term.explanation) {
        errors.push(`${course.id}: 术语字段不完整`);
      }
    }
  }

  const providerCounts = references.reduce((counts, [, reference]) => {
    const provider = data.getReferenceProvider(reference);
    counts[provider.label] = (counts[provider.label] || 0) + 1;
    return counts;
  }, {});

  return {
    errors,
    warnings,
    summary: {
      mainLessons: data.stages.reduce((sum, stage) => sum + stage.lessons.length, 0),
      extensionCourses: data.extensionCourses.length,
      references: references.length,
      providers: providerCounts
    },
    references
  };
}

async function checkUrl(id, reference) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const request = async (method) => fetch(reference.url, {
    method,
    redirect: "follow",
    signal: controller.signal,
    headers: { "user-agent": "computer-learning-map-link-check/1.0" }
  });

  try {
    let response = await request("HEAD");
    if ([403, 405].includes(response.status)) {
      response = await request("GET");
    }
    return {
      id,
      url: reference.url,
      status: response.status,
      ok: response.status >= 200 && response.status < 400
    };
  } catch (error) {
    return {
      id,
      url: reference.url,
      status: 0,
      ok: false,
      error: error.name === "AbortError" ? "timeout" : error.message
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runWithConcurrency(items, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function runner() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(...items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runner));
  return results;
}

async function main() {
  const data = loadReferenceData();
  const offlineResult = runOfflineChecks(data);

  console.log("Reference structure check");
  console.log(JSON.stringify(offlineResult.summary, null, 2));
  for (const warning of offlineResult.warnings) console.warn(`WARN ${warning}`);
  for (const error of offlineResult.errors) console.error(`FAIL ${error}`);

  if (offlineResult.errors.length) process.exitCode = 1;

  if (!online) {
    console.log("ONLINE SKIPPED: 使用 --online 执行真实网络可达性检查。");
    return;
  }

  console.log(`Online link check: ${offlineResult.references.length} URLs, concurrency=${concurrency}, timeout=${timeoutMs}ms`);
  const results = await runWithConcurrency(offlineResult.references, checkUrl);
  for (const result of results) {
    const label = result.ok ? "OK" : "FAIL";
    console.log(`${label} ${result.id} ${result.status || result.error} ${result.url}`);
  }
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

