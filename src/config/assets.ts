const DEFAULT_ASSET_BASE_PATH = '/assets';

export const ASSET_BASE_PATH =
  (import.meta.env.VITE_ASSET_BASE_PATH as string | undefined) || DEFAULT_ASSET_BASE_PATH;

export function staticAsset(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');
  return `${ASSET_BASE_PATH.replace(/\/+$/, '')}/${normalizedPath}`;
}

export function coverAsset(fileName: string): string {
  return staticAsset(`covers/${fileName}`);
}

export function videoAsset(fileName: string): string {
  return staticAsset(`videos/${fileName}`);
}

export function foodAsset(fileName: string): string {
  return staticAsset(`food/${fileName}`);
}

export function shopAsset(fileName: string): string {
  return staticAsset(`shops/${fileName}`);
}

export function mapAsset(fileName: string): string {
  return staticAsset(`maps/${fileName}`);
}

export function avatarAsset(fileName: string): string {
  return staticAsset(`avatars/${fileName}`);
}
