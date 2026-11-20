"use strict";

(function registerAdvancedCourseLabs(global) {
  const labs = {};
  const add = (runtime, id, title, code, expected, cases, files = [runtime === "python" ? "lab.py" : "lab.js"]) => {
    labs[id] = { title, runtime, command: runtime === "python" ? "python lab.py" : "node lab.js", files, code: code.trim(), expected, cases, checks: ["命令退出码为 0。", `输出包含：${expected.join("、")}。`, "改变一个边界输入并重新执行，结果与解释一致。"] };
  };
  const py = (...args) => add("python", ...args);
  const js = (...args) => add("javascript", ...args);
  const plan = (id, title, sections) => js(id, title, `const plan = ${JSON.stringify(Object.fromEntries(sections.map((name) => [name, "已填写"])), null, 2)};\nconst required = ${JSON.stringify(sections)};\nconst missing = required.filter((key) => !plan[key]);\nconsole.log(missing.length ? "MISSING=" + missing.join(",") : "PLAN_OK");\nconsole.log("SECTIONS=" + Object.keys(plan).length);`, ["PLAN_OK", `SECTIONS=${sections.length}`], ["删除一个字段应输出 MISSING。", "恢复字段后重新通过。"]);

  // 阶段 6：Web 与数据库
  js("web-basics", "检查 HTML 语义骨架", `const html = '<header>标题</header><main><article>正文</article></main><footer>页脚</footer>';\nconst required = ['header', 'main', 'article', 'footer'];\nconst missing = required.filter(tag => !html.includes('<' + tag));\nconsole.log(missing.length ? 'MISSING=' + missing.join(',') : 'SEMANTIC_OK');`, ["SEMANTIC_OK"], ["删除 main", "重复 main", "结构标签与视觉样式分开"]);
  js("css-box-layout", "计算标准盒模型占用宽度", `function outerWidth({content, padding, border, margin}) { return content + 2 * (padding + border + margin); }\nconsole.log('content-box', outerWidth({content: 200, padding: 16, border: 2, margin: 8}));\nconsole.log('border-box-content', 200 - 2 * (16 + 2));`, ["content-box 252", "border-box-content 164"], ["content-box", "border-box", "左右边距各计算一次"]);
  js("css-layout-responsive", "验证响应式断点决策", `function columns(width) { if (width < 640) return 1; if (width < 1024) return 2; return 3; }\n[320, 640, 800, 1024, 1440].forEach(width => console.log(width, columns(width)));`, ["320 1", "640 2", "1024 3"], ["断点前一像素", "恰好等于断点", "宽桌面"]);
  js("javascript-dom", "模拟 DOM 查询与文本更新", `const nodes = [{id: 'status', textContent: '未开始'}, {id: 'count', textContent: '0'}];\nconst query = id => nodes.find(node => node.id === id) || null;\nconst status = query('status'); status.textContent = '已完成';\nconsole.log(status.id, status.textContent);\nconsole.log('missing', query('unknown'));`, ["status 已完成", "missing null"], ["元素存在", "元素不存在", "更新文本而非拼接不可信 HTML"]);
  js("events-state", "用 reducer 管理事件与状态", `function reducer(state, event) {\n  if (event.type === 'increment') return {...state, count: state.count + 1};\n  if (event.type === 'reset') return {...state, count: 0};\n  return state;\n}\nlet state = {count: 0};\nfor (const event of [{type:'increment'}, {type:'increment'}, {type:'reset'}]) state = reducer(state, event);\nconsole.log(state);`, ["{ count: 0 }"], ["连续事件", "reset", "未知事件保持原状态"]);
  js("accessibility-basics", "执行最小可访问性审计", `const html = '<button aria-label="保存">💾</button><img src="chart.png" alt="学习进度图">';\nconst checks = {buttonName: /<button[^>]+aria-label=/.test(html), imageAlt: /<img[^>]+alt=/.test(html)};\nconsole.log(checks);\nconsole.log(Object.values(checks).every(Boolean) ? 'A11Y_OK' : 'A11Y_FAIL');`, ["buttonName: true", "imageAlt: true", "A11Y_OK"], ["图标按钮名称", "图片替代文本", "键盘焦点需在浏览器继续验证"]);
  js("client-server", "模拟请求、路由与响应", `function handle(request) {\n  if (request.method !== 'GET') return {status: 405, body: {error:'method'}};\n  if (request.path === '/api/health') return {status: 200, body: {ok:true}};\n  return {status: 404, body: {error:'not-found'}};\n}\nfor (const req of [{method:'GET',path:'/api/health'},{method:'GET',path:'/missing'},{method:'POST',path:'/api/health'}]) console.log(handle(req));`, ["status: 200", "status: 404", "status: 405"], ["正常路由", "未知路径", "错误方法"]);
  js("api-json-fetch", "解析 API JSON 并校验契约", `function parseResponse(status, text) {\n  if (status < 200 || status >= 300) return {ok:false, error:'http-' + status};\n  try { const data = JSON.parse(text); return typeof data.id === 'number' ? {ok:true,data} : {ok:false,error:'schema'}; }\n  catch { return {ok:false,error:'json'}; }\n}\nconsole.log(parseResponse(200, '{"id":7,"name":"notes"}'));\nconsole.log(parseResponse(500, '{}'));\nconsole.log(parseResponse(200, 'bad'));`, ["ok: true", "http-500", "error: 'json'"], ["成功 JSON", "HTTP 失败", "非法 JSON", "字段缺失"]);
  js("devtools-network", "分析简化 HAR 请求记录", `const requests = [{url:'/app.js',status:200,ms:45,size:1200},{url:'/api/items',status:500,ms:320,size:80},{url:'/logo.png',status:200,ms:20,size:5000}];\nconst failed = requests.filter(item => item.status >= 400);\nconst slowest = requests.reduce((a,b) => a.ms > b.ms ? a : b);\nconsole.log('failed', failed.map(item => item.url));\nconsole.log('slowest', slowest.url, slowest.ms);`, ["failed [ '/api/items' ]", "slowest /api/items 320"], ["4xx/5xx 筛选", "最慢请求", "状态与耗时分开判断"]);
  js("browser-storage-security", "检查浏览器存储中的敏感键", `const storage = {theme:'dark', progress:'12', token:'secret', password:'bad'};\nconst forbidden = /token|password|secret|cookie/i;\nconst risky = Object.keys(storage).filter(key => forbidden.test(key));\nconsole.log('risky', risky);\nconsole.log(risky.length === 0 ? 'STORAGE_OK' : 'REMOVE_SENSITIVE');`, ["token", "password", "REMOVE_SENSITIVE"], ["偏好设置可本地保存", "认证秘密不进入 localStorage", "清除站点数据会丢失状态"]);
  js("backend-routing", "实现参数路由与错误响应", `function route(method, path) {\n  const match = path.match(/^\\/items\\/(\\d+)$/);\n  if (method !== 'GET') return {status:405};\n  if (!match) return {status:404};\n  return {status:200, params:{id:Number(match[1])}};\n}\n['/items/42','/items/x','/other'].forEach(path => console.log(path, route('GET', path)));`, ["params: { id: 42 }", "status: 404"], ["合法数字参数", "参数格式错误", "未知路径", "方法不允许"]);
  py("sql", "在内存数据库执行 CRUD", `import sqlite3\ndb = sqlite3.connect(":memory:")\ndb.execute("create table notes(id integer primary key, title text not null)")\ndb.executemany("insert into notes(title) values (?)", [("alpha",), ("beta",)])\nrows = db.execute("select id, title from notes order by id").fetchall()\nprint(rows)\ndb.execute("update notes set title=? where id=?", ("BETA", 2))\nprint(db.execute("select title from notes where id=2").fetchone())`, ["[(1, 'alpha'), (2, 'beta')]", "('BETA',)"], ["参数化插入", "稳定排序", "更新指定主键"]);
  py("sql-query-join", "用 JOIN 组合关系数据", `import sqlite3\ndb=sqlite3.connect(":memory:")\ndb.executescript("create table users(id integer primary key,name text); create table notes(id integer primary key,user_id integer,title text);")\ndb.executemany("insert into users values (?,?)", [(1,"阳"),(2,"洛")])\ndb.executemany("insert into notes values (?,?,?)", [(1,1,"网络"),(2,1,"Python")])\nquery="select users.name,count(notes.id) from users left join notes on notes.user_id=users.id group by users.id order by users.id"\nprint(db.execute(query).fetchall())`, ["[('阳', 2), ('洛', 0)]"], ["一对多", "LEFT JOIN 保留零记录用户", "GROUP BY 主键"]);
  py("schema-design-normalization", "把重复字段拆成关系表", `rows=[{"order":1,"customer":"阳","city":"北京","item":"书"},{"order":2,"customer":"阳","city":"北京","item":"键盘"}]\ncustomers={row["customer"]:row["city"] for row in rows}\norders=[{"order":row["order"],"customer":row["customer"],"item":row["item"]} for row in rows]\nprint("customers", customers)\nprint("orders", orders)`, ["customers {'阳': '北京'}", "'order': 2"], ["客户城市只存一处", "订单保留外键", "更新异常"]);
  py("transactions-indexes", "验证事务回滚与查询计划", `import sqlite3\ndb=sqlite3.connect(":memory:")\ndb.execute("create table accounts(id integer primary key,balance integer check(balance>=0))")\ndb.executemany("insert into accounts values (?,?)", [(1,100),(2,50)])\ndb.commit()\ntry:\n    with db:\n        db.execute("update accounts set balance=balance-200 where id=1")\nexcept sqlite3.IntegrityError: print("ROLLBACK")\nprint(db.execute("select * from accounts order by id").fetchall())\ndb.execute("create index idx_balance on accounts(balance)")\nprint("index", db.execute("pragma index_list(accounts)").fetchone()[1])`, ["ROLLBACK", "[(1, 100), (2, 50)]", "index idx_balance"], ["提交基线数据", "约束失败", "原子回滚", "索引存在性"]);
  py("web-db-project", "完成内存版 Web 数据闭环", `import sqlite3, json\ndb=sqlite3.connect(":memory:")\ndb.execute("create table tasks(id integer primary key,title text,done integer default 0)")\ndef create(payload):\n    title=payload.get("title","").strip()\n    if not title: return {"status":400,"error":"title-required"}\n    cur=db.execute("insert into tasks(title) values (?)",(title,)); return {"status":201,"id":cur.lastrowid}\nprint(json.dumps(create({"title":"学习 SQL"}),ensure_ascii=False))\nprint(create({"title":" "}))\nprint(db.execute("select * from tasks").fetchall())`, ["学习 SQL", "title-required", "[(1, '学习 SQL', 0)]"], ["创建成功", "空标题拒绝", "数据库结果可查询"]);

  // 阶段 7：计算机系统原理
  py("binary-logic", "执行二进制与位运算", `a,b=0b1010,0b1100\nprint("and",bin(a&b)); print("or",bin(a|b)); print("xor",bin(a^b)); print("shift",bin(a<<1))`, ["and 0b1000", "or 0b1110", "xor 0b110", "shift 0b10100"], ["按位与", "按位或", "异或", "左移"]);
  py("integer-representation", "计算 8 位补码", `def signed8(value): return value-256 if value&0x80 else value\nfor raw in [0x00,0x7f,0x80,0xff]: print(hex(raw),signed8(raw))\nprint("minus1_bits",format((-1)&0xff,"08b"))`, ["0x7f 127", "0x80 -128", "0xff -1", "11111111"], ["零", "最大正数", "最小负数", "-1"]);
  py("boolean-circuits", "生成半加器真值表", `for a in [0,1]:\n    for b in [0,1]:\n        total=a^b; carry=a&b\n        print(a,b,"sum",total,"carry",carry)`, ["0 0 sum 0 carry 0", "1 1 sum 0 carry 1"], ["四种输入组合", "异或得到和", "与得到进位"]);
  py("machine-code-assembly", "解释简化汇编指令", `program=[("LOAD",3),("ADD",4),("MUL",2)]\nacc=0\nfor op,arg in program:\n    if op=="LOAD": acc=arg\n    elif op=="ADD": acc+=arg\n    elif op=="MUL": acc*=arg\n    print(op,arg,"ACC",acc)\nprint("result",acc)`, ["LOAD 3 ACC 3", "ADD 4 ACC 7", "result 14"], ["指令顺序", "累加器状态", "未知操作码应报错"]);
  py("cpu-instructions", "模拟取指、译码、执行循环", `memory=[("MOV",2),("ADD",5),("HALT",0)]; pc=0; reg=0\nwhile True:\n    op,arg=memory[pc]; print("fetch",pc,op,arg)\n    pc+=1\n    if op=="MOV": reg=arg\n    elif op=="ADD": reg+=arg\n    elif op=="HALT": break\nprint("reg",reg,"pc",pc)`, ["fetch 0 MOV 2", "fetch 2 HALT 0", "reg 7 pc 3"], ["PC 指向下一条", "寄存器状态", "HALT 终止"]);
  py("memory-hierarchy-cache", "模拟两项 LRU 缓存", `from collections import OrderedDict\ncache=OrderedDict(); hits=0\nfor key in [1,2,1,3,1,2]:\n    if key in cache: hits+=1; cache.move_to_end(key)\n    else:\n        if len(cache)==2: cache.popitem(last=False)\n        cache[key]=key*10\n    print(key,list(cache))\nprint("hits",hits)`, ["hits 2", "3 [1, 3]"], ["命中", "未命中", "容量淘汰", "访问更新最近使用"]);
  py("memory", "观察可变对象共享与复制", `a=[1,2]; alias=a; copied=a.copy(); alias.append(3)\nprint("a",a); print("alias_same",alias is a); print("copy",copied,"copy_same",copied is a)`, ["a [1, 2, 3]", "alias_same True", "copy [1, 2] copy_same False"], ["别名共享修改", "浅复制对象不同", "嵌套对象仍需继续讨论"]);
  py("virtual-memory", "把虚拟地址拆成页号与偏移", `PAGE=4096; table={0:5,1:9}\ndef translate(address):\n    vpn,offset=divmod(address,PAGE)\n    if vpn not in table: return "PAGE_FAULT"\n    return table[vpn]*PAGE+offset\nfor address in [0,4095,4096,9000]: print(address,translate(address))`, ["0 20480", "4095 24575", "4096 36864", "9000 PAGE_FAULT"], ["页内首地址", "页末", "下一页", "缺页"]);
  py("kernel-user-mode", "模拟用户态请求内核服务", `ALLOWED={"get_time","read_status"}\ndef syscall(mode,name):\n    if mode!="user": return {"error":"bad-mode"}\n    if name not in ALLOWED: return {"error":"denied"}\n    return {"ok":True,"service":name}\nfor name in ["get_time","write_kernel_memory"]: print(syscall("user",name))`, ["'ok': True", "'error': 'denied'"], ["允许的系统服务", "拒绝越权请求", "接口校验"]);
  py("system-calls", "观察进程与文件系统调用结果", `import os,tempfile\nfd,path=tempfile.mkstemp(); os.write(fd,b"abc"); os.lseek(fd,0,0); data=os.read(fd,3); os.close(fd); os.unlink(path)\nprint("pid_positive",os.getpid()>0); print("data",data.decode())`, ["pid_positive True", "data abc"], ["创建临时文件", "写入与定位", "读取", "关闭并清理"]);
  py("process-lifecycle", "启动子进程并读取退出码", `import subprocess,sys\nresult=subprocess.run([sys.executable,"-c","print('child-ok')"],capture_output=True,text=True)\nprint("stdout",result.stdout.strip()); print("returncode",result.returncode)`, ["stdout child-ok", "returncode 0"], ["父进程启动子进程", "标准输出", "退出码"]);
  py("threads-scheduling", "模拟时间片轮转调度", `from collections import deque\nqueue=deque([["A",3],["B",2],["C",1]]); order=[]\nwhile queue:\n    task=queue.popleft(); task[1]-=1; order.append(task[0])\n    if task[1]>0: queue.append(task)\nprint("order",order)`, ["order ['A', 'B', 'C', 'A', 'B', 'A']"], ["每轮一个时间片", "任务完成后离队", "公平不等于实时保证"]);
  py("os-concurrency", "用锁保护共享计数器", `import threading\ncount=0; lock=threading.Lock()\ndef work():\n    global count\n    for _ in range(1000):\n        with lock: count+=1\nthreads=[threading.Thread(target=work) for _ in range(4)]\n[t.start() for t in threads]; [t.join() for t in threads]\nprint("count",count)`, ["count 4000"], ["四个线程", "临界区", "join 等待完成"]);
  py("io-drivers", "模拟设备请求队列", `from collections import deque\nrequests=deque([{"op":"read","sector":2},{"op":"write","sector":5}])\nwhile requests:\n    req=requests.popleft()\n    status="OK" if req["sector"]>=0 else "ERROR"\n    print(req["op"],req["sector"],status)`, ["read 2 OK", "write 5 OK"], ["请求排队", "驱动转换请求", "非法扇区应失败"]);
  py("filesystem-storage", "观察路径、inode 类标识与原子替换", `from pathlib import Path\nfrom tempfile import TemporaryDirectory\nwith TemporaryDirectory() as folder:\n    root=Path(folder); target=root/"data.txt"; temp=root/"data.tmp"\n    target.write_text("old",encoding="utf-8"); temp.write_text("new",encoding="utf-8"); temp.replace(target)\n    print("content",target.read_text(encoding="utf-8")); print("files",[p.name for p in root.iterdir()])`, ["content new", "files ['data.txt']"], ["临时目录", "先写临时文件", "原子替换", "最终只留目标"]);
  py("system-observability", "用指标与结构化日志定位异常", `import json,time\nrecords=[]\nfor status,ms in [(200,20),(500,180),(200,25)]: records.append({"status":status,"ms":ms})\nerrors=sum(r["status"]>=500 for r in records); average=sum(r["ms"] for r in records)/len(records)\nprint(json.dumps({"requests":len(records),"errors":errors,"avg_ms":round(average,1)}))\nprint("alert",errors>0)`, ["\"requests\": 3", "\"errors\": 1", "alert True"], ["请求总量", "错误数", "平均耗时", "告警条件"]);

  // 阶段 8：软件工程
  py("git", "计算内容寻址对象", `import hashlib\ncontent=b"hello\\n"\nheader=f"blob {len(content)}\\0".encode(); object_id=hashlib.sha1(header+content).hexdigest()\nprint("blob",object_id); print("stable",object_id==hashlib.sha1(header+content).hexdigest())`, ["blob ce013625030ba8dba906f756967f9e9ca394464a", "stable True"], ["内容不变 ID 稳定", "改变换行 ID 改变", "提交不是文件副本"]);
  js("branching-merging", "模拟分支差异与合并冲突", `const base={title:'v1',color:'green'}; const left={...base,title:'left'}; const right={...base,title:'right'};\nconst conflicts=Object.keys(base).filter(key=>left[key]!==base[key]&&right[key]!==base[key]&&left[key]!==right[key]);\nconsole.log('conflicts',conflicts); console.log(conflicts.length?'REVIEW_REQUIRED':'MERGE_OK');`, ["conflicts [ 'title' ]", "REVIEW_REQUIRED"], ["同字段不同修改", "不同字段可自动组合", "冲突解决后重测"]);
  js("remote-pr-review", "执行 Pull Request 评审门禁", `const pr={scope:'修复搜索',tests:true,docs:true,secretScan:true,reviewers:1};\nconst checks={scope:Boolean(pr.scope),tests:pr.tests,docs:pr.docs,secrets:pr.secretScan,review:pr.reviewers>0};\nconsole.log(checks); console.log(Object.values(checks).every(Boolean)?'PR_READY':'PR_BLOCKED');`, ["tests: true", "PR_READY"], ["缺测试阻断", "至少一名评审者", "范围和文档"]);
  js("project-readme", "检查 README 交付章节", `const readme='# 工具\\n## 运行方式\\nnode app.js\\n## 测试\\nnode test.js\\n## 已知问题\\n无';\nconst required=['# 工具','## 运行方式','## 测试','## 已知问题'];\nconst missing=required.filter(text=>!readme.includes(text));\nconsole.log(missing.length?'MISSING='+missing.join(','):'README_OK');`, ["README_OK"], ["项目名称", "运行方式", "测试命令", "已知限制"]);
  py("testing-logging", "把测试结果与日志关联", `import logging,unittest\nlogging.basicConfig(level=logging.INFO,format="%(levelname)s:%(message)s")\ndef divide(a,b): logging.info("divide a=%s b=%s",a,b); return a/b\nclass TestDivide(unittest.TestCase):\n    def test_value(self): self.assertEqual(divide(6,3),2)\n    def test_zero(self):\n        with self.assertRaises(ZeroDivisionError): divide(1,0)\nunittest.main(verbosity=1)`, ["Ran 2 tests", "OK"], ["正常断言", "异常断言", "日志不改变函数结果"]);
  py("logging-errors", "输出可关联的结构化错误", `import json\ndef log(level,event,request_id,**fields): print(json.dumps({"level":level,"event":event,"request_id":request_id,**fields},sort_keys=True))\nlog("INFO","request-start","r-42",path="/items")\nlog("ERROR","database-timeout","r-42",retryable=True)`, ["database-timeout", "\"request_id\": \"r-42\"", "\"retryable\": true"], ["事件名稳定", "请求 ID 可关联", "不记录密码或 token"]);
  js("architecture", "检查模块依赖方向", `const edges=[['ui','service'],['service','repository'],['repository','database']];\nconst forbidden=edges.filter(([from,to])=>from==='database'||(from==='repository'&&to==='ui'));\nconsole.log('edges',edges.length); console.log(forbidden.length?'ARCH_FAIL':'ARCH_OK');`, ["edges 3", "ARCH_OK"], ["UI 依赖服务", "服务依赖仓储", "底层不反向依赖 UI"]);
  js("code-quality-refactor", "用回归案例保护重构", `const before=name=>name.trim().toLowerCase().replaceAll(' ','-');\nconst normalize=name=>name.trim().toLowerCase().split(/\\s+/).join('-');\nconst cases=[' Hello World ','A  B','single'];\nfor(const value of cases){const same=before(value)===normalize(value); console.log(JSON.stringify(value),same,normalize(value));}`, ["\" Hello World \" true hello-world", "\"single\" true single"], ["前后行为一致", "连续空格", "单词输入"]);
  js("dependencies-versions", "判断语义版本兼容范围", `function compatible(version){const [major,minor]=version.split('.').map(Number); return major===2&&minor>=3;}\n['2.3.0','2.9.1','3.0.0','1.9.9'].forEach(v=>console.log(v,compatible(v)));`, ["2.3.0 true", "3.0.0 false", "1.9.9 false"], ["允许同主版本", "拒绝下一主版本", "最低次版本"]);
  js("configuration-secrets", "分离公开配置与秘密", `const env={APP_PORT:'8080',LOG_LEVEL:'info',API_TOKEN:'secret'};\nconst publicKeys=['APP_PORT','LOG_LEVEL']; const config=Object.fromEntries(publicKeys.map(key=>[key,env[key]]));\nconst leaked=Object.keys(config).filter(key=>/token|password|secret/i.test(key));\nconsole.log(config); console.log(leaked.length?'SECRET_LEAK':'CONFIG_OK');`, ["APP_PORT: '8080'", "CONFIG_OK"], ["白名单读取", "秘密不输出", "缺失必填配置应启动失败"]);
  js("ci-pipeline", "执行流水线状态机", `const steps=[['lint',true],['test',true],['build',true],['security',true]];\nfor(const [name,ok] of steps){console.log(name,ok?'PASS':'FAIL'); if(!ok) break;}\nconsole.log(steps.every(([,ok])=>ok)?'PIPELINE_GREEN':'PIPELINE_BLOCKED');`, ["lint PASS", "security PASS", "PIPELINE_GREEN"], ["任一关失败应阻断", "顺序可复现", "发布只使用通过的制品"]);
  js("docker-containers", "审查最小 Dockerfile 指令", `const dockerfile='FROM node:22-alpine\\nWORKDIR /app\\nCOPY package.json .\\nUSER node\\nCMD ["node","app.js"]';\nconst required=['FROM ','WORKDIR ','USER ','CMD ']; const missing=required.filter(item=>!dockerfile.includes(item));\nconsole.log(missing.length?'MISSING='+missing.join(','):'DOCKERFILE_OK');`, ["DOCKERFILE_OK"], ["固定基础镜像系列", "非 root 用户", "明确启动命令"]);
  js("deployment", "模拟渐进发布与回滚", `let state={version:'v1',healthy:true,traffic:100};\nfunction deploy(next,healthy){const previous={...state}; state={version:next,healthy,traffic:10}; if(!healthy){state=previous; return 'ROLLBACK';} state.traffic=100; return 'DEPLOYED';}\nconsole.log(deploy('v2',false),state); console.log(deploy('v2',true),state);`, ["ROLLBACK { version: 'v1'", "DEPLOYED { version: 'v2'"], ["小流量验证", "健康检查失败回滚", "成功后全量"]);
  js("observability-monitoring", "根据 SLI 计算错误预算", `const total=10000,failed=12,target=0.999; const availability=(total-failed)/total; const budget=Math.floor(total*(1-target));\nconsole.log('availability',availability.toFixed(4)); console.log('budget',budget,'used',failed); console.log(failed<=budget?'WITHIN_BUDGET':'BUDGET_EXHAUSTED');`, ["availability 0.9988", "budget 10 used 12", "BUDGET_EXHAUSTED"], ["总请求", "失败请求", "SLO", "错误预算"]);
  js("security-release", "执行发布前安全检查", `const release={tests:true,dependencies:true,secrets:true,sbom:true,rollback:true};\nconst failed=Object.entries(release).filter(([,ok])=>!ok).map(([name])=>name);\nconsole.log(failed.length?'BLOCK='+failed.join(','):'SECURITY_GATE_OK');`, ["SECURITY_GATE_OK"], ["依赖扫描", "秘密扫描", "SBOM", "回滚方案"]);
  js("delivery-retrospective", "从交付数据生成复盘结论", `const delivery={planned:8,done:6,escapedDefects:1,leadDays:5};\nconst completion=delivery.done/delivery.planned; const actions=[];\nif(completion<0.9)actions.push('reduce-scope'); if(delivery.escapedDefects)actions.push('add-regression');\nconsole.log('completion',completion.toFixed(2)); console.log('actions',actions);`, ["completion 0.75", "reduce-scope", "add-regression"], ["计划与完成", "遗漏缺陷", "行动项必须可执行"]);

  // 阶段 9：专业方向与作品证据
  plan("direction-decision", "用证据选择专业方向", ["候选方向", "已有基础", "试做任务", "时间成本", "决策标准"]);
  plan("web-path", "规划 Web 方向试做项目", ["用户场景", "页面结构", "交互状态", "可访问性", "部署验收"]);
  plan("backend-api-path", "规划后端 API 项目", ["资源模型", "接口契约", "数据存储", "错误处理", "测试"]);
  plan("ai-data-path", "规划数据分析闭环", ["问题", "数据来源", "清洗规则", "分析方法", "结论证据"]);
  plan("ml-engineering-path", "规划机器学习工程闭环", ["基线", "数据切分", "指标", "实验记录", "部署监控"]);
  plan("security-path", "规划安全评估项目", ["资产边界", "威胁模型", "验证用例", "修复建议", "复测"]);
  plan("reverse-forensics-path", "规划样本分析记录", ["样本标识", "静态观察", "行为时间线", "关键证据", "结论边界"]);
  plan("systems-path", "规划系统观察实验", ["系统层次", "观察指标", "正常状态", "异常状态", "恢复验证"]);
  plan("embedded-iot-path", "规划 IoT 设备实验", ["硬件清单", "接口协议", "采样周期", "故障处理", "功耗与安全"]);
  plan("game-graphics-path", "规划游戏可玩原型", ["核心循环", "输入反馈", "状态机", "性能预算", "发布验收"]);
  plan("cloud-platform-path", "规划云平台部署", ["服务拓扑", "配置秘密", "健康检查", "监控告警", "回滚"]);
  plan("mobile-app-path", "规划移动应用原型", ["用户任务", "页面导航", "本地状态", "权限", "设备验收"]);
  plan("open-source-docs-path", "规划开源贡献", ["目标项目", "Issue 证据", "最小修改", "测试文档", "评审反馈"]);
  plan("portfolio-projects", "整理作品集证据", ["问题说明", "运行方式", "架构取舍", "测试结果", "演示与复盘"]);
  plan("learning-plan-selection", "制定可验收学习周期", ["周期目标", "每周任务", "交付物", "验收标准", "调整条件"]);
  plan("career-review-next-roadmap", "完成阶段复盘与下一路线", ["已完成证据", "能力缺口", "反馈", "下阶段目标", "停止条件"]);

  labs["api-json-fetch"].code = [
    "function fakeFetch(status, text) {",
    "  return Promise.resolve({status, ok: status >= 200 && status < 300, text: async () => text});",
    "}",
    "async function requestJson(status, text) {",
    "  const response = await fakeFetch(status, text);",
    "  if (!response.ok) return {ok:false, error:'http-' + response.status};",
    "  try { const data = JSON.parse(await response.text()); return typeof data.id === 'number' ? {ok:true,data} : {ok:false,error:'schema'}; }",
    "  catch { return {ok:false,error:'json'}; }",
    "}",
    "(async () => {",
    "  console.log(await requestJson(200, '{\"id\":7,\"name\":\"notes\"}'));",
    "  console.log(await requestJson(500, '{}'));",
    "  console.log(await requestJson(200, 'bad'));",
    "})();"
  ].join("\n");
  labs["api-json-fetch"].cases.push("Promise / await response handling");

  labs["integer-representation"].code += "\n\ndef add8(a, b): return signed8((a + b) & 0xff)\nprint(\"127_plus_1\", add8(127, 1))";
  labs["integer-representation"].expected.push("127_plus_1 -128");
  labs["integer-representation"].cases.push("signed overflow");

  labs.git.title = "\u9a8c\u8bc1\u5de5\u4f5c\u533a\u3001\u6682\u5b58\u533a\u4e0e\u63d0\u4ea4";
  labs.git.runtime = "javascript";
  labs.git.command = "node lab.js";
  labs.git.files = ["lab.js"];
  labs.git.code = [
    "const fs = require('fs');",
    "const os = require('os');",
    "const path = require('path');",
    "const {execFileSync} = require('child_process');",
    "const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'course-git-'));",
    "const run = (...args) => execFileSync('git', args, {cwd: folder, encoding: 'utf8', env: {...process.env, GIT_CONFIG_NOSYSTEM:'1'}}).trim();",
    "try {",
    "  run('init', '-q');",
    "  run('config', 'user.email', 'course@example.invalid');",
    "  run('config', 'user.name', 'Course Lab');",
    "  fs.writeFileSync(path.join(folder, 'notes.txt'), 'hello\\n', 'utf8');",
    "  console.log('before-add', run('status', '--short'));",
    "  run('add', 'notes.txt');",
    "  console.log('staged', run('diff', '--cached', '--name-only'));",
    "  run('commit', '-qm', 'add notes');",
    "  console.log('committed', run('rev-parse', '--short', 'HEAD'));",
    "} finally { fs.rmSync(folder, {recursive:true, force:true}); }"
  ].join("\n");
  labs.git.expected = ["before-add ?? notes.txt", "staged notes.txt", "committed"];
  labs.git.cases = ["\u5de5\u4f5c\u533a\u672a\u8ddf\u8e2a", "\u8fdb\u5165\u6682\u5b58\u533a", "\u63d0\u4ea4\u751f\u6210\u8bb0\u5f55", "\u4e34\u65f6\u4ed3\u5e93\u81ea\u52a8\u6e05\u7406"];

  labs["configuration-secrets"].code = [
    "const env={APP_PORT:'8080',LOG_LEVEL:'info',PRIVATE_CREDENTIAL:'<redacted>'};",
    "const publicKeys=['APP_PORT','LOG_LEVEL'];",
    "const config=Object.fromEntries(publicKeys.map(key=>[key,env[key]]));",
    "const leaked=Object.keys(config).filter(key => /token|password|secret|credential/i.test(key));",
    "console.log(config);",
    "console.log(leaked.length?'SECRET_LEAK':'CONFIG_OK');"
  ].join("\n");
  labs["configuration-secrets"].cases.push("\u79c1\u5bc6\u5b57\u6bb5\u4f7f\u7528\u5360\u4f4d\u7b26\u800c\u4e0d\u8f93\u51fa\u771f\u5b9e\u51ed\u636e");

  // 阶段 9 的两个入口必须是可运行项目模板，而不是只填写计划字段。
  labs["web-path"] = {
    title: "启动本地 Web 项目并验收页面与 API",
    runtime: "javascript",
    command: "node lab.js",
    files: ["lab.js"],
    code: [
      "const http = require('http');",
      "",
      "function request(port, path) {",
      "  return new Promise((resolve, reject) => {",
      "    const req = http.get({host: '127.0.0.1', port, path}, res => {",
      "      let body = '';",
      "      res.setEncoding('utf8');",
      "      res.on('data', chunk => body += chunk);",
      "      res.on('end', () => resolve({status: res.statusCode, body, contentType: res.headers['content-type'] || ''}));",
      "    });",
      "    req.on('error', reject);",
      "  });",
      "}",
      "",
      "const server = http.createServer((req, res) => {",
      "  if (req.method === 'GET' && req.url === '/') {",
      "    const html = '<!doctype html><html lang=\"zh-CN\"><main><h1>学习任务</h1><button type=\"button\">完成</button></main></html>';",
      "    res.writeHead(200, {'content-type': 'text/html; charset=utf-8'});",
      "    return res.end(html);",
      "  }",
      "  if (req.method === 'GET' && req.url === '/api/health') {",
      "    res.writeHead(200, {'content-type': 'application/json; charset=utf-8'});",
      "    return res.end(JSON.stringify({ok: true, service: 'web-starter'}));",
      "  }",
      "  res.writeHead(404, {'content-type': 'application/json; charset=utf-8'});",
      "  res.end(JSON.stringify({error: 'not-found'}));",
      "});",
      "",
      "(async () => {",
      "  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));",
      "  const port = server.address().port;",
      "  try {",
      "    const page = await request(port, '/');",
      "    const health = await request(port, '/api/health');",
      "    const missing = await request(port, '/missing');",
      "    const pageHasA11y = /<main[\\s>]/.test(page.body) && /<h1[\\s>]/.test(page.body) && /<button[^>]+type=\"button\"/.test(page.body);",
      "    console.log('page', page.status, page.contentType.split(';')[0]);",
      "    console.log('api', health.status, JSON.parse(health.body).ok);",
      "    console.log('missing', missing.status);",
      "    console.log('a11y', pageHasA11y ? 'main h1 button' : 'FAIL');",
      "  } finally {",
      "    await new Promise(resolve => server.close(resolve));",
      "  }",
      "})().catch(error => { console.error(error); process.exitCode = 1; });"
    ].join("\n"),
    expected: ["page 200 text/html", "api 200 true", "missing 404", "a11y main h1 button"],
    cases: ["首页返回 HTML", "健康接口返回 JSON", "未知路径返回 404", "页面包含 main、h1 和可命名按钮"],
    checks: ["命令退出码为 0。", "页面、API 和 404 均得到预期状态。", "修改路由或标签后重新执行，验收结果应能指出变化。"]
  };

  labs["cloud-platform-path"] = {
    title: "模拟云服务部署、健康检查与失败回滚",
    runtime: "javascript",
    command: "node lab.js",
    files: ["lab.js"],
    code: [
      "const crypto = require('crypto');",
      "",
      "const publicConfig = {PORT: '8080', LOG_LEVEL: 'info'};",
      "const privateConfig = {API_TOKEN: '<redacted>'};",
      "let active = {version: 'v1', healthy: true};",
      "",
      "function requestId() { return crypto.randomUUID().slice(0, 8); }",
      "function log(event, fields = {}) {",
      "  const record = {event, request_id: requestId(), ...fields};",
      "  console.log(JSON.stringify(record));",
      "  return record;",
      "}",
      "function healthCheck(version, healthy) {",
      "  log('health-check', {version, healthy});",
      "  return healthy;",
      "}",
      "function deploy(version, healthy) {",
      "  const previous = active;",
      "  if (!healthCheck(version, healthy)) {",
      "    active = previous;",
      "    log('rollback', {from: version, to: previous.version});",
      "    return 'ROLLBACK';",
      "  }",
      "  active = {version, healthy: true};",
      "  log('deployed', {version: active.version});",
      "  return 'DEPLOYED';",
      "}",
      "",
      "const output = [];",
      "output.push(deploy('v2', false));",
      "output.push(deploy('v2', true));",
      "const leaked = Object.keys(publicConfig).some(key => /token|password|secret|credential/i.test(key)) || JSON.stringify(publicConfig).includes(privateConfig.API_TOKEN);",
      "console.log('active', active.version);",
      "console.log('config', leaked ? 'SECRET_LEAK' : 'PUBLIC_ONLY');",
      "console.log('release', output.join(' -> '));",
      "if (active.version !== 'v2' || leaked || output.join(' -> ') !== 'ROLLBACK -> DEPLOYED') process.exitCode = 1;"
    ].join("\n"),
    expected: ['"event":"rollback"', '"event":"deployed"', "active v2", "config PUBLIC_ONLY", "release ROLLBACK -> DEPLOYED"],
    cases: ["健康版本部署成功", "不健康版本触发回滚", "配置公开字段与秘密分离", "日志携带 request_id"],
    checks: ["命令退出码为 0。", "回滚前后版本和最终活动版本正确。", "输出中不得出现真实凭据，日志事件可按 request_id 关联。"]
  };

  global.courseLabs = Object.assign(global.courseLabs || {}, labs);
})(window);
