const root = document.documentElement;

const pipelineSteps = [
  { owner: "人 + Agent", title: "材料输入", summary: "把文档、研究记录、数据和品牌要求交给宿主 Agent，并声明汇报目标与受众。", input: "文档 / 数据 / 图片 / 目标", process: "识别材料边界与任务约束", output: "可供规划的上下文", evidence: "Skill 工作流与内容输入约定" },
  { owner: "Agent layer", title: "内容规划", summary: "宿主 Agent 抽取事实、搭建故事弧、决定页面职责，并生成统一的 Canonical JSON。", input: "上下文 + 汇报目标", process: "提纲 / 论证 / 页面角色", output: "Canonical JSON", evidence: "canonical-content 与内容规划约定" },
  { owner: "Agent + Layout engine", title: "布局查询", summary: "Agent 把内容需要转换成查询条件；引擎用硬约束排除不合格布局，再用软约束排序。", input: "页面意图 + 内容槽位", process: "硬约束过滤 / 软约束评分", output: "候选布局列表", evidence: "layout-query 与 query-layouts" },
  { owner: "Agent layer", title: "全局分配", summary: "不只逐页挑模板，而是跨整份 Deck 调整节奏、重复度、密度与视觉差异。", input: "候选布局 + 全局叙事", process: "跨页去重与节奏控制", output: "页面—布局映射", evidence: "deck 级规划与 layout assignment" },
  { owner: "Deterministic layer", title: "HTML 渲染", summary: "React 服务端渲染把结构化内容、控件和主题编译成浏览器可运行的 HTML 页面。", input: "Canonical JSON + 布局 + 主题", process: "React SSR / runtime 注入", output: "可预览的 HTML Deck", evidence: "render-deck 与 HTML runtime" },
  { owner: "Human-in-the-loop", title: "浏览器编辑", summary: "用户在本地浏览器调整文字、强调和页面状态，编辑结果进入自动保存机制。", input: "HTML Deck", process: "所见即所得编辑 / autosave", output: "人工修订后的 Deck", evidence: "editor runtime 与 autosave 相关代码" },
  { owner: "Deterministic layer", title: "导出验证", summary: "浏览器自动化进入 PDF / PPTX 等导出通道，并执行结构或文件级检查，形成交付物。", input: "最终 Deck + 格式要求", process: "Playwright 导出 / validators", output: "HTML / PDF / PPTX", evidence: "export scripts 与 validation scripts" }
];

const audiences = {
  decision: { number: "01", label: "PRIMARY AUDIENCE", title: "技术决策者", goal: "判断是否值得进入团队工具链，而不是只看一份漂亮 Demo。", value: "快速理解架构、依赖、许可边界与集成成本。", risk: "模板质量、导出保真和 Agent 成本仍需用自己的材料复测。", use: "以 10 份真实汇报做沙盒试点，建立人工基线和验收门槛。" },
  management: { number: "02", label: "BUSINESS OWNER", title: "管理层", goal: "缩短从材料到决策汇报的周期，同时保持可审阅性。", value: "把重复排版时间转移到论点、数据和决策质量。", risk: "“生成更快”可能放大未经核验的结论。", use: "用于内部经营复盘和方案初稿，保留负责人终审。" },
  research: { number: "03", label: "KNOWLEDGE WORK", title: "研究 / 咨询", goal: "把长文档、访谈和数据快速重组为结构化汇报。", value: "叙事骨架、页面角色和引用体系可以重复使用。", risk: "来源丢失与过度总结会伤害可信度。", use: "扩展证据字段，并把每页结论链接到原始材料。" },
  design: { number: "04", label: "EXPERIENCE QUALITY", title: "产品 / 设计", goal: "建立可维护、可测试的演示设计系统，而非手工复制模板。", value: "主题、布局与控件可以成为跨团队资产。", risk: "通用布局库未必匹配独特品牌语言。", use: "让设计师维护品牌组件，Agent 只在允许的组合中生产。" },
  agent: { number: "05", label: "BUILDER", title: "Agent 开发者", goal: "给 Codex / Claude Code 增加可执行的演示文稿交付能力。", value: "获得从结构化内容到浏览器编辑和多格式导出的完整范式。", risk: "运行时、Playwright、导出器与宿主 Agent 形成复杂依赖。", use: "把 Dashi 当参考实现，逐层替换为自己的连接器、模型和验证器。" },
  education: { number: "06", label: "LEARNING SYSTEM", title: "教育 / 培训", goal: "批量生产章节统一、可持续更新的课程与讲义。", value: "同一知识内容可以派生教师版、学员版和复习版。", risk: "图像版权、事实时效与无障碍需求容易被忽略。", use: "连接课程知识库，增加版权、阅读顺序和学习目标检查。" },
  compliance: { number: "07", label: "RISK CONTROL", title: "合规 / 安全", goal: "在可控环境中处理敏感材料并留住生产边界。", value: "本地优先减少材料进入外部 PPT SaaS 的必要性。", risk: "宿主模型、监听地址、许可与生成记录仍需单独治理。", use: "限制为 loopback、建立版本留痕，并让法务审查 AGPL 与专有导出器。" }
};

const labPresets = {
  research: { title: "进入哪个 Agent 工具层？", items: 4, numbers: 2, media: false },
  metrics: { title: "增长质量由哪四个指标决定？", items: 5, numbers: 4, media: false },
  media: { title: "园区能效方案如何形成闭环？", items: 3, numbers: 1, media: true }
};

const labLayouts = [
  { id: "summary-3", rule: "条目 2—4 · 数值 ≤ 2 · 无媒体", evaluate: ({ items, numbers, media }) => items < 2 || items > 4 ? "仅容纳 2—4 个条目" : numbers > 2 ? "数值字段超过 2 个" : media ? "没有主媒体槽" : "" },
  { id: "metrics-4", rule: "条目 3—5 · 数值 ≥ 2", evaluate: ({ items, numbers }) => items < 3 || items > 5 ? "仅容纳 3—5 个条目" : numbers < 2 ? "至少需要 2 个数值" : "" },
  { id: "evidence-split", rule: "条目 ≤ 4 · 至少 1 个数值", evaluate: ({ items, numbers }) => items > 4 ? "最多容纳 4 个条目" : numbers < 1 ? "缺少证据或数值槽" : "" },
  { id: "dense-grid", rule: "条目 5—8 · 密集网格", evaluate: ({ items }) => items < 5 ? "需要至少 5 个条目" : items > 8 ? "条目超过 8 个" : "" },
  { id: "media-focus", rule: "需要主媒体 · 条目 ≤ 5", evaluate: ({ items, media }) => !media ? "需要主媒体" : items > 5 ? "媒体版最多 5 个条目" : "" }
];

const labVariants = {
  "template-a": { label: "TEMPLATE A", className: "template-a" },
  "template-b": { label: "TEMPLATE B", className: "template-b" },
  "template-c": { label: "TEMPLATE C", className: "template-c" },
  bespoke: { label: "BESPOKE +1", className: "bespoke" }
};

