"use strict";
registerLessonProfileStage(5, {
  ids: ["encoding", "data-structures", "linked-list", "stack-queue-deque", "hash-table-set", "complexity", "space-complexity", "algorithms", "sorting-stability", "recursion-call-stack", "divide-and-conquer", "tree-traversal", "heap-priority-queue", "graph-traversal", "dynamic-programming", "algorithm-testing"],
  systemName: "数据表示、数据结构与算法分析",
  projectName: "可测试的算法工具集",
  prerequisites: ["会使用 Python 变量、容器、函数和测试。", "理解文本编码与文件读写。", "能用输入规模描述一组测试数据。"],
  lenses: [["抽象数据类型", "先定义允许的操作与行为，再选择具体存储实现", "数据结构只是一段固定代码。"], ["不变量", "每次操作前后都应保持结构成立的条件", "只要示例输出正确就无需检查结构。"], ["时间与空间", "分析成本如何随输入规模增长，并区分平均、最坏和摊还情况", "只比较一次运行耗时即可判断复杂度。"], ["测试预言", "用已知结果、性质或参考实现判断算法输出", "算法能结束就代表结果正确。"]],
  references: [
    { title: "Python：Data Structures", url: "https://docs.python.org/3/tutorial/datastructures.html", usage: "列表、栈、队列、集合、字典和遍历。" },
    { title: "MIT OpenCourseWare 6.006", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", usage: "数据结构、复杂度、排序、树、图和动态规划。" },
    { title: "Unicode Standard", url: "https://www.unicode.org/standard/standard.html", usage: "字符、码点和 Unicode 编码模型。" }
  ]
});
