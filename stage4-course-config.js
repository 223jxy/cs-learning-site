"use strict";
registerLessonProfileStage(4, {
  ids: ["programming-model", "python-run", "variables-types", "strings-formatting", "containers-basics", "conditions", "loops", "functions-modules", "modules-imports", "files-pathlib", "exceptions", "debugging", "testing", "cli-argparse", "venv-pip", "python-project-structure"],
  systemName: "Python 程序运行与项目交付",
  projectName: "Python 自动化工具",
  prerequisites: ["会在安全练习目录中运行命令。", "理解文件、路径、输入、处理和输出。", "能记录完整错误信息和复现步骤。"],
  lenses: [["语法与语义", "语法决定写法是否合法，语义决定运行时表达的含义", "代码没有语法错误就一定符合需求。"], ["运行时状态", "变量、调用栈、文件和异常共同形成可观察状态", "只看最终打印结果就足够。"], ["输入边界", "输入要校验类型、格式、空值、范围和失败方式", "调用者总会传入正确数据。"], ["自动验证", "用断言、测试和退出码固定已经确认的行为", "手动运行一次等于完成测试。"]],
  references: [
    { title: "Python 官方教程", url: "https://docs.python.org/3/tutorial/", usage: "语言语法、数据结构、模块、异常与标准库的主线资料。" },
    { title: "Python 标准库参考", url: "https://docs.python.org/3/library/", usage: "pathlib、argparse、unittest、venv 等标准库接口。" },
    { title: "Python 语言参考", url: "https://docs.python.org/3/reference/", usage: "表达式、执行模型、导入和数据模型的精确定义。" }
  ]
});
