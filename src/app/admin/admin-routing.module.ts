import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '@app/auth/is-admin.guard';
import { DocumentResolver } from '@app/documents/document.resolver';
import { AdminItemListComponent } from './admin-item-list/admin-item-list.component';
import { DefaultPlayerSkillEditComponent } from './default-player-skill-edit/default-player-skill-edit.component';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { ForceCreatePlayerAccountComponent } from './force-create-player-account/force-create-player-account.component';
import { GameServerDiagnosticsComponent } from './game-server-diagnostics/game-server-diagnostics.component';
import { MapPoolEditComponent } from './map-pool-edit/map-pool-edit.component';
import { PlayerSkillTableComponent } from './player-skill-table/player-skill-table.component';
import { ScrambleMapsComponent } from './scramble-maps/scramble-maps.component';
import { WhitelistEditComponent } from './whitelist-edit/whitelist-edit.component';
import { GameServerResolver } from '@app/game-servers/game-server.resolver';
import { PlayerRestrictionsComponent } from './player-restrictions/player-restrictions.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsAdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AdminItemListComponent,
        data: {
          title: 'admin panel',
          animation: 'AdminItemListPage',
        },
      },
      {
        path: 'map-pool',
        component: MapPoolEditComponent,
        data: {
          title: 'map pool configuration',
          animation: 'MapPoolEditPage',
        },
      },
      {
        path: 'whitelist',
        component: WhitelistEditComponent,
        data: {
          title: 'whitelist configuration',
          animation: 'WhitelistEditPage',
        },
      },
      {
        path: 'default-player-skill',
        component: DefaultPlayerSkillEditComponent,
        data: {
          title: 'default player skill',
          animation: 'DefaultPlayerSkillEditPage',
        },
      },
      {
        path: 'player-skill-table',
        component: PlayerSkillTableComponent,
        data: {
          title: 'player skill table',
          animation: 'PlayerSkillTablePage',
        },
      },
      {
        path: 'force-create-player-account',
        component: ForceCreatePlayerAccountComponent,
        data: {
          title: 'force create player account',
          animation: 'ForceCreatePlayerAccountPage',
        },
      },
      {
        path: 'document-edit/:documentName',
        component: DocumentEditComponent,
        data: {
          title: 'edit document',
          animation: 'DocumentEditPage',
        },
        resolve: {
          document: DocumentResolver,
        },
      },
      {
        path: 'scramble-maps',
        component: ScrambleMapsComponent,
        data: {
          animation: 'ScrambleMapsPage',
        },
      },
      {
        path: 'game-server-diagnostics/:gameServerId',
        component: GameServerDiagnosticsComponent,
        data: {
          animation: 'GameServerDiagnosticsPage',
        },
        resolve: {
          gameServer: GameServerResolver,
        },
      },
      {
        path: 'player-restrictions',
        component: PlayerRestrictionsComponent,
        data: {
          title: 'edit player restrictions',
          Animation: 'PlayerRestrictionsPage',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
