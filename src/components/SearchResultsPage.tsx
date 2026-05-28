import { useState } from 'react';
import StatusBar from './StatusBar';
import { relatedSearches, searchResultCards, searchTabs } from '../mocks';
import type { SearchResultCard } from '../types';

interface SearchResultsPageProps {
  query: string;
  onBack: () => void;
  onSearch: (query: string) => void;
}

export default function SearchResultsPage({ query, onBack, onSearch }: SearchResultsPageProps) {
  const [activeTab, setActiveTab] = useState('综合');
  const [inputValue, setInputValue] = useState(query);

  const submit = () => {
    if (inputValue.trim()) onSearch(inputValue.trim());
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 300,
        background: '#11121b',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <StatusBar time="15:11" battery={60} />

      <div
        style={{
          height: 58,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 10px 0 12px'
        }}
      >
        <button
          onClick={onBack}
          aria-label="返回"
          style={{
            width: 38,
            height: 44,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 38,
            lineHeight: 1,
            fontWeight: 200,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ‹
        </button>

        <div
          style={{
            flex: 1,
            height: 44,
            borderRadius: 10,
            background: '#5b5c67',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 14,
            overflow: 'hidden'
          }}
        >
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') submit();
            }}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f5f5f7',
              fontSize: 18,
              letterSpacing: 0
            }}
          />
          <button
            onClick={() => setInputValue('')}
            style={{
              width: 27,
              height: 27,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.28)',
              color: '#d7d7df',
              fontSize: 20,
              lineHeight: 1,
              marginRight: 9,
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <div style={{ width: 1, height: 27, background: 'rgba(255,255,255,0.28)' }} />
          <button
            onClick={submit}
            style={{
              width: 66,
              height: '100%',
              border: 'none',
              background: 'transparent',
              color: '#fff',
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            搜索
          </button>
        </div>
      </div>

      <div
        style={{
          height: 54,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '0 16px',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.02)'
        }}
      >
        {searchTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              height: 54,
              minWidth: 42,
              background: 'none',
              border: 'none',
              color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.58)',
              fontSize: 18,
              fontWeight: activeTab === tab ? 700 : 500,
              position: 'relative',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {tab}
            {activeTab === tab && (
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 4,
                  transform: 'translateX(-50%)',
                  width: 18,
                  height: 4,
                  borderRadius: 4,
                  background: '#fff'
                }}
              />
            )}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 25, color: 'rgba(255,255,255,0.8)' }}>▥</span>
        <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.86)', position: 'relative' }}>
          ⌁
          <i style={{ position: 'absolute', right: -2, top: -2, width: 7, height: 7, borderRadius: '50%', background: '#ffd328' }} />
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 5px 24px',
          scrollbarWidth: 'none'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {searchResultCards.filter((_, i) => i % 2 === 0).map(card => (
              <ResultCard key={card.id} {...card} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 5 }}>
              <div style={{ fontSize: 16, fontWeight: 700, padding: '0 8px' }}>相关搜索</div>
              {relatedSearches.slice(0, 4).map(item => (
                <button
                  key={item}
                  onClick={() => onSearch(item)}
                  style={{
                    height: 54,
                    border: 'none',
                    borderRadius: 7,
                    background: '#3a3b46',
                    color: '#fff',
                    fontSize: 16,
                    textAlign: 'left',
                    padding: '0 12px',
                    cursor: 'pointer',
                    lineHeight: 1.2
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            {searchResultCards.filter((_, i) => i % 2 === 1).map(card => (
              <ResultCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </div>

      <button
        aria-label="AI"
        style={{
          position: 'absolute',
          right: 17,
          bottom: 32,
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: 'none',
          background: '#fff',
          color: '#11121b',
          fontSize: 22,
          fontWeight: 900,
          boxShadow: '0 8px 20px rgba(0,0,0,0.32)',
          cursor: 'pointer'
        }}
      >
        ✣AI
      </button>
    </div>
  );
}

function ResultCard({
  image,
  title,
  author,
  date,
  likes,
  duration,
  multi
}: SearchResultCard) {
  return (
    <article
      style={{
        background: '#171822',
        borderRadius: 4,
        overflow: 'hidden',
        color: '#fff'
      }}
    >
      <div style={{ position: 'relative', background: '#222' }}>
        <img src={image} alt="" style={{ width: '100%', display: 'block', aspectRatio: '1 / 1.28', objectFit: 'cover' }} />
        {duration && (
          <span
            style={{
              position: 'absolute',
              right: 8,
              bottom: 7,
              fontSize: 13,
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.65)'
            }}
          >
            {duration}
          </span>
        )}
        {multi && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 18,
              height: 18,
              borderRadius: 4,
              border: '2px solid #fff',
              boxShadow: '3px -3px 0 rgba(255,255,255,0.8)'
            }}
          />
        )}
      </div>
      <div style={{ padding: '9px 10px 11px' }}>
        <div style={{ fontSize: 16, lineHeight: 1.32, fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, color: 'rgba(255,255,255,0.55)' }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#84745f,#38485f)', flex: '0 0 auto' }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{author}</span>
            <span style={{ display: 'block', fontSize: 11, marginTop: 1 }}>{date}</span>
          </span>
          <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)' }}>♡</span>
          <span style={{ fontSize: 12 }}>{likes}</span>
        </div>
      </div>
    </article>
  );
}
