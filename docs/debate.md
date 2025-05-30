## 产品需求文档 (PRD): 结构化讨论功能

**版本**: 1.0
**日期**: 2025年5月17日

### 1. 引言 (Introduction)

* **1.1. 项目背景与目的**
    针对现有小区治理线上内容社区中，传统瀑布流式评论在处理复杂议题时存在信息碎片化、讨论失焦、观点难以沉淀等问题，本项目旨在引入一种结构化的在线讨论功能（借鉴Kialo模式）。该功能升级现有评论区（用户可以选择是要普通评论区还是结构化评论区），通过层级化、多角度的观点呈现与论证，促进更深入、理性、有序的社区事务讨论，并使讨论过程和结果更易于追溯和理解。
* **1.2. 功能概述**
    结构化讨论功能允许用户围绕一个核心议题，以树状层级结构发表和组织观点。用户可以提出主论点，并针对任一论点发表支持、反对、提问等不同类型的子论点，形成多方辩论的格局。系统将提供清晰的视觉呈现、评价机制以及AI辅助的讨论摘要，以提升用户参与和信息获取效率。

### 2. 项目目标 (Goals)

* **2.1. 提升讨论质量与效率**：通过结构化呈现，引导用户进行更有逻辑和深度的思考与表达，减少无效信息干扰。
* **2.2. 促进理性与多元化表达**：为不同观点提供平等的展示机会，鼓励用户基于事实和逻辑进行辩论，而非情绪宣泄。
* **2.3. 实现信息沉淀与追溯**：将讨论过程以结构化方式保存，方便用户随时回顾、理解议题的完整脉络和各方论证。
* **2.4. 降低有效参与门槛**：让用户能更容易地理解复杂讨论，并针对性地发表意见，提升有价值的互动。
* **2.5. 辅助社区决策**：为小区事务的透明化管理和科学决策提供信息支持。

### 3. 目标用户 (Target Users)

* **3.1. 业主**：关注小区切身利益，希望全面了解事务信息，理性表达诉求，参与社区共建。
* **3.2. 租户**：关注居住体验和权益，希望便捷获取信息，参与相关事务讨论。
* **3.3. 物业人员**：负责小区日常管理，希望高效收集居民反馈，透明化工作进展，提升服务质量。
* **3.4. 社区居委会成员**：关注社区治理与和谐，希望引导居民有序参与，了解民意，推动问题解决。
    * *用户整体画像：年龄跨度较大 (25-65岁+)，技术熟练度不一，对与自身利益相关的议题关注度和参与意愿更高。*

### 4. 用户故事 (User Stories)

| 角色             | 我希望...                                                                 | 以便我能...                                                               |
| :--------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------ |
| 小区居民 (业主/租户) | 查看关于某个小区议题（如“是否应增设宠物乐园”）的所有赞成、反对观点及其详细理由，这些观点都以清晰的层级结构展示。 | 全面了解各方意见，形成自己的判断，并更有针对性地参与讨论。                        |
| 小区居民         | 针对任何一个已提出的观点，方便地发表我的支持、反对意见，或提出疑问和建议，并附上我的理由。 | 清晰地表达我的立场和看法，并让我的观点成为结构化讨论的一部分。                      |
| 物业管理员/居委成员 | 发起一个关于小区某项新规草案的讨论，并能直观地看到居民们的主要观点分支、核心论据以及各方意见的分布情况。 | 高效收集居民反馈，理解主要关切点，为后续决策或方案调整提供依据。                    |
| 任何社区用户       | 快速浏览一个复杂辩论的AI生成的摘要，了解讨论的核心、主要分歧点和各方关键论据。         | 在时间有限的情况下，也能快速把握讨论的要点，不错过重要信息。                        |
| 事件/议题发起者    | 在我的小程序后台或发布事件时，可以决定该事件的评论区采用新的结构化讨论模式还是旧的普通评论模式。 | 根据议题的性质（例如是否具有较大争议性或需要深度探讨）选择最合适的讨论工具。          |
| 小区居民         | 对我认为有价值或写得好的论点点赞，对我不认同或质量不高的论点点踩。                       | 表达我对特定观点的即时反馈，并帮助社区筛选出更有价值的讨论内容。                    |

### 5. 功能需求 (Functional Requirements)

#### 5.1. 讨论模式启用与配置

* **5.1.1. 模式选择**：事件（或议题）的发起者在创建事件时，可选择其下评论区采用“结构化讨论模式”或“普通评论模式”。对于需要深度辩论的议题，推荐使用结构化讨论。
* **5.1.2. 讨论层级限制**：结构化讨论支持最多 **3** 层观点嵌套（主论点 -> 子论点 -> 孙论点）。

