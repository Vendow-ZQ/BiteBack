import type {
  UserProfile,
  SearchSession,
  FoodMemory,
  FeedState,
  GateStatus
} from '../types';

// 检查是否为合格的 Memory（S/A/B 级）
export function isQualifiedMemory(memory: FoodMemory): boolean {
  return (
    ['S', 'A', 'B'].includes(memory.memoryLevel) &&
    memory.poiConfidence >= 0.85
  );
}

// Gate 1: Eligibility Gate
export function passEligibilityGate(
  user: UserProfile,
  search: SearchSession,
  memories: FoodMemory[]
): boolean {
  const within15m = search.returnedToFeedAt - search.searchedAt <= 15 * 60 * 1000;
  const foodIntent = search.queryIntent === 'food_decision';
  const noSearchConversion =
    !search.completedPoiAction &&
    !search.completedDealAction &&
    !search.completedRouteAction;
  const hasQualifiedMemory = memories.some(isQualifiedMemory);

  return (
    within15m &&
    foodIntent &&
    noSearchConversion &&
    user.locationAuthorized &&
    user.biteBackExposureToday < 1 &&
    !user.closedBiteBack &&
    hasQualifiedMemory
  );
}

// Gate 2: Attribution Gate
export function passAttributionGate(search: SearchSession): boolean {
  return (
    !search.completedPoiAction &&
    !search.completedDealAction &&
    !search.completedRouteAction
  );
}

// Gate 3: Feed Guardrail Gate
export function passFeedGuardrailGate(feedState: FeedState): boolean {
  return (
    feedState.normalVideosConsumed >= 2 &&
    !feedState.fastSwiping &&
    !feedState.deepWatching &&
    !feedState.recentCommercialComponent &&
    !feedState.recentPrivacyNegative
  );
}

// Gate 4: Quality Gate
export function passQualityGate(memory: FoodMemory): boolean {
  return (
    memory.poiConfidence >= 0.85 &&
    memory.isOpen &&
    memory.shopQuality >= 0.75 &&
    memory.distanceM <= 3000
  );
}

// Gate 5: Frequency Gate
export function passFrequencyGate(user: UserProfile, memory: FoodMemory): boolean {
  return (
    user.biteBackExposureToday < 1 &&
    !user.negativeFeedbackTags.includes(memory.poiId)
  );
}

// Gate 6: Business Gate
export function passBusinessGate(memory: FoodMemory): boolean {
  return memory.shopQuality >= 0.75;
}

// 获取单个 Gate 状态详情
export function getGateStatus(
  user: UserProfile,
  search: SearchSession,
  memories: FoodMemory[],
  feedState: FeedState,
  selectedMemory: FoodMemory | null
): GateStatus {
  return {
    eligibility: passEligibilityGate(user, search, memories),
    attribution: passAttributionGate(search),
    feedGuardrail: passFeedGuardrailGate(feedState),
    quality: selectedMemory ? passQualityGate(selectedMemory) : false,
    frequency: selectedMemory ? passFrequencyGate(user, selectedMemory) : false,
    business: selectedMemory ? passBusinessGate(selectedMemory) : false
  };
}

// Query-Memory 匹配分数计算
export function getQueryMatchScore(query: string, memory: FoodMemory): number {
  let score = 0;
  const queryLower = query.toLowerCase();

  // 商圈匹配（0.4分）
  if (queryLower.includes(memory.businessArea.toLowerCase())) score += 0.4;

  // 品类匹配（0.25分）
  if (queryLower.includes('晚饭') || queryLower.includes(memory.category.toLowerCase())) {
    score += 0.25;
  }

  // 店名匹配（0.5分）- 最强
  if (queryLower.includes(memory.shopName.toLowerCase())) score += 0.5;

  // 菜品匹配（0.25分）
  if (memory.dishTags.some(tag => queryLower.includes(tag.toLowerCase()))) {
    score += 0.25;
  }

  return Math.min(score, 1);
}

// 检查是否通过 Query-Memory 匹配
export function passQueryMatch(query: string, memory: FoodMemory): boolean {
  return getQueryMatchScore(query, memory) >= 0.35;
}

// 排序分数计算
export function rankMemory(memory: FoodMemory, query: string): number {
  const queryMatchScore = getQueryMatchScore(query, memory);
  const distanceFit = Math.max(0, 1 - memory.distanceM / 3000);
  const actionability = memory.isOpen ? 1 : 0;

  return (
    memory.memoryStrength * 0.30 +
    queryMatchScore * 0.25 +
    memory.poiConfidence * 0.15 +
    distanceFit * 0.10 +
    memory.shopQuality * 0.10 +
    actionability * 0.10
  );
}

// 选择最佳 Memory
export function selectBestMemory(
  memories: FoodMemory[],
  query: string,
  user: UserProfile
): FoodMemory | null {
  const qualifiedMemories = memories
    .filter(m =>
      isQualifiedMemory(m) &&
      passQualityGate(m) &&
      passFrequencyGate(user, m) &&
      passBusinessGate(m) &&
      passQueryMatch(query, m)
    )
    .map(m => ({
      memory: m,
      score: rankMemory(m, query)
    }))
    .sort((a, b) => b.score - a.score);

  return qualifiedMemories.length > 0 ? qualifiedMemories[0].memory : null;
}

// 检查是否所有 Gate 都通过
export function allGatesPassed(status: GateStatus): boolean {
  return (
    status.eligibility &&
    status.attribution &&
    status.feedGuardrail &&
    status.quality &&
    status.frequency &&
    status.business
  );
}

// 获取第一个失败的 Gate 名称
export function getFirstFailedGate(status: GateStatus): string | null {
  if (!status.eligibility) return 'Eligibility Gate';
  if (!status.attribution) return 'Attribution Gate';
  if (!status.feedGuardrail) return 'Feed Guardrail Gate';
  if (!status.quality) return 'Quality Gate';
  if (!status.frequency) return 'Frequency Gate';
  if (!status.business) return 'Business Gate';
  return null;
}
