# Selector v0.4.1 真实运行输出

- 日期：2026-08-31
- 浏览器：Headless Chrome 151 / Windows
- 页面：`http://127.0.0.1:4186/source-demo/`
- 上游：`oil-oil/selector` v0.4.1，commit `d88e9a6c3c10821a5cc6d87447693d9507a76b35`
- 操作：启动锁定构建 → 点击“创建活动” → 添加 instruction → 点击“复制提示词”
- 结果：259 字符、9 行；由源库运行时生成并由安全 fixture 的剪贴板镜像层捕获

```text
Page: http://127.0.0.1:4186/source-demo/

1. button "创建活动" <button>
   selector: [data-testid="create-campaign"]
   locator: button "创建活动"
   inside: header "活动总览"
   text: "＋创建活动"
   data-testid: create-campaign
   instruction: 提升为主操作，保留 data-testid，并加强键盘焦点。
```

这个输出直接证明锁定运行时在普通 Light DOM fixture 中能完成目标选择、稳定 selector、语义 locator、容器上下文、文本、测试属性和逐元素 instruction 的编译；它不证明 React/Vue 源码追踪、跨浏览器一致性或下游 Agent 修改成功率。
