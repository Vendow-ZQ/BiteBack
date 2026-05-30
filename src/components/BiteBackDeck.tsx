import { useRef, useState } from 'react';
import type { BiteBackDeckPage, CurrentContext, NegativeFeedbackType, SavedFoodMemory } from '../types';
import copy from '../mocks/copy.json';
import { formatCopy } from '../utils/copy';
import AssetBlock from './AssetBlock';
import StartEatingSheet from './StartEatingSheet';

const deckPages: BiteBackDeckPage[] = ['nearby', 'action', 'route', 'proof'];

interface BiteBackDeckProps {
  candidates: SavedFoodMemory[];
  context: CurrentContext;
  selectedIndex: number;
  activePage: BiteBackDeckPage;
  onSelectCandidate: (index: number) => void;
  onChangePage: (page: BiteBackDeckPage) => void;
  onStartEating: (memory: SavedFoodMemory) => void;
  onRouteIntent: (memory: SavedFoodMemory) => void;
  onOpenShop: (memory: SavedFoodMemory) => void;
  onOpenSourceVideo: (memory: SavedFoodMemory) => void;
  onShareToFriend: (memory: SavedFoodMemory) => void;
  onRemindLater: (minutes: number) => void;
  onOpenReason: () => void;
  onNegativeFeedback: (type: NegativeFeedbackType) => void;
}

export default function BiteBackDeck({
  candidates,
  context,
  selectedIndex,
  activePage,
  onSelectCandidate,
  onChangePage,
  onStartEating,
  onRouteIntent,
  onOpenShop,
  onOpenSourceVideo,
  onShareToFriend,
  onRemindLater,
  onOpenReason,
  onNegativeFeedback
}: BiteBackDeckProps) {
  const [showStartSheet, setShowStartSheet] = useState(false);
  const [showReasonSheet, setShowReasonSheet] = useState(false);
  const [showShopSheet, setShowShopSheet] = useState(false);
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const memory = candidates[selectedIndex] || candidates[0];
  if (!memory) return null;

  const activePageIndex = deckPages.indexOf(activePage);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1600);
  };

  const changePageByOffset = (offset: number) => {
    const nextIndex = Math.max(0, Math.min(deckPages.length - 1, activePageIndex + offset));
    const nextPage = deckPages[nextIndex];
    if (nextPage !== activePage) onChangePage(nextPage);
  };

  const openStartEating = () => {
    onStartEating(memory);
    setShowStartSheet(true);
  };

  const handleReason = () => {
    onOpenReason();
    setShowReasonSheet(true);
  };

  const handleOpenShop = (target: SavedFoodMemory) => {
    onOpenShop(target);
    setShowStartSheet(false);
    setShowShopSheet(true);
  };

  const handleBuyDeal = () => {
    showToast('已打开团购券');
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!pointerStart.current) return;
    const dx = pointerStart.current.x - event.clientX;
    const dy = pointerStart.current.y - event.clientY;
    pointerStart.current = null;
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    changePageByOffset(dx > 0 ? 1 : -1);
  };

  return (
    <div
      className="biteDeck"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      <style>{deckStyles}</style>
      <AssetBlock assetId={memory.heroAssetId} className="deckBackground" />
      <div className="deckShade" />

      <div className="deckHeader">
        <div>
          <div className="deckTitle">{copy.deck.title}</div>
          <div className="deckSubtitle">{formatCopy(copy.deck.subtitle, { count: candidates.length })}</div>
        </div>
        <button className="aiChip" onClick={handleReason}>{copy.deck.aiLabel}</button>
      </div>

      <div className="deckBody">
        <div
          className="deckTrack"
          style={{ transform: `translate3d(-${activePageIndex * 100}%, 0, 0)` }}
        >
          <div className="deckSlide">
            <NearbyPage
              memory={memory}
              candidates={candidates}
              selectedIndex={selectedIndex}
              context={context}
              onSelectCandidate={onSelectCandidate}
              onReason={handleReason}
            />
          </div>
          <div className="deckSlide">
            <ActionPage
              memory={memory}
              onStartEating={openStartEating}
              onShare={() => {
                onShareToFriend(memory);
                showToast(copy.toast.share);
              }}
              onRemind={() => {
                onRemindLater(60);
                showToast(copy.toast.remind);
              }}
            />
          </div>
          <div className="deckSlide">
            <RoutePage
              memory={memory}
              candidates={candidates}
              onRouteIntent={() => onRouteIntent(memory)}
            />
          </div>
          <div className="deckSlide">
            <ProofPage
              memory={memory}
              candidates={candidates}
              onOpenSourceVideo={onOpenSourceVideo}
            />
          </div>
        </div>
      </div>

      <div className="deckBottom">
        <div className="pageBars">
          {deckPages.map(page => (
            <button
              key={page}
              aria-label={`切换到 ${page}`}
              className={page === activePage ? 'pageBar active' : 'pageBar'}
              onClick={() => onChangePage(page)}
            />
          ))}
        </div>
        <div className="bottomActions">
          <button className="quietBtn" onClick={() => setShowFeedbackSheet(true)}>{copy.buttons.notInterested}</button>
          <button className="primaryBtn" onClick={openStartEating}>{copy.buttons.startEating}</button>
        </div>
        <div className="continueHint">{copy.deck.continueHint}</div>
      </div>

      {showStartSheet && (
        <StartEatingSheet
          memory={memory}
          onOpenShop={handleOpenShop}
          onShareToFriend={target => {
            onShareToFriend(target);
            showToast(copy.toast.share);
          }}
          onClose={() => setShowStartSheet(false)}
        />
      )}

      {showReasonSheet && (
        <ReasonSheet context={context} onClose={() => setShowReasonSheet(false)} />
      )}

      {showShopSheet && (
        <ShopSheet memory={memory} onClose={() => setShowShopSheet(false)} onBuyDeal={handleBuyDeal} />
      )}

      {showFeedbackSheet && (
        <FeedbackSheet
          onClose={() => setShowFeedbackSheet(false)}
          onFeedback={type => {
            setShowFeedbackSheet(false);
            onNegativeFeedback(type);
          }}
        />
      )}

      {toast && <div className="deckToast">{toast}</div>}
    </div>
  );
}

