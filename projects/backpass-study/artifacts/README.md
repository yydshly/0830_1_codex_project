# Artifacts

本目录保存理解 Backpass 研究结论所必需的小型报告、结构化结果和截图。

不要提交 Agent 原始会话、密钥、个人数据、依赖缓存或可以重新生成的大型产物。涉及会话的证据应优先使用汇总统计、脱敏摘录或合成测试夹具。

## 当前清单

| 文件 | 用途 |
| --- | --- |
| `baseline-verification.md` | 锁定上游版本、能力契约和 Windows 测试基线 |
| `real-codex-session-analysis.json` | 单条真实 Codex 历史的不可逆指纹、严格关联、压缩统计、研究者释义与 `1 < 2` 停止门槛 |
| `web-demo-real-session.png` | 1440px 桌面浅色真实历史实测终态 |
| `web-demo-desktop.png` | 1440px 桌面浅色真实历史实测终态 |
| `web-demo-dark.png` | 1440px 桌面深色真实历史实测终态 |
| `web-demo-tablet.png` | 820px 平板单栏实测终态与边界说明 |
| `web-demo-mobile.png` | 390px 手机五阶段与 `1 < 2 · HOLD` 终态 |

`real-codex-session-analysis.json` 来自 Backpass `0.1.14`（提交 `d8cbdb68`）内部 API 对一条显式授权会话的只读处理：`5,282,189 B → 26,455 B`、175 events、4 user turns、23 assistant turns、147 tool calls，字节缩减 `99.5%`。trace 已发生截断；正则脱敏标记为 0 只表示没有命中已知模式，不能视为匿名化证明。实验没有调用外部模型、创建 `.backpass` 或修改规则；默认新 gap 门槛要求 2 条独立会话，因此结果为 `1 < 2`、`HOLD`。

该 JSON 只保留派生证据，不包含原始路径、完整会话 ID、消息正文或压缩轨迹。研究者标记的端口冲突候选摩擦也明确标注为人工解释，不是上游判定。锁定版本官方 CLI 不提供 exact-path/no-raw-read 工作流，因此本研究脚本使用内部 API 收敛读取范围。

五张 PNG 由同一静态页面的本地浏览器验收生成，并已在 R-002 公开身份确定后刷新；它们不包含真实 Agent 会话原文、本机路径或外部素材。
