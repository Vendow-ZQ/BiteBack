import type { BiteBackGateStatus, CardState } from '../types';

interface GatePanelProps {
  gateStatus: BiteBackGateStatus;
  cardState: CardState;
}

const gateRows: Array<{ key: keyof BiteBackGateStatus; name: string; desc: string }> = [
  { key: 'memory', name: 'Memory', desc: '存在可唤醒收藏门店' },
  { key: 'context', name: 'Context', desc: '饭点 / 外出 / 停留' },
  { key: 'proximity', name: 'Proximity', desc: '附近可达且营业' },
  { key: 'feed', name: 'Feed', desc: 'Feed 可自然插入' },
  { key: 'quality', name: 'Quality', desc: 'POI 与店铺质量可信' },
  { key: 'frequencyPrivacy', name: 'Frequency & Privacy', desc: '频控与隐私通过' }
];

export default function GatePanel({ gateStatus, cardState }: GatePanelProps) {
  const allPassed = Object.values(gateStatus).every(Boolean);

  return (
    <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 16, fontSize: 13, color: '#fff' }}>
      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>六大 Gate 状态</div>
      <div style={{ marginBottom: 14, color: 'rgba(255,255,255,0.62)', fontSize: 12 }}>
        当前状态：<span style={{ color: '#fff', fontWeight: 700 }}>{cardState}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {gateRows.map(row => {
          const passed = gateStatus[row.key];
          return (
            <div key={row.key} style={{ display: 'flex', gap: 10, alignItems: 'center', opacity: passed ? 1 : 0.58 }}>
              <span style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: passed ? '#34C759' : '#FF3B30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800
              }}>
                {passed ? '✓' : '×'}
              </span>
              <span style={{ flex: 1 }}>
                <strong style={{ display: 'block' }}>{row.name}</strong>
                <em style={{ display: 'block', fontStyle: 'normal', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                  {row.desc}
                </em>
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <strong style={{ color: allPassed ? '#34C759' : '#FF3B30' }}>
          {allPassed ? '通过 - 展示卡片' : '拦截 - 不展示'}
        </strong>
      </div>
    </div>
  );
}
