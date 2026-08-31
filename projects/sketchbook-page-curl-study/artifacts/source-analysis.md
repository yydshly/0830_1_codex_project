# Fixed-source analysis

研究对象：[MengTo/sketchbook @ `c1e477814c4c9e204452ebf9b298aa13629cbfc2`](https://github.com/MengTo/sketchbook/tree/c1e477814c4c9e204452ebf9b298aa13629cbfc2)

本记录只提取可复现的源码事实。完整上游工作副本由 `scripts/fetch-upstream.ps1` 获取并留在 ignored 目录。

## Inventory

| 项目 | 观察 |
| --- | --- |
| 提交时间 | 2026-08-07T00:36:14+08:00 |
| 文件数 | 24 |
| 工作树体积 | 9,067,884 bytes |
| 运行时 | 一个 `index.html`，无构建步骤、包清单或第三方运行时依赖 |
| 内容资产 | 九组展开页 PNG、装饰 PNG/JPG、三份 WOFF2 |
| 许可证 | 根目录未发现 LICENSE / LICENCE / COPYING 文件 |

## Mechanism facts

| 事实 | 固定源码证据 | 本研究采用方式 |
| --- | --- | --- |
| 翻动页由嵌套竖条组成 | [`index.html#L565-L612`](https://github.com/MengTo/sketchbook/blob/c1e477814c4c9e204452ebf9b298aa13629cbfc2/index.html#L565-L612) | 独立实现可调 8/12/18/24 条带链 |
| 中段曲率是正弦隆起 | [`index.html#L614-L630`](https://github.com/MengTo/sketchbook/blob/c1e477814c4c9e204452ebf9b298aa13629cbfc2/index.html#L614-L630) | 把纯几何函数拆出并单元测试 |
| 释放由进度或速度决定 | [`index.html#L775-L815`](https://github.com/MengTo/sketchbook/blob/c1e477814c4c9e204452ebf9b298aa13629cbfc2/index.html#L775-L815) | 同一模型驱动 rigid/curved 对照 |
| 放大镜克隆书本并独立缩放 | [`index.html#L864-L935`](https://github.com/MengTo/sketchbook/blob/c1e477814c4c9e204452ebf9b298aa13629cbfc2/index.html#L864-L935) | 作为可关闭增强层，不计入翻页本体 |
| reduced-motion 直接结算 | [`index.html#L826-L835`](https://github.com/MengTo/sketchbook/blob/c1e477814c4c9e204452ebf9b298aa13629cbfc2/index.html#L826-L835) | 独立实现相同可访问性意图 |

## Evidence boundaries

- README 将页稿归因于 GPT Image 2，而 `index.html` 顶部运行时代码注释写作 Higgsfield。只能证明表述冲突，不能据此确认真实生成工具。
- README 的 “educational use” 不是标准开源许可证。本研究不复制上游源码、图片或字体。
- “像真实纸张”是感知结论；当前静态分析只能确认算法构造了宽度方向的连续法线变化。帧时、功耗和设备覆盖需要后续实测。
