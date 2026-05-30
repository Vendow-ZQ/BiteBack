import { avatarAsset, coverAsset, foodAsset, mapAsset, shopAsset } from '../config/assets';

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
    placeholderColor: '#7b2f24',
    description: '主推铜锅涮羊肉/热乎晚饭菜品图，用于 P1 主推大图'
  },
  'food-dessert-main': {
    id: 'food-dessert-main',
    kind: 'food',
    path: foodAsset('dessert-main.jpg'),
    placeholderColor: '#a26875',
    description: '备选甜品/饮品图，用于 P1 备选小图和饭后顺路建议'
  },
  'food-fried-rice': {
    id: 'food-fried-rice',
    kind: 'food',
    path: foodAsset('fried-rice.jpg'),
    placeholderColor: '#b77c35',
    description: '奶龙炒饭/校园创意饭菜品图，用于备选收藏门店'
  },
  'food-snack-street': {
    id: 'food-snack-street',
    kind: 'food',
    placeholderColor: '#8b3f2d',
    description: '夜市小吃图，用于不可展示/远距离测试 memory'
  },
  'shop-hotpot-front': {
    id: 'shop-hotpot-front',
    kind: 'shop',
    path: shopAsset('hotpot-front.jpg'),
    placeholderColor: '#344838',
    description: '主推门店外立面或室内环境图，用于门店详情 Sheet'
  },
  'shop-dessert-front': {
    id: 'shop-dessert-front',
    kind: 'shop',
    path: shopAsset('dessert-front.jpg'),
    placeholderColor: '#6f4d5a',
    description: '桃喜/甜品店门店图，用于候选店和详情 Sheet'
  },
  'shop-campus-canteen': {
    id: 'shop-campus-canteen',
    kind: 'shop',
    path: shopAsset('campus-canteen.jpg'),
    placeholderColor: '#555b3a',
    description: '校园餐厅门店图，用于炒饭/食堂候选'
  },
  'map-campus-route': {
    id: 'map-campus-route',
    kind: 'map',
    path: mapAsset('campus-route.jpg'),
    placeholderColor: '#1f5a44',
    description: '从南科大地铁站 A 口到主推店的静态路线图，用于路线 Sheet'
  },
  'map-dessert-route': {
    id: 'map-dessert-route',
    kind: 'map',
    path: mapAsset('dessert-route.jpg'),
    placeholderColor: '#24505b',
    description: '饭后去甜品/饮品店的路线图，用于顺路建议'
  },
  'creator-avatar-food': {
    id: 'creator-avatar-food',
    kind: 'avatar',
    path: avatarAsset('creator-food.svg'),
    placeholderColor: '#596575',
    description: '原收藏视频作者头像，用于“为什么是它们”收藏证据页'
  },
  'creator-avatar-campus': {
    id: 'creator-avatar-campus',
    kind: 'avatar',
    path: avatarAsset('creator-campus.svg'),
    placeholderColor: '#5f5841',
    description: '校园美食作者头像，用于评论和达人证据'
  },
  'source-video-hotpot': {
    id: 'source-video-hotpot',
    kind: 'video',
    placeholderColor: '#4b332c',
    description: '原收藏铜锅涮探店视频占位。后续如需真实视频，再在这里补 path'
  },
  'source-video-campus': {
    id: 'source-video-campus',
    kind: 'video',
    placeholderColor: '#5c4b2d',
    description: '原收藏校园美食视频占位。后续如需真实视频，再在这里补 path'
  },
  'cover-hotpot': {
    id: 'cover-hotpot',
    kind: 'cover',
    path: coverAsset('hotpot-source.jpg'),
    placeholderColor: '#4b332c',
    description: '铜锅涮原收藏视频封面，用于收藏证据和来源回看'
  },
  'cover-dessert': {
    id: 'cover-dessert',
    kind: 'cover',
    path: coverAsset('dessert-source.jpg'),
    placeholderColor: '#72515c',
    description: '甜品/饮品原收藏视频封面，用于饭后顺路建议'
  },
  'cover-campus': {
    id: 'cover-campus',
    kind: 'cover',
    path: coverAsset('campus-source.jpg'),
    placeholderColor: '#6b5f39',
    description: '校园炒饭原收藏视频封面，用于校园场景收藏证据'
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
