# Solo Skills 研究展厅 · 浏览器验收

## 结论

2026-08-31 在本地静态服务 `http://127.0.0.1:4192/` 完成 revision 5 真实 Chromium 验收。页面在 1440、768、390 像素三档视口均正常渲染，无错误遮罩、控制台错误或横向溢出；8 类能力总览、26 条一句话能力、技能筛选、原理步骤、七个目标场景、真实视频播放、明暗主题、键盘路径和 reduced-motion 均取得浏览器证据。

首选 `agent-browser` 命令未安装在当前 PATH 中。按浏览器验证技能的替代路线，使用工作区随附 Playwright 1.62.1 与本机 Chromium 完成同等真实浏览器检查，没有把源码阅读或构建成功当成视觉证据。

## 环境

| 项目 | 值 |
| --- | --- |
| 页面类型 | 零依赖静态 HTML / CSS / JavaScript |
| 服务 | Python 3.10 `http.server`，127.0.0.1:4192 |
| 自动化 | Playwright 1.62.1 |
| 浏览器 | Headless Chromium，Windows |
| 媒体工具 | FFmpeg / FFprobe n6.1.3 |
| 上游证据版本 | bam-bam-2/solo-skills，commit `d5789f592af17980054052fc7c05fe8a8e46be79` |

## 验收结果

| 范围 | 结果 | 浏览器证据 |
| --- | --- | --- |
| 页面完整性 | 通过 | 标题正常；正文超过 5,000 字符；9 个 main section；无框架错误遮罩 |
| 能力总览 | 通过 | 8 个结果域按 4/3/5/5/4/2/2/1 分布，DOM 数量合计 26；桌面/平板/手机计算为 4/2/1 栏 |
| 一句话能力 | 通过 | 26 个 Skill 均有结果导向描述；视频、会议、简报、Notion 归档和多 Agent 编排代表句通过文本契约与浏览器观察 |
| 技能索引 | 通过 | 26 个技能条目；“脚本增强”筛选显示 9 项，计数同步为 9 |
| 实现原理 | 通过 | End 从“发现技能”切到“经过护栏”，tab 与 panel 状态同步 |
| 使用场景 | 通过 | ArrowRight 从“个人经营者”切到“研究团队”，面板同步 |
| 案例结构 | 通过 | 7 个案例选择器；每例包含运行契约 + 5 个执行阶段和至少一个具体产物预览；真实输入、fixture、dry-run 与建议增强分层显示 |
| 目标调用 | 通过 | 七案例各显示业务目标、可直接发给 Agent 的请求，以及“你提供 / Skill / 环境 / 效果”四组各 4 项事实；research → meeting → cleanup 切换内容同步 |
| 调用演示 | 通过 | 点击“按这个请求运行演示”会禁用两个运行入口、滚动到执行台并完成所选案例；研究案例到 5/5 READY 后按钮恢复 |
| 真实视频生成 | 通过 | `video-stage.html` 同源操作真实网页；640 个源帧经 FFmpeg 编码为 32.00 秒、1920×1080、H.264 High、yuv420p、无音轨 MP4；临时帧已清理 |
| 视频播放器 | 通过 | 只在 video 案例显示；Chromium 读取 duration=32、videoWidth=1920、videoHeight=1080 并实际播放推进超过 0.1 秒；evidence 返回 200/JSON；其他案例隐藏 |
| 视频直达 | 通过 | `?case=video#demo` 初次加载即选择 video 并显示真实媒体卡，便于直接演示 |
| 旗舰案例 | 通过 | 使用当前项目 SHA、26/9、4/4 测试和本地 URL；完整运行到 5/5、READY、ADOPT METHOD |
| 七类门禁 | 通过 | research=READY；meeting=HOLD；workshop=SETUP；video=READY；launch=REVIEW；brief=DRY RUN；cleanup=HOLD |
| 运行隔离 | 通过 | video 运行期间切换 meeting 会取消旧 token、回到 0/5，并恢复“运行完整案例”按钮 |
| 主题 | 通过 | light → dark → light 双向切换；平板深色截图正常 |
| 响应式 | 通过 | 1440×1000、768×1024、390×844 均无横向溢出；能力总览和职责网格均为 4/2/1 栏；媒体卡桌面双栏、768/390px 单栏；最小可见按钮边 ≥32px |
| 键盘与焦点 | 通过 | 案例 End 选择 cleanup、Home 返回 research；阶段 End 到 5/5；原理/受众方向键和真实 Tab 路径可用；焦点轮廓非 `none` |
| reduced-motion | 通过 | 浏览器模拟命中；进度条过渡为 `1e-05s`，等价于 CSS 的 0.01ms |
| 错误检查 | 通过 | 桌面、平板和手机运行期间 console error 与 pageerror 均为空 |
| 外部调用 | 通过 | 展厅运行依赖 0、外部 API 0；真实视频由显式离线脚本调用本地 Chromium 和 FFmpeg 生成，页面只加载本地媒体；浏览器初始加载 4 个本地资源 |

