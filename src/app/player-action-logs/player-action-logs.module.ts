import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerActionLogsRoutingModule } from './player-action-logs-routing.module';
import { PlayerActionLogsComponent } from './player-action-logs/player-action-logs.component';

@NgModule({
  imports: [CommonModule, PlayerActionLogsRoutingModule],
  declarations: [PlayerActionLogsComponent],
})
export class PlayerActionLogsModule {}
