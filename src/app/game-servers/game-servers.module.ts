import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameServersRoutingModule } from './game-servers-routing.module';
import { GameServerListComponent } from './game-server-list/game-server-list.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './game-servers.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GameServersEffects } from './game-servers.effects';
import { AddGameServerDialogComponent } from './add-game-server-dialog/add-game-server-dialog.component';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '@app/icons/icons.module';

@NgModule({
  declarations: [
    GameServerListComponent,
    AddGameServerDialogComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('gameServers', reducer),
    EffectsModule.forFeature([GameServersEffects]),
    FormsModule,

    IconsModule,

    GameServersRoutingModule,
  ],
})
export class GameServersModule { }
