# BiteBack Frontend Rebuild SOP

版本：v2.0 收藏唤醒重构版  
日期：2026-05-28  
目标读者：Coding Agent / 前端工程实现 Agent  
原则：只做黑客松前端 Demo；不接真实抖音 API；不做真实支付、地图、定位、登录。

---

## 1. 本次重构目标

把现有 Demo 从“搜索后收藏唤醒卡”重构为：

> 用户在饭点或外出停留场景刷抖音 Feed；系统发现他附近有多家曾经收藏过但未到店的美食门店，于是在普通视频之间自然插入一张“之前眼馋的，现在能吃上！”卡片。卡片展示 1 个主推门店 + 2 个备选门店，并支持切换、马上开吃、解释、路线、门店详情和负反馈。

本次重点不是搜索页，不是推荐算法调试面板，而是**卡片本身的版面、内容组织和交互展示**。

实现时要守住一个判断：BiteBack 不是“再推一个旧视频”，而是把收藏夹里吃灰的美食意愿重新变成一次当前可行动的选择。所有 UI、mock 数据、交互和指标都要围绕这件事展开。

---

## 2. 可复用与要重构

### 2.1 可复用

- 仿抖音手机容器。
- Feed 竖向滑动框架。
- 普通视频素材播放/封面展示。
- 右侧调试面板的基础形态。
- `public/assets/` 静态素材路径体系。
- `src/mocks/` 本地 mock 目录。

### 2.2 必须重构

| 旧设计 | 新设计 |
| --- | --- |
| 搜索后才触发 | 饭点/附近/停留场景触发，搜索仅为加权信号 |
| 单个收藏视频卡 | 多个收藏门店组成的决策卡 |
| 推荐一个旧视频 | 重组门店、菜品、距离、营业、收藏记忆 |
| CTA 偏“看店铺/加入今天”单店 | 多店切换、马上开吃、路线、详情、换一批 |
| Gate 围绕搜索链路 | Gate 围绕 Memory / Context / Proximity / Feed / Quality / Frequency |

### 2.3 可以弱化

- 搜索页可以保留为辅助入口，但不要作为 Demo 主线。
- 搜索结果页不再是核心展示对象。
- 原有“搜索后 15 分钟”逻辑改为 `recentFoodSearch` 加权，不作为必过条件。

---

## 3. 目标页面结构

Demo 至少包含 5 个区域：

| 区域 | 说明 |
| --- | --- |
| Feed 主界面 | 普通短视频 + BiteBack 收藏卡 |
| BiteBack 多店卡 | 重点组件，展示多家收藏门店 |
| 门店详情 Sheet | 点击候选店或路线后打开 |
| 解释/反馈 Sheet | 解释为什么出现，支持负反馈 |
| 调试面板 | 展示 Gate、候选排序、指标变化 |

布局建议：

- 左侧或中间：375x812 手机 Feed。
- 右侧：调试面板，仅答辩展示使用。
- Feed 内不要出现大段说明文字，调试说明放面板。

---

## 4. Mock 数据重构

### 4.0 数据与素材原则

所有真实图片、视频、地图图、头像、门店信息都必须走 mock 数据和资源 manifest。组件不得硬编码 `/assets/...`、图片文件名、地图 API URL、门店文案或经纬度。

推荐数据流：

```text
public/assets/*
  -> src/config/assets.ts
  -> src/mocks/assets.ts
  -> src/mocks/foodMemories.ts / context.ts
  -> React components
```

前期没有真实素材时，mock asset 提供 `placeholderColor`，组件渲染色块占位。

### 4.1 userProfile

```ts
export interface UserProfile {
  userId: string;
  locationAuthorized: boolean;
  biteBackExposureToday: number;
  closedBiteBack: boolean;
  negativeFeedbackTags: string[];
  savedFoodCount: number;
}
```

示例：

