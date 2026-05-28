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
} from './data/mock';

import {
  getGateStatus,
  selectBestMemory,
  allGatesPassed,
  getFirstFailedGate
} from './utils/gates';

import Feed from './components/Feed';
import SearchPage from './components/SearchPage';
import DebugPanel from './components/DebugPanel';

export default function App() {
  // 核心状态
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

  // UI 状态
  const [showSearch, setShowSearch] = useState(false);
  const [isControlGroup, setIsControlGroup] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // 选择最佳 Memory
  const selectedMemory = useMemo(() => {
    return selectBestMemory(foodMemories, searchSession.query, user);
  }, [searchSession.query, user]);

  // Gate 状态
  const gateStatus: GateStatus = useMemo(() => {
    return getGateStatus(user, searchSession, foodMemories, feedState, selectedMemory);
  }, [user, searchSession, foodMemories, feedState, selectedMemory]);

  // 是否展示 BiteBack
  const showBiteBack = useMemo(() => {
    return allGatesPassed(gateStatus) && !isControlGroup && !metrics.cooldown;
  }, [gateStatus, isControlGroup, metrics.cooldown]);

  // 键盘快捷键：D 键切换调试面板
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDebug(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // 处理搜索
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
    setFeedState({
      normalVideosConsumed: 0,
      fastSwiping: false,
      deepWatching: false,
      recentCommercialComponent: false,
      recentPrivacyNegative: false
    });
  };

  // 返回 Feed
  const handleReturnToFeed = () => {
    setSearchSession(prev => ({
      ...prev,
      returnedToFeedAt: Date.now()
    }));
    setCardState('RETURN_FEED');
    setTimeout(() => setCardState('GATE_CHECK'), 500);
  };

  // 视频消费（滑动）
  const handleVideoConsumed = () => {
    setFeedState(prev => {
      const newCount = prev.normalVideosConsumed + 1;
      return {
        ...prev,
        normalVideosConsumed: newCount
      };
    });
  };

  // 卡片曝光
  useEffect(() => {
    if (showBiteBack && feedState.normalVideosConsumed >= 2 && metrics.cardExposure === 0) {
      setMetrics(prev => ({ ...prev, cardExposure: 1 }));
      setCardState('CARD_EXPOSED');
    }
  }, [showBiteBack, feedState.normalVideosConsumed, metrics.cardExposure]);

  // 卡片操作
  const handleCardAction = (action: 'explanation' | 'add_to_today' | 'view_shop') => {
    switch (action) {
      case 'explanation':
        setCardState('EXPLANATION_OPENED');
        setMetrics(prev => ({ ...prev, validWake: 1 }));
        break;
      case 'add_to_today':
      case 'view_shop':
        setCardState('DECISION_ACTION');
        setMetrics(prev => ({
          ...prev,
          validWake: Math.max(prev.validWake, 1),
          decisionAction: 1
        }));
        break;
    }
  };

  // 负反馈
  const handleNegativeFeedback = (type: string) => {
    setCardState('NEGATIVE_FEEDBACK');
    setMetrics(prev => ({
      ...prev,
      negativeFeedback: 1,
      cooldown: true
    }));

    setUser(prev => ({
      ...prev,
      negativeFeedbackTags: selectedMemory
        ? [...prev.negativeFeedbackTags, selectedMemory.poiId]
        : prev.negativeFeedbackTags,
      closedBiteBack: type === 'close_biteback'
    }));

    setTimeout(() => {
      setCardState('COOLDOWN');
    }, 500);
  };

  // 切换 Control 组
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

  // 重置 Demo
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
    setIsControlGroup(false);
  };

  // 获取失败原因
  const failureReason = useMemo(() => {
    if (allGatesPassed(gateStatus)) return null;
    return getFirstFailedGate(gateStatus);
  }, [gateStatus]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
      overflow: 'hidden'
    }}>
      {/* 手机外框 */}
      <div style={{
        width: 375,
        height: 812,
        background: '#1a1a1a',
        borderRadius: 40,
        padding: 12,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        position: 'relative'
      }}>
        {/* 手机刘海 */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 150,
          height: 28,
          background: '#1a1a1a',
          borderRadius: '0 0 20px 20px',
          zIndex: 100
        }} />

        {/* 屏幕内容 */}
        <div style={{
          width: '100%',
          height: '100%',
          background: '#000',
          borderRadius: 32,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* 状态栏 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            zIndex: 50,
            fontSize: 14,
            fontWeight: 600
          }}>
            <span>9:41</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Feed 内容 */}
          <Feed
            videos={feedVideos}
            selectedMemory={selectedMemory}
            showBiteBack={showBiteBack}
            searchSession={searchSession}
            feedState={feedState}
            cardState={cardState}
            metrics={metrics}
            isControlGroup={isControlGroup}
            onVideoConsumed={handleVideoConsumed}
            onCardAction={handleCardAction}
            onNegativeFeedback={handleNegativeFeedback}
            onSearchClick={() => setShowSearch(true)}
          />

          {/* 搜索中提示 */}
          {searchSession.query && cardState === 'SEARCH' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#000',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 搜索栏 */}
              <div style={{
                padding: '50px 16px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  {searchSession.query}
                </div>
              </div>

              {/* 搜索结果模拟 */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: 20
                }}>
                  搜索结果页（模拟）
                  <br />
                  <span style={{ fontSize: 13 }}>
                    Demo要求：不点击POI/团购/路线
                  </span>
                </div>
                <button
                  onClick={handleReturnToFeed}
                  style={{
                    padding: '12px 32px',
                    background: '#FF3B30',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ← 返回 Feed
                </button>
              </div>
            </div>
          )}

          {/* 搜索页 */}
          {showSearch && (
            <SearchPage onSearch={handleSearch} onCancel={() => setShowSearch(false)} />
          )}

          {/* Home 指示条 */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 134,
            height: 5,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 3,
            zIndex: 50
          }} />
        </div>
      </div>

      {/* 右侧调试面板（开发者模式） */}
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

      {/* 提示：如何打开调试面板 */}
      {!showDebug && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'rgba(0,0,0,0.7)',
          padding: '10px 16px',
          borderRadius: 8,
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)'
        }}>
          按 <strong style={{ color: '#fff' }}>D</strong> 键打开开发者调试面板
        </div>
      )}
    </div>
  );
}
