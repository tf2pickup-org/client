import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapThumbnailService {

  private mapMatchers: { regex: RegExp, thumbnailName: string }[] = [
    { regex: /cp_(bad|pro)lands/, thumbnailName: 'badlands' },
    { regex: /cp_granary/,        thumbnailName: 'granary' },
    { regex: /cp_gullywash/,      thumbnailName: 'gullywash' },
    { regex: /cp_process/,        thumbnailName: 'process' },
    { regex: /cp_reckoner/,       thumbnailName: 'reckoner' },
    { regex: /cp_snakewater/,     thumbnailName: 'snakewater' },
    { regex: /cp_sunshine/,       thumbnailName: 'sunshine' },
  ];

  getMapThumbnail(map: string) {
    return this.mapMatchers.find(m => m.regex.test(map))?.thumbnailName || 'unknown';
  }

  getMapThumbnailPath(map: string) {
    const thumbnail = this.getMapThumbnail(map);
    return `/assets/map-thumbnails/${thumbnail}.png`;
  }

}
