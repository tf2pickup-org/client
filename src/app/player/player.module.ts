import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './player.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PlayerEffects } from './player.effects';
import { PlayerNameComponent } from './player-name/player-name.component';

@NgModule({
  declarations: [PlayerNameComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('players', reducer),
    EffectsModule.forFeature([PlayerEffects]),
  ],
  exports: [PlayerNameComponent]
})
export class PlayerModule { }