const realRunPages = [
  { title: "Dashi PPT Skill", hash: "d546832ab0c4", required: 0, variants: [["theme07_page002", "template", 13, 5, 6], ["theme07_page003", "template", 6, 4, 2], ["theme07_page001", "template", 7, 3, 6], ["hero", "bespoke", 6, 5, 0]] },
  { title: "差异不在生成，而在内容与版式解耦", hash: "f7e27340571c", required: 3, variants: [["theme07_page026", "template", 16, 41, 2], ["theme07_page015", "template", 21, 47, 4], ["theme07_page071", "template", 18, 47, 3], ["editorial", "bespoke", 14, 7, 1]] },
  { title: "一份内容依次经过五道确定性关卡", hash: "a96a6afb0bcf", required: 5, variants: [["theme07_page013", "template", 9, 41, 2], ["theme07_page055", "template", 20, 48, 6], ["theme07_page007", "template", 24, 45, 5], ["split", "bespoke", 21, 15, 0]] },
  { title: "版式库规模可量化，但规模不是质量结论", hash: "3f941ea76c10", required: 4, variants: [["theme07_page035", "template", 33, 47, 4], ["theme07_page052", "template", 20, 42, 3], ["theme07_page027", "template", 32, 42, 4], ["matrix", "bespoke", 15, 5, 4]] },
  { title: "HTML 是主产物，PPTX 是分层映射", hash: "d371004e3a6a", required: 3, variants: [["theme07_page071", "template", 18, 47, 3], ["theme07_page007", "template", 18, 45, 3], ["theme07_page013", "template", 21, 44, 4], ["editorial", "bespoke", 15, 7, 1]] },
  { title: "采用前要正视四条工程边界", hash: "43b357b7ede4", required: 4, variants: [["theme07_page055", "template", 18, 47, 3], ["theme07_page007", "template", 19, 45, 4], ["theme07_page015", "template", 22, 47, 4], ["comparison", "bespoke", 15, 13, 0]] },
  { title: "最小试点先验证四项可量化指标", hash: "6334a5e77716", required: 4, variants: [["theme07_page015", "template", 22, 47, 4], ["theme07_page013", "template", 26, 45, 5], ["theme07_page026", "template", 20, 41, 2], ["process", "bespoke", 15, 13, 0]] },
  { title: "建议：以研究汇报为首个试点", hash: "3bc2a2091ad7", required: 3, variants: [["theme07_page007", "template", 19, 45, 3], ["theme07_page071", "template", 18, 47, 3], ["theme07_page055", "template", 19, 48, 6], ["split", "bespoke", 17, 11, 0]] }
];

const realRun02Pages = [
  { name: "封面", title: "园区能源协同优化试点", role: "建立场景、周期与决策语境" },
  { name: "现状", title: "峰值与设备孤岛正在放大能源成本", role: "用 28.6 GWh、8.4 MW 与三类资源界定问题" },
  { name: "闭环", title: "统一数据与控制闭环是试点的核心", role: "解释采集、预测、优化、执行与复盘" },
  { name: "负荷", title: "两类负荷贡献了 73% 的用电基线", role: "用五类负荷图表锁定优化优先级" },
  { name: "经济性", title: "72 万元试点换取三项可验证收益", role: "把节电、削峰与回收期写成通过门槛" },
  { name: "路线", title: "12 周按四个决策门推进", role: "用基线、影子运行、受控执行和对照评估降风险" },
  { name: "治理", title: "三条护栏让试点不干扰生产", role: "明确权限、回退、核算与最终控制权" },
  { name: "决策", title: "建议批准 72 万元受控试点", role: "给出负责人、本次批准事项与下一检查点" }
];

const realRun02Routes = {
  dashi: {
    label: "DASHI SELECTED V4",
    verdict: "候选生产力更强，品牌精度受主题包约束",
    brand: "近似：theme03 电蓝/酸绿",
    objects: "115 文字 · 78 形状 · 10 图像",
    time: "scaffold 2.1s · render 3.8s · v4 PPTX 8.1s",
    note: "这条路线的价值不是一次给出唯一答案，而是把同一内容生成 3+1 候选并留下可审计产物。",
    edit: page => page === 4 ? "图表以 SVG/图像回退；10 个标签转为文字" : "文字与基础形状原生；主题 SVG 回退",
    image: page => `../artifacts/real-run-02-brand-media/dashi-brand-media-selected-v4/slide-${page}.png`
  },
  direct: {
    label: "DIRECT PROGRAMMATIC BASELINE",
    verdict: "品牌与对象控制更精确，但只有一条设计路线",
    brand: "精确：navy / cyan / lime 请求色",
    objects: "117 文字 · 34 形状 · 1 图像 · 1 chart",
    time: "8 页单路线 build 3.9s",
    note: "这条路线适合品牌严格、对象类型明确的一次性高价值汇报；候选检索、全稿分配和替代路线需要另行编程。",
    edit: page => page === 4 ? "原生可编辑柱状图；文字、形状保持原生" : page === 1 ? "1 张有来源的生成媒体；其余对象原生" : "文字与形状原生；无主题 SVG 回退",
    image: page => `../artifacts/real-run-02-brand-media/direct-programmatic-baseline/slide-${page}.png`
  }
};

