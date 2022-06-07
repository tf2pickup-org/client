import { Pipe, PipeTransform } from '@angular/core';
import { GameSlot } from '../models/game-slot';
import { Tf2Team } from '../models/tf2-team';

@Pipe({ name: 'playersInTeam' })
export class PlayersInTeamPipe implements PipeTransform {
  transform(slots: GameSlot[], team: Tf2Team): GameSlot[] {
    return slots.filter(s => s.team === team);
  }
}
