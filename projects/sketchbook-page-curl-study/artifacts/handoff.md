# R-001 · Delivery handoff

1. **项目与阶段：** `sketchbook-page-curl-study`；Revision 7 浏览器研究范围已验证，公开编号为 `R-001 / 第 1 个研究子项目`。
2. **已完成：** 固定 MengTo/sketchbook 上游 commit `c1e4778` 与许可证边界；独立重建刚性/柔性翻页、拖拽、观察镜、视差、缩放、自动演示与降级；`demo/` 现有 8 套原创内容、18 种可操作书型、12 种非书可变表面、5 种视觉材质、六轴 36 个创意方向和 12 个跨轴组合；`showcase/` 保留原理、证据和采用边界。内容 × 表面 × 材质形成 480 个可寻址组合，不代表 480 个逐一人工验收的成品。
3. **工程证据：** 35/35 项 Node 测试与 repository validator 通过；Revision 7 浏览器证据覆盖 12 项结构计数、五材质可见差异、8 内容上下文、定向拖动、深链刷新、radio 键盘、退出恢复、1440/768/390、reduced-motion、fallback 与无外部运行时资源。
4. **公开索引：** [GitHub 研究目录](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/sketchbook-page-curl-study) · [在线研究页](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/) · [实际 Demo](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/demo/) · [Revision 7 标签剥离深链](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/demo/?rev=7&panel=surfaces&surface=label-peel&material=paper&scene=launch&progress=.55&intro=0) · [技术展厅](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/showcase/)。
5. **仍有效延期：** 真实 iOS/Android 上的 pointer capture 与滚动竞争，以及 24 条带持续 30 秒的帧时、发热和功耗；复杂可选择文本/表单仍需内容快照与独立无障碍层。
6. **来源边界：** 18 种书型、12 种非书表面、五材质、36 个方向、12 个组合、全部页面视觉和交互均为本项目原创独立实现，不代表 MengTo/sketchbook 原生能力；上游锁定版本未发现标准 `LICENSE`，不得据此推定可复制或再分发。织物/金属/portal 分别是 CSS 视觉响应、反射与空间阈值近似，不是物理布料、PBR 或 WebGL 连续穿越。

Revision 7 实现基线为 commit `4e21b998073003a0248b70edc1cda882633bcf8e`：GitHub Actions `Repository checks` run `33371045085` 与 `Deploy research site` run `33371045153` 均成功；研究页、Demo、showcase 和标签剥离深链均 HTTP 200，线上 Chromium 深链复验为 12 surface / 5 material，优惠券可进入 `detached=1`，console/page/request errors=[]。Revision 6 历史基线 `84ae99c` 及旧 run ID 继续保留但不冒充本轮发布。完整证据记录在 `research-log.md` 的 E13/E14；本文件不把 CSS 材质、REMIX/HORIZON 或真机性能冒充已完成。
