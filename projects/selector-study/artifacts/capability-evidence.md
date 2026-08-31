# Selector 能力证据清单

审查对象：oil-oil/selector commit [`d88e9a6c3c10821a5cc6d87447693d9507a76b35`](https://github.com/oil-oil/selector/commit/d88e9a6c3c10821a5cc6d87447693d9507a76b35)。

本清单只把固定源码中能够定位到实现入口的能力标记为“已实现”。静态实现不替代真实浏览器与 Agent 对照实验。

## 1. 输入与输出

| 能力 | 固定源码证据 | 输出 | 当前判断 |
| --- | --- | --- | --- |
| 元素选择与标注 | [`src/selection.js`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/src/selection.js)、[`src/ui.js`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/src/ui.js) | 选中元素集合、覆盖层和逐元素 instruction | 已实现 |
| 紧凑 AI 提示 | [`src/context.js`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/src/context.js)、[`src/prompt.js`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/src/prompt.js) | 页面、selector、locator、组件、源码、语义位置和必要上下文 | 已实现 |
| Sharingan 复刻报告 | [`src/sharingan.js`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/src/sharingan.js) | 多节 Markdown 报告 | 已实现；真实保真度待验证 |
| Markdown 导出 | [`src/export.js`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/src/export.js) | 选中 DOM 的 Markdown 表达 | 已实现 |
| 截图与图文组合 | [`src/export.js`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/src/export.js) | 裁剪 PNG、文本和图片剪贴板内容 | 已实现；权限和浏览器差异待验证 |
| 离线书签 | [`scripts/build.js`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/scripts/build.js)、[`index.html`](https://github.com/oil-oil/selector/blob/d88e9a6c3c10821a5cc6d87447693d9507a76b35/index.html) | 内嵌 CSS 与 JavaScript 的 bookmarklet | 已实现 |

## 2. 复制内容生成策略

### 稳定 selector

`bestDirectSelector()` 优先测试属性、稳定 ID、`aria-label`/`name`/`title` 和语义 class。候选必须通过 `document.querySelectorAll(selector).length === 1`。普通工具类、哈希、UUID、React 自动 ID 等模式会被稳定性启发式排除。

当没有强直接 selector 时，`buildSelector()` 逐级拼接祖先 segment，并在需要时增加 `:nth-of-type()`。这比无条件复制完整 DOM 路径更紧凑，但它仍是页面当前状态下的启发式定位，不是跨版本稳定性保证。

### 语义 locator

`buildLocator()` 组合显式/隐式 role 与可访问名称。名称来源依次包括 `aria-label`、title、placeholder、alt、name 和可见文本。它适合把“按钮 Save”传递给 AI，但并不完全实现浏览器 Accessibility Tree 或 Playwright 的全部可访问名称算法。

### 框架信息

- React：查找 DOM 元素上的 `__reactFiber*` 或 `__reactInternalInstance*`，遍历 return 链，并读取开发模式 `_debugSource` 或 React 19 `_debugStack`；
- Vue：查找 `__vueParentComponent` 或 `__vue__`，提取组件链、文件、props 和受限 state；
- 这些字段不是跨版本稳定的公共 API，生产构建可能缺失。

## 3. Sharingan 覆盖面

固定版本按元素输出 Identity、Geometry、Replica Root、DOM/Parent Snapshot、Runtime State、Effective Style、CSS 变量与规则、交互态、祖先链、伪元素、字体、动画、媒体、React/Vue Details 和页面 Context。

报告具有长度、节点数和资源大小上限。超过剪贴板阈值时会下载 Markdown 文件，再复制简短提示。这些上限保护响应性，也意味着“完整报告”仍然可能截断。

## 4. 隐私和页面侵入性

源码会对敏感属性名、长 token、JWT、部分 API key 和 Bearer 值进行遮蔽，也限制对象深度、数组数量和单段长度。

仍需实验验证的风险包括：不符合已知格式的个人信息、React props、Vue state、表单运行时 value、完整 URL、兄弟 DOM，以及页面自身 MutationObserver 对批量 `data-ai-id` 属性的反应。因此“全部在本地执行”不能解释为“复制出的报告天然安全”。

## 5. 已确认的实现边界

| 边界 | 固定源码观察 | 影响 |
| --- | --- | --- |
| Shadow DOM | 没有通用 `shadowRoot` 递归 | 主要只能选择 shadow host，无法完整审查内部元素 |
| iframe | 报告尺寸、URL和跨域状态，没有通用 frame 内事件与 DOM 遍历 | iframe 内部目标需要额外注入或扩展权限 |
| 跨域 CSS | bookmarklet 读取 `sheet.cssRules` 失败时只记录 inaccessible | 规则来源和字体可能缺失，但 computed style 仍可读取 |
| 跨域图片 | canvas 受 CORS 污染时跳过内联 | 报告可能只有资源 URL，无法自包含 |
| Canvas/WebGL | 小画布尝试 data URL，大画布主要报告尺寸和 context | 不能理解场景图、shader 或交互对象 |
| 浏览器书签 | 依赖 `javascript:` bookmarklet、剪贴板、屏幕捕获和文件 API | 不同浏览器与内置预览器可能不兼容 |
| 源码映射 | 依赖框架私有 debug 字段 | 生产页面通常弱于本地开发页 |