#### 5.2. 论点创建

* **5.2.1. 发起主论点 (Main Argument / Thesis)**
    * 用户可在讨论区顶部或指定入口（如原评论输入框升级）发起新的主论点，作为讨论的起点或新的主要分支。
    * 发起主论点时需填写论点标题/核心内容。
* **5.2.2. 添加子论点 (Sub-Argument / Claim)**
    * 用户可针对任一已存在的父论点（主论点或其他子论点）添加新的子论点。
    * 添加子论点时，用户必须：
        1.  选择一个观点标签（详见5.3）。
        2.  填写子论点的具体内容/理由。
    * 子论点在内容和结构上从属于其父论点。

#### 5.3. 观点标签 (Viewpoint Tags)

* **5.3.1. 预设标签库**：系统提供一组标准的观点标签，用于标识子论点的性质。包括但不限于：
    * **支持 (Pro)**
    * **反对 (Con)**
    * **提问 (Question)**
    * **建议 (Suggestion/Proposal)**
    * **澄清 (Clarification)**
    * **补充信息 (Additional Info)**
    * **担忧 (Concern)**
    * **中立/观察 (Neutral/Observation)**
* **5.3.2. 标签选择**：用户在发表子论点时，必须从上述标签中选择一个。

#### 5.4. 论点展示与交互

* **5.4.1. 视觉结构与层级呈现**：
    * 论点以**单层垂直列表**的形式在小程序界面中展示，每一时刻列表仅显示特定父论点下的**直接子论点**，或在顶层时显示所有主论点。
    * 所有论点卡片保持统一的视觉样式和尺寸，不通过卡片本身的缩进或大小变化来体现层级。
    * 论点间的层级关系主要通过**面包屑导航**和**独立的树状结构视图**（详见5.4.3）来指引和呈现。

* **5.4.2. 论点卡片**：每个论点（无论层级）均以一个独立的卡片呈现，卡片内包含：
    * 发表者头像、昵称
    * 论点内容（过长时应支持展开/收起）
    * 观点标签（仅子论点显示，表明其相对于直接父论点的立场）
    * 发布时间
    * 赞同数和反对数（详见5.5）
    * `查看回应 (N)` 按钮（N为该论点下的子论点数量，若N>0）或 `添加子论点` 按钮，用于导航至下一层级或发起新回应。

* **5.4.3. 导航与层级切换**：
    * **面包屑导航**：
        * 界面顶部始终提供清晰的面包屑路径，例如：“主议题 > 论点A > 子论点A.1”，准确标示用户当前所查看论点列表在整体辩论结构中的位置。
        * 用户可以点击面包屑中的上级论点标题，快速返回并切换到对应层级的论点列表。
    * **树状结构视图 (导航树)**：
        * 在面包屑导航旁边或论点列表顶部，设置一个固定的“查看结构图”或“导航树”按钮。
        * 点击此按钮后，以弹窗或独立页面的形式展示整个辩论的完整、可交互的树状结构图。
        * 用户可以在此结构图上点选任意论点节点，系统将随即跳转，并在主列表区域加载并显示该节点下的直接子论点。
    * **进入下一层级**：
        * 用户通过点击论点卡片上的“查看回应 (N)”按钮，来加载并显示该论点下的直接子论点列表。
        * 相应的，面包屑导航会更新以反映新的层级，论点列表内容也会随之刷新。

* **5.4.4. 排序**：用户可对当前显示的同一父论点下的直接子论点列表进行排序，可选排序方式：
    * 按时间（最新/最早）
    * 按热度（如“赞同数”减“反对数”，或单独按“赞同数”最多）

#### 5.5. 评价机制 (Voting/Evaluation)

* **5.5.1. 赞同 (Upvote)**：用户可对任一论点（主论点或子论点）进行“赞同”操作，表示认可或支持该观点。
* **5.5.2. 反对 (Downvote)**：用户可对任一论点进行“反对”操作，表示不认可或反对该观点。
* **5.5.3. 操作限制**：每个用户对同一个论点只能进行一次“赞同”或“反对”操作。再次点击已选操作则取消该操作；若已赞同再点反对，则取消赞同并更新为反对，反之亦然。
* **5.5.4. 计数显示**：系统实时统计并显示每个论点获得的“赞同”总数和“反对”总数。

#### 5.6. AI速览 (AI Summary)

* **5.6.1. 功能入口**：在结构化讨论区的顶部，提供一个可展开/收起的“AI速览”模块。
* **5.6.2. 实现方式**：
    * 将当前讨论区内的所有论点数据（包括文本内容、观点标签、赞同/反对数、层级关系等）作为输入。
    * 调用大语言模型（LLM）API，通过精心设计的提示词（Prompt）指令，由AI生成对整个讨论的结构化摘要。
