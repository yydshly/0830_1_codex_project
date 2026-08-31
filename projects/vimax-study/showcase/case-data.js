window.VIMAX_CASES = [
  {
    id: "cat-dog-new-cat",
    pipeline: "Idea2Video",
    sourceType: "README usage example",
    sourceLabel: "readme.md · L327–338",
    sourceUrl: "https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/readme.md#L327-L338",
    title: "猫、狗与新来的猫",
    subtitle: "一句关系型创意，如何被展开成儿童多镜头短片",
    format: "儿童卡通 · 不超过 3 个场景",
    audience: "儿童内容创作者、故事样片团队、需要先验证情节而非追求成片画质的团队",
    input: "Idea: If a cat and a dog are best friends, what would happen when they meet a new cat?\n\nRequirement: For children, do not exceed 3 scenes.\nStyle: Cartoon.",
    truthNote: "真实上游输入：创意、儿童受众、不超过 3 个场景、Cartoon 风格均来自固定提交的 README。下面 8 镜头是为了说明 ViMax 工作方式而做的教学推演，不是仓库附带的官方 storyboard，也没有与之配对的已生成成片证据。",
    stages: [
      {
        id: "idea",
        label: "01 · 创意入口",
        title: "保留一句核心关系冲突",
        artifact: "idea + user_requirement + style",
        description: "Idea2Video 接收一个开放问题，同时约束儿童受众、场景上限和卡通风格。",
        preview: "老朋友猫与狗，遇到一只新猫后会发生什么？",
        observation: "ViMax 的入口不是镜头提示词，而是可以继续扩写的叙事种子。",
        gate: "输入必须仍是一条创意；若用户已经提供完整剧本，应改走 Script2Video。",
        status: "source"
      },
      {
        id: "story",
        label: "02 · 故事扩写",
        title: "把问题变成有起承转合的故事",
        artifact: "story.txt",
        description: "Screenwriter.develop_story 会把 idea 和限制条件写成故事文本，并允许从已有 story.txt 断点复用。",
        preview: "可推演为：新猫到来—旧友误会—共同解决问题—三者成为伙伴。",
        observation: "这一层决定冲突和结局，但具体内容由聊天模型生成，不是固定模板。",
        gate: "人物关系、儿童适宜性和 ≤3 场景约束均得到保留。",
        status: "implemented"
      },
      {
        id: "characters",
        label: "03 · 角色资产",
        title: "抽取角色并建立可复用身份锚",
        artifact: "characters.json + character_portraits_registry.json",
        description: "系统从故事抽取老猫、狗和新猫；对可见角色生成正面、侧面、背面参考图。",
        preview: "三位角色需要各自稳定的毛色、体型、配饰和性格提示。",
        observation: "参考图是缓解跨镜头身份漂移的工程手段，不等于模型能保证完全一致。",
        gate: "每个可见角色可被唯一识别，参考图路径已登记。",
        status: "conditional"
      },
      {
        id: "script",
        label: "04 · 场景剧本",
        title: "将故事切成连续场景",
        artifact: "script.json",
        description: "Screenwriter.write_script_based_on_story 生成场景数组，再逐场交给 Script2VideoPipeline。",
        preview: "场景 1 相遇；场景 2 误会与失踪玩具；场景 3 合作找回并和解。",
        observation: "Idea2Video 的关键增量是先补齐故事与场景剧本，而非直接跳到视频生成。",
        gate: "场景数量不超过 3，单场保持同一时间与地点。",
        status: "implemented"
      },
      {
        id: "storyboard",
        label: "05 · 分镜规划",
        title: "把场景拆成可生成的视觉动作",
        artifact: "scene_*/storyboard.json + scene_*/shots/<n>/shot_description.json",
        description: "StoryboardArtist 规划镜头，再拆解首帧、尾帧、可见角色、运动和画面变化。",
        preview: "教学推演采用 8 镜头：建立关系、引入新猫、冲突、线索、协作和解。",
        observation: "这里开始把叙事语言变成单镜头生成模型可消费的结构化描述。",
        gate: "每个镜头只有一个清晰叙事动作，角色位置和朝向可被画面表达。",
        status: "implemented"
      },
      {
        id: "camera-tree",
        label: "06 · 镜头依赖",
        title: "用参考关系串联连续镜头",
        artifact: "scene_*/camera_tree.json",
        description: "相机树选择哪些镜头需要继承父镜头的画面信息，并结合角色参考图生成首尾帧。",
        preview: "例如从‘三者发现线索’继承到‘共同追逐玩具’，减少服装与空间突变。",
        observation: "相机树是 ViMax 区别于互不相关地批量生镜头的核心组织方式之一。",
        gate: "依赖必须指向已存在镜头，且不形成循环。",
        status: "implemented"
      },
      {
        id: "render",
        label: "07 · 图像与视频",
        title: "先定关键帧，再生成短视频片段",
        artifact: "scene_*/shots/<n>/first_frame.png + [optional] last_frame.png + video.mp4",
        description: "图像生成器根据角色与场景参考创建首帧；只有 medium/large 变化镜头才需要尾帧，视频生成器再为每个 shot 创建片段。",
        preview: "每个镜头都可能发生毛色漂移、肢体错误、角色数量变化或动作失败。",
        observation: "ViMax 编排外部图像/视频模型；它本身不是一个新的视频基础模型。",
        gate: "需要有效模型配置和 API；视觉结果必须人工或 VLM 检查后才能接受。",
        status: "conditional"
      },
      {
        id: "assembly",
        label: "08 · 拼接交付",
        title: "按场景与镜头顺序组装",
        artifact: "final_video.mp4",
        description: "各场景先由 Script2Video 拼接，再由 Idea2Video 合并为最终 MP4；已有文件可跳过重复生成。",
        preview: "理想输出是一支三场以内、角色关系完整的儿童卡通短片。",
        observation: "代码实现了拼接路径，但固定提交没有为 README 猫狗输入提供可核验的配对成片。",
        gate: "所有片段存在、可解码、顺序正确，并通过连续性复核。",
        status: "not-run"
      }
    ],
    shots: [
      {
        title: "01 · 老朋友的日常",
        framing: "教学推演 · 花园全景建立镜头",
        lineage: "建立老猫与狗的外观、体型差和共同玩具，作为后续身份锚。",
        risk: "第一镜头若角色设计含混，后续所有一致性参考都会被放大。"
      },
      {
        title: "02 · 新猫出现",
        framing: "教学推演 · 入口方向的中景",
        lineage: "沿用老猫与狗参考图，新增第三位角色的独立外观锚。",
        risk: "三只动物同时入画，易出现角色合并、数量错误或毛色互换。"
      },
      {
        title: "03 · 被冷落的误会",
        framing: "教学推演 · 老猫反应近景",
        lineage: "从相遇镜头继承站位，用表情和距离表达嫉妒而非改变角色外观。",
        risk: "抽象情绪可能被过度拟人化，破坏既定卡通风格。"
      },
      {
        title: "04 · 玩具不见了",
        framing: "教学推演 · 俯拍线索镜头",
        lineage: "共同玩具从第一镜头延续，作为跨场景的物件状态锚。",
        risk: "小道具在生成画面中最容易消失、变形或换色。"
      },
      {
        title: "05 · 三方对峙",
        framing: "教学推演 · 三角色中近景",
        lineage: "延续花园空间方向与三位角色参考，冲突集中在动作和眼神。",
        risk: "复杂遮挡会造成肢体粘连、角色层级和视线方向错误。"
      },
      {
        title: "06 · 新猫发现线索",
        framing: "教学推演 · 低机位跟随镜头",
        lineage: "新猫成为行动主角，脚印或丝带从失踪玩具镜头继承。",
        risk: "快速动作和微小线索同时出现，视频模型可能只保留其中之一。"
      },
      {
        title: "07 · 共同找回玩具",
        framing: "教学推演 · 横向运动全景",
        lineage: "三角色与玩具汇合，依赖前一镜头的行动方向保持连续。",
        risk: "多人/多动物协作动作是身份漂移和物理穿插的高风险点。"
      },
      {
        title: "08 · 三个朋友",
        framing: "教学推演 · 日落收束中景",
        lineage: "回到第一镜头的构图和玩具位置，把二人关系更新为三人关系。",
        risk: "要验证结局变化来自叙事，而不是角色或环境被重新生成。"
      }
    ]
  },
  {
    id: "basketball-coaching",
    pipeline: "Script2Video",
    sourceType: "Executable source example",
    sourceLabel: "main_script2video.py · L5–30",
    sourceUrl: "https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/main_script2video.py#L5-L30",
    title: "篮球训练：一次投篮纠正",
    subtitle: "完整剧本如何直接进入分镜、参考资产与视频拼接",
    format: "Anime Style · 快节奏 · 不超过 15 个镜头",
    audience: "已有脚本的短剧团队、体育教学内容团队、需要控制台词与动作节拍的创作者",
    input: "上游脚本摘要（完整英文原文见来源）：学校体育馆里，John 投篮失手；Jane 指出他的肘部外张。John 按照 ‘straight as an arrow’ 调整动作，再次投篮命中。\n\nRequirement: Fast-paced, no more than 15 shots.\nStyle: Anime Style.",
    truthNote: "真实上游输入：人物、台词、失手—指导—命中的剧情、Anime Style 和 ≤15 shots 均来自固定提交的 main_script2video.py。下面 8 镜头按原剧本节拍做教学拆分，不是仓库提交的实际 storyboard，也没有与该脚本配对的可核验生成成片。",
    stages: [
      {
        id: "script",
        label: "01 · 剧本入口",
        title: "直接使用用户提供的场景剧本",
        artifact: "script argument",
        description: "Script2Video 不再扩写 idea；它从体育馆场景、人物动作和对白开始。",
        preview: "EXT. SCHOOL GYM - DAY；John 投篮失误，Jane 纠正肘部动作。",
        observation: "与 Idea2Video 相比，创作者对台词、动作因果和结局保留更多控制。",
        gate: "必须存在具体剧本文本；不能用一句模糊想法冒充 script。",
        status: "source"
      },
      {
        id: "characters",
        label: "02 · 人物抽取",
        title: "把 John 与 Jane 转为结构化角色",
        artifact: "characters.json",
        description: "CharacterExtractor 读取年龄、性别、体型和角色关系，建立镜头可引用的身份记录。",
        preview: "John：18 岁、高大、运动型；Jane：17 岁、较矮、运动型、助理教练。",
        observation: "剧本已经给出基础属性，但服装、发型等仍可能由模型补全。",
        gate: "角色索引、可见性和描述在所有镜头中保持一致。",
        status: "implemented"
      },
      {
        id: "storyboard",
        label: "03 · 分镜设计",
        title: "把对白与动作变成镜头节拍",
        artifact: "storyboard.json",
        description: "StoryboardArtist 根据剧本和‘快节奏、≤15 镜头’要求生成 brief shot 列表。",
        preview: "本页用 8 个节拍表示：开场、运球、第一次出手、失手、纠正、重试、命中、收束。",
        observation: "镜头数不是固定 8；真正运行时由模型生成，但必须满足上限。",
        gate: "对白归属、失手与命中的先后次序不可颠倒。",
        status: "implemented"
      },
      {
        id: "shot-descriptions",
        label: "04 · 视觉拆解",
        title: "补齐构图、人物可见性与帧变化",
        artifact: "shots/<shot_idx>/shot_description.json",
        description: "分镜 brief 被拆为镜头视觉描述，包括可见角色、首尾帧需求和画面变化程度。",
        preview: "投篮镜头需要同时表达 John 的姿势、球的轨迹、篮筐方向和 Jane 的观察。",
        observation: "这一层把‘肘部外张’这种教学信息转为可被画面验证的姿态。",
        gate: "每个动作有清晰主体、方向和可观察结果。",
        status: "implemented"
      },
      {
        id: "portraits",
        label: "05 · 人物参考",
        title: "生成并登记人物多视角参考图",
        artifact: "character_portraits_registry.json + character_portraits/*",
        description: "John、Jane 的正面、侧面、背面参考为不同机位提供身份约束；Script2Video 中任一视角生成失败都会抛错，不会自动复用正面图。",
        preview: "Anime Style 需要在不同景别中保持相同发型、服装色和身体比例。",
        observation: "多视角参考有助于不同机位识别人物，但也增加外部图像模型调用和失败点。",
        gate: "每个可见角色至少有可读取的参考图和 registry 记录。",
        status: "conditional"
      },
      {
        id: "camera-tree",
        label: "06 · 相机树",
        title: "组织体育馆空间和动作连续性",
        artifact: "camera_tree.json + shots/*/first_frame.png + [conditional] last_frame.png",
        description: "相机树把相近机位归组，并为依赖镜头选择父镜头参考，随后并行生成关键帧。",
        preview: "失手—纠正—重试应保持篮筐在同一方向，人物站位不能无理由互换。",
        observation: "这里验证的是镜头间引用关系，而不是底层模型已经理解真实三维空间。",
        gate: "镜头依赖合法；关键帧的人物、篮筐和场地轴线连续。",
        status: "implemented"
      },
      {
        id: "video",
        label: "07 · 视频片段",
        title: "将每个动作镜头分别生成",
        artifact: "shots/<n>/video.mp4",
        description: "视频生成器消费关键帧与描述，为每个 shot 生成独立片段，任务与关键帧生成可并发执行。",
        preview: "高风险片段是球离手、打铁/偏出、再次出手和空心命中。",
        observation: "球类物理、手部动作和精确命中仍受外部视频模型能力限制。",
        gate: "球的轨迹与剧本结果匹配，人物没有突变或穿模。",
        status: "conditional"
      },
      {
        id: "assembly",
        label: "08 · 成片拼接",
        title: "顺序拼接所有 shot",
        artifact: "final_video.mp4",
        description: "MoviePy 按 shot_descriptions 的顺序读取每段 video.mp4 并用 libx264 输出最终视频。",
        preview: "理想结果是一段从失误到纠正再到命中的完整训练小戏。",
        observation: "代码路径存在，但固定提交没有提供该入口脚本对应的成片证据。",
        gate: "片段可解码、台词与动作节拍清楚、音画需求另行确认。",
        status: "not-run"
      }
    ],
    shots: [
      {
        title: "01 · 体育馆与训练关系",
        framing: "教学拆分 · 全景建立镜头",
        lineage: "直接来自剧本的体育馆、篮筐、观众、John 与 Jane 关系。",
        risk: "大场景与人群会分散身份一致性预算，观众外观也可能闪变。"
      },
      {
        title: "02 · John 运球宣言",
        framing: "教学拆分 · 侧向中景跟拍",
        lineage: "承接开场站位，保留 John 的服装与球场运动方向。",
        risk: "连续运球容易出现手、球接触错误或篮球忽大忽小。"
      },
      {
        title: "03 · 第一次出手",
        framing: "教学拆分 · 低机位中全景",
        lineage: "沿同一球场轴线展示起跳、肘部动作和篮筐目标。",
        risk: "肘部外张是细微姿态，生成模型可能无法稳定呈现教学差异。"
      },
      {
        title: "04 · 投失与沮丧",
        framing: "教学拆分 · 篮筐结果切反应近景",
        lineage: "球必须从上一镜头延续为偏出结果，再回到 John 的挫败表情。",
        risk: "跨剪辑保持同一次投篮因果，需要球、篮筐和人物状态一致。"
      },
      {
        title: "05 · Jane 指出问题",
        framing: "教学拆分 · 双人中近景",
        lineage: "Jane 走近并指出肘部，John 的位置和持球状态承接失手镜头。",
        risk: "手势若不指向正确肘部，核心教学信息会失真。"
      },
      {
        title: "06 · 调整后再次出手",
        framing: "教学拆分 · 与镜头 03 匹配的对照机位",
        lineage: "刻意复用第一次投篮构图，让‘肘部更直’成为可比较变化。",
        risk: "如果机位或人物外观变化过大，前后动作无法作为有效对照。"
      },
      {
        title: "07 · 空心命中",
        framing: "教学拆分 · 篮筐近景接双人反应",
        lineage: "第二次出手的球轨迹必须连续到穿网，Jane 随后鼓掌。",
        risk: "精确穿网、网兜运动和反应时序是视频生成的高难点。"
      },
      {
        title: "08 · 信心恢复",
        framing: "教学拆分 · 稳定双人收束镜头",
        lineage: "John 捡回同一篮球并向 Jane 提议再来一次，闭合训练关系。",
        risk: "对白口型、角色声音和环境音不是该视觉流水线自动保证的能力。"
      }
    ]
  },
  {
    id: "barista-type-a",
    pipeline: "Benchmark · Type A",
    sourceType: "Upstream benchmark fixture",
    sourceLabel: "barista_coffee_cultures_typeA.json",
    sourceUrl: "https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/vimax_benchmark/barista_coffee_cultures_typeA.json",
    title: "咖啡师 Mara 的八镜学习旅程",
    subtitle: "同一角色跨越 8 个镜头、7 类地点、不同光线与器具的一致性压力样本",
    format: "Type A fixture · 2 scenes · 8 shots",
    audience: "评测角色跨场景一致性的研究者、需要旅行蒙太奇或品牌人物片的团队",
    input: "一位咖啡师在不同咖啡文化中学习冲煮方法，最后在社区品鉴会上融合技法，完成一杯招牌咖啡。",
    truthNote: "这是固定提交中真实存在的 benchmark JSON：包含 story_overview、Type A 标签、8 组 first_frame 与 video_prompt，以及 requested_scenes=2、requested_shots=8。它是基准输入 fixture；仓库未在同一路径提供 8 个生成片段及配对成片，因此本页只展示可验证的镜头设计和应检查的风险。",
    stages: [
      {
        id: "fixture",
        label: "01 · 基准输入",
        title: "读取固定的故事与镜头集合",
        artifact: "vimax_benchmark/barista_coffee_cultures_typeA.json",
        description: "上游 JSON 固定了故事概览、Type A 标签、2 场 8 镜头及每镜头的首帧和视频提示。",
        preview: "Mara 从现代咖啡店出发，经历手冲、市集、沙煮、山屋、虹吸、屋顶，回到社区品鉴。",
        observation: "fixture 让不同实现可以面对同一组输入，而不是每次重新让 LLM 发明分镜。",
        gate: "8 个 shot_id 完整且 first_frame、video_prompt 均非空。",
        status: "source"
      },
      {
        id: "identity",
        label: "02 · 身份锚",
        title: "从每个首帧描述中复述同一角色特征",
        artifact: "8 × first_frame",
        description: "Mara 的 28 岁身份、暖棕肤色、短卷发、炭灰 beanie、森林绿衬衫、写有 MARA 的棕褐围裙等特征反复出现。",
        preview: "星形雀斑、帽子、绿衬衫和名牌围裙构成跨地点识别组合。",
        observation: "强提示重复能提升身份可辨识度，但也暴露底层模型能否真正守住细节。",
        gate: "每个镜头中主角仍可被识别为同一 Mara，关键配饰无无故变化。",
        status: "source"
      },
      {
        id: "environment",
        label: "03 · 环境切换",
        title: "有意制造地点和照明的大幅变化",
        artifact: "8 个 first-frame states / 7 类地点",
        description: "8 个首帧状态覆盖现代店、市集、传统咖啡室、雪山木屋、极简工作室、城市屋顶等 7 类地点；首尾回到同一现代咖啡店。",
        preview: "暖晨光、正午硬光、钨丝灯、蓝色雪光、棚拍光、夜景串灯。",
        observation: "角色一致性必须在背景完全变化时成立，不能依赖固定场景纹理蒙混过关。",
        gate: "环境确实不同，同时人物身份和核心服装连续。",
        status: "source"
      },
      {
        id: "camera-language",
        label: "04 · 镜头语言",
        title: "为每种冲煮动作配置不同机位",
        artifact: "8 × video_prompt",
        description: "fixture 明确景别、镜头焦段和运动：35mm 中全景、50mm 俯拍、85mm 侧面特写、24mm 锁定全景等。",
        preview: "镜头设计从手部技法到环境故事交替，不只重复拍一张人物肖像。",
        observation: "焦段与机位描述让基准可以检查构图遵从和动作可读性。",
        gate: "输出景别、视角和运动方向符合对应 prompt。",
        status: "source"
      },
      {
        id: "reference-plan",
        label: "05 · 参考规划",
        title: "将人物参考与每镜首帧组合",
        artifact: "portrait registry + shot first-frame candidates",
        description: "仓库没有直接读取 benchmark JSON 的 runner；须先人工转换为 Script2Video 可消费的 script/shot 产物，才可借用角色参考与关键帧链。",
        preview: "身份参考保持 Mara，环境提示负责改变器具、材质、天气和光线。",
        observation: "人物与场景约束可能相互竞争；过多参考也可能降低模型遵从。",
        gate: "关键帧既满足 Mara 身份，又具备对应地点和器具。",
        status: "conditional"
      },
      {
        id: "clip-render",
        label: "06 · 动作生成",
        title: "分别生成八种冲煮动作",
        artifact: "8 × video.mp4 (expected render artifacts)",
        description: "每个 video_prompt 描述一个明确动作：手冲、手摇研磨、沙煮、压滤、虹吸、奶泡和最终融合。",
        preview: "液体、蒸汽、玻璃器具与细致手部运动是主要生成压力。",
        observation: "这类动作能检验模型是否只保持人物外观，还是也能完成器具交互。",
        gate: "动作无明显物理错误，器具类型和冲煮步骤不串台。",
        status: "conditional"
      },
      {
        id: "qc",
        label: "07 · 一致性复核",
        title: "逐镜比较身份与故事进展",
        artifact: "human/VLM evaluation record",
        description: "对 8 个输出检查脸部标记、帽子、围裙、姓名牌、体型、器具和地点是否符合 fixture。",
        preview: "最后一镜应让观众相信这是同一个人完成旅程，而非八位相似咖啡师。",
        observation: "上游 fixture 本身不包含评分或通过结果；质量闭环需要另建。",
        gate: "身份锚通过率、动作可用率和跨镜头漂移被明确记录。",
        status: "not-run"
      },
      {
        id: "assembly",
        label: "08 · 蒙太奇成片",
        title: "按 1–8 的学习旅程排序拼接",
        artifact: "final_video.mp4 (possible downstream artifact)",
        description: "若 8 个片段均通过检查，可按 fixture 顺序拼成从出发到社区品鉴的旅程。",
        preview: "环境变化提供节奏，Mara 的服装和最终技法融合提供连续主线。",
        observation: "固定提交证明了输入设计，不证明这支配对成片已经生成。",
        gate: "只在所有镜头通过一致性与可用性检查后组装。",
        status: "not-run"
      }
    ],
    shots: [
      {
        title: "01 · 晨光咖啡店起点",
        framing: "35mm · 眼平中全景 · 柜台后固定视角",
        lineage: "建立 Mara、炭灰帽、绿衬衫、MARA 围裙与现代店身份锚。",
        risk: "名牌文字、星形雀斑和细小服装特征可能无法同时稳定。"
      },
      {
        title: "02 · 都市咖啡馆手冲",
        framing: "50mm · 俯拍特写",
        lineage: "角色从胸口到双手入画，以帽子、衬衫和围裙延续身份；器具切为 V60。",
        risk: "螺旋注水、咖啡粉膨胀、计时器和手部结构需要同步正确。"
      },
      {
        title: "03 · 露天市集手磨",
        framing: "28mm · 桌面低机位中景",
        lineage: "Mara 服装不变，背景切换为烈日、市集棚布、手摇磨与陶壶。",
        risk: "强光与复杂背景可能改变肤色、服装色或遮蔽身份特征。"
      },
      {
        title: "04 · 灯下沙煮咖啡",
        framing: "85mm · 坐姿眼平侧面近景",
        lineage: "同一 Mara 转入暖钨丝传统室内，新增黄铜壶、热沙和绣花织物。",
        risk: "侧脸会降低星形雀斑可见度，黄铜反射与细沙物理也容易失真。"
      },
      {
        title: "05 · 雪山木屋压滤",
        framing: "35mm · 眼平中景",
        lineage: "服装锚保持，环境变为霜窗、壁炉和冷热混合光；器具切为压滤器。",
        risk: "极端色温变化可能让肤色和围裙颜色看似换人。"
      },
      {
        title: "06 · 工作室虹吸实验",
        framing: "24mm · 正面锁定全景",
        lineage: "Mara 身份延续到白色棚拍环境，玻璃虹吸壶成为中央物件。",
        risk: "水上升和回落、火焰、玻璃反射是多阶段因果动作。"
      },
      {
        title: "07 · 屋顶摩卡壶与奶泡",
        framing: "50mm · 右肩后方过肩中景",
        lineage: "夜景串灯和天际线改变环境，帽子、绿衬衫、围裙继续串联旅程。",
        risk: "过肩视角会隐藏脸部身份锚，风吹围裙和奶泡动作增加变形概率。"
      },
      {
        title: "08 · 社区品鉴与招牌杯",
        framing: "35mm · 顾客侧慢推中全景",
        lineage: "回到第一镜头的现代咖啡店，并把此前技法标签、器具和 Mara 汇合。",
        risk: "多人背景、标签文字、组合动作和身份闭环同时出现，是整组最高复杂度。"
      }
    ]
  },
  {
    id: "kitchen-type-b",
    pipeline: "Benchmark · Type B",
    sourceType: "Upstream benchmark fixture",
    sourceLabel: "cooking_competition_restaurant_typeB.json",
    sourceUrl: "https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/vimax_benchmark/cooking_competition_restaurant_typeB.json",
    title: "固定餐厅厨房里的烹饪竞赛",
    subtitle: "14 个镜头反复穿越同一空间，检验几何、遮挡与道具状态",
    format: "Type B fixture · 3 scenes · 14 shots",
    audience: "评测场景空间一致性的研究者、真人短剧预演团队、需要固定布景多机位叙事的团队",
    input: "两位成年厨师在现代餐厅厨房竞速完成招牌菜，评委观察、品尝并宣布获胜者；所有动作发生在同一个详细且固定的厨房中。",
    truthNote: "这是固定提交中真实存在的 benchmark JSON：包含 Type B 标签、3 场 14 镜头、逐镜 first_frame 和 video_prompt。它明确要求厨房 geometry locked，并反复设计柱体、岛台、龙头等遮挡测试。仓库没有随该 fixture 提供 14 个已生成片段和配对成片；下面陈述的是输入能力与验证方法。",
    stages: [
      {
        id: "fixture",
        label: "01 · 基准输入",
        title: "锁定三场十四镜头的竞赛剧情",
        artifact: "vimax_benchmark/cooking_competition_restaurant_typeB.json",
        description: "fixture 固定开赛、备料、烹煮、装盘、品尝、反应和宣布结果的镜头序列。",
        preview: "metadata 明确 requested_scenes=3、requested_shots=14、consistency_type=Type B。",
        observation: "镜头结构已给定，不需要先让 LLM 任意改写故事。",
        gate: "14 个镜头按 shot_id 连续，每个首帧和动作提示完整。",
        status: "source"
      },
      {
        id: "space-map",
        label: "02 · 空间基准",
        title: "用第一镜建立不可随意变化的厨房地图",
        artifact: "shot 1 first_frame geometry specification",
        description: "中央岛台、顶置排风罩、左墙烤箱与出餐口、右墙冰箱/货架/洗手池、后墙储藏室门构成固定参照。",
        preview: "后续所有机位都要能映射回这套布局，而不是生成十四间相似厨房。",
        observation: "fixture 通过反复点名固定物件，把空间连续性变成可检查要求。",
        gate: "核心设施相对位置、数量和朝向在不同视角下自洽。",
        status: "source"
      },
      {
        id: "state",
        label: "03 · 人物与道具状态",
        title: "追踪厨师、评委、计时器与菜品进度",
        artifact: "14 × first_frame state descriptions",
        description: "Chef A、Chef B、Judge 的外观和位置被复述；计时器、锅具、食材、盘子从备料逐步演化为成品。",
        preview: "同一数字计时器从启动、倒计时到蜂鸣；两只空盘最终成为出餐口下的成品。",
        observation: "这是状态连续性问题，不只是每一张画面单独好看。",
        gate: "人物身份不交换，道具不会无因复制或消失，菜品进展符合时序。",
        status: "source"
      },
      {
        id: "camera-graph",
        label: "04 · 多机位依赖",
        title: "把十四个视角连成可追溯的空间关系",
        artifact: "camera_tree.json (only after manual schema conversion)",
        description: "仓库没有 benchmark runner；须先把 fixture 人工转换为 Script2Video 的 script/shot 产物，通用相机树能力才可为远近、俯拍、低角度和反打镜头选择父参考。",
        preview: "从岛台全景到烤箱低机位、龙头侧全景、地面低角度和出餐口近景。",
        observation: "相机树提供参考继承，但不能替代真正的 3D 场景重建。",
        gate: "每个新机位的参照物仍与空间基准一致，依赖关系无循环。",
        status: "conditional"
      },
      {
        id: "occlusion",
        label: "05 · 遮挡压力",
        title: "主动使用柱体、岛台边缘和龙头测试深度",
        artifact: "shots 4, 5, 8, 11 prompts",
        description: "fixture 要求人物经过固定设施时短暂被遮挡并重新出现，验证前后景层级和空间深度。",
        preview: "Chef B 被排风罩支柱遮住；Chef A 从水龙头后经过；双手藏到岛台边缘后再出现。",
        observation: "遮挡前后若人物、衣服或持有物改变，就暴露引用链断裂。",
        gate: "遮挡物固定，人物在遮挡前后身份和运动方向连续。",
        status: "source"
      },
      {
        id: "clip-render",
        label: "06 · 逐镜渲染",
        title: "分别生成准备、烹饪、装盘与评审动作",
        artifact: "14 × video.mp4 (expected render artifacts)",
        description: "外部视频模型需要完成切菜、搅拌、煨酱、冲洗、装盘、品尝、反应和握手等动作。",
        preview: "复杂点不仅是人物一致，还包括刀具安全、液体、蒸汽和手部器具交互。",
        observation: "ViMax 负责编排提示和参考；动作是否可用仍取决于视频模型和复核。",
        gate: "每段动作与 prompt 相符，物理关系、人物数量和空间布局无明显错误。",
        status: "conditional"
      },
      {
        id: "qc",
        label: "07 · 连续性审片",
        title: "用空间图和状态表逐镜对照",
        artifact: "human/VLM scene-state evaluation",
        description: "检查岛台、烤箱、冰箱、储藏室门、出餐口、计时器、餐盘与三位人物在十四镜头中的连续性。",
        preview: "特别对比 1/4/5/8/11/14 的不同广角和遮挡镜头。",
        observation: "固定提交只给出测试输入，没有给出自动评分与通过结论。",
        gate: "空间、身份、物件状态、动作和镜头遵从分别记录结果。",
        status: "not-run"
      },
      {
        id: "assembly",
        label: "08 · 竞赛成片",
        title: "通过检查后再按叙事顺序拼接",
        artifact: "final_video.mp4 (possible downstream artifact)",
        description: "十四段都可用时，可组成一支从计时开始到友好宣布胜者的厨房竞赛短片。",
        preview: "固定空间提供可信度，计时器和装盘进度提供叙事节奏。",
        observation: "不能把 fixture 当成已经生成的效果演示；真正成片必须另行运行并留存证据。",
        gate: "仅拼接经审核片段，并再次检查切点前后的空间和状态连续性。",
        status: "not-run"
      }
    ],
    shots: [
      {
        title: "01 · 评委启动比赛",
        framing: "24mm · 眼平锁定全景",
        lineage: "建立岛台、排风罩、左侧烤箱/出餐口、右侧冰箱/货架/水池和后门的空间基准。",
        risk: "首镜空间若不准确，后续多机位都缺少可信的几何母版。"
      },
      {
        title: "02 · Chef A 按下计时器",
        framing: "50mm · 岛台右侧眼平中景 · 轻微手持",
        lineage: "冰箱与开放货架保留在背景，计时器从待机转为倒计时。",
        risk: "可读数字、手指接触和两位厨师反应可能不同步。"
      },
      {
        title: "03 · 双线备料",
        framing: "18mm equivalent · 岛台正上方静态俯拍",
        lineage: "两块案板、中央计时器、蔬菜篮、香草盘和内嵌灶保持与全景相对位置。",
        risk: "双手并行动作、刀具、食材数量和俯拍空间方向容易错乱。"
      },
      {
        title: "04 · Chef B 前往烤箱",
        framing: "28mm · 左墙烤箱附近低机位全景",
        lineage: "烤箱、出餐口和岛台位置承接基准；Chef B 经过岛台边缘形成遮挡。",
        risk: "遮挡前后托盘、人物身份或行走方向可能发生跳变。"
      },
      {
        title: "05 · 柱体后的翻炒",
        framing: "70mm · 排风罩支柱后中景 · 横移 10–15 cm",
        lineage: "Chef A 在灶面炒菜，Chef B 从烤箱返回并被固定支柱短暂遮挡。",
        risk: "微小视差、蒸汽和遮挡重现同时要求稳定空间。"
      },
      {
        title: "06 · 两位厨师同时搅拌",
        framing: "35mm · 储藏室门方向双人中景",
        lineage: "后墙玻璃门居中，Judge 位于水池侧，计时器继续位于岛台中央。",
        risk: "跨岛取香草可能造成手臂穿插、共享道具位置漂移。"
      },
      {
        title: "07 · Chef B 煨酱",
        framing: "85mm · 手部与小锅近景",
        lineage: "柔焦背景仍保留左墙烤箱和上方排风罩作为位置证据。",
        risk: "倾锅、旋转酱汁、放回灶面和小泡沸腾属于连续物理动作。"
      },
      {
        title: "08 · Chef A 经过水龙头",
        framing: "24mm · 右墙水池侧眼平全景",
        lineage: "水龙头前景、货架中景、岛台中心形成明确深度；人物往返时两次被遮挡。",
        risk: "遮挡后人物、香草束和运动方向都必须保持。"
      },
      {
        title: "09 · 出餐口等待装盘",
        framing: "50mm · 左侧朝向热灯出餐口中景",
        lineage: "空白餐盘首次进入状态链；Chef A 先到，Chef B 随后持第二只盘子进入。",
        risk: "盘子数量、人物前后关系和接触台面动作容易跳变。"
      },
      {
        title: "10 · 倒计时装盘",
        framing: "18mm · 岛台正上方静态俯拍",
        lineage: "回到镜头 03 的俯拍布局，但食材已变为菜品，新增挤酱瓶、镊子和微型蔬菜。",
        risk: "必须让道具状态进展而非复位，同时稳定两套并行动作。"
      },
      {
        title: "11 · 餐盘滑向出餐侧",
        framing: "20mm · 岛台底部地面低角度全景",
        lineage: "岛台边缘遮住手部后，两个完成餐盘在另一侧重新出现，Judge 向前一步。",
        risk: "极低机位和强遮挡可能导致餐盘复制、双手消失或人物比例扭曲。"
      },
      {
        title: "12 · 评委品尝两道菜",
        framing: "60mm · 出餐口眼平中近景",
        lineage: "两只成品盘保持在热灯下；两位厨师并排等待，Judge 的 clipboard 延续。",
        risk: "叉子、食物入口和先后品尝的精细动作极易出现手口错误。"
      },
      {
        title: "13 · 厨师等待结果",
        framing: "75mm · 双人反应特写",
        lineage: "后墙储藏室门和接近结束的计时器继续定位；两位厨师交换尊重的眼神。",
        risk: "特写必须保持此前脸部身份，同时让计时器状态与声音事件一致。"
      },
      {
        title: "14 · 宣布胜者并握手",
        framing: "24mm · 与开场呼应的眼平锁定全景",
        lineage: "回收全部厨房几何、两只成品盘和三位人物；Judge 指向 Chef A，依次握手。",
        risk: "多人手部互动、宣布对象和完整空间闭环叠加，是最终一致性压力点。"
      }
    ]
  }
];