const scenarioDecks = {
  research: {
    label: "研究咨询", type: "RESEARCH / CONSULTING", name: "企业级 AI Agent 工具链进入策略", title: "AI Agent 工具链进入策略", railTitle: "进入策略", audience: "CTO、战略与产品负责人", outcome: "从分散材料形成有证据的进入建议", capabilities: "来源归纳 · 竞品矩阵 · 建议路线", note: "28 次访谈、12 个竞品和细分场景为演示设定。", kicker: "市场进入研究 / 模拟数据", defaultVariant: "editorial", defaultDensity: 2,
    story: ["提出进入决策", "给出研究结论", "量化研究范围", "绘制市场分层", "建立证据矩阵", "比较进入路径", "选择目标场景", "规划 90 天验证", "形成建议与门槛"],
    slides: [
      { name: "决策封面", type: "cover", title: "企业级 AI Agent 工具链：<br>应该进入哪一层？", subtitle: "从访谈、竞品与场景证据形成进入建议" },
      { name: "结论摘要", type: "cards", title: "建议先进入工作流层，而非再做一个通用平台", cards: [{ label: "MARKET PULL", title: "客户购买的是任务闭环", text: "价值来自交付结果，不来自模型入口。", emphasis: true }, { label: "WHITE SPACE", title: "证据与治理仍是缺口", text: "来源、审批和成本需要进入同一流程。" }, { label: "ENTRY GATE", title: "先验证三个高频场景", text: "研究、复盘和培训最适合形成基线。" }] },
      { name: "研究范围", type: "metrics", title: "研究输入覆盖供给、需求与交付三侧", metrics: [{ value: "28", label: "模拟访谈" }, { value: "12", label: "模拟竞品" }, { value: "4", label: "细分场景" }, { value: "3", label: "进入路径" }] },
      { name: "市场分层", type: "pipeline", title: "价值正在从模型入口向任务交付迁移", steps: ["基础模型", "模型平台", "开发框架", "Agent 编排", "任务工作流", "治理审计", "交付服务"] },
      { name: "证据矩阵", type: "evidence", title: "结论按证据强度分层，而不是平均相信", rows: [{ status: "强证据", title: "访谈反复出现交付与审阅痛点" }, { status: "中证据", title: "竞品集中在平台与开发层" }, { status: "弱证据", title: "预算规模仍缺少采购数据" }, { status: "待验证", title: "工作流层的付费意愿" }], donutLabel: "证据\n强度" },
      { name: "路径比较", type: "scores", title: "三条进入路径：选择可验证、可收缩的一条", scores: [{ label: "通用 Agent 平台", value: "高风险", note: "竞争密集、价值边界宽", pending: true }, { label: "垂直工作流", value: "优先", note: "任务明确、证据可测" }, { label: "实施与交付", value: "补充", note: "现金流快、规模化弱" }] },
      { name: "目标场景", type: "scenarios", title: "优先服务高复用、强证据、可人工终审的任务", items: [{ rating: "01", title: "研究与咨询", note: "材料密集 / 需要证据", emphasis: true }, { rating: "02", title: "经营复盘", note: "周期固定 / 指标明确", emphasis: true }, { rating: "03", title: "企业培训", note: "结构重复 / 可批量" }, { rating: "04", title: "对外路演", note: "价值高 / 设计门槛高" }] },
      { name: "90 天验证", type: "roadmap", title: "用 90 天验证需求，而不是先建设完整平台", phases: [{ time: "DAY 01—30", title: "问题验证", text: "完成 10 次用户访谈与 3 份手工交付。" }, { time: "DAY 31—60", title: "工作流原型", text: "只实现一个行业、两类输入和三种交付。" }, { time: "DAY 61—90", title: "付费门槛", text: "验证复购、人工返工和单位交付成本。" }] },
      { name: "建议与门槛", type: "decision", title: "批准一个聚焦工作流层的 90 天验证", summary: "成功条件不是注册用户，而是三个客户愿意为可审阅的交付结果持续付费。", chip: "NEXT / 选择一个行业切口" }
    ]
  },
  business: {
    label: "季度经营复盘", type: "BUSINESS / REVIEW", name: "AI 内容产品 Q3 经营复盘", title: "AI 内容产品 Q3 经营复盘", railTitle: "Q3 复盘", audience: "CEO、业务负责人、产品与财务", outcome: "把经营数据变成问题诊断和下季度行动", capabilities: "KPI 仪表 · 漏斗诊断 · 行动路线", note: "收入、留存、成本与渠道数字均为模拟经营数据。", kicker: "季度经营复盘 / 模拟数据", defaultVariant: "metrics", defaultDensity: 3,
    story: ["定义季度目标", "先给经营判断", "呈现核心 KPI", "拆解增长漏斗", "定位关键偏差", "比较产品线", "确定行动组合", "排出下季路线", "锁定负责人"],
    slides: [
      { name: "季度封面", type: "cover", title: "增长仍在继续，<br>但效率开始分化", subtitle: "AI 内容产品 Q3 经营复盘与 Q4 行动建议" },
      { name: "经营摘要", type: "cards", title: "收入达标，留存改善，获客效率成为主要约束", cards: [{ label: "RESULT", title: "ARR 达到阶段目标", text: "企业客户扩张贡献超过新增。", emphasis: true }, { label: "SIGNAL", title: "NRR 连续两个季度改善", text: "工作流功能提升团队席位使用。" }, { label: "RISK", title: "付费渠道 CAC 上升", text: "泛流量投放需要收缩并重分配。" }] },
      { name: "核心指标", type: "metrics", title: "四个指标说明增长质量，而不只说明增长速度", metrics: [{ value: "¥18.6M", label: "模拟 ARR" }, { value: "108%", label: "模拟 NRR" }, { value: "8.4 月", label: "CAC 回收期" }, { value: "73%", label: "模拟毛利率" }] },
      { name: "增长漏斗", type: "pipeline", title: "瓶颈从试用激活转移到团队扩张", steps: ["访问", "注册", "创建", "首份交付", "个人付费", "团队邀请", "席位扩张"] },
      { name: "偏差诊断", type: "evidence", title: "经营偏差按可控性和证据强度排序", rows: [{ status: "已确认", title: "品牌词自然流量转化稳定" }, { status: "已确认", title: "团队模板提升次月留存" }, { status: "需处理", title: "泛渠道 CAC 高于目标 31%" }, { status: "待实验", title: "行业方案页能否改善 SQL" }], donutLabel: "偏差\n来源" },
      { name: "产品线比较", type: "scores", title: "资源继续向团队工作流倾斜", scores: [{ label: "个人创作", value: "守盘", note: "流量入口，控制研发投入" }, { label: "团队工作流", value: "加码", note: "留存与扩张的主要驱动" }, { label: "企业治理", value: "验证", note: "客单价高，销售周期待测", pending: true }] },
      { name: "Q4 行动", type: "scenarios", title: "把预算、产品和销售动作放进同一张优先级图", items: [{ rating: "P0", title: "团队模板", note: "提升激活与扩张", emphasis: true }, { rating: "P0", title: "渠道重配", note: "削减低效泛投放", emphasis: true }, { rating: "P1", title: "行业方案页", note: "验证高意向流量" }, { rating: "P2", title: "治理控制台", note: "跟随企业试点" }] },
      { name: "Q4 路线", type: "roadmap", title: "Q4 只承诺三个可衡量的经营动作", phases: [{ time: "OCT", title: "修复效率", text: "重配 25% 获客预算，完成团队激活改版。" }, { time: "NOV", title: "验证行业", text: "上线两个行业方案并建立 SQL 基线。" }, { time: "DEC", title: "准备扩张", text: "形成企业治理试点和下一年容量计划。" }] },
      { name: "责任与目标", type: "decision", title: "Q4 北极星：高质量团队席位增长", summary: "产品负责人对激活负责，增长负责人对 CAC 回收负责，销售负责人对行业 SQL 负责。", chip: "NEXT / 周度经营看板上线" }
    ]
  },
  training: {
    label: "企业培训", type: "LEARNING / ENABLEMENT", name: "生成式 AI 安全使用培训", title: "生成式 AI 安全使用培训", railTitle: "安全培训", audience: "全员、部门主管与新员工", outcome: "把政策条文变成可理解、可练习、可测验的课程", capabilities: "课程结构 · 情境案例 · 测验反馈", note: "案例、风险数量和通过标准均为模拟培训设计。", kicker: "企业安全培训 / 模拟课程", defaultVariant: "split", defaultDensity: 2,
    story: ["说明学习任务", "明确学习成果", "给出课程地图", "建立判断流程", "拆解风险案例", "进行情境测验", "匹配岗位场景", "规划推广节奏", "形成行为承诺"],
    slides: [
      { name: "课程封面", type: "cover", title: "可以用 AI，<br>但不能交出判断权", subtitle: "生成式 AI 安全使用：识别、处理与上报" },
      { name: "学习成果", type: "cards", title: "完成课程后，你需要做到三件事", cards: [{ label: "IDENTIFY", title: "识别敏感信息", text: "在输入前判断数据等级。", emphasis: true }, { label: "DECIDE", title: "选择允许的工具与方式", text: "按场景匹配审批与脱敏要求。" }, { label: "RESPOND", title: "发现风险立即停止并上报", text: "保留记录，不自行掩盖。" }] },
      { name: "课程地图", type: "metrics", title: "45 分钟课程由知识、案例、练习和测验组成", metrics: [{ value: "45min", label: "课程时长" }, { value: "4", label: "学习模块" }, { value: "6", label: "风险行为" }, { value: "80", label: "通过分数" }] },
      { name: "判断流程", type: "pipeline", title: "在向 AI 输入任何内容前，完成七步检查", steps: ["识别目的", "判断数据", "选择工具", "最小输入", "核验输出", "保留记录", "异常上报"] },
      { name: "风险案例", type: "evidence", title: "同一个动作，因为数据与工具不同会产生不同风险", rows: [{ status: "允许", title: "公开资料 + 已批准企业工具" }, { status: "需脱敏", title: "内部材料 + 可逆匿名处理" }, { status: "需审批", title: "客户数据 + 明确业务必要性" }, { status: "禁止", title: "密钥、身份信息与未公开财务数据" }], donutLabel: "风险\n分级" },
      { name: "情境测验", type: "scores", title: "你会如何处理这三个真实工作情境？", scores: [{ label: "把客户邮件交给公开模型总结", value: "禁止", note: "包含客户身份与业务信息", pending: true }, { label: "用企业工具润色公开文案", value: "允许", note: "仍需核验事实与版权" }, { label: "对内部数据脱敏后做分类", value: "条件", note: "确认不可逆并保留记录" }] },
      { name: "岗位场景", type: "scenarios", title: "不同岗位需要关注不同的风险入口", items: [{ rating: "HR", title: "简历与员工数据", note: "个人信息 / 公平性", emphasis: true }, { rating: "SALES", title: "客户沟通", note: "客户数据 / 承诺" }, { rating: "R&D", title: "代码与日志", note: "密钥 / 知识产权" }, { rating: "FIN", title: "经营与财务", note: "未公开信息 / 审批" }] },
      { name: "推广计划", type: "roadmap", title: "培训必须和工具、政策与反馈机制一起上线", phases: [{ time: "WEEK 01", title: "主管先行", text: "统一解释口径并收集部门场景。" }, { time: "WEEK 02—03", title: "全员学习", text: "课程、案例练习与在线测验同步。" }, { time: "MONTH 02", title: "复盘改版", text: "按真实事件更新案例和问答。" }] },
      { name: "行为承诺", type: "decision", title: "不确定时：停止输入，询问负责人", summary: "AI 可以提高效率，但数据责任、事实判断和最终决定始终属于使用者。", chip: "NEXT / 完成 3 道岗位测验" }
    ]
  },
  pitch: {
    label: "项目方案路演", type: "SOLUTION / PITCH", name: "工业园区能效数字孪生方案", title: "工业园区能效数字孪生方案", railTitle: "能效方案", audience: "园区管理者、工厂负责人和投资委员会", outcome: "把复杂技术架构转化为价值、范围和实施决策", capabilities: "问题叙事 · 方案架构 · 价值路线", note: "节能目标、周期、工厂数量和预算收益均为模拟方案目标。", kicker: "项目方案路演 / 模拟目标", defaultVariant: "bespoke", defaultDensity: 2,
    story: ["提出业务问题", "给出价值主张", "定义目标范围", "解释方案架构", "建立数据边界", "量化目标收益", "展示应用场景", "排出实施路线", "提出试点决策"],
    slides: [
      { name: "方案封面", type: "cover", title: "让每一度能源，<br>都有可解释的去向", subtitle: "工业园区能效数字孪生试点方案" },
      { name: "价值主张", type: "cards", title: "从月度账单追责，转向实时发现与闭环行动", cards: [{ label: "VISIBILITY", title: "能耗去向可见", text: "统一设备、产线、工厂与园区视图。", emphasis: true }, { label: "DIAGNOSIS", title: "异常原因可解释", text: "把偏差关联到工况、设备与班次。" }, { label: "ACTION", title: "节能措施可验证", text: "跟踪建议、执行与实际收益。" }] },
      { name: "目标范围", type: "metrics", title: "试点用有限范围验证价值与数据可行性", metrics: [{ value: "4", label: "模拟试点工厂" }, { value: "12 周", label: "一期周期" }, { value: "3", label: "数据层级" }, { value: "-8%", label: "目标能耗强度" }] },
      { name: "方案架构", type: "pipeline", title: "从现场数据到节能行动的七层闭环", steps: ["传感设备", "边缘采集", "数据底座", "指标模型", "数字孪生", "异常诊断", "行动工单"] },
      { name: "数据边界", type: "evidence", title: "先确认哪些数据可用，再承诺算法效果", rows: [{ status: "已具备", title: "总表与主要产线分表" }, { status: "需接入", title: "设备状态与生产节拍" }, { status: "需治理", title: "设备编码与时间对齐" }, { status: "不纳入一期", title: "全量设备预测性维护" }], donutLabel: "数据\n就绪度" },
      { name: "目标收益", type: "scores", title: "用三类指标定义一期是否值得扩大", scores: [{ label: "能耗强度", value: "-8%", note: "模拟目标，按产量归一" }, { label: "异常发现", value: "<10min", note: "从日级缩短到分钟级" }, { label: "数据完整率", value: ">95%", note: "关键测点的有效数据" }] },
      { name: "应用场景", type: "scenarios", title: "一期聚焦能直接转化为行动的四个场景", items: [{ rating: "01", title: "空压站群控", note: "识别低效组合", emphasis: true }, { rating: "02", title: "峰谷策略", note: "优化时段与负荷" }, { rating: "03", title: "待机能耗", note: "发现非生产损耗" }, { rating: "04", title: "班次对标", note: "解释同产量差异" }] },
      { name: "实施路线", type: "roadmap", title: "12 周完成数据、场景和价值三次验收", phases: [{ time: "WEEK 01—04", title: "数据就绪", text: "接入四厂数据，完成编码、质量与基线。" }, { time: "WEEK 05—08", title: "场景上线", text: "交付两个重点场景和园区总览。" }, { time: "WEEK 09—12", title: "价值验收", text: "跟踪行动闭环并形成扩展商业案例。" }] },
      { name: "试点决策", type: "decision", title: "批准四厂、两场景、12 周的一期试点", summary: "第 4 周以数据完整率为退出门槛，第 12 周以可验证节能收益决定是否扩到全园区。", chip: "NEXT / 启动数据尽调" }
    ]
  }
};

