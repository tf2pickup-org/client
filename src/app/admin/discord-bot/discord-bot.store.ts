import { Injectable } from '@angular/core';
import { GuildInfo } from '@app/admin/models/guild-info';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { DiscordService } from '@app/admin/discord.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TextChannelInfo } from '../models/text-channel-info';
import { produce } from 'immer';
import { RoleInfo } from '../models/role-info';

interface GuildInfoEx extends GuildInfo {
  isLoadingTextChannels: boolean;
  isLoadingRoles: boolean;
}

interface DiscordBotState {
  isSaving: boolean;
  availableGuilds: GuildInfoEx[];
}

@Injectable()
export class DiscordBotStore extends ComponentStore<DiscordBotState> {
  readonly isSaving = this.select(state => state.isSaving);
  readonly availableGuilds = this.select(state => state.availableGuilds);

  readonly loadAvailableGuilds = this.effect(() => {
    return this.discordService.fetchGuilds().pipe(
      tapResponse(
        (guilds: GuildInfo[]) => this.setAvailableGuilds(guilds),
        (error: HttpErrorResponse) => console.error(error.message),
      ),
    );
  });

  private readonly setAvailableGuilds = this.updater(
    (state, availableGuilds: GuildInfo[]): DiscordBotState => ({
      ...state,
      availableGuilds: availableGuilds.map(guildInfo => ({
        ...guildInfo,
        isLoadingRoles: false,
        isLoadingTextChannels: false,
      })),
    }),
  );

  private readonly setTextChannels = this.updater(
    (
      state,
      {
        guildId,
        textChannels,
      }: { guildId: string; textChannels: TextChannelInfo[] },
    ): DiscordBotState =>
      produce(state, draft => {
        const guild = draft.availableGuilds.find(g => g.id === guildId);
        guild.textChannels = textChannels;
      }),
  );

  private readonly setRoles = this.updater(
    (
      state,
      { guildId, roles }: { guildId: string; roles: RoleInfo[] },
    ): DiscordBotState =>
      produce(state, draft => {
        const guild = draft.availableGuilds.find(g => g.id === guildId);
        guild.roles = roles;
      }),
  );

  constructor(private discordService: DiscordService) {
    super({
      isSaving: false,
      availableGuilds: [],
    });
  }

  loadTextChannels(guildId: string) {
    this.discordService
      .fetchTextChannels(guildId)
      .pipe(
        tapResponse(
          (textChannels: TextChannelInfo[]) =>
            this.setTextChannels({ guildId, textChannels }),
          error => console.error(error),
        ),
      )
      .subscribe();
  }

  loadRoles(guildId: string) {
    this.discordService
      .fetchRoles(guildId)
      .pipe(
        tapResponse(
          (roles: RoleInfo[]) => this.setRoles({ guildId, roles }),
          error => console.error(error),
        ),
      )
      .subscribe();
  }
}
