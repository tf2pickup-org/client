import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './players.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PlayerEffects } from './players.effects';
import { PlayerNameComponent } from './player-name/player-name.component';
import { PlayerAvatarComponent } from './player-avatar/player-avatar.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { PlayersRoutingModule } from './players-routing.module';

@NgModule({
  declarations: [
    PlayerNameComponent,
    PlayerAvatarComponent,
    PlayerDetailsComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('players', reducer),
    EffectsModule.forFeature([PlayerEffects]),
    PlayersRoutingModule,
  ],
  exports: [
    PlayerNameComponent,
    PlayerAvatarComponent,
  ],
})
export class PlayersModule { }