const state = { scenario: "research", slide: 0, variant: "editorial", density: 2, highlight: true, title: scenarioDecks.research.title };

const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const contentFingerprint = (value) => {
  let hash = 2166136261;
  for (const character of String(value)) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return `CC-${(hash >>> 0).toString(16).toUpperCase().slice(-7).padStart(7, "0")}`;
};

function setupTheme() {
  const button = document.querySelector("[data-theme-toggle]");
  let saved = "";
  try { saved = localStorage.getItem("dashi-showcase-theme") || ""; } catch (_) { /* storage can be unavailable */ }
  const initial = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.theme = initial;
  const sync = () => {
    const dark = root.dataset.theme === "dark";
    button?.setAttribute("aria-pressed", String(dark));
    button?.setAttribute("aria-label", dark ? "切换为浅色主题" : "切换为深色主题");
    const label = button?.querySelector(".button-label");
    if (label) label.textContent = dark ? "浅色" : "深色";
  };
  sync();
  button?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("dashi-showcase-theme", root.dataset.theme); } catch (_) { /* noop */ }
    sync();
  });
}

function setupFilters() {
  const capabilityButtons = [...document.querySelectorAll("[data-cap-filter]")];
  const capabilityCards = [...document.querySelectorAll("[data-capability]")];
  const result = document.querySelector("[data-cap-result]");
  capabilityButtons.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.capFilter;
    capabilityButtons.forEach((item) => { item.classList.toggle("is-active", item === button); item.setAttribute("aria-pressed", String(item === button)); });
    let visible = 0;
    capabilityCards.forEach((card) => { const show = filter === "all" || card.dataset.capability.split(" ").includes(filter); card.hidden = !show; if (show) visible += 1; });
    if (result) result.textContent = `当前显示 ${visible} 项能力。`;
  }));

  const extensionButtons = [...document.querySelectorAll("[data-extension-filter]")];
  const extensionCards = [...document.querySelectorAll("[data-horizon]")];
  extensionButtons.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.extensionFilter;
    extensionButtons.forEach((item) => { item.classList.toggle("is-active", item === button); item.setAttribute("aria-pressed", String(item === button)); });
    extensionCards.forEach((card) => { card.hidden = filter !== "all" && card.dataset.horizon !== filter; });
  }));

  const evidenceButtons = [...document.querySelectorAll("[data-evidence-filter]")];
  const evidenceItems = [...document.querySelectorAll("[data-evidence-status]")];
  const evidenceCount = document.querySelector("[data-evidence-count]");
  evidenceButtons.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.evidenceFilter;
    evidenceButtons.forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); });
    let visible = 0;
    evidenceItems.forEach((item) => { const show = filter === "all" || item.dataset.evidenceStatus === filter; item.hidden = !show; if (show) visible += 1; });
    if (evidenceCount) evidenceCount.textContent = String(visible);
  }));
}