function NearbyPage({
  memory,
  candidates,
  selectedIndex,
  context,
  onSelectCandidate,
  onReason
}: {
  memory: SavedFoodMemory;
  candidates: SavedFoodMemory[];
  selectedIndex: number;
  context: CurrentContext;
  onSelectCandidate: (index: number) => void;
  onReason: () => void;
}) {
  return (
    <div className="nearbyPage">
      <div className="factRail">
        <div>
          <span>{copy.pages.nearby.locationLabel}</span>
          <strong>{context.areaName}</strong>
        </div>
        <div>
          <span>{copy.pages.nearby.memoryLabel}</span>
          <strong>{candidates.length} 家</strong>
        </div>
        <div>
          <span>{copy.pages.nearby.statusLabel}</span>
          <strong>{copy.pages.nearby.statusValue}</strong>
        </div>
      </div>

      <div className="collagePanel">
        <AssetBlock assetId={memory.heroAssetId} label={memory.signatureDishes[0]} className="heroFood">
          <div className="heroOverlay">
            <div className="shopName">{memory.shopName}</div>
            <div className="shopMeta">{memory.routeSummary} · 营业到 {memory.openUntil}</div>
          </div>
        </AssetBlock>
        <div className="miniFoodGrid">
          {candidates.slice(1, 3).map((item, index) => (
            <button
              key={item.memoryId}
              className="miniFood"
              onClick={() => onSelectCandidate(index + 1)}
            >
              <AssetBlock assetId={item.heroAssetId} label={item.signatureDishes[0]} style={{ width: '100%', height: '100%' }} />
              <span>{item.walkMinutes} 分钟</span>
            </button>
          ))}
        </div>
      </div>

      <div className="candidateStrip">
        {candidates.map((item, index) => (
          <button
            key={item.memoryId}
            className={index === selectedIndex ? 'candidateTile active' : 'candidateTile'}
            onClick={() => onSelectCandidate(index)}
          >
            <span>{item.shopName}</span>
            <strong>{item.distanceM < 1000 ? `${item.distanceM}m` : `${(item.distanceM / 1000).toFixed(1)}km`} · ¥{item.pricePerPerson}</strong>
          </button>
        ))}
      </div>

      <button className="reasonLine" onClick={onReason}>
        {formatCopy(copy.pages.nearby.reasonTemplate, {
          days: memory.savedDaysAgo,
          distance: memory.distanceM < 1000 ? `${memory.distanceM}m` : `${(memory.distanceM / 1000).toFixed(1)}km`
        })}
      </button>
    </div>
  );
}