```ts
export const defaultUserProfile = {
  userId: 'u_001',
  locationAuthorized: true,
  biteBackExposureToday: 0,
  closedBiteBack: false,
  negativeFeedbackTags: [],
  savedFoodCount: 26
};
```

### 4.2 currentContext

替代旧 `searchSession` 的主触发上下文。

```ts
export interface CurrentContext {
  timeLabel: 'lunch' | 'dinner' | 'late_night' | 'other';
  scene: 'metro' | 'taxi' | 'mall' | 'campus' | 'cafe' | 'home';
  areaName: string;
  isMealTime: boolean;
  isOuting: boolean;
  isStationary: boolean;
  recentFoodSearch?: string;
}
```

示例：

```ts
export const defaultContext = {
  timeLabel: 'dinner',
  scene: 'campus',
  areaName: '南科大 / 宝能城',
  isMealTime: true,
  isOuting: true,
  isStationary: true,
  recentFoodSearch: undefined
};
```

### 4.3 savedFoodMemories

每条 memory 必须代表一个可行动门店，不是单纯视频。

```ts
export interface SavedFoodMemory {
  memoryId: string;
  poiId: string;
  shopName: string;
  category: string;
  businessArea: string;
  signatureDishes: string[];
  heroAssetId: string;
  shopAssetId: string;
  mapAssetId: string;
  sourceVideoAssetId: string;
  creatorAvatarAssetId: string;
  savedDaysAgo: number;
  sourceTitle: string;
  memoryLevel: 'S' | 'A' | 'B' | 'C';
  memoryStrength: number;
  poiConfidence: number;
  shopQuality: number;
  distanceM: number;
  walkMinutes: number;
  pricePerPerson: number;
  isOpen: boolean;
  openUntil: string;
  dealAvailable: boolean;
  reason: string;
}
```

至少准备 6 条：

- 3 条可展示候选：不同品类、不同价格、距离 0-1500m。
- 1 条 C 级云收藏：不可展示。
- 1 条低 POI 置信：不可展示。
- 1 条太远或停业：不可展示。

### 4.3.1 assetManifest

新增或维护 `src/mocks/assets.ts`：

```ts
export interface MockAssetRef {
  id: string;
  kind: 'food' | 'shop' | 'map' | 'avatar' | 'cover' | 'video' | 'placeholder';
  path?: string;
  placeholderColor?: string;
  description: string;
}
```

约束：

- 业务 mock 只引用 `assetId`。
- 组件通过 `resolveMockAsset(assetId)` 获取 `path` 或 `placeholderColor`。
- 后期替换真实素材时，只改 `public/assets/` 文件和 `src/mocks/assets.ts`，不要改组件。

运行素材目录：

| 目录 | 内容 |
| --- | --- |
| `public/assets/food/` | 菜品、饮品、套餐图片 |
| `public/assets/shops/` | 门店外立面、室内、Logo |
| `public/assets/maps/` | 静态路线图、抽象路线图、地图 API 截图 |
| `public/assets/avatars/` | 达人头像、评论头像 |
| `public/assets/videos/` | 原收藏探店视频、普通 Feed 视频 |
| `public/assets/covers/` | 当前 demo 兼容封面 |

### 4.4 feedItems

```ts
export const feedItems = [
  { id: 'f_001', type: 'video', title: '普通短视频 1' },
  { id: 'f_002', type: 'video', title: '普通短视频 2' },
  { id: 'biteback_slot', type: 'biteback' },
  { id: 'f_003', type: 'video', title: '普通短视频 3' }
];
```

BiteBack 默认在用户消费 2 条普通内容后进入插入队列。

### 4.5 deckPages

BiteBack 不是单页卡片，而是可左右滑动的卡组。P0 至少配置 3 个页：

```ts
export type BiteBackDeckPage = 'nearby' | 'route' | 'proof' | 'action';

export const deckPages: BiteBackDeckPage[] = [
  'nearby',
  'action',
  'route',
  'proof'
];
```

页型含义：

