import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics/statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';

@NgModule({
  declarations: [StatisticsComponent],
  imports: [CommonModule, StatisticsRoutingModule],
})
export class StatisticsModule {}
