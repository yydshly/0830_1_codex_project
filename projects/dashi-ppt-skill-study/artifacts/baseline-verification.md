# 首轮基线验证

## 结论

锁定提交已成功获取，修正研究测试自身的跨行匹配问题后，能力契约测试 8/8 通过。静态证据支持以下基线结论：

- 上游 HEAD 为 `7cb23347f91cda1a5519eafc8c040704e389535a`，运行时版本为 `0.4.11`。
- 主体许可证为 GNU AGPL-3.0；`html-deck-to-pptx` 导出子包使用专有许可证。
- `layout-manifest.json` 实际包含 12 个主题、1020 个版式和 8576 个控件。
- schema v2、canonical content、3 个模板候选、1 个 bespoke 候选和 `contentMap` 契约存在。
- 版式分配实现了 beam search、固定 seed、结构多样性评分和重复惩罚。
- 浏览器产物包含就地文字编辑、本地草稿、服务端自动保存和页面拖拽相关实现。
- PPTX 导出从实时 DOM 采集；当前分发的核心实现由专有压缩构建产物提供。
- 预览服务默认监听配置可为 `0.0.0.0`，敏感材料实验需要显式绑定 loopback。

这轮验证没有安装上游运行时依赖，也没有生成真实 HTML、PDF 或 PPTX。因此尚不能证明视觉质量、浏览器持久化端到端行为、PPTX 原生可编辑比例、跨 Office 兼容性、耗时或 Token 成本。

## 环境

| 项目 | 值 |
| --- | --- |
| 日期 | 2026-08-30 |
| 操作系统 | Windows |
| PowerShell | 7.6.4 |
| Git | 2.42.0.windows.2 |
| Node.js | 22.15.0 |
| npm | 10.9.2 |
| 上游版本 | 0.4.11 |
| 锁定提交 | `7cb23347f91cda1a5519eafc8c040704e389535a` |

## 复现命令

在仓库根目录执行：

```powershell
& .\projects\dashi-ppt-skill-study\scripts\fetch-upstream.ps1
node --test .\projects\dashi-ppt-skill-study\tests\capability-contract.test.mjs
node .\scripts\validate-repository.mjs
```

## 结果

| 检查 | 结果 | 说明 |
| --- | --- | --- |
| 固定提交获取 | 通过 | HEAD 与锁定 SHA 完全一致 |
| 版本与许可证边界 | 通过 | 0.4.11；AGPL 主体；专有导出子包 |
| 版式资产复算 | 通过 | 12 / 1020 / 8576 |
| schema v2 与四方案契约 | 通过 | canonical content、template、bespoke、`contentMap` 均存在 |
| 确定性工作流命令 | 通过 | scaffold、校验、渲染、预览、PPTX/PDF 导出脚本齐全 |
| 版式多样性分配 | 通过 | beam、复用惩罚、重复再平衡源码契约存在 |
| 浏览器编辑与保存 | 通过 | contenteditable、IndexedDB、localStorage、保存 API 与拖拽实现存在 |
| DOM 驱动 PPTX 导出 | 通过 | 文档与入口代码匹配；核心实现为专有构建产物 |
| 默认监听风险 | 通过 | 默认 `0.0.0.0` 与 loopback 配置入口均存在 |

最终契约测试结果：8 项通过、0 项失败。`git diff --check` 未报告空白错误。

仓库级 `node scripts/validate-repository.mjs` 已执行，但当前工作区中一个与本研究无关的空目录 `projects/selector-study` 缺少 `README.md` 和 `index.md`，因此仓库结构验证失败。Dashi PPT Skill 研究项目自身的必需入口文件均存在；本次没有删除或补写该并行目录。

## 失败实验记录

首次执行为 7/8 通过。失败项检查专有许可证中的 `SOLELY as an integrated component`，测试正则没有允许源文件在 `integrated` 与 `component` 之间换行。许可证原文实际完整存在，属于研究测试误报。

将匹配修正为允许空白换行后复跑，8/8 通过。该修正没有放宽对关键许可语义的要求。

仓库结构验证另一次失败来自工作区已有的 `projects/selector-study` 空目录。它不属于本研究项目，也未出现在本次变更的 Git 状态中，因此只记录阻塞，不对其执行破坏性清理或越权补写。

## 下一步

1. 安装锁定上游的项目依赖，使用非敏感固定输入生成约 10 页 HTML。
2. 固定主题和 seed 重复生成，比较 goal JSON、版式选择与最终 HTML。
3. 在 loopback 监听下验证文字、媒体、控件和页面顺序编辑的持久化。
4. 导出 PDF/PPTX，统计文字、形状、图表、图片和截图回退对象。
5. 记录时间、Token、人工返工量，并与当前通用演示生成方案对照。
