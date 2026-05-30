import type { SavedFoodMemory } from '../types';
import copy from '../mocks/copy.json';
import { formatCopy } from '../utils/copy';
import AssetBlock from './AssetBlock';

interface StartEatingSheetProps {
  memory: SavedFoodMemory;
  onOpenShop: (memory: SavedFoodMemory) => void;
  onShareToFriend: (memory: SavedFoodMemory) => void;
  onClose: () => void;
}

export default function StartEatingSheet({
  memory,
  onOpenShop,
  onShareToFriend,
  onClose
}: StartEatingSheetProps) {
  return (
    <div className="sheetScrim" onClick={onClose}>
      <div className="startSheet" onClick={event => event.stopPropagation()}>
        <div className="sheetHandle" />

        <div className="sheetTopline">
          <span>{copy.sheet.startTitle}</span>
          <button onClick={onClose} aria-label="关闭">×</button>
        </div>

        <section className="shopSummary">
          <div>
            <div className="sheetShopName">{memory.shopName}</div>
            <div className="sheetDish">
              {formatCopy(copy.sheet.savedTemplate, {
                days: memory.savedDaysAgo,
                dish: memory.signatureDishes[0]
              })}
            </div>
          </div>
          <span className="openPill">{formatCopy(copy.sheet.openUntil, { time: memory.openUntil })}</span>
        </section>

        <section className="reachabilityHero">
          <div className="distanceLine">{memory.routeSummary}</div>
          <div className="routeHint">{memory.routeHint}</div>
        </section>

        <AssetBlock
          assetId={memory.mapAssetId}
          className="routeCard"
        >
          <svg viewBox="0 0 100 78" className="routeSvg" aria-hidden="true">
            <polyline
              points={memory.routePolylineMock.map(point => `${point.x},${point.y}`).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0 0"
            />
            {memory.routePolylineMock.map((point, index) => (
              <circle
                key={`${point.x}-${point.y}`}
                cx={point.x}
                cy={point.y}
                r={index === 0 || index === memory.routePolylineMock.length - 1 ? 4.6 : 3}
                fill={index === memory.routePolylineMock.length - 1 ? '#ff4d6d' : '#f5f0de'}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1"
              />
            ))}
          </svg>
          <div className="routeLabels">
            <span>{copy.sheet.youAreHere}</span>
            <span>{formatCopy(copy.sheet.minutesToArrive, { minutes: memory.walkMinutes })}</span>
          </div>
        </AssetBlock>

        <section className="certaintyGrid">
          <div>
            <span>{copy.sheet.arrival}</span>
            <strong>{memory.arrivalText.replace('现在去预计 ', '')}</strong>
          </div>
          <div>
            <span>{copy.sheet.queueRisk}</span>
            <strong>{memory.queueRisk}</strong>
          </div>
          <div>
            <span>{copy.sheet.price}</span>
            <strong>¥{memory.pricePerPerson}</strong>
          </div>
        </section>

        <section className="proofBlock">
          <div className="sectionLabel">{copy.sheet.proofLabel}</div>
          <p>“{memory.commentProof}”</p>
          <p className="creatorQuote">“{memory.creatorQuote}”</p>
        </section>

        {memory.dealAvailable && memory.dealText && (
          <div className="dealStrip">
            <span>{copy.sheet.dealLabel}</span>
            <strong>{memory.dealText}</strong>
          </div>
        )}

        <div className="sheetActions">
          <button onClick={() => onOpenShop(memory)}>{copy.sheet.shopAction}</button>
          <button onClick={() => onShareToFriend(memory)}>{copy.sheet.shareAction}</button>
        </div>
      </div>
    </div>
  );
}