## 视觉证据

- [`showcase-capability-index.png`](../artifacts/showcase-capability-index.png)：1440px 聚焦 8 类结果能力总览；
- [`showcase-usage-desktop.png`](../artifacts/showcase-usage-desktop.png)：1440px 聚焦目标调用面板，展示请求和四方职责；
- [`showcase-video-delivery.png`](../artifacts/showcase-video-delivery.png)：1440px 聚焦真实媒体卡、原生播放器与规格；
- [`showcase-desktop.png`](../artifacts/showcase-desktop.png)：1440px 明色完整页面，旗舰案例 5/5 READY；
- [`showcase-tablet.png`](../artifacts/showcase-tablet.png)：768px 深色、真实视频案例与媒体卡单栏重排；
- [`showcase-mobile.png`](../artifacts/showcase-mobile.png)：390px 明色、真实视频案例、播放器与完整纵向重排；
- [`solo-skills-real-demo-contact-sheet.jpg`](../artifacts/solo-skills-real-demo-contact-sheet.jpg)：最终 640 帧中的六个代表状态。

能力总览图、聚焦调用图、媒体交付图、三张完整页面与视频接触表构成 revision 5 的最终视觉证据集。网页结构化结果见 [`showcase-browser-results.json`](../artifacts/showcase-browser-results.json)，媒体规格与状态检查点见 [`solo-skills-real-demo-evidence.json`](../artifacts/solo-skills-real-demo-evidence.json)。

## Revision 5 验收观察

- 8 类能力与 26 条一句话描述的静态和 Chromium 契约首轮通过，既有筛选、案例和真实视频未回归；
- 聚焦截图确认读者先看到工作结果域，再进入逐项 Skill；“一句话能力”微标签把结果说明与文件名、成熟类型区分开；
- 最终复核首屏内容绘制约 512ms，本地初始资源 5 个；此数值只描述本机静态服务，不外推到线上或低性能设备；
- 全页面截图确认能力总览、Skill 清单、调用卡、媒体卡、阶段轨迹和产物区在三档视口没有裁切或重叠；
- `agent-browser` 仍不在 PATH，因此继续使用已验证的 Playwright 1.62.1 + Chromium 替代路线。

## 复现命令

```powershell
powershell -ExecutionPolicy Bypass -File .\projects\solo-skills-study\scripts\serve-showcase.ps1
node .\projects\solo-skills-study\tests\verify-showcase.mjs

$env:WORKSPACE_NODE_MODULES = '<包含 playwright 的 node_modules>'
$env:SHOWCASE_URL = 'http://127.0.0.1:4192/'
node .\projects\solo-skills-study\tests\verify-showcase-browser.mjs
```

浏览器脚本需要 Playwright，但它不是网页运行依赖；普通读者只需要静态文件服务。
