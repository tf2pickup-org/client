import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddGameServerComponent } from './add-game-server/add-game-server.component';
import { GameServerListComponent } from './game-server-list/game-server-list.component';

const routes: Routes = [
  { path: 'servers', component: GameServerListComponent, data: { title: 'game servers', animation: 'GameServerListPage' } },
  { path: 'servers/add', component: AddGameServerComponent, data: { title: 'add game server', animation: 'AddGameServerPage' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameServersRoutingModule { }
