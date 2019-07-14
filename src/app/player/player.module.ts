import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './player.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PlayerEffects } from './player.effects';
import { PlayerNameComponent } from './player-name/player-name.component';
import { PlayerAvatarComponent } from './player-avatar/player-avatar.component';

@NgModule({
  declarations: [PlayerNameComponent, PlayerAvatarComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('players', reducer),
    EffectsModule.forFeature([PlayerEffects]),
  ],
  exports: [
    PlayerNameComponent,
    PlayerAvatarComponent,
  ],
})
export class PlayerModule { }
