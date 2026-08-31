# R-002 · Backpass 交互研究网页

这是第 2 个研究子项目的纯 HTML、CSS 与 JavaScript 研究展厅，用于解释 Backpass 的能力、实现原理、使用场景、扩展方向和对本研究仓库的意义。页面先用一条已授权真实 Codex 历史的派生证据演示“发现 → 归属 → 压缩 → 候选信号 → 门槛”，再通过合成会话演示完整的“发现 → 损失 → 聚合 → 建议 → 人工审核”闭环。使用场景扩展地图包含 12 个场景，按当前可用、近邻扩展和领域扩展分层筛选。

在线入口：<https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/demo/>。

## 运行

在仓库根目录执行：

```powershell
node .\projects\backpass-study\demo\serve.mjs
```

打开 <http://127.0.0.1:4173>。也可以把端口作为参数传入：

```powershell
node .\projects\backpass-study\demo\serve.mjs 4317
```

## 主交互

1. 进入“单条真实历史实测”，选择“自动演示”“下一步”或直接切换五个阶段。方向键可在阶段标签间移动，`Escape` 可重置。
2. 在压缩阶段查看 `5,282,189 B → 26,455 B`、175 events 和 147 tool calls 等派生数据；`99.5%` 只表示字节缩减，不表示匿名化。
3. 在信号阶段区分研究者标记的端口冲突候选摩擦与上游输出；在门槛阶段查看 `1 < 2 · HOLD`，确认没有提案或规则写入。
4. 在“使用场景扩展地图”按成熟度筛选，查看每项的输入、写回、收益与前置条件；方向键可在筛选按钮间切换。
5. 进入“合成多会话闭环”，选择“运行反向步骤”自动推进或“单步查看”，并在第五步接受或拒绝建议。
6. 主题按钮在浅色与深色之间切换。

网页运行时不读取本机 Agent 记录。真实历史区只显示已提交的不可逆指纹、派生统计和研究者释义；原始路径、完整会话 ID、消息正文与压缩轨迹均不在页面中。对应实验只读处理了 1 条历史，严格关联为 Tier 1 / exact，未调用外部模型、未创建 `.backpass`、未修改规则。锁定版本官方 CLI 不支持 exact-path/no-raw-read 工作流，因此证据由研究脚本通过内部 API 预先生成；页面中的多会话建议闭环仍完全使用合成数据。

## 验收

真实浏览器验收结果见 [VALIDATION.md](VALIDATION.md)。最终证据包含桌面浅色、桌面深色、平板和手机演示状态截图；网页契约测试位于 `../tests/web-demo-contract.test.mjs`。

## 文件

- `index.html`：语义结构与研究内容。
- `styles.css`：浅/深主题、响应式布局、焦点与 reduced-motion。
- `app.js`：主题、导航和演示状态机。
- `serve.mjs`：Node 22 零依赖本地静态服务器。
- `DESIGN-CONTRACT.md`：设计目标与覆盖清单。
- `VALIDATION.md`：浏览器与工程验收记录。
