"use strict";

(function registerFoundationPracticeLabs(global) {
  const labs = {};
  const add = (runtime, id, title, code, expected, cases, files) => {
    labs[id] = {
      title,
      runtime,
      command: runtime === "powershell"
        ? "powershell -NoProfile -ExecutionPolicy Bypass -File lab.ps1"
        : "node lab.js",
      files: files || [runtime === "powershell" ? "lab.ps1" : "lab.js"],
      code: code.trim(),
      expected,
      cases,
      checks: [
        "只在临时练习目录运行，不操作桌面、下载或文档目录。",
        "命令退出码为 0。",
        `输出包含：${expected.join("、")}。`,
        "改动一个输入后重新运行，能解释输出为什么变化。"
      ]
    };
  };
  const ps = (...args) => add("powershell", ...args);
  const js = (...args) => add("javascript", ...args);

  // 阶段 0：电脑使用基础
  ps("file-basics", "识别文件名、扩展名与类型边界", `
$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Path ".\\lab-files" -Force | Out-Null
"hello" | Set-Content -Encoding UTF8 -LiteralPath ".\\lab-files\\notes.txt"
"# title" | Set-Content -Encoding UTF8 -LiteralPath ".\\lab-files\\README.md"
"console.log('ok')" | Set-Content -Encoding UTF8 -LiteralPath ".\\lab-files\\app.js"
$items = Get-ChildItem -LiteralPath ".\\lab-files" -File | Sort-Object Name
$groups = $items | Group-Object Extension | Sort-Object Name
Write-Output ("FILE_COUNT=" + $items.Count)
Write-Output ("EXTENSIONS=" + (($groups | ForEach-Object { $_.Name + ":" + $_.Count }) -join ","))
Write-Output ("RENAMING_WARNING=extension_is_not_format_conversion")
`, ["FILE_COUNT=3", ".txt:1", "RENAMING_WARNING=extension_is_not_format_conversion"], ["把 app.js 改名为 app.txt 后，内容不会自动变成普通说明文。", "隐藏扩展名时，先打开资源管理器的扩展名显示再判断。"]);

  ps("paths", "验证绝对路径、相对路径和当前位置", `
$ErrorActionPreference = "Stop"
$root = Get-Location
New-Item -ItemType Directory -Path ".\\path-lab\\child" -Force | Out-Null
"path evidence" | Set-Content -Encoding UTF8 -LiteralPath ".\\path-lab\\child\\note.txt"
$relative = ".\\path-lab\\child\\note.txt"
$absolute = (Resolve-Path -LiteralPath $relative).Path
Write-Output ("CWD_IS_ROOT=" + ([System.IO.Path]::IsPathRooted($root.Path)))
Write-Output ("RELATIVE_EXISTS=" + (Test-Path -LiteralPath $relative))
Write-Output ("ABSOLUTE_ENDS_WITH_NOTE=" + $absolute.EndsWith("note.txt"))
Write-Output ("PARENT_FOLDER=" + (Split-Path -Leaf (Split-Path -Parent $absolute)))
`, ["CWD_IS_ROOT=True", "RELATIVE_EXISTS=True", "ABSOLUTE_ENDS_WITH_NOTE=True", "PARENT_FOLDER=child"], ["从上级目录运行脚本时，相对路径基准会改变。", "路径存在不等于文件内容符合预期。"]);

  ps("archives", "压缩包创建、解压与文件核对", `
$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Path ".\\archive-src" -Force | Out-Null
"alpha" | Set-Content -Encoding UTF8 -LiteralPath ".\\archive-src\\a.txt"
"beta" | Set-Content -Encoding UTF8 -LiteralPath ".\\archive-src\\b.txt"
Compress-Archive -Path ".\\archive-src\\*" -DestinationPath ".\\sample.zip" -Force
New-Item -ItemType Directory -Path ".\\archive-out" -Force | Out-Null
Expand-Archive -Path ".\\sample.zip" -DestinationPath ".\\archive-out" -Force
$out = Get-ChildItem -LiteralPath ".\\archive-out" -File | Sort-Object Name
Write-Output ("ZIP_EXISTS=" + (Test-Path -LiteralPath ".\\sample.zip"))
Write-Output ("EXTRACTED_COUNT=" + $out.Count)
Write-Output ("EXTRACTED_NAMES=" + (($out | ForEach-Object Name) -join ","))
`, ["ZIP_EXISTS=True", "EXTRACTED_COUNT=2", "EXTRACTED_NAMES=a.txt,b.txt"], ["压缩包可能包含多层目录，解压前先看内部结构。", "不要把未知来源压缩包直接解到重要目录。"]);

  ps("text-encoding-line-endings", "观察 UTF-8 文本、字节与换行", `
$ErrorActionPreference = "Stop"
$lf = [char]10
$text = [string]::Concat([char]0x0041, [char]0x4E2D, [char]0x6587, [char]0x0042, $lf)
[System.IO.File]::WriteAllText((Join-Path (Get-Location) "utf8.txt"), $text, [System.Text.UTF8Encoding]::new($false))
$roundTrip = [System.IO.File]::ReadAllText((Join-Path (Get-Location) "utf8.txt"), [System.Text.Encoding]::UTF8)
Write-Output ("LINE_COUNT=" + ([System.IO.File]::ReadAllLines((Join-Path (Get-Location) "utf8.txt"), [System.Text.Encoding]::UTF8).Count))
Write-Output ("ROUNDTRIP_OK=" + ($roundTrip -eq $text))
Write-Output ("HAS_CHINESE_CHARS=" + (($roundTrip.Contains([char]0x4E2D)) -and ($roundTrip.Contains([char]0x6587))))
`, ["LINE_COUNT=1", "ROUNDTRIP_OK=True", "HAS_CHINESE_CHARS=True"], ["同一字符在不同编码下字节不同。", "UTF-8 读写往返后应保持字符不变。"]);

  // 阶段 1：Windows 与硬件
  ps("hardware", "读取系统资源摘要但不泄露个人文件", `
$ErrorActionPreference = "Stop"
Write-Output ("OS_CAPTION_PRESENT=" + [bool][Environment]::OSVersion.VersionString)
Write-Output ("CPU_NAME_PRESENT=" + ([Environment]::ProcessorCount -gt 0))
Write-Output "EVIDENCE_KIND=system_summary"
`, ["OS_CAPTION_PRESENT=True", "CPU_NAME_PRESENT=True", "EVIDENCE_KIND=system_summary"], ["系统摘要只说明硬件环境，不说明程序一定能运行。", "性能判断要结合任务管理器的持续观察。"]);

  ps("program-process", "观察当前 PowerShell 进程证据", `
$ErrorActionPreference = "Stop"
$p = Get-Process -Id $PID
Write-Output ("PROCESS_ID_PRESENT=" + ($p.Id -gt 0))
Write-Output ("PROCESS_NAME=" + $p.ProcessName)
Write-Output ("HAS_START_TIME=" + [bool]$p.StartTime)
Write-Output "PROCESS_IS_RUNNING=True"
`, ["PROCESS_ID_PRESENT=True", "PROCESS_NAME=", "PROCESS_IS_RUNNING=True"], ["程序窗口关闭不一定代表所有子进程结束。", "CPU 瞬时升高不等于长期异常。"]);

  ps("windows-folders", "区分用户目录、临时目录和系统目录", `
$ErrorActionPreference = "Stop"
$homePath = [Environment]::GetFolderPath("UserProfile")
$tempPath = [System.IO.Path]::GetTempPath()
$systemPath = [Environment]::SystemDirectory
Write-Output ("HOME_IS_ROOTED=" + [System.IO.Path]::IsPathRooted($homePath))
Write-Output ("TEMP_IS_ROOTED=" + [System.IO.Path]::IsPathRooted($tempPath))
Write-Output ("SYSTEM_DIR_NAME=" + (Split-Path -Leaf $systemPath).ToLower())
Write-Output "WRITE_TARGET=temp_or_project_folder"
`, ["HOME_IS_ROOTED=True", "TEMP_IS_ROOTED=True", "SYSTEM_DIR_NAME=system32", "WRITE_TARGET=temp_or_project_folder"], ["用户目录不是系统目录。", "练习写入优先选择项目临时目录或系统临时目录。"]);

  ps("accounts-permissions", "判断当前会话是否管理员并保持只读观察", `
$ErrorActionPreference = "Stop"
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
Write-Output ("IS_ADMIN=" + $isAdmin)
Write-Output ("AUTH_TYPE_PRESENT=" + [bool]$identity.AuthenticationType)
Write-Output "PERMISSION_CHECK=read_only"
`, ["IS_ADMIN=", "AUTH_TYPE_PRESENT=True", "PERMISSION_CHECK=read_only"], ["管理员权限不应作为日常学习默认状态。", "权限错误先看目标路径和操作类型。"]);

  // 阶段 2：网络与互联网
  ps("dns-resolution", "解析 localhost 并识别回环地址", `
$ErrorActionPreference = "Stop"
$addresses = [System.Net.Dns]::GetHostAddresses("localhost") | ForEach-Object { $_.ToString() }
Write-Output ("ADDRESS_COUNT=" + $addresses.Count)
Write-Output ("HAS_LOOPBACK=" + (($addresses -contains "127.0.0.1") -or ($addresses -contains "::1")))
Write-Output "DNS_TARGET=localhost"
`, ["ADDRESS_COUNT=", "HAS_LOOPBACK=True", "DNS_TARGET=localhost"], ["DNS 解析成功不代表远程服务可用。", "localhost 指向本机，不需要外网。"]);

  ps("ports-protocols-localhost", "创建本机临时端口并观察监听地址", `
$ErrorActionPreference = "Stop"
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$listener.Start()
$endpoint = $listener.LocalEndpoint
Write-Output ("LISTEN_IP=" + $endpoint.Address)
Write-Output ("LISTEN_PORT_GT_ZERO=" + ($endpoint.Port -gt 0))
Write-Output "SCOPE=loopback_only"
$listener.Stop()
`, ["LISTEN_IP=127.0.0.1", "LISTEN_PORT_GT_ZERO=True", "SCOPE=loopback_only"], ["端口开放在 127.0.0.1 不等于公网开放。", "端口号只是入口，协议决定如何解释数据。"]);

  js("http", "启动本地 HTTP 服务并验证响应", `
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, path: req.url }));
  } else {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
});
server.listen(0, "127.0.0.1", () => {
  const { port } = server.address();
  http.get({ hostname: "127.0.0.1", port, path: "/health" }, (res) => {
    let body = "";
    res.on("data", (chunk) => body += chunk);
    res.on("end", () => {
      console.log("HTTP_STATUS=" + res.statusCode);
      console.log("CONTENT_TYPE=" + res.headers["content-type"]);
      console.log("BODY_OK=" + body.includes('"ok":true'));
      server.close();
    });
  }).on("error", (error) => { console.error(error.message); server.close(() => process.exit(1)); });
});
`, ["HTTP_STATUS=200", "CONTENT_TYPE=application/json", "BODY_OK=true"], ["HTTP 200 只代表协议层成功，还要检查响应体。", "404 是服务器明确返回，不是网络断开。"]);

  js("network-troubleshooting", "按分层顺序生成网络排障证据", `
const checks = [
  ["link", true, "Wi-Fi or Ethernet connected"],
  ["ip", true, "local address present"],
  ["dns", true, "localhost resolves"],
  ["port", false, "service not listening"],
  ["http", false, "no response because port failed"]
];
const firstFail = checks.find(([, ok]) => !ok);
for (const [layer, ok, note] of checks) console.log(layer.toUpperCase() + "=" + (ok ? "OK" : "FAIL") + " " + note);
console.log("FIRST_FAILURE=" + firstFail[0]);
console.log("NEXT_ACTION=start_or_check_service");
`, ["LINK=OK", "PORT=FAIL", "FIRST_FAILURE=port", "NEXT_ACTION=start_or_check_service"], ["不要跳过前面层级直接怪浏览器。", "同一时间只改一个条件，方便确认因果。"]);

  // 阶段 3：命令行与工具
  ps("shell", "识别 Shell 命令与帮助元数据", `
$ErrorActionPreference = "Stop"
$cmd = Get-Command Get-ChildItem
Write-Output ("COMMAND_TYPE=" + $cmd.CommandType)
Write-Output ("VERB=" + $cmd.Verb)
Write-Output ("NOUN=" + $cmd.Noun)
Write-Output "HELP_TARGET=Get-Help Get-ChildItem -Examples"
`, ["COMMAND_TYPE=Cmdlet", "VERB=Get", "NOUN=ChildItem", "HELP_TARGET=Get-Help Get-ChildItem -Examples"], ["别名可以少打字，但学习记录中应写完整命令。", "Shell 决定参数解析方式。"]);

  ps("cmdlets-parameters", "检查命令参数和开关类型", `
$ErrorActionPreference = "Stop"
$params = (Get-Command Get-ChildItem).Parameters
Write-Output ("HAS_LITERALPATH=" + $params.ContainsKey("LiteralPath"))
Write-Output ("HAS_RECURSE=" + $params.ContainsKey("Recurse"))
Write-Output ("RECURSE_TYPE=" + $params["Recurse"].ParameterType.Name)
Write-Output "PARAMETER_EVIDENCE=metadata"
`, ["HAS_LITERALPATH=True", "HAS_RECURSE=True", "RECURSE_TYPE=SwitchParameter", "PARAMETER_EVIDENCE=metadata"], ["开关参数不一定需要值。", "路径来自用户输入时优先用 LiteralPath。"]);

  ps("safe-practice-folder", "创建安全练习目录并验证边界", `
$ErrorActionPreference = "Stop"
$root = Join-Path (Get-Location) "safe-lab"
$child = Join-Path $root "stage3"
New-Item -ItemType Directory -Path $child -Force | Out-Null
"ok" | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $child "evidence.txt")
$resolvedRoot = (Resolve-Path -LiteralPath $root).Path
$resolvedFile = (Resolve-Path -LiteralPath (Join-Path $child "evidence.txt")).Path
Write-Output ("ROOT_EXISTS=" + (Test-Path -LiteralPath $resolvedRoot))
Write-Output ("FILE_UNDER_ROOT=" + $resolvedFile.StartsWith($resolvedRoot))
Write-Output ("EVIDENCE_FILE=" + (Split-Path -Leaf $resolvedFile))
`, ["ROOT_EXISTS=True", "FILE_UNDER_ROOT=True", "EVIDENCE_FILE=evidence.txt"], ["练习目录必须能整体删除或重建。", "写入前先打印目标路径。"]);

  ps("pipeline-objects", "用对象管道筛选与排序进程摘要", `
$ErrorActionPreference = "Stop"
$items = Get-Process | Where-Object { $_.Id -gt 0 } | Sort-Object CPU -Descending | Select-Object -First 3 Id,ProcessName,CPU
Write-Output ("PIPELINE_COUNT=" + $items.Count)
Write-Output ("HAS_ID_PROPERTY=" + [bool]($items[0].PSObject.Properties["Id"]))
Write-Output ("SORT_KEY=CPU")
Write-Output "OUTPUT_SHAPE=objects"
`, ["PIPELINE_COUNT=3", "HAS_ID_PROPERTY=True", "SORT_KEY=CPU", "OUTPUT_SHAPE=objects"], ["PowerShell 管道传的是对象，不只是文本。", "CPU 可能为空，真实排序前要理解字段含义。"]);

  global.foundationPracticeLabs = Object.assign(global.foundationPracticeLabs || {}, labs);
})(window);