| 页型 | 展示名 | 目标 |
| --- | --- | --- |
| `nearby` | 之前眼馋的，现在能吃上！ | 展示 1 主推 + 2 备选收藏店 |
| `action` | 今晚行动 | 展示马上开吃、发给朋友、稍后提醒、看店铺 |
| `route` | 怎么吃最顺 | 展示路线、步行时间、营业窗口、排队风险 |
| `proof` | 为什么是它们 | 展示原收藏视频、达人/评论证据、收藏时间 |

---

## 5. Gate 与排序逻辑

### 5.1 Gate 状态结构

```ts
export interface BiteBackGateStatus {
  memory: boolean;
  context: boolean;
  proximity: boolean;
  feed: boolean;
  quality: boolean;
  frequencyPrivacy: boolean;
}
```

### 5.2 Memory Gate

```ts
function passMemoryGate(memories: SavedFoodMemory[]) {
  return memories.some(memory =>
    ['S', 'A', 'B'].includes(memory.memoryLevel) &&
    memory.poiConfidence >= 0.85
  );
}
```

### 5.3 Context Gate

```ts
function passContextGate(context: CurrentContext) {
  return (
    context.isMealTime &&
    context.isOuting &&
    context.isStationary
  );
}
```

说明：搜索不是必过条件。若有 `recentFoodSearch`，只影响排序。

### 5.4 Proximity Gate

```ts
function passProximityGate(memories: SavedFoodMemory[]) {
  return memories.filter(memory =>
    memory.distanceM <= 3000 &&
    memory.walkMinutes <= 20 &&
    memory.isOpen
  ).length >= 1;
}
```

多店卡优先展示 2-3 家；如果只有 1 家，则展示单店卡。

### 5.5 Feed Gate

```ts
function passFeedGate(feedState: FeedState) {
  return (
    feedState.normalVideosConsumed >= 2 &&
    !feedState.fastSwiping &&
    !feedState.deepWatching &&
    !feedState.recentCommercialComponent
  );
}
```

### 5.6 Quality Gate

```ts
function passQualityGate(memory: SavedFoodMemory) {
  return (
    memory.poiConfidence >= 0.85 &&
    memory.shopQuality >= 0.75 &&
    memory.isOpen
  );
}
```

### 5.7 Frequency & Privacy Gate

```ts
function passFrequencyPrivacyGate(user: UserProfile, memory: SavedFoodMemory) {
  return (
    user.locationAuthorized &&
    user.biteBackExposureToday < 1 &&
    !user.closedBiteBack &&
    !user.negativeFeedbackTags.includes(memory.poiId)
  );
}
```

### 5.8 排序

```ts
function rankSavedMemory(memory: SavedFoodMemory, context: CurrentContext) {
  const proximityFit = Math.max(0, 1 - memory.distanceM / 3000);
  const actionability = memory.isOpen ? 1 : 0;
  const contextFit = getContextFit(memory, context);
  const diversityFit = getDiversityFit(memory);

  return (
    memory.memoryStrength * 0.28 +
    contextFit * 0.20 +
    proximityFit * 0.18 +
    memory.poiConfidence * 0.12 +
    memory.shopQuality * 0.10 +
    diversityFit * 0.07 +
    actionability * 0.05
  );
}
```

`dealAvailable` 不进入排序，只做小标签。

---

## 6. 组件拆分

建议组件：

```text
src/components/
├── Feed.tsx
├── BiteBackDeck.tsx
├── BiteBackDeckShell.tsx
├── BiteBackNearbyPage.tsx
├── BiteBackRoutePage.tsx
├── BiteBackProofPage.tsx
├── BiteBackActionPage.tsx
├── SavedShopTile.tsx
├── ShopDetailSheet.tsx
├── ReasonSheet.tsx
├── FeedbackSheet.tsx
├── StatusBar.tsx
└── DebugPanel.tsx
```

### 6.1 BiteBackDeck

Props：

