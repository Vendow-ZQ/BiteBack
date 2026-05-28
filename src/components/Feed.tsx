import { useState, useRef } from 'react';
import type { FeedVideo, FoodMemory, UserProfile, SearchSession, FeedState } from '../types';
import { videoCovers } from '../data/mock';
import BiteBackCard from './BiteBackCard';

interface FeedProps {
  videos: FeedVideo[];
  selectedMemory: FoodMemory | null;
  showBiteBack: boolean;
  user: UserProfile;
  searchSession: SearchSession;
  feedState: FeedState;
  // cardState: CardState; // 保留给未来使用
  // metrics: Metrics; // 保留给未来使用
  isControlGroup: boolean;
  onVideoConsumed: () => void;
  onCardAction: (action: 'explanation' | 'add_to_today' | 'view_shop') => void;
  onNegativeFeedback: (type: string) => void;
}

export default function Feed({
  videos,
  selectedMemory,
  showBiteBack,
  // user: UserProfile, // 保留给未来使用
  searchSession,
  feedState,
  // cardState, // 保留给未来使用
  // metrics,
  isControlGroup,
  onVideoConsumed,
  onCardAction,
  onNegativeFeedback
}: FeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  // 处理滑动
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < videos.length - 1) {
        // 向上滑动 - 下一个
        setCurrentIndex(prev => prev + 1);
        onVideoConsumed();
      } else if (diff < 0 && currentIndex > 0) {
        // 向下滑动 - 上一个
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  // 处理滚轮
  const handleWheel = (e: React.WheelEvent) => {
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

    if (video.type === 'biteback' && showBiteBack && selectedMemory && !isControlGroup) {
      return (
        <div
          key={video.id}
          className="feed-item"
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

    if (video.type === 'biteback') {
      // 如果是 biteback slot 但不显示，跳过
      return null;
    }

    // 普通视频
    const coverUrl = video.coverUrl || videoCovers[index % videoCovers.length];

    return (
      <div
        key={video.id}
        className="feed-item"
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
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 16,
            right: 16,
            color: '#fff',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>
            @{video.id} · 普通推荐内容
          </div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            {video.title || '这是一条普通的抖音短视频内容'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="feed-container"
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

      {/* 滑动提示 */}
      {feedState.normalVideosConsumed < 2 && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            zIndex: 100,
            pointerEvents: 'none'
          }}
        >
          向上滑动查看更多 ↑ ({feedState.normalVideosConsumed}/2)
        </div>
      )}
    </div>
  );
}
