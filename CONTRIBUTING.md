# 协作指南

## 新增研究项目

1. 从 main 创建主题分支。
2. 复制 projects/project-template 到新的小写短横线目录。
3. 完成项目 README 的研究对象、锁定版本、范围与验证标准。
4. 更新根 README 的研究索引。
5. 运行 node scripts/validate-repository.mjs。
6. 提交 Pull Request，并附上当前证据和仍未解决的问题。

## 提交约定

提交应小而可解释，推荐使用以下前缀：

- research：新增实验、数据或研究结论；
- feat：新增可运行能力；
- fix：修正实现或错误结论；
- docs：仅文档或索引更新；
- test：测试与验证；
- chore：仓库维护。

示例：research(parser): record streaming benchmark baseline

不要提交密钥、个人数据、来源不明的代码或无法说明用途的大型二进制文件。

## Pull Request 自检

- 研究问题与范围是否清楚；
- 外部来源、版本与许可证是否可追溯；
- 结论是否链接到证据；
- 复现步骤能否在干净环境中执行；
- 根索引与项目状态是否同步；
- Pages 只承担展示，核心证据是否仍保存在可验证位置。
