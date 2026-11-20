"use strict";
registerLessonProfileStage(6, {
  ids: ["web-basics", "css-box-layout", "css-layout-responsive", "javascript-dom", "events-state", "accessibility-basics", "client-server", "api-json-fetch", "devtools-network", "browser-storage-security", "backend-routing", "sql", "sql-query-join", "schema-design-normalization", "transactions-indexes", "web-db-project"],
  systemName: "浏览器、HTTP 服务与关系数据库",
  projectName: "端到端 Web 与数据库应用",
  prerequisites: ["理解 HTTP 请求、响应和浏览器 Network 面板。", "会使用基本命令行和文本编辑器。", "能读写简单 Python 或 JavaScript 代码。"],
  lenses: [["标准与语义", "按 Web 标准表达结构、行为与数据含义", "页面能显示就代表语义正确。"], ["状态与事件", "用户事件驱动状态变化，再触发界面或网络更新", "DOM 就是业务数据本身。"], ["接口契约", "请求方法、路径、状态码、数据格式和错误响应共同构成契约", "接口只需约定成功响应。"], ["安全与可访问性", "输入边界、权限、存储策略和键盘/辅助技术支持属于基本质量", "功能完成后再临时补这些要求。"]],
  references: [
    { title: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", usage: "HTML、CSS、JavaScript、可访问性、HTTP 与浏览器工具。" },
    { title: "WHATWG HTML Living Standard", url: "https://html.spec.whatwg.org/", usage: "HTML 元素、DOM 和浏览器行为的规范依据。" },
    { title: "SQLite Documentation", url: "https://www.sqlite.org/docs.html", usage: "SQL、事务、查询规划、索引和数据库文件。" }
  ]
});
