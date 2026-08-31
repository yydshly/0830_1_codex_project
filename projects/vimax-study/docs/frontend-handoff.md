# ViMax 研究展厅 · 交接说明

## 交付了什么

`showcase/` 是一个可直接由静态文件服务或 GitHub Pages 托管的中文研究展厅。它沿着“能力 → 使用场景 → 实现方式 → 官方演示 → 可扩展方向”组织内容，并把研究判断绑定到固定 commit 的源码链接。

## 真实案例实验室 Revision 2

Revision 2 把抽象的“使用场景”升级为可交互的生产沙盘。它用 4 组固定上游输入说明 ViMax 如何从输入经过叙事、角色、分镜、参考传播和装配，但明确不把教学推演当成本机已生成的视频证据。

当前案例集包含：

- Idea2Video：README 中“猫、狗与新猫”的儿童卡通创意；
- Script2Video：仓库默认的校园篮球纠错剧本；
- Benchmark A：Mara 的 8 镜头咖啡旅程 fixture；
- Benchmark B：14 镜头餐厅厨房竞赛 fixture。

Novel2Video 保留为边界说明：固定源码证明了分块、FAISS 检索、rerank 和场景规划，但上游未附带可与总成片配对的小说输入，因此不应为了“案例完整”而伪造实跑证据。

**验收状态：** Revision 2 已完成静态、浏览器交互和 1440/768/390 三档视口验收。视觉证据为 [`artifacts/showcase-case-lab.png`](../artifacts/showcase-case-lab.png)；该验收只覆盖案例解释器，不证明外部模型生成质量。

## 用户如何使用

在项目目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve-showcase.ps1
```

然后打开 `http://127.0.0.1:4185/`。能力卡可按叙事、视觉、运行筛选；场景和实现节点可点击，也支持方向键；演示视频只有在明确点击“加载演示”后才访问 GitHub 附件。

## 关键设计判断

- 页面定位为研究展厅，不伪装成 ViMax 产品控制台；
- 首屏先澄清 ViMax 是编排框架，不是新的视频基础模型；
- 以编辑部式信息层级承载高密度证据，浅色用于研究正文，深色用于强调生产图与视频；
- 论文主张、源码已实现和仍待实验验证的内容使用不同状态语言；
- 不复制大型官方视频，保持来源可追溯并提供离线回退。

## 维护入口

- `showcase/index.html`：研究内容、证据链接和语义结构；
- `showcase/case-data.js`：Revision 2 案例输入、阶段产物、人工门禁、镜头参考链与风险数据；
- `showcase/styles.css`：主题、响应式、焦点和 reduced-motion；
- `showcase/app.js`：筛选、标签、流程、主题、媒体加载，以及案例/阶段/镜头/参考链切换；
- `tests/verify-showcase.mjs`：结构、文案边界和零依赖约束；
- `docs/frontend-coverage.md`：逐项覆盖状态；
- `docs/frontend-validation.md`：浏览器证据和复现结果。

### Revision 2 数据维护约束

- 新增案例应继续使用稳定 `id`，并完整提供 `pipeline`、`sourceType`、`sourceLabel`、`sourceUrl`、`input`、`truthNote`、`stages` 和 `shots`；
- `sourceUrl` 必须指向固定 commit 或可复核 fixture，不得使用会漂移的 main 分支链接代替证据；
- `truthNote` 必须解释哪些是上游原始输入、哪些是教学推演、是否有配对生成媒体；
- 阶段状态只能表达“上游真实输入”、“源码已实现”、“依赖模型实测”或“尚未实跑”，不得把代码存在转述为效果已验证；
- 镜头板是机制解释器，“孤立生成 / ViMax 参考链”只可对比输入依赖，不得添加未经消融实验支持的质量分数；Benchmark 没有上游 runner，必须显示“假设接入 ViMax”，不能暗示 fixture 已形成真实 camera tree。

### Revision 2 发布门禁

1. 执行页面静态验证和项目能力验证；
2. 在 1440、768、390px 检查长输入、阶段产物和最长 14 镜头案例；
3. 用键盘遍历案例 tab、生产阶段、镜头卡和 lineage 切换；
4. 确认切换 4 个案例后没有控制台错误、空白状态或残留前一案例的数据；
5. 生成 `artifacts/showcase-case-lab.png`，然后在 `docs/frontend-validation.md` 填写实际环境、状态和视觉证据。

如果上游版本变化，应先更新锁定提交和能力证据，再同步页面中的 commit 链接、版本号、实现边界和验证脚本；不要只替换宣传文案。

## 尚未验证的边界

本网页证明研究内容与交互交付成立，不证明 ViMax 的真实生成质量。下一阶段仍需配置外部模型与成本上限，完成 planning-only 冒烟、固定样例渲染、依赖图消融和 best-of-k 接线实验。