function setupMobileMenu() {
  const menu = document.querySelector("[data-mobile-menu]");
  const trigger = document.querySelector("[data-mobile-menu-toggle]");
  const panel = menu?.querySelector(".mobile-menu-panel");
  const closeButtons = [...(menu?.querySelectorAll("[data-mobile-menu-close]") || [])];
  const inertTargets = [document.querySelector("[data-site-header]"), document.querySelector("main"), document.querySelector(".site-footer")].filter(Boolean);
  if (!menu || !trigger || !panel) return;

  const focusable = () => [...panel.querySelectorAll("a[href], button:not([disabled])")];
  const close = (restoreFocus = true) => {
    menu.hidden = true;
    document.body.classList.remove("menu-open");
    trigger.setAttribute("aria-expanded", "false");
    inertTargets.forEach((target) => { target.inert = false; });
    if (restoreFocus) trigger.focus();
  };
  const open = () => {
    menu.hidden = false;
    document.body.classList.add("menu-open");
    trigger.setAttribute("aria-expanded", "true");
    inertTargets.forEach((target) => { target.inert = true; });
    requestAnimationFrame(() => focusable()[0]?.focus());
  };
  trigger.addEventListener("click", open);
  closeButtons.forEach((button) => button.addEventListener("click", () => close()));
  menu.querySelectorAll("a[href]").forEach((link) => link.addEventListener("click", () => close(false)));
  document.addEventListener("keydown", (event) => {
    if (menu.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  matchMedia("(min-width: 801px)").addEventListener?.("change", (event) => { if (event.matches && !menu.hidden) close(false); });
}

function setupTabs(containerSelector, buttonSelector, activate) {
  const container = document.querySelector(containerSelector);
  const buttons = container ? [...container.querySelectorAll(buttonSelector)] : [];
  const choose = (index, focus = false) => {
    const safeIndex = (index + buttons.length) % buttons.length;
    buttons.forEach((button, itemIndex) => { const selected = itemIndex === safeIndex; button.setAttribute("aria-selected", String(selected)); button.tabIndex = selected ? 0 : -1; });
    activate(buttons[safeIndex], safeIndex);
    if (focus) buttons[safeIndex].focus();
  };
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => choose(index));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") choose(0, true);
      else if (event.key === "End") choose(buttons.length - 1, true);
      else choose(index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1), true);
    });
  });
}

function setupDashiLab() {
  const lab = document.querySelector("[data-dashi-lab]");
  if (!lab) return;
  const controls = {
    items: lab.querySelector("[data-lab-items]"),
    numbers: lab.querySelector("[data-lab-number-count]"),
    media: lab.querySelector("[data-lab-media-toggle]")
  };
  const labState = { ...labPresets.research, variant: "template-a" };

  const render = () => {
    const fingerprint = contentFingerprint(`${labState.title}|${labState.items}|${labState.numbers}|${labState.media}`);
    const results = labLayouts.map((layout, index) => {
      const reason = layout.evaluate(labState);
      return { ...layout, reason, pass: !reason, score: Math.max(68, 96 - index * 3 - Math.abs(labState.items - 4) * 2 - Math.abs(labState.numbers - 2)) };
    });
    const passed = results.filter((item) => item.pass);
    const primaryLayout = passed[0]?.id || "bespoke-required";
    const fields = {
      "[data-lab-title]": labState.title,
      "[data-lab-facts]": `${labState.items} blocks`,
      "[data-lab-numbers]": `${labState.numbers} metrics`,
      "[data-lab-media]": String(labState.media),
      "[data-lab-fingerprint]": fingerprint,
      "[data-lab-items-output]": String(labState.items),
      "[data-lab-numbers-output]": String(labState.numbers),
      "[data-lab-match-summary]": `${passed.length} / ${results.length} 个候选通过硬约束`,
      "[data-lab-preview-title]": labState.title,
      "[data-lab-preview-fingerprint]": fingerprint,
      "[data-lab-integrity]": `${labState.items + labState.numbers + (labState.media ? 1 : 0)} / ${labState.items + labState.numbers + (labState.media ? 1 : 0)} 个内容字段一致`
    };
    Object.entries(fields).forEach(([selector, value]) => { const element = lab.querySelector(selector); if (element) element.textContent = value; });

    const candidates = lab.querySelector("[data-lab-candidates]");
    if (candidates) candidates.innerHTML = results.map((item) => `<article data-status="${item.pass ? "pass" : "reject"}"><span>${item.pass ? `PASS · ${item.score}` : "REJECT"}</span><strong>${escapeHTML(item.id)}</strong><small>${escapeHTML(item.pass ? item.rule : item.reason)}</small></article>`).join("");

    const variant = labVariants[labState.variant];
    const preview = lab.querySelector("[data-lab-preview]");
    if (preview) preview.className = `lab-slide ${variant.className}`;
    const variantLabel = lab.querySelector("[data-lab-variant-label]");
    if (variantLabel) variantLabel.textContent = `${variant.label} / ${labState.variant === "bespoke" ? "theme-contract" : primaryLayout}`;
    const factGrid = lab.querySelector("[data-lab-fact-grid]");
    if (factGrid) factGrid.innerHTML = Array.from({ length: labState.items }, (_, index) => `<span>${index < labState.numbers ? "N" : "F"}${String(index + 1).padStart(2, "0")}</span>`).join("");
    const mediaSlot = lab.querySelector("[data-lab-media-slot]");
    if (mediaSlot) mediaSlot.hidden = !labState.media;
    const exportHint = lab.querySelector("[data-lab-export]");
    if (exportHint) exportHint.textContent = labState.variant === "bespoke" ? "复杂背景可能回退；文本仍优先原生映射" : labState.media ? "媒体保持图片对象；复杂裁切需实测" : "文本与形状优先映射为原生对象";
  };

  const applyPreset = (presetName) => {
    Object.assign(labState, labPresets[presetName]);
    controls.items.value = String(labState.items);
    controls.numbers.value = String(labState.numbers);
    controls.media.checked = labState.media;
    render();
  };
  setupTabs("[data-lab-preset-tabs]", "[data-lab-preset]", (button) => applyPreset(button.dataset.labPreset));
  setupTabs("[data-lab-variant-tabs]", "[data-lab-variant]", (button) => { labState.variant = button.dataset.labVariant; render(); });
  controls.items?.addEventListener("input", () => { labState.items = Number(controls.items.value); render(); });
  controls.numbers?.addEventListener("input", () => { labState.numbers = Number(controls.numbers.value); render(); });
  controls.media?.addEventListener("change", () => { labState.media = controls.media.checked; render(); });
  render();
}

