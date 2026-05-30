import { resolveMockAsset } from '../mocks/assets';

interface AssetBlockProps {
  assetId: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function AssetBlock({
  assetId,
  label,
  className,
  style,
  imgStyle,
  children
}: AssetBlockProps) {
  const asset = resolveMockAsset(assetId);
  const background = asset.placeholderColor || '#333';

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background,
        ...style
      }}
      title={asset.description}
    >
      {asset.path ? (
        <img
          src={asset.path}
          alt={label || asset.description}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            ...imgStyle
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 42%, rgba(0,0,0,0.24))'
          }}
        />
      )}

      {label && !asset.path && (
        <div
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 10,
            color: 'rgba(255,255,255,0.9)',
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.25,
            textShadow: '0 1px 3px rgba(0,0,0,0.35)'
          }}
        >
          {label}
        </div>
      )}

      {children}
    </div>
  );
}
