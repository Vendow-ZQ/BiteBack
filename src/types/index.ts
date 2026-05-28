// BiteBack 类型定义

export type MemoryLevel = 'S' | 'A' | 'B' | 'C';

export type QueryIntent = 'food_decision' | 'other';

export type CardState =
  | 'SEARCH'
  | 'RETURN_FEED'
  | 'GATE_CHECK'
  | 'GATE_BLOCK'
  | 'CARD_QUEUED'
  | 'CARD_EXPOSED'
  | 'EXPLANATION_OPENED'
  | 'DECISION_ACTION'
  | 'NEGATIVE_FEEDBACK'
  | 'COOLDOWN';

export interface UserProfile {
  userId: string;
  locationAuthorized: boolean;
  biteBackExposureToday: number;
  negativeFeedbackTags: string[];
  closedBiteBack: boolean;
}

export interface SearchSession {
  query: string;
  queryIntent: QueryIntent;
  searchedAt: number;
  returnedToFeedAt: number;
  completedPoiAction: boolean;
  completedDealAction: boolean;
  completedRouteAction: boolean;
}

export interface FoodMemory {
  memoryId: string;
  videoId: string;
  coverUrl: string;
  title: string;
  shopName: string;
  poiId: string;
  businessArea: string;
  category: string;
  dishTags: string[];
  memoryLevel: MemoryLevel;
  memoryStrength: number;
  poiConfidence: number;
  distanceM: number;
  price: number;
  isOpen: boolean;
  shopQuality: number;
  dealAvailable: boolean;
  lastInteractionDays: number;
}

export interface FeedVideo {
  id: string;
  type: 'video' | 'biteback';
  title?: string;
  coverUrl?: string;
}

export interface FeedState {
  normalVideosConsumed: number;
  fastSwiping: boolean;
  deepWatching: boolean;
  recentCommercialComponent: boolean;
  recentPrivacyNegative: boolean;
}

export interface GateStatus {
  eligibility: boolean;
  attribution: boolean;
  feedGuardrail: boolean;
  quality: boolean;
  frequency: boolean;
  business: boolean;
}

export interface Metrics {
  eligibleUV: number;
  cardExposure: number;
  validWake: number;
  decisionAction: number;
  negativeFeedback: number;
  cooldown: boolean;
}

export type NegativeFeedbackType =
  | 'too_far'
  | 'not_this_category'
  | 'already_visited'
  | 'wrong_poi'
  | 'close_biteback';
