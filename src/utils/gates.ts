import type {
  BiteBackGateStatus,
  CurrentContext,
  FeedState,
  SavedFoodMemory,
  UserProfile
} from '../types';

export function isQualifiedMemory(memory: SavedFoodMemory): boolean {
  return ['S', 'A', 'B'].includes(memory.memoryLevel) && memory.poiConfidence >= 0.85;
}

export function passMemoryGate(memories: SavedFoodMemory[]): boolean {
  return memories.some(isQualifiedMemory);
}

export function passContextGate(context: CurrentContext): boolean {
  return context.isMealTime && context.isOuting && context.isStationary;
}

export function passProximityGate(memories: SavedFoodMemory[]): boolean {
  return memories.filter(memory =>
    memory.distanceM <= 3000 &&
    memory.walkMinutes <= 20 &&
    memory.isOpen
  ).length >= 1;
}

export function passFeedGate(feedState: FeedState): boolean {
  return (
    feedState.normalVideosConsumed >= 2 &&
    !feedState.fastSwiping &&
    !feedState.deepWatching &&
    !feedState.recentCommercialComponent
  );
}

export function passQualityGate(memory: SavedFoodMemory): boolean {
  return memory.poiConfidence >= 0.85 && memory.shopQuality >= 0.75 && memory.isOpen;
}

export function passFrequencyPrivacyGate(user: UserProfile, memory: SavedFoodMemory): boolean {
  return (
    user.locationAuthorized &&
    user.biteBackExposureToday < 1 &&
    !user.closedBiteBack &&
    !user.negativeFeedbackTags.includes(memory.poiId)
  );
}

export function getContextFit(memory: SavedFoodMemory, context: CurrentContext): number {
  let score = 0;
  if (context.isMealTime) score += 0.32;
  if (context.isOuting) score += 0.22;
  if (context.isStationary) score += 0.16;
  if (memory.businessArea.includes(context.areaName.split('/')[0].trim())) score += 0.14;
  if (context.recentFoodSearch) {
    const query = context.recentFoodSearch;
    if (query.includes(memory.category) || memory.signatureDishes.some(dish => query.includes(dish))) {
      score += 0.16;
    }
  }
  return Math.min(score, 1);
}

export function getDiversityFit(memory: SavedFoodMemory, memories: SavedFoodMemory[]): number {
  const sameCategoryCount = memories.filter(item => item.category === memory.category).length;
  return sameCategoryCount <= 1 ? 1 : 0.62;
}

export function rankSavedMemory(
  memory: SavedFoodMemory,
  context: CurrentContext,
  memories: SavedFoodMemory[]
): number {
  const proximityFit = Math.max(0, 1 - memory.distanceM / 3000);
  const actionability = memory.isOpen ? 1 : 0;
  const contextFit = getContextFit(memory, context);
  const diversityFit = getDiversityFit(memory, memories);

  return (
    memory.memoryStrength * 0.28 +
    contextFit * 0.2 +
    proximityFit * 0.18 +
    memory.poiConfidence * 0.12 +
    memory.shopQuality * 0.1 +
    diversityFit * 0.07 +
    actionability * 0.05
  );
}

export function getDisplayableMemories(
  memories: SavedFoodMemory[],
  context: CurrentContext,
  user: UserProfile
): SavedFoodMemory[] {
  return memories
    .filter(memory =>
      isQualifiedMemory(memory) &&
      memory.distanceM <= 3000 &&
      memory.walkMinutes <= 20 &&
      passQualityGate(memory) &&
      passFrequencyPrivacyGate(user, memory)
    )
    .map(memory => ({
      memory,
      score: rankSavedMemory(memory, context, memories)
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.memory);
}

export function selectBiteBackCandidates(
  memories: SavedFoodMemory[],
  context: CurrentContext,
  user: UserProfile
): SavedFoodMemory[] {
  const displayable = getDisplayableMemories(memories, context, user);
  const selected: SavedFoodMemory[] = [];
  const seenCategories = new Set<string>();

  for (const memory of displayable) {
    if (selected.length === 0 || !seenCategories.has(memory.category)) {
      selected.push(memory);
      seenCategories.add(memory.category);
    }
    if (selected.length >= 3) return selected;
  }

  for (const memory of displayable) {
    if (!selected.some(item => item.memoryId === memory.memoryId)) {
      selected.push(memory);
    }
    if (selected.length >= 3) break;
  }

  return selected;
}

export function getGateStatus(
  user: UserProfile,
  context: CurrentContext,
  memories: SavedFoodMemory[],
  feedState: FeedState,
  candidates: SavedFoodMemory[]
): BiteBackGateStatus {
  const primary = candidates[0] ?? null;

  return {
    memory: passMemoryGate(memories),
    context: passContextGate(context),
    proximity: passProximityGate(memories),
    feed: passFeedGate(feedState),
    quality: primary ? passQualityGate(primary) : false,
    frequencyPrivacy: primary ? passFrequencyPrivacyGate(user, primary) : user.locationAuthorized && !user.closedBiteBack
  };
}

export function allGatesPassed(status: BiteBackGateStatus): boolean {
  return Object.values(status).every(Boolean);
}

export function getFirstFailedGate(status: BiteBackGateStatus): string | null {
  if (!status.memory) return 'Memory Gate';
  if (!status.context) return 'Context Gate';
  if (!status.proximity) return 'Proximity Gate';
  if (!status.feed) return 'Feed Gate';
  if (!status.quality) return 'Quality Gate';
  if (!status.frequencyPrivacy) return 'Frequency & Privacy Gate';
  return null;
}
