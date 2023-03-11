import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwitchStreamListComponent } from './twitch-stream-list/twitch-stream-list.component';
import { TwitchStreamListItemComponent } from './twitch-stream-list-item/twitch-stream-list-item.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './twitch.reducer';
import { PlayersModule } from '@app/players/players.module';
import { EffectsModule } from '@ngrx/effects';
import { TwitchEffects } from './twitch.effects';
import { IconsModule } from '@app/icons/icons.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('twitch', reducer),
    EffectsModule.forFeature([TwitchEffects]),

    PlayersModule,
    IconsModule,
  ],
  declarations: [TwitchStreamListComponent, TwitchStreamListItemComponent],
  exports: [TwitchStreamListComponent],
})
export class TwitchModule {}
