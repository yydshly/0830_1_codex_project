# Showcase media

本目录只保存研究展厅需要直接播放的最终媒体，不保存临时源帧。

- `solo-skills-real-demo.mp4`：使用上游 `web-demo-video` 与 `measured-ui-callouts` 方法，对当前真实研究网页生成的 32 秒、1920×1080、H.264/yuv420p、无声演示视频。
- `solo-skills-real-demo-poster.jpg`：从最终 MP4 的 21.5 秒处抽取的播放器海报。
- `solo-skills-real-demo-evidence.json`：页面可直接打开的媒体规格、浏览器状态检查点和错误记录副本；原始研究证据同时保存在项目 `artifacts/`。

可复现舞台位于 `../video-stage.html`，渲染脚本位于 `../../scripts/render-real-demo.mjs`，结构化探针与代表帧接触表位于项目 `artifacts/`。640 个 PNG 源帧只在系统临时目录生成，编码和验证后即清理，避免提交大型中间产物。
