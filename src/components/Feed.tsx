import { useState, useRef } from 'react';
import type { FeedVideo, FoodMemory, SearchSession, FeedState, CardState, Metrics } from '../types';
import { videoCovers } from '../data/mock';
import BiteBackCard from './BiteBackCard';

interface FeedProps {
  videos: FeedVideo[];
  selectedMemory: FoodMemory | null;
  showBiteBack: boolean;
  searchSession: SearchSession;
  feedState: FeedState;
  cardState: CardState;
  metrics: Metrics;
  isControlGroup: boolean;
  onVideoConsumed: () => void;
  onCardAction: (action: 'explanation' | 'add_to_today' | 'view_shop') => void;
  onNegativeFeedback: (type: string) => void;
  onSearchClick: () => void;
}

export default function Feed({
  videos,
  selectedMemory,
  showBiteBack,
  searchSession,
  // feedState, // 保留供调试信息使用
  onVideoConsumed,
  onCardAction,
  onNegativeFeedback,
  onSearchClick
}: FeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  // 处理触摸滑动
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < videos.length - 1) {
        setCurrentIndex(prev => prev + 1);
        onVideoConsumed();
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  // 处理鼠标滚轮
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) > 30) {
      if (e.deltaY > 0 && currentIndex < videos.length - 1) {
        setCurrentIndex(prev => prev + 1);
        onVideoConsumed();
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  // 渲染视频卡片
  const renderVideoCard = (video: FeedVideo, index: number) => {
    const isActive = index === currentIndex;

    // BiteBack 卡片
    if (video.type === 'biteback' && showBiteBack && selectedMemory) {
      return (
        <div
          key={video.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            transition: 'transform 0.3s ease-out',
            zIndex: isActive ? 10 : 1
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

    // 如果是 biteback slot 但不显示，显示占位提示
    if (video.type === 'biteback') {
      return (
        <div
          key={video.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            transition: 'transform 0.3s ease-out',
            zIndex: isActive ? 10 : 1,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>🍜</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>
            BiteBack 未触发
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 1.6 }}>
            这里本该出现收藏美食唤醒卡
            <br />
            但当前场景不满足展示条件
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            按 D 键查看调试信息
          </div>
        </div>
      );
    }

    // 普通视频
    const coverUrl = video.coverUrl || videoCovers[index % videoCovers.length];

    return (
      <div
        key={video.id}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translateY(${(index - currentIndex) * 100}%)`,
          transition: 'transform 0.3s ease-out',
          zIndex: isActive ? 10 : 1,
          background: '#000'
        }}
      >
        <img
          src={coverUrl}
          alt={video.title || '视频'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* 顶部导航栏（仅在第一个视频显示） */}
        {index === 0 && (
          <div
            style={{
              position: 'absolute',
              top: 44,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 30,
              fontSize: 15,
              zIndex: 20
            }}
          >
            <span style={{ opacity: 0.7 }}>关注</span>
            <span style={{ fontWeight: 600 }}>推荐</span>
            <span style={{ opacity: 0.7 }}>附近</span>
          </div>
        )}

        {/* 搜索按钮（仅在第一个视频显示） */}
        {index === 0 && (
          <button
            onClick={onSearchClick}
            style={{
              position: 'absolute',
              top: 44,
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
              gap: 4,
              zIndex: 20
            }}
          >
            🔍 搜索
          </button>
        )}

        {/* 视频信息 */}
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 16,
            right: 80,
            color: '#fff',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            zIndex: 20
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>
            @{video.id}
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.4 }}>
            {video.title || '这是一条普通的抖音短视频内容，上下滑动查看更多'}
          </div>
        </div>

        {/* 右侧互动按钮 */}
        <div
          style={{
            position: 'absolute',
            right: 10,
            bottom: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
            zIndex: 20
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              ❤️
            </div>
            <span style={{ fontSize: 12 }}>12.5w</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              💬
            </div>
            <span style={{ fontSize: 12 }}>3.2w</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              ⭐
            </div>
            <span style={{ fontSize: 12 }}>收藏</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              ↗️
            </div>
            <span style={{ fontSize: 12 }}>分享</span>
          </div>
        </div>

        {/* 底部进度提示 */}
        {index < 2 && (
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 12,
              zIndex: 20
            }}
          >
            向上滑动继续 ↑ ({index + 1}/2)
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: '#000'
      }}
    >
      {videos.map((video, index) => renderVideoCard(video, index))}
    </div>
  );
}
