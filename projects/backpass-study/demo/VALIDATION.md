# R-002 · Backpass 交互研究网页验收

## 验收结论

通过。网页已加入一条真实、严格归属于当前仓库的 Codex 历史实测，并把能力边界拆成五步：发现、归属、压缩、研究者候选信号、证据门槛。最终状态为 `1 < 2 · HOLD`，未调用外部模型、未生成规则提案、未写项目文件。原有 12 场景地图与三条合成会话闭环无回归；桌面、深色、平板、390px 手机、键盘与减弱动态均有浏览器证据，页面无控制台错误或整页横向溢出。R-002 公开版本已经由 GitHub Pages 部署并完成线上复验。

## 环境与启动

- 日期：2026-08-31
- 系统：Windows，Node.js 22.15.0
- 浏览器驱动：agent-browser 0.27.0
- 浏览器：HeadlessChrome 151.0.0.0
- 启动命令：`node projects/backpass-study/demo/serve.mjs 49173`
- 验收 URL：<http://127.0.0.1:49173/#real-session>

默认端口仍为 4173；验收与当前用户预览使用显式端口 49173。网页代码与响应内容不依赖端口。

## GitHub Pages 发布复验

| 项目 | 线上证据 |
| --- | --- |
| 发布提交 | [`afdddbd6c1999440c6e4e5136b41b93b93527fdc`](https://github.com/yydshly/0830_1_codex_project/commit/afdddbd6c1999440c6e4e5136b41b93b93527fdc)；`origin/main` 精确一致 |
| 仓库检查 | [`Repository checks` run `33369455904`](https://github.com/yydshly/0830_1_codex_project/actions/runs/33369455904)，`success` |
| Pages 部署 | [`Deploy research site` run `33369455942`](https://github.com/yydshly/0830_1_codex_project/actions/runs/33369455942)，build 与 deploy 均为 `success` |
| GitHub 目录 | [公开研究目录](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/backpass-study) 返回 200，包含 R-002 与 Backpass |
| 在线研究页 | [R-002 研究页](https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/) 返回 200，包含序号、锁定提交与 Web 入口 |
| 在线 Web | [R-002 交互演示](https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/demo/) 及 CSS/JS 返回 200；页脚四个索引正确 |

线上 1440×1200 Chromium 已完成真实历史 `READY → HOLD`、场景 `adjacent 4/12`、合成建议 `REVIEW → ACCEPTED` 与 `REVIEW → REJECTED`；390×844 下页面和五阶段 tab 均无横向溢出，深色切换正常。两档视口的 `window.__consoleErrors` 与浏览器错误列表均为空。在线研究页在 390×844 下同样无页面级溢出。

## 真实历史证据边界

| 项目 | 已验证结果 |
| --- | --- |
| 选择范围 | 只读取 1 条已授权、顶层 Codex 历史；网页不读取本机会话 |
| 严格归属 | Tier 1 / exact；工作目录精确匹配；记录的 Git commit 可解析 |
| 确定性处理 | 5,282,189 B → 26,455 B；175 events；147 tool calls；字节缩减 99.5% |
| 隐私边界 | 原始路径、完整会话 ID、正文和压缩轨迹未进入仓库；正则命中 0 不等于匿名化 |
| 模型边界 | `externalModelCalled=false`；语义候选由研究者解释，不冒充上游 LLM 结论 |
| 写入边界 | `.backpass` 未创建；`filesWritten=0`；没有修改 `AGENTS.md` 或 Skills |
| 证据门槛 | `observed=1`、`required=2`、`result=HOLD`；没有生成提案 |

## 浏览器覆盖结果

| 表面或状态 | 操作与可观察证据 | 结果 |
| --- | --- | --- |
| 页面载入 | 标题正确、正文 5702 字符、5 个真实历史 tab、无错误浮层 | 通过 |
| 真实历史自动演示 | READY → DISCOVER → ASSOCIATE → DISTILL → SIGNAL → HOLD；终态 `step=4` | 通过 |
| 真实历史键盘 | 焦点位于第一步时按 End 跳到 `real-tab-4` 与 HOLD；按 Escape 回 READY，焦点回 `#run-real-demo` | 通过 |
| 信息来源区分 | 绿色“上游确定性输出”、蓝色“研究者解释”、赤色“证据不足停止”均同时有文字标签 | 通过 |
| 桌面浅色，1440×1200 | 双栏样本/流水线；HOLD 卡、隐私条和边界说明可见；无横向溢出 | 通过 |
| 桌面深色，1440×1200 | 同一终态在深色变量下可辨；证据、研究者、风险三色含义不变 | 通过 |
| 平板，820×1180 | 实测区单列，流水线卡宽 757px；`labColumns=757px`；无横向溢出 | 通过 |
| 手机，390×844 | 流水线卡宽 345px；五个 tab 等分为 grid，tab 与文档均无横向溢出；HOLD 完整可见 | 通过 |
| reduced-motion | `matchMedia(...reduce)=true`；流程 300ms 内到 HOLD；transition 为 `1e-06s` | 通过 |
| 场景筛选回归 | 选择 adjacent 得到 `filter=adjacent / visible=4 / total=12` | 通过 |
| 合成演示回归 | READY → REVIEW → ACCEPTED → READY；接受与重置分支可用 | 通过 |
| 静态资源 | `/`、`/styles.css`、`/app.js` 均返回 200 与正确 Content-Type | 通过 |
| 错误检查 | `window.__consoleErrors=[]`；无错误 overlay；浏览器状态读取无异常 | 通过 |

## 截图证据

- [桌面浅色真实历史终态](../artifacts/web-demo-desktop.png)
- [桌面浅色真实历史专用截图](../artifacts/web-demo-real-session.png)
- [桌面深色真实历史终态](../artifacts/web-demo-dark.png)
- [平板单列 HOLD 终态](../artifacts/web-demo-tablet.png)
- [手机五阶段与 HOLD 终态](../artifacts/web-demo-mobile.png)

## 工程验证

```powershell
node --check projects/backpass-study/demo/app.js
node --check projects/backpass-study/demo/serve.mjs
node --test projects/backpass-study/tests/*.test.mjs
node scripts/validate-repository.mjs
```

结果：页面、服务器与单会话脚本语法通过；Backpass 研究、真实历史派生证据、网页与发布契约共 16/16 项通过；仓库结构验证通过；`git diff --check` 无输出。

## 已知边界

- 本次真实运行只覆盖上游 adapter、严格归属、`readTranscript`、`distill+redact` 与机械门槛；没有运行官方 LLM analysis/synthesis。
- 研究者标出的“端口冲突导致迁移和复验”只是等待独立会话佐证的候选摩擦，不是已经成立的规则。
- 正则脱敏只捕获已知秘密格式；原始历史即使经过压缩也可能含个人或业务信息，因此压缩轨迹只在本地临时审阅并在交付前删除。
- 锁定版本官方 CLI 不支持 exact-path/no-raw-read；本研究脚本使用内部 API 收敛到单文件，不能视为上游稳定公开接口。
- 场景地图中的近邻与领域扩展是工程分析，不表示上游已经内置 CI、CRM、事故管理或数据平台连接器。
