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

@NgModule({
  declarations: [
    GamesContainerComponent,
    GameListComponent,
    GameDetailsComponent,
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    StoreModule.forFeature('games', reducer),
    EffectsModule.forFeature([GamesEffects]),
  ],
})
export class GamesModule { }
