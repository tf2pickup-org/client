import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GamesContainerComponent } from './games-container/games-container.component';
import { GameListComponent } from './game-list/game-list.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './games.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GamesEffects } from './games.effects';
import { GameDetailsComponent } from './game-details/game-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { MumbleJoinButtonComponent } from './mumble-join-button/mumble-join-button.component';

@NgModule({
  declarations: [
    GamesContainerComponent,
    GameListComponent,
    GameDetailsComponent,
    MumbleJoinButtonComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('games', reducer),
    EffectsModule.forFeature([GamesEffects]),
    InlineSVGModule.forRoot(),

    SharedModule,
    GamesRoutingModule,
  ],
})
export class GamesModule { }
