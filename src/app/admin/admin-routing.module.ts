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
import { GameServerResolver } from '@app/game-servers/game-server.resolver';
import { PlayerRestrictionsComponent } from './player-restrictions/player-restrictions.component';
import { VoiceServerEditComponent } from './voice-server-edit/voice-server-edit.component';
import { GameServersComponent } from './game-servers/game-servers.component';
import { StaticGameServerComponent } from './game-servers/static-game-server/static-game-server.component';
import { StaticGameServerResolver } from './game-servers/static-game-server.resolver';
import { ServemeTfConfigurationComponent } from './game-servers/serveme-tf-configuration/serveme-tf-configuration.component';
import { ImportExportPlayerSkillComponent } from './import-export-player-skill/import-export-player-skill.component';
import { PlayerRestrictionsResolver } from './player-restrictions/player-restrictions.resolver';
import { GameConfigurationComponent } from './game-configuration/game-configuration.component';
import { GameConfigurationResolver } from './game-configuration/game-configuration.resolver';
import { ConfigurationEditComponent } from './configuration-edit/configuration-edit.component';

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
        path: 'game',
        component: GameConfigurationComponent,
        data: {
          title: 'game configuration',
          animation: 'GameConfigurationPage',
        },
        resolve: {
          gameConfiguration: GameConfigurationResolver,
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
        path: 'voice-server',
        component: VoiceServerEditComponent,
        data: {
          title: 'voice server',
          animation: 'VoiceServerEditPage',
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
        path: 'player-skill-import-export',
        component: ImportExportPlayerSkillComponent,
        data: {
          title: 'import player skill',
          animation: 'PlayerSkillImportExportPage',
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
          animation: 'PlayerRestrictionsPage',
        },
        resolve: {
          playerRestrictions: PlayerRestrictionsResolver,
        },
      },
      {
        path: 'game-servers',
        component: GameServersComponent,
        data: {
          title: 'manage game servers',
          animation: 'GameServersPage',
        },
      },
      {
        path: 'game-servers/serveme-tf',
        component: ServemeTfConfigurationComponent,
        data: {
          animation: 'ServemeTfConfigurationPage',
        },
      },
      {
        path: 'game-servers/:gameServerId',
        component: StaticGameServerComponent,
        data: {
          animation: 'StaticGameServerPage',
        },
        resolve: {
          gameServer: StaticGameServerResolver,
        },
      },
      {
        path: 'configuration',
        component: ConfigurationEditComponent,
        data: {
          animation: 'ConfigurationEditPage',
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
