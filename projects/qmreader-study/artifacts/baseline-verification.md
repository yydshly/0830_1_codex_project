# QMReader 基线验证

- 验证日期：2026-08-30
- 锁定提交：`95efab925273924963d2fdb474a67890261402e3`

## 环境

| 项目 | 值 |
| --- | --- |
| 操作系统 | Microsoft Windows NT 10.0.26200.0 |
| PowerShell | 7.6.4 |
| Node.js | 22.15.0 |
| npm | 10.9.2 |
| Git | 2.42.0.windows.2 |
| 上游 Docker 基线 | `node:26-slim` |

## 源码身份与静态契约

执行：

```powershell
node --test .\projects\qmreader-study\tests\capability-contract.test.mjs
```

结果：8 项通过，0 项失败。验证内容包括：

- checkout HEAD 与锁定 SHA 一致，许可证为 MIT；
- Feed、RSSHub、Sitemap、WordPress JSON 入口存在；
- fetch worker 与 AI worker 分离；
- 翻译分块、结构保真、覆盖率和内容 hash 逻辑存在；
- Article Agent 使用有限的单篇上下文，未发现向量检索依赖或实现；
- 阅读资产表、公开 RSS/Sitemap 路由存在；
- 出站抓取包含私网 IP 拒绝、DNS 校验和地址固定逻辑。

## 代码规模观察

锁定提交内置 61 个来源，其中 41 个启用、20 个禁用；按类别为 46 个 `article`、11 个 `news`、4 个 `podcast`。`server.js` 中匹配到 79 个 Express 路由注册。

| 文件 | 行数 |
| --- | ---: |
| `public/app.js` | 10,222 |
| `lib/store.js` | 3,947 |
| `server.js` | 3,512 |
| `lib/fetcher.js` | 2,876 |
| `lib/deepseek.js` | 1,577 |
| `lib/background-jobs.js` | 468 |

这些数字用于判断维护复杂度，不等同于代码质量评分。

## 安装与语法检查

`npm ci` 成功，安装 103 个包。下列 8 个上游入口执行 `node --check` 均通过：

- `server.js`
- `lib/background-jobs.js`
- `lib/deepseek.js`
- `lib/fetcher.js`
- `lib/sources.js`
- `lib/store.js`
- `scripts/refresh-worker.js`
- `public/app.js`

## 上游测试

执行：

```powershell
npm test
```

完整并行测试观察到：

```text
tests 71
pass 66
fail 5
```

失败构成：

1. 四个测试文件的 `after` 清理钩子在删除临时 `qmreader.sqlite` 时返回 Windows `EBUSY`：`admin-submissions`、`background-jobs`、`fetcher`、`translation`。
2. `admin-submissions` 中一个服务器集成测试在完整测试并发运行时触发 10 秒启动超时。

随后单独执行 `node --test test/admin-submissions.test.js`：6 个功能测试全部通过，服务器集成测试约 1.7 秒完成；文件最终仍因同一 SQLite `EBUSY` 清理问题失败。因此：

- 服务器启动超时在隔离复跑中未复现，当前只能标记为并行环境下的时序或资源竞争现象；
- SQLite 文件未在测试结束前释放是稳定可复现的 Windows 兼容性问题；
- 不能将上游测试描述为“全部通过”，也不能据此断言对应功能逻辑失败。

测试期间 Node 还会提示 `node:sqlite` 仍是实验特性。上游 Dockerfile 使用 Node 26，但 `package.json` 未声明 `engines`。

## 依赖审计

执行 `npm audit --json`，结果为 3 个依赖告警：

| 依赖 | 严重度 | 直接依赖 | 可用修复 |
| --- | --- | --- | --- |
| `undici` | high | 是 | 是 |
| `dompurify` | moderate | 是 | 是 |
| `body-parser` | low | 否，由依赖树引入 | 是 |

本研究不修改上游锁文件，因此没有自动执行 `npm audit fix`。采用或部署前应升级依赖并重新执行功能与安全回归。

## 结论边界

本轮证据支持源码结构、数据模型和本地非模型测试层面的能力结论。没有配置真实模型密钥，也没有对生产站点进行压力、安全或内容质量测试，因此尚不能证明：

- 抓取 61 个来源时的长期成功率；
- 翻译和改写的事实一致性与实际成本；
- 多用户并发下的可靠性；
- 生产部署的完整安全性。
