import { useState } from 'react';
import StatusBar from './StatusBar';
import { defaultSearchQuery, searchSuggestions } from '../mocks';

interface SearchPageProps {
  onSearch: (query: string) => void;
  onCancel: () => void;
}

export default function SearchPage({ onSearch, onCancel }: SearchPageProps) {
  const [query, setQuery] = useState(defaultSearchQuery);

  const submit = (value = query) => {
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#11121b',
        zIndex: 1000,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <StatusBar time="15:11" battery={60} />

      <div style={{ height: 58, display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px 0 12px' }}>
        <button
          onClick={onCancel}
          aria-label="返回"
          style={{
            width: 38,
            height: 44,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 38,
            fontWeight: 200,
            lineHeight: 1,
            cursor: 'pointer'
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
            value={query}
            onChange={e => setQuery(e.target.value)}
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
              fontSize: 18
            }}
          />
          <button
            onClick={() => setQuery('')}
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
            onClick={() => submit()}
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

      <div style={{ padding: '22px 18px 0' }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>猜你想搜</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {searchSuggestions.map(item => (
            <button
              key={item}
              onClick={() => submit(item)}
              style={{
                height: 52,
                border: 'none',
                borderRadius: 9,
                background: '#373844',
                color: '#fff',
                fontSize: 17,
                textAlign: 'left',
                padding: '0 16px',
                cursor: 'pointer'
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
