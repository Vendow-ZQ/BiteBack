# BiteBack - 收藏美食自然唤醒卡

> 抖音 AI 创变者计划 2026·黑客松联赛 - 赛道三｜AI体验：刷到懂你的瞬间

## 产品简介

BiteBack 是抖音 Feed 里的 AI 收藏美食自然唤醒卡。当用户在饭点、外出停留或附近可消费场景刷 Feed 时，系统从他过去收藏过但未到店的美食门店中召回当前可行动的候选，重新组织成一张自然出现、可左右滑动的多页决策卡组。

**核心 slogan**: "你以前收藏过的想吃，现在刚好在附近"

产品判断：收藏不该吃灰。BiteBack 不是附近陌生店推荐，也不是进店推券，而是在 Feed 里把用户曾经 mark 过的美食意愿，四两拨千斤地重新唤醒。

## 项目结构

```
BiteBack/
├── index.html              # 入口 HTML
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── README.md               # 项目说明
├── docs/
│   ├── PRD.md              # 产品需求文档
│   ├── SOP.md              # 工程实现规范
│   ├── BattleLog.md        # PM 与 Leader 讨论记录
│   ├── Material.md         # 比赛材料
│   └── reference/
│       └── douyin-ui/      # 真实抖音界面参考截图，不参与运行时展示
├── public/
│   └── assets/             # Demo 运行素材
│       ├── README.md       # 素材目录与替换说明
│       ├── food/           # 菜品、饮品、套餐图片
│       ├── shops/          # 门店外立面、室内、Logo
│       ├── maps/           # 静态路线图、抽象地图底图
│       ├── avatars/        # 达人头像、评论头像
│       ├── covers/
│       └── videos/
└── src/
    ├── main.tsx            # React 入口
    ├── App.tsx             # 主应用组件
    ├── vite-env.d.ts       # Vite 类型声明
    ├── config/
    │   └── assets.ts       # 静态素材根路径与路径生成
    ├── mocks/              # 可编辑 Demo 数据
    │   ├── README.md
    │   ├── assets.ts       # 素材 ID、路径、占位色、用途说明
    │   ├── copy.json       # 卡片、Sheet、按钮、反馈等可编辑文案
    │   ├── user.ts         # 默认用户、当前场景、Feed 状态
    │   ├── foodMemories.ts # 收藏美食门店记忆资产
    │   ├── feed.ts         # Feed 视频与互动数据
    │   ├── search.ts       # 搜索建议与搜索结果数据
    │   └── index.ts        # Mock 数据统一导出
    ├── types/
    │   └── index.ts        # 类型定义
    ├── utils/
    │   └── gates.ts        # 六大 Gate 逻辑
    └── components/
        ├── Feed.tsx              # Feed 主界面
        ├── BiteBackDeck.tsx      # 多页收藏唤醒卡组
        ├── StartEatingSheet.tsx  # “马上开吃”路线优先 Sheet
        ├── AssetBlock.tsx        # 素材 manifest 渲染/占位组件
        ├── SearchPage.tsx        # 搜索页（辅助加权入口）
        ├── DebugPanel.tsx        # Gate、候选、指标调试面板
        ├── GatePanel.tsx         # Gate 控制台
        └── MetricsPanel.tsx      # 指标面板
```

## 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Mock 与资源配置

- Demo 数据统一放在 `src/mocks/`，改当前场景、收藏门店、Feed 视频、候选卡片都从这里改。
- Demo 文案统一放在 `src/mocks/copy.json`，包括卡片标题、副标题、按钮、Sheet、Toast、反馈项；组件内不要硬编码展示文案。
- Demo 素材统一放在 `public/assets/`，不需要启动后端资源服务。
- 资源路径统一放在 `src/config/assets.ts`，默认指向 `/assets`。
- 素材 ID、路径、占位色和用途说明统一放在 `src/mocks/assets.ts`。
- 如需切换资源根路径，可设置 `VITE_ASSET_BASE_PATH`，组件内不要直接写具体素材路径、地图 URL 或真实图片文件名。
- BiteBack 卡片当前默认使用 mock asset 的 `placeholderColor` 渲染色块占位；不要把真实抖音参考截图或旧 demo 截图当作卡片素材。
- 后续替换真实图片时，只改 `public/assets/` 下的素材文件和 `src/mocks/assets.ts` 的 `path`，不改 React 组件。
- 真实抖音界面截图统一放在 `docs/reference/douyin-ui/`，只作为视觉参考，不放入 demo 素材池。

## 素材替换清单

当前 BiteBack 卡片里的图片位都先用色块占位。需要真实素材时，按下面路径补图，再到 `src/mocks/assets.ts` 给对应 ID 增加 `path`：

