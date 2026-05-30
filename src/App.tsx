import { useEffect, useMemo, useState } from 'react';
import type {
  BiteBackDeckPage,
  CardState,
  CurrentContext,
  Metrics,
  NegativeFeedbackType,
  SavedFoodMemory,
  SearchSession,
  UserProfile,
  FeedState
} from './types';

import {
  defaultContext,
  defaultUserProfile,
  defaultSearchSession,
  foodMemories,
  feedVideos,
  defaultFeedState
} from './mocks';

import {
  allGatesPassed,
  getFirstFailedGate,
  getGateStatus,
  selectBiteBackCandidates
} from './utils/gates';

import Feed from './components/Feed';
import SearchPage from './components/SearchPage';
import SearchResultsPage from './components/SearchResultsPage';
import DebugPanel from './components/DebugPanel';
import StatusBar from './components/StatusBar';

const initialMetrics: Metrics = {
  eligibleUV: 1,
  cardExposure: 0,
  deckPageView: 1,
  candidateSelect: 0,
  validWake: 0,
  startEating: 0,
  addToToday: 0,
  routeIntent: 0,
  shopOpen: 0,
  sourceVideoOpen: 0,
  shareToFriend: 0,
  remindLater: 0,
  negativeFeedback: 0,
  cooldown: false
};

