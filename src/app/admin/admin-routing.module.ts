import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@app/auth/is-admin.guard';
import { AdminItemListComponent } from './admin-item-list/admin-item-list.component';
import { MapPoolEditComponent } from './map-pool-edit/map-pool-edit.component';
import { PlayerSkillTableComponent } from './player-skill-table/player-skill-table.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminItemListComponent,
    data: {
      title: 'admin panel',
      animation: 'AdminItemListPage',
    },
    canActivate: [ IsAdminGuard ],
  },
  {
    path: 'map-pool',
    component: MapPoolEditComponent,
    data: {
      title: 'map pool configuration',
      animation: 'MapPoolEditPage',
    },
    canActivate: [ IsAdminGuard ],
  },
  {
    path: 'player-skill-table',
    component: PlayerSkillTableComponent,
    data: {
      title: 'player skill table',
      animation: 'PlayerSkillTable',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
