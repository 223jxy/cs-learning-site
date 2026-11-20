#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const errors = [];
const warnings = [];

function requireMatch(pattern, message) {
  if (!pattern.test(html)) errors.push(message);
}

requireMatch(/^<html[^>]+lang=["']zh-CN["']/im, "html 缺少 lang=\"zh-CN\"");
requireMatch(/<meta\s+charset=["']UTF-8["']/i, "缺少 UTF-8 charset 声明");
requireMatch(/<a[^>]+class=["'][^"']*\bskip-link\b[^"']*["'][^>]+href=["']#main-content["']/i, "缺少跳过链接或目标");
requireMatch(/<main[^>]+id=["']main-content["']/i, "缺少 #main-content 主内容区");
requireMatch(/id=["']menu-button["'][^>]+type=["']button["']/i, "导航菜单按钮缺少 type=\"button\"");
requireMatch(/id=["']global-search["'][^>]+aria-label=/i, "全局搜索缺少 aria-label");

const buttons = [...html.matchAll(/<button\b([^>]*)>/gi)].map(match => match[1]);
const missingType = buttons.filter(attrs => !/\btype\s*=\s*["'](?:button|submit|reset)["']/i.test(attrs));
if (missingType.length) errors.push(`静态按钮缺少明确 type：${missingType.length} 个`);

const iconButtons = buttons.filter(attrs => /\b(?:icon-button|menu-button)\b/i.test(attrs));
const unnamedIcons = iconButtons.filter(attrs => !/\baria-label\s*=|\btitle\s*=/i.test(attrs));
if (unnamedIcons.length) errors.push(`图标按钮缺少可访问名称：${unnamedIcons.length} 个`);

const dataViewButtons = buttons.filter(attrs => /\bdata-view\s*=/.test(attrs));
if (dataViewButtons.length < 5) warnings.push(`主导航静态按钮数量偏少：${dataViewButtons.length}`);

function readStyleBundle(file, seen = new Set()) {
  const absolute = path.join(root, file);
  if (seen.has(absolute)) return "";
  seen.add(absolute);
  const css = fs.readFileSync(absolute, "utf8");
  const imports = [...css.matchAll(/@import\s+url\(["']?([^"')]+)["']?\);/g)].map((match) => match[1]);
  return [
    css,
    ...imports.map((importPath) => readStyleBundle(importPath, seen))
  ].join("\n");
}

const focusStyles = readStyleBundle("styles.css");
if (!/:focus-visible\b/.test(focusStyles)) errors.push("styles.css 缺少 :focus-visible 焦点样式");
if (/outline\s*:\s*none/i.test(focusStyles) && !/:focus-visible[\s\S]{0,240}outline\s*:/i.test(focusStyles)) warnings.push("发现 outline:none，请确认未隐藏键盘焦点");

const suspiciousReplacement = /[\uFFFD\u00C2\u00A0]{2,}/g;
if (suspiciousReplacement.test(html)) errors.push("index.html 出现疑似编码替换字符");

console.log("DOM/keyboard static acceptance");
console.log(JSON.stringify({
  file: path.relative(root, htmlPath),
  buttons: buttons.length,
  dataViewButtons: dataViewButtons.length,
  errors: errors.length,
  warnings: warnings.length
}, null, 2));
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("PASS: HTML 语义入口、键盘焦点基础钩子和可访问名称静态检查通过。");
