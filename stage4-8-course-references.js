"use strict";

(function registerCourseReferences(global) {
  const refs = {
    pyTutorial: ["Python Tutorial", "https://docs.python.org/3/tutorial/", "Python 语言与标准库学习主线。"],
    pyInterpreter: ["Python：Using the Interpreter", "https://docs.python.org/3/tutorial/interpreter.html", "解释器启动、脚本参数与交互模式。"],
    pyDataModel: ["Python Data Model", "https://docs.python.org/3/reference/datamodel.html", "对象、类型、身份、可变性和特殊方法。"],
    pyStdTypes: ["Python Built-in Types", "https://docs.python.org/3/library/stdtypes.html", "字符串、数字、容器、比较与真值。"],
    pyText: ["Python Text Sequence Type", "https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str", "字符串操作、格式化与 Unicode 文本。"],
    pyCollections: ["Python collections", "https://docs.python.org/3/library/collections.html", "deque、Counter 和专用容器。"],
    pyControl: ["Python：More Control Flow Tools", "https://docs.python.org/3/tutorial/controlflow.html", "条件、循环、函数和参数。"],
    pyModules: ["Python：Modules", "https://docs.python.org/3/tutorial/modules.html", "模块、包、导入与搜索路径。"],
    pathlib: ["Python pathlib", "https://docs.python.org/3/library/pathlib.html", "面向对象路径与文件操作。"],
    io: ["Python io", "https://docs.python.org/3/library/io.html", "文本、二进制流与编码边界。"],
    exceptions: ["Python：Errors and Exceptions", "https://docs.python.org/3/tutorial/errors.html", "异常层级、抛出、捕获和清理。"],
    pdb: ["Python pdb", "https://docs.python.org/3/library/pdb.html", "断点、单步、调用栈和变量观察。"],
    unittest: ["Python unittest", "https://docs.python.org/3/library/unittest.html", "测试用例、断言、夹具与运行器。"],
    argparse: ["Python argparse", "https://docs.python.org/3/library/argparse.html", "命令行参数、帮助和错误处理。"],
    venv: ["Python venv", "https://docs.python.org/3/library/venv.html", "虚拟环境创建、隔离和激活。"],
    packaging: ["Python Packaging User Guide", "https://packaging.python.org/en/latest/", "项目元数据、依赖和分发实践。"],
    unicode: ["Unicode Standard", "https://www.unicode.org/standard/standard.html", "字符、码点与 Unicode 编码模型。"],
    unicodeHowto: ["Python Unicode HOWTO", "https://docs.python.org/3/howto/unicode.html", "Python 字符串、编码与解码。"],
    pyDataStructures: ["Python：Data Structures", "https://docs.python.org/3/tutorial/datastructures.html", "列表、集合、字典、栈与队列。"],
    heapq: ["Python heapq", "https://docs.python.org/3/library/heapq.html", "堆不变量与优先队列操作。"],
    bisect: ["Python bisect", "https://docs.python.org/3/library/bisect.html", "有序序列的二分查找与插入。"],
    mitAlgorithms: ["MIT 6.006 Introduction to Algorithms", "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", "复杂度、排序、树、图和动态规划。"],
    html: ["WHATWG HTML Standard", "https://html.spec.whatwg.org/", "HTML 元素语义、文档和 DOM 规范。"],
    mdnHtml: ["MDN：Structuring content with HTML", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content", "语义结构、链接、表单和媒体。"],
    cssBox: ["MDN：The box model", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model", "content、padding、border 与 margin。"],
    cssLayout: ["MDN：CSS layout", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout", "Flexbox、Grid、定位与响应式布局。"],
    cssSpec: ["W3C CSS Specifications", "https://www.w3.org/Style/CSS/specs.en.html", "CSS 模块规范索引。"],
    dom: ["DOM Standard", "https://dom.spec.whatwg.org/", "节点、事件和 DOM 接口规范。"],
    mdnEvents: ["MDN：Introduction to events", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events", "事件监听、对象、冒泡和默认行为。"],
    wcag: ["W3C WCAG 2.2", "https://www.w3.org/TR/WCAG22/", "可感知、可操作、可理解和健壮要求。"],
    http: ["RFC 9110：HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", "HTTP 方法、状态码、字段和语义。"],
    fetch: ["MDN Fetch API", "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", "浏览器请求、响应和错误边界。"],
    devtools: ["Chrome DevTools Network", "https://developer.chrome.com/docs/devtools/network/", "请求瀑布、头、正文、缓存和性能。"],
    webStorage: ["MDN Web Storage API", "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API", "localStorage/sessionStorage 的行为与限制。"],
    owaspStorage: ["OWASP HTML5 Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html", "浏览器存储、消息和客户端安全边界。"],
    fastapi: ["FastAPI Documentation", "https://fastapi.tiangolo.com/", "路由、校验、依赖和 API 文档。"],
    openapi: ["OpenAPI Specification", "https://spec.openapis.org/oas/latest.html", "HTTP API 的机器可读契约。"],
    sqliteLang: ["SQLite SQL Language", "https://www.sqlite.org/lang.html", "SQLite 支持的 SQL 语法。"],
    sqliteSelect: ["SQLite SELECT", "https://www.sqlite.org/lang_select.html", "查询、JOIN、聚合和排序。"],
    sqliteForeign: ["SQLite Foreign Keys", "https://www.sqlite.org/foreignkeys.html", "关系约束、级联和完整性。"],
    sqliteTransaction: ["SQLite Transaction", "https://www.sqlite.org/lang_transaction.html", "事务开始、提交、回滚和并发。"],
    sqlitePlanner: ["SQLite Query Planner", "https://www.sqlite.org/queryplanner.html", "索引选择与查询执行计划。"],
    riscv: ["RISC-V ISA Specifications", "https://riscv.org/technical/specifications/", "指令集与特权体系结构。"],
    intelSdm: ["Intel Software Developer Manuals", "https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html", "处理器架构、指令和内存模型。"],
    mitOs: ["MIT 6.S081 Operating System Engineering", "https://pdos.csail.mit.edu/6.S081/", "进程、内存、系统调用、并发和文件系统。"],
    linuxMan: ["Linux man-pages", "https://www.kernel.org/doc/man-pages/", "Linux 系统调用与 C 库接口。"],
    windowsProcess: ["Microsoft Learn：Processes and Threads", "https://learn.microsoft.com/en-us/windows/win32/procthread/processes-and-threads", "Windows 进程、线程与调度接口。"],
    windowsMemory: ["Microsoft Learn：Memory Management", "https://learn.microsoft.com/en-us/windows/win32/memory/memory-management", "虚拟地址空间、页和内存管理。"],
    windowsIo: ["Microsoft Learn：Windows drivers", "https://learn.microsoft.com/en-us/windows-hardware/drivers/", "Windows 驱动模型、I/O 请求与设备栈资料入口。"],
    windowsPerf: ["Microsoft Learn：Performance Counters", "https://learn.microsoft.com/en-us/windows/win32/perfctrs/about-performance-counters", "系统指标、计数器和采样。"],
    git: ["Git Reference", "https://git-scm.com/docs", "Git 对象、索引、提交和仓库命令。"],
    gitBranch: ["Git：Branching and Merging", "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging", "分支、合并与冲突处理。"],
    githubPr: ["GitHub：About pull requests", "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests", "Pull request、评审和合并流程。"],
    githubReadme: ["GitHub：About READMEs", "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes", "项目说明、运行入口与文档展示。"],
    pyLogging: ["Python logging", "https://docs.python.org/3/library/logging.html", "日志级别、记录器、处理器与格式。"],
    twelveFactor: ["The Twelve-Factor App", "https://12factor.net/", "配置、依赖、进程、日志与环境原则。"],
    semver: ["Semantic Versioning 2.0.0", "https://semver.org/", "主版本、次版本、修订号与兼容承诺。"],
    githubActions: ["GitHub Actions Documentation", "https://docs.github.com/en/actions", "自动化工作流、作业、步骤和权限。"],
    docker: ["Docker Documentation", "https://docs.docker.com/", "镜像、容器、Dockerfile 和运行配置。"],
    kubernetesDeploy: ["Kubernetes Deployments", "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/", "滚动发布、状态和回滚。"],
    openTelemetry: ["OpenTelemetry Documentation", "https://opentelemetry.io/docs/", "指标、日志、跟踪和上下文传播。"],
    googleSre: ["Google SRE Book", "https://sre.google/sre-book/table-of-contents/", "SLI、SLO、错误预算和可靠性实践。"],
    owaspScvs: ["OWASP Software Component Verification Standard", "https://owasp.org/www-project-software-component-verification-standard/", "依赖、构建与组件供应链检查。"],
    slsa: ["SLSA Specification", "https://slsa.dev/spec/v1.0/", "构建来源、制品完整性与供应链等级。"]
  };

  const get = (key) => { const [title, url, usage] = refs[key]; return { title, url, usage }; };
  const apply = (stageId, mapping) => {
    const config = global.lessonProfileStageConfigs[stageId];
    config.referencesById = Object.fromEntries(Object.entries(mapping).map(([id, keys]) => [id, keys.map(get)]));
  };

  apply(4, {
    "programming-model": ["pyTutorial", "pyControl"], "python-run": ["pyInterpreter", "pyModules"], "variables-types": ["pyDataModel", "pyStdTypes"], "strings-formatting": ["pyText", "unicodeHowto"],
    "containers-basics": ["pyDataStructures", "pyCollections"], "conditions": ["pyControl", "pyStdTypes"], "loops": ["pyControl", "pyDataStructures"], "functions-modules": ["pyControl", "pyDataModel"],
    "modules-imports": ["pyModules", "pyInterpreter"], "files-pathlib": ["pathlib", "io"], "exceptions": ["exceptions", "pyDataModel"], "debugging": ["pdb", "exceptions"],
    "testing": ["unittest", "exceptions"], "cli-argparse": ["argparse", "pyInterpreter"], "venv-pip": ["venv", "packaging"], "python-project-structure": ["packaging", "pyModules"]
  });
  apply(5, {
    "encoding": ["unicode", "unicodeHowto"], "data-structures": ["pyDataStructures", "mitAlgorithms"], "linked-list": ["mitAlgorithms", "pyDataModel"], "stack-queue-deque": ["pyCollections", "pyDataStructures"],
    "hash-table-set": ["pyStdTypes", "mitAlgorithms"], "complexity": ["mitAlgorithms", "pyDataStructures"], "space-complexity": ["mitAlgorithms", "pyDataModel"], "algorithms": ["mitAlgorithms", "bisect"],
    "sorting-stability": ["pyDataStructures", "mitAlgorithms"], "recursion-call-stack": ["pyDataModel", "mitAlgorithms"], "divide-and-conquer": ["mitAlgorithms", "pyDataStructures"], "tree-traversal": ["mitAlgorithms", "pyCollections"],
    "heap-priority-queue": ["heapq", "mitAlgorithms"], "graph-traversal": ["mitAlgorithms", "pyCollections"], "dynamic-programming": ["mitAlgorithms", "pyDataStructures"], "algorithm-testing": ["unittest", "mitAlgorithms"]
  });
  apply(6, {
    "web-basics": ["mdnHtml", "html"], "css-box-layout": ["cssBox", "cssSpec"], "css-layout-responsive": ["cssLayout", "cssSpec"], "javascript-dom": ["dom", "html"],
    "events-state": ["mdnEvents", "dom"], "accessibility-basics": ["wcag", "mdnHtml"], "client-server": ["http", "openapi"], "api-json-fetch": ["fetch", "http"],
    "devtools-network": ["devtools", "http"], "browser-storage-security": ["webStorage", "owaspStorage"], "backend-routing": ["fastapi", "openapi"], "sql": ["sqliteLang", "sqliteSelect"],
    "sql-query-join": ["sqliteSelect", "sqliteForeign"], "schema-design-normalization": ["sqliteForeign", "sqliteLang"], "transactions-indexes": ["sqliteTransaction", "sqlitePlanner"], "web-db-project": ["fastapi", "sqliteLang"]
  });
  apply(7, {
    "binary-logic": ["riscv", "intelSdm"], "integer-representation": ["riscv", "intelSdm"], "boolean-circuits": ["riscv", "intelSdm"], "machine-code-assembly": ["riscv", "intelSdm"],
    "cpu-instructions": ["riscv", "intelSdm"], "memory-hierarchy-cache": ["intelSdm", "mitOs"], "memory": ["windowsMemory", "mitOs"], "virtual-memory": ["windowsMemory", "mitOs"],
    "kernel-user-mode": ["mitOs", "windowsProcess"], "system-calls": ["linuxMan", "mitOs"], "process-lifecycle": ["windowsProcess", "mitOs"], "threads-scheduling": ["windowsProcess", "mitOs"],
    "os-concurrency": ["mitOs", "windowsProcess"], "io-drivers": ["windowsIo", "linuxMan"], "filesystem-storage": ["mitOs", "linuxMan"], "system-observability": ["windowsPerf", "linuxMan"]
  });
  apply(8, {
    "git": ["git", "gitBranch"], "branching-merging": ["gitBranch", "git"], "remote-pr-review": ["githubPr", "gitBranch"], "project-readme": ["githubReadme", "twelveFactor"],
    "testing-logging": ["unittest", "pyLogging"], "logging-errors": ["pyLogging", "openTelemetry"], "architecture": ["twelveFactor", "googleSre"], "code-quality-refactor": ["unittest", "githubPr"],
    "dependencies-versions": ["semver", "owaspScvs"], "configuration-secrets": ["twelveFactor", "githubActions"], "ci-pipeline": ["githubActions", "slsa"], "docker-containers": ["docker", "twelveFactor"],
    "deployment": ["kubernetesDeploy", "googleSre"], "observability-monitoring": ["openTelemetry", "googleSre"], "security-release": ["slsa", "owaspScvs"], "delivery-retrospective": ["googleSre", "githubPr"]
  });
})(window);
