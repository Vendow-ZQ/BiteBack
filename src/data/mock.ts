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
  query: '',
  queryIntent: 'other',
  searchedAt: 0,
  returnedToFeedAt: 0,
  completedPoiAction: false,
  completedDealAction: false,
  completedRouteAction: false
};

// Food Memory 资产（5条，包含1个不触发样例）- 使用真实视频
export const foodMemories: FoodMemory[] = [
  {
    memoryId: 'm_001',
    videoId: 'v_001',
    coverUrl: 'http://localhost:8004/uploads/videos/video1.mp4',
    title: '跟着学生吃人均不过20的10家小店',
    shopName: '西丽旺棠夜市',
    poiId: 'poi_001',
    businessArea: '南科大',
    category: '小吃',
    dishTags: ['平价', '量大', '灌饼'],
    memoryLevel: 'A',
    memoryStrength: 0.82,
    poiConfidence: 0.91,
    distanceM: 1300,
    price: 20,
    isOpen: true,
    shopQuality: 0.88,
    dealAvailable: true,
    lastInteractionDays: 43
  },
  {
    memoryId: 'm_002',
    videoId: 'v_002',
    coverUrl: 'http://localhost:8004/uploads/videos/video2.mp4',
    title: '南科大食堂吃一顿饭多少钱',
    shopName: '南科大食堂',
    poiId: 'poi_002',
    businessArea: '南科大',
    category: '食堂',
    dishTags: ['学生餐', '实惠'],
    memoryLevel: 'S',
    memoryStrength: 0.95,
    poiConfidence: 0.89,
    distanceM: 500,
    price: 25,
    isOpen: true,
    shopQuality: 0.85,
    dealAvailable: false,
    lastInteractionDays: 12
  },
  {
    memoryId: 'm_003',
    videoId: 'v_003',
    coverUrl: 'http://localhost:8004/uploads/videos/video3.mp4',
    title: '南科大学生餐厅上新奶龙炒饭',
    shopName: '学生餐厅',
    poiId: 'poi_003',
    businessArea: '南科大',
    category: '炒饭',
    dishTags: ['创意菜', '网红'],
    memoryLevel: 'B',
    memoryStrength: 0.65,
    poiConfidence: 0.92,
    distanceM: 600,
    price: 35,
    isOpen: true,
    shopQuality: 0.90,
    dealAvailable: false,
    lastInteractionDays: 78
  },
  {
    memoryId: 'm_004',
    videoId: 'v_004',
    coverUrl: 'http://localhost:8004/uploads/videos/video4.mp4',
    title: '南科大Vlog | 又是纯摆的一天',
    shopName: '桃喜',
    poiId: 'poi_004',
    businessArea: '南科大',
    category: '茶饮',
    dishTags: ['下午茶', '甜品'],
    memoryLevel: 'A',
    memoryStrength: 0.78,
    poiConfidence: 0.87,
    distanceM: 800,
    price: 28,
    isOpen: false, // 不触发：店铺未营业
    shopQuality: 0.82,
    dealAvailable: true,
    lastInteractionDays: 56
  },
  {
    memoryId: 'm_005',
    videoId: 'v_005',
    coverUrl: 'http://localhost:8004/uploads/videos/video1.mp4',
    title: '其他美食',
    shopName: '其他店铺',
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

// Feed 视频列表 - 使用真实视频
export const feedVideos: FeedVideo[] = [
  { id: 'f_001', type: 'video', title: '南科大美食探店 | 今天吃什么', videoUrl: 'http://localhost:8004/uploads/videos/video1.mp4', coverUrl: 'http://localhost:8004/uploads/covers/20260528-151201.jpg' },
  { id: 'f_002', type: 'video', title: '学校食堂测评 | 南科大干饭日记', videoUrl: 'http://localhost:8004/uploads/videos/video2.mp4', coverUrl: 'http://localhost:8004/uploads/covers/20260528-151223.jpg' },
  { id: 'biteback_slot', type: 'biteback' },
  { id: 'f_003', type: 'video', title: '深圳美食推荐 | 周末去哪儿吃', videoUrl: 'http://localhost:8004/uploads/videos/video3.mp4', coverUrl: 'http://localhost:8004/uploads/covers/20260528-151229.jpg' },
  { id: 'f_004', type: 'video', title: '大学生日常 | 干饭人的一天', videoUrl: 'http://localhost:8004/uploads/videos/video4.mp4', coverUrl: 'http://localhost:8004/uploads/covers/20260528-151234.jpg' }
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
