import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StatisticsService } from '@app/statistics/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  playedMapCount = this.statisticsService.fetchPlayedMapsCount();

  constructor(private statisticsService: StatisticsService) {}
}
