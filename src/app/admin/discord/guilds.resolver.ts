import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Guild } from './models/guild';
import { DiscordService } from './discord.service';

@Injectable({
  providedIn: 'root',
})
export class GuildsResolver {
  constructor(private readonly discordService: DiscordService) {}

  resolve(): Observable<Guild[]> {
    return this.discordService.fetchGuilds();
  }
}
