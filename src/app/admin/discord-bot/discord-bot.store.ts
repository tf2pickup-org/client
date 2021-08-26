import { Injectable } from '@angular/core';
import { GuildInfo } from '@app/admin/models/guild-info';
import { ComponentStore } from '@ngrx/component-store';
import { DiscordService } from '@app/admin/discord.service';

interface DiscordBotState {
  availableGuilds: GuildInfo[];
}

@Injectable()
export class DiscordBotStore extends ComponentStore<DiscordBotState> {
  constructor(private discordService: DiscordService) {
    super({
      availableGuilds: [],
    });
  }
}
