# BiteBack Mock Data

这个目录集中存放 Demo 的可编辑数据。

- `user.ts`：默认用户、搜索会话、Feed 状态。
- `assets.ts`：素材 ID、运行路径、占位色和用途说明。
- `copy.json`：BiteBack 卡片、Sheet、按钮、反馈、Toast 等可编辑展示文案。
- `foodMemories.ts`：用户收藏美食记忆资产。
- `feed.ts`：推荐流视频、兜底视频、互动数字。
- `search.ts`：搜索建议、搜索结果页瀑布流、相关搜索。
- `index.ts`：统一导出。

资源路径不要在组件里硬编码。图片、视频、地图图和头像统一放在 `public/assets/`，并通过 `src/config/assets.ts` 和 `assets.ts` 生成。

业务 mock 应优先保存 `assetId`，而不是直接保存 `/assets/...` 路径。组件通过 `resolveMockAsset(assetId)` 获取真实路径或 `placeholderColor`。没有真实素材时用色块占位，后期只需要把素材放入 `public/assets/` 对应目录并更新 `assets.ts`。

文案 mock 应优先写在 `copy.json`。需要改“之前眼馋的，现在能吃上！”、“马上开吃”、按钮、Sheet 标题、解释文案、反馈项时，只改这个 JSON，不要进组件里找字符串。

真实抖音界面截图只作为视觉参考，放在 `docs/reference/douyin-ui/`，不要混入运行时素材。
