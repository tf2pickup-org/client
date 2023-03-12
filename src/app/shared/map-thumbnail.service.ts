import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapThumbnailService {
  private mapMatchers: { regex: RegExp; thumbnailName: string }[] = [
    { regex: /cp_(?<prefix>bad|pro)lands/, thumbnailName: 'badlands' },
    { regex: /cp_granary/, thumbnailName: 'granary' },
    { regex: /cp_gullywash/, thumbnailName: 'gullywash' },
    { regex: /cp_process/, thumbnailName: 'process' },
    { regex: /cp_reckoner/, thumbnailName: 'reckoner' },
    { regex: /cp_snakewater/, thumbnailName: 'snakewater' },
    { regex: /cp_sunshine/, thumbnailName: 'sunshine' },
    { regex: /pl_barnblitz/, thumbnailName: 'barnblitz' },
    { regex: /pl_borneo/, thumbnailName: 'borneo' },
    { regex: /koth_coalplant/, thumbnailName: 'coalplant' },
    { regex: /koth_product/, thumbnailName: 'product' },
    { regex: /cp_propaganda/, thumbnailName: 'propaganda' },
    { regex: /pl_(?<prefix>bad|pro)water/, thumbnailName: 'prowater' },
    { regex: /pl_swiftwater/, thumbnailName: 'swiftwater' },
    { regex: /pl_upward/, thumbnailName: 'upward' },
    { regex: /pl_vigil/, thumbnailName: 'vigil' },
    { regex: /koth_warmtic/, thumbnailName: 'warmtic' },
    { regex: /koth_clearcut/, thumbnailName: 'clearcut' },
    { regex: /cp_villa/, thumbnailName: 'villa' },
    { regex: /koth_bagel/, thumbnailName: 'bagel' },
    { regex: /cp_metalworks/, thumbnailName: 'metalworks' },
    { regex: /koth_lakeside/, thumbnailName: 'lakeside' },
    { regex: /pl_summercoast/, thumbnailName: 'summercoast' },
    { regex: /cp_logjam/, thumbnailName: 'logjam' },
    { regex: /koth_ashville/, thumbnailName: 'ashville' },
    { regex: /cp_cardinal/, thumbnailName: 'cardinal' },
    { regex: /cp_kalinka/, thumbnailName: 'kalinka' },
    { regex: /cp_mannbase/, thumbnailName: 'mannbase' },
    { regex: /koth_proplant/, thumbnailName: 'proplant' },
    { regex: /bball_tf_v2/, thumbnailName: 'bball_tf_v2' },
    { regex: /ctf_ballin_comptf/, thumbnailName: 'ballin_comptf' },
    { regex: /ctf_ballin_sky/, thumbnailName: 'ballin_sky' },
    { regex: /ctf_bball_eu/, thumbnailName: 'bball_eu' },
    { regex: /ctf_bball_sweethills/, thumbnailName: 'bball_sweethills' },
    { regex: /koth_cascade/, thumbnailName: 'cascade' },
    { regex: /koth_ramjam/, thumbnailName: 'ramjam' },
    { regex: /ultiduo_badlands/, thumbnailName: 'badlands' },
    { regex: /ultiduo_baloo/, thumbnailName: 'baloo' },
    { regex: /ultiduo_canal/, thumbnailName: 'canal' },
    { regex: /ultiduo_grove/, thumbnailName: 'grove' },
    { regex: /ultiduo_gullywash/, thumbnailName: 'gullywash' },
    { regex: /ultiduo_lookout/, thumbnailName: 'lookout' },
    { regex: /koth_ultiduo/, thumbnailName: 'ultiduo' },
    { regex: /ultiduo_seclusion/, thumbnailName: 'seclusion' },
    { regex: /cp_steel/, thumbnailName: 'steel' },
    { regex: /koth_proot/, thumbnailName: 'proot' },
    { regex: /pl_problitz/, thumbnailName: 'problitz' },
    { regex: /pl_divulgence/, thumbnailName: 'divulgence' },
    { regex: /cp_caldera/, thumbnailName: 'caldera' },
    { regex: /cp_croissant/, thumbnailName: 'croissant' },
    { regex: /pl_cornwater/, thumbnailName: 'cornwater' },
    { regex: /pl_eruption/, thumbnailName: 'eruption' },
  ];

  getMapThumbnail(map: string) {
    return (
      this.mapMatchers.find(m => m.regex.test(map))?.thumbnailName || 'unknown'
    );
  }

  getMapThumbnailPath(map: string) {
    const thumbnail = this.getMapThumbnail(map);
    return `/assets/map-thumbnails/${thumbnail}.png`;
  }
}
