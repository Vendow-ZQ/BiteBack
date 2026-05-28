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

const hotSearches = [
  '南科大美食一条街',
  '南科大附近美食推荐',
  '南科大宝能城美食',
  '南科大小吃街',
  '南科大美食探店'
];

export default function SearchPage({ onSearch, onCancel }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('综合');

  const tabs = ['综合', '视频', '直播', '团购', '图文'];

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
      background: '#0d0d0d',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 状态栏占位 */}
      <div style={{ height: 44 }} />

      {/* 搜索栏 - 抖音风格 */}
      <div style={{
        padding: '8px 12px',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* 返回按钮 */}
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          ←
        </button>

        {/* 搜索输入框 */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '8px 14px'
        }}>
          <span style={{ marginRight: 8, opacity: 0.5, fontSize: 14 }}>🔍</span>
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
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: 18,
                height: 18,
                color: '#fff',
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* 搜索按钮 */}
        <button
          onClick={() => handleSearch(query)}
          style={{
            background: 'none',
            border: 'none',
            color: query ? '#FF3B30' : 'rgba(255,255,255,0.4)',
            fontSize: 15,
            cursor: query ? 'pointer' : 'default',
            fontWeight: 500
          }}
        >
          搜索
        </button>
      </div>

      {/* Tab 导航 */}
      <div style={{
        display: 'flex',
        padding: '0 12px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 14px',
              background: 'none',
              border: 'none',
              color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: 14,
              cursor: 'pointer',
              position: 'relative',
              fontWeight: activeTab === tab ? 600 : 400
            }}
          >
            {tab}
            {activeTab === tab && (
              <div style={{
                position: 'absolute',
                bottom: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 20,
                height: 3,
                background: '#FF3B30',
                borderRadius: 2
              }} />
            )}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* 相关搜索 */}
        <div style={{ padding: '16px 12px' }}>
          <div style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 12
          }}>
            相关搜索
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {hotSearches.map((text, index) => (
              <button
                key={text}
                onClick={() => handleSearch(text)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 14,
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.03)'
                }}
              >
                <span style={{
                  marginRight: 12,
                  color: index < 3 ? '#FF3B30' : 'rgba(255,255,255,0.3)',
                  fontSize: 13,
                  fontWeight: 600,
                  width: 16
                }}>
                  {index + 1}
                </span>
                <span style={{ flex: 1 }}>{text}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>🔥</span>
              </button>
            ))}
          </div>
        </div>

        {/* 搜索建议 */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 12
          }}>
            试试这些
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {suggestions.map(s => (
              <button
                key={s.text}
                onClick={() => handleSearch(s.text)}
                style={{
                  padding: '8px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: 16,
                  color: s.tag === 'Demo推荐' ? '#FF3B30' : '#fff',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                🔍 {s.text}
                {s.tag && s.tag !== 'Demo推荐' && (
                  <span style={{
                    fontSize: 10,
                    color: s.color || '#888'
                  }}>
                    ({s.tag})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Demo 说明 */}
        <div style={{
          margin: '16px 12px',
          padding: 16,
          background: 'rgba(255,59,48,0.08)',
          borderRadius: 12,
          border: '1px solid rgba(255,59,48,0.15)'
        }}>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#FF3B30',
            marginBottom: 10
          }}>
            🎯 Demo 演示流程
          </div>
          <div style={{
            fontSize: 13,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)'
          }}>
            1. 点击 <strong style={{ color: '#fff' }}>"南科大附近晚饭"</strong>
            <br />
            2. 在搜索结果页不做任何操作
            <br />
            3. 点击 <strong style={{ color: '#fff' }}>返回 Feed</strong>
            <br />
            4. 向上滑动2条视频查看BiteBack卡片
          </div>
        </div>
      </div>
    </div>
  );
}
