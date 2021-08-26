import { Injectable } from '@angular/core';
import { GuildInfo } from '@app/admin/models/guild-info';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { DiscordService } from '@app/admin/discord.service';
import { HttpErrorResponse } from '@angular/common/http';

interface DiscordBotState {
  availableGuilds: GuildInfo[];
}

@Injectable()
export class DiscordBotStore extends ComponentStore<DiscordBotState> {
  readonly loadAvailableGuilds = this.effect(() => {
    return this.discordService.fetchGuilds().pipe(
      tapResponse(
        (guilds: GuildInfo[]) => this.setAvailableGuilds(guilds),
        (error: HttpErrorResponse) => console.error(error.message),
      ),
    );
  });

  readonly setAvailableGuilds = this.updater(
    (state, availableGuilds: GuildInfo[]): DiscordBotState => ({
      ...state,
      availableGuilds,
    }),
  );

  constructor(private discordService: DiscordService) {
    super({
      availableGuilds: [],
    });
  }
}