```ts
interface BiteBackDeckProps {
  candidates: SavedFoodMemory[];
  context: CurrentContext;
  selectedIndex: number;
  activePage: BiteBackDeckPage;
  onSelectCandidate: (index: number) => void;
  onChangePage: (page: BiteBackDeckPage) => void;
  onStartEating: (memory: SavedFoodMemory) => void;
  onAddToToday: (memory: SavedFoodMemory) => void;
  onRouteIntent: (memory: SavedFoodMemory) => void;
  onOpenShop: (memory: SavedFoodMemory) => void;
  onOpenSourceVideo: (memory: SavedFoodMemory) => void;
  onShareToFriend: (memory: SavedFoodMemory) => void;
  onRemindLater: (minutes: number) => void;
  onRefreshCandidates: () => void;
  onOpenReason: () => void;
  onOpenFeedback: () => void;
}
```

职责：

- 控制横向卡组。
- 渲染统一背景、标题、AI 整理标签、底部分页条、底部 CTA。
- 根据 `activePage` 渲染不同页内容。
- 通过 `assetId` 获取图片/视频资源；没有 `path` 时渲染 `placeholderColor` 色块。
- 所有业务状态放 App，组件内只维护轻量 UI 动效。

### 6.2 BiteBackDeckShell

统一外壳，参考官方示例：

- 顶部保留抖音频道和搜索区域。
- 背景图铺满屏幕，叠加深色渐变。
- 大标题位于上半屏。
- 右侧小标签：`AI整理`。
- 中部内容容器使用半透明玻璃质感。
- 底部使用分页进度条。
- 底部固定按钮：`不感兴趣` / `马上开吃`。
- 最底部提示：`上滑继续看视频`。

### 6.3 BiteBackNearbyPage

必须展示：

- 标题：`之前眼馋的，现在能吃上！`
- 副标题：`从收藏夹里捞出 3 家，现在能去`
- 全屏背景：主推菜品或门店氛围图；没有素材时用色块。
- 三图拼贴：主推大图 + 两个备选小图。
- 主推店行动信息：距离、步行分钟、营业状态。
- 收藏记忆：`18 天前你收藏过这家`。
- 一句 AI 判断：`这几家都是你之前收藏过的，现在晚饭可去。`

### 6.4 BiteBackRoutePage

参考官方路线页的结构，但用于到店路径：

- 路线摘要：步行/打车时间。
- 排队风险、营业到几点。
- 简化路线线条：当前位置 -> 主推店 -> 备选甜品。
- AI 判断：当前最顺路选择。
- 次优方案 mini card。

不做真实地图，只画抽象路径。

### 6.5 BiteBackProofPage

证明推荐来自收藏：

- 原收藏视频缩略图。
- 原视频标题。
- 达人名或内容来源。
- 收藏时间，例如 `18 天前收藏`。
- 2-3 条收藏证据即可，不要做完整列表。

### 6.6 BiteBackActionPage

展示轻行动，不强商业：

- 马上开吃。
- 加入今晚。
- 发给朋友。
- 稍后提醒。
- 看店铺。
- 弱露出团购，例如 `有可用团购` 小 chip。

“马上开吃”点击后打开行动聚合 Sheet，信息顺序固定为：

已定方案：`route_first`。首屏必须先展示距离、步行时间、口语化路线、路线卡和营业/排队确定性；图片、评论和团购只能在其后辅助出现。

1. 地点和可达性。
2. 营业和时间确定性。
3. 评论区评论 + 达人原话。
4. 活动/券弱露出。
5. 看路线 / 打开店铺 / 发给朋友。

建议组件名：`StartEatingSheet`。

`StartEatingSheet` 必须从 `SavedFoodMemory` 和 route mock 中读取数据，不允许硬编码：

```ts
interface StartEatingSheetProps {
  memory: SavedFoodMemory;
  onRouteIntent: (memory: SavedFoodMemory) => void;
  onOpenShop: (memory: SavedFoodMemory) => void;
  onShareToFriend: (memory: SavedFoodMemory) => void;
}
```

