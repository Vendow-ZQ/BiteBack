# BiteBack - 搜索后收藏美食唤醒卡

> 抖音 AI 创变者计划 2026·黑客松联赛 - 赛道三｜AI体验：刷到懂你的瞬间

## 产品简介

BiteBack 是抖音推荐流中的 AI 收藏美食唤醒卡。当用户搜索美食后未完成决策（未打开 POI、未购买团购、未查看路线），15分钟内回到推荐流时，系统用 AI 从其历史收藏中召回高置信、强匹配的美食 POI，生成一张自然出现在 Feed 中的唤醒卡片。

**核心 slogan**: "你刚搜过晚饭 · 这家你收藏过"

## 项目结构

```
BiteBack/
├── index.html              # 入口 HTML
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── README.md               # 项目说明
├── PRD.md                  # 产品需求文档
├── SOP.md                  # 工程实现规范
├── BattleLog.md            # PM 与 Leader 讨论记录
├── Material.md             # 比赛材料
└── src/
    ├── main.tsx            # React 入口
    ├── App.tsx             # 主应用组件
    ├── vite-env.d.ts       # Vite 类型声明
    ├── types/
    │   └── index.ts        # 类型定义
    ├── data/
    │   └── mock.ts         # Mock 数据
    ├── utils/
    │   └── gates.ts        # 六大 Gate 逻辑
    └── components/
        ├── Feed.tsx        # Feed 主界面
        ├── BiteBackCard.tsx # BiteBack 卡片
        ├── SearchPage.tsx  # 搜索页
        ├── GatePanel.tsx   # Gate 控制台
        └── MetricsPanel.tsx # 指标面板
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

## Demo 演示流程

1. 打开应用，进入仿抖音 Feed
2. 点击右上角"搜索"按钮
3. 选择"南科大附近晚饭"（或输入其他美食 query）
4. 在搜索结果页点击"返回 Feed"
5. 向上滑动 2 条普通视频
6. 第 3 条位置出现 BiteBack 卡片
7. 可点击"加入今天"、"看店铺"、"为什么推荐给我"
8. 可点击右上角"×"进行负反馈
9. 右侧面板实时显示 Gate 状态和指标变化
10. 可切换 Control 组对比体验

## 六大 Gate

1. **Eligibility Gate** - 准入条件（15分钟回流、美食意图、未转化）
2. **Attribution Gate** - 归因（搜索链路无转化行为）
3. **Feed Guardrail Gate** - Feed 护栏（已消费≥2条视频）
4. **Quality Gate** - 质量（POI置信度≥0.85、营业中）
5. **Frequency Gate** - 频次（当日未曝光、无负反馈）
6. **Business Gate** - 商业（店铺质量≥0.75，券不参与排序）

## 核心功能

- ✅ 仿抖音 Feed 滑动体验
- ✅ 搜索入口与意图识别
- ✅ 六大 Gate 实时判断与可视化
- ✅ AI 收藏 POI 召回与排序
- ✅ BiteBack 卡片（触发原因、视频封面、店铺信息、CTA）
- ✅ 解释层"为什么推荐给我"
- ✅ 负反馈与冷却机制
- ✅ Treatment vs Control 对比
- ✅ 实时指标面板

## 技术栈

- React 18 + TypeScript
- Vite（构建工具）
- 纯 CSS（零 UI 库依赖）

## 不触发场景演示

- 非美食 query（如"猫咪视频"）→ Eligibility Gate 拦截
- C 级收藏 → 不召回
- 低置信 POI（<0.85）→ Quality Gate 拦截
- 搜索已转化 → Attribution Gate 拦截
- 负反馈后 → Frequency Gate 拦截

## 项目文档

- [PRD.md](PRD.md) - 产品需求文档
- [SOP.md](SOP.md) - 工程实现规范
- [BattleLog.md](BattleLog.md) - 产品决策讨论记录

## 开发团队

- **Agent A / Nash**: 校招抖音 AI 产品经理
- **Agent B / Volta**: 抖音 Feed 负责人

---

Built for 抖音 AI 创变者计划 2026 · 黑客松联赛
