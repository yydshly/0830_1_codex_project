window.SOLO_CASES = [
  {
    id: "research",
    short: "研究交付",
    title: "把这个真实研究项目收口成可决策的交付包",
    source: "LIVE PROJECT",
    sourceClass: "live",
    type: "旗舰案例 · 真实项目证据",
    summary: "直接读取本项目已经存在的版本、结构测试、研究日志和网页运行事实，组合四个 Skill 思路，产出采用结论、证据包与下一项可复用 Skill。",
    goal: "把已经完成的开源库研究收口成一份可以决定“采用、试点还是暂缓”的交付包。",
    prompt: `使用 Solo Skills 中 meeting-summary、measured-ui-callouts、web-demo-video 和 style-skill-creator 的规程，读取 projects/solo-skills-study/README.md、research-log.md、测试结果和当前研究网页，生成采用备忘录、证据索引、演示路线以及 research-study-closeout Skill 候选。只引用能回到文件或测试的结论；未验证项单列；不要执行任何外部发布。`,
    provide: ["项目 README 与 research-log", "锁定提交和测试输出", "当前网页 URL", "交付对象与禁止动作"],
    skillDoes: ["压缩决定与未决问题", "把截图绑定真实坐标", "规划确定性演示路线", "把收口方法写成新 Skill"],
    runtimeDoes: ["读取本地文件", "执行 Node 测试", "驱动真实 Chromium", "保存本地文档与截图"],
    effect: ["采用备忘录", "证据索引", "网页演示路线", "READY：有边界交付"],
    skills: ["meeting-summary", "measured-ui-callouts", "web-demo-video", "style-skill-creator"],
    trigger: "把 Solo Skills 研究收口成可交付包",
    environment: "Windows · Node.js · Chromium · 本地文件",
    sideEffect: "只写本项目文档与截图；不触达外部账号",
    inputLabel: "INPUT / REAL REPOSITORY",
    input: `
      <div class="case-file"><code>README.md</code><span>状态：进行中 · 研究对象：bam-bam-2/solo-skills</span></div>
      <div class="case-file"><code>research-log.md</code><span>E1/E2 已通过；E3 部分通过；E4–E6 尚未执行</span></div>
      <div class="case-file"><code>upstream HEAD</code><span>d5789f592af17980054052fc7c05fe8a8e46be79</span></div>
      <div class="case-file"><code>structure test</code><span>26 个 Skill · 9 个代码文件 · MIT · 4/4 PASS</span></div>
      <div class="case-file"><code>showcase URL</code><span>http://127.0.0.1:4192/ · 外部 API 0</span></div>
      <p class="case-input-note">这些值来自当前子项目文件和已执行测试，不是为演示编造的业务数据。</p>`,
    logs: ["锁定版本与证据", "压缩研究结论", "组装交付产物", "执行交叉验证", "应用发布边界"],
    stages: [
      {
        status: "READY / 真实输入已装载", state: "idle", label: "OUTPUT / CONTRACT",
        kicker: "00 · 运行契约", title: "先回答“证据允许我们说到哪一步”",
        body: "这个案例最能说明 Skill 的意义：它不是再写一篇介绍，而是把真实研究文件按固定程序收口，并把结论强度限制在证据范围内。",
        tone: "neutral", calloutTitle: "INPUT CLASS: LIVE PROJECT", calloutBody: "真实版本、文件、测试和运行 URL；不含个人数据与外部账号。",
        facts: [["目标", "形成可采用、可复核、可继续实验的研究交付包"], ["边界", "结构与网页已验证；真实模型质量和外部副作用尚未验证"], ["产物", "采用备忘录 · 证据清单 · 演示路线 · Skill 候选"]]
      },
      {
        status: "PASS / 输入证据可追溯", state: "running", label: "OUTPUT / INTAKE AUDIT",
        kicker: "01 · 输入审计", title: "版本、许可证和测试结果先成为硬约束",
        body: "规程首先检查不可变上游标识、许可证、实验状态和失败记录，避免把 README 的自述当作全部事实。",
        tone: "success", calloutTitle: "5 SOURCES ACCEPTED", calloutBody: "固定 SHA、MIT、26/9 结构计数、4/4 测试和 E3 初始化缺陷均进入证据图。",
        facts: [["PASS", "上游 HEAD 与锁定 SHA 一致"], ["PASS", "26 个目录均有合法 frontmatter"], ["LIMIT", "notion_archive.py 无凭证启动存在 NameError"], ["OPEN", "跨客户端、真实模型与发送/删除安全仍待实验"]]
      },
      {
        status: "RUNNING / 交付结构已规划", state: "running", label: "OUTPUT / SKILL PLAN",
        kicker: "02 · 组合计划", title: "四种 Skill 思路各负责一段确定工作",
        body: "总结规程压缩结论，实测标注规程绑定截图，视频规程组织真实浏览器路径，风格 Skill 生成器把这次收口方式固化成机器可读指令。",
        tone: "success", calloutTitle: "COMPOSITION, NOT ORCHESTRATION MAGIC", calloutBody: "组合依赖明确输入输出；没有自动获得额外权限，也没有隐藏后台服务。",
        facts: [["meeting-summary", "结论 / 证据 / 未决问题三段式"], ["measured-ui-callouts", "用 DOM 坐标而非目测标注截图"], ["web-demo-video", "把页面关键交互写成确定性镜头"], ["style-skill-creator", "候选 Skill：research-study-closeout"]]
      },
      {
        status: "RUNNING / 四项产物已生成", state: "running", label: "OUTPUT / DELIVERY PACK",
        kicker: "03 · 产物生成", title: "研究结论被拆成四个可以继续使用的对象",
        body: "每个对象都有明确消费者：决策者读采用备忘录，复核者看证据索引，演示者走浏览器路线，后续 Agent 加载收口 Skill。",
        tone: "success", calloutTitle: "ARTIFACT SET / 4", calloutBody: "采用备忘录建议从低风险 Skill 试点；演示路线覆盖能力、机制、七案例和扩展路线。",
        artifactTitle: "adoption-memo.md / 核心结论",
        artifact: "采用：渐进加载、步骤规程、失败案例、人工门禁\n试点：meeting-summary / measured-ui-callouts / web-demo-video\n暂缓：发布、删除、SSH、秘密读取\n证据边界：结构与网页已验证；真实模型和外部副作用未验证",
        facts: [["01", "adoption-memo.md：先试 meeting-summary / measured-ui-callouts / web-demo-video"], ["02", "evidence-index.md：SHA、许可证、测试、失败与截图"], ["03", "showcase-tour.json：5 个镜头、16:9、32 秒、无音乐"], ["04", "research-study-closeout/SKILL.md：收口触发、步骤、护栏与验收"]]
      },
      {
        status: "PASS / 证据链一致", state: "running", label: "OUTPUT / VERIFICATION",
        kicker: "04 · 交叉验证", title: "功能结论转成测试，解释性结论回链证据",
        body: "检查数量、固定提交、无外部 API、浏览器视口和研究索引；同时确认所有“尚未验证”没有在交付文字中被改写成成功。",
        tone: "success", calloutTitle: "CONTRADICTION CHECK: PASS", calloutBody: "结构证据支持“可发现、可分层”；不支持“跨平台直接运行”或“无人值守安全”。",
        facts: [["TEST", "skill-structure.test.mjs：4/4"], ["TEST", "verify-showcase.mjs：26 Skill / 外部 API 0"], ["BROWSER", "桌面、平板、390px 和键盘路径进入验收"], ["CLAIM", "格式可迁移 ≠ 运行可迁移"]]
      },
      {
        status: "READY / 有边界交付", state: "complete", label: "OUTPUT / DECISION GATE",
        kicker: "05 · 决策门", title: "可以采用它的方法，但不能照搬它的环境",
        body: "建议把 Solo Skills 当成流程知识样本库，从三个低风险技能开始本地化；涉及发布、删除、SSH 和秘密访问的技能先进入适配与安全评测。",
        tone: "success", calloutTitle: "ADOPT METHOD / PILOT IMPLEMENTATION", calloutBody: "本轮交付可以支持试点决策；不能证明真实模型效果、账号集成或长期无人值守可靠性。",
        facts: [["DO", "复用渐进加载、明确步骤、失败案例和人工门禁"], ["PILOT", "研究摘要、实测标注、网页演示视频"], ["HOLD", "真实发送、删除、远程执行、秘密读取"], ["NEXT", "用脱敏固定样本做无 Skill / 原始 Skill / 本地化 Skill 对照实验"]]
      }
    ]
  },
  {
    id: "meeting",
    short: "会议运营",
    title: "产品周会转录到可发布纪要",
    source: "SANITIZED FIXTURE",
    sourceClass: "fixture",
    type: "知识提取 · 中等风险",
    summary: "用脱敏转录完整走过输入审计、证据映射、纪要成稿和发布门；缺失四分钟时，正确终态是 HOLD。",
    goal: "把一份长会议转录整理为可追溯的决定、行动项和发布前风险清单。",
    prompt: `使用 meeting-summary 和 meeting-minutes 整理 product-sync.txt。每条决定与行动项都要保留时间戳；负责人或期限不明确时写“未定”；发现转录缺失时禁止推断。先给我预览，不要写入 Notion 或发送 Discord。`,
    provide: ["会议转录或文件路径", "会议日期与参会人（若已知）", "目标输出语言", "是否允许外部发布"],
    skillDoes: ["识别已确认决定", "提取负责人、任务和期限", "保留未知与缺失", "组织固定纪要格式"],
    runtimeDoes: ["读取转录文件", "调用基础模型做抽取", "可选连接 Notion/Discord", "保存或发送最终产物"],
    effect: ["带时间戳的会议纪要", "3 条行动项", "缺失证据清单", "HOLD：等待人工补充"],
    skills: ["meeting-summary", "meeting-minutes"],
    trigger: "整理这次产品周会，并准备发布到 Notion 和 Discord",
    environment: "文本输入；真实发布需要 Notion / Discord 凭证",
    sideEffect: "页面仅预览；发布动作始终关闭",
    inputLabel: "INPUT / SANITIZED TRANSCRIPT",
    input: `
      <div class="transcript-lines compact">
        <p><time>10:02</time><strong>林</strong><span>9:16 演示视频下周三前给第一版，我负责。</span></p>
        <p><time>10:05</time><strong>周</strong><span>落地页文案今天收口；价格等财务确认。</span></p>
        <p class="transcript-gap"><time>10:08</time><strong>系统</strong><span>转录缺失 4 分 12 秒</span></p>
        <p><time>10:13</time><strong>林</strong><span>文案和价格都确认后再发布。</span></p>
        <p><time>10:16</time><strong>周</strong><span>我今天 18:00 前把文案放到共享文档。</span></p>
      </div>
      <p class="case-input-note">人物与内容均为脱敏拟真 fixture；缺口是故意注入的失败条件。</p>`,
    logs: ["审计转录完整性", "建立时间戳证据图", "生成结构化纪要", "检查负责人和期限", "执行发布门"],
    stages: [
      { status: "READY / 等待运行", state: "idle", label: "OUTPUT / CONTRACT", kicker: "00 · 运行契约", title: "不是先写总结，而是先定义可引用证据", body: "决定、负责人、任务和期限必须回到原始时间戳；缺失材料保持未知。", tone: "neutral", calloutTitle: "RELEASE TARGETS DISABLED", calloutBody: "Notion 与 Discord 仅作为目标说明，不会收到任何内容。", facts: [["输入", "5 条转录 · 2 位发言人 · 1 处缺失"], ["输出", "会议概览 · 决定 · 行动项 · 未决问题"], ["门禁", "证据完整性 + 负责人/期限 + 人工复核"]] },
      { status: "WARNING / 输入不完整", state: "running", label: "OUTPUT / INPUT AUDIT", kicker: "01 · 输入审计", title: "检测到 4 分 12 秒转录缺失", body: "继续处理现有证据，但禁止推断 10:08–10:12 发生了什么。", tone: "warning", calloutTitle: "DO NOT FABRICATE", calloutBody: "请求补录音或参会者确认；缺口进入最终风险。", facts: [["10:08", "完整性 FAIL"], ["KNOWN", "林、周两位发言人"], ["UNKNOWN", "缺失片段中的决定与任务"]] },
      { status: "PASS / 证据提取完成", state: "running", label: "OUTPUT / EVIDENCE MAP", kicker: "02 · 证据映射", title: "四条确定事实与两条未知被分开", body: "相似语义不会被用来填补未知价格、负责人或缺失片段。", tone: "success", calloutTitle: "4 KNOWN · 2 UNKNOWN", calloutBody: "每条确定项保留时间戳。", facts: [["10:02", "林负责演示视频，下周三"], ["10:05", "周收口文案，价格待财务"], ["10:13", "文案和价格确认后发布"], ["UNKNOWN", "价格值、财务负责人、确认期限"]] },
      { status: "RUNNING / 纪要草稿完成", state: "running", label: "OUTPUT / MINUTES", kicker: "03 · 结构化成稿", title: "决定、行动项和风险分别输出", body: "纪要成为后续人和自动化都能读取的结构化对象。", tone: "success", calloutTitle: "ONE-LINE DECISION", calloutBody: "先完成演示与文案；仅在文案和价格同时确认后发布。", artifactTitle: "product-sync-minutes.md", artifact: "## 核心决定\n- 文案与价格同时确认后才发布。[10:13]\n\n## 行动项\n- 林：9:16 演示第一版｜2026-09-02 [10:02]\n- 周：共享文档文案｜今日 18:00 [10:16]\n- 财务：确认价格｜负责人、期限待补 [10:05]\n\n## 风险\n- 10:08–10:12 转录缺失，不得推断。", facts: [["林", "9:16 演示第一版 · 2026-09-02"], ["周", "共享文档文案 · 今日 18:00"], ["财务", "确认价格 · 负责人/期限未指定"]] },
      { status: "WARNING / 质量检查未全过", state: "running", label: "OUTPUT / QA", kicker: "04 · 质量检查", title: "文本可读不代表可以发布", body: "格式和证据引用通过，但完整性、价格与责任归属未通过。", tone: "warning", calloutTitle: "2 PASS · 3 HOLD", calloutBody: "缺失信息必须在发布前由人补齐。", facts: [["PASS", "已有决定都能定位时间戳"], ["PASS", "行动项格式完整"], ["HOLD", "转录缺口"], ["HOLD", "价格与财务责任未确认"]] },
      { status: "HOLD / 需要人工确认", state: "complete", label: "OUTPUT / RELEASE GATE", kicker: "05 · 发布门", title: "Notion 和 Discord 发布保持关闭", body: "正确结果是请求补充并等待复核，而不是用流畅文字掩盖证据不足。", tone: "hold", calloutTitle: "HUMAN REVIEW REQUIRED", calloutBody: "补齐录音或参会者确认；确认价格、负责人和期限；复核后再发布。", facts: [["NEXT", "补充 → 人工复核 → 再运行发布门"], ["SIDE EFFECT", "0 个外部写入"], ["RECOVERY", "无需撤回，因为尚未发布"]] }
    ]
  },
  {
    id: "workshop",
    short: "Skill 设计",
    title: "把运营经理的重复工作访谈成一个 Skill 设计包",
    source: "SANITIZED FIXTURE",
    sourceClass: "fixture",
    type: "元能力 · 配置依赖",
    summary: "按照 workshop-prep 的一问一答、流程映射和技术探测，把模糊的“每周很忙”变成 weekly-campaign-brief 设计目录。",
    goal: "把一个人反复做、但还说不清楚的工作，访谈成可以实现和测试的 Agent Skill。",
    prompt: `使用 workshop-prep 帮我设计 weekly-campaign-brief。我每周五需要从 Notion 活动库、CSV 和竞品链接整理三条产品线周报，再把页面链接发到 Slack。一次只问一个问题；数字必须带来源，缺失数据保留“待补”。最后生成设计书、问答记录、.env.example、.gitignore 和集成指南目录，不要连接真实工作区。`,
    provide: ["角色与重复工作的频率", "任务起点、步骤和最终产物", "使用的应用与数据源", "不能出错的业务规则"],
    skillDoes: ["逐问访谈并控制范围", "把流程映射为输入输出", "判断脚本或 MCP 集成", "生成设计目录和 Golden Cases"],
    runtimeDoes: ["查询最新官方集成文档", "创建本地文件目录", "后续配置 MCP/脚本", "注入工作区秘密"],
    effect: ["weekly-campaign-brief 设计包", "2 个集成占位指南", "3 组测试样本", "SETUP：需要真实配置"],
    skills: ["workshop-prep", "harness"],
    trigger: "帮我准备工作坊，设计一个能省下周报时间的 Skill",
    environment: "设计可本地生成；最新集成指南依赖 Context7 / 官方文档",
    sideEffect: "只生成设计文件；不写入 Slack 或 Notion",
    inputLabel: "INPUT / SANITIZED INTERVIEW",
    input: `
      <div class="qa-list"><p><strong>Q1 角色</strong><span>内容运营经理，负责三条产品线。</span></p><p><strong>Q2 重复工作</strong><span>每周五汇总活动数据、竞品动态和下周计划，约 2.5 小时。</span></p><p><strong>Q3 起点</strong><span>浏览器收藏夹、Notion 活动库、CSV 导出。</span></p><p><strong>Q4 结果</strong><span>Notion 新页面，并把链接发到 Slack。</span></p><p><strong>Q5 规则</strong><span>数字必须带来源；没数据的产品线保留“待补”。</span></p></div>
      <p class="case-input-note">这是完整脱敏访谈 fixture，用于展示设计过程，不含真实 Token。</p>`,
    logs: ["检查设计前提", "映射重复流程", "探测集成方式", "生成设计目录", "应用配置门"],
    stages: [
      { status: "READY / 访谈已装载", state: "idle", label: "OUTPUT / CONTRACT", kicker: "00 · 运行契约", title: "先把“周报很烦”变成可观察问题", body: "频率、耗时、起点、步骤、结果和失败条件都必须明确。", tone: "neutral", calloutTitle: "EXPECTED SAVING: 2H / WEEK", calloutBody: "最终目标不是生成漂亮文字，而是稳定完成数据到周报的流程。", facts: [["频率", "每周一次"], ["现状", "2.5 小时人工汇总"], ["成功", "数字有来源，缺失明确，链接可分享"]] },
      { status: "PASS / 重复任务已定位", state: "running", label: "OUTPUT / PROCESS MAP", kicker: "01 · 流程访谈", title: "触发、输入、过程和结果已经闭合", body: "Skill 被命名为 weekly-campaign-brief，并限定只处理三条产品线。", tone: "success", calloutTitle: "SCOPE: APPROPRIATE", calloutBody: "一个双向数据源和一个单向通知，适合先做完整闭环。", facts: [["TRIGGER", "每周五 16:00 或“生成本周活动简报”"], ["INPUT", "Notion 活动库 + CSV + 竞品链接"], ["OUTPUT", "Notion 页面 + Slack 链接"]] },
      { status: "WARNING / 集成需配置", state: "running", label: "OUTPUT / TECH MAP", kicker: "02 · 技术探测", title: "Notion 是双向，Slack 只是单向通知", body: "业务规程和平台适配被分开，避免把 Token 与频道硬编码进 Skill。", tone: "warning", calloutTitle: "2 INTEGRATIONS DETECTED", calloutBody: "Notion 推荐 MCP；Slack 使用发送脚本即可。最新设置指南需 Context7 或官方文档核验。", facts: [["Notion", "读取活动库 + 创建页面 → MCP"], ["Slack", "只发送链接 → script"], ["SECRET", "NOTION_API_KEY / SLACK_BOT_TOKEN"]] },
      { status: "RUNNING / 设计包已生成", state: "running", label: "OUTPUT / DESIGN PACKAGE", kicker: "03 · 设计生成", title: "访谈被变成可以实现的目录和契约", body: "设计文件记录问题、输入、步骤、异常、环境变量、验收和集成指南位置。", tone: "success", calloutTitle: "5 FILES · 2 GUIDE PLACEHOLDERS", calloutBody: "真实 Token 不进入设计包；.env 被 .gitignore 排除。", artifactTitle: "weekly-campaign-brief/", artifact: "weekly-campaign-brief/\n├─ weekly-campaign-brief-设计书.md\n├─ 事前问卷回答.md\n├─ .env.example\n├─ .gitignore\n└─ 集成指南/\n   ├─ Notion.md\n   └─ Slack.md\n\n流程：每周触发 → 读取活动库/CSV → 来源校验 → 生成页面 → 发送链接", facts: [["weekly-campaign-brief-设计书.md", "流程与验收"], ["事前问卷回答.md", "完整 Q&A"], [".env.example", "变量名与发放地址"], ["集成指南/", "Notion.md · Slack.md"]] },
      { status: "PASS / 设计可验证", state: "running", label: "OUTPUT / DESIGN QA", kicker: "04 · 设计检查", title: "数字来源和缺失处理成为 Golden Cases", body: "用三个固定样本验证正常、单产品线缺失、集成失败三类路径。", tone: "success", calloutTitle: "DESIGN CONTRACT: PASS", calloutBody: "没有数据时输出“待补”，不能编造增长率；Slack 失败不回滚已生成的 Notion 草稿。", facts: [["CASE 1", "三产品线齐全 → 完整简报"], ["CASE 2", "一条缺失 → 待补 + 来源空缺"], ["CASE 3", "通知失败 → 保留页面 + 可重试"]] },
      { status: "SETUP / 实现前需配置", state: "complete", label: "OUTPUT / SETUP GATE", kicker: "05 · 配置门", title: "设计已完成，外部集成还不能声称可运行", body: "缺少 Context7/官方集成核验、Notion 授权和 Slack Token，因此停在可实现设计包，而不是假装部署成功。", tone: "warning", calloutTitle: "SETUP REQUIRED", calloutBody: "核验最新官方文档 → 配置测试工作区 → 注入秘密 → 再做沙箱集成测试。", facts: [["READY", "Skill 设计、文件契约、测试样本"], ["MISSING", "真实集成配置和凭证"], ["SIDE EFFECT", "0 个外部写入"]] }
    ]
  },
  {
    id: "video",
    short: "演示视频",
    title: "把当前研究网页变成 32 秒确定性产品演示",
    source: "LIVE TARGET + REAL RENDER",
    sourceClass: "live",
    type: "脚本增强 · 本地媒体",
    summary: "以当前 4192 页面为真实目标，实际驱动同源网页、捕获 640 个源帧并用 FFmpeg 交付经过探针和代表帧目检的 MP4。",
    goal: "把一个真实网页的关键操作变成可重复渲染、适合展示的产品演示视频。",
    prompt: `使用 web-demo-video 和 measured-ui-callouts，为 http://127.0.0.1:4192/ 制作一条 16:9、1920×1080、32 秒、无音乐的真实演示视频。镜头依次展示 26 个 Skill、五层机制、真实视频案例和采用结论。坐标必须来自 DOM 测量，时间轴必须由 frameIndex 决定；立即执行本地帧捕获和 FFmpeg 编码，完成后用 ffprobe 和代表帧目检，不执行任何外部发布。`,
    provide: ["真实网页 URL", "投放渠道与画面比例", "时长、声音和参考方向", "必须展示的关键操作"],
    skillDoes: ["选择视频规格", "编写确定性时间轴", "使用真实鼠标事件与 DOM 坐标", "定义帧、编码与清理检查"],
    runtimeDoes: ["启动同源网页服务", "驱动 Chromium 捕获帧", "调用 FFmpeg 编码", "播放并目检成品"],
    effect: ["32 秒真实 MP4", "640 个源帧已捕获", "H.264 / yuv420p 已验证", "READY：本地媒体已交付"],
    skills: ["web-demo-video", "measured-ui-callouts"],
    trigger: "给这个 Solo Skills 展厅做一条落地页 16:9 演示视频",
    environment: "同源本地服务 · Chromium · FFmpeg",
    sideEffect: "已生成约 3.3MB 本地 MP4、海报与接触表；640 个临时 PNG 已清理",
    realDelivery: {
      title: "真实网页已经交付为 32 秒演示视频",
      summary: "视频实际操作当前研究展厅；不是静态 mockup，也不是只展示一条 FFmpeg 命令。",
      video: "media/solo-skills-real-demo.mp4",
      poster: "media/solo-skills-real-demo-poster.jpg",
      evidence: "media/solo-skills-real-demo-evidence.json",
      stats: ["1920×1080", "32.00 秒", "640 帧 @ 20fps", "H.264 · yuv420p", "无音轨", "3.3MB"]
    },
    inputLabel: "INPUT / LIVE WEB TARGET",
    input: `<div class="case-file"><code>URL</code><span>http://127.0.0.1:4192/</span></div><div class="case-file"><code>用途</code><span>研究首页与演示汇报</span></div><div class="case-file"><code>规格</code><span>16:9 · 1920×1080 · 32 秒 · 无音乐</span></div><div class="case-file"><code>镜头重点</code><span>26 Skill → 五层原理 → 真实视频案例 → 采用结论</span></div><p class="case-input-note">目标页面、浏览器交互、640 个源帧和最终媒体均已真实执行；没有使用账号、Token 或个人数据。</p>`,
    logs: ["确认输出规格", "编译确定性时间轴", "捕获 640 个真实网页帧", "FFmpeg 编码与 ffprobe", "完成媒体交付门"],
    stages: [
      { status: "READY / 真实目标在线", state: "idle", label: "OUTPUT / VIDEO CONTRACT", kicker: "00 · 运行契约", title: "先确认用途、比例、时长和声音", body: "落地页演示选择 16:9、32 秒、无音乐；目标是让观众理解能力与边界。", tone: "neutral", calloutTitle: "TARGET RESPONDS / LOCAL", calloutBody: "页面和舞台必须同源，才能从 iframe 触发真实鼠标事件。", facts: [["FORMAT", "1920×1080 · H.264 · yuv420p"], ["DURATION", "32 秒"], ["AUDIO", "无"], ["PRIVACY", "页面没有真实个人数据"]] },
      { status: "PASS / 镜头表已确定", state: "running", label: "OUTPUT / STORYBOARD", kicker: "01 · 镜头规划", title: "五个镜头对应五个理解问题", body: "每个镜头有开始、动作、停留和结束状态，避免录屏时随意滚动。", tone: "success", calloutTitle: "5 SHOTS / 32 SECONDS", calloutBody: "首尾各 3 秒，中间交互留足阅读停顿。", facts: [["00–03s", "标题：它不是 Agent 框架"], ["03–09s", "筛选 26 个 Skill"], ["09–15s", "切换五层机制"], ["15–27s", "运行旗舰案例"], ["27–32s", "采用结论与固定 SHA"]] },
      { status: "RUNNING / 时间轴已编译", state: "running", label: "OUTPUT / TIMELINE", kicker: "02 · 确定性时间轴", title: "每一帧只由 frameIndex 决定", body: "不使用实时定时器；点击、滚动和案例切换都绑定时间 t，重复渲染得到相同状态。", tone: "success", calloutTitle: "640 SOURCE FRAMES @ 20 FPS", calloutBody: "使用元素 getBoundingClientRect() 计算目标，不硬编码目测坐标。", facts: [["STATE", "__tick(frameIndex)"], ["EVENT", "真实 MouseEvent"], ["COORD", "DOM rect"], ["CAPTURE", "100–150 帧分批"]] },
      { status: "PASS / 640 帧已捕获", state: "running", label: "OUTPUT / REAL RENDER", kicker: "03 · 帧与编码", title: "真实 Chromium 帧已经进入 FFmpeg", body: "舞台按 frameIndex 重建滚动、筛选、机制切换、案例和阶段状态；源帧编码完成后从系统临时目录清理。", tone: "success", calloutTitle: "ARTIFACT: solo-skills-real-demo.mp4", calloutBody: "640 个 1920×1080 PNG → libx264 CRF 22 → faststart MP4。", artifactTitle: "真实时间轴与产物", artifact: "00.0–03.0  定位：场景规程成为能力\n03.0–09.0  筛选：全部 → 脚本增强\n09.0–15.0  机制：发现 → 护栏\n15.0–27.0  案例：video 从契约到 5/5\n27.0–32.0  结尾：更会完成工作\n\nCAPTURED 640 frames @20fps → ENCODED H.264 yuv420p", facts: [["video-stage.html", "永久确定性舞台"], ["solo-skills-real-demo.mp4", "3,297,168 bytes"], ["contact-sheet.jpg", "6 个代表帧"], ["cleanup", "临时源帧已移除"]] },
      { status: "PASS / 媒体实测通过", state: "running", label: "OUTPUT / MEDIA QA", kicker: "04 · 质量检查", title: "代表帧和最终容器都已检查", body: "接触表确认标题、真实网页、焦点、比例和结尾完整；ffprobe 确认视频规格和无音轨。", tone: "success", calloutTitle: "MEDIA QA: PASS", calloutBody: "1920×1080 · 32.00 秒 · 640 帧 · H.264 High · yuv420p · audio 0。", facts: [["PASS", "同源 iframe + 真实 MouseEvent"], ["PASS", "坐标来自 DOM 测量"], ["PASS", "6 个代表帧无裁切"], ["PASS", "ffprobe 硬性规格"]] },
      { status: "READY / 真实媒体已交付", state: "complete", label: "OUTPUT / DELIVERY GATE", kicker: "05 · 交付门", title: "这次不是计划，而是可直接播放的 MP4", body: "真实网页、浏览器交互、源帧、编码、探针和目检已经形成闭环；外部发布仍不在本次授权范围。", tone: "success", calloutTitle: "REAL MEDIA DELIVERED", calloutBody: "在上方真实交付卡直接播放，或打开结构化 evidence 复核生成参数和状态检查点。", facts: [["READY", "MP4 + poster + contact sheet"], ["VERIFIED", "ffprobe + browser checkpoints"], ["SIDE EFFECT", "仅本地媒体文件，无外部发布"]] }
    ]
  },
  {
    id: "launch",
    short: "内容发布",
    title: "从活动信息到双渠道销售文案与回帖队列",
    source: "SANITIZED FIXTURE",
    sourceClass: "fixture",
    type: "内容运营 · 外部副作用",
    summary: "组合 event-sales-script 与 threads-reply，产出七阶段双渠道文案、评论筛选和 dry-run 发布清单；没有批准时绝不加 --go。",
    goal: "把一次活动的事实层扩展成多阶段、多渠道的销售内容，并安全处理评论回复。",
    prompt: `使用 event-sales-script 和 threads-reply，为“Agent Workflow Lab”生成微信群与 Threads 的 7 阶段售票文案，并为 comments.json 中合格评论生成连续编号回复。所有价格、日期和席位只能来自活动 brief；排除政治、争议和重复评论；先运行 dry-run 并展示全部草稿，没有我的编号批准不要发布。`,
    provide: ["活动名称、日期、地点和对象", "价格、席位与报名方式", "渠道与语气要求", "评论列表和历史跳过清单"],
    skillDoes: ["生成 7×2 渠道文案", "保持跨渠道事实一致", "筛选和编号回复对象", "默认 dry-run 并等待批准"],
    runtimeDoes: ["读取评论与历史日志", "调用 Threads API", "使用账号 Token", "控制发布间隔和幂等"],
    effect: ["14 份活动文案", "5 条回复草稿", "3 条排除记录", "REVIEW：等待编号批准"],
    skills: ["event-sales-script", "threads-reply"],
    trigger: "为 Agent Workflow Lab 生成售票文案和首轮回帖",
    environment: "文案可本地生成；真实发布依赖 Threads API / 社群账号",
    sideEffect: "默认 dry-run；真实发布必须单独明确批准",
    inputLabel: "INPUT / SANITIZED EVENT BRIEF",
    input: `<div class="case-file"><code>活动</code><span>Agent Workflow Lab · 2026-09-12 · 上海</span></div><div class="case-file"><code>对象</code><span>独立开发者与 3–10 人产品团队</span></div><div class="case-file"><code>票价</code><span>早鸟 ¥399 / 正价 ¥499 · 限 36 席</span></div><div class="case-file"><code>渠道</code><span>微信群公告 + Threads 个人叙事</span></div><div class="case-file"><code>评论 fixture</code><span>8 条：5 正常、1 政治、1 争议、1 重复</span></div><p class="case-input-note">活动与账号均为脱敏拟真 fixture；不会连接任何真实社交平台。</p>`,
    logs: ["校验活动必填项", "生成七阶段双渠道文案", "筛选回帖对象", "运行 dry-run 与去重", "等待人工批准"],
    stages: [
      { status: "READY / 活动信息齐全", state: "idle", label: "OUTPUT / PUBLISH CONTRACT", kicker: "00 · 运行契约", title: "生成与发布是两个不同权限层", body: "本流程可以准备全部内容，但外部发布始终需要明确批准。", tone: "neutral", calloutTitle: "DEFAULT MODE: DRY RUN", calloutBody: "只有显式 --go 才能发布；本网页永远不会提供真实 Token。", facts: [["OUTPUT", "7 阶段 × 2 渠道"], ["REPLIES", "筛选、编号、一次性批准"], ["RISK", "公开发布与重复发送"]] },
      { status: "PASS / 必填信息完整", state: "running", label: "OUTPUT / BRIEF AUDIT", kicker: "01 · 信息审计", title: "日期、地点、对象、价格、数量和申请方式都有值", body: "不需要猜测票价或席位；渠道语气可以从同一事实层派生。", tone: "success", calloutTitle: "6 REQUIRED FIELDS / PASS", calloutBody: "所有数字进入单一活动事实表，避免两渠道不一致。", facts: [["FACT", "2026-09-12 · 上海"], ["PRICE", "¥399 → ¥499"], ["CAP", "36 席"], ["CTA", "脱敏报名链接"]] },
      { status: "RUNNING / 14 份渠道草稿", state: "running", label: "OUTPUT / CAMPAIGN SET", kicker: "02 · 七阶段文案", title: "同一活动事实，两个渠道采用不同表达", body: "微信群保留信息密度与报名动作；Threads 采用个人经历和短句，但数字保持一致。", tone: "success", calloutTitle: "7 STEPS × 2 CHANNELS", calloutBody: "先公开、个别 DM、名单更新、倒计时、中期更新、问卷、售罄公告均已覆盖。", artifactTitle: "STEP 1 / 双渠道样稿", artifact: "[微信群]\n9 月 12 日在上海做一场 Agent Workflow Lab。36 席，早鸟 ¥399。我们会把一个重复工作现场拆成可测试 Skill，报名：<fixture-link>\n\n[Threads]\n我花了几个月才意识到，AI 最浪费时间的地方不是不会写。\n是每次都要重新解释。\n9 月 12 日，36 个人一起把一个重复工作写成 Skill。早鸟 ¥399。", facts: [["STEP 1", "首发：为什么做这个实验室"], ["STEP 4", "D-1：早鸟结束与剩余席位"], ["STEP 7", "售罄后只开放候补，不虚构稀缺"]] },
      { status: "WARNING / 3 条评论被排除", state: "running", label: "OUTPUT / REPLY QUEUE", kicker: "03 · 回帖筛选", title: "先确定对象，再生成编号草稿", body: "政治、争议和已处理评论从队列移除；5 条正常评论按原上下文生成短回复。", tone: "warning", calloutTitle: "5 DRAFTS · 3 SKIPPED", calloutBody: "跳过项进入 skiplist，下一轮不会再次拿来询问。", artifactTitle: "reply-queue.json / 摘要", artifact: "1. ‘不会写代码能来吗？’ → 可以。现场从重复工作开始，不从代码开始。\n2. ‘能带自己公司的流程吗？’ → 可以，先做脱敏版本。\n3. ‘会提供模板吗？’ → 会带走设计书、测试样本和 Skill 骨架。\n4–5. 已生成，等待同一批次批准。\n\nSKIPPED: 政治 1 / 争议 1 / 重复 1", facts: [["SKIP", "政治内容 1"], ["SKIP", "负面争议 1"], ["SKIP", "已处理重复 1"], ["DRAFT", "5 条连续编号，等待批量批准"]] },
      { status: "PASS / dry-run 无副作用", state: "running", label: "OUTPUT / DRY RUN", kicker: "04 · 发布前验证", title: "解析、身份、重复和间隔规则全部预演", body: "脚本只输出将要发布的内容与目标，不调用发布端点。", tone: "success", calloutTitle: "--go ABSENT / 0 POSTS", calloutBody: "发布前仍需复核用户名、评论 ID、父帖 ID 和既有回复。", facts: [["PASS", "5 个目标 ID 唯一"], ["PASS", "批次无重复"], ["PLAN", "真实发布间隔 30–45 秒"], ["SIDE EFFECT", "0"]] },
      { status: "REVIEW / 等待人工批准", state: "complete", label: "OUTPUT / APPROVAL GATE", kicker: "05 · 人工批准门", title: "全部草稿可读，但仍然不发布", body: "用户需要批准具体编号；平台自动制裁过的内容只能删除，不能未经批准改写后重发。", tone: "hold", calloutTitle: "HUMAN APPROVAL REQUIRED", calloutBody: "批准 1–5 或指定修改 → 再验证目标 → 才允许显式发布。", facts: [["READY", "14 份活动文案 + 5 条回帖草稿"], ["HOLD", "真实账号与发布批准"], ["RECOVERY", "没有外部动作，无需撤回"]] }
    ]
  },
  {
    id: "brief",
    short: "每日情报",
    title: "从 22 篇候选中选出真正有增量的三条晨报",
    source: "SANITIZED FIXTURE",
    sourceClass: "fixture",
    type: "常驻自动化 · 远程依赖",
    summary: "模拟 daily-brief-bot 的收集、与最近研究上下文对照、三条选择、原文校验、DM 预览和 done 去重。",
    goal: "每天只收到与当前工作相关、但尚未实践过的少量高价值情报，而不是热门链接堆积。",
    prompt: `使用 daily-brief-bot，每天 10:00 从候选文章中选择最多 3 条。先读正文，再与最近 7 天的研究记录和 done.jsonl 对照；已做过的不要重复。每条写清方法、与当前研究的连接以及今天 30 分钟可以做什么。先生成 Discord DM 预览，本次不要发送。`,
    provide: ["候选来源及正文", "最近 7 天工作上下文", "已完成 done 列表", "投递时间、渠道与文字要求"],
    skillDoes: ["按相关性与新颖性筛选", "对照记忆去重", "生成文章式三条晨报", "校验来源后再投递"],
    runtimeDoes: ["定时收集网络来源", "运行模型与回退", "维护状态和保留期", "通过 Discord 发送与回收反馈"],
    effect: ["3 条晨报正文", "7 条重复内容被排除", "3 个当日动作", "DRY RUN：DM 未发送"],
    skills: ["daily-brief-bot", "remote-offload", "claude-codex-fallback"],
    trigger: "每天 10:00 给我一份和当前研究相关、但我还没做过的三条晨报",
    environment: "真实版本依赖远程机器、定时器、模型与 Discord",
    sideEffect: "本案例只生成 DM 预览；不调度、不发送",
    inputLabel: "INPUT / SANITIZED SOURCE SET",
    input: `<div class="case-file"><code>候选</code><span>22 篇脱敏文章 fixture，带 source_id 与正文摘要</span></div><div class="case-file"><code>最近 7 天</code><span>Agent Skills · 浏览器证据 · Windows 可迁移性</span></div><div class="case-file"><code>已完成</code><span>SK-004 结构清单 · SK-011 三视口截图</span></div><div class="case-file"><code>投递</code><span>Discord DM · 每日 10:00 · 最多 3 条</span></div><p class="case-input-note">来源 ID 和正文均为脱敏 fixture；不声称来自今天的真实互联网。</p>`,
    logs: ["收集候选与正文", "对照最近工作上下文", "选择三条增量", "验证来源与去重", "生成 DM dry-run"],
    stages: [
      { status: "READY / 候选集已装载", state: "idle", label: "OUTPUT / BRIEF CONTRACT", kicker: "00 · 运行契约", title: "不是“热门榜”，而是当前工作旁边的未知量", body: "选择标准同时看相关性、新颖性、可执行性和是否已经做过。", tone: "neutral", calloutTitle: "MAX 3 · MAY RETURN 0", calloutBody: "没有合格内容时允许空报，不为了凑数制造价值。", facts: [["INPUT", "22 篇正文 fixture"], ["CONTEXT", "最近 7 天研究主题"], ["MEMORY", "done 列表与已知笔记"]] },
      { status: "PASS / 22 篇正文可用", state: "running", label: "OUTPUT / COLLECTION", kicker: "01 · 收集", title: "先保存正文与来源 ID，再做摘要", body: "只拿标题会导致错误选择；每个候选都保留来源映射。", tone: "success", calloutTitle: "22 / 22 SOURCE MAPPED", calloutBody: "其中 4 篇因正文不足降级，仍保留在审计记录。", facts: [["18", "正文完整"], ["4", "正文不足"], ["0", "来源 ID 丢失"]] },
      { status: "RUNNING / 3 条增量被选中", state: "running", label: "OUTPUT / RANKING", kicker: "02 · 上下文对照", title: "相关但已经做过的内容被排除", body: "三条选择分别补足 Skill 权限清单、失败恢复和真实评测设计。", tone: "success", calloutTitle: "3 SELECTED · 7 DUPLICATES REMOVED", calloutBody: "done.jsonl 和最近研究记录共同阻止重复建议。", facts: [["01", "为 Skill 建立最小权限 manifest"], ["02", "对外发布使用幂等键与补偿动作"], ["03", "用人工修改量评估流程 Skill"]] },
      { status: "RUNNING / 晨报正文完成", state: "running", label: "OUTPUT / LETTER", kicker: "03 · 文章式晨报", title: "每一条都说明方法、与你的连接和今天 30 分钟动作", body: "读者不点击链接也能理解核心内容；术语首次出现时用中文解释。", tone: "success", calloutTitle: "3 ITEMS · 2,184 CHARS", calloutBody: "最后一条故意选择此前没记录过、但紧邻当前研究的问题。", artifactTitle: "brief-preview.md / 三条动作", artifact: "你最近在把“能读懂的 Skill”推进到“能安全运行的 Skill”。今天三条都围绕这个缝隙。\n\n1. 权限 manifest：先标注文件、网络、发送、删除。今天给 7 个案例补一列权限。\n2. 幂等键：让同一发布批次不会重复发送。今天为 launch fixture 加 run_id。\n3. 人工修改量：别只看正确率。今天记录无 Skill 对照组修改了几分钟。", facts: [["ACTION 1", "给 7 个案例标注文件/网络/发送/删除权限"], ["ACTION 2", "为发布案例增加 idempotency fixture"], ["ACTION 3", "记录无 Skill 对照组人工修改分钟数"]] },
      { status: "PASS / 来源和去重通过", state: "running", label: "OUTPUT / VERIFICATION", kicker: "04 · 链接与重复检查", title: "三条结论都能回到本次候选集", body: "来源不在 posts fixture、已在 done 列表或链接缺失的条目不会进入 DM。", tone: "success", calloutTitle: "3 / 3 VERIFIED", calloutBody: "真实系统还需要验证网络失败、模型回退和 Discord 分段。", facts: [["PASS", "source_id 在候选集"], ["PASS", "not in done"], ["PASS", "每条包含今日动作"], ["OPEN", "远程与 Discord 故障路径"]] },
      { status: "DRY RUN / DM 未发送", state: "complete", label: "OUTPUT / DISPATCH GATE", kicker: "05 · 投递门", title: "预览完成，调度器和 Discord 仍保持关闭", body: "页面证明选择与格式流程，不证明每天 10 点的远程任务、模型回退或 Discord Token 可用。", tone: "warning", calloutTitle: "DISPATCH DISABLED", calloutBody: "真实试点需要沙箱 Discord、定时器健康检查、失败告警和 30 天数据保留验证。", facts: [["READY", "三条晨报预览"], ["PENDING", "远程主机 / 模型 / Discord"], ["SIDE EFFECT", "0 条 DM"]] }
    ]
  },
  {
    id: "cleanup",
    short: "安全清理",
    title: "把“删掉这些 Notion 草稿”升级成可预览、可恢复的归档操作",
    source: "PROPOSED GUARDRAIL",
    sourceClass: "proposal",
    type: "破坏性操作 · 建议增强",
    summary: "上游 notion-delete 会直接归档；本案例明确展示我们建议加的目标解析、dry-run、数量门槛、批准和恢复证据。",
    goal: "批量清理过期空白草稿，同时确保目标可核对、动作可恢复、部分失败可重试。",
    prompt: `使用 notion-delete 处理“活动内容库 / Drafts”中状态为草稿、正文为空且 30 天未编辑的页面。先解析并列出精确标题、页面 ID 摘要、数量和恢复窗口，只运行 dry-run；加入数量阈值 10、幂等键和恢复 manifest。没有我对这批精确目标的批准，不要调用 Notion API。`,
    provide: ["数据库与筛选条件", "可接受的数量阈值", "恢复窗口与测试工作区", "对精确目标的最终批准"],
    skillDoes: ["解析页面 URL/ID", "执行 Notion 归档动作", "说明 30 天恢复窗口", "本研究建议补 preview/幂等/恢复"],
    runtimeDoes: ["查询数据库并解析目标", "使用 Notion Token", "调用归档 API", "记录结果并执行重试/恢复"],
    effect: ["3 个精确归档目标", "archive-plan.json", "部分失败恢复方案", "HOLD：等待精确批准"],
    skills: ["notion-delete"],
    trigger: "把活动数据库里 30 天前的空白草稿删掉",
    environment: "真实归档需要 Notion API 与数据库权限",
    sideEffect: "本案例只生成归档计划；没有用户明确批准不执行",
    inputLabel: "INPUT / SANITIZED PAGE SET",
    input: `<div class="case-file"><code>数据库</code><span>活动内容库 / Drafts（fixture）</span></div><div class="case-file"><code>筛选</code><span>状态=草稿 · 正文为空 · 最后编辑早于 30 天</span></div><div class="case-file"><code>匹配</code><span>3 页：秋季海报、候补说明、旧票价 FAQ</span></div><div class="case-file"><code>恢复</code><span>Notion 归档可在 30 天内从垃圾桶恢复</span></div><p class="case-input-note">上游原始 Skill 是“立即归档”；以下预览与批准门是研究建议，不冒充上游已有能力。</p>`,
    logs: ["解析精确页面 ID", "验证筛选与数量", "生成可审计预览", "模拟归档与恢复", "等待显式批准"],
    stages: [
      { status: "READY / 增强护栏已启用", state: "idle", label: "OUTPUT / DELETE CONTRACT", kicker: "00 · 运行契约", title: "“删除”先被改写成可恢复归档计划", body: "必须解析精确目标、展示数量和标题，并说明恢复窗口。", tone: "neutral", calloutTitle: "UPSTREAM GAP IDENTIFIED", calloutBody: "原始 Skill 会立即调用归档；本案例加入的 dry-run 和批准门属于建议增强。", facts: [["ACTION", "archive, not permanent delete"], ["MATCH", "必须满足三个筛选条件"], ["AUTH", "需要对精确 3 页的明确批准"]] },
      { status: "PASS / 目标已解析", state: "running", label: "OUTPUT / TARGET RESOLUTION", kicker: "01 · 目标解析", title: "自然语言筛选落到三个精确页面 ID", body: "任何无法解析或跨数据库的页面都会被排除。", tone: "success", calloutTitle: "3 TARGETS / SAME DATABASE", calloutBody: "页面 ID 在 UI 中只显示短摘要，完整值进入本地审计日志。", facts: [["pg_7f2…", "秋季海报 · 空白 · 45 天"], ["pg_a91…", "候补说明 · 空白 · 38 天"], ["pg_c03…", "旧票价 FAQ · 空白 · 63 天"]] },
      { status: "WARNING / 高风险动作待确认", state: "running", label: "OUTPUT / DRY RUN PLAN", kicker: "02 · 归档预览", title: "用户能在动作前看到全部目标和恢复方式", body: "数量阈值为 10；本批次 3 页，可进入人工批准，但仍不会自动执行。", tone: "warning", calloutTitle: "DRY RUN / NO API CALL", calloutBody: "预览包含数据库、标题、页面 ID 摘要、最后编辑时间与恢复窗口。", artifactTitle: "archive-plan.json", artifact: "run_id: cleanup-fixture-20260830-01\ndatabase: 活动内容库 / Drafts\nmode: dry-run\nthreshold: 10\ntargets:\n  - pg_7f2… / 秋季海报 / 45 days\n  - pg_a91… / 候补说明 / 38 days\n  - pg_c03… / 旧票价 FAQ / 63 days\nrecovery: Notion trash / 30 days\napproved: false", facts: [["COUNT", "3 ≤ threshold 10"], ["RECOVERY", "30 天垃圾桶"], ["EXCLUDED", "2 个有正文草稿"]] },
      { status: "RUNNING / 归档调用已模拟", state: "running", label: "OUTPUT / SANDBOX EXECUTION", kicker: "03 · 沙箱执行", title: "每个目标使用独立幂等键并记录结果", body: "模拟第二页暂时失败；成功项不重复执行，失败项可以单独重试。", tone: "warning", calloutTitle: "2 WOULD ARCHIVE · 1 WOULD RETRY", calloutBody: "这套部分失败恢复也是建议增强，不是上游脚本当前已证明的能力。", facts: [["pg_7f2…", "SIMULATED 200"], ["pg_a91…", "SIMULATED 429 · retry-after"], ["pg_c03…", "SIMULATED 200"]] },
      { status: "PASS / 恢复路径可说明", state: "running", label: "OUTPUT / RECOVERY CHECK", kicker: "04 · 恢复验证", title: "审计记录足以定位每个归档对象", body: "恢复说明和运行 manifest 会被保留，避免只知道“删过一批”却不知道具体是什么。", tone: "success", calloutTitle: "RECOVERY MANIFEST READY", calloutBody: "真实环境仍需在测试工作区验证 archive 与 restore 权限。", facts: [["MANIFEST", "run_id · page_id · previous state"], ["RETRY", "只重试 429 目标"], ["RESTORE", "测试工作区验证后才能进入生产"]] },
      { status: "HOLD / 等待精确批准", state: "complete", label: "OUTPUT / DESTRUCTIVE GATE", kicker: "05 · 破坏性操作门", title: "没有“批准这 3 页”就不会调用 Notion", body: "即使可恢复，归档仍会改变团队可见状态；自然语言原始请求不视为最终执行批准。", tone: "hold", calloutTitle: "EXPLICIT APPROVAL REQUIRED", calloutBody: "用户复核 3 个目标 → 在测试工作区验证 → 才能执行生产归档。", facts: [["SIDE EFFECT", "当前 0 个归档"], ["AUTH", "缺少对精确目标的批准"], ["VALUE", "展示了 Solo Skill 最需要补强的治理层"]] }
    ]
  }
];