首屏布局：

```text
StartEatingSheet
├── handle
├── shop summary: 店名 / 招牌菜 / 你 X 天前收藏
├── reachability hero: 距离 / 步行分钟 / 口语化路线
├── route card: mapAssetId 或 routePolylineMock
├── certainty row: 营业到几点 / 预计到店 / 排队风险
├── content proof: 评论区一句 + 达人原话一句
├── deal chip: 有可用团购
└── bottom actions: 看路线 / 打开店铺 / 发给朋友
```

没有地图素材时，`route card` 渲染深色底 + 抽象路线线条；后续真实素材放入 `public/assets/maps/`，只更新 `src/mocks/assets.ts`。

### 6.7 SavedShopTile

用于展示候选店 mini row：

- 封面。
- 店名。
- 品类 / 招牌菜。
- 距离 / 步行分钟。
- 营业状态。
- 人均。

### 6.8 ShopDetailSheet

底部 Sheet 内容：

- 大图。
- 店名、品类、商圈。
- 招牌菜 chips。
- “你 X 天前收藏”。
- 距离、营业到几点、人均。
- 弱露出团购。
- CTA：马上开吃、看路线、看店铺、加入今晚。

### 6.9 ReasonSheet

展示 4 条以内理由：

```text
这几家来自你的美食收藏。
现在接近晚饭时间。
它们在南科大 / 宝能城附近可达。
当前营业，适合现在出发。
```

禁止出现“我们检测到你刚到这里”。

### 6.10 FeedbackSheet

反馈项：

- 今天不想吃这个。
- 太远了。
- 已经吃过了。
- 先别打扰我。
- 不是我想收藏的店。
- 别再提醒收藏。

点击后：

- 更新 `negativeFeedback` 指标。
- 轻反馈用于重排或当前 session 冷却，永久关闭只在“别再提醒收藏”触发。
- Debug 面板显示原因。

---

## 7. 卡片 UI 规格

### 7.1 官方示例转译

根据官方示例，BiteBack 使用同一套 Feed 原生卡组外壳：

1. 背景图铺满屏幕，上方保留抖音频道导航。
2. 背景上叠深色渐变，保证文字可读。
3. 大标题使用 32-40px，直接说明场景。
4. 右侧使用小型 `AI整理` 标签。
5. 中部为半透明内容卡。
6. 内容卡根据横滑页型切换。
7. 底部有分页进度条。
8. 底部固定两个按钮：`不感兴趣` / `马上开吃`。
9. 底部提示：`上滑继续看视频`。

### 7.2 卡组页型布局

P0 必须包含：

| 页型 | 必须包含 |
| --- | --- |
| 之前眼馋的，现在能吃上！ | 标题、副标题、关键事实条、主推店、2 个备选、AI 判断 |
| 今晚行动 | 马上开吃、加入今晚、发给朋友、稍后提醒、看店铺、弱团购标签 |
| 怎么吃最顺 | 步行/打车时间、营业窗口、排队风险、抽象路线图、次优方案 |
| 为什么是它们 | 原收藏视频缩略图、标题、达人、收藏时间、AI 整理理由 |

### 7.3 文案规范

推荐文案：

- `你收藏过的 3 家，现在都在附近`
- `现在最适合：步行约 6 分钟`
- `你 18 天前收藏`
- `营业到 22:00`
- `从收藏夹里帮你挑了这几家`
- `甜品可以饭后顺路去`

避免文案：

- `我们发现你在南山`
- `你刚经过这家店`
- `限时抢券`
- `大数据猜你饿了`

### 7.4 视觉规范

