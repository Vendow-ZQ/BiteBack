interface StatusBarProps {
  dark?: boolean;
  time?: string;
  battery?: number;
}

export default function StatusBar({ dark = false, time = '15:11', battery = 60 }: StatusBarProps) {
  const color = dark ? '#111' : '#fff';

  return (
    <div
      style={{
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px 0 22px',
        color,
        fontSize: 17,
        fontWeight: 500,
        letterSpacing: 0,
        textShadow: dark ? 'none' : '0 1px 2px rgba(0,0,0,0.25)'
      }}
    >
      <span>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700 }}>
        <span style={{ fontSize: 15, lineHeight: 1 }}>●</span>
        <span style={{ fontSize: 17, lineHeight: 1 }}>⌘</span>
        <span style={{ fontSize: 11, lineHeight: 1 }}>5G</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 13 }}>
          {[4, 7, 10, 13].map((h, index) => (
            <span
              key={index}
              style={{
                display: 'block',
                width: 3,
                height: h,
                borderRadius: 1,
                background: color,
                opacity: index === 3 ? 0.65 : 1
              }}
            />
          ))}
        </div>
        <div
          style={{
            minWidth: 27,
            height: 16,
            borderRadius: 4,
            background: dark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)',
            color: dark ? '#fff' : '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 800,
            lineHeight: 1
          }}
        >
          {battery}
        </div>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1ed760', display: 'block' }} />
      </div>
    </div>
  );
}
