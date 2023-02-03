import { Injectable } from '@angular/core';
import { environment } from '@environment';

interface MapThumbnailUrlParams {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root',
})
export class MapThumbnailService {
  // skipcq: JS-0105
  getMapThumbnailUrl(
    map: string,
    { width, height }: MapThumbnailUrlParams = { width: 300, height: 169 },
  ) {
    const mapName = map.match(/^([a-z]+_[a-zA-Z0-9]+)/)?.[0] ?? 'unknown';
    return `${environment.mapThumbnailServiceUrl}/unsafe/${width}x${height}/${mapName}.jpg`;
  }
}