- 卡组宽度撑满 Feed 内容区，保留 12-14px 内边距。
- 圆角不超过 8px。
- 内容卡可使用玻璃质感，但不要过度模糊。
- 单页只解决一个问题，不要把全部信息堆在一个页。
- Page 1 使用 D+B 结构：全屏背景图 + 三图拼贴卡。
- 主推大图使用 16:10 或 4:3，两个备选小图尺寸一致。
- 候选店行高度 56-68px。
- CTA 不超过 3 个，主 CTA 为 `马上开吃`。
- 团购标签只作为灰/暗红小 chip，不做主按钮。
- 不要把调试分数展示在卡片内。
- 分页进度条必须清楚表示当前页。
- 左右滑动时只切换卡组内容，不影响上下滑 Feed。

---

## 8. 状态机

```ts
type CardState =
  | 'FEED_IDLE'
  | 'CONTEXT_ELIGIBLE'
  | 'MEMORY_RECALL'
  | 'CARD_QUEUED'
  | 'CARD_EXPOSED'
  | 'DECK_PAGE_CHANGED'
  | 'CANDIDATE_EXPANDED'
  | 'REASON_OPENED'
  | 'ADD_TO_TODAY'
  | 'ROUTE_INTENT'
  | 'SHOP_OPEN'
  | 'SOURCE_VIDEO_OPEN'
  | 'SHARE_TO_FRIEND'
  | 'REMIND_LATER'
  | 'NEGATIVE_FEEDBACK'
  | 'COOLDOWN';
```

状态转移：

```text
FEED_IDLE
  -> CONTEXT_ELIGIBLE
  -> MEMORY_RECALL
  -> CARD_QUEUED
  -> CARD_EXPOSED
  -> DECK_PAGE_CHANGED
  -> CANDIDATE_EXPANDED / REASON_OPENED
  -> ADD_TO_TODAY / ROUTE_INTENT / SHOP_OPEN / SOURCE_VIDEO_OPEN / SHARE_TO_FRIEND / REMIND_LATER
  -> NEGATIVE_FEEDBACK
  -> COOLDOWN
```

---

## 9. 指标面板

至少展示：

| 指标 | 初始 | 变化 |
| --- | --- | --- |
| Eligible UV | 1 | 固定 |
| Card Exposure | 0 | 卡片出现后 +1 |
| Deck Page View | 1 | 左右滑到新页后 +1 |
| Candidate Select | 0 | 切换候选后 +1 |
| Valid Wake | 0 | 解释/横滑/马上开吃/看路线后 +1 |
| Start Eating | 0 | 点击马上开吃后 +1 |
| Add To Today | 0 | 在行动 Sheet 内点击加入今晚后 +1 |
| Route Intent | 0 | 点击看路线后 +1 |
| Shop Open | 0 | 打开详情/店铺后 +1 |
| Source Video Open | 0 | 点击原收藏视频后 +1 |
| Share To Friend | 0 | 点击发给朋友后 +1 |
| Remind Later | 0 | 点击稍后提醒后 +1 |
| Negative Feedback | 0 | 负反馈后 +1 |
| Cooldown | false | 关闭/负反馈后 true |

Control 组：

```text
Control：同样处在饭点和附近场景，但 Feed 不展示 BiteBack，只继续普通内容。
```

---

## 10. Demo 主线脚本

1. 打开 Demo，进入仿抖音 Feed。
2. 右侧调试面板显示用户当前场景：晚饭时间、南科大 / 宝能城、外出停留。
3. 用户刷 2 条普通视频。
4. Memory / Context / Proximity / Feed / Quality / Frequency Gate 通过。
5. 第 3 条位置出现 BiteBack 多页卡组。
6. Page 1「之前眼馋的，现在能吃上！」显示：
   - `之前眼馋的，现在能吃上！`
   - 主推：京鼎香·铜锅涮羊肉，395m，步行 6 分钟。
   - 备选：桃喜、奶龙炒饭。
7. 用户左右滑到 Page 2「今晚行动」，点击“马上开吃”。
8. 用户左右滑到 Page 3「怎么吃最顺」，看到路线摘要和抽象路径。
9. 用户左右滑到 Page 4「为什么是它们」，看到原收藏视频和收藏时间。
10. 用户点击第二家候选，主推区域切换。
11. 用户点击“为什么出现”，打开解释 Sheet。
12. 用户点击“看路线”，打开门店详情 Sheet。
13. 用户点击“不感兴趣”，选择“今天不想吃这个”，卡片冷却。
14. 切换 Control 组：同样场景下不展示 BiteBack。

