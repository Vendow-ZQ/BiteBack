import type { Metrics } from '../types';

interface MetricsPanelProps {
  metrics: Metrics;
  isControlGroup: boolean;
  onToggleControl: () => void;
}

export default function MetricsPanel({
  metrics,
  isControlGroup,
  onToggleControl
}: MetricsPanelProps) {
  const metricItems = [
    { key: 'eligibleUV', label: 'Eligible UV', value: metrics.eligibleUV },
    { key: 'cardExposure', label: 'Card Exposure', value: metrics.cardExposure },
    { key: 'validWake', label: 'Valid Wake', value: metrics.validWake },
    { key: 'decisionAction', label: 'Decision Action', value: metrics.decisionAction },
    { key: 'negativeFeedback', label: 'Negative Feedback', value: metrics.negativeFeedback }
  ];

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
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#007AFF'
            }}
          />
          指标面板
        </div>
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

      {/* 分组说明 */}
      <div
        style={{
          background: isControlGroup ? 'rgba(255,255,255,0.05)' : 'rgba(255,59,48,0.1)',
          padding: '10px 12px',
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 11,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.7)'
        }}
      >
        {isControlGroup
          ? 'Control组：搜索后回流用户，不展示 BiteBack，继续普通 Feed'
          : 'Treatment组：搜索后回流用户，Gate通过后展示 BiteBack 卡片'}
      </div>

      {/* 指标列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {metricItems.map(item => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
            <span
              style={{
                fontWeight: 600,
                color: item.value > 0 ? '#34C759' : '#fff'
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Cooldown 状态 */}
      <div
        style={{
          marginTop: 12,
          padding: '10px 12px',
          background: metrics.cooldown ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Cooldown 状态</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: metrics.cooldown ? '#FF3B30' : '#34C759'
          }}
        >
          {metrics.cooldown ? '冷却中' : '正常'}
        </span>
      </div>
    </div>
  );
}
