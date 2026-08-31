# R-001 · Delivery handoff

1. **项目与阶段：** `sketchbook-page-curl-study`；Revision 6 浏览器研究范围已验证，公开编号为 `R-001 / 第 1 个研究子项目`。
2. **已完成：** 固定 MengTo/sketchbook 上游 commit `c1e4778` 与许可证边界；独立重建刚性/柔性翻页、拖拽、观察镜、视差、缩放、自动演示与降级；`demo/` 现有 8 套原创场景、18 种可操作书型、六轴 36 个创意方向和 12 个跨轴组合；`showcase/` 保留原理、证据和采用边界。
3. **工程证据：** 26/26 项 Node 测试通过，repository validator 通过；上游 ignored 工作副本干净且精确锁定；Revision 6 浏览器证据覆盖 1440/768/390、键盘、reduced-motion、fallback、深链与无外部运行时资源。
4. **公开索引：** [GitHub 研究目录](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/sketchbook-page-curl-study) · [在线研究页](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/) · [实际 Demo](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/demo/) · [技术展厅](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/showcase/)。
5. **仍有效延期：** 真实 iOS/Android 上的 pointer capture 与滚动竞争，以及 24 条带持续 30 秒的帧时、发热和功耗；复杂可选择文本/表单仍需内容快照与独立无障碍层。
6. **来源边界：** 18 种书型、36 个方向、12 个组合、全部页面视觉和交互均为本项目原创独立实现，不代表 MengTo/sketchbook 原生能力；上游锁定版本未发现标准 `LICENSE`，不得据此推定可复制或再分发。

发布基线为 commit `84ae99c`：GitHub Actions `Repository checks` run `33366112690` 与 `Deploy research site` run `33366112730` 均成功；GitHub 研究目录、Pages 研究页、Demo、showcase 和虹膜快门深链均返回 HTTP 200，线上 Chromium 深链复验无 console/page/request 错误。完整证据记录在 `research-log.md` 的 E13；本文件不把 REMIX/HORIZON 或真机性能冒充已完成。