function setupRealRun() {
  const lab = document.querySelector("[data-real-run]");
  if (!lab) return;
  const state = { page: 4, variant: 4 };
  const variantButtons = [...lab.querySelectorAll("[data-real-variant]")];
  const field = (selector) => lab.querySelector(selector);
  const variantNames = ["模板候选 V1", "模板候选 V2", "模板候选 V3", "Agent 定制 +1"];

  const render = () => {
    const page = realRunPages[state.page - 1];
    const variant = page.variants[state.variant - 1];
    const [layout, kind, textObjects, shapeObjects, imageObjects] = variant;
    const physical = (state.page - 1) * 4 + state.variant;
    const image = field("[data-real-image]");
    if (image) {
      image.src = `../artifacts/real-run-01/dashi-real-run-01-comparison/slide-${physical}.png`;
      image.alt = `第 ${state.page} 个逻辑页的 ${state.variant === 4 ? "v4 定制" : `v${state.variant} 模板`}真实 PowerPoint 渲染`;
    }
    const values = {
      "[data-real-physical]": `${physical} of 32`,
      "[data-real-title]": page.title,
      "[data-real-hash]": page.hash,
      "[data-real-facts]": page.required ? `${page.required} / ${page.required}` : "封面字段完整",
      "[data-real-route]": `${kind} / ${layout}`,
      "[data-real-objects]": `${textObjects} 文字 · ${shapeObjects} 形状`,
      "[data-real-images]": `${imageObjects} 图像`
    };
    Object.entries(values).forEach(([selector, value]) => { const element = field(selector); if (element) element.textContent = value; });
    const note = field("[data-real-note]");
    if (note) {
      note.textContent = state.variant === 4
        ? `v4 使用 ${layout} 组合保持全稿统一；信息完整，但视觉仍属于克制的通用研究汇报。`
        : state.page === 4 && state.variant === 1
          ? "该候选由同主题 page035 替换会在 PowerPoint 中越界的 page057；事实不变，布局改变。"
          : "这是引擎实际分配的原始模板候选，用于比较与审计，并不代表已由设计师精修。";
    }
    variantButtons.forEach((button, index) => {
      const item = page.variants[index];
      const active = index + 1 === state.variant;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      const strong = button.querySelector("strong");
      const small = button.querySelector("small");
      if (strong) strong.textContent = variantNames[index];
      if (small) small.textContent = item[0];
    });
  };

  setupTabs("[data-real-page-tabs]", "[data-real-page]", (button) => { state.page = Number(button.dataset.realPage); render(); });
  setupTabs("[data-real-variant-tabs]", "[data-real-variant]", (button) => { state.variant = Number(button.dataset.realVariant.slice(1)); render(); });
  render();
}

function setupRealRun02() {
  const viewer = document.querySelector("[data-real-run-02]");
  if (!viewer) return;
  const runState = { page: 1, route: "dashi" };
  const field = selector => viewer.querySelector(selector);

  const render = () => {
    const page = realRun02Pages[runState.page - 1];
    const route = realRun02Routes[runState.route];
    const image = field("[data-run02-image]");
    if (image) {
      image.src = route.image(runState.page);
      image.alt = `${runState.route === "dashi" ? "Dashi 精选 v4" : "直接编程基线"}的第 ${runState.page} 页「${page.name}」PowerPoint 渲染`;
    }
    const values = {
      "[data-run02-title]": page.title,
      "[data-run02-caption]": `${runState.route === "dashi" ? "Dashi v4" : "Direct baseline"} · slide ${runState.page} / 8 · PowerPoint render`,
      "[data-run02-route-label]": route.label,
      "[data-run02-verdict]": route.verdict,
      "[data-run02-role]": page.role,
      "[data-run02-brand]": route.brand,
      "[data-run02-edit]": route.edit(runState.page),
      "[data-run02-objects]": route.objects,
      "[data-run02-time]": route.time,
      "[data-run02-note]": route.note
    };
    Object.entries(values).forEach(([selector, value]) => { const element = field(selector); if (element) element.textContent = value; });
  };

  setupTabs("[data-run02-route-tabs]", "[data-run02-route]", button => { runState.route = button.dataset.run02Route; render(); });
  setupTabs("[data-run02-page-tabs]", "[data-run02-page]", button => { runState.page = Number(button.dataset.run02Page); render(); });
  render();
}

function setupPipeline() {
  const fields = {
    owner: document.querySelector("[data-pipeline-owner]"), number: document.querySelector("[data-pipeline-number]"), title: document.querySelector("[data-pipeline-title]"), summary: document.querySelector("[data-pipeline-summary]"), input: document.querySelector("[data-pipeline-input]"), process: document.querySelector("[data-pipeline-process]"), output: document.querySelector("[data-pipeline-output]"), evidence: document.querySelector("[data-pipeline-evidence]")
  };
  setupTabs("[data-pipeline-tabs]", "[data-pipeline-step]", (_, index) => {
    const step = pipelineSteps[index];
    Object.entries(fields).forEach(([key, element]) => { if (element) element.textContent = key === "number" ? String(index + 1).padStart(2, "0") : step[key]; });
  });
}

function setupFormats() {
  const panels = [...document.querySelectorAll("[data-format-panel]")];
  setupTabs("[data-format-tabs]", "[data-format]", (button) => {
    panels.forEach((panel) => { panel.hidden = panel.dataset.formatPanel !== button.dataset.format; });
  });
}

function setupAudiences() {
  const fields = {
    number: document.querySelector("[data-audience-number]"), label: document.querySelector("[data-audience-label]"), title: document.querySelector("[data-audience-title]"), goal: document.querySelector("[data-audience-goal]"), value: document.querySelector("[data-audience-value]"), risk: document.querySelector("[data-audience-risk]"), use: document.querySelector("[data-audience-use]")
  };
  setupTabs("[data-audience-tabs]", "[data-audience]", (button) => {
    const audience = audiences[button.dataset.audience];
    Object.entries(fields).forEach(([key, element]) => { if (element) element.textContent = audience[key]; });
  });
}

