# Selector 基线验证

验证对象：oil-oil/selector commit [`d88e9a6c3c10821a5cc6d87447693d9507a76b35`](https://github.com/oil-oil/selector/commit/d88e9a6c3c10821a5cc6d87447693d9507a76b35)，包版本 `0.4.1`。

## 环境

- 日期：2026-08-30
- 平台：Windows / PowerShell
- Git：2.42.0.windows.2
- Node.js：22.15.0
- npm：10.9.2

## 执行

```powershell
powershell -ExecutionPolicy Bypass -File .\projects\selector-study\scripts\fetch-upstream.ps1
node .\projects\selector-study\tests\verify-capabilities.mjs

Push-Location .\projects\selector-study\upstream\selector
npm ci
npm run check
Pop-Location
```

## 原始结果摘要

| 检查 | 结果 | 观察 |
| --- | --- | --- |
| 上游 HEAD | 通过 | 与锁定 SHA 完全一致 |
| 包身份 | 通过 | `selector@0.4.1`，`private: true` |
| 安装 | 通过 | npm 报告 audited 1 package；上游没有 dependencies/devDependencies |
| 上游 check | 通过 | 实际执行 `npm run build` |
| 构建 | 通过 | 生成 `dist/index.html`、CSS、Base64 payload 与 `editor.js` |
| 静态能力契约 | 通过 | 选择、上下文、Sharingan、Markdown、截图和 SPA 入口存在 |
| 自动化浏览器测试 | 未发现 | 主分支 workflow 只构建并部署 GitHub Pages |
| 许可证文件 | 未发现 | README 声明 MIT，但固定提交没有独立 `LICENSE` 文件 |

## 判断

H1 通过：源码身份和构建可以重复验证。H2/H3 目前只能确认实现入口和策略存在，不能仅凭静态代码证明所有页面行为正确。浏览器兼容性、隐私、性能和 Agent 效果继续保留为未验证结论。
