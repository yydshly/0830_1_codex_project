# Upstream checkout

QMReader 源码通过 `../scripts/fetch-upstream.ps1` 拉取到本目录下的 `qmreader/`。

该 checkout 固定到提交 `95efab925273924963d2fdb474a67890261402e3`，仅供本地只读分析与测试，并由项目 `.gitignore` 排除。这样可以复现实验，同时避免把完整第三方仓库复制进主仓库。

上游仓库：https://github.com/joeseesun/qmreader

上游许可证：MIT License，Copyright (c) 2026 向阳乔木。