### 10.1 可选演示

- 打开搜索页，搜索“南科大美食”，回 Feed 后只改变排序，不改变触发前提。
- 把场景改成 `home` 或 `非饭点`，Context Gate 拦截。
- 把候选距离改成 8km，Proximity Gate 拦截。
- 把 memoryLevel 改成 C，Memory Gate 拦截。

---

## 11. 验收标准

### 11.1 功能验收

- 不搜索也能触发 BiteBack。
- 必须基于历史收藏门店触发。
- 默认展示 3 个候选，至少 1 个主推 + 2 个备选。
- 必须支持左右滑动卡组，至少包含“之前眼馋的，现在能吃上！”，今晚行动、怎么吃最顺、为什么是它们四页。
- 候选可以切换，主推信息同步变化。
- 可以打开解释 Sheet。
- 可以打开门店详情 Sheet。
- 可以点击马上开吃。
- 可以在行动 Sheet 内加入今晚。
- 可以负反馈并进入冷却。
- Control 组不展示 BiteBack。

### 11.2 UI 验收

- 卡片第一眼像 Feed 内容组件，不像后台面板。
- 不只是旧视频封面 + 文案。
- 卡组页型清晰，每页只解决一个决策问题。
- 图片、门店、距离、营业、人均、收藏记忆都有明确层次。
- 多店候选不拥挤。
- CTA 清晰但不过度商业。
- 不出现大面积券、低价、抢购视觉。
- 移动端 375x812 内文字不溢出。

### 11.3 工程验收

- mock 数据集中在 `src/mocks/`。
- 静态素材路径通过 `src/config/assets.ts`。
- 素材 ID 与路径说明集中在 `src/mocks/assets.ts`。
- 组件内不硬编码绝对素材路径、图片文件名、地图 URL、真实门店文案。
- 没有真实图片时，组件能用 mock asset 的 `placeholderColor` 渲染色块。
- 地图页不依赖真实地图 API，优先使用 `mapAssetId` 或抽象路径 mock。
- `npm run build` 通过。
- 不依赖真实后端。
- 不新增无用根目录文件。

---

## 12. 实施顺序建议

1. 更新类型：`CurrentContext`、`SavedFoodMemory`、`BiteBackGateStatus`、指标类型。
2. 更新 mock：收藏门店、当前场景、Feed 数据。
3. 重写 gate/rank 工具函数。
4. 新建 `BiteBackDeck` 与 `BiteBackDeckShell`。
5. 新建 `BiteBackNearbyPage`、`BiteBackRoutePage`、`BiteBackProofPage`、`BiteBackActionPage`。
6. 添加 `ShopDetailSheet`、`ReasonSheet`、`FeedbackSheet`。
7. 更新 `Feed` 插入逻辑。
8. 更新 `DebugPanel` 指标与状态。
9. 弱化搜索页，把搜索改为排序加权可选流程。
10. 跑构建并检查 375x812 视觉，重点检查左右滑页、底部按钮和文字不溢出。

---

## 13. Coding Agent 禁区

- 不要继续把“搜索后回流”写成必要触发。
- 不要把 BiteBack 做成一张旧视频卡。
- 不要把券做成主按钮。
- 不要做真实定位、真实地图、真实支付。
- 不要在组件里硬编码素材路径、地图 API key、经纬度、真实图片 URL。
- 不要为了好看临时塞网图；没有素材就使用色块占位。
- 不要在卡片中展示调试分数。
- 不要让解释文案显得监控用户位置。
- 不要把多店卡做成传统列表页。

本项目展示重点是：**一张自然、好看、可行动的抖音 Feed 收藏美食卡片。**
