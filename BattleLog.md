# BiteBack Agent Battle Log

日期：2026-05-28
参与 Agent：

- Agent A / Nash：校招抖音 AI 产品经理，负责 BiteBack 功能定义、PRD、SOP。
- Agent B / Volta：抖音 Feed 负责人，负责严厉审查、增量归因、Feed 护栏、上线判断。

Battle 目标：

> 在五轮以内，把 BiteBack 从“美食收藏唤醒想法”打磨成可以进入黑客松 Demo 开发的正式 PRD 与工程 SOP。

最终结果：

> Go for Demo。仅批准窄切口版本：搜索后未完成决策场景下的高置信收藏 POI 信息流承接卡。

---

## Round 1：PM 初始提案

### PM 观点

PM 将 BiteBack 定义为抖音 Feed 内的“收藏兴趣再激活实验”：

> 抖音在推荐流中，用 AI 把用户过去产生过的美食兴趣，在当下吃饭决策窗口重新组织成“可理解、可行动、可转化”的本地生活卡片。

PM 强调：

- BiteBack 不是附近美食推荐。
- 不是商家广告位。
- 不是到店推券。
- 不是独立美食 App。
- 核心目标不是 CTR，而是 7 日增量核销。
- AI 链路应包含内容理解、POI 归因、Food Memory Asset、场景识别、排序、解释生成、反馈学习。

PM 同时提出当前 PRD 还需增强：

- Feed 资源位合理性。
- 反事实实验设计。
- 供给侧质量约束。

### Leader 审查

Leader 判定：

> 方向有潜力，但不能放行给 coding agent。

主要批评：

1. 北极星指标分母“有资格曝光用户”不清。
2. 收藏不等于真实到店意图，存在大量云收藏。
3. AI 链路像口号，缺训练目标、置信度、fallback、Demo 范围。
4. 低估 Feed 风险，用户打开抖音未必想做决策。
5. BiteBack 和现有本地生活能力边界仍不够锋利。

Leader 要求 PM 必须回答：

- P0 人群只能选一个。
- Eligible UV 必须严格定义。
- 收藏意图必须分层。
- POI 置信度与错配补救必须明确。
- 券是否进首发必须说明。
- SOP 必须能让 Coding Agent 直接开工。

Round 1 结论：

> 继续，但必须从“好体验”升级为“能证明增量且不伤 Feed 的实验”。

---

## Round 2：PM 收敛反击

### PM 收敛

PM 接受批评，将 P0 收敛为：

> 搜索后回流的高置信收藏 POI 用户。

定义：

- 用户在抖音搜索过美食/品类/商圈词。
- 搜索后未完成 POI、团购或路线行为。
- 15-30 分钟内回到推荐流。
- 历史收藏中存在与 query 匹配的高置信 POI。

PM 提出 Eligible UV 口径：

```text
搜索后 30 分钟内回到推荐流
AND query 命中美食/餐厅/品类/商圈意图
AND 搜索后未完成 POI/团购/路线转化
AND 180 天内有可绑定 POI 收藏
AND POI 与 query 匹配
AND poi_confidence >= 0.85
AND 当前营业/可达
AND 有授权
AND 当日未触达
AND 未命中风控
```

PM 还提出：

- 收藏分 S/A/B/C 四档，C 级云收藏不召回。
- Feed 准入要求 `expected_local_life_lift > expected_feed_cost`。
- 卡片插入第 3-8 个视频位。
- 券不参与排序，只弱露出。
- PRD/SOP 增加状态机、指标口径、mock 数据、伪代码、Demo 脚本。

### Leader 二审

Leader 判定：

> 明显更好，但还没闭环。

Leader 接受 P0，但继续收紧：

- 搜索回流窗口从 30 分钟收紧为 15 分钟。
- query 必须具备明确美食决策意图。
- 搜索链路内未完成 POI/团购/路线。
- 收藏 POI 必须与 query 在商圈、品类、店名至少一维强匹配。
- 不能固定说第 3-8 个视频位，而要按会话状态准入。

Leader 要求写入六个 Gate：

1. Eligibility Gate。
2. Attribution Gate。
3. Feed Guardrail Gate。
4. Quality Gate。
5. Frequency Gate。
6. Business Gate。

Round 2 结论：

> Conditional Go。允许继续，但只批准“搜索后未转化 + 高置信收藏 POI”的窄切口。

---

## Round 3：PM 最终收口

### PM 最终定义

PM 最终收口：

> BiteBack 首发只做一个场景：用户在抖音搜索美食后，15 分钟内回到推荐流，但搜索链路内没有完成 POI、团购或路线行为时，系统用 AI 从其历史收藏中召回强匹配 POI，生成一张信息流唤醒卡。

关键取舍：

- 不做附近推荐。
- 不做饭点推荐。
- 不做到店推券。
- 不做独立本地生活工具。
- 只允许 S/A/B 级收藏 POI。
- query 与 POI 至少一维强匹配。
- 券不参与排序。
- 成功指标不是 CTR，而是 POI 决策与 7 日增量核销。

PM 给出最终 Demo 主线：

```text
搜索“南科大附近晚饭”
-> 搜索页不转化
-> 回 Feed
-> Gate 判断通过
-> 第 3 条普通视频后出现 BiteBack
-> 点击解释层
-> 加入今天 / 看店铺
-> 指标面板更新
-> 展示 Control
-> 展示不触发 case
-> 展示负反馈降权
```

### Leader 终审

Leader 判定：

> Conditional Go 转 Go for Demo。

Leader 认可：

- 定义足够窄。
- 用户需求、业务增量、推荐准入、隐私边界和 Demo 范围都能讲清。
- 可以进入最终 PRD、SOP 和前端 Demo 开发。

Leader 保留 5 条红线：

1. P0 场景不可发散。
2. 没有高置信收藏 POI 不展示。
3. 不能用券证明成功。
4. Feed 护栏高于本地生活转化。
5. Demo 必须展示 Gate 和 Control。

Leader 的最终审批意见：

> 同意进入开发，但只批准一个窄切口版本：BiteBack = 搜索后未决策场景下的高置信收藏 POI 信息流承接卡。只要最终 PRD 和 SOP 守住这个定义，这个方案有机会像一个真实抖音产品实验，而不是黑客松的美食推荐玩具。

---

## 最终决策

最终产品名：

> BiteBack 搜索后收藏美食唤醒卡

最终首发范围：

> 搜索后 15 分钟内回 Feed，query 具备美食决策意图，搜索链路未完成 POI/团购/路线行为，存在 S/A/B 级高置信收藏 POI 与 query 强匹配。

最终北极星：

> 收藏 POI 唤醒后的 7 日增量核销用户数 / Eligible UV。

最终 Demo 目标：

> 证明“刷到那一刻成立”：用户能理解为什么出现、为什么是这家、下一步能做什么；同时展示 Gate、Control、负反馈与指标闭环。

最终输出文件：

- `PRD.md`：正式产品需求文档。
- `SOP.md`：给 Coding Agent 的工程实现规范。
- `BattleLog.md`：Agent Battle 过程与决策记录。
