import { Pipe, PipeTransform } from '@angular/core';
import { Player } from './models/player';
import { PlayerRole } from './models/player-role';

@Pipe({
  name: 'hasBadge'
})
export class HasBadgePipe implements PipeTransform {

  transform(player: Player): boolean {
    return !!player && (['admin', 'super user'] as PlayerRole[]).some(role => player.roles.includes(role));
  }

}
