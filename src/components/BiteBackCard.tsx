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
      {/* 触发原因标签 */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 16,
          zIndex: 10,
          background: 'rgba(255, 59, 48, 0.9)',
          padding: '6px 12px',
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 500
        }}
      >
        {getTriggerReason()}
      </div>

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
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
          }}
        />
      </div>

      {/* 底部信息区 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 16px 80px',
          color: '#fff'
        }}
      >
        {/* 店名 */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 8
          }}
        >
          {memory.shopName}
        </div>

        {/* 收藏信息与距离 */}
        <div
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 8
          }}
        >
          收藏第 {memory.lastInteractionDays} 天 · 约 {memory.distanceM}m
        </div>

        {/* 价格与营业状态 */}
        <div
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 12
          }}
        >
          人均 ¥{memory.price} · {memory.isOpen ? '当前营业中' : '已打烊'}
        </div>

        {/* 团购信息（弱露出） */}
        {memory.dealAvailable && (
          <div
            style={{
              fontSize: 12,
              color: '#FF3B30',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span style={{ fontSize: 10 }}>●</span>
            有可用团购
          </div>
        )}

        {/* 操作按钮 */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16
          }}
        >
          <button
            onClick={handleAddToToday}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: '#FF3B30',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            加入今天
          </button>
          <button
            onClick={handleViewShop}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer'
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
            fontSize: 13,
            cursor: 'pointer',
            padding: 0
          }}
        >
          为什么推荐给我？
        </button>
      </div>

      {/* 负反馈按钮 */}
      <button
        onClick={() => setShowFeedback(true)}
        style={{
          position: 'absolute',
          top: 60,
          right: 16,
          width: 32,
          height: 32,
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          color: '#fff',
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        ×
      </button>

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
              borderRadius: 16,
              padding: 24,
              width: '100%'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 20,
                textAlign: 'center'
              }}
            >
              为什么推荐给我？
            </div>

            <div style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
              <p style={{ marginBottom: 12 }}>
                • 因为你刚搜索了"{searchQuery}"
              </p>
              <p style={{ marginBottom: 12 }}>
                • 这家店来自你 {memory.lastInteractionDays} 天前收藏的视频
              </p>
              <p style={{ marginBottom: 12 }}>
                • 它和搜索词在"{memory.businessArea}"商圈和"{memory.category}"品类上匹配
              </p>
              <p style={{ marginBottom: 12 }}>
                • 店铺 POI 置信度高（{Math.round(memory.poiConfidence * 100)}%），当前营业，约 {memory.distanceM}m
              </p>
              <p style={{ marginBottom: 20 }}>
                • 你可以随时关闭收藏唤醒
              </p>
            </div>

            <button
              onClick={() => setShowExplanation(false)}
              style={{
                width: '100%',
                padding: 14,
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 15,
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
              borderRadius: 16,
              padding: 16,
              width: '100%'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
                textAlign: 'center'
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
            ].map(item => (
              <button
                key={item.type}
                onClick={() => handleFeedback(item.type, item.label)}
                style={{
                  width: '100%',
                  padding: 16,
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: 15,
                  textAlign: 'left',
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
                padding: 16,
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
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
            background: 'rgba(0,0,0,0.8)',
            padding: '12px 24px',
            borderRadius: 8,
            fontSize: 14,
            zIndex: 200,
            pointerEvents: 'none'
          }}
        >
          {showToast}
        </div>
      )}
    </div>
  );
}
