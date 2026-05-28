# BiteBack Demo Coding SOP

版本：v1.0
日期：2026-05-28
目标读者：Coding Agent / 前端工程实现 Agent
工作原则：只实现黑客松 Demo，不接真实抖音 API，不做真实支付/地图/定位/登录。

---

## 1. 工程目标

实现一个仿抖音 Feed 的可交互 Demo，证明 BiteBack 的唯一主线：

> 用户搜索“南科大附近晚饭”后没有完成决策，回到 Feed；系统经过六大 Gate 判断，在第 3 条普通视频后自然插入一张基于历史收藏 POI 的 BiteBack 卡片；用户可查看解释、加入今天、看店铺、负反馈；指标面板展示 Treatment 与 Control 的差异。

Demo 的重点不是做完整 App，而是让评委看到：

- 为什么触发。
- 为什么不触发。
- 如何排序。
- 如何解释。
- 如何反馈学习。
- 如何用指标验证。

---

## 2. 非目标

不要实现：

- 真实抖音登录。
- 真实地图导航。
- 真实支付。
- 真实定位。
- 真实后端推荐模型。
- 真实接口请求。
- 饭点/附近/外出多场景扩展。
- 复杂商家详情页。

所有数据使用本地 mock。

---

## 3. 页面结构

必须包含 6 个区域：

| 区域 | 说明 |
| --- | --- |
| Feed 主界面 | 仿抖音竖向视频流，普通视频 + BiteBack 卡片 |
| 搜索入口/搜索页 | 输入或点击 query：南科大附近晚饭 |
| 场景/Gate 控制台 | 展示当前 query、回流时间、是否已转化、Gate 状态 |
| BiteBack 卡片 | 收藏 POI 唤醒卡 |
| 解释弹层 | 为什么推荐给我 |
| 指标面板 | Treatment / Control 漏斗和埋点变化 |

建议布局：

- 移动端主视觉：Feed。
- 右侧或底部调试面板：Gate + metrics。
- 所有调试信息可展示，因为这是黑客松答辩 Demo。

---

## 4. Mock 数据结构

### 4.1 userProfile

```js
const userProfile = {
  userId: "u_001",
  locationAuthorized: true,
  biteBackExposureToday: 0,
  negativeFeedbackTags: [],
  closedBiteBack: false
};
```

### 4.2 searchSession

```js
const searchSession = {
  query: "南科大附近晚饭",
  queryIntent: "food_decision",
  searchedAt: Date.now(),
  returnedToFeedAt: Date.now() + 2 * 60 * 1000,
  completedPoiAction: false,
  completedDealAction: false,
  completedRouteAction: false
};
```

### 4.3 foodMemories

至少准备 5 条：

```js
const foodMemories = [
  {
    memoryId: "m_001",
    videoId: "v_001",
    coverUrl: "...",
    title: "这家牛肉面真的香迷糊了",
    shopName: "老巷牛肉面",
    poiId: "poi_001",
    businessArea: "南科大",
    category: "面馆",
    dishTags: ["牛肉面", "红油抄手"],
    memoryLevel: "A",
    memoryStrength: 0.82,
    poiConfidence: 0.91,
    distanceM: 900,
    price: 38,
    isOpen: true,
    shopQuality: 0.88,
    dealAvailable: true,
    lastInteractionDays: 43
  }
];
```

必须包含至少一个不触发样例：

- C 级云收藏。
- `poiConfidence < 0.85`。
- 与 query 不匹配。
- 店铺停业。

### 4.4 feedVideos

```js
const feedVideos = [
  { id: "f_001", type: "video", title: "普通短视频 1" },
  { id: "f_002", type: "video", title: "普通短视频 2" },
  { id: "biteback_slot", type: "biteback" },
  { id: "f_003", type: "video", title: "普通短视频 3" }
];
```

---

## 5. 六大 Gate 逻辑

