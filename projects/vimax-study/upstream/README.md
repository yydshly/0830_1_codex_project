# Upstream working copy

运行 `..\scripts\fetch-upstream.ps1` 后，上游 ViMax 固定源码会出现在本目录的 `ViMax/` 中。

`ViMax/` 被项目 `.gitignore` 排除，不会把完整第三方仓库、依赖、模型或生成产物提交到本研究仓库。可重复获取所需的仓库地址和精确 commit 保存在获取脚本与项目 README 中。
