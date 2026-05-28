import { useState, useEffect, useMemo } from 'react';
import type {
  UserProfile,
  SearchSession,
  FeedState,
  CardState,
  Metrics,
  GateStatus
} from './types';

import {
  defaultUserProfile,
  defaultSearchSession,
  foodMemories,
  feedVideos,
  defaultFeedState
} from './mocks';

import {
  getGateStatus,
  selectBestMemory,
  allGatesPassed,
  getFirstFailedGate
} from './utils/gates';

import Feed from './components/Feed';
import SearchPage from './components/SearchPage';
import SearchResultsPage from './components/SearchResultsPage';
import DebugPanel from './components/DebugPanel';
import StatusBar from './components/StatusBar';

export default function App() {
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);
  const [searchSession, setSearchSession] = useState<SearchSession>(defaultSearchSession);
  const [feedState, setFeedState] = useState<FeedState>(defaultFeedState);
  const [cardState, setCardState] = useState<CardState>('SEARCH');
  const [metrics, setMetrics] = useState<Metrics>({
    eligibleUV: 1,
    cardExposure: 0,
    validWake: 0,
    decisionAction: 0,
    negativeFeedback: 0,
    cooldown: false
  });

  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isControlGroup, setIsControlGroup] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const selectedMemory = useMemo(() => {
    return selectBestMemory(foodMemories, searchSession.query, user);
  }, [searchSession.query, user]);

  const gateStatus: GateStatus = useMemo(() => {
    return getGateStatus(user, searchSession, foodMemories, feedState, selectedMemory);
  }, [user, searchSession, feedState, selectedMemory]);

  const showBiteBack = useMemo(() => {
    return allGatesPassed(gateStatus) && !isControlGroup && !metrics.cooldown;
  }, [gateStatus, isControlGroup, metrics.cooldown]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') setShowDebug(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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
    setCardState('SEARCH');
    setShowSearch(false);
    setShowResults(true);
    setFeedState(defaultFeedState);
    setMetrics({
      eligibleUV: 1,
      cardExposure: 0,
      validWake: 0,
      decisionAction: 0,
      negativeFeedback: 0,
      cooldown: false
    });
  };

  const handleReturnToFeed = () => {
    setSearchSession(prev => ({
      ...prev,
      returnedToFeedAt: Date.now()
    }));
    setShowResults(false);
    setCardState('RETURN_FEED');
    setTimeout(() => setCardState('GATE_CHECK'), 500);
  };

  const handleVideoConsumed = () => {
    setFeedState(prev => ({ ...prev, normalVideosConsumed: prev.normalVideosConsumed + 1 }));
  };

  useEffect(() => {
    if (showBiteBack && feedState.normalVideosConsumed >= 2 && metrics.cardExposure === 0) {
      setMetrics(prev => ({ ...prev, cardExposure: 1 }));
      setCardState('CARD_EXPOSED');
    }
  }, [showBiteBack, feedState.normalVideosConsumed, metrics.cardExposure]);

  const handleCardAction = (action: 'explanation' | 'add_to_today' | 'view_shop') => {
    if (action === 'explanation') {
      setCardState('EXPLANATION_OPENED');
      setMetrics(prev => ({ ...prev, validWake: 1 }));
      return;
    }

    setCardState('DECISION_ACTION');
    setMetrics(prev => ({
      ...prev,
      validWake: Math.max(prev.validWake, 1),
      decisionAction: 1
    }));
  };

  const handleNegativeFeedback = (type: string) => {
    setCardState('NEGATIVE_FEEDBACK');
    setMetrics(prev => ({ ...prev, negativeFeedback: 1, cooldown: true }));

    setUser(prev => ({
      ...prev,
      negativeFeedbackTags: selectedMemory
        ? [...prev.negativeFeedbackTags, selectedMemory.poiId]
        : prev.negativeFeedbackTags,
      closedBiteBack: type === 'close_biteback'
    }));

    setTimeout(() => setCardState('COOLDOWN'), 500);
  };

  const toggleControlGroup = () => {
    setIsControlGroup(prev => !prev);
    setMetrics({
      eligibleUV: 1,
      cardExposure: 0,
      validWake: 0,
      decisionAction: 0,
      negativeFeedback: 0,
      cooldown: false
    });
  };

  const handleReset = () => {
    setUser(defaultUserProfile);
    setSearchSession(defaultSearchSession);
    setFeedState(defaultFeedState);
    setCardState('SEARCH');
    setMetrics({
      eligibleUV: 1,
      cardExposure: 0,
      validWake: 0,
      decisionAction: 0,
      negativeFeedback: 0,
      cooldown: false
    });
    setShowResults(false);
    setIsControlGroup(false);
  };

  const failureReason = useMemo(() => {
    if (allGatesPassed(gateStatus)) return null;
    return getFirstFailedGate(gateStatus);
  }, [gateStatus]);

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
            <StatusBar time="15:34" battery={56} />
          </div>

          <Feed
            videos={feedVideos}
            selectedMemory={selectedMemory}
            showBiteBack={showBiteBack}
            searchSession={searchSession}
            feedState={feedState}
            isControlGroup={isControlGroup}
            onVideoConsumed={handleVideoConsumed}
            onCardAction={handleCardAction}
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
          )}
        </div>
      </div>

      {showDebug && (
        <DebugPanel
          gateStatus={gateStatus}
          cardState={cardState}
          metrics={metrics}
          user={user}
          searchSession={searchSession}
          feedState={feedState}
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
