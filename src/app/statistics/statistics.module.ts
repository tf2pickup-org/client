import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics/statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [StatisticsComponent, PieChartComponent],
  imports: [CommonModule, StatisticsRoutingModule],
})
export class StatisticsModule {}
