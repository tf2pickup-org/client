import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Guild } from './models/guild';
import { DiscordService } from './discord.service';

@Injectable({
  providedIn: 'root',
})
export class GuildsResolver implements Resolve<Guild[]> {
  constructor(private readonly discordService: DiscordService) {}

  resolve(): Observable<Guild[]> {
    return this.discordService.fetchGuilds();
  }
}
