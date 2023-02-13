import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MapPoolEditComponent } from './map-pool-edit/map-pool-edit.component';
import { MapEditComponent } from './map-edit/map-edit.component';
import { IconsModule } from '@app/icons/icons.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { AdminItemListComponent } from './admin-item-list/admin-item-list.component';
import { PlayerSkillTableComponent } from './player-skill-table/player-skill-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ForceCreatePlayerAccountComponent } from './force-create-player-account/force-create-player-account.component';
import { WhitelistEditComponent } from './whitelist-edit/whitelist-edit.component';
import { DefaultPlayerSkillEditComponent } from './default-player-skill-edit/default-player-skill-edit.component';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { MarkdownModule } from 'ngx-markdown';
import { EditPageWrapperComponent } from './edit-page-wrapper/edit-page-wrapper.component';
import { ScrambleMapsComponent } from './scramble-maps/scramble-maps.component';
import { GameServerDiagnosticsComponent } from './game-server-diagnostics/game-server-diagnostics.component';
import { DiagnosticCheckInfoComponent } from './game-server-diagnostics/diagnostic-check-info/diagnostic-check-info.component';
import { PlayerRestrictionsComponent } from './player-restrictions/player-restrictions.component';
import { MinimumTf2InGameHoursDialogComponent } from './player-restrictions/minimum-tf2-in-game-hours-dialog/minimum-tf2-in-game-hours-dialog.component';
import { VoiceServerEditComponent } from './voice-server-edit/voice-server-edit.component';
import { GameServersComponent } from './game-servers/game-servers.component';
import { StaticGameServerListComponent } from './game-servers/static-game-server-list/static-game-server-list.component';
import { StaticGameServerComponent } from './game-servers/static-game-server/static-game-server.component';
import { ServemeTfConfigurationComponent } from './game-servers/serveme-tf-configuration/serveme-tf-configuration.component';
import { ImportExportPlayerSkillComponent } from './import-export-player-skill/import-export-player-skill.component';
import { GameConfigurationComponent } from './game-configuration/game-configuration.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MarkdownModule,

    IconsModule,
    SharedModule,

    AdminRoutingModule,
  ],
  declarations: [
    MapPoolEditComponent,
    MapEditComponent,
    AdminItemListComponent,
    PlayerSkillTableComponent,
    ForceCreatePlayerAccountComponent,
    WhitelistEditComponent,
    DefaultPlayerSkillEditComponent,
    DocumentEditComponent,
    EditPageWrapperComponent,
    ScrambleMapsComponent,
    GameServerDiagnosticsComponent,
    DiagnosticCheckInfoComponent,
    PlayerRestrictionsComponent,
    MinimumTf2InGameHoursDialogComponent,
    VoiceServerEditComponent,
    GameServersComponent,
    StaticGameServerListComponent,
    StaticGameServerComponent,
    ServemeTfConfigurationComponent,
    ImportExportPlayerSkillComponent,
    GameConfigurationComponent,
  ],
})
export class AdminModule {}
