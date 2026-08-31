# Upstream checkout

Dashi PPT Skill 源码通过 `../scripts/fetch-upstream.ps1` 拉取到本目录下的 `dashi-ppt-skill/`。

该 checkout 固定到提交 `7cb23347f91cda1a5519eafc8c040704e389535a`，仅供本地分析与测试，并由本项目 `.gitignore` 排除。这样可以复现实验，同时避免把完整第三方仓库、字体、图片和构建产物复制进主仓库。

- 上游仓库：https://github.com/chuspeeism/dashi-ppt-skill
- 上游版本：`0.4.11`
- 主体许可证：GNU AGPL-3.0
- 许可证例外：`skills/dashi-ppt/project/packages/html-deck-to-pptx` 为专有组件，仅授权作为 Dashi PPT Skill 的组成部分使用