### 5.1 Eligibility Gate

```js
function passEligibilityGate(user, search, memories) {
  const within15m = search.returnedToFeedAt - search.searchedAt <= 15 * 60 * 1000;
  const foodIntent = search.queryIntent === "food_decision";
  const noSearchConversion =
    !search.completedPoiAction &&
    !search.completedDealAction &&
    !search.completedRouteAction;
  const hasQualifiedMemory = memories.some(isQualifiedMemory);

  return (
    within15m &&
    foodIntent &&
    noSearchConversion &&
    user.locationAuthorized &&
    user.biteBackExposureToday < 1 &&
    !user.closedBiteBack &&
    hasQualifiedMemory
  );
}
```

### 5.2 Attribution Gate

```js
function passAttributionGate(search) {
  return (
    !search.completedPoiAction &&
    !search.completedDealAction &&
    !search.completedRouteAction
  );
}
```

### 5.3 Feed Guardrail Gate

```js
function passFeedGuardrailGate(feedState) {
  return (
    feedState.normalVideosConsumed >= 2 &&
    !feedState.fastSwiping &&
    !feedState.deepWatching &&
    !feedState.recentCommercialComponent &&
    !feedState.recentPrivacyNegative
  );
}
```

### 5.4 Quality Gate

```js
function passQualityGate(memory) {
  return (
    memory.poiConfidence >= 0.85 &&
    memory.isOpen &&
    memory.shopQuality >= 0.75 &&
    memory.distanceM <= 3000
  );
}
```

### 5.5 Frequency Gate

```js
function passFrequencyGate(user, memory) {
  return (
    user.biteBackExposureToday < 1 &&
    !user.negativeFeedbackTags.includes(memory.poiId)
  );
}
```

### 5.6 Business Gate

```js
function passBusinessGate(memory) {
  return memory.shopQuality >= 0.75;
}
```

注意：`dealAvailable` 不参与 Gate 和排序主权重，只做弱露出。

---

## 6. 收藏意图分层

```js
function isQualifiedMemory(memory) {
  return (
    ["S", "A", "B"].includes(memory.memoryLevel) &&
    memory.poiConfidence >= 0.85
  );
}
```

等级含义：

| 等级 | 处理 |
| --- | --- |
| S | 强召回 |
| A | 可召回 |
| B | 只有 query 强匹配时召回 |
| C | 不召回 |

---

## 7. Query-Memory 匹配

至少一维强匹配：

```js
function getQueryMatchScore(query, memory) {
  let score = 0;
  if (query.includes(memory.businessArea)) score += 0.4;
  if (query.includes("晚饭") || query.includes(memory.category)) score += 0.25;
  if (query.includes(memory.shopName)) score += 0.5;
  if (memory.dishTags.some(tag => query.includes(tag))) score += 0.25;
  return Math.min(score, 1);
}
```

通过标准：

```js
queryMatchScore >= 0.35
```

---

## 8. 排序逻辑

```js
function rankMemory(memory, query) {
  const queryMatchScore = getQueryMatchScore(query, memory);
  const distanceFit = Math.max(0, 1 - memory.distanceM / 3000);
  const actionability = memory.isOpen ? 1 : 0;

  return (
    memory.memoryStrength * 0.30 +
    queryMatchScore * 0.25 +
    memory.poiConfidence * 0.15 +
    distanceFit * 0.10 +
    memory.shopQuality * 0.10 +
    actionability * 0.10
  );
}
```

不要把 `dealAvailable` 加入排序。

---

## 9. BiteBack 卡片内容

首屏必须包含：

- 触发原因：你刚搜过晚饭 · 这家你收藏过。
- 原视频封面。
- 店名：老巷牛肉面。
- 地理与行动信息：南科大附近、约 900m、当前营业。
- 价格：人均 ¥38。
- 弱商业信息：有可用团购。
- CTA：再看视频、看店铺、加入今天。
- 解释入口：为什么推荐给我？

