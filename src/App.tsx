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
import GatePanel from './components/GatePanel';
import MetricsPanel from './components/MetricsPanel';

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
  const [showDebugPanel] = useState(true);

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

  // 处理搜索
  const handleSearch = (query: string) => {
    const now = Date.now();
    const isFoodQuery = !query.includes('猫咪'); // 猫咪视频是非美食query

    setSearchSession({
      query,
      queryIntent: isFoodQuery ? 'food_decision' : 'other',
      searchedAt: now,
      returnedToFeedAt: now + 2 * 60 * 1000, // 2分钟后返回
      completedPoiAction: false,
      completedDealAction: false,
      completedRouteAction: false
    });
    setCardState('SEARCH');
    setShowSearch(false);
    // 重置 Feed 状态
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

    // 更新用户状态
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
    // 重置相关状态
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
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#000' }}>
      {/* 左侧：Feed 主区域 */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* 顶部导航栏 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
            padding: '0 16px'
          }}
        >
          <div style={{ display: 'flex', gap: 30, fontSize: 15 }}>
            <span style={{ opacity: 0.7 }}>关注</span>
            <span style={{ fontWeight: 600 }}>推荐</span>
            <span style={{ opacity: 0.7 }}>附近</span>
          </div>

          {/* 搜索按钮 */}
          <button
            onClick={() => setShowSearch(true)}
            style={{
              position: 'absolute',
              right: 16,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 20,
              padding: '6px 14px',
              color: '#fff',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            🔍 搜索
          </button>
        </div>

        {/* Feed 内容 */}
        <Feed
          videos={feedVideos}
          selectedMemory={selectedMemory}
          showBiteBack={showBiteBack}
          user={user}
          searchSession={searchSession}
          feedState={feedState}
          isControlGroup={isControlGroup}
          onVideoConsumed={handleVideoConsumed}
          onCardAction={handleCardAction}
          onNegativeFeedback={handleNegativeFeedback}
        />

        {/* 搜索中提示（当用户刚搜索完还没返回Feed） */}
        {searchSession.query && cardState === 'SEARCH' && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#1a1a1a',
              padding: 24,
              borderRadius: 16,
              textAlign: 'center',
              maxWidth: 320
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
              搜索结果：{searchSession.query}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
              这里模拟抖音搜索结果页
              <br />
              Demo要求：不点击POI/团购/路线
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
              返回 Feed
            </button>
          </div>
        )}

        {/* 搜索页 */}
        {showSearch && (
          <SearchPage onSearch={handleSearch} onCancel={() => setShowSearch(false)} />
        )}
      </div>

      {/* 右侧：调试面板 */}
      {showDebugPanel && (
        <div
          style={{
            width: 320,
            background: '#0a0a0a',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            padding: 16,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          {/* 标题 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>BiteBack</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                搜索后收藏美食唤醒卡
              </div>
            </div>
            <button
              onClick={handleReset}
              style={{
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 4,
                color: '#fff',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              重置
            </button>
          </div>

          {/* 场景信息 */}
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: 12,
              padding: 16,
              fontSize: 13
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#FF9500'
                }}
              />
              场景信息
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>搜索词</span>
                <span>{searchSession.query || '未搜索'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>意图识别</span>
                <span>{searchSession.queryIntent === 'food_decision' ? '美食决策 ✓' : '非美食 ✗'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>回流时间</span>
                <span>
                  {Math.floor((searchSession.returnedToFeedAt - searchSession.searchedAt) / 1000 / 60)}分钟
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>视频消费</span>
                <span>{feedState.normalVideosConsumed} 条</span>
              </div>
            </div>
          </div>

          {/* Gate 面板 */}
          <GatePanel gateStatus={gateStatus} cardState={cardState} />

          {/* 指标面板 */}
          <MetricsPanel
            metrics={metrics}
            isControlGroup={isControlGroup}
            onToggleControl={toggleControlGroup}
          />

          {/* 选中的 Memory 信息 */}
          {selectedMemory && (
            <div
              style={{
                background: '#1a1a1a',
                borderRadius: 12,
                padding: 16,
                fontSize: 13
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#5856D6'
                  }}
                />
                选中 POI
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontWeight: 500 }}>{selectedMemory.shopName}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  等级: {selectedMemory.memoryLevel} |
                  置信度: {Math.round(selectedMemory.poiConfidence * 100)}% |
                  匹配度: {Math.round(selectedMemory.memoryStrength * 100)}%
                </div>
              </div>
            </div>
          )}

          {/* 失败原因 */}
          {failureReason && cardState !== 'SEARCH' && (
            <div
              style={{
                background: 'rgba(255,59,48,0.1)',
                borderRadius: 12,
                padding: 16,
                fontSize: 13,
                color: '#FF3B30'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>未展示原因</div>
              <div>{failureReason} 未通过</div>
            </div>
          )}
        </div>
      )}

      {/* 移动端提示 */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'rgba(0,0,0,0.8)',
          padding: '8px 12px',
          borderRadius: 8,
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          zIndex: 1000
        }}
      >
        {showDebugPanel ? '按 H 隐藏面板' : '按 H 显示面板'}
      </div>
    </div>
  );
}
