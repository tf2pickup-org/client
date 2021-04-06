import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HallOfFameRoutingModule } from './hall-of-fame-routing.module';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { PlayersModule } from '@app/players/players.module';

@NgModule({
  declarations: [HallOfFameComponent],
  imports: [CommonModule, HallOfFameRoutingModule, PlayersModule],
})
export class HallOfFameModule {}
