import type { GateStatus, CardState } from '../types';

interface GatePanelProps {
  gateStatus: GateStatus;
  cardState: CardState;
}

export default function GatePanel({ gateStatus, cardState }: GatePanelProps) {
  const gates = [
    { key: 'eligibility', name: 'Eligibility', label: '准入条件', desc: '15分钟内回流、美食意图、未转化' },
    { key: 'attribution', name: 'Attribution', label: '归因', desc: '搜索链路无POI/团购/路线点击' },
    { key: 'feedGuardrail', name: 'Feed Guardrail', label: '护栏', desc: '已消费≥2条视频、非快划/沉浸' },
    { key: 'quality', name: 'Quality', label: '质量', desc: 'POI置信度≥0.85、营业中、高质量' },
    { key: 'frequency', name: 'Frequency', label: '频次', desc: '当日未曝光、无负反馈' },
    { key: 'business', name: 'Business', label: '商业', desc: '店铺质量≥0.75，券不参与排序' }
  ];

  const getStatusColor = (passed: boolean) => (passed ? '#34C759' : '#FF3B30');

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

  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        fontSize: 13,
        color: '#fff'
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 16,
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
            background: '#FF3B30'
          }}
        />
        六大 Gate 状态
      </div>

      {/* 状态机显示 */}
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '8px 12px',
          borderRadius: 8,
          marginBottom: 16,
          textAlign: 'center',
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)'
        }}
      >
        当前状态: <span style={{ color: '#fff', fontWeight: 500 }}>{getCardStateLabel(cardState)}</span>
      </div>

      {/* Gate 列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {gates.map(gate => {
          const passed = gateStatus[gate.key as keyof GateStatus];
          return (
            <div
              key={gate.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: passed ? 1 : 0.6
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: getStatusColor(passed),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {passed ? '✓' : '×'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 2 }}>
                  {gate.name}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                  {gate.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 综合判断 */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span style={{ fontWeight: 500 }}>综合判断</span>
        <span
          style={{
            color: Object.values(gateStatus).every(v => v) ? '#34C759' : '#FF3B30',
            fontWeight: 600
          }}
        >
          {Object.values(gateStatus).every(v => v) ? '通过 - 展示卡片' : '拦截 - 不展示'}
        </span>
      </div>
    </div>
  );
}
