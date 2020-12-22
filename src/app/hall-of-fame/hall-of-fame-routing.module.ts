import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';

const routes: Routes = [
  { path: 'hall-of-fame', component: HallOfFameComponent, data: { title: 'hall of fame', animation: 'HallOfFamePage' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HallOfFameRoutingModule { }
