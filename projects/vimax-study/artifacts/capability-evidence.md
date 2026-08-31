# ViMax 能力证据清单

审查对象：HKUDS/ViMax commit [`05a48943878312d88fe5a016c12a9654940ecc43`](https://github.com/HKUDS/ViMax/commit/05a48943878312d88fe5a016c12a9654940ecc43)。

本清单只把能够从固定源码中定位到实现的内容标记为“已实现”。论文实验结果和 README 宣传不能替代本地运行证据。

## 1. 输入到输出能力

| 能力 | 代码证据 | 处理过程 | 输出 | 判断 |
| --- | --- | --- | --- | --- |
| Idea2Video | [`pipelines/idea2video_pipeline.py`](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/pipelines/idea2video_pipeline.py) | 创意扩写、角色提取、角色肖像、剧本分场景、逐场景 Script2Video | `story.txt`、`script.json`、角色图、场景视频、`final_video.mp4` | 已实现 |
| Script2Video | [`pipelines/script2video_pipeline.py`](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/pipelines/script2video_pipeline.py) | 角色提取、分镜设计、镜头描述分解、相机树、关键帧、视频片段、拼接 | 结构化 JSON、PNG、逐镜头 MP4、最终 MP4 | 已实现 |
| Novel2Video | [`pipelines/novel2movie_pipeline.py`](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/pipelines/novel2movie_pipeline.py) | 小说分块压缩、事件链、检索、场景提取、人物全局合并、逐场景渲染 | 压缩文本、事件/场景/人物 JSON、场景视频目录 | 已实现；最终全片装配能力弱于前两种模式 |
| 交互式 Agent | [`agent_runtime/loop.py`](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/agent_runtime/loop.py) | LLM 工具调用、进度事件、会话历史、上下文压缩 | 可持续规划、修改和触发渲染的会话 | 已实现 |
| Web 工作区 | [`web/`](https://github.com/HKUDS/ViMax/tree/05a48943878312d88fe5a016c12a9654940ecc43/web) | 命名项目、上传、对话、产物和渲染预览、供应商设置 | 本地浏览器工作区 | 已实现 |
| TUI | [`main_agent.py`](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/main_agent.py) | 新建或恢复会话、运行 Agent Loop | 终端交互界面 | 已实现 |

## 2. 一致性机制

### 角色身份

`CharacterPortraitsGenerator` 为角色生成正面、侧面和背面参考图。`character_portraits_registry.json` 保存这些图像，后续关键帧根据人物朝向选择参考。

效果目标是降低人物跨镜头时的脸部、发型、体型和服装漂移。它是参考图条件控制，不是模型级身份锁定，因此不能保证完全一致。

### 镜头和空间

[`agents/camera_image_generator.py`](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/agents/camera_image_generator.py)要求 LLM 根据景别、内容覆盖和时间邻近关系建立相机父子树。子相机依赖父镜头已经生成的关键帧。

当子机位需要新的视角时，Pipeline 会：

1. 使用父镜头首帧生成转场视频；
2. 从转场视频的第二段首帧或末帧提取新机位图像；
3. 把该图像作为子镜头空间构图锚点；
4. 必要时再结合角色肖像修正缺失元素。

这可以改善同一场景内的布局连续性，但转场生成错误也可能成为后续镜头的错误锚点。

### 长篇叙事

Novel2Video 使用：

- 分块压缩控制上下文规模；
- 事件 process chain 保留主要因果顺序；
- FAISS 对原始小说分块建立索引；
- embedding 召回每个事件的相关段落；
- reranker 筛选相关内容；
- SceneExtractor 将召回内容和事件共同转换为场景；
- GlobalInformationPlanner 在场景、事件和小说层合并人物静态与动态属性。

该机制的作用是减少长文本分解后的信息丢失，不等于完整理解小说的所有隐喻、支线和叙事风格。

## 3. 运行和工程能力

| 能力 | 证据 | 边界 |
| --- | --- | --- |
| 并行生成 | `asyncio.gather`、Semaphore、相机分支并发 | 仍受供应商速率和费用限制 |
| 断点复用 | 各阶段先检查目标 JSON、PNG 或 MP4 是否存在 | 文件存在不代表内容正确；修改上游产物后需要失效下游产物 |
| 修订传播 | Agent adapter 为剧本、角色、分镜等定义 stale 下游清单 | 仍需用户审查失效范围是否完整 |
| 进度与恢复 | session index、render status、events JSONL | 不是分布式任务队列 |
| 速率限制 | RenderBackend 可为生成器注入分钟/每日限制 | 没有统一的金额预算控制器 |
| 模型替换 | [`tools/protocols.py`](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/tools/protocols.py) | 新后端仍需自行处理鉴权、轮询、失败和输出格式 |

固定版本包含的图像适配器包括 Google Nano Banana、OpenRouter、云雾 Nano Banana 和豆包 Seedream；视频适配器包括 Google/云雾 Veo、OpenRouter、豆包 Seedance 和云雾 Omni。

## 4. 能实现的典型效果

输入“一名宇航员在废弃火星基地发现一株植物”后，系统可以自动形成类似以下结构：

1. 火星基地外部建立镜头；
2. 宇航员进入基地；
3. 手电扫过实验室；
4. 容器和植物特写；
5. 宇航员反应镜头；
6. 多个短视频按剧本顺序拼接。

角色参考图会被复用，相机树会让特写尽量继承宽景中的人物、物体和背景信息。最终产物是具有基本叙事顺序的多镜头 AI 视频样片，而不是一次生成的连续长镜头。

## 5. 论文和当前代码的差距

### VLM best-of-k 质量控制

论文描述每个关键帧生成多个候选，再由 VLM 根据人物一致性、空间关系和语义符合度选出最佳候选。

固定源码包含 [`agents/best_image_selector.py`](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/agents/best_image_selector.py)，但静态搜索未发现 `Idea2VideoPipeline`、`Script2VideoPipeline` 或 `Novel2MoviePipeline` 实例化或调用 `BestImageSelector`。主路径目前是调用一次图像生成器并直接保存结果。

结论：选择器代码存在，但论文质量控制不能视为已经完整接入当前开源主流程。

### 音频、对白和剪辑

`Script2VideoPipeline` 将 `motion_desc` 和 `audio_desc` 拼接后交给视频生成器，随后使用 MoviePy 顺序拼接视频片段。

静态检查未发现独立的 TTS、角色声纹、口型同步、对白时间轴、配乐或混音 Pipeline。

结论：如果底层视频模型支持原生音频，提示词可能生成一些声音；这不等于完整的专业音视频制作系统。

### AutoCameo

README 宣称可以上传人物或宠物照片进入故事。Web UI 确实支持上传文件，Agent 也能查看会话内图片；但固定版本未发现一个明确、独立、可自动验证的 AutoCameo Pipeline。

结论：可以把上传照片作为参考素材参与人工或 Agent 工作流，但“稳定保持真人身份并自动贯穿视频”仍需端到端验证。

## 6. 适用与不适用场景

适合：AI 短片原型、小说视觉化、预告片、分镜预演、教育故事、广告概念片、Agentic AIGC 研究和跨模型对比。

暂不适合直接承诺：电影级最终成片、绝对一致的真人或商品、复杂多人肢体互动、精确口型和音乐节奏、实时生成、严格离线隐私场景。