function ActionPage({
  memory,
  onStartEating,
  onShare,
  onRemind
}: {
  memory: SavedFoodMemory;
  onStartEating: () => void;
  onShare: () => void;
  onRemind: () => void;
}) {
  return (
    <div className="actionPage">
      <div className="sectionEyebrow">{copy.pages.action.eyebrow}</div>
      <h2>{memory.shopName}</h2>
      <p>{formatCopy(copy.pages.action.summaryTemplate, {
        distance: memory.distanceM < 1000 ? `${memory.distanceM}m` : `${(memory.distanceM / 1000).toFixed(1)}km`,
        minutes: memory.walkMinutes
      })}</p>
      <button className="actionHeroBtn" onClick={onStartEating}>{copy.buttons.startEating}</button>
      {memory.dealAvailable && <div className="weakDeal">{copy.pages.action.dealPrefix} · {memory.dealText}</div>}
      <div className="actionGrid">
        <button onClick={onShare}>
          <span>{copy.pages.action.shareTitle}</span>
          <strong>{copy.pages.action.shareDesc}</strong>
        </button>
        <button onClick={onRemind}>
          <span>{copy.pages.action.remindTitle}</span>
          <strong>{copy.pages.action.remindDesc}</strong>
        </button>
      </div>
    </div>
  );
}

function RoutePage({
  memory,
  candidates,
  onRouteIntent
}: {
  memory: SavedFoodMemory;
  candidates: SavedFoodMemory[];
  onRouteIntent: () => void;
}) {
  const nextBest = candidates.find(item => item.memoryId !== memory.memoryId);

  return (
    <div className="routePage">
      <div className="sectionEyebrow">{copy.pages.route.eyebrow}</div>
      <div className="routeStats">
        <div><span>{copy.pages.route.walk}</span><strong>{memory.walkMinutes} 分钟</strong></div>
        <div><span>{copy.pages.route.arrival}</span><strong>{memory.arrivalText.replace('现在去预计 ', '')}</strong></div>
        <div><span>{copy.pages.route.queue}</span><strong>{memory.queueRisk}</strong></div>
      </div>
      <div className="routePlanCard">
        <div className="routePlanHeader">
          <span>{copy.pages.route.planLabel}</span>
          <strong>{copy.pages.route.planValue}</strong>
        </div>
        <ol className="routeSteps">
          <li>
            <span>{copy.pages.route.stepOne}</span>
            <strong>{memory.routeSummary}</strong>
            <em>{memory.routeHint}</em>
          </li>
          <li>
            <span>{copy.pages.route.stepTwo}</span>
            <strong>{memory.signatureDishes[0]}</strong>
            <em>{copy.pages.route.stepTwoHint} {memory.queueRisk}</em>
          </li>
          <li>
            <span>{copy.pages.route.stepThree}</span>
            <strong>{nextBest ? nextBest.shopName : copy.pages.route.returnFeed}</strong>
            <em>{nextBest ? `${nextBest.routeSummary} · ${nextBest.signatureDishes[0]}` : copy.pages.route.returnFeedHint}</em>
          </li>
        </ol>
      </div>
      <button className="routeIntentBtn" onClick={onRouteIntent}>{copy.pages.route.routeButton}</button>
    </div>
  );
}

