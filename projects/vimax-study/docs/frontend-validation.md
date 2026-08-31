# ViMax 研究展厅 · 浏览器验收

## Revision 1 已完成基线验收

2026-08-30 在本地静态服务完成验收，最终交付地址为 `http://127.0.0.1:4185/`。页面在 1440、768、390 像素三档视口均正常渲染，无错误遮罩、控制台错误或横向溢出；明暗主题、键盘导航、延迟加载、媒体错误回退和 reduced-motion 均通过。

上述结论只覆盖 2026-08-30 的 Revision 1 页面基线，不自动延伸到后续新增功能。

## 真实案例实验室 Revision 2 · 已完成验收

**状态：** 2026-08-31 已完成内容复核、静态测试、真实浏览器交互和三档视口验收。这里的“通过”只证明案例解释器与证据语义成立，不代表四个案例已经调用外部模型生成媒体。

### 已可从静态文件确认的事实

- `showcase/index.html` 在 `#scenarios` 中定义了“真实案例实验室”、三类证据状态说明、案例选项卡、阶段产物、镜头板和边界说明；
- `showcase/case-data.js` 保存 4 组案例数据：README 的 Idea2Video 猫狗创意、仓库默认 Script2Video 校园篮球剧本，以及 Benchmark A/B 的 8 镜头咖啡旅程和 14 镜头餐厅厨房 fixture；
- 每个案例数据都区分上游输入、按源码机制推导的教学产物和尚未实跑的视频效果；
- `showcase/app.js` 包含案例切换、生产阶段切换、镜头检查器、“孤立生成 / ViMax 参考链”切换与方向键 roving focus 逻辑；
- Novel2Video 只在边界说明中呈现：代码存在，但固定上游缺少可映射的真实小说输入与总成片，因此未伪造第五个“实跑案例”。

### 本轮浏览器验收结果

| 范围 | 结果 | 浏览器证据 |
| --- | --- | --- |
| 初始渲染 | 通过 | 默认猫狗案例渲染 8 阶段、8 镜头；原始 idea、requirement、style 均可读 |
| 四案例切换 | 通过 | Enter 与左右方向键依次切换；篮球 8 镜头、Mara 8 镜头、厨房 14 镜头，标题和固定来源同步更新 |
| 生产阶段 | 通过 | End 从厨房首阶段到 `STEP 08 / 竞赛成片`，产物为尚未实跑的 `final_video.mp4` 下游可能产物 |
| 镜头与参考链 | 通过 | End 到厨房 `SHOT 14`；Enter 切换“孤立生成”，说明同步改为无共享参考；Benchmark 显示“假设接入 ViMax” |
| 证据语义 | 通过 | 源码复核确认猫狗/篮球教学拆镜、Benchmark fixture 和未配对成片三类状态未混用 |
| 响应式 | 通过 | 1440×1000、768×1024、390×844 的 `scrollWidth - clientWidth` 均为 0；14 镜头仍可达 |
| 主题与可访问性 | 通过 | 明暗主题均可读；tablist、toolbar、镜头按钮保持 roving focus 与 ARIA 选中状态；reduced-motion 规则保留 |
| 错误检查 | 通过 | agent-browser `errors` 为空，无 null 访问或页面错误遮罩 |

### Revision 2 视觉证据

- [`showcase-case-lab.png`](../artifacts/showcase-case-lab.png)：1440×1200、明色、Idea2Video 猫狗案例、阶段 01、镜头 01 和 ViMax 参考链；截图时间 2026-08-31；
- [`showcase-desktop.png`](../artifacts/showcase-desktop.png)：1440×1000 明色完整页面；
- [`showcase-tablet.png`](../artifacts/showcase-tablet.png)：768×1024 明色案例区域；
- [`showcase-mobile.png`](../artifacts/showcase-mobile.png)：390×844 明色完整页面；
- [`showcase-mobile-viewport.png`](../artifacts/showcase-mobile-viewport.png)：390×844 案例区域细节。

验收环境沿用 agent-browser 0.27.0、HeadlessChrome 151.0.0.0、Windows 10 x64；页面由本地 `http://127.0.0.1:4185/` 提供。

## Revision 1 验收环境

| 项目 | 值 |
| --- | --- |
| 页面类型 | 零依赖静态 HTML / CSS / JavaScript |
| 服务 | Python 3.10 `http.server`，127.0.0.1:4185 |
| 自动化 | agent-browser 0.27.0 |
| 浏览器 | HeadlessChrome 151.0.0.0，Windows 10 x64 |
| 上游证据版本 | HKUDS/ViMax v1.2.0，commit `05a48943878312d88fe5a016c12a9654940ecc43` |

## Revision 1 验收结果

| 范围 | 结果 | 证据 |
| --- | --- | --- |
| 页面完整性 | 通过 | 正文 3840 字符；7 个主 section；H1 正常；无框架错误遮罩 |
| 能力筛选 | 通过 | “视觉”显示 3 项；“运行”显示 2 项；Enter 可触发 |
| 场景切换 | 通过 | ArrowRight 从“内容创作者”切至“AI 研究者”，对应面板同步更新 |
| 实现流程 | 通过 | End 从首节点切至“06 装配与恢复”，焦点和面板同步 |
| 官方演示 | 通过 | 点击前视频无 `src`；点击 A 后 `readyState=4`；切换 B 后 URL 和标题更新 |
| 回退 | 通过 | 图像与视频 `error` 事件均隐藏失败媒体并显示文字回退 |
| 主题 | 通过 | 明暗主题双向可切；当前选择持久化到 localStorage |
| 响应式 | 通过 | 1440×1000、768×1024、390×844 均无横向溢出；390px 可见按钮最小边不低于 32px |
| reduced-motion | 通过 | 模拟后 `matchMedia` 命中，平滑滚动关闭，卡片过渡近 0 秒 |
| 错误检查 | 通过 | agent-browser `errors` 与 `console` 均为空 |
| 本地性能 | 通过 | TTFB 2.8ms；FCP 40ms；LCP 40ms（H1）；CLS 0 |

本地性能数据只说明静态页面自身开销，不代表 GitHub 附件视频或其他公网资源的加载表现。

## Revision 1 视觉证据

- [`showcase-desktop.png`](../artifacts/showcase-desktop.png)：1440px 明色完整页面；
- [`showcase-tablet.png`](../artifacts/showcase-tablet.png)：768px 暗色、筛选与演示已激活状态；
- [`showcase-mobile.png`](../artifacts/showcase-mobile.png)：390px 明色完整页面；
- [`showcase-mobile-viewport.png`](../artifacts/showcase-mobile-viewport.png)：390px 首屏可读性和触控目标。

## Revision 1 验收中修正

首轮整页截图发现上游 Web UI 证据图使用原生懒加载，截图工具不会自动滚动到该区域，因此出现空框。已将这张关键证据图改为页面加载时获取；三个体积更大的官方视频仍保持用户点击后才加载。复验时截图自然宽度为 3002px，错误回退仍然有效。

## Revision 1 复现命令

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve-showcase.ps1
node .\tests\verify-showcase.mjs
node .\tests\verify-capabilities.mjs
```
