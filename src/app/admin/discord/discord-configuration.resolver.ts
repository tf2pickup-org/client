import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { DiscordConfiguration } from './models/discord-configuration';
import { GuildConfiguration } from './models/guild-configuration';

@Injectable({
  providedIn: 'root',
})
export class DiscordConfigurationResolver
  implements Resolve<DiscordConfiguration>
{
  constructor(private readonly configurationService: ConfigurationService) {}

  resolve(): Observable<DiscordConfiguration> {
    return this.configurationService
      .fetchValues<[GuildConfiguration[]]>('discord.guilds')
      .pipe(
        map(([guilds]) => ({
          guilds: guilds.value,
        })),
      );
  }
}
