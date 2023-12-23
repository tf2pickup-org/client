import { Injectable } from '@angular/core';

import { ConfigurationService } from '@app/configuration/configuration.service';
import { map, Observable } from 'rxjs';
import { PlayerRestrictions } from './player-restrictions';

@Injectable({
  providedIn: 'root',
})
export class PlayerRestrictionsResolver {
  constructor(private readonly configurationService: ConfigurationService) {}

  resolve(): Observable<PlayerRestrictions> {
    return this.configurationService
      .fetchValues<[boolean, number, boolean]>(
        'players.etf2l_account_required',
        'players.minimum_in_game_hours',
        'queue.deny_players_with_no_skill_assigned',
      )
      .pipe(
        map(
          ([
            etf2lAccountRequired,
            minimumTf2InGameHours,
            denyPlayersWithNoSkillAssigned,
          ]) => ({
            etf2lAccountRequired: etf2lAccountRequired.value,
            minimumTf2InGameHours: minimumTf2InGameHours.value,
            denyPlayersWithNoSkillAssigned:
              denyPlayersWithNoSkillAssigned.value,
          }),
        ),
      );
  }
}