export default function App() {
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);
  const [context, setContext] = useState<CurrentContext>(defaultContext);
  const [searchSession, setSearchSession] = useState<SearchSession>(defaultSearchSession);
  const [feedState, setFeedState] = useState<FeedState>(defaultFeedState);
  const [cardState, setCardState] = useState<CardState>('FEED_IDLE');
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [activePage, setActivePage] = useState<BiteBackDeckPage>('nearby');
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isControlGroup, setIsControlGroup] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const candidates = useMemo(() => {
    return selectBiteBackCandidates(foodMemories, context, user);
  }, [context, user]);

  const selectedMemory = candidates[selectedCandidateIndex] || candidates[0] || null;

  const gateStatus = useMemo(() => {
    return getGateStatus(user, context, foodMemories, feedState, candidates);
  }, [user, context, feedState, candidates]);

  const showBiteBack = useMemo(() => {
    return allGatesPassed(gateStatus) && !isControlGroup && !metrics.cooldown && candidates.length > 0;
  }, [gateStatus, isControlGroup, metrics.cooldown, candidates.length]);

  const failureReason = useMemo(() => {
    if (allGatesPassed(gateStatus)) return null;
    return getFirstFailedGate(gateStatus);
  }, [gateStatus]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'd' || event.key === 'D') setShowDebug(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (selectedCandidateIndex >= candidates.length) {
      setSelectedCandidateIndex(0);
    }
  }, [candidates.length, selectedCandidateIndex]);

  useEffect(() => {
    if (metrics.cooldown) return;
    if (gateStatus.context && cardState === 'FEED_IDLE') setCardState('CONTEXT_ELIGIBLE');
    if (gateStatus.context && candidates.length > 0 && feedState.normalVideosConsumed > 0) {
      setCardState(prev => (prev === 'CONTEXT_ELIGIBLE' ? 'MEMORY_RECALL' : prev));
    }
    if (showBiteBack && metrics.cardExposure === 0) {
      setMetrics(prev => ({ ...prev, cardExposure: 1 }));
      setCardState('CARD_EXPOSED');
    }
  }, [
    gateStatus.context,
    candidates.length,
    feedState.normalVideosConsumed,
    showBiteBack,
    metrics.cardExposure,
    metrics.cooldown,
    cardState
  ]);

  const resetMetrics = () => setMetrics(initialMetrics);

  const markValidWake = () => {
    setMetrics(prev => ({ ...prev, validWake: prev.validWake + 1 }));
  };

  const handleSearch = (query: string) => {
    const now = Date.now();
    const isFoodQuery = !query.includes('猫咪');

    setSearchSession({
      query,
      queryIntent: isFoodQuery ? 'food_decision' : 'other',
      searchedAt: now,
      returnedToFeedAt: now + 2 * 60 * 1000,
      completedPoiAction: false,
      completedDealAction: false,
      completedRouteAction: false
    });
    setContext(prev => ({
      ...prev,
      recentFoodSearch: isFoodQuery ? query : undefined
    }));
    setShowSearch(false);
    setShowResults(true);
    setFeedState(defaultFeedState);
    setActivePage('nearby');
    setSelectedCandidateIndex(0);
    setCardState('FEED_IDLE');
    resetMetrics();
  };

  const handleReturnToFeed = () => {
    setSearchSession(prev => ({
      ...prev,
      returnedToFeedAt: Date.now()
    }));
    setShowResults(false);
    setCardState('CONTEXT_ELIGIBLE');
  };

  const handleVideoConsumed = () => {
    setFeedState(prev => ({ ...prev, normalVideosConsumed: prev.normalVideosConsumed + 1 }));
  };

  const handleSelectCandidate = (index: number) => {
    if (index === selectedCandidateIndex) return;
    setSelectedCandidateIndex(index);
    setCardState('CANDIDATE_EXPANDED');
    setMetrics(prev => ({
      ...prev,
      candidateSelect: prev.candidateSelect + 1,
      validWake: prev.validWake + 1
    }));
  };

  const handleChangePage = (page: BiteBackDeckPage) => {
    if (page === activePage) return;
    setActivePage(page);
    setCardState('DECK_PAGE_CHANGED');
    setMetrics(prev => ({
      ...prev,
      deckPageView: prev.deckPageView + 1,
      validWake: prev.validWake + 1
    }));
  };

  const handleStartEating = () => {
    setCardState('START_EATING');
    setMetrics(prev => ({
      ...prev,
      startEating: prev.startEating + 1,
      validWake: prev.validWake + 1
    }));
  };

  const handleRouteIntent = () => {
    setCardState('ROUTE_INTENT');
    setMetrics(prev => ({
      ...prev,
      routeIntent: prev.routeIntent + 1,
      validWake: prev.validWake + 1
    }));
  };

  const handleOpenShop = () => {
    setCardState('SHOP_OPEN');
    setMetrics(prev => ({
      ...prev,
      shopOpen: prev.shopOpen + 1,
      validWake: prev.validWake + 1
    }));
  };

  const handleOpenSourceVideo = () => {
    setCardState('SOURCE_VIDEO_OPEN');
    setMetrics(prev => ({
      ...prev,
      sourceVideoOpen: prev.sourceVideoOpen + 1,
      validWake: prev.validWake + 1
    }));
  };

  const handleShareToFriend = () => {
    setCardState('SHARE_TO_FRIEND');
    setMetrics(prev => ({
      ...prev,
      shareToFriend: prev.shareToFriend + 1,
      validWake: prev.validWake + 1
    }));
  };

  const handleRemindLater = () => {
    setCardState('REMIND_LATER');
    setMetrics(prev => ({
      ...prev,
      remindLater: prev.remindLater + 1,
      validWake: prev.validWake + 1
    }));
  };

  const handleOpenReason = () => {
    setCardState('REASON_OPENED');
    markValidWake();
  };

  const handleNegativeFeedback = (type: NegativeFeedbackType) => {
    setCardState('NEGATIVE_FEEDBACK');
    setMetrics(prev => ({ ...prev, negativeFeedback: prev.negativeFeedback + 1, cooldown: true }));

    setUser(prev => ({
      ...prev,
      negativeFeedbackTags:
        selectedMemory && type !== 'pause_session'
          ? [...prev.negativeFeedbackTags, selectedMemory.poiId]
          : prev.negativeFeedbackTags,
      closedBiteBack: type === 'close_biteback' ? true : prev.closedBiteBack
    }));

    window.setTimeout(() => setCardState('COOLDOWN'), 500);
  };

  const toggleControlGroup = () => {
    setIsControlGroup(prev => !prev);
    resetMetrics();
    setCardState('FEED_IDLE');
  };

  const handleReset = () => {
    setUser(defaultUserProfile);
    setContext(defaultContext);
    setSearchSession(defaultSearchSession);
    setFeedState(defaultFeedState);
    setCardState('FEED_IDLE');
    setActivePage('nearby');
    setSelectedCandidateIndex(0);
    resetMetrics();
    setShowResults(false);
    setShowSearch(false);
    setIsControlGroup(false);
  };

  const typedHandlers = {
    onStartEating: (_memory: SavedFoodMemory) => handleStartEating(),
    onRouteIntent: (_memory: SavedFoodMemory) => handleRouteIntent(),
    onOpenShop: (_memory: SavedFoodMemory) => handleOpenShop(),
    onOpenSourceVideo: (_memory: SavedFoodMemory) => handleOpenSourceVideo(),
    onShareToFriend: (_memory: SavedFoodMemory) => handleShareToFriend(),
    onRemindLater: (_minutes: number) => handleRemindLater()
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#090909',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: 375,
          height: 812,
          background: '#08080b',
          borderRadius: 28,
          padding: 8,
          boxShadow: '0 30px 70px rgba(0,0,0,0.65)',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#000',
            borderRadius: 22,
            overflow: 'hidden',
            position: 'relative',
            color: '#fff'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 80, pointerEvents: 'none' }}>
            <StatusBar time="18:36" battery={56} />
          </div>

          <Feed
            videos={feedVideos}
            candidates={candidates}
            context={context}
            showBiteBack={showBiteBack}
            isControlGroup={isControlGroup}
            selectedIndex={selectedCandidateIndex}
            activePage={activePage}
            onVideoConsumed={handleVideoConsumed}
            onSelectCandidate={handleSelectCandidate}
            onChangePage={handleChangePage}
            onStartEating={typedHandlers.onStartEating}
            onRouteIntent={typedHandlers.onRouteIntent}
            onOpenShop={typedHandlers.onOpenShop}
            onOpenSourceVideo={typedHandlers.onOpenSourceVideo}
            onShareToFriend={typedHandlers.onShareToFriend}
            onRemindLater={typedHandlers.onRemindLater}
            onOpenReason={handleOpenReason}
            onNegativeFeedback={handleNegativeFeedback}
            onSearchClick={() => setShowSearch(true)}
          />

          {showResults && (
            <SearchResultsPage
              query={searchSession.query}
              onBack={handleReturnToFeed}
              onSearch={handleSearch}
            />
          )}

          {showSearch && (
            <SearchPage onSearch={handleSearch} onCancel={() => setShowSearch(false)} />
          )}

          {!showSearch && !showResults && (
            <PhoneBottomNav />
          )}
        </div>
      </div>

      {showDebug && (
        <DebugPanel
          gateStatus={gateStatus}
          cardState={cardState}
          metrics={metrics}
          user={user}
          context={context}
          feedState={feedState}
          candidates={candidates}
          selectedMemory={selectedMemory}
          failureReason={failureReason}
          isControlGroup={isControlGroup}
          onToggleControl={toggleControlGroup}
          onReset={handleReset}
        />
      )}

      {!showDebug && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: 'rgba(0,0,0,0.72)',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 12,
            color: 'rgba(255,255,255,0.65)'
          }}
        >
          按 <strong style={{ color: '#fff' }}>D</strong> 键打开调试面板
        </div>
      )}
    </div>
  );
}

function PhoneBottomNav() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 86,
          background: 'rgba(20,20,20,0.96)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-around',
          padding: '15px 18px 0',
          zIndex: 90,
          borderTop: '1px solid rgba(255,255,255,0.04)'
        }}
      >
        {[
          { label: '首页', active: true },
          { label: '朋友' },
          { label: 'plus' },
          { label: '消息', badge: '20' },
          { label: '我' }
        ].map(item => (
          <div
            key={item.label}
            style={{
              width: 52,
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: item.active ? '#fff' : 'rgba(255,255,255,0.58)',
              fontSize: item.label === 'plus' ? 0 : 18,
              fontWeight: item.active ? 700 : 500
            }}
          >
            {item.label === 'plus' ? (
              <div
                style={{
                  width: 44,
                  height: 32,
                  borderRadius: 9,
                  border: '3px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 25,
                  fontWeight: 700,
                  lineHeight: 1
                }}
              >
                +
              </div>
            ) : (
              item.label
            )}
            {item.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: -7,
                  right: -3,
                  minWidth: 25,
                  height: 22,
                  borderRadius: 14,
                  background: '#fe2c55',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 128,
          height: 4,
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 3,
          zIndex: 100
        }}
      />
    </>
  );
}
