# 首轮基线验证

## 结论

锁定提交可以被精确获取，MIT 许可证和 26 个技能目录得到确认，项目结构契约 4/4 通过。5 个 Python 文件和 Threads 发布脚本可以完成语法解析；但 Notion 归档脚本在没有环境变量时不是受控地报告缺少 Token，而是在模块初始化阶段抛出 `NameError`。因此，当前证据支持“可作为研究对象稳定复现”，不支持“随附代码均可直接投入使用”。

## 环境

| 项目 | 值 |
| --- | --- |
| 日期 | 2026-08-30 |
| 操作系统 | Windows |
| PowerShell | 7.6.4 |
| Git | 2.42.0.windows.2 |
| Node.js | 22.15.0 |
| Python | 3.10.11 |
| 上游提交 | `d5789f592af17980054052fc7c05fe8a8e46be79` |

## 执行与观察

| 检查 | 命令或方法 | 结果 |
| --- | --- | --- |
| 固定提交获取 | `scripts/fetch-upstream.ps1` | 通过，HEAD 与锁定 SHA 一致 |
| 上游身份与许可证 | `tests/skill-structure.test.mjs` | 通过，MIT License，版权人为 Ahn Taehyun |
| 技能 frontmatter | 同上 | 通过，26/26 均有合法 `name` 与非空 `description` |
| 随附代码文件基线 | 同上 | 通过，共 9 个 `.py`、`.sh`、`.mjs` 文件 |
| Node.js 语法 | `node --check skills/threads-reply/scripts/publish-thread.mjs` | 通过 |
| Python 语法 | 对 5 个 `.py` 文件运行 `python -m py_compile` | 5/5 通过 |
| Notion 无凭证启动 | 清除 `NOTION_TOKEN` 后启动 `notion_archive.py` | 失败，退出码 1，抛出 `NameError` |
| POSIX Shell 运行 | 当前 Windows 环境 | 未执行，留待受控 POSIX 环境验证 |

结构契约测试摘要：4 个测试通过，0 个失败。

## 已确认缺陷：Notion 脚本初始化顺序

`skills/notion-delete/notion_archive.py` 在模块顶层初始化 `NOTION_TOKEN` 时调用 `_load_from_env_files()`，但该函数定义出现在调用之后。当 `NOTION_TOKEN` 未设置时，短路条件不成立，Python 会在到达函数定义前抛出：

```text
NameError: name '_load_from_env_files' is not defined
```

`py_compile` 只能证明语法可解析，无法发现这种运行时名称解析问题。这一失败将作为后续脚本测试设计的基线案例保留，不在本研究项目中直接修改上游源码。

## 验证边界

- 除 GitHub 获取上游源码外，没有调用外部业务 API。
- 没有提供或读取真实 Token、邮件、消息、Notion 页面或用户数据。
- 没有执行发送、发布、删除、SSH 卸载、模型回退或定时任务。
- 当前结果不证明 macOS、Claude 专用 Agent、Orca 或韩国平台集成能够在本机运行。

## 下一步

1. 为全部技能建立平台、客户端、外部依赖、秘密和副作用清单。
2. 在隔离环境补充 3 个 Shell 脚本的解析和参数边界测试。
3. 为 `meeting-summary`、`measured-ui-callouts`、`web-demo-video` 建立固定输入与无技能对照。
4. 将缺少凭证、部分失败、重复执行和人工拒绝纳入通用 Skill 测试模板。
