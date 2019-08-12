import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { PlayerEditComponent } from './player-edit/player-edit.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerBansComponent } from './player-bans/player-bans.component';
import { AddPlayerBanComponent } from './add-player-ban/add-player-ban.component';

const routes: Routes = [
  { path: 'players', component: PlayerListComponent },
  { path: 'player/:id', component: PlayerDetailsComponent },
  { path: 'player/:id/edit', component: PlayerEditComponent },
  { path: 'player/:id/bans', component: PlayerBansComponent },
  { path: 'player/:id/bans/add', component: AddPlayerBanComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule { }
