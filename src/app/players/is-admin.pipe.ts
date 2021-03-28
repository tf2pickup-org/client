import { Pipe, PipeTransform } from '@angular/core';
import { Player } from './models/player';

@Pipe({
  name: 'isAdmin'
})
export class IsAdminPipe implements PipeTransform {

  transform(player: Player): boolean {
    return player?.roles.includes('admin');
  }

}
