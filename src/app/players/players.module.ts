import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { PlayerEffects } from './players.effects';
import { PlayerNameComponent } from './player-name/player-name.component';
import { PlayerAvatarComponent } from './player-avatar/player-avatar.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { PlayersRoutingModule } from './players-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayerEditComponent } from './player-edit/player-edit.component';
import { PlayerEditSkillComponent } from './player-edit-skill/player-edit-skill.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { PlayerBansComponent } from './player-bans/player-bans.component';
import { PlayerBanItemComponent } from './player-ban-item/player-ban-item.component';
import { AddPlayerBanComponent } from './add-player-ban/add-player-ban.component';
import { GamesModule } from '@app/games/games.module';
import { SteamProfileLinkPipe } from './steam-profile-link.pipe';
import { Etf2lProfileLinkPipe } from './etf2l-profile-link.pipe';
import { LogsTfProfileLinkPipe } from './logs-tf-profile-link.pipe';
import { SkillTableComponent } from './skill-table/skill-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TwitchTvProfileLinkPipe } from './twitch-tv-profile-link.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { PlayerDetailsHeaderComponent } from './player-details-header/player-details-header.component';
import { PlayerDetailsGameListComponent } from './player-details-game-list/player-details-game-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PlayerDetailsBadgesComponent } from './player-details-badges/player-details-badges.component';
import { PlayerDetailsExternalProfileLinksComponent } from
  './player-details-external-profile-links/player-details-external-profile-links.component';
import { PlayerDetailsAdminButtonsComponent } from './player-details-admin-buttons/player-details-admin-buttons.component';
import { IconsModule } from '@app/icons/icons.module';
import { EditPlayerRolesComponent } from './edit-player-roles/edit-player-roles.component';

@NgModule({
  declarations: [
    PlayerNameComponent,
    PlayerAvatarComponent,
    PlayerDetailsComponent,
    PlayerEditComponent,
    PlayerEditSkillComponent,
    PlayerListComponent,
    PlayerStatsComponent,
    PlayerBansComponent,
    PlayerBanItemComponent,
    AddPlayerBanComponent,
    SteamProfileLinkPipe,
    Etf2lProfileLinkPipe,
    LogsTfProfileLinkPipe,
    SkillTableComponent,
    TwitchTvProfileLinkPipe,
    PlayerDetailsHeaderComponent,
    PlayerDetailsGameListComponent,
    PlayerDetailsBadgesComponent,
    PlayerDetailsExternalProfileLinksComponent,
    PlayerDetailsAdminButtonsComponent,
    EditPlayerRolesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    StoreModule.forFeature('players', reducer),
    EffectsModule.forFeature([PlayerEffects]),
    TooltipModule,
    InlineSVGModule,
    NgxDatatableModule,
    NgxPaginationModule,

    GamesModule,
    IconsModule,
    SharedModule,

    PlayersRoutingModule,
  ],
  exports: [
    PlayerNameComponent,
    PlayerAvatarComponent,
  ],
})
export class PlayersModule { }
