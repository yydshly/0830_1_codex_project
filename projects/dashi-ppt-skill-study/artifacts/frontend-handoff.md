# R-003 · Dashi PPT Skill 研究展厅交接

## 入口

- 源码：`projects/dashi-ppt-skill-study/showcase/`
- 本地 URL：`http://127.0.0.1:4175/projects/dashi-ppt-skill-study/showcase/`
- 在线 URL：`https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/`
- 研究编号：`R-003` / 第 3 个研究子项目
- 设计契约：`docs/frontend-design-contract.md`
- 覆盖清单：`docs/frontend-coverage.md`
- 浏览器验收：`artifacts/frontend-verification.md`
- 真实实验 01：`experiments/real-run-01/experiment-report.json`
- 真实实验 02：`experiments/real-run-02-brand-media/experiment-report.json`

## 运行

在仓库根目录执行：

```powershell
python -m http.server 4175 --bind 127.0.0.1 --directory .
```

页面无构建步骤、无包管理器、无外部运行依赖，可由 GitHub Pages 直接托管。

## 发布状态

- 首次公开提交：`e916b29f45d0de738205d5195d96a3448a05db13`
- Repository checks：GitHub Actions run `33371746745` 通过
- Deploy research site：GitHub Actions run `33371746832` 通过
- 线上验收：根索引、研究页、六案例 Web、第二轮 5 个下载/报告链接均为 HTTP 200；1440 / 768 / 390 浏览器矩阵无横向溢出和控制台错误

## 内容维护

- 页面研究叙事、六案例索引、两轮真实运行审计台、Dashi Compiler 静态结构、8 条证据、4 类替代方案和无脚本说明在 `showcase/index.html`。
- 响应式、主题、Dashi Compiler 四方案预览和 Deck 视觉系统在 `showcase/styles.css`。
- 两轮真实预览元数据、案例到场景的跳转、内容容量规则、内容指纹、3+1 状态、样例页机制追踪、流程、受众、四场景共 36 页样例、移动目录、证据筛选和六维采用评估交互在 `showcase/app.js`。
- 更新上游版本或证据数字时，应同时更新项目 README、页面首屏、契约测试和研究日志。
- 四个场景各有独立的 `meta`、9 页 `slides` 与默认视觉参数；新增场景时必须同步补充场景 tab、无脚本目录、契约测试和浏览器证据。
- 36 页样例必须继续标注为“模拟数据 / 交互模拟”，除非未来确实由锁定的上游版本生成并有导出证据。
- Dashi Compiler 的 `labLayouts` 是解释容量筛选的缩小模拟，不是 1,020 个真实布局的浏览器运行结果；调整规则时必须保持“机制模拟”标记，并同步更新默认、媒体和超载状态测试。
- `contentFingerprint` 只用于证明网页内四方案共享同一输入状态，不是上游 schema 的真实哈希或持久化 ID。
- 样例追踪条由页面类型映射生成，说明当前页面采用了哪类内容和布局约束；它不是本次上游导出的运行日志。
- 分栏版式使用左侧深色论证带并把正文约束在右侧内容区；调整通用版式时必须复验卡片、指标、流程、路线和决策五类页面。
- 采用评估器是试点筛选工具，不是性能 benchmark；调整评分阈值时必须同步更新测试与浏览器验收。
- GitHub Pages 由根仓库 `.github/workflows/pages.yml` 在 `main` 推送后部署；本次已完成 Actions 与 canonical 在线 URL 复验，后续修改仍需重复此检查。
- 发布文件范围见 `artifacts/README.md`；上游 checkout、重复中间 HTML、comparison PDF、montage 和临时对象检查文件保持忽略。最大的公开二进制是第二轮 32 页候选稿，约 21 MB，因网页下载入口直接用于复核 3+1 结论而保留。

## 验收命令

```powershell
node --test .\projects\dashi-ppt-skill-study\tests\capability-contract.test.mjs
node --test .\projects\dashi-ppt-skill-study\tests\showcase-contract.test.mjs
node .\projects\dashi-ppt-skill-study\scripts\verify-showcase.mjs
node .\scripts\validate-repository.mjs
```
