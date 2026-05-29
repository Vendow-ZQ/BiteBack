import {
  avatarAsset,
  coverAsset,
  foodAsset,
  mapAsset,
  shopAsset,
  videoAsset
} from '../config/assets';

export type MockAssetKind =
  | 'food'
  | 'shop'
  | 'map'
  | 'avatar'
  | 'cover'
  | 'video'
  | 'placeholder';

export interface MockAssetRef {
  id: string;
  kind: MockAssetKind;
  path?: string;
  placeholderColor?: string;
  description: string;
}

export const mockAssets: Record<string, MockAssetRef> = {
  'food-hotpot-main': {
    id: 'food-hotpot-main',
    kind: 'food',
    path: foodAsset('hotpot-main.jpg'),
    placeholderColor: '#6f2f24',
    description: '主推火锅/铜锅涮羊肉菜品图，用于“今日附近”主推大图'
  },
  'food-dessert-main': {
    id: 'food-dessert-main',
    kind: 'food',
    path: foodAsset('dessert-main.jpg'),
    placeholderColor: '#8f5f72',
    description: '备选甜品/饮品图，用于候选店小图或饭后顺路页'
  },
  'shop-hotpot-front': {
    id: 'shop-hotpot-front',
    kind: 'shop',
    path: shopAsset('hotpot-front.jpg'),
    placeholderColor: '#3f4f3f',
    description: '主推门店外立面或室内环境图，用于门店详情 Sheet'
  },
  'map-campus-route': {
    id: 'map-campus-route',
    kind: 'map',
    path: mapAsset('campus-route.png'),
    placeholderColor: '#2f5d4a',
    description: '从当前区域到主推门店的静态路线图；未接地图 API 前可用抽象线条占位'
  },
  'creator-avatar-food': {
    id: 'creator-avatar-food',
    kind: 'avatar',
    path: avatarAsset('creator-food.jpg'),
    placeholderColor: '#596575',
    description: '原收藏视频作者头像，用于“为什么是它们”收藏证据页'
  },
  'source-video-hotpot': {
    id: 'source-video-hotpot',
    kind: 'video',
    path: videoAsset('video1.mp4'),
    placeholderColor: '#1f1f1f',
    description: '原收藏探店视频，用于收藏证据页或详情 Sheet'
  },
  'legacy-cover-hotpot': {
    id: 'legacy-cover-hotpot',
    kind: 'cover',
    path: coverAsset('20260528-162431.jpg'),
    placeholderColor: '#4b332c',
    description: '当前 demo 兼容封面，后续可替换为 food/ 或 shops/ 下的真实素材'
  }
};

export function resolveMockAsset(assetId: string): MockAssetRef {
  return mockAssets[assetId] || {
    id: assetId,
    kind: 'placeholder',
    placeholderColor: '#3a3a3a',
    description: '未配置素材，占位色块'
  };
}
