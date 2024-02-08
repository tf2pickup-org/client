import { environment } from '@environment';

interface MapThumbnailUrlParams {
  width: number;
  height: number;
}

export function getMapThumbnailUrls(
  map: string,
  { width, height }: MapThumbnailUrlParams = { width: 300, height: 169 },
): string[] {
  const mapName = map.match(/^([a-z]+_[a-zA-Z0-9]+)/)?.[0] ?? 'unknown';
  return [map, mapName].map(
    mapName =>
      `${environment.mapThumbnailServiceUrl}/unsafe/${width}x${height}/${mapName}.jpg`,
  );
}
