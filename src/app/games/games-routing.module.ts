import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameListComponent } from './game-list/game-list.component';
import { GameDetailsComponent } from './game-details/game-details.component';

const routes: Routes = [
  {
    path: 'games',
    component: GameListComponent,
    data: { title: 'games', animation: 'GameListPage' },
  },
  {
    path: 'game/:id',
    component: GameDetailsComponent,
    data: { animation: 'GameDetailsPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
