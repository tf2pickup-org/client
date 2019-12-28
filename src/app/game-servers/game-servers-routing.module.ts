import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameServerListComponent } from './game-server-list/game-server-list.component';

const routes: Routes = [
  { path: 'servers', component: GameServerListComponent, data: { title: 'game servers' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameServersRoutingModule { }
