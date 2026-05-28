import type {
  UserProfile,
  SearchSession,
  FeedState,
  FoodMemory,
  CardState,
  Metrics,
  GateStatus
} from '../types';

interface DebugPanelProps {
  gateStatus: GateStatus;
  cardState: CardState;
  metrics: Metrics;
  user: UserProfile;
  searchSession: SearchSession;
  feedState: FeedState;
  selectedMemory: FoodMemory | null;
  failureReason: string | null;
  isControlGroup: boolean;
  onToggleControl: () => void;
  onReset: () => void;
}

export default function DebugPanel({
  gateStatus,
  cardState,
  metrics,
  // user, // 保留供调试信息使用
  searchSession,
  feedState,
  selectedMemory,
  failureReason,
  isControlGroup,
  onToggleControl,
  onReset
}: DebugPanelProps) {
  const getStatusColor = (passed: boolean) => passed ? '#34C759' : '#FF3B30';

  const getCardStateLabel = (state: CardState) => {
    const labels: Record<CardState, string> = {
      SEARCH: '搜索中',
      RETURN_FEED: '返回Feed',
      GATE_CHECK: 'Gate检查',
      GATE_BLOCK: 'Gate拦截',
      CARD_QUEUED: '卡片排队',
      CARD_EXPOSED: '卡片曝光',
      EXPLANATION_OPENED: '解释层打开',
      DECISION_ACTION: '决策行动',
      NEGATIVE_FEEDBACK: '负反馈',
      COOLDOWN: '冷却中'
    };
    return labels[state] || state;
  };

  const gates = [
    { key: 'eligibility' as const, name: 'Eligibility', desc: '15分钟内回流、美食意图、未转化' },
    { key: 'attribution' as const, name: 'Attribution', desc: '搜索链路无转化行为' },
    { key: 'feedGuardrail' as const, name: 'Feed Guardrail', desc: '已消费≥2条视频' },
    { key: 'quality' as const, name: 'Quality', desc: 'POI置信度≥0.85、营业中' },
    { key: 'frequency' as const, name: 'Frequency', desc: '当日未曝光、无负反馈' },
    { key: 'business' as const, name: 'Business', desc: '店铺质量≥0.75' }
  ];

  return (
    <div style={{
      width: 360,
      height: 812,
      background: '#1a1a1a',
      borderRadius: 20,
      padding: 20,
      overflowY: 'auto',
      fontSize: 13,
      color: '#fff',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
      {/* 标题 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>🔧 开发者调试面板</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            BiteBack 内部数据监控
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            padding: '8px 14px',
            background: 'rgba(255,59,48,0.2)',
            border: 'none',
            borderRadius: 6,
            color: '#FF3B30',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          重置 Demo
        </button>
      </div>

      {/* 场景信息 */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#FF9500' }}>
          📱 场景信息
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
            <span>{Math.floor((searchSession.returnedToFeedAt - searchSession.searchedAt) / 1000 / 60)}分钟</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>视频消费</span>
            <span>{feedState.normalVideosConsumed} 条</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>状态机</span>
            <span style={{ color: '#007AFF' }}>{getCardStateLabel(cardState)}</span>
          </div>
        </div>
      </div>

      {/* 六大 Gate */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#FF3B30' }}>
          🛡️ 六大 Gate 状态
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {gates.map(gate => {
            const passed = gateStatus[gate.key];
            return (
              <div key={gate.key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: passed ? 1 : 0.5
              }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: getStatusColor(passed),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {passed ? '✓' : '×'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{gate.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{gate.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontWeight: 500 }}>综合判断</span>
          <span style={{
            color: Object.values(gateStatus).every(v => v) ? '#34C759' : '#FF3B30',
            fontWeight: 600
          }}>
            {Object.values(gateStatus).every(v => v) ? '通过 - 展示卡片' : '拦截 - 不展示'}
          </span>
        </div>
      </div>

      {/* 指标面板 */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
      }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 12,
          color: '#007AFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>📊 指标面板</span>
          <button
            onClick={onToggleControl}
            style={{
              padding: '4px 10px',
              background: isControlGroup ? 'rgba(255,255,255,0.2)' : 'rgba(255,59,48,0.3)',
              border: 'none',
              borderRadius: 4,
              color: '#fff',
              fontSize: 11,
              cursor: 'pointer'
            }}
          >
            {isControlGroup ? 'Control组' : 'Treatment组'}
          </button>
        </div>

        <div style={{
          background: isControlGroup ? 'rgba(255,255,255,0.05)' : 'rgba(255,59,48,0.1)',
          padding: '10px 12px',
          borderRadius: 8,
          marginBottom: 12,
          fontSize: 11,
          color: 'rgba(255,255,255,0.7)'
        }}>
          {isControlGroup
            ? 'Control组：不展示 BiteBack'
            : 'Treatment组：展示 BiteBack 卡片'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'eligibleUV', label: 'Eligible UV' },
            { key: 'cardExposure', label: 'Card Exposure' },
            { key: 'validWake', label: 'Valid Wake' },
            { key: 'decisionAction', label: 'Decision Action' },
            { key: 'negativeFeedback', label: 'Negative Feedback' }
          ].map(item => (
            <div key={item.key} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
              <span style={{
                fontWeight: 600,
                color: metrics[item.key as keyof Metrics] as number > 0 ? '#34C759' : '#fff'
              }}>
                {metrics[item.key as keyof Metrics] as number}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          background: metrics.cooldown ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Cooldown 状态</span>
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: metrics.cooldown ? '#FF3B30' : '#34C759'
          }}>
            {metrics.cooldown ? '冷却中' : '正常'}
          </span>
        </div>
      </div>

      {/* 选中 POI */}
      {selectedMemory && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#5856D6' }}>
            📍 选中 POI
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{selectedMemory.shopName}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              等级: {selectedMemory.memoryLevel} |
              置信度: {Math.round(selectedMemory.poiConfidence * 100)}% |
              匹配度: {Math.round(selectedMemory.memoryStrength * 100)}%
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              商圈: {selectedMemory.businessArea} |
              品类: {selectedMemory.category} |
              距离: {selectedMemory.distanceM}m
            </div>
          </div>
        </div>
      )}

      {/* 失败原因 */}
      {failureReason && cardState !== 'SEARCH' && (
        <div style={{
          background: 'rgba(255,59,48,0.1)',
          borderRadius: 12,
          padding: 16,
          color: '#FF3B30'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>⚠️ 未展示原因</div>
          <div>{failureReason} 未通过</div>
        </div>
      )}
    </div>
  );
}
