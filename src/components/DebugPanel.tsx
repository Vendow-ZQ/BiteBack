import type {
  BiteBackGateStatus,
  CardState,
  CurrentContext,
  FeedState,
  Metrics,
  SavedFoodMemory,
  UserProfile
} from '../types';

interface DebugPanelProps {
  gateStatus: BiteBackGateStatus;
  cardState: CardState;
  metrics: Metrics;
  user: UserProfile;
  context: CurrentContext;
  feedState: FeedState;
  candidates: SavedFoodMemory[];
  selectedMemory: SavedFoodMemory | null;
  failureReason: string | null;
  isControlGroup: boolean;
  onToggleControl: () => void;
  onReset: () => void;
}

const cardStateLabels: Record<CardState, string> = {
  FEED_IDLE: 'Feed 等待',
  CONTEXT_ELIGIBLE: '场景可行动',
  MEMORY_RECALL: '召回收藏',
  CARD_QUEUED: '卡片排队',
  CARD_EXPOSED: '卡片曝光',
  DECK_PAGE_CHANGED: '卡组翻页',
  CANDIDATE_EXPANDED: '候选切换',
  REASON_OPENED: '解释打开',
  START_EATING: '马上开吃',
  ADD_TO_TODAY: '加入今晚',
  ROUTE_INTENT: '路线意图',
  SHOP_OPEN: '店铺打开',
  SOURCE_VIDEO_OPEN: '原视频打开',
  SHARE_TO_FRIEND: '发给朋友',
  REMIND_LATER: '稍后提醒',
  NEGATIVE_FEEDBACK: '负反馈',
  COOLDOWN: '冷却中'
};

const gateItems: Array<{ key: keyof BiteBackGateStatus; name: string; desc: string }> = [
  { key: 'memory', name: 'Memory', desc: '存在 S/A/B 高置信收藏美食门店' },
  { key: 'context', name: 'Context', desc: '饭点、外出、停留等可行动场景' },
  { key: 'proximity', name: 'Proximity', desc: '附近 3km 内可达且当前营业' },
  { key: 'feed', name: 'Feed', desc: '已刷 2 条普通视频，适合自然插入' },
  { key: 'quality', name: 'Quality', desc: 'POI 置信、营业、店铺质量达标' },
  { key: 'frequencyPrivacy', name: 'Frequency & Privacy', desc: '位置授权、频控、负反馈通过' }
];

export default function DebugPanel({
  gateStatus,
  cardState,
  metrics,
  user,
  context,
  feedState,
  candidates,
  selectedMemory,
  failureReason,
  isControlGroup,
  onToggleControl,
  onReset
}: DebugPanelProps) {
  const allPassed = Object.values(gateStatus).every(Boolean);

  return (
    <div
      style={{
        width: 380,
        height: 812,
        background: '#161616',
        borderRadius: 20,
        padding: 18,
        overflowY: 'auto',
        fontSize: 13,
        color: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
    >
      <PanelHeader onReset={onReset} />

      <Section title="场景信息" accent="#e7b35b">
        <InfoRow label="当前区域" value={context.areaName} />
        <InfoRow label="时间场景" value={context.timeLabel === 'dinner' ? '晚饭饭点' : context.timeLabel} />
        <InfoRow label="当前状态" value={`${context.isOuting ? '外出' : '非外出'} / ${context.isStationary ? '停留' : '移动中'}`} />
        <InfoRow label="最近搜索" value={context.recentFoodSearch || '无，仅作为排序加权'} />
        <InfoRow label="视频消费" value={`${feedState.normalVideosConsumed} 条`} />
        <InfoRow label="状态机" value={cardStateLabels[cardState]} color="#7aa7ff" />
      </Section>

      <Section title="六大 Gate" accent="#fe2c55">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {gateItems.map(gate => {
            const passed = gateStatus[gate.key];
            return (
              <div
                key={gate.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  opacity: passed ? 1 : 0.55
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: passed ? '#34C759' : '#FF3B30',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800
                  }}
                >
                  {passed ? '✓' : '×'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{gate.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{gate.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 800
        }}>
          <span>综合判断</span>
          <span style={{ color: allPassed ? '#34C759' : '#FF3B30' }}>
            {allPassed ? '通过 - 可展示' : '拦截 - 不展示'}
          </span>
        </div>
      </Section>

      <Section title="指标面板" accent="#62b5ff">
        <button
          onClick={onToggleControl}
          style={{
            width: '100%',
            height: 34,
            marginBottom: 12,
            border: 0,
            borderRadius: 8,
            color: '#fff',
            background: isControlGroup ? 'rgba(255,255,255,0.16)' : 'rgba(254,44,85,0.28)',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          {isControlGroup ? 'Control 组：不展示 BiteBack' : 'Treatment 组：展示 BiteBack'}
        </button>
        <MetricGrid metrics={metrics} />
      </Section>

      <Section title="收藏候选" accent="#9bd784">
        <InfoRow label="收藏总数" value={`${user.savedFoodCount} 个`} />
        <InfoRow label="本轮候选" value={`${candidates.length} 家`} />
        {selectedMemory && (
          <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>{selectedMemory.shopName}</div>
            <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 12, lineHeight: 1.6 }}>
              {selectedMemory.memoryLevel} 级收藏 · 置信 {Math.round(selectedMemory.poiConfidence * 100)}% ·
              距离 {selectedMemory.distanceM}m · 步行 {selectedMemory.walkMinutes} 分钟
            </div>
          </div>
        )}
      </Section>

      {failureReason && (
        <div style={{
          background: 'rgba(255,59,48,0.12)',
          borderRadius: 12,
          padding: 14,
          color: '#ff7b8f',
          border: '1px solid rgba(255,59,48,0.2)'
        }}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>未展示原因</div>
          <div>{failureReason} 未通过</div>
        </div>
      )}
    </div>
  );
}

function PanelHeader({ onReset }: { onReset: () => void }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18,
      paddingBottom: 14,
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 900 }}>BiteBack 调试面板</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
          收藏唤醒 / Gate / 指标闭环
        </div>
      </div>
      <button
        onClick={onReset}
        style={{
          padding: '8px 12px',
          background: 'rgba(255,59,48,0.18)',
          border: 'none',
          borderRadius: 8,
          color: '#ff7b8f',
          fontSize: 12,
          fontWeight: 800,
          cursor: 'pointer'
        }}
      >
        重置
      </button>
    </div>
  );
}

function Section({
  title,
  accent,
  children
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: 12,
      padding: 14,
      marginBottom: 14
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        fontSize: 14,
        fontWeight: 900
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
        {title}
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '5px 0' }}>
      <span style={{ color: 'rgba(255,255,255,0.56)' }}>{label}</span>
      <span style={{ color: color || '#fff', textAlign: 'right', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function MetricGrid({ metrics }: { metrics: Metrics }) {
  const items: Array<{ label: string; value: number | boolean }> = [
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
    { label: 'Negative', value: metrics.negativeFeedback },
    { label: 'Cooldown', value: metrics.cooldown }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {items.map(item => {
        const active = typeof item.value === 'boolean' ? item.value : item.value > 0;
        return (
          <div key={item.label} style={{
            padding: '8px 9px',
            borderRadius: 8,
            background: active ? 'rgba(52,199,89,0.12)' : 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.52)', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: active ? '#7ee29a' : '#fff' }}>
              {typeof item.value === 'boolean' ? (item.value ? 'true' : 'false') : item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
