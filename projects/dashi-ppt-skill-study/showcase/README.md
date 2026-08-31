# R-003 · Dashi PPT Skill 交互式研究展厅

第 3 个研究子项目的零依赖静态专题页。页面先提供六个示例入口：两轮真实生成实验，以及研究咨询、季度经营复盘、企业培训、项目方案路演四套 36 页模拟场景。真实运行审计台可查看 PowerPoint 渲染、事实指纹、原生对象、截图回退、品牌契约和失败修正；Dashi Compiler 负责解释容量筛选与 3+1 机制。

在线入口：<https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/>

在仓库根目录启动本地服务：

```powershell
python -m http.server 4175 --bind 127.0.0.1 --directory .
```

打开：

```text
http://127.0.0.1:4175/projects/dashi-ppt-skill-study/showcase/
```

页面不加载外部字体、脚本或统计服务。`REAL RUN 01` 与 `REAL RUN 02` 的画面和下载文件来自锁定上游的真实 HTML/PDF/PPTX 运行；第二轮同时包含同输入直接编程基线。Dashi Compiler 的评分和四套业务 Deck 仍是本站模拟。采用评估器用于形成试点建议，不替代采购、法务、安全或跨 Office 质量基准。

快速验收：

```powershell
node projects/dashi-ppt-skill-study/scripts/verify-showcase.mjs
node --test projects/dashi-ppt-skill-study/tests/showcase-contract.test.mjs
```
