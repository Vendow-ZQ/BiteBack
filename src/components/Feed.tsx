import { useState, useRef } from 'react';
import type { FeedVideo, FoodMemory, SearchSession, FeedState } from '../types';
import { videoCovers } from '../data/mock';
import BiteBackCard from './BiteBackCard';

interface FeedProps {
  videos: FeedVideo[];
  selectedMemory: FoodMemory | null;
  showBiteBack: boolean;
  searchSession: SearchSession;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  feedState: FeedState;
  isControlGroup: boolean;
  onVideoConsumed: () => void;
  onCardAction: (action: 'explanation' | 'add_to_today' | 'view_shop') => void;
  onNegativeFeedback: (type: string) => void;
  onSearchClick: () => void;
}

// 抖音风格的数字格式化
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export default function Feed({
  videos,
  selectedMemory,
  showBiteBack,
  searchSession,
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
    const isFirstVideo = index === 0;

    // 模拟数据
    const likes = [12.5, 8.3, 25.6, 3.2, 56.7][index % 5] * 10000;
    const comments = [3200, 1100, 5800, 892, 12300][index % 5];
    const shares = [1500, 892, 3200, 567, 8900][index % 5];

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
        <video
          src={video.videoUrl || coverUrl}
          poster={video.coverUrl || coverUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* 顶部导航栏 - 仿抖音设计 */}
        {isFirstVideo && (
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
              fontSize: 16,
              zIndex: 20,
              fontWeight: 500
            }}
          >
            <span style={{ opacity: 0.6 }}>关注</span>
            <span style={{ fontWeight: 700, fontSize: 17 }}>推荐</span>
            <span style={{ opacity: 0.6 }}>附近</span>
          </div>
        )}

        {/* 搜索按钮 - 抖音风格 */}
        {isFirstVideo && (
          <button
            onClick={onSearchClick}
            style={{
              position: 'absolute',
              top: 44,
              right: 12,
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
              zIndex: 20,
              backdropFilter: 'blur(10px)'
            }}
          >
            <span style={{ fontSize: 14 }}>🔍</span>
            <span>搜索</span>
          </button>
        )}

        {/* 左侧视频信息 - 抖音风格 */}
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 12,
            right: 80,
            color: '#fff',
            zIndex: 20
          }}
        >
          {/* 用户名 */}
          <div style={{
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 8,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}>
            @{video.id}
          </div>

          {/* 视频描述 */}
          <div style={{
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 10,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            opacity: 0.95
          }}>
            {video.title || '这是一条普通的抖音短视频内容，上下滑动查看更多'}
          </div>

          {/* 音乐信息 - 抖音特色 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            opacity: 0.9
          }}>
            <span style={{ fontSize: 12 }}>🎵</span>
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 200
            }}>
              原声 - @{video.id}
            </span>
            <span style={{
              width: 60,
              height: 1,
              background: 'linear-gradient(90deg, #fff, transparent)',
              marginLeft: 8
            }} />
          </div>
        </div>

        {/* 右侧互动按钮 - 抖音经典竖排 */}
        <div
          style={{
            position: 'absolute',
            right: 8,
            bottom: 90,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center',
            zIndex: 20
          }}
        >
          {/* 头像 */}
          <div style={{
            position: 'relative',
            marginBottom: 8
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              overflow: 'hidden'
            }}>
              👤
            </div>
            <div style={{
              position: 'absolute',
              bottom: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 18,
              height: 18,
              background: '#FE2C55',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              border: '2px solid #000',
              fontWeight: 'bold'
            }}>
              +
            </div>
          </div>

          {/* 点赞 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer'
          }}>
            <div style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <path d="M24 42.5L21.26 40.03C10.86 30.64 4.5 24.94 4.5 17.95C4.5 12.23 8.93 7.8 14.65 7.8C17.94 7.8 21.09 9.33 23.13 11.71C25.17 9.33 28.32 7.8 31.61 7.8C37.33 7.8 41.76 12.23 41.76 17.95C41.76 24.94 35.4 30.64 25 40.03L24 42.5Z"
                  fill="#fff"
                  fillOpacity="0.95"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              color: '#fff'
            }}>
              {formatNumber(likes)}
            </span>
          </div>

          {/* 评论 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer'
          }}>
            <div style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
                <path d="M12 10C12 8.89543 12.8954 8 14 8H34C35.1046 8 36 8.89543 36 10V30C36 31.1046 35.1046 32 34 32H28L20 40V32H14C12.8954 32 12 31.1046 12 30V10Z"
                  fill="#fff"
                  fillOpacity="0.95"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="19" cy="20" r="2" fill="#000"/>
                <circle cx="29" cy="20" r="2" fill="#000"/>
              </svg>
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              color: '#fff'
            }}>
              {formatNumber(comments)}
            </span>
          </div>

          {/* 收藏 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer'
          }}>
            <div style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
                <path d="M12 6C12 4.89543 12.8954 4 14 4H34C35.1046 4 36 4.89543 36 6V42L24 35L12 42V6Z"
                  fill="#fff"
                  fillOpacity="0.95"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              color: '#fff'
            }}>
              收藏
            </span>
          </div>

          {/* 分享 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer'
          }}>
            <div style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
                <path d="M38 20C41.3137 20 44 17.3137 44 14C44 10.6863 41.3137 8 38 8C34.6863 8 32 10.6863 32 14"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path d="M38 20V36C38 38.2091 36.2091 40 34 40H14C11.7909 40 10 38.2091 10 36V22"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path d="M16 14L10 20L4 14"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="3" fill="#fff"/>
                <circle cx="38" cy="14" r="3" fill="#fff"/>
              </svg>
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              color: '#fff'
            }}>
              {formatNumber(shares)}
            </span>
          </div>

          {/* 旋转音乐碟片 */}
          <div style={{
            marginTop: 8,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#1a1a1a',
            border: '4px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            animation: 'spin 4s linear infinite',
            overflow: 'hidden'
          }}>
            🎵
          </div>
        </div>

        {/* 底部进度提示 */}
        {index < 2 && (
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              zIndex: 20,
              background: 'rgba(0,0,0,0.4)',
              padding: '4px 12px',
              borderRadius: 12
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
      {/* 添加旋转动画 */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      {videos.map((video, index) => renderVideoCard(video, index))}
    </div>
  );
}
