# Artifacts

保存理解 Dashi PPT Skill 结论所必需的小型测试报告、结构化数据和截图，并在项目 README 或 research-log 中引用。

不要提交上游完整源码、依赖缓存、导出的重复大文件、用户材料、密钥或隐私数据。上游源码通过固定提交获取脚本复现；生成的 HTML、PDF、PPTX 只有在其直接支撑研究结论且体积合理时才纳入版本控制。

## R-003 GitHub Pages 发布范围

公开站点保留以下有直接证据用途的二进制产物：

- REAL RUN 01：8 页精选 PPTX/PDF、32 页 3+1 审计 PPTX，以及网页逐页查看所需的 PowerPoint 渲染图。
- REAL RUN 02：8 页 Dashi v4 PPTX/PDF、32 页候选 PPTX、8 页直接编程基线 PPTX，以及两条路线各 8 张 PowerPoint 渲染图。

其中最大的单文件是第二轮 32 页候选稿，约 21 MB。它被在线 Web 的下载入口直接引用，用于复核“8 个逻辑页 × 3+1 候选”结论，因此属于有解释的交付证据，不是缓存。

以下内容通过项目 `.gitignore` 排除：上游 checkout、两轮未直接公开的完整中间 HTML 目录、重复 comparison PDF、montage 和对象检查临时文件。机器可读输入、goal、失败记录、导出报告和最终 Web 所需的预览仍保留。
