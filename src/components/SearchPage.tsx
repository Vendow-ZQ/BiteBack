import { useState } from 'react';

interface SearchPageProps {
  onSearch: (query: string) => void;
  onCancel: () => void;
}

const suggestions = [
  { text: '南科大附近晚饭', tag: 'Demo推荐', color: '#FF3B30' },
  { text: '南山烧烤', tag: null, color: null },
  { text: '科技园午餐', tag: null, color: null },
  { text: '猫咪视频', tag: '不触发测试', color: '#888' },
  { text: '老巷牛肉面', tag: null, color: null }
];

export default function SearchPage({ onSearch, onCancel }: SearchPageProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (q: string) => {
    if (q.trim()) {
      onSearch(q);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#000',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 状态栏占位 */}
      <div style={{ height: 44 }} />

      {/* 搜索栏 */}
      <div style={{
        padding: '10px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '10px 12px'
        }}>
          <span style={{ marginRight: 8, opacity: 0.6 }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索美食、餐厅"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 15,
              outline: 'none'
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleSearch(query);
              }
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 16,
                cursor: 'pointer',
                padding: '0 4px'
              }}
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 15,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          取消
        </button>
      </div>

      {/* 搜索建议 */}
      <div style={{ flex: 1, padding: 16 }}>
        <div style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 16
        }}>
          搜索建议（点击模拟搜索）
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suggestions.map((s, index) => (
            <button
              key={s.text}
              onClick={() => handleSearch(s.text)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 0',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: 15,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <span style={{ marginRight: 12, opacity: 0.4, width: 20 }}>{index + 1}</span>
              <span style={{ flex: 1 }}>{s.text}</span>
              {s.tag && (
                <span style={{
                  padding: '2px 8px',
                  background: s.color ? `${s.color}30` : 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  fontSize: 10,
                  color: s.color || 'rgba(255,255,255,0.5)'
                }}>
                  {s.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Demo 说明 */}
      <div style={{
        padding: 20,
        background: 'rgba(255,59,48,0.1)',
        fontSize: 12,
        lineHeight: 1.6,
        color: 'rgba(255,255,255,0.6)'
      }}>
        <strong style={{ color: '#FF3B30' }}>Demo 流程：</strong>
        <br />
        1. 点击"南科大附近晚饭"搜索
        <br />
        2. 在搜索结果页不做任何操作
        <br />
        3. 点击"返回 Feed"
        <br />
        4. 向上滑动2条视频后查看BiteBack卡片
      </div>
    </div>
  );
}