function setupAdoption() {
  const form = document.querySelector("[data-adoption-form]");
  const inputs = form ? [...form.querySelectorAll("[data-adoption-factor]")] : [];
  if (!form || !inputs.length) return;
  const labels = ["很低", "较低", "一般", "较高", "很高"];
  const factorNames = { frequency: "重复汇报频率", structure: "材料结构化程度", privacy: "本地与隐私需求", review: "人工审阅能力", format: "HTML / PDF 接受度", maintenance: "Agent 工具维护能力" };
  const scoreElement = document.querySelector("[data-adoption-score]");
  const meter = document.querySelector("[data-adoption-meter]");
  const level = document.querySelector("[data-adoption-level]");
  const title = document.querySelector("[data-adoption-title]");
  const summary = document.querySelector("[data-adoption-summary]");
  const reasons = document.querySelector("[data-adoption-reasons]");
  const copyButton = document.querySelector("[data-copy-decision]");
  const copyStatus = document.querySelector("[data-copy-status]");
  let currentSummary = "";

  const render = () => {
    const values = inputs.map((input) => ({ key: input.dataset.adoptionFactor, value: Number(input.value) }));
    values.forEach(({ key, value }) => { const output = document.querySelector(`[data-adoption-output="${key}"]`); if (output) output.textContent = labels[value]; });
    const score = values.reduce((total, item) => total + item.value, 0);
    const strongest = [...values].sort((a, b) => b.value - a.value)[0];
    const weakest = [...values].sort((a, b) => a.value - b.value).slice(0, 2);
    let result;
    if (score >= 18) result = { code: "RECOMMENDED PILOT", title: "建议进入受控试点", summary: "组织条件与 Dashi 的优势高度匹配。下一步应以 10 份真实材料验证质量门槛，而不是继续停留在功能讨论。", color: "var(--green)" };
    else if (score >= 11) result = { code: "CONDITIONAL PILOT", title: "建议有条件试点", summary: "已经具备部分价值条件，但应先用固定材料验证导出质量和维护成本，再决定是否扩大。", color: "var(--blue)" };
    else result = { code: "NOT YET", title: "暂不建议进入生产", summary: "当前条件不足以抵消工具链复杂度。先改善材料、审阅或维护能力，或选择人工 / 更轻量方案。", color: "var(--coral)" };
    const reasonItems = score >= 18
      ? [`${factorNames[strongest.key]}是当前采用优势`, "先限定高复用、可审阅的三类任务", "仍需单独通过许可证与 PPTX 验收"]
      : score >= 11
        ? [`${factorNames[strongest.key]}支持受控试点`, ...weakest.map((item) => `优先改善：${factorNames[item.key]}`)]
        : [...weakest.map((item) => `主要短板：${factorNames[item.key]}`), "在进入试点前先建立人工基线和负责人"];
    if (scoreElement) scoreElement.textContent = String(score);
    if (meter) { meter.style.width = `${(score / 24) * 100}%`; meter.style.background = result.color; }
    if (level) level.textContent = result.code;
    if (title) title.textContent = result.title;
    if (summary) summary.textContent = result.summary;
    if (reasons) reasons.innerHTML = reasonItems.map((item) => `<li>${escapeHTML(item)}</li>`).join("");
    currentSummary = `Dashi PPT Skill 采用评估：${score}/24，${result.title}。${result.summary} 关键判断：${reasonItems.join("；")}。建议下一步：用 10 份真实材料检查首稿时间、事实修改、设计修改、PPTX 原生编辑率和总成本。`;
    if (copyStatus) copyStatus.textContent = "";
  };

  inputs.forEach((input) => input.addEventListener("input", render));
  form.addEventListener("reset", () => requestAnimationFrame(render));
  copyButton?.addEventListener("click", async () => {
    let copied = false;
    try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(currentSummary); copied = true; } } catch (_) { /* use fallback */ }
    if (!copied) {
      const temporary = document.createElement("textarea");
      temporary.value = currentSummary; temporary.setAttribute("readonly", ""); temporary.style.position = "fixed"; temporary.style.opacity = "0";
      document.body.append(temporary); temporary.select();
      try { copied = document.execCommand("copy"); } catch (_) { copied = false; }
      temporary.remove();
    }
    if (copyStatus) copyStatus.textContent = copied ? "决策摘要已复制。" : "浏览器未授权复制，请手动记录上方建议。";
  });
  render();
}

function slideMarkup(index) {
  const deck = scenarioDecks[state.scenario];
  const slide = deck.slides[index];
  const title = escapeHTML(state.title);
  const footer = `<div class="slide-footer"><span>${title} · 模拟数据</span><span>${String(index + 1).padStart(2, "0")} / 09</span></div>`;
  const kicker = `<p class="slide-kicker">${escapeHTML(deck.kicker)}</p>`;
  if (slide.type === "cover") return `<div class="slide-inner">${kicker}<h3 class="slide-title">${slide.title}</h3><p class="slide-subtitle">${escapeHTML(slide.subtitle)}</p>${footer}<div class="slide-accent" aria-hidden="true"></div></div>`;
  if (slide.type === "cards") return `<div class="slide-inner">${kicker}<h3 class="slide-section-title">${escapeHTML(slide.title)}</h3><div class="slide-grid">${slide.cards.map((card) => `<div class="slide-card${card.emphasis ? " is-emphasis" : ""}"><span>${escapeHTML(card.label)}</span><strong>${escapeHTML(card.title)}</strong><p>${escapeHTML(card.text)}</p></div>`).join("")}</div>${footer}</div>`;
  if (slide.type === "metrics") return `<div class="slide-inner">${kicker}<h3 class="slide-section-title">${escapeHTML(slide.title)}</h3><div class="slide-metric-row">${slide.metrics.map((metric) => `<div class="slide-metric"><strong>${escapeHTML(metric.value)}</strong><span>${escapeHTML(metric.label)}</span></div>`).join("")}</div>${footer}</div>`;
  if (slide.type === "pipeline") return `<div class="slide-inner">${kicker}<h3 class="slide-section-title">${escapeHTML(slide.title)}</h3><div class="slide-pipeline">${slide.steps.map((step, stepIndex) => `<div><b>${String(stepIndex + 1).padStart(2, "0")}</b><strong>${escapeHTML(step)}</strong></div>`).join("")}</div>${footer}</div>`;
  if (slide.type === "evidence") return `<div class="slide-inner">${kicker}<h3 class="slide-section-title">${escapeHTML(slide.title)}</h3><div class="slide-evidence"><div class="slide-evidence-list">${slide.rows.map((row) => `<div><span>${escapeHTML(row.status)}</span><strong>${escapeHTML(row.title)}</strong></div>`).join("")}</div><div class="slide-donut" data-label="${escapeHTML(slide.donutLabel.replace("\\n", " "))}" aria-hidden="true"></div></div>${footer}</div>`;
  if (slide.type === "scores") return `<div class="slide-inner">${kicker}<h3 class="slide-section-title">${escapeHTML(slide.title)}</h3><div class="slide-scoreboard">${slide.scores.map((score) => `<div class="slide-score${score.pending ? " pending" : ""}"><span>${escapeHTML(score.label)}</span><strong>${escapeHTML(score.value)}</strong><small>${escapeHTML(score.note)}</small></div>`).join("")}</div>${footer}</div>`;
  if (slide.type === "scenarios") return `<div class="slide-inner">${kicker}<h3 class="slide-section-title">${escapeHTML(slide.title)}</h3><div class="slide-scenarios">${slide.items.map((item) => `<div class="${item.emphasis ? "is-emphasis" : ""}"><b>${escapeHTML(item.rating)}</b><p><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.note)}</span></p></div>`).join("")}</div>${footer}</div>`;
  if (slide.type === "roadmap") return `<div class="slide-inner">${kicker}<h3 class="slide-section-title">${escapeHTML(slide.title)}</h3><div class="slide-roadmap">${slide.phases.map((phase) => `<div><span>${escapeHTML(phase.time)}</span><strong>${escapeHTML(phase.title)}</strong><p>${escapeHTML(phase.text)}</p></div>`).join("")}</div>${footer}</div>`;
  return `<div class="slide-inner slide-decision">${kicker}<h3>${escapeHTML(slide.title)}</h3><p>${escapeHTML(slide.summary)}</p><span class="decision-chip">${escapeHTML(slide.chip)}</span>${footer}</div>`;
}