| 素材 ID | 建议文件位置 | 内容要求 | 使用位置 |
| --- | --- | --- | --- |
| `food-hotpot-main` | `public/assets/food/hotpot-main.jpg` | 铜锅涮羊肉/热乎晚饭近景，建议 4:3 或 16:10 | P1 主推大图、卡片背景 |
| `food-dessert-main` | `public/assets/food/dessert-main.jpg` | 桃喜/饮品/甜品图，干净、可识别 | P1 备选小图 |
| `food-fried-rice` | `public/assets/food/fried-rice.jpg` | 奶龙炒饭/校园餐厅菜品图 | P1 备选小图 |
| `shop-hotpot-front` | `public/assets/shops/hotpot-front.jpg` | 主推店外立面或室内环境 | 门店 Sheet |
| `shop-dessert-front` | `public/assets/shops/dessert-front.jpg` | 桃喜门店外立面或吧台 | 门店 Sheet |
| `shop-campus-canteen` | `public/assets/shops/campus-canteen.jpg` | 校园餐厅环境 | 门店 Sheet |
| `map-campus-route` | `public/assets/maps/campus-route.png` | 南科大地铁站到主推店的静态路线图或地图 API 截图 | 路线页、马上开吃 Sheet |
| `map-dessert-route` | `public/assets/maps/dessert-route.png` | 饭后顺路甜品/饮品路线图 | 路线页备用 |
| `cover-hotpot` | `public/assets/covers/hotpot-source.jpg` | 原收藏铜锅涮视频封面 | “为什么是它们”页 |
| `cover-dessert` | `public/assets/covers/dessert-source.jpg` | 原收藏饮品/甜品视频封面 | “为什么是它们”页 |
| `cover-campus` | `public/assets/covers/campus-source.jpg` | 原收藏校园饭视频封面 | “为什么是它们”页 |
| `creator-avatar-food` | `public/assets/avatars/creator-food.jpg` | 探店达人头像 | 证据页/后续评论区 |
| `creator-avatar-campus` | `public/assets/avatars/creator-campus.jpg` | 校园美食作者头像 | 证据页/后续评论区 |

## Demo 演示流程

1. 打开应用，进入仿抖音 Feed
2. 预设当前场景：晚饭时间、南科大 / 宝能城附近、外出停留
3. 向上滑动 2 条普通视频
4. 第 3 条位置自然出现 BiteBack 多页收藏卡组
5. Page 1「之前眼馋的，现在能吃上！」展示 1 家主推 + 2 家备选收藏门店
6. 左右滑到 Page 2 点击“马上开吃”承接行动
7. 左右滑到 Page 3 查看“怎么吃最顺”
8. 左右滑到 Page 4 查看“为什么是它们”
9. 可切换候选店、看路线、打开门店详情、加入今晚
10. “马上开吃”先展示地点可达和营业确定性，再展示评论区和达人原话
11. 可点击"不感兴趣"进行负反馈并进入冷却
12. 右侧面板实时显示 Gate、排序和指标变化
13. 可切换 Control 组对比体验

## 六大 Gate

1. **Memory Gate** - 是否存在可唤醒的 S/A/B 收藏美食门店
2. **Context Gate** - 当前是否是饭点、外出、停留等可行动场景
3. **Proximity Gate** - 收藏门店是否在附近可达
4. **Feed Gate** - Feed 当前是否适合自然插入卡片
5. **Quality Gate** - POI 置信、营业状态、店铺质量是否可信
6. **Frequency & Privacy Gate** - 频控、隐私、负反馈是否通过

## 核心功能

- ✅ 仿抖音 Feed 滑动体验
- ✅ 饭点/附近/停留场景模拟
- ✅ 六大 Gate 实时判断与可视化
- ✅ AI 收藏门店召回与多候选排序
- ✅ BiteBack 多页卡组（之前眼馋的现在能吃上、今晚行动、怎么吃最顺、为什么是它们）
- ✅ 解释层"为什么出现"
- ✅ 负反馈与冷却机制
- ✅ Treatment vs Control 对比
- ✅ 实时指标面板

## 技术栈

- React 18 + TypeScript
- Vite（构建工具）
- 纯 CSS（零 UI 库依赖）

## 不触发场景演示

- 非饭点 / 居家场景 → Context Gate 拦截
- 附近没有收藏门店 → Proximity Gate 拦截
- C 级云收藏 → Memory Gate 拦截
- 低置信 POI（<0.85）→ Quality Gate 拦截
- 负反馈后 → Frequency & Privacy Gate 拦截

## 项目文档

- [docs/PRD.md](docs/PRD.md) - 产品需求文档
- [docs/SOP.md](docs/SOP.md) - 工程实现规范
- [docs/BattleLog.md](docs/BattleLog.md) - 产品决策讨论记录
- [docs/Material.md](docs/Material.md) - 比赛材料

## 开发团队

- **Agent A / Nash**: 校招抖音 AI 产品经理
- **Agent B / Volta**: 抖音 Feed 负责人

---

Built for 抖音 AI 创变者计划 2026 · 黑客松联赛
