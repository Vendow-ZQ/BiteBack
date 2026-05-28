import type { FeedState, SearchSession, UserProfile } from '../types';

export const defaultUserProfile: UserProfile = {
  userId: 'u_001',
  locationAuthorized: true,
  biteBackExposureToday: 0,
  negativeFeedbackTags: [],
  closedBiteBack: false
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
  recentCommercialComponent: false,
  recentPrivacyNegative: false
};
