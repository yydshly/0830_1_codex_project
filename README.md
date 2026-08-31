# 0830 Research Lab

[![Repository checks](https://github.com/yydshly/0830_1_codex_project/actions/workflows/quality.yml/badge.svg)](https://github.com/yydshly/0830_1_codex_project/actions/workflows/quality.yml)
[![Deploy research site](https://github.com/yydshly/0830_1_codex_project/actions/workflows/pages.yml/badge.svg)](https://github.com/yydshly/0830_1_codex_project/actions/workflows/pages.yml)

这是一个面向多主题、多技术栈的长期研究仓库。它用于把问题、实验、证据、结论和可运行演示放在同一条可追溯链路中，而不是只保存零散代码。

**在线研究站点：** [yydshly.github.io/0830_1_codex_project](https://yydshly.github.io/0830_1_codex_project/)

## 研究索引

根 README 是整个仓库的公开入口。新增研究项目时，在下表登记，并链接到对应项目目录。

<!-- research-index:start -->

| 状态 | 子项目 | 研究对象 | 核心问题 | 当前结论 | 最近更新 |
| --- | --- | --- | --- | --- | --- |
| 已验证 | [R-001 · Sketchbook 柔性翻页研究](projects/sketchbook-page-curl-study/) | [MengTo/sketchbook @ `c1e4778`](https://github.com/MengTo/sketchbook/tree/c1e477814c4c9e204452ebf9b298aa13629cbfc2) | 条带链如何把刚性翻页升级为可拖拽柔性曲面，书籍结构本身还能怎样成为界面？ | 已完成 8 套原创内容场景、18 种可操作书型、六轴 36 个创意方向与 12 个跨轴组合场景；图谱明确区分 LIVE / REMIX / HORIZON。 [研究页](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/) · [在线 Demo](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/demo/) · [技术展厅](https://yydshly.github.io/0830_1_codex_project/projects/sketchbook-page-curl-study/showcase/) | 2026-08-31 |
| 进行中 | [R-004 · ViMax 能力研究](projects/vimax-study/) | [HKUDS/ViMax v1.2.0 @ `05a4894`](https://github.com/HKUDS/ViMax/tree/05a48943878312d88fe5a016c12a9654940ecc43) | ViMax 实际实现了哪些视频生产能力，论文机制与当前代码有何边界？ | ViMax 是生成模型之上的 Agentic 视频生产编排框架；已完成 4 个固定上游案例、8 阶段与 8/8/8/14 镜头的可审阅解释器。真实成片质量、成本与 best-of-k 主流程闭环仍待实测。 [研究页](https://yydshly.github.io/0830_1_codex_project/projects/vimax-study/) · [在线展厅](https://yydshly.github.io/0830_1_codex_project/projects/vimax-study/showcase/) | 2026-08-31 |
| 进行中 | [R-005 · QMReader 能力与架构研究](projects/qmreader-study/) | [joeseesun/qmreader @ `95efab9`](https://github.com/joeseesun/qmreader/tree/95efab925273924963d2fdb474a67890261402e3) | 多源采集、AI 阅读加工与公开资产沉淀如何协作，哪些设计值得复用？ | QMReader 不是通用 RSS SDK，而是“采集 → AI 加工 → 公开资产”的自托管工作台；已完成源码基线、8 类场景与 3 套五阶段演示，真实 AI 质量和规模化表现待验证。 [研究页](https://yydshly.github.io/0830_1_codex_project/projects/qmreader-study/) · [在线展厅](https://yydshly.github.io/0830_1_codex_project/projects/qmreader-study/site/) | 2026-08-31 |

<!-- research-index:end -->

状态统一使用：构想、进行中、已验证、已归档。

## 导航

| 入口 | 用途 |
| --- | --- |
| [项目工作区](projects/) | 查看项目约定并从模板创建独立研究项目 |
| [研究方法](docs/research-guide/) | 统一问题定义、实验、证据和结论的记录方式 |
| [架构决策](docs/decisions/) | 记录影响整个仓库的长期决策及其理由 |
| [协作指南](CONTRIBUTING.md) | 分支、提交、审查和新增项目流程 |

## 仓库结构

    .
    ├── projects/                  # 相互隔离的研究子项目
    │   └── project-template/      # 新项目模板
    ├── docs/
    │   ├── research-guide/        # 研究和证据规范
    │   └── decisions/             # 仓库级决策记录
    ├── assets/                    # 研究站点公共资源
    ├── scripts/                   # 仓库维护与验证脚本
    ├── .github/                   # Issue、PR 与自动化工作流
    └── README.md                  # 总入口与研究索引

每个 projects/<project-name> 都应当能够独立说明研究对象、复现实验并解释结论。不同技术栈的依赖、构建产物和测试留在各自项目内，避免根目录逐渐变成某一种框架的工程。

## 开始一个新研究

1. 复制 projects/project-template，并将目录改为小写短横线命名。
2. 完成新项目 README 中的研究问题、上游来源、基线和验证标准。
3. 在项目 research-log.md 中持续记录实验，不只记录成功结果。
4. 把可复现命令、测试、截图或数据放入项目自己的目录。
5. 更新本页“研究索引”，再提交 Pull Request。

PowerShell 示例：

    Copy-Item -Recurse projects/project-template projects/my-first-study

提交前运行：

    node scripts/validate-repository.mjs

更完整的约定见[研究方法](docs/research-guide/)。

## 研究原则

- **问题先于工具：** 先写明要回答什么，再选择库、框架或数据集。
- **证据先于结论：** 每个结论都指向可复现步骤、测试、数据或演示。
- **成功与失败都记录：** 失败实验能缩小问题空间，也是研究资产。
- **子项目保持独立：** 允许不同语言和构建系统并存，不强制统一技术栈。
- **来源可追溯：** 标注上游仓库、版本、许可证、提交或数据来源。
- **展示不替代复现：** GitHub Pages 用于阅读，仓库内容用于验证。

## 自动化

- Repository checks 会验证基础结构和项目入口是否完整。
- Deploy research site 会在 main 分支更新后构建并发布 GitHub Pages。
- 首次发布前，需要在仓库 Settings → Pages 中将 Source 设为 GitHub Actions。

## 许可证

仓库目前未声明统一开源许可证。各研究对象仍受其原始许可证约束；在选择并添加根许可证前，请不要假设仓库内容可被自由复制或再分发。
