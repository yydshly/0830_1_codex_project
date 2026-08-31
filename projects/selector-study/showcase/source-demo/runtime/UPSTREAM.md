# Selector runtime provenance

本目录中的两个运行时文件用于 R-006 Selector 研究子项目的可重复网页演示，不是研究页重新实现的模拟：

| 文件 | SHA-256 |
| --- | --- |
| `selector-0.4.1.js` | `8680cfcbf056f67f92a5ac253ef82b4c43b77827055710d94780c7b11526fb50` |
| `selector-0.4.1.css` | `09d2b376662642f9fdf468fe9cc0fdeead1005b7485e7eea3847a847ad45d0e5` |

- 上游仓库：[oil-oil/selector](https://github.com/oil-oil/selector)
- 锁定提交：[`d88e9a6c3c10821a5cc6d87447693d9507a76b35`](https://github.com/oil-oil/selector/tree/d88e9a6c3c10821a5cc6d87447693d9507a76b35)
- 包版本：`0.4.1`
- 生成命令：在锁定源码根目录执行 `npm run build`
- 原始构建输出：`dist/assets/editor.js` 与 `dist/assets/editor.css`
- 本研究只改了文件名以固定版本；文件内容及字节保持不变。
- 上游 README 在该提交声明 `MIT`，但该提交没有独立 `LICENSE` 文件；本目录保留来源、版本和哈希，进一步复用前仍应核对上游许可文本。

真实性可通过 `node projects/selector-study/tests/verify-source-demo.mjs` 检查；本地上游副本存在时，测试还会逐字节比较两个构建产物。