不要把券放成主按钮。

---

## 10. 解释层

点击“为什么推荐给我？”展示：

```text
因为你刚搜索了“南科大附近晚饭”；
这家店来自你 43 天前收藏的视频；
它和搜索词在“南科大商圈”和“面馆品类”上匹配；
店铺 POI 置信度高，当前营业，约 900m；
你可以随时关闭收藏唤醒。
```

避免表达：

- “我们知道你在哪里。”
- “你刚经过这家店。”
- “限时抢券。”

---

## 11. 负反馈

菜单项：

- 太远了。
- 不想吃这类。
- 已经吃过。
- 不是这家店。
- 别再提醒收藏。

行为：

```js
function handleNegativeFeedback(type, memory, user) {
  if (type === "too_far") memory.distancePenalty = true;
  if (type === "not_this_category") memory.categoryPenalty = true;
  if (type === "already_visited") memory.visited = true;
  if (type === "wrong_poi") memory.poiConfidence = 0;
  if (type === "close_biteback") user.closedBiteBack = true;

  user.negativeFeedbackTags.push(memory.poiId);
}
```

指标面板必须同步更新 `negative_feedback` 和 `cooldown`。

---

## 12. 状态机

必须可视化展示：

```text
SEARCH
  -> RETURN_FEED
  -> GATE_CHECK
  -> GATE_BLOCK / CARD_QUEUED
  -> CARD_EXPOSED
  -> EXPLANATION_OPENED
  -> DECISION_ACTION
  -> NEGATIVE_FEEDBACK
  -> COOLDOWN
```

状态变化要在面板中实时高亮。

---

## 13. 指标面板

至少展示：

| 指标 | Treatment 初始 | 点击后变化 |
| --- | --- | --- |
| Eligible UV | 1 | 1 |
| Card Exposure | 0 -> 1 | 1 |
| Valid Wake | 0 | 解释层/加入今天后 +1 |
| Decision Action | 0 | 看店铺/加入今天后 +1 |
| Negative Feedback | 0 | 负反馈后 +1 |
| Cooldown | false | 负反馈后 true |

展示 Control 组：

```text
Control：同样搜索后回流，但不展示 BiteBack，只继续普通 Feed。
```

---

## 14. Demo 主线脚本

1. 打开 Demo，进入仿抖音 Feed。
2. 刷 2 条普通视频。
3. 点击搜索，输入“南科大附近晚饭”。
4. 搜索页展示结果，但不点击 POI、不买团购、不点路线。
5. 返回 Feed。
6. Gate 面板依次显示通过：
   - 15 分钟内回流。
   - query 是美食决策意图。
   - 搜索链路未转化。
   - 存在 A 级收藏 POI。
   - 商圈/品类强匹配。
   - Feed / Quality / Frequency / Business Gate 通过。
7. 第 3 条普通视频后出现 BiteBack。
8. 点击“为什么推荐给我？”。
9. 点击“加入今天”或“看店铺”。
10. 指标面板更新 Valid Wake、Decision Action。
11. 切换 Control：同样流程不展示 BiteBack。
12. 展示不触发 case：
    - query 改成“猫咪视频”。
    - 或 memoryLevel 改成 C。
    - 或 `poiConfidence = 0.6`。
13. 展示负反馈：
    - 点击“太远了”。
    - 卡片消失，状态进入 COOLDOWN。

---

## 15. 验收标准

Coding Agent 完成后必须满足：

- 搜索后回流才触发。
- 未搜索不触发。
- 搜索已转化不触发。
- C 级收藏不触发。
- 低置信 POI 不触发。
- Gate 面板可解释每次触发/不触发原因。
- BiteBack 卡片能展示、解释、反馈、埋点。
- Control 组可展示。
- 负反馈后状态和指标变化正确。
- 不出现真实支付/地图/登录/定位依赖。

