// BiteBack type definitions

export type MemoryLevel = 'S' | 'A' | 'B' | 'C';

export type TimeLabel = 'lunch' | 'dinner' | 'late_night' | 'other';

export type SceneType = 'metro' | 'taxi' | 'mall' | 'campus' | 'cafe' | 'home';

export type BiteBackDeckPage = 'nearby' | 'action' | 'route' | 'proof';

export type CardState =
  | 'FEED_IDLE'
  | 'CONTEXT_ELIGIBLE'
  | 'MEMORY_RECALL'
  | 'CARD_QUEUED'
  | 'CARD_EXPOSED'
  | 'DECK_PAGE_CHANGED'
  | 'CANDIDATE_EXPANDED'
  | 'REASON_OPENED'
  | 'START_EATING'
  | 'ADD_TO_TODAY'
  | 'ROUTE_INTENT'
  | 'SHOP_OPEN'
  | 'SOURCE_VIDEO_OPEN'
  | 'SHARE_TO_FRIEND'
  | 'REMIND_LATER'
  | 'NEGATIVE_FEEDBACK'
  | 'COOLDOWN';

export interface UserProfile {
  userId: string;
  locationAuthorized: boolean;
  biteBackExposureToday: number;
  closedBiteBack: boolean;
  negativeFeedbackTags: string[];
  savedFoodCount: number;
}

export interface CurrentContext {
  timeLabel: TimeLabel;
  scene: SceneType;
  areaName: string;
  isMealTime: boolean;
  isOuting: boolean;
  isStationary: boolean;
  recentFoodSearch?: string;
}

export interface RoutePoint {
  x: number;
  y: number;
}

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
  sourceCoverAssetId: string;
  creatorAvatarAssetId: string;
  savedDaysAgo: number;
  sourceTitle: string;
  creatorName: string;
  memoryLevel: MemoryLevel;
  memoryStrength: number;
  poiConfidence: number;
  shopQuality: number;
  distanceM: number;
  walkMinutes: number;
  taxiMinutes: number;
  pricePerPerson: number;
  isOpen: boolean;
  openUntil: string;
  dealAvailable: boolean;
  dealText?: string;
  reason: string;
  routeHint: string;
  routeSummary: string;
  arrivalText: string;
  queueRisk: '低' | '中' | '高';
  routeProvider: 'mock' | 'map_api';
  routePolylineMock: RoutePoint[];
  commentProof: string;
  creatorQuote: string;
  proofTagline: string;
  // Legacy fields kept so older non-active components still typecheck.
  videoId?: string;
  coverUrl?: string;
  title?: string;
  dishTags?: string[];
  price?: number;
  lastInteractionDays?: number;
}

export type FoodMemory = SavedFoodMemory;

export interface FeedVideo {
  id: string;
  type: 'video' | 'biteback';
  title?: string;
  coverUrl?: string;
  videoUrl?: string;
}

export interface EngagementStats {
  likes: number;
  comments: number;
  shares: number;
}

export interface SearchResultCard {
  id: string;
  image: string;
  title: string;
  author: string;
  date: string;
  likes: number;
  duration?: string;
  multi?: boolean;
}

export interface FeedState {
  normalVideosConsumed: number;
  fastSwiping: boolean;
  deepWatching: boolean;
  recentCommercialComponent: boolean;
}

export interface BiteBackGateStatus {
  memory: boolean;
  context: boolean;
  proximity: boolean;
  feed: boolean;
  quality: boolean;
  frequencyPrivacy: boolean;
}

export type GateStatus = BiteBackGateStatus;

export interface Metrics {
  eligibleUV: number;
  cardExposure: number;
  deckPageView: number;
  candidateSelect: number;
  validWake: number;
  startEating: number;
  addToToday: number;
  routeIntent: number;
  shopOpen: number;
  sourceVideoOpen: number;
  shareToFriend: number;
  remindLater: number;
  negativeFeedback: number;
  cooldown: boolean;
}

export type NegativeFeedbackType =
  | 'not_today'
  | 'too_far'
  | 'already_visited'
  | 'pause_session'
  | 'wrong_saved_shop'
  | 'close_biteback';

export type QueryIntent = 'food_decision' | 'other';

export interface SearchSession {
  query: string;
  queryIntent: QueryIntent;
  searchedAt: number;
  returnedToFeedAt: number;
  completedPoiAction: boolean;
  completedDealAction: boolean;
  completedRouteAction: boolean;
}
