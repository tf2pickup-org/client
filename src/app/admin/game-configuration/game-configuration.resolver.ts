import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { map, Observable } from 'rxjs';
import { GameConfiguration, LogsTfUploadMethod } from './game-configuration';

@Injectable({
  providedIn: 'root',
})
export class GameConfigurationResolver implements Resolve<GameConfiguration> {
  constructor(private readonly configurationService: ConfigurationService) {}

  resolve(): Observable<GameConfiguration> {
    return this.configurationService
      .fetchValues<[string, number, number, string[], LogsTfUploadMethod]>(
        'games.whitelist_id',
        'games.join_gameserver_timeout',
        'games.rejoin_gameserver_timeout',
        'games.execute_extra_commands',
        'games.logs_tf_upload_method',
      )
      .pipe(
        map(
          ([
            whitelistId,
            joinGameServerTimeout,
            rejoinGameServerTimeout,
            executeExtraCommands,
            logsTfUploadMethod,
          ]) => ({
            whitelistId: whitelistId.value,
            joinGameServerTimeout: joinGameServerTimeout.value,
            rejoinGameServerTimeout: rejoinGameServerTimeout.value,
            executeExtraCommands: executeExtraCommands.value,
            logsTfUploadMethod: logsTfUploadMethod.value,
          }),
        ),
      );
  }
}
