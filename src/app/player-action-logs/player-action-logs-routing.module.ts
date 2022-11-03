import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@app/auth/is-admin.guard';
import { PlayerActionLogsComponent } from './player-action-logs/player-action-logs.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsAdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PlayerActionLogsComponent,
        data: {
          title: 'player action logs',
          animation: 'PlayerActionLogsPage',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerActionLogsRoutingModule {}
