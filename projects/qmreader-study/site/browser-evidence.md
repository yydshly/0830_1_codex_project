# QMReader 研究网页浏览器证据

## 验收环境

- 初次验收：2026-08-30 05:26 +08:00
- 多场景修订复验：2026-08-30 05:55 +08:00
- R-005 发布标识复验：2026-08-31 +08:00
- 运行：`node projects/qmreader-study/site/server.mjs`
- 地址：`http://127.0.0.1:4217/`
- 浏览器：Chromium，由 `agent-browser` 驱动真实页面交互
- 目标：验证研究内容、交互演示、响应式、主题、键盘和减弱动效，而不是评测真实模型输出

## R-005 发布标识复验

| 表面 | 浏览器观察 | 结果 |
| --- | --- | --- |
| 1440×1000 / light | 页面标题以 `R-005` 开头；品牌主标识同时显示研究编号与 `READER LAB`；上游短 SHA 独立显示；无横向溢出 | pass |
| 390×844 / light | 初次检查发现编号位于会被手机断点隐藏的副标题；将编号提升到品牌主标识后复验可见，导航、主题按钮与首屏无碰撞或横向溢出 | pass |
| 产品与竞品信号 / complete | 点击第三套场景并运行后达到 `PUBLISHED`、`complete`、资产 `1`；更新后的编号未影响状态机 | pass |
| 页脚公开入口 | 可见 `R-005 · QMReader Study` 与“第 5 个研究子项目”；锁定源库、在线研究页、GitHub 目录三类链接的 `href` 精确匹配 | pass |
| 运行时 | 页面 HTTP 200、正文非空、无框架错误覆盖层、浏览器 console/page error 为 0 | pass |

本轮环境未提供 `agent-browser` CLI，因此使用工作区捆绑的 Playwright 与真实无头 Chromium 完成等价检查；断言、截图与控制台监听均针对 `http://127.0.0.1:4217/`。桌面首屏、产品信号完成态和手机首屏证据已更新。

## 跨表面结果

| 表面 | 状态 | 观察 | 结果 |
| --- | --- | --- | --- |
| 1440×1000 | light / idle | 3 个场景选择器、8 个场景卡；唯一 `aria-pressed=true`；无页面级横向溢出 | pass |
| 1440×1000 | light / complete | 三个模板分别到达 `complete`、`PUBLISHED`、资产 `1` | pass |
| 1440×1000 | dark / paper complete | 深浅双向切换通过；纸面 `PUBLISHED` 标签固定为 `rgb(232,248,185)` / `rgb(52,76,0)`，无页面级溢出 | pass |
| 768×1024 | light / idle | 选择器保持 3 列，每列约 239px；场景卡为 2 列；无页面级横向溢出 | pass |
| 390×844 | light / idle | 选择器为单列 346px，三个选项均为 92px 高；主运行按钮 `188×46`；无页面级溢出 | pass |
| 390×844 | paper complete / reduced-motion | 媒体偏好命中；论文模板到达 `PUBLISHED`、22/22 结构块和资产 `1`；信息未缺失 | pass |

## 多场景演示结果

| 场景 | 切换后可见上下文 | 完成态 | 结果 |
| --- | --- | --- | --- |
| AI 技术情报 | `HUGGING FACE PAPERS`、订阅命中、18 个结构块 | `/assets/rewrite/b71a90d4` | pass |
| 论文雷达 | `ARXIV · CS.AI`、论文命中、22 个章节块 | `/assets/paper/7c2e91a0` | pass |
| 产品与竞品信号 | `OFFICIAL CHANGELOG`、信号命中、14 个变化块 | `/assets/signal/4f8c20de` | pass |

每次切换都会同时更新标题、适用人群、队列、五步管线、原始材料、日志、证据边界和资产类型，不是只替换标题。

## 主演示状态验证

| 路径 | 浏览器观察 | 结果 |
| --- | --- | --- |
| idle → running → complete | 标题变为“研究资产已发布”，按钮变为“再次运行”，进度 100% | pass |
| running → paused | 50ms 内二次激活后标题为“演示已暂停”，按钮为“继续” | pass |
| paused → complete | 继续后完成五步管线并生成稳定资产链接 | pass |
| complete → reset | 回到“等待开始”、00%、资产 0；重置禁用并把焦点送回运行按钮 | pass |
| running → scenario switch | 从论文运行态切换到产品信号后回到 idle、00%、NEW，旧计时器不再推进 | pass |

该演示是基于锁定源码结论制作的受控前端模拟。它展示工作流与状态变化，不会在浏览器里抓取真实 RSS，也不会调用真实 AI 模型，因此不能作为模型质量、线上抓取成功率或生产性能的证据。

## 可访问性与回退

- 首次 Tab 聚焦“跳到主要内容”，Enter 后 `#main` 位于粘性导航下方可见位置。
- 场景选择按钮能获得真实焦点；在“论文雷达”上按 Enter 后唯一 `aria-pressed=true` 切换为 `paper-radar`。
- 主操作能获得真实焦点并由 Enter 启动，论文模板最终进入 `PUBLISHED`、资产 1。
- 原生按钮提供暂停、继续、重置和主题切换语义；重置后焦点返回主按钮。
- `:focus-visible` 为链接和控件提供轮廓；状态更新区使用 `aria-live`。
- `prefers-reduced-motion: reduce` 下取消平滑滚动和过渡，状态机使用短延时直接呈现结果。
- JavaScript 不可用时，六类研究正文仍在静态 HTML 中，`noscript` 只说明交互演示不可运行。

## 运行时健康检查

- 浏览器错误：无输出。
- 浏览器控制台：无输出。
- 错误覆盖层：`OK`。
- 页面内容：`HAS_CONTENT`。
- 页面初始化、三场景切换、两次主题切换和完成态之后，错误与控制台仍为空。

## 保留证据

- [桌面首屏](../artifacts/qmreader-site-desktop.png)
- [产品信号演示完成态](../artifacts/qmreader-site-demo.png)
- [八场景版图](../artifacts/qmreader-site-scenarios.png)
- [移动端场景选择](../artifacts/qmreader-site-scenarios-mobile.png)
- [移动端论文完成态](../artifacts/qmreader-site-mobile.png)
- [网页设计契约与覆盖清单](DELIVERY.md)

## 复现命令

```powershell
node .\projects\qmreader-study\site\server.mjs
node --test .\projects\qmreader-study\tests\site-contract.test.mjs
```

然后访问 `http://127.0.0.1:4217/`，依次选择并运行 AI 技术情报、论文雷达和产品与竞品信号，切换主题，并在 1440×1000、768×1024 和 390×844 下检查页面。