function ProofPage({
  memory,
  candidates,
  onOpenSourceVideo
}: {
  memory: SavedFoodMemory;
  candidates: SavedFoodMemory[];
  onOpenSourceVideo: (memory: SavedFoodMemory) => void;
}) {
  return (
    <div className="proofPage">
      <div className="sectionEyebrow">{copy.pages.proof.eyebrow}</div>
      <div className="proofCards">
        {candidates.slice(0, 3).map(item => (
          <button key={item.memoryId} className="proofCard" onClick={() => onOpenSourceVideo(item)}>
            <AssetBlock assetId={item.sourceCoverAssetId} label={item.category} className="proofThumb" />
            <div>
              <strong>{item.sourceTitle}</strong>
              <span>{item.creatorName} · {item.savedDaysAgo} 天前收藏</span>
            </div>
          </button>
        ))}
      </div>
      <div className="quoteBox">
        <p>“{memory.commentProof}”</p>
        <span>{copy.pages.proof.commentSource}</span>
      </div>
      <div className="quoteBox muted">
        <p>“{memory.creatorQuote}”</p>
        <span>{copy.pages.proof.creatorSource}</span>
      </div>
    </div>
  );
}

function ReasonSheet({ context, onClose }: { context: CurrentContext; onClose: () => void }) {
  return (
    <div className="sheetScrim" onClick={onClose}>
      <div className="plainSheet" onClick={event => event.stopPropagation()}>
        <div className="sheetHandle" />
        <h3>{copy.reasonSheet.title}</h3>
        <ul>
          {copy.reasonSheet.items.map(item => (
            <li key={item}>{formatCopy(item, { area: context.areaName })}</li>
          ))}
        </ul>
        <button onClick={onClose}>{copy.buttons.gotIt}</button>
      </div>
    </div>
  );
}

