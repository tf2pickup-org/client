import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameServersRoutingModule } from './game-servers-routing.module';
import { GameServerListComponent } from './game-server-list/game-server-list.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './game-servers.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GameServersEffects } from './game-servers.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '@app/icons/icons.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AddGameServerComponent } from './add-game-server/add-game-server.component';

@NgModule({
  declarations: [
    GameServerListComponent,
    AddGameServerComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('gameServers', reducer),
    EffectsModule.forFeature([GameServersEffects]),
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,

    IconsModule,

    GameServersRoutingModule,
  ],
})
export class GameServersModule { }