* **5.6.3. 摘要内容**：AI速览应至少包含：
    * **核心议题概述**：当前讨论的中心问题是什么。
    * **主要观点阵营**：识别并总结讨论中主要的几方观点（如支持方、反对方、主要建议等）。
    * **各方核心论据**：为每个主要观点阵营提炼出若干条最核心、最有代表性或获得较多“赞同”的论据。
    * **主要分歧点**：点出讨论中争议最激烈或尚未达成一致的关键问题。
    * **潜在共识**（若有）：总结讨论中可能已形成的初步共识。
* **5.6.4. 更新机制**：
    * 用户可手动点击“刷新摘要”按钮获取最新总结。
    * 系统可根据讨论活跃度（如新增一定数量的论点后）自动更新摘要或提示用户有新摘要可查看。

#### 5.7. 基础管理功能 (MVP)

* **5.7.1. 用户举报**：用户可对认为不恰当、违规或人身攻击的论点进行举报，并简述理由。
* **5.7.2. 内容删除**：经审核确认违规的论点，事件发起者或平台管理员有权将其删除。删除操作应有后台记录。



### 8. MVP (Minimum Viable Product) 范围

* **包含功能**：
    * 讨论模式启用（手动选择，5.1.1）与3层层级限制（5.1.2）。
    * 主论点和子论点的创建（5.2）。
    * 预设的观点标签选择（5.3）。
    * 论点卡片式垂直层级展示，支持内容展开/收起，面包屑导航，按时间/热度排序（5.4）。
    * 赞同与反对评价机制（5.5）。
    * AI速览核心功能：基于大模型API，手动刷新，包含核心议题、主要观点、核心论据、主要分歧点（5.6）。
    * 用户举报与管理员删除功能（5.7）。
    * 直接回复的消息通知（5.8.1）。
* **暂不包含**：
    * 复杂或可定制的观点标签系统。
    * 高级排序与筛选功能。
    * 详细的用户权限等级和管理细则。
    * 完善的新手引导流程 (onboarding)。
    * AI速览的自动更新或高度个性化定制。
    * 互动通知（5.8.2）可根据开发资源决定是否纳入MVP。

### 9. 未来考虑 / V2 功能 (Future Considerations / V2 Features)

* **9.1. 新手引导 (Onboarding)**：为首次使用的用户提供动态图文教程或交互式引导。
* **9.2. AI速览增强**：
    * 更智能的摘要算法，支持识别论证谬误、情感倾向等。
    * 支持用户对摘要质量进行反馈以优化模型。
    * 定期自动更新摘要，并推送给关注用户。
* **9.3. 高级管理工具**：
    * 论点编辑、隐藏、锁定、合并。
    * 批量操作。
    * 关键词屏蔽、反垃圾机制。
    * 讨论发起者对本讨论的特定管理权限（如置顶关键论点）。
* **9.4. 讨论成果转化**：
    * 将讨论结果导出为文档（如PDF、Markdown）。
    * 与投票功能打通，将关键论点转化为投票选项。
    * 将讨论中形成的共识或行动建议直接转化为任务或公告。
* **9.5. 个性化与订阅**：
    * 用户可订阅特定讨论分支或包含特定关键词的论点。
    * 个性化推荐相关的活跃讨论。
* **9.6. 深度搜索与筛选**：在单个或多个结构化讨论中，按关键词、用户、标签、时间范围等进行高级搜索和筛选。
* **9.7. 版本历史与追溯**：对重要论点的编辑历史进行记录和查看。

### 10. 成功指标 (Success Metrics)

* **10.1. 功能采用率**：
    * 结构化讨论模式在可选用事件中的启用比例。
* **10.2. 用户参与度**：
    * 平均每个启用结构化讨论的事件下的总论点数。
    * 平均每个讨论的独立参与用户数。
    * 活跃用户的平均贡献论点数。
* **10.3. 互动深度与质量**：
    * 平均每个论点的子论点数量（反映讨论延展性）。
    * 赞同/反对票的平均数与分布情况。
    * AI速览功能的使用频率（点击查看次数/参与讨论用户数）。
* **10.4. 用户满意度**：
    * 通过应用内反馈、问卷调查收集用户对新功能的满意度评分。
    * 收集用户关于易用性、实用性的定性反馈。
* **10.5. 社区治理效能（长期观察）**：
    * 观察引入该功能后，社区议事效率、决策透明度是否有改善（可通过案例分析和用户深度访谈评估）。