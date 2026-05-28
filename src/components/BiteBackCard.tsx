import { useState } from 'react';
import type { FoodMemory } from '../types';

interface BiteBackCardProps {
  memory: FoodMemory;
  searchQuery: string;
  onExplanation: () => void;
  onAddToToday: () => void;
  onViewShop: () => void;
  onNegativeFeedback: (type: string) => void;
}

export default function BiteBackCard({
  memory,
  searchQuery,
  onExplanation,
  onAddToToday,
  onViewShop,
  onNegativeFeedback
}: BiteBackCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleShowExplanation = () => {
    setShowExplanation(true);
    onExplanation();
  };

  const handleAddToToday = () => {
    onAddToToday();
    setShowToast('已加入今天');
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleViewShop = () => {
    onViewShop();
    setShowToast('正在打开店铺...');
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleFeedback = (type: string, label: string) => {
    onNegativeFeedback(type);
    setShowFeedback(false);
    setShowToast(`反馈：${label}`);
    setTimeout(() => setShowToast(null), 2000);
  };

  // 生成触发原因文案
  const getTriggerReason = () => {
    if (searchQuery.includes('晚饭')) {
      return '你刚搜过晚饭 · 这家你收藏过';
    }
    if (searchQuery.includes(memory.shopName)) {
      return `你刚搜过${memory.shopName} · 这家你收藏过`;
    }
    return `你刚搜过"${searchQuery}" · 这家你收藏过`;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* 视频封面 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <img
          src={memory.coverUrl}
          alt={memory.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* 半透明遮罩 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)'
          }}
        />
      </div>

      {/* BiteBack 标签 - 抖音风格 */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 12,
          zIndex: 10,
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF3B30 100%)',
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(255,59,48,0.4)'
        }}
      >
        🔔 {getTriggerReason()}
      </div>

      {/* 右侧互动按钮 - 抖音风格 */}
      <div
        style={{
          position: 'absolute',
          right: 8,
          bottom: 140,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
          zIndex: 20
        }}
      >
        {/* 负反馈按钮 */}
        <button
          onClick={() => setShowFeedback(true)}
          style={{
            width: 44,
            height: 44,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          ✕
        </button>

        {/* 收藏 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}>
            ⭐
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            收藏
          </span>
        </div>

        {/* 分享 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}>
            ↗️
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            分享
          </span>
        </div>

        {/* 旋转音乐碟片 */}
        <div style={{
          marginTop: 4,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#1a1a1a',
          border: '4px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          animation: 'spin 4s linear infinite'
        }}>
          🍜
        </div>
      </div>

      {/* 底部信息区 - 抖音风格 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 12px 100px',
          color: '#fff',
          zIndex: 20
        }}
      >
        {/* POI 位置标签 - 仿抖音 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 12,
          fontSize: 13
        }}>
          <span style={{ fontSize: 14 }}>📍</span>
          <span>{(memory.distanceM / 1000).toFixed(1)}km</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span>{memory.businessArea}</span>
        </div>

        {/* 店名 */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 8,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}
        >
          {memory.shopName}
        </div>

        {/* 收藏信息 */}
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 10,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          收藏第 {memory.lastInteractionDays} 天 · 人均 ¥{memory.price} · {memory.isOpen ? '营业中' : '已打烊'}
        </div>

        {/* 团购信息（弱露出）- 抖音风格 */}
        {memory.dealAvailable && (
          <div
            style={{
              fontSize: 12,
              color: '#FF6B6B',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span style={{
              background: 'rgba(255,59,48,0.2)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10
            }}>
              团购
            </span>
            <span>有可用团购券</span>
          </div>
        )}

        {/* 操作按钮 - 抖音风格 */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 12
          }}
        >
          <button
            onClick={handleAddToToday}
            style={{
              flex: 1,
              padding: '11px 0',
              background: '#FF3B30',
              border: 'none',
              borderRadius: 22,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255,59,48,0.4)'
            }}
          >
            加入今天
          </button>
          <button
            onClick={handleViewShop}
            style={{
              flex: 1,
              padding: '11px 0',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 22,
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            看店铺
          </button>
        </div>

        {/* 解释入口 */}
        <button
          onClick={handleShowExplanation}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span>ℹ️</span>
          <span>为什么推荐给我？</span>
        </button>
      </div>

      {/* 解释弹层 */}
      {showExplanation && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 16
          }}
          onClick={() => setShowExplanation(false)}
        >
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: 20,
              padding: 24,
              width: '100%',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 20,
                textAlign: 'center'
              }}
            >
              为什么推荐给我？
            </div>

            <div style={{ fontSize: 14, lineHeight: 1.9, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#FF3B30' }}>•</span>
                <span>因为你刚搜索了"<strong style={{ color: '#fff' }}>{searchQuery}</strong>"</span>
              </p>
              <p style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#FF3B30' }}>•</span>
                <span>这家店来自你 <strong style={{ color: '#fff' }}>{memory.lastInteractionDays}</strong> 天前收藏的视频</span>
              </p>
              <p style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#FF3B30' }}>•</span>
                <span>它和搜索词在"<strong style={{ color: '#fff' }}>{memory.businessArea}</strong>"商圈和"<strong style={{ color: '#fff' }}>{memory.category}</strong>"品类上匹配</span>
              </p>
              <p style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#FF3B30' }}>•</span>
                <span>店铺 POI 置信度 <strong style={{ color: '#fff' }}>{Math.round(memory.poiConfidence * 100)}%</strong>，当前营业，约 <strong style={{ color: '#fff' }}>{memory.distanceM}m</strong></span>
              </p>
              <p style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#FF3B30' }}>•</span>
                <span>你可以随时关闭收藏唤醒</span>
              </p>
            </div>

            <button
              onClick={() => setShowExplanation(false)}
              style={{
                width: '100%',
                padding: 14,
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              知道了
            </button>
          </div>
        </div>
      )}

      {/* 负反馈弹层 */}
      {showFeedback && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 16
          }}
          onClick={() => setShowFeedback(false)}
        >
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: 20,
              padding: 20,
              width: '100%',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)'
              }}
            >
              不感兴趣
            </div>

            {[
              { type: 'too_far', label: '太远了' },
              { type: 'not_this_category', label: '不想吃这类' },
              { type: 'already_visited', label: '已经吃过' },
              { type: 'wrong_poi', label: '不是这家店' },
              { type: 'close_biteback', label: '别再提醒收藏' }
            ].map((item, index) => (
              <button
                key={item.type}
                onClick={() => handleFeedback(item.type, item.label)}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: index < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  color: '#fff',
                  fontSize: 15,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => setShowFeedback(false)}
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 15,
                cursor: 'pointer',
                marginTop: 8
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Toast 提示 */}
      {showToast && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.85)',
            padding: '14px 28px',
            borderRadius: 10,
            fontSize: 14,
            zIndex: 200,
            pointerEvents: 'none',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {showToast}
        </div>
      )}

      {/* 旋转动画 */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
