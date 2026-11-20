"use strict";
registerLessonProfileStage(9, {
  ids: ["direction-decision", "web-path", "backend-api-path", "ai-data-path", "ml-engineering-path", "security-path", "reverse-forensics-path", "systems-path", "embedded-iot-path", "game-graphics-path", "cloud-platform-path", "mobile-app-path", "open-source-docs-path", "portfolio-projects", "learning-plan-selection", "career-review-next-roadmap"],
  systemName: "专业能力选择、项目证据与持续学习",
  projectName: "个人专业作品集",
  prerequisites: ["完成阶段 0–8 的核心练习。", "至少交付一个可运行、可测试的小项目。", "能根据证据复盘优势、短板和学习成本。"],
  lenses: [["能力矩阵", "把方向拆成基础、工具、工程、项目和表达能力", "只按岗位名称就能判断学习内容。"], ["项目范围", "项目应有清楚用户、问题、边界、交付物和验收标准", "功能越多越能证明能力。"], ["证据链", "源码、测试、运行记录、设计取舍和复盘共同证明能力", "只有页面截图就构成完整作品。"], ["阶段复盘", "用结果和反馈调整下一周期，而非频繁更换方向", "计划一旦制定就不能根据证据调整。"]],
  referencesById: {
    "direction-decision": [{ title: "ACM Curricula Recommendations", url: "https://www.acm.org/education/curricula-recommendations", usage: "计算机专业领域与课程体系的公开框架。" }, { title: "GitHub Skills", url: "https://skills.github.com/", usage: "用短项目验证工具与协作能力。" }],
    "web-path": [{ title: "MDN Learn Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", usage: "前端、浏览器、可访问性和网络主线。" }, { title: "WHATWG HTML Standard", url: "https://html.spec.whatwg.org/", usage: "HTML 与 DOM 的规范依据。" }],
    "backend-api-path": [{ title: "FastAPI Documentation", url: "https://fastapi.tiangolo.com/", usage: "后端路由、数据校验、依赖与 API 项目。" }, { title: "OpenAPI Specification", url: "https://spec.openapis.org/oas/latest.html", usage: "HTTP API 契约和机器可读描述。" }],
    "ai-data-path": [{ title: "pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/index.html", usage: "表格数据读取、清洗、变换和分析。" }, { title: "NumPy User Guide", url: "https://numpy.org/doc/stable/user/", usage: "数组计算与数值数据基础。" }],
    "ml-engineering-path": [{ title: "scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html", usage: "建模、评估、预处理和 Pipeline。" }, { title: "MLflow Documentation", url: "https://mlflow.org/docs/latest/index.html", usage: "实验跟踪、模型管理和交付链路。" }],
    "security-path": [{ title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", usage: "Web 应用主要风险类别与防护入口。" }, { title: "OWASP Cheat Sheet Series", url: "https://cheatsheetseries.owasp.org/", usage: "输入、认证、会话、日志等安全实践。" }],
    "reverse-forensics-path": [{ title: "Ghidra Documentation", url: "https://ghidra-sre.org/", usage: "静态分析工具与程序结构观察入口。" }, { title: "YARA Documentation", url: "https://yara.readthedocs.io/en/stable/", usage: "样本特征描述、规则和验证。" }],
    "systems-path": [{ title: "MIT 6.S081", url: "https://pdos.csail.mit.edu/6.S081/", usage: "操作系统、进程、内存、并发和文件系统。" }, { title: "RISC-V Specifications", url: "https://riscv.org/technical/specifications/", usage: "指令集和特权体系结构。" }],
    "embedded-iot-path": [{ title: "Arduino Documentation", url: "https://docs.arduino.cc/", usage: "微控制器、板卡、外设和入门项目。" }, { title: "Zephyr Project Documentation", url: "https://docs.zephyrproject.org/latest/", usage: "嵌入式实时系统、设备树、驱动与构建。" }],
    "game-graphics-path": [{ title: "Godot Documentation", url: "https://docs.godotengine.org/en/stable/", usage: "游戏循环、场景、物理、输入和发布。" }, { title: "Unity Manual", url: "https://docs.unity3d.com/Manual/index.html", usage: "实时引擎、资源、场景和性能工具。" }],
    "cloud-platform-path": [{ title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/", usage: "容器编排、服务、配置和运行状态。" }, { title: "Docker Documentation", url: "https://docs.docker.com/", usage: "镜像、容器和应用打包基础。" }],
    "mobile-app-path": [{ title: "Android Developers", url: "https://developer.android.com/", usage: "Android 应用、界面、数据和发布。" }, { title: "Apple Developer Documentation", url: "https://developer.apple.com/documentation/", usage: "Apple 平台应用框架与开发工具。" }],
    "open-source-docs-path": [{ title: "Open Source Guides", url: "https://opensource.guide/", usage: "开源项目创建、贡献和维护。" }, { title: "GitHub Documentation", url: "https://docs.github.com/en", usage: "仓库、Issue、Pull request 和协作。" }],
    "portfolio-projects": [{ title: "GitHub：About READMEs", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes", usage: "作品说明、运行入口和项目展示。" }, { title: "GitHub Pages Documentation", url: "https://docs.github.com/en/pages", usage: "静态作品站点的发布与维护。" }],
    "learning-plan-selection": [{ title: "ACM Curricula Recommendations", url: "https://www.acm.org/education/curricula-recommendations", usage: "用知识领域检查学习计划覆盖。" }, { title: "GitHub Skills", url: "https://skills.github.com/", usage: "把学习目标落成可验证短任务。" }],
    "career-review-next-roadmap": [{ title: "GitHub：Using your profile", url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile", usage: "整理可公开验证的项目和贡献证据。" }, { title: "Open Source Guides：How to Contribute", url: "https://opensource.guide/how-to-contribute/", usage: "用真实协作反馈校准下一阶段能力。" }]
  },
  references: [
    { title: "MDN Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", usage: "Web 前端与浏览器方向能力框架。" },
    { title: "GitHub Open Source Guides", url: "https://opensource.guide/", usage: "开源协作、项目维护和贡献流程。" },
    { title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/", usage: "云平台、容器编排和运维方向能力入口。" }
  ]
});
