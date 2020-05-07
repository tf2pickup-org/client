import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwitchStreamListComponent } from './twitch-stream-list/twitch-stream-list.component';
import { TwitchStreamListItemComponent } from './twitch-stream-list-item/twitch-stream-list-item.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './twitch.reducer';
import { PlayersModule } from '@app/players/players.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('twitch', reducer),

    PlayersModule,
  ],
  declarations: [
    TwitchStreamListComponent,
    TwitchStreamListItemComponent,
  ],
  exports: [
    TwitchStreamListComponent,
  ],
})
export class TwitchModule { }
