import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@app/auth/is-admin.guard';
import { AdminItemListComponent } from './admin-item-list/admin-item-list.component';
import { DefaultPlayerSkillEditComponent } from './default-player-skill-edit/default-player-skill-edit.component';
import { ForceCreatePlayerAccountComponent } from './force-create-player-account/force-create-player-account.component';
import { MapPoolEditComponent } from './map-pool-edit/map-pool-edit.component';
import { PlayerSkillTableComponent } from './player-skill-table/player-skill-table.component';
import { WhitelistEditComponent } from './whitelist-edit/whitelist-edit.component';

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
    path: 'whitelist',
    component: WhitelistEditComponent,
    data: {
      title: 'whitelist configuration',
      animation: 'WhitelistEditPage',
    },
    canActivate: [ IsAdminGuard ],
  },
  {
    path: 'default-player-skill',
    component: DefaultPlayerSkillEditComponent,
    data: {
      title: 'default player skill',
      animation: 'DefaultPlayerSkillEditPage',
    },
    canActivate: [ IsAdminGuard ],
  },
  {
    path: 'player-skill-table',
    component: PlayerSkillTableComponent,
    data: {
      title: 'player skill table',
      animation: 'PlayerSkillTablePage',
    },
    canActivate: [ IsAdminGuard ],
  },
  {
    path: 'force-create-player-account',
    component: ForceCreatePlayerAccountComponent,
    data: {
      title: 'force create player account',
      animation: 'ForceCreatePlayerAccountPage',
    },
    canActivate: [ IsAdminGuard ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
