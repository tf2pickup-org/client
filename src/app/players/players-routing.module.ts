import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PlayerDetailsComponent } from './player-details/player-details.component';

const routes: Routes = [
  { path: 'player/:id', component: PlayerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule { }
