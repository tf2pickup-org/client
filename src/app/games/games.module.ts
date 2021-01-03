import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GameListComponent } from './game-list/game-list.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './games.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GamesEffects } from './games.effects';
import { GameDetailsComponent } from './game-details/game-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { MumbleJoinButtonComponent } from './mumble-join-button/mumble-join-button.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PlayerConnectionStatusComponent } from './player-connection-status/player-connection-status.component';
import { GameBasicInfoComponent } from './game-basic-info/game-basic-info.component';
import { GameSummaryComponent } from './game-summary/game-summary.component';
import { GameTeamPlayerListComponent } from './game-team-player-list/game-team-player-list.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConnectStringComponent } from './connect-string/connect-string.component';
import { GameTeamHeaderComponent } from './game-team-header/game-team-header.component';
import { IconsModule } from '@app/icons/icons.module';
import { GameAdminButtonsComponent } from './game-admin-buttons/game-admin-buttons.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { OrderTf2ClassesPipe } from './order-tf2-classes.pipe';

@NgModule({
  declarations: [
    GameListComponent,
    GameDetailsComponent,
    MumbleJoinButtonComponent,
    PlayerConnectionStatusComponent,
    GameBasicInfoComponent,
    GameSummaryComponent,
    GameTeamPlayerListComponent,
    ConnectStringComponent,
    GameTeamHeaderComponent,
    GameAdminButtonsComponent,
    OrderTf2ClassesPipe,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('games', reducer),
    EffectsModule.forFeature([GamesEffects]),
    InlineSVGModule,
    NgxPaginationModule,
    TooltipModule,
    ClipboardModule,

    SharedModule,
    IconsModule,

    GamesRoutingModule,
  ],
  exports: [
    GameListComponent,
  ],
})
export class GamesModule { }