function ShopSheet({
  memory,
  onClose,
  onBuyDeal
}: {
  memory: SavedFoodMemory;
  onClose: () => void;
  onBuyDeal: () => void;
}) {
  const shopOffers = [
    ...(memory.dealAvailable && memory.dealText
      ? [{
        label: '券',
        title: memory.dealText,
        desc: '到店前可先锁券，适合现在出发'
      }]
      : []),
    {
      label: '套餐',
      title: `${memory.signatureDishes[0]} 单人餐`,
      desc: `约 ¥${memory.pricePerPerson} / 人 · ${memory.openUntil} 前可用`
    },
    {
      label: '推荐',
      title: memory.signatureDishes.join(' + '),
      desc: memory.reason
    }
  ];

  return (
    <div className="sheetScrim" onClick={onClose}>
      <div className="plainSheet shopSheet" onClick={event => event.stopPropagation()}>
        <div className="sheetHandle" />
        <div className="sheetTopline">
          <span>打开店铺</span>
          <button onClick={onClose} aria-label="关闭">×</button>
        </div>

        <section className="shopPurchaseHero">
          <AssetBlock assetId={memory.shopAssetId} label={memory.shopName} className="shopHero" />
          <div className="shopPurchaseCopy">
            <h3>{memory.shopName}</h3>
            <div className="shopFacts">
              <span>{memory.category}</span>
              <span>{memory.businessArea}</span>
              <span>营业到 {memory.openUntil}</span>
            </div>
            <p>{memory.routeSummary} · 人均 ¥{memory.pricePerPerson}</p>
          </div>
        </section>

        <button className="buyDealBtn" onClick={onBuyDeal}>马上购券</button>

        <section className="offerList">
          <div className="sectionLabel">券与套餐</div>
          {shopOffers.map(offer => (
            <div className="offerItem" key={`${offer.label}-${offer.title}`}>
              <span>{offer.label}</span>
              <div>
                <strong>{offer.title}</strong>
                <em>{offer.desc}</em>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function FeedbackSheet({
  onClose,
  onFeedback
}: {
  onClose: () => void;
  onFeedback: (type: NegativeFeedbackType) => void;
}) {
  const items: Array<{ type: NegativeFeedbackType; label: string }> = [
    { type: 'not_today', label: copy.feedback.items.not_today },
    { type: 'too_far', label: copy.feedback.items.too_far },
    { type: 'already_visited', label: copy.feedback.items.already_visited },
    { type: 'pause_session', label: copy.feedback.items.pause_session },
    { type: 'wrong_saved_shop', label: copy.feedback.items.wrong_saved_shop },
    { type: 'close_biteback', label: copy.feedback.items.close_biteback }
  ];

  return (
    <div className="sheetScrim" onClick={onClose}>
      <div className="plainSheet feedbackSheet" onClick={event => event.stopPropagation()}>
        <div className="sheetHandle" />
        <h3>{copy.feedback.title}</h3>
        {items.map(item => (
          <button key={item.type} onClick={() => onFeedback(item.type)}>{item.label}</button>
        ))}
      </div>
    </div>
  );
}

const deckStyles = `
  .biteDeck {
    position: absolute;
    inset: 0;
    color: #fff;
    overflow: hidden;
    background: #0a0a08;
    font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
    touch-action: pan-y;
    user-select: none;
  }
  .deckBackground {
    position: absolute;
    inset: 0;
    transform: scale(1.04);
  }
  .deckShade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 28%, rgba(0,0,0,0.78) 100%),
      linear-gradient(155deg, rgba(41,88,61,0.72), rgba(93,35,27,0.64));
  }
  .deckHeader {
    position: absolute;
    top: 108px;
    left: 20px;
    right: 20px;
    z-index: 4;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .deckTitle {
    font-size: 28px;
    line-height: 1.08;
    font-weight: 900;
    max-width: 276px;
    white-space: pre-line;
    text-shadow: 0 2px 8px rgba(0,0,0,0.42);
  }
  .deckSubtitle {
    margin-top: 7px;
    color: rgba(255,255,255,0.78);
    font-size: 13px;
    font-weight: 600;
  }
  .aiChip {
    height: 28px;
    min-width: 54px;
    padding: 0 9px;
    border: 1px solid rgba(255,255,255,0.34);
    color: rgba(255,255,255,0.86);
    background: rgba(0,0,0,0.22);
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
  }
  .deckBody {
    position: absolute;
    left: 18px;
    right: 18px;
    top: 218px;
    bottom: 202px;
    z-index: 4;
    overflow: hidden;
  }
  .deckTrack {
    display: flex;
    height: 100%;
    transition: transform 0.3s cubic-bezier(0.2, 0.82, 0.2, 1);
    will-change: transform;
  }
  .deckSlide {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    min-width: 0;
  }
  .nearbyPage, .actionPage, .routePage, .proofPage {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
  }
  .routePage {
    gap: 6px;
  }
  .factRail {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr 0.9fr;
    gap: 1px;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.08);
  }
  .factRail div {
    padding: 9px 10px;
    background: rgba(0,0,0,0.22);
  }
  .factRail span, .routeStats span, .certaintyGrid span {
    display: block;
    color: rgba(255,255,255,0.56);
    font-size: 11px;
    margin-bottom: 4px;
  }
  .factRail strong {
    font-size: 15px;
    line-height: 1.15;
  }
  .collagePanel {
    display: grid;
    grid-template-columns: 1.55fr 0.78fr;
    gap: 8px;
    height: clamp(154px, 22vh, 188px);
    min-height: 0;
  }
  .heroFood, .miniFood {
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .heroFood {
    min-height: 0;
    height: 100%;
  }
  .heroOverlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 38px 11px 10px;
    background: linear-gradient(to top, rgba(0,0,0,0.78), transparent);
  }
  .shopName {
    font-size: 17px;
    font-weight: 900;
    line-height: 1.16;
  }
  .shopMeta {
    margin-top: 5px;
    font-size: 11px;
    color: rgba(255,255,255,0.78);
  }
  .miniFoodGrid {
    display: grid;
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 8px;
    min-height: 0;
  }
  .miniFood {
    position: relative;
    padding: 0;
    border: 0;
    overflow: hidden;
    background: transparent;
    color: #fff;
    cursor: pointer;
    min-height: 0;
  }
  .miniFood span {
    position: absolute;
    right: 8px;
    top: 8px;
    padding: 3px 6px;
    border-radius: 6px;
    background: rgba(0,0,0,0.48);
    font-size: 11px;
    font-weight: 800;
  }
  .candidateStrip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 7px;
  }
  .candidateTile {
    min-height: 50px;
    padding: 7px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(0,0,0,0.24);
    color: #fff;
    text-align: left;
    cursor: pointer;
  }
  .candidateTile.active {
    border-color: rgba(255,255,255,0.62);
    background: rgba(255,255,255,0.12);
  }
  .candidateTile span {
    display: block;
    height: 25px;
    overflow: hidden;
    font-size: 11px;
    line-height: 1.16;
    font-weight: 800;
  }
  .candidateTile strong {
    display: block;
    margin-top: 4px;
    font-size: 11px;
    color: rgba(255,255,255,0.68);
  }
  .reasonLine {
    width: 100%;
    min-height: 34px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 7px 9px;
    background: rgba(0,0,0,0.22);
    color: rgba(255,255,255,0.82);
    font-size: 12px;
    line-height: 1.35;
    text-align: left;
    cursor: pointer;
  }
  .sectionEyebrow {
    color: rgba(255,255,255,0.64);
    font-size: 13px;
    font-weight: 800;
  }
  .actionPage h2 {
    margin: 0;
    font-size: 23px;
    line-height: 1.12;
  }
  .actionPage p, .routeCopy {
    margin: 0;
    color: rgba(255,255,255,0.76);
    font-size: 14px;
    line-height: 1.42;
  }
  .actionHeroBtn, .routeIntentBtn {
    height: 44px;
    border: 0;
    border-radius: 8px;
    color: #fff;
    background: #fe2c55;
    font-size: 17px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 10px 26px rgba(254,44,85,0.28);
  }
  .actionGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: auto;
  }
  .actionGrid button {
    min-height: 60px;
    padding: 9px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.08);
    color: #fff;
    text-align: left;
    cursor: pointer;
  }
  .actionGrid span {
    display: block;
    font-size: 15px;
    font-weight: 900;
    margin-bottom: 6px;
  }
  .actionGrid strong {
    display: block;
    font-size: 11px;
    color: rgba(255,255,255,0.58);
    line-height: 1.25;
  }
  .weakDeal, .dealStrip {
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 9px 10px;
    background: rgba(0,0,0,0.22);
    color: rgba(255,255,255,0.8);
    font-size: 12px;
  }
  .routeStats, .certaintyGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 7px;
  }
  .routeStats div, .certaintyGrid div {
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(0,0,0,0.24);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .routeStats strong, .certaintyGrid strong {
    font-size: 15px;
  }
  .deckRouteCard, .routeCard {
    min-height: 98px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .routePlanCard {
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(0,0,0,0.24);
    padding: 8px;
  }
  .routePlanHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }
  .routePlanHeader span {
    color: rgba(255,255,255,0.56);
    font-size: 12px;
    font-weight: 800;
  }
  .routePlanHeader strong {
    font-size: 16px;
  }
  .routeSteps {
    list-style: none;
    display: grid;
    gap: 5px;
    margin: 0;
    padding: 0;
  }
  .routeSteps li {
    position: relative;
    min-height: 40px;
    padding: 6px 8px 6px 40px;
    border-radius: 8px;
    background: rgba(255,255,255,0.07);
    overflow: hidden;
  }
  .routeSteps li::before {
    content: counter(list-item);
    position: absolute;
    left: 9px;
    top: 8px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(254,44,85,0.9);
    color: #fff;
    font-size: 12px;
    font-weight: 900;
  }
  .routeSteps span, .routeSteps em {
    display: block;
    color: rgba(255,255,255,0.58);
    font-size: 11px;
    font-style: normal;
    line-height: 1.3;
  }
  .routeSteps strong {
    display: block;
    margin: 2px 0;
    font-size: 14px;
    line-height: 1.22;
  }
  .routePage .routeIntentBtn {
    height: 34px;
    font-size: 15px;
    box-shadow: 0 8px 18px rgba(254,44,85,0.2);
  }
  .deckRouteSvg, .routeSvg {
    position: absolute;
    inset: 12px 16px;
    width: calc(100% - 32px);
    height: calc(100% - 24px);
  }
  .nextBest {
    display: grid;
    grid-template-columns: 58px 1fr;
    gap: 3px 9px;
    padding: 9px 10px;
    border-radius: 8px;
    background: rgba(0,0,0,0.24);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .nextBest span {
    grid-row: span 2;
    color: rgba(255,255,255,0.52);
    font-size: 12px;
  }
  .nextBest strong {
    font-size: 14px;
  }
  .nextBest em {
    font-style: normal;
    color: rgba(255,255,255,0.62);
    font-size: 12px;
  }
  .proofCards {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .proofCard {
    display: grid;
    grid-template-columns: 58px 1fr;
    gap: 9px;
    height: 61px;
    padding: 7px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.11);
    background: rgba(0,0,0,0.22);
    color: #fff;
    text-align: left;
    cursor: pointer;
  }
  .proofThumb {
    border-radius: 6px;
    width: 58px;
    height: 47px;
  }
  .proofCard strong {
    display: block;
    font-size: 12px;
    line-height: 1.28;
    max-height: 31px;
    overflow: hidden;
  }
  .proofCard span {
    display: block;
    margin-top: 5px;
    color: rgba(255,255,255,0.58);
    font-size: 11px;
  }
  .quoteBox {
    padding: 8px 9px;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .quoteBox p {
    margin: 0 0 6px;
    font-size: 12px;
    line-height: 1.32;
  }
  .quoteBox span {
    font-size: 11px;
    color: rgba(255,255,255,0.54);
  }
  .quoteBox.muted {
    opacity: 0.82;
  }
  .deckBottom {
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 112px;
    z-index: 5;
  }
  .pageBars {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    margin-bottom: 10px;
  }
  .pageBar {
    height: 4px;
    border: 0;
    border-radius: 3px;
    background: rgba(255,255,255,0.22);
    cursor: pointer;
  }
  .pageBar.active {
    background: rgba(255,255,255,0.76);
  }
  .bottomActions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .bottomActions button {
    height: 44px;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 900;
    cursor: pointer;
  }
  .quietBtn {
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.62);
    background: rgba(255,255,255,0.1);
  }
  .primaryBtn {
    border: 0;
    color: #fff;
    background: #fe2c55;
  }
  .continueHint {
    margin-top: 7px;
    text-align: center;
    color: rgba(255,255,255,0.58);
    font-size: 13px;
    font-weight: 800;
  }
  .sheetScrim {
    position: absolute;
    inset: 0;
    z-index: 120;
    background: rgba(0,0,0,0.58);
    display: flex;
    align-items: flex-end;
    padding: 10px 10px 94px;
  }
  .startSheet, .plainSheet {
    width: 100%;
    max-height: 590px;
    overflow-y: auto;
    scrollbar-width: none;
    border-radius: 8px 8px 0 0;
    background: #141414;
    border: 1px solid rgba(255,255,255,0.12);
    padding: 10px;
    box-shadow: 0 -18px 36px rgba(0,0,0,0.44);
  }
  .startSheet, .shopSheet {
    min-height: 590px;
  }
  .startSheet::-webkit-scrollbar, .plainSheet::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .sheetHandle {
    width: 42px;
    height: 4px;
    border-radius: 4px;
    background: rgba(255,255,255,0.28);
    margin: 0 auto 10px;
  }
  .sheetTopline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 900;
  }
  .sheetTopline button {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 6px;
    background: rgba(255,255,255,0.08);
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }
  .shopSummary {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  .sheetShopName {
    font-size: 20px;
    line-height: 1.18;
    font-weight: 900;
  }
  .sheetDish, .routeHint {
    margin-top: 5px;
    font-size: 12px;
    color: rgba(255,255,255,0.62);
    line-height: 1.35;
  }
  .openPill {
    flex: 0 0 auto;
    padding: 5px 7px;
    border-radius: 6px;
    background: rgba(61,172,101,0.18);
    color: #bff3cd;
    font-size: 11px;
    font-weight: 800;
  }
  .reachabilityHero {
    padding: 12px;
    border-radius: 8px;
    background: rgba(254,44,85,0.13);
    border: 1px solid rgba(254,44,85,0.28);
    margin-bottom: 8px;
  }
  .distanceLine {
    font-size: 23px;
    line-height: 1.12;
    font-weight: 900;
  }
  .routeCard {
    height: 126px;
    margin-bottom: 8px;
  }
  .routeLabels {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: rgba(255,255,255,0.78);
    font-weight: 800;
  }
  .proofBlock {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.06);
    margin-top: 8px;
  }
  .sectionLabel {
    color: rgba(255,255,255,0.56);
    font-size: 11px;
    font-weight: 800;
    margin-bottom: 7px;
  }
  .proofBlock p {
    margin: 0 0 6px;
    font-size: 13px;
    line-height: 1.35;
  }
  .creatorQuote {
    color: rgba(255,255,255,0.68);
  }
  .dealStrip {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 8px;
  }
  .dealStrip strong {
    color: #ffccd6;
  }
  .sheetActions {
    position: sticky;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 7px;
    margin-top: 10px;
    padding-top: 8px;
    background: #141414;
  }
  .sheetActions button, .plainSheet > button {
    min-height: 40px;
    border: 0;
    border-radius: 8px;
    color: #fff;
    background: rgba(255,255,255,0.1);
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
  }
  .plainSheet h3 {
    margin: 0 0 12px;
    font-size: 20px;
  }
  .plainSheet ul {
    margin: 0 0 14px;
    padding-left: 18px;
    color: rgba(255,255,255,0.78);
    line-height: 1.7;
    font-size: 14px;
  }
  .shopPurchaseHero {
    display: grid;
    grid-template-columns: 112px 1fr;
    gap: 10px;
    align-items: stretch;
    margin-bottom: 10px;
  }
  .shopHero {
    height: 112px;
    border-radius: 8px;
  }
  .shopPurchaseCopy {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .shopPurchaseCopy h3 {
    margin: 0 0 8px;
    font-size: 20px;
    line-height: 1.16;
  }
  .shopFacts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .shopFacts span {
    padding: 5px 7px;
    border-radius: 6px;
    background: rgba(255,255,255,0.08);
    font-size: 11px;
    color: rgba(255,255,255,0.7);
  }
  .plainSheet p {
    margin: 0 0 10px;
    color: rgba(255,255,255,0.76);
    line-height: 1.45;
    font-size: 14px;
  }
  .buyDealBtn {
    width: 100%;
    height: 46px;
    border: 0;
    border-radius: 8px;
    color: #fff;
    background: #fe2c55;
    font-size: 17px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 10px 26px rgba(254,44,85,0.28);
    margin-bottom: 10px;
  }
  .offerList {
    display: grid;
    gap: 8px;
  }
  .offerItem {
    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 9px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.07);
  }
  .offerItem > span {
    width: 42px;
    height: 24px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    background: rgba(254,44,85,0.16);
    color: #ffccd6;
    font-size: 12px;
    font-weight: 900;
  }
  .offerItem strong {
    display: block;
    font-size: 14px;
    line-height: 1.25;
  }
  .offerItem em {
    display: block;
    margin-top: 4px;
    color: rgba(255,255,255,0.6);
    font-size: 12px;
    line-height: 1.35;
    font-style: normal;
  }
  .feedbackSheet button {
    width: 100%;
    margin-bottom: 6px;
    text-align: center;
  }
  .deckToast {
    position: absolute;
    z-index: 160;
    left: 50%;
    top: 47%;
    transform: translate(-50%, -50%);
    padding: 10px 18px;
    border-radius: 8px;
    background: rgba(0,0,0,0.82);
    border: 1px solid rgba(255,255,255,0.12);
    font-size: 13px;
    font-weight: 800;
    color: #fff;
    pointer-events: none;
  }
`;
