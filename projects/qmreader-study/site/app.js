(() => {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const demoButton = document.querySelector('[data-demo-toggle]');
  const resetButton = document.querySelector('[data-demo-reset]');
  const startLink = document.querySelector('[data-start-link]');
  const demoSection = document.querySelector('#demo');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const els = {
    workspace: document.querySelector('[data-demo-workspace]'),
    title: document.querySelector('[data-demo-title]'),
    subtitle: document.querySelector('[data-demo-subtitle]'),
    buttonLabel: document.querySelector('[data-demo-button-label]'),
    buttonIcon: document.querySelector('[data-demo-button-icon]'),
    progressBar: document.querySelector('[data-progress-bar]'),
    pipelineSteps: Array.from(document.querySelectorAll('[data-step]')).map((step) => ({
      step,
      title: step.querySelector('[data-step-title]'),
      detail: step.querySelector('[data-step-detail]'),
    })),
    scenarioTitle: document.querySelector('[data-scenario-title]'),
    scenarioAudience: document.querySelector('[data-scenario-audience]'),
    scenarioFit: document.querySelector('[data-scenario-fit]'),
    scenarioButtons: Array.from(document.querySelectorAll('[data-scenario-select]')),
    scenarioJumpButtons: Array.from(document.querySelectorAll('[data-scenario-jump]')),
    queueLabel: document.querySelector('[data-queue-label]'),
    queueCount: document.querySelector('[data-queue-count]'),
    queueStatus: document.querySelector('[data-queue-status]'),
    queueItems: Array.from(document.querySelectorAll('[data-queue-item]')).map((item) => ({
      code: item.querySelector('[data-queue-code]'),
      age: item.querySelector('[data-queue-age]'),
      title: item.querySelector('[data-queue-title]'),
    })),
    queueNoteTitle: document.querySelector('[data-queue-note-title]'),
    queueNoteText: document.querySelector('[data-queue-note-text]'),
    documentMode: document.querySelector('[data-document-mode]'),
    documentSource: document.querySelector('[data-document-source]'),
    documentStatus: document.querySelector('[data-document-status]'),
    documentKicker: document.querySelector('[data-document-kicker]'),
    documentTitle: document.querySelector('[data-document-title]'),
    documentSummary: document.querySelector('[data-document-summary]'),
    documentContent: document.querySelector('[data-document-content]'),
    documentInsight: document.querySelector('[data-document-insight]'),
    documentInsightText: document.querySelector('[data-document-insight-text]'),
    contentHash: document.querySelector('[data-content-hash]'),
    assetLink: document.querySelector('[data-asset-link]'),
    monitorPercent: document.querySelector('[data-monitor-percent]'),
    fetchLatency: document.querySelector('[data-fetch-latency]'),
    blockCount: document.querySelector('[data-block-count]'),
    assetCount: document.querySelector('[data-asset-count]'),
    eventLog: document.querySelector('[data-event-log]'),
    monitorBoundary: document.querySelector('[data-monitor-boundary]'),
  };

  const scenarioConfigs = {
    'ai-intel': {
      headline: '每天 20 分钟，完成一轮\nAI 技术情报加工。',
      fit: '直接适用 · 原生能力',
      audience: '持续阅读英文 AI 资讯、需要形成中文判断和研究素材的个人研究者或内容创作者。',
      sourceLabel: 'HUGGING FACE PAPERS',
      queueLabel: '今日 AI 信息',
      queue: [
        ['HF', '8 MIN AGO', 'Small language models are becoming capable research assistants'],
        ['HN', '23 MIN AGO', 'A practical guide to local-first AI workflows'],
        ['SW', '41 MIN AGO', 'Structured outputs and their failure modes'],
      ],
      queueNote: ['为什么先显示？', 'Fetch 完成就落盘，AI 慢也不阻塞新内容。'],
      pipeline: [
        ['订阅命中', 'RSS / Sitemap'],
        ['抓取补全', 'Fetch worker'],
        ['结构翻译', 'Block validation'],
        ['改写伴读', 'AI worker'],
        ['资产发布', 'RSS / Deep link'],
      ],
      boundary: '这里展示的是已验证代码路径，不调用真实模型，也不代表生成质量评测。',
      assetNoun: '公开研究资产',
      modes: ['ORIGINAL FEED', 'FETCHED CONTENT', 'STRUCTURED TRANSLATION', 'REWRITE + ARTICLE AGENT', 'PUBLIC READING ASSET'],
      kickers: ['ORIGINAL · ENGLISH', 'ORIGINAL · FULL CONTENT', 'TRANSLATION · 中文', 'RESEARCH REWRITE · 中文研究稿', 'ASSET · 可引用中文研究稿'],
      story: {
        originalTitle: 'Small language models are becoming capable research assistants',
        originalSummary: 'A new evaluation explores how compact language models can preserve structure, cite source material, and complete constrained research tasks on local hardware.',
        originalContent: [
          'The paper compares instruction-following behavior across a set of long-form synthesis tasks.',
          'Its most useful finding is not a leaderboard score, but a practical boundary: smaller models become reliable when the workflow constrains inputs and validates outputs.',
        ],
        fetchedSummary: 'The feed summary has been replaced by cleaned full text. Links, headings, code blocks and citations are normalized before storage.',
        fetchedContent: [
          'The evaluation compares instruction-following behavior across twelve long-form synthesis tasks and three local hardware profiles.',
          'Rather than treating the model as an unconstrained chat interface, the authors preserve document structure, limit context, and validate every output block before accepting a result.',
          'This shifts the practical question from “Which model scores highest?” to “Which workflow makes a smaller model reliable enough?”',
        ],
        translatedTitle: '小语言模型正在成为可靠的研究助手',
        translatedSummary: '一项新评测研究了紧凑型语言模型如何在本地硬件上保留文档结构、引用原始材料，并完成受约束的研究任务。',
        translatedContent: [
          '这项评测比较了十二种长篇综合任务和三类本地硬件配置下的指令遵循能力。',
          '研究者没有把模型当作不受约束的聊天界面，而是保留文档结构、限制上下文，并在接受结果前校验每一个输出块。',
          '实际问题因此从“哪个模型分数最高”转向“什么样的工作流能让小模型足够可靠”。',
        ],
        rewriteTitle: '小模型真正的突破，是被装进了可靠的研究流程',
        rewriteSummary: '这项研究最值得关注的不是榜单，而是一个工程事实：当输入被约束、结构被保留、输出被验证时，更小的模型也能承担可复查的研究任务。',
        rewriteContent: [
          '过去我们习惯用参数规模判断模型能力，但这篇论文把视角转向了工作流。研究者没有要求模型一次写完所有内容，而是把文章拆成可验证的结构块。',
          '这意味着“本地模型能不能做研究”不只是模型问题。上下文组织、输出格式、失败重试和证据保留，同样决定结果是否可用。',
          '对个人研究者而言，这条路线比追逐每周更新的榜单更实际：先定义可靠任务，再选择够用的模型。',
        ],
        insight: '这篇文章真正值得复用的是“结构约束 + 输出校验”的流程，而不是某个具体模型名次。',
        assetPath: '/assets/rewrite/b71a90d4',
        assetId: 'REWRITE/B71A90D4',
      },
      copy: {
        idle: '点击运行，观察一篇英文论文如何变成公开研究资产。',
        fetched: ['原文已可阅读', 'Fetch worker 已落盘；AI 尚未完成，但读者不再等待。'],
        translated: ['结构翻译通过校验', '18 个 HTML 结构块全部返回，链接、图片和标签顺序保持一致。'],
        rewritten: ['改写与伴读完成', 'AI worker 给出中文研究稿；人的判断继续进入批注与 Article Agent。'],
        published: ['研究资产已发布', '稳定深链、贡献记录与资产 RSS 已生成；下一次研究可以直接引用。'],
      },
      events: ['检测到新的 RSS 条目', '正文补全、清洗并写入 SQLite', '18 个翻译块通过覆盖率校验', '翻译、改写与人工点评完成', '深链、贡献记录和资产 RSS 已生成'],
      latency: '1.2s',
      blocks: '18/18',
      hashes: ['B71A…90D4', '6D0C…A21F', '30E8…C17B'],
    },
    'paper-radar': {
      headline: '每周扫完新论文，\n留下可复查的中文研究卡。',
      fit: '直接适用 · 论文格式化已存在',
      audience: '持续跟踪一个研究方向、需要快速筛选论文并保留研究问题与原文线索的研究者。',
      sourceLabel: 'ARXIV · CS.AI',
      queueLabel: '本周论文',
      queue: [
        ['AX', '12 MIN AGO', 'Tool-Augmented Small Models for Reliable Scientific Synthesis'],
        ['HF', '36 MIN AGO', 'Benchmarking citation-grounded research agents'],
        ['JR', '1 HOUR AGO', 'Structured review protocols for long-context models'],
      ],
      queueNote: ['论文场景为何合适？', '现有论文条目格式化、结构翻译和内容 hash 可以直接复用。'],
      pipeline: [
        ['论文命中', 'Paper feed'],
        ['正文补全', 'Abstract / HTML'],
        ['结构翻译', 'Section blocks'],
        ['研究解读', 'Article Agent'],
        ['卡片发布', 'Paper asset'],
      ],
      boundary: '速读卡是受控示例；真实使用仍要评测术语翻译、公式保真、引用定位和研究结论准确性。',
      assetNoun: '论文速读卡',
      modes: ['PAPER FEED', 'FULL PAPER CONTEXT', 'SECTION TRANSLATION', 'RESEARCH BRIEF + QUESTIONS', 'PUBLISHED PAPER CARD'],
      kickers: ['PAPER · ABSTRACT', 'PAPER · FULL CONTEXT', 'TRANSLATION · 章节结构', 'RESEARCH BRIEF · 中文速读', 'ASSET · 可复查论文卡'],
      story: {
        originalTitle: 'Tool-Augmented Small Models for Reliable Scientific Synthesis',
        originalSummary: 'The paper studies whether compact models can produce reliable scientific syntheses when retrieval, citation checks, and structured intermediate steps are enforced.',
        originalContent: [
          'The authors compare direct generation with a tool-augmented protocol across six literature-review tasks.',
          'They report that constrained intermediate steps improve citation coverage more consistently than simply increasing model size.',
        ],
        fetchedSummary: '摘要、方法、实验与限制章节已经补全，标题层级、表格链接和参考文献锚点被保留。',
        fetchedContent: [
          'The full text separates retrieval, claim extraction, citation validation, and final synthesis into explicit stages.',
          'Across six review tasks, the constrained protocol reduces unsupported claims, while gains vary with retrieval quality.',
          'The limitations section notes that domain-specific terminology and inaccessible papers remain major sources of error.',
        ],
        translatedTitle: '工具增强的小模型如何完成可靠的科学综述',
        translatedSummary: '论文研究了在强制检索、引用校验和结构化中间步骤后，紧凑型模型能否生成更可靠的科学综合。',
        translatedContent: [
          '完整流程把检索、观点抽取、引用验证和最终综合拆成显式阶段。',
          '在六项综述任务中，受约束流程减少了无支撑观点，但收益仍然取决于检索质量。',
          '限制章节指出，领域术语与不可访问论文仍然是主要误差来源。',
        ],
        rewriteTitle: '这篇论文真正贡献的，是一套可检查的科学综合流程',
        rewriteSummary: '值得记录的不是“小模型追上大模型”，而是把综述任务拆成可观察、可拒绝和可重试的证据步骤。',
        rewriteContent: [
          '论文的核心变量不是模型大小，而是任务是否被拆成检索、抽取、引用校验和综合四个阶段。每个阶段都可以单独检查。',
          '结果显示，约束流程能减少没有来源支撑的观点，但并不能修复差的检索结果。这给出了清楚的采用边界。',
          '后续实验应固定论文集合，分别测量引用覆盖率、术语错误和章节遗漏，而不是只让读者主观打分。',
        ],
        insight: '最值得复现实验的是“直接生成 vs. 分阶段校验”，而不是复述论文摘要。',
        assetPath: '/assets/paper/7c2e91a0',
        assetId: 'PAPER/7C2E91A0',
      },
      copy: {
        idle: '点击运行，观察一篇新论文如何变成中文速读卡。',
        fetched: ['论文正文已补全', '摘要、章节和参考文献锚点已经落盘，可以先读原文。'],
        translated: ['章节翻译通过校验', '22 个章节块完整返回，标题层级和引用链接保持一致。'],
        rewritten: ['研究解读已形成', '论文贡献、限制和待复现实验被整理为中文研究卡。'],
        published: ['论文速读卡已发布', '稳定地址、来源信息和研究问题已生成，可进入后续实验。'],
      },
      events: ['检测到新的论文条目', '摘要与正文结构已补全', '22 个章节块通过校验', '贡献、限制与问题已提取', '论文卡与资产 RSS 已生成'],
      latency: '1.8s',
      blocks: '22/22',
      hashes: ['7C2E…91A0', '21F5…7A6C', 'AE03…D921'],
    },
    'product-signals': {
      headline: '持续捕捉产品变化，\n把零散发布变成竞品信号卡。',
      fit: '轻量扩展 · 需来源适配与差异规则',
      audience: '需要跟踪少量重点产品、判断功能变化与市场含义的产品经理、创业者或行业研究者。',
      sourceLabel: 'OFFICIAL CHANGELOG',
      queueLabel: '产品信号',
      queue: [
        ['CL', '5 MIN AGO', 'Northstar AI adds project memory and updates team limits'],
        ['PH', '19 MIN AGO', 'A new collaborative research workspace launches today'],
        ['EB', '52 MIN AGO', 'How we redesigned long-running agent tasks'],
      ],
      queueNote: ['扩展点在哪里？', '抓取与资产链可复用；真正新增的是版本快照、实体匹配和变化规则。'],
      pipeline: [
        ['信号命中', 'RSS / Changelog'],
        ['材料补全', 'Official pages'],
        ['变化提取', 'Diff rules'],
        ['影响判断', 'Analyst review'],
        ['信号发布', 'Signal asset'],
      ],
      boundary: '产品名称与变化均为虚构样本；真实竞品监测需要版本快照、实体规则和人工核实，不能只依赖模型改写。',
      assetNoun: '竞品信号卡',
      modes: ['CHANGELOG FEED', 'OFFICIAL MATERIALS', 'STRUCTURED CHANGESET', 'IMPACT BRIEF + REVIEW', 'PUBLISHED SIGNAL CARD'],
      kickers: ['SIGNAL · OFFICIAL UPDATE', 'SOURCE · FULL MATERIALS', 'CHANGESET · 中文结构', 'ANALYST BRIEF · 影响判断', 'ASSET · 可追踪信号卡'],
      story: {
        originalTitle: 'Northstar AI adds project memory and updates team limits',
        originalSummary: 'The fictional product update introduces project-scoped memory, changes collaboration limits, and revises the team plan packaging.',
        originalContent: [
          'Project memory is now available for selected workspaces and can retain approved instructions between sessions.',
          'The team plan increases active projects while introducing a separate limit for long-running tasks.',
        ],
        fetchedSummary: '官方 Changelog、帮助文档和价格页快照已合并，来源时间与链接被保留。',
        fetchedContent: [
          'The changelog announces project-scoped memory with administrator approval controls.',
          'The help center clarifies that retained instructions are isolated by workspace and can be deleted by an administrator.',
          'The pricing snapshot shows more active projects but a new allowance for long-running tasks.',
        ],
        translatedTitle: 'Northstar AI 上线项目记忆，并调整团队版限制',
        translatedSummary: '这次虚构更新同时改变了能力、管理边界和套餐限制，需要把官方材料整理成可比较的变化集合。',
        translatedContent: [
          '新增：项目级记忆，可保存经过批准的指令，并提供管理员删除能力。',
          '边界：记忆按工作区隔离，并非跨组织的统一知识库。',
          '套餐：活跃项目数增加，但长时间任务拥有独立额度。',
        ],
        rewriteTitle: '这次产品更新的重点，不是“有记忆”，而是记忆开始进入团队治理',
        rewriteSummary: '能力变化与套餐变化同时发生：产品把长期上下文变成团队能力，也新增了管理员控制和单独的任务额度。',
        rewriteContent: [
          '从产品方向看，项目记忆把一次性对话推进到可持续工作空间，但官方材料明确把它限制在工作区内。',
          '从采购角度看，活跃项目增加不等于成本下降，因为长时间任务被单独计量。比较时必须同时保留功能页和价格页快照。',
          '下一步应该验证管理员删除、工作区隔离和额度消耗，而不是仅根据发布文案判断竞争优势。',
        ],
        insight: '竞品监测最有价值的产物是“变化 + 来源快照 + 待验证问题”，不是一段营销摘要。',
        assetPath: '/assets/signal/4f8c20de',
        assetId: 'SIGNAL/4F8C20DE',
      },
      copy: {
        idle: '点击运行，观察一条产品更新如何变成带边界的竞品信号卡。',
        fetched: ['官方材料已补全', 'Changelog、帮助文档和价格页快照已经合并，原文立即可读。'],
        translated: ['变化集合已生成', '14 个结构块被归类为新增能力、管理边界和套餐变化。'],
        rewritten: ['影响判断已完成', '产品含义、采购影响和待验证问题已进入人工复核。'],
        published: ['竞品信号卡已发布', '稳定地址、来源快照和验证问题已生成，可进入周报。'],
      },
      events: ['检测到官方产品更新', '三份官方材料与快照已补全', '14 个变化块完成分类', '影响判断与人工复核完成', '信号卡与专题 RSS 已生成'],
      latency: '2.1s',
      blocks: '14/14',
      hashes: ['4F8C…20DE', '91A4…CC70', 'D12E…883B'],
    },
  };

  function buildStages(config) {
    const story = config.story;
    const event = config.events;
    const pendingAsset = { assetReady: false, assetText: '资产链接尚未生成', assets: '0' };

    return [
      {
        percent: 0, title: '等待开始', subtitle: config.copy.idle, queueStatus: '等待处理', queueCount: '03',
        mode: config.modes[0], status: 'NEW', statusClass: '', kicker: config.kickers[0],
        articleTitle: story.originalTitle, summary: story.originalSummary, content: story.originalContent, insight: false,
        hash: 'HASH · NOT COMPUTED', latency: '—', blocks: '—', ...pendingAsset,
        events: [['09:42:08', event[0], 'active'], ['—', '等待 Fetch worker', 'pending'], ['—', '等待 AI worker', 'pending'], ['—', '等待资产发布', 'pending']],
      },
      {
        percent: 24, title: config.copy.fetched[0], subtitle: config.copy.fetched[1], queueStatus: '原文已补全 · 可阅读', queueCount: '03',
        mode: config.modes[1], status: 'FETCHED', statusClass: 'processing', kicker: config.kickers[1],
        articleTitle: story.originalTitle, summary: story.fetchedSummary, content: story.fetchedContent, insight: false,
        hash: `CONTENT HASH · ${config.hashes[0]}`, latency: config.latency, blocks: '—', ...pendingAsset,
        events: [['09:42:08', event[0], 'complete'], ['09:42:09', event[1], 'active'], ['—', '变化内容已送入 AI 队列', 'pending'], ['—', '等待资产发布', 'pending']],
      },
      {
        percent: 50, title: config.copy.translated[0], subtitle: config.copy.translated[1], queueStatus: '中文结构稿已生成', queueCount: '02',
        mode: config.modes[2], status: 'VALIDATED', statusClass: 'processing', kicker: config.kickers[2],
        articleTitle: story.translatedTitle, summary: story.translatedSummary, content: story.translatedContent, insight: false,
        hash: `TRANSLATION HASH · ${config.hashes[1]}`, latency: config.latency, blocks: config.blocks, ...pendingAsset,
        events: [['09:42:08', event[0], 'complete'], ['09:42:09', event[1], 'complete'], ['09:42:18', event[2], 'active'], ['—', '等待解读与资产发布', 'pending']],
      },
      {
        percent: 76, title: config.copy.rewritten[0], subtitle: config.copy.rewritten[1], queueStatus: '已解读 · 待发布', queueCount: '02',
        mode: config.modes[3], status: 'REVIEWED', statusClass: 'processing', kicker: config.kickers[3],
        articleTitle: story.rewriteTitle, summary: story.rewriteSummary, content: story.rewriteContent, insight: true,
        hash: `REWRITE HASH · ${config.hashes[2]}`, latency: config.latency, blocks: config.blocks, ...pendingAsset,
        events: [['09:42:08', event[0], 'complete'], ['09:42:09', event[1], 'complete'], ['09:42:18', event[2], 'complete'], ['09:42:26', event[3], 'active']],
      },
      {
        percent: 100, title: config.copy.published[0], subtitle: config.copy.published[1], queueStatus: `已发布为${config.assetNoun}`, queueCount: '02',
        mode: config.modes[4], status: 'PUBLISHED', statusClass: 'ready', kicker: config.kickers[4],
        articleTitle: story.rewriteTitle, summary: story.rewriteSummary, content: story.rewriteContent, insight: true,
        hash: `ASSET ID · ${story.assetId}`, assetText: `${story.assetPath} ↗`, assetReady: true,
        latency: config.latency, blocks: config.blocks, assets: '1',
        events: [['09:42:08', event[0], 'complete'], ['09:42:09', event[1], 'complete'], ['09:42:18', event[3], 'complete'], ['09:42:27', event[4], 'complete']],
      },
    ];
  }

  Object.values(scenarioConfigs).forEach((config) => {
    config.stages = buildStages(config);
  });

  let currentScenarioId = 'ai-intel';
  let stages = scenarioConfigs[currentScenarioId].stages;
  let stageIndex = 0;
  let demoState = 'idle';
  let timer = null;

  function safeStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }

  function safeStorageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* Session-only theme is acceptable. */ }
  }

  function setTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? '切换到浅色主题' : '切换到深色主题');
    themeLabel.textContent = dark ? '浅色' : '深色';
    safeStorageSet('qmreader-study-theme', dark ? 'dark' : 'light');
  }

  function initializeTheme() {
    const stored = safeStorageGet('qmreader-study-theme');
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(stored === 'dark' || stored === 'light' ? stored : preferred);
  }

  function renderEvents(events) {
    const fragment = document.createDocumentFragment();
    events.forEach(([time, label, state]) => {
      const row = document.createElement('div');
      row.className = `event ${state}`;
      const timeNode = document.createElement('span');
      const textNode = document.createElement('p');
      timeNode.textContent = time;
      textNode.textContent = label;
      row.append(timeNode, textNode);
      fragment.append(row);
    });
    els.eventLog.replaceChildren(fragment);
  }

  function renderParagraphs(paragraphs) {
    const fragment = document.createDocumentFragment();
    paragraphs.forEach((value) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = value;
      fragment.append(paragraph);
    });
    els.documentContent.replaceChildren(fragment);
  }

  function renderStage(index) {
    const stage = stages[index];
    stageIndex = index;
    els.workspace.dataset.state = demoState;
    els.title.textContent = stage.title;
    els.subtitle.textContent = stage.subtitle;
    els.progressBar.style.width = `${stage.percent}%`;
    els.monitorPercent.textContent = String(stage.percent).padStart(2, '0') + '%';
    els.queueStatus.textContent = stage.queueStatus;
    els.queueCount.textContent = stage.queueCount;
    els.documentMode.textContent = stage.mode;
    els.documentStatus.textContent = stage.status;
    els.documentStatus.className = `document-status ${stage.statusClass}`.trim();
    els.documentKicker.textContent = stage.kicker;
    els.documentTitle.textContent = stage.articleTitle;
    els.documentSummary.textContent = stage.summary;
    renderParagraphs(stage.content);
    els.documentInsight.hidden = !stage.insight;
    els.contentHash.textContent = stage.hash;
    els.assetLink.textContent = stage.assetText;
    els.assetLink.setAttribute('aria-disabled', String(!stage.assetReady));
    els.assetLink.href = stage.assetReady ? '#evidence' : '#architecture';
    els.fetchLatency.textContent = stage.latency;
    els.blockCount.textContent = stage.blocks;
    els.assetCount.textContent = stage.assets;
    renderEvents(stage.events);
    els.pipelineSteps.forEach(({ step }, stepIndex) => {
      step.classList.toggle('complete', stepIndex < index || (index === stages.length - 1 && stepIndex === index));
      step.classList.toggle('active', stepIndex === index && index < stages.length - 1);
      if (stepIndex === index && index < stages.length - 1) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  }

  function updateDemoButton() {
    const labels = { idle: ['▶', '运行演示'], running: ['Ⅱ', '暂停'], paused: ['▶', '继续'], complete: ['↻', '再次运行'] };
    const [icon, label] = labels[demoState];
    els.buttonIcon.textContent = icon;
    els.buttonLabel.textContent = label;
    demoButton.setAttribute('aria-label', label);
    resetButton.disabled = demoState === 'idle' && stageIndex === 0;
  }

  function clearDemoTimer() {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  }

  function resetDemo({ focus = true } = {}) {
    clearDemoTimer();
    demoState = 'idle';
    stageIndex = 0;
    renderStage(0);
    updateDemoButton();
    if (focus) demoButton.focus();
  }

  function applyScenario(id) {
    const config = scenarioConfigs[id];
    if (!config) return;
    clearDemoTimer();
    currentScenarioId = id;
    stages = config.stages;
    els.workspace.dataset.scenario = id;
    els.scenarioTitle.textContent = config.headline;
    els.scenarioAudience.textContent = config.audience;
    els.scenarioFit.textContent = config.fit;
    els.queueLabel.textContent = config.queueLabel;
    els.queueNoteTitle.textContent = config.queueNote[0];
    els.queueNoteText.textContent = config.queueNote[1];
    els.documentSource.textContent = config.sourceLabel;
    els.documentInsightText.textContent = config.story.insight;
    els.monitorBoundary.textContent = config.boundary;
    els.scenarioButtons.forEach((button) => {
      const selected = button.dataset.scenarioSelect === id;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    els.pipelineSteps.forEach(({ title, detail }, index) => {
      title.textContent = config.pipeline[index][0];
      detail.textContent = config.pipeline[index][1];
    });
    els.queueItems.forEach((item, index) => {
      item.code.textContent = config.queue[index][0];
      item.age.textContent = config.queue[index][1];
      item.title.textContent = config.queue[index][2];
    });
    resetDemo({ focus: false });
  }

  function finishDemo() {
    clearDemoTimer();
    demoState = 'complete';
    renderStage(stages.length - 1);
    updateDemoButton();
  }

  function scheduleNextStage() {
    clearDemoTimer();
    if (demoState !== 'running') return;
    if (stageIndex >= stages.length - 1) { finishDemo(); return; }
    const delay = reducedMotion.matches ? 100 : 1100;
    timer = window.setTimeout(() => {
      renderStage(stageIndex + 1);
      if (stageIndex >= stages.length - 1) finishDemo();
      else scheduleNextStage();
    }, delay);
  }

  function startDemo({ restart = false } = {}) {
    if (restart || demoState === 'complete') {
      stageIndex = 0;
      renderStage(0);
    }
    demoState = 'running';
    els.workspace.dataset.state = demoState;
    updateDemoButton();
    scheduleNextStage();
  }

  function pauseDemo() {
    clearDemoTimer();
    demoState = 'paused';
    els.workspace.dataset.state = demoState;
    els.title.textContent = '演示已暂停';
    els.subtitle.textContent = `当前停在第 ${stageIndex + 1} 步，可继续、切换场景或重置。`;
    updateDemoButton();
  }

  themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  els.scenarioButtons.forEach((button) => button.addEventListener('click', () => applyScenario(button.dataset.scenarioSelect)));
  els.scenarioJumpButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyScenario(button.dataset.scenarioJump);
      demoSection.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      window.setTimeout(() => demoButton.focus(), reducedMotion.matches ? 0 : 420);
    });
  });
  demoButton.addEventListener('click', () => {
    if (demoState === 'running') pauseDemo();
    else if (demoState === 'paused') startDemo();
    else startDemo({ restart: demoState === 'complete' });
  });
  resetButton.addEventListener('click', () => resetDemo());
  startLink.addEventListener('click', () => {
    window.setTimeout(() => { if (demoState === 'idle') startDemo(); }, reducedMotion.matches ? 0 : 420);
  });

  initializeTheme();
  applyScenario(currentScenarioId);
})();
