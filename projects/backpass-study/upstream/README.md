# Upstream checkout

Backpass 源码通过 `../scripts/fetch-upstream.ps1` 拉取到本目录下的 `backpass/`。

该 checkout 固定到提交 `d8cbdb68ca20a9ad6626810e0c24a576e43223c7`，仅供本地分析与测试，并由本项目 `.gitignore` 排除。这样可以复现实验，同时避免把完整第三方仓库复制进主仓库。

- 上游仓库：https://github.com/kunchenguid/backpass
- 上游包版本：`0.1.14`
- 上游许可证：MIT License，Copyright (c) 2026 Kun Chen
