import { useRef, useState } from 'react';
import type { FeedState, FeedVideo, FoodMemory, SearchSession } from '../types';
import { feedEngagements, videoCovers } from '../mocks';
import BiteBackCard from './BiteBackCard';

interface FeedProps {
  videos: FeedVideo[];
  selectedMemory: FoodMemory | null;
  showBiteBack: boolean;
  searchSession: SearchSession;
  feedState: FeedState;
  isControlGroup: boolean;
  onVideoConsumed: () => void;
  onCardAction: (action: 'explanation' | 'add_to_today' | 'view_shop') => void;
  onNegativeFeedback: (type: string) => void;
  onSearchClick: () => void;
}

function formatNumber(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

function isVideoAsset(url?: string): boolean {
  return Boolean(url && /\.(mp4|webm|mov)$/i.test(url));
}

export default function Feed({
  videos,
  selectedMemory,
  showBiteBack,
  searchSession,
  feedState: _feedState,
  isControlGroup: _isControlGroup,
  onVideoConsumed,
  onCardAction,
  onNegativeFeedback,
  onSearchClick
}: FeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef(0);

  const moveTo = (nextIndex: number) => {
    if (nextIndex === currentIndex) return;
    if (nextIndex > currentIndex) onVideoConsumed();
    setCurrentIndex(nextIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 50) return;
    if (diff > 0 && currentIndex < videos.length - 1) moveTo(currentIndex + 1);
    if (diff < 0 && currentIndex > 0) moveTo(currentIndex - 1);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) < 30) return;
    if (e.deltaY > 0 && currentIndex < videos.length - 1) moveTo(currentIndex + 1);
    if (e.deltaY < 0 && currentIndex > 0) moveTo(currentIndex - 1);
  };

  const renderMedia = (video: FeedVideo, index: number) => {
    const coverUrl = video.coverUrl || videoCovers[index % videoCovers.length];

    if (isVideoAsset(video.videoUrl)) {
      return (
        <video
          src={video.videoUrl}
          poster={coverUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }

    return <img src={coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  };

  const renderStandardVideo = (video: FeedVideo, index: number, key = video.id) => {
    const engagement = feedEngagements[index % feedEngagements.length];

    return (
      <div
        key={key}
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${(index - currentIndex) * 100}%)`,
          transition: 'transform 0.28s ease-out',
          zIndex: index === currentIndex ? 10 : 1,
          background: '#000'
        }}
      >
        {renderMedia(video, index)}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.86) 100%)'
          }}
        />

        <div style={{ position: 'absolute', left: 13, right: 78, bottom: 101, color: '#fff', zIndex: 20 }}>
          {index === 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 25,
                padding: '0 8px',
                background: '#fe2c55',
                borderRadius: 2,
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 9
              }}
            >
              直播中
            </span>
          )}
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}>
            {index === 0 ? '@AAA-画材批发-薯总' : `@${video.id}`}
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.45, marginBottom: 10, textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}>
            {index === 0 ? '很高兴遇见你' : video.title || '南科大美食探店｜今天吃什么'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 16, lineHeight: 1.35 }}>
            <span style={{ fontSize: 19 }}>👋</span>
            <span style={{ opacity: 0.96 }}>{index === 0 ? '拍一拍提醒｜主播邀请大家进房互动' : '原声 - 抖音美食记录'}</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 7,
            bottom: 98,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 13,
            zIndex: 20
          }}
        >
          <div style={{ position: 'relative', marginBottom: 7 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#f5d6b0,#4d4f65)',
                border: '2px solid #fff'
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -7,
                transform: 'translateX(-50%)',
                width: 19,
                height: 19,
                borderRadius: '50%',
                background: '#fe2c55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                border: '2px solid #000'
              }}
            >
              +
            </span>
          </div>
          <ActionIcon icon="♥" count={formatNumber(engagement.likes)} />
          <ActionIcon icon="●" count={formatNumber(engagement.comments)} subIcon="···" />
          <ActionIcon icon="★" count="收藏" />
          <ActionIcon icon="↗" count={formatNumber(engagement.shares)} />
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '4px solid rgba(255,255,255,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              animation: 'spin 4s linear infinite'
            }}
          >
            ♪
          </div>
        </div>
      </div>
    );
  };

  const renderVideoCard = (video: FeedVideo, index: number) => {
    if (video.type === 'biteback') {
      if (showBiteBack && selectedMemory) {
        return (
          <div
            key={video.id}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateY(${(index - currentIndex) * 100}%)`,
              transition: 'transform 0.28s ease-out',
              zIndex: index === currentIndex ? 10 : 1
            }}
          >
            <BiteBackCard
              memory={selectedMemory}
              searchQuery={searchSession.query}
              onExplanation={() => onCardAction('explanation')}
              onAddToToday={() => onCardAction('add_to_today')}
              onViewShop={() => onCardAction('view_shop')}
              onNegativeFeedback={onNegativeFeedback}
            />
          </div>
        );
      }

      // BiteBack 不显示时显示占位符
      return (
        <div
          key={video.id}
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            transition: "transform 0.28s ease-out",
            zIndex: index === currentIndex ? 10 : 1,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 40
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>🍜</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
            BiteBack 未触发
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 1.6 }}>
            这里本该出现收藏美食唤醒卡
            <br />
            但当前场景不满足展示条件
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            按 D 键查看调试信息
          </div>
        </div>
      );
    }

    return renderStandardVideo(video, index);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: '#000' }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      {videos.map((video, index) => renderVideoCard(video, index))}

      <div
        style={{
          position: 'absolute',
          top: 51,
          left: 0,
          right: 0,
          height: 43,
          zIndex: 70,
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.28)'
        }}
      >
        <button
          aria-label="菜单"
          style={{
            width: 45,
            border: 'none',
            background: 'transparent',
            color: '#fff',
            fontSize: 34,
            lineHeight: 1,
            cursor: 'pointer',
            position: 'relative',
            padding: 0
          }}
        >
          ≡
          <span
            style={{
              position: 'absolute',
              top: -1,
              right: 6,
              minWidth: 20,
              height: 20,
              borderRadius: '50%',
              background: '#fe2c55',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}
          >
            1
          </span>
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 9, minWidth: 0 }}>
          {['团购', '直播', '深圳', '关注', '商城', '推荐'].map(tab => (
            <span
              key={tab}
              style={{
                position: 'relative',
                fontSize: 18,
                fontWeight: tab === '推荐' ? 800 : 500,
                color: tab === '推荐' ? '#fff' : 'rgba(255,255,255,0.72)',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
              {tab === '关注' && (
                <i
                  style={{
                    position: 'absolute',
                    top: -7,
                    right: -9,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: '#fe2c55'
                  }}
                />
              )}
              {tab === '推荐' && (
                <i
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -10,
                    transform: 'translateX(-50%)',
                    width: 34,
                    height: 3,
                    borderRadius: 4,
                    background: '#fff'
                  }}
                />
              )}
            </span>
          ))}
        </div>

        <button
          onClick={onSearchClick}
          aria-label="搜索"
          style={{
            width: 46,
            border: 'none',
            background: 'transparent',
            color: '#fff',
            fontSize: 37,
            lineHeight: 1,
            cursor: 'pointer',
            padding: 0
          }}
        >
          ⌕
        </button>
      </div>
    </div>
  );
}

function ActionIcon({ icon, count, subIcon }: { icon: string; count: string; subIcon?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: '#fff' }}>
      <div
        style={{
          width: 42,
          height: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          fontWeight: 800,
          lineHeight: 1,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))',
          position: 'relative'
        }}
      >
        {icon}
        {subIcon && <span style={{ position: 'absolute', fontSize: 14, top: 13, left: 13, color: '#000' }}>{subIcon}</span>}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.55)' }}>{count}</span>
    </div>
  );
}