const slideTraceProfiles = {
  cover: { layout: "hero-title-02", constraint: "标题与副标题容量通过" },
  cards: { layout: "insight-cards-03", constraint: "三栏卡片与强调位通过" },
  metrics: { layout: "metrics-04", constraint: "四个数值槽与标签通过" },
  pipeline: { layout: "process-07", constraint: "七阶段流程容量通过" },
  evidence: { layout: "evidence-split", constraint: "四条证据与图示位通过" },
  scores: { layout: "compare-03", constraint: "三项比较与状态位通过" },
  scenarios: { layout: "scenario-04", constraint: "四象限场景容量通过" },
  roadmap: { layout: "roadmap-03", constraint: "三阶段时间线容量通过" },
  decision: { layout: "decision-gate-01", constraint: "单结论与行动位通过" }
};

function slideBlockCount(slide) {
  if (slide.cards) return slide.cards.length;
  if (slide.metrics) return slide.metrics.length;
  if (slide.steps) return slide.steps.length;
  if (slide.rows) return slide.rows.length;
  if (slide.scores) return slide.scores.length;
  if (slide.items) return slide.items.length;
  if (slide.phases) return slide.phases.length;
  return slide.type === "cover" ? 3 : 3;
}

function renderDeck() {
  const deck = scenarioDecks[state.scenario];
  const canvas = document.querySelector("[data-deck-canvas]");
  const status = document.querySelector("[data-deck-status]");
  const progress = document.querySelector("[data-deck-progress]");
  if (!canvas) return;
  canvas.className = `deck-canvas variant-${state.variant} density-${["airy", "balanced", "dense"][state.density - 1]}${state.highlight ? " has-highlight" : ""}`;
  canvas.innerHTML = slideMarkup(state.slide);
  document.querySelectorAll("[data-slide-index]").forEach((button) => button.setAttribute("aria-current", String(Number(button.dataset.slideIndex) === state.slide)));
  if (status) status.textContent = `${deck.label} · 第 ${state.slide + 1} 页 · ${deck.slides[state.slide].name}`;
  if (progress) progress.style.width = `${((state.slide + 1) / deck.slides.length) * 100}%`;
  const slide = deck.slides[state.slide];
  const trace = slideTraceProfiles[slide.type] || slideTraceProfiles.decision;
  const blocks = slideBlockCount(slide);
  const variantName = { editorial: "模板候选 A", metrics: "模板候选 B", split: "模板候选 C", bespoke: "Agent 定制 +1" }[state.variant];
  const traceFields = {
    "[data-trace-content]": `${slide.type.toUpperCase()} · ${blocks} 个事实块 · ${contentFingerprint(`${deck.label}|${slide.name}|${state.title}`).replace("CC-", "HASH ").slice(0, 12)}`,
    "[data-trace-layout]": `${trace.layout} · ${trace.constraint}`,
    "[data-trace-allocation]": `${variantName} · 第 ${state.slide + 1} / ${deck.slides.length} 页 · 复用惩罚已计入`,
    "[data-trace-export]": state.variant === "bespoke" ? "文本优先原生 · 复杂背景可能截图回退" : "文本/形状优先原生 · 复杂效果需导出实测"
  };
  Object.entries(traceFields).forEach(([selector, value]) => { const element = document.querySelector(selector); if (element) element.textContent = value; });
}

function setupDeck() {
  const navigation = document.querySelector("[data-slide-nav]");
  const variantButtons = [...document.querySelectorAll("[data-variant]")];
  const density = document.querySelector("[data-density]");
  const densityOutput = document.querySelector("[data-density-output]");
  const title = document.querySelector("[data-deck-title]");
  const highlight = document.querySelector("[data-highlight]");

  const syncControls = () => {
    if (density) density.value = String(state.density);
    if (densityOutput) densityOutput.textContent = ["留白", "平衡", "紧凑"][state.density - 1];
    if (title) title.value = state.title;
    if (highlight) highlight.checked = state.highlight;
    variantButtons.forEach((button) => { const active = button.dataset.variant === state.variant; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
  };

  const buildNavigation = () => {
    if (!navigation) return;
    const slides = scenarioDecks[state.scenario].slides;
    navigation.replaceChildren();
    slides.forEach((slide, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.slideIndex = String(index);
      button.setAttribute("aria-current", String(index === state.slide));
      button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${escapeHTML(slide.name)}`;
      button.addEventListener("click", () => { state.slide = index; renderDeck(); });
      button.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? slides.length - 1 : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + slides.length) % slides.length;
        navigation.querySelector(`[data-slide-index="${next}"]`)?.focus();
        state.slide = next; renderDeck();
      });
      navigation.append(button);
    });
  };

  const updateScenarioUI = () => {
    const deck = scenarioDecks[state.scenario];
    const fields = { "[data-scenario-type]": deck.type, "[data-scenario-name]": deck.name, "[data-scenario-audience]": deck.audience, "[data-scenario-outcome]": deck.outcome, "[data-scenario-capabilities]": deck.capabilities, "[data-scenario-note]": deck.note, "[data-rail-title]": deck.railTitle };
    Object.entries(fields).forEach(([selector, value]) => { const element = document.querySelector(selector); if (element) element.textContent = value; });
    const story = document.querySelector("[data-story-list]");
    if (story) story.innerHTML = deck.story.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${escapeHTML(item)}</li>`).join("");
  };

  const applyScenario = (scenario) => {
    const deck = scenarioDecks[scenario];
    Object.assign(state, { scenario, slide: 0, variant: deck.defaultVariant, density: deck.defaultDensity, highlight: true, title: deck.title });
    syncControls(); updateScenarioUI(); buildNavigation(); renderDeck();
  };

  setupTabs("[data-scenario-tabs]", "[data-scenario]", (button) => applyScenario(button.dataset.scenario));
  variantButtons.forEach((button) => button.addEventListener("click", () => {
    state.variant = button.dataset.variant;
    variantButtons.forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); });
    renderDeck();
  }));
  density?.addEventListener("input", () => { state.density = Number(density.value); if (densityOutput) densityOutput.textContent = ["留白", "平衡", "紧凑"][state.density - 1]; renderDeck(); });
  title?.addEventListener("input", () => { state.title = title.value.trim() || "未命名汇报"; renderDeck(); });
  highlight?.addEventListener("change", () => { state.highlight = highlight.checked; renderDeck(); });
  document.querySelector("[data-demo-reset]")?.addEventListener("click", () => applyScenario(state.scenario));
  applyScenario(state.scenario);
}

function setupNavigationObserver() {
  const links = [...document.querySelectorAll(".desktop-nav a")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => { const active = link.getAttribute("href") === `#${visible.target.id}`; link.classList.toggle("is-active", active); if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); });
  }, { rootMargin: "-20% 0px -65%", threshold: [0, .1, .25] });
  sections.forEach((section) => observer.observe(section));
}

function setupExampleAtlas() {
  document.querySelectorAll("[data-example-scenario]").forEach((link) => {
    link.addEventListener("click", () => {
      const scenario = link.dataset.exampleScenario;
      document.querySelector(`[data-scenario="${scenario}"]`)?.click();
    });
  });
}

setupTheme();
setupMobileMenu();
setupFilters();
setupRealRun();
setupRealRun02();
setupDashiLab();
setupPipeline();
setupFormats();
setupAudiences();
setupAdoption();
setupDeck();
setupExampleAtlas();
setupNavigationObserver();
