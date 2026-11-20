"use strict";
registerLessonProfileStage(7, {
  ids: ["binary-logic", "integer-representation", "boolean-circuits", "machine-code-assembly", "cpu-instructions", "memory-hierarchy-cache", "memory", "virtual-memory", "kernel-user-mode", "system-calls", "process-lifecycle", "threads-scheduling", "os-concurrency", "io-drivers", "filesystem-storage", "system-observability"],
  systemName: "硬件、指令集、操作系统与存储层次",
  projectName: "系统行为观察实验",
  prerequisites: ["理解二进制、进程、文件与权限的基础概念。", "能运行只读系统观察命令。", "会记录正常、异常和恢复三种状态。"],
  lenses: [["抽象层", "上层通过稳定接口使用下层资源，同时隐藏部分实现细节", "抽象意味着下层不存在。"], ["资源与状态", "CPU、内存、设备和文件都有容量、所有权与生命周期", "资源释放会自动且立即完成。"], ["保护边界", "特权级、地址空间和权限限制错误或恶意操作的影响范围", "用户程序可以直接执行任意硬件操作。"], ["可观察性", "通过计数器、日志、跟踪和系统工具建立行为证据", "任务管理器中的单个数字就是完整原因。"]],
  references: [
    { title: "MIT 6.S081 Operating System Engineering", url: "https://pdos.csail.mit.edu/6.S081/", usage: "进程、虚拟内存、系统调用、并发、文件系统与驱动。" },
    { title: "RISC-V ISA Specifications", url: "https://riscv.org/technical/specifications/", usage: "指令、寄存器、特权层和机器级执行模型。" },
    { title: "Microsoft Windows Documentation", url: "https://learn.microsoft.com/en-us/windows/", usage: "Windows 进程、内存、I/O 与诊断工具的系统资料。" }
  ]
});
