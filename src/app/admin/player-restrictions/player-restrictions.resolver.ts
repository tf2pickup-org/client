import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { DenyPlayersWithNoSkillAssigned } from '@app/configuration/models/deny-players-with-no-skill-assigned';
import { Etf2lAccountRequired } from '@app/configuration/models/etf2l-account-required';
import { MinimumTf2InGameHours } from '@app/configuration/models/minimum-tf2-in-game-hours';
import { map, Observable, zip } from 'rxjs';
import { PlayerRestrictions } from './player-restrictions';

@Injectable({
  providedIn: 'root',
})
export class PlayerRestrictionsResolver implements Resolve<PlayerRestrictions> {
  constructor(private readonly configurationService: ConfigurationService) {}

  resolve(): Observable<PlayerRestrictions> {
    return zip(
      this.configurationService
        .fetchValue<Etf2lAccountRequired>(
          ConfigurationEntryKey.etf2lAccountRequired,
        )
        .pipe(map(entry => entry.value)),
      this.configurationService
        .fetchValue<MinimumTf2InGameHours>(
          ConfigurationEntryKey.minimumTf2InGameHours,
        )
        .pipe(map(entry => entry.value)),
      this.configurationService
        .fetchValue<DenyPlayersWithNoSkillAssigned>(
          ConfigurationEntryKey.denyPlayersWithNoSkillAssigned,
        )
        .pipe(map(entry => entry.value)),
    ).pipe(
      map(
        ([
          etf2lAccountRequired,
          minimumTf2InGameHours,
          denyPlayersWithNoSkillAssigned,
        ]) => ({
          etf2lAccountRequired,
          minimumTf2InGameHours,
          denyPlayersWithNoSkillAssigned,
        }),
      ),
    );
  }
}
