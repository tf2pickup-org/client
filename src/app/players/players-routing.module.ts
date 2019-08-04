import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { PlayerEditComponent } from './player-edit/player-edit.component';
import { PlayerListComponent } from './player-list/player-list.component';

const routes: Routes = [
  { path: 'players', component: PlayerListComponent },
  { path: 'player/:id', component: PlayerDetailsComponent },
  { path: 'player/:id/edit', component: PlayerEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule { }
