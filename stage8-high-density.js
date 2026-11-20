"use strict";
registerLessonProfileStage(8, {
  ids: ["git", "branching-merging", "remote-pr-review", "project-readme", "testing-logging", "logging-errors", "architecture", "code-quality-refactor", "dependencies-versions", "configuration-secrets", "ci-pipeline", "docker-containers", "deployment", "observability-monitoring", "security-release", "delivery-retrospective"],
  systemName: "版本控制、工程质量与软件交付流水线",
  projectName: "可复现的软件交付项目",
  prerequisites: ["完成一个含源码、测试和 README 的小项目。", "理解进程、网络、文件和权限。", "能区分开发、测试和发布环境。"],
  lenses: [["变更与基线", "每次修改应能追溯到明确基线、目的和验收结果", "只保留最终文件即可解释历史。"], ["自动化关卡", "测试、静态检查、构建和安全检查应形成可重复门禁", "CI 通过等于生产必然正常。"], ["配置与依赖", "外部化环境差异，锁定直接和传递依赖的兼容范围", "本机能运行就代表环境可复现。"], ["发布与回滚", "交付包含版本、制品、监控、验证和恢复方案", "部署结束就是交付结束。"]],
  references: [
    { title: "Git Reference", url: "https://git-scm.com/docs", usage: "提交、分支、合并、远程和版本对象。" },
    { title: "GitHub Documentation", url: "https://docs.github.com/en", usage: "Pull request、评审、Actions、安全与协作流程。" },
    { title: "Docker Documentation", url: "https://docs.docker.com/", usage: "镜像、容器、Dockerfile、运行配置和发布。" }
  ]
});
