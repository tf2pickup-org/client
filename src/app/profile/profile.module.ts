import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './profile.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProfileEffects } from './profile.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('profile', reducer),
    EffectsModule.forFeature([ProfileEffects]),
  ]
})
export class ProfileModule { }
