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
    { label: 'Eligible UV', value: metrics.eligibleUV },
    { label: 'Card Exposure', value: metrics.cardExposure },
    { label: 'Deck Page View', value: metrics.deckPageView },
    { label: 'Candidate Select', value: metrics.candidateSelect },
    { label: 'Valid Wake', value: metrics.validWake },
    { label: 'Start Eating', value: metrics.startEating },
    { label: 'Add To Today', value: metrics.addToToday },
    { label: 'Route Intent', value: metrics.routeIntent },
    { label: 'Shop Open', value: metrics.shopOpen },
    { label: 'Source Video', value: metrics.sourceVideoOpen },
    { label: 'Share Friend', value: metrics.shareToFriend },
    { label: 'Remind Later', value: metrics.remindLater },
    { label: 'Negative', value: metrics.negativeFeedback }
  ];

  return (
    <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 16, fontSize: 13, color: '#fff' }}>
      <div style={{
        fontSize: 14,
        fontWeight: 800,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>指标面板</span>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {metricItems.map(item => (
          <div key={item.label} style={{
            padding: '8px 10px',
            borderRadius: 8,
            background: item.value > 0 ? 'rgba(52,199,89,0.12)' : 'rgba(255,255,255,0.05)'
          }}>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{item.label}</div>
            <div style={{ marginTop: 5, fontWeight: 900, color: item.value > 0 ? '#34C759' : '#fff' }}>{item.value}</div>
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
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Cooldown</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: metrics.cooldown ? '#FF3B30' : '#34C759' }}>
          {metrics.cooldown ? '冷却中' : '正常'}
        </span>
      </div>
    </div>
  );
}
