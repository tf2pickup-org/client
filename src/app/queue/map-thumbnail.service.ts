import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapThumbnailService {

  getMapThumbnail(map: string) {
    switch (map) {
      case 'cp_badlands':
      case 'cp_prolands_rc2t':
        return 'badlands';

      case 'cp_granary':
      case 'cp_granary_pro_rc8':
        return 'granary';

      case 'cp_gullywash_final1':
        return 'gullywash';

      case 'cp_process_final':
        return 'process';

      case 'cp_reckoner_rc2':
        return 'reckoner';

      case 'cp_snakewater_final1':
        return 'snakewater';

      case 'cp_sunshine':
        return 'sunshine';

      default:
        return 'unknown';
    }
  }

  getMapThumbnailPath(map: string) {
    const thumbnail = this.getMapThumbnail(map);
    return `/assets/map-thumbnails/${thumbnail}.png`;
  }

}
