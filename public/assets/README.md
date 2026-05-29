# BiteBack Runtime Assets

这个目录只放 Demo 运行时需要读取的素材。组件不要直接写死图片或视频文件名，mock 数据应通过素材 ID 或路径 helper 引用。

## 目录约定

| 目录 | 内容 | 用途 |
| --- | --- | --- |
| `covers/` | 现有 demo 兼容封面 | 当前代码仍在使用的短视频/卡片封面 |
| `videos/` | 现有 demo 视频 | 普通 Feed 视频、原收藏探店视频 |
| `food/` | 菜品、饮品、套餐图片 | BiteBack 卡组主视觉、候选店小图 |
| `shops/` | 门店外立面、室内、Logo | 门店详情 Sheet、主推店环境图 |
| `maps/` | 静态路线图、抽象地图底图 | “怎么吃最顺”页；后续可替换为地图 API 截图 |
| `avatars/` | 达人头像、评论头像 | “为什么是它们”收藏证据页 |

## 占位策略

前期没有真实素材时，不需要随便找网图。组件应使用 mock 中的 `placeholderColor` 渲染色块占位。

后期替换真实素材时：

1. 把图片或视频放入上表对应目录。
2. 在 `src/mocks/assets.ts` 中补充或修改素材 ID 的 `path`。
3. 在 `src/mocks/foodMemories.ts` 等业务 mock 中引用素材 ID。
4. 不要在 React 组件里直接写 `/assets/...`。

## 地图 API 预留

P0 Demo 不接真实地图 API。若后续接入地图：

- 地图配置放在单独配置文件或环境变量中。
- mock 数据只保存 `mapAssetId`、`routePolylineMock`、`distanceText`、`durationText`。
- UI 组件先渲染 `maps/` 下的静态图或抽象路线，占位即可。
