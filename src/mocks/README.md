# BiteBack Mock Data

这个目录集中存放 Demo 的可编辑数据。

- `user.ts`：默认用户、搜索会话、Feed 状态。
- `foodMemories.ts`：用户收藏美食记忆资产。
- `feed.ts`：推荐流视频、兜底视频、互动数字。
- `search.ts`：搜索建议、搜索结果页瀑布流、相关搜索。
- `index.ts`：统一导出。

资源路径不要在组件里硬编码。图片和视频统一放在 `public/assets/`，并通过 `src/config/assets.ts` 的 `coverAsset()` / `videoAsset()` 生成。

真实抖音界面截图只作为视觉参考，放在 `docs/reference/douyin-ui/`，不要混入运行时素材。
