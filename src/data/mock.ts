import type {
  UserProfile,
  SearchSession,
  FoodMemory,
  FeedVideo,
  FeedState
} from '../types';

// 用户档案
export const defaultUserProfile: UserProfile = {
  userId: 'u_001',
  locationAuthorized: true,
  biteBackExposureToday: 0,
  negativeFeedbackTags: [],
  closedBiteBack: false
};

// 搜索会话
export const defaultSearchSession: SearchSession = {
  query: '南科大附近晚饭',
  queryIntent: 'food_decision',
  searchedAt: Date.now(),
  returnedToFeedAt: Date.now() + 2 * 60 * 1000, // 2分钟后返回
  completedPoiAction: false,
  completedDealAction: false,
  completedRouteAction: false
};

// Food Memory 资产（5条，包含1个不触发样例）
export const foodMemories: FoodMemory[] = [
  {
    memoryId: 'm_001',
    videoId: 'v_001',
    coverUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=600&fit=crop',
    title: '这家牛肉面真的香迷糊了',
    shopName: '老巷牛肉面',
    poiId: 'poi_001',
    businessArea: '南科大',
    category: '面馆',
    dishTags: ['牛肉面', '红油抄手'],
    memoryLevel: 'A',
    memoryStrength: 0.82,
    poiConfidence: 0.91,
    distanceM: 900,
    price: 38,
    isOpen: true,
    shopQuality: 0.88,
    dealAvailable: true,
    lastInteractionDays: 43
  },
  {
    memoryId: 'm_002',
    videoId: 'v_002',
    coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=600&fit=crop',
    title: '藏在巷子里的宝藏烧烤',
    shopName: '深夜烧烤摊',
    poiId: 'poi_002',
    businessArea: '南科大',
    category: '烧烤',
    dishTags: ['烤串', '啤酒'],
    memoryLevel: 'S',
    memoryStrength: 0.95,
    poiConfidence: 0.89,
    distanceM: 1200,
    price: 65,
    isOpen: true,
    shopQuality: 0.85,
    dealAvailable: true,
    lastInteractionDays: 12
  },
  {
    memoryId: 'm_003',
    videoId: 'v_003',
    coverUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=600&fit=crop',
    title: '广式早茶必吃',
    shopName: '点都德',
    poiId: 'poi_003',
    businessArea: '科技园',
    category: '粤菜',
    dishTags: ['虾饺', '叉烧包'],
    memoryLevel: 'B',
    memoryStrength: 0.65,
    poiConfidence: 0.92,
    distanceM: 2500,
    price: 88,
    isOpen: true,
    shopQuality: 0.90,
    dealAvailable: false,
    lastInteractionDays: 78
  },
  {
    memoryId: 'm_004',
    videoId: 'v_004',
    coverUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=600&fit=crop',
    title: '日料放题天花板',
    shopName: '极上寿司',
    poiId: 'poi_004',
    businessArea: '海岸城',
    category: '日料',
    dishTags: ['寿司', '刺身'],
    memoryLevel: 'A',
    memoryStrength: 0.78,
    poiConfidence: 0.87,
    distanceM: 3500,
    price: 198,
    isOpen: false, // 不触发：店铺未营业
    shopQuality: 0.82,
    dealAvailable: true,
    lastInteractionDays: 56
  },
  {
    memoryId: 'm_005',
    videoId: 'v_005',
    coverUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=600&fit=crop',
    title: '看着就饿的披萨',
    shopName: '意式披萨屋',
    poiId: 'poi_005',
    businessArea: '福田',
    category: '西餐',
    dishTags: ['披萨', '意面'],
    memoryLevel: 'C', // 不触发：C级云收藏
    memoryStrength: 0.35,
    poiConfidence: 0.60, // 不触发：置信度低
    distanceM: 8000,
    price: 128,
    isOpen: true,
    shopQuality: 0.70,
    dealAvailable: false,
    lastInteractionDays: 120
  }
];

// Feed 视频列表
export const feedVideos: FeedVideo[] = [
  { id: 'f_001', type: 'video', title: '普通短视频 1', coverUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=700&fit=crop' },
  { id: 'f_002', type: 'video', title: '普通短视频 2', coverUrl: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=400&h=700&fit=crop' },
  { id: 'biteback_slot', type: 'biteback' },
  { id: 'f_003', type: 'video', title: '普通短视频 3', coverUrl: 'https://images.unsplash.com/photo-1588953936179-d2a4734c8bda?w=400&h=700&fit=crop' },
  { id: 'f_004', type: 'video', title: '普通短视频 4', coverUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=700&fit=crop' },
  { id: 'f_005', type: 'video', title: '普通短视频 5', coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop' }
];

// Feed 状态
export const defaultFeedState: FeedState = {
  normalVideosConsumed: 0,
  fastSwiping: false,
  deepWatching: false,
  recentCommercialComponent: false,
  recentPrivacyNegative: false
};

// 视频封面（用于普通视频）
export const videoCovers = [
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1588953936179-d2a4734c8bda?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop'
];
