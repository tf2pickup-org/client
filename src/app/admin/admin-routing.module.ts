import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@app/auth/is-admin.guard';
import { AdminItemListComponent } from './admin-item-list/admin-item-list.component';
import { MapPoolEditComponent } from './map-pool-edit/map-pool-edit.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
