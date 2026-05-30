import type { CurrentContext, FeedState, SearchSession, UserProfile } from '../types';

export const defaultUserProfile: UserProfile = {
  userId: 'u_001',
  locationAuthorized: true,
  biteBackExposureToday: 0,
  closedBiteBack: false,
  negativeFeedbackTags: [],
  savedFoodCount: 26
};

export const defaultContext: CurrentContext = {
  timeLabel: 'dinner',
  scene: 'campus',
  areaName: '南科大 / 宝能城',
  isMealTime: true,
  isOuting: true,
  isStationary: true,
  recentFoodSearch: undefined
};

export const defaultSearchSession: SearchSession = {
  query: '',
  queryIntent: 'other',
  searchedAt: 0,
  returnedToFeedAt: 0,
  completedPoiAction: false,
  completedDealAction: false,
  completedRouteAction: false
};

export const defaultFeedState: FeedState = {
  normalVideosConsumed: 0,
  fastSwiping: false,
  deepWatching: false,
  recentCommercialComponent: false
};
