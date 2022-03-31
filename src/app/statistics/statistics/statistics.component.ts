import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StatisticsService } from '@app/statistics/statistics.service';
import { concat, dropRight, takeRight } from 'lodash';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  playedMapCount = this.statisticsService.fetchPlayedMapsCount().pipe(
    map(data => data.map(d => ({ label: d.mapName, value: d.count }))),
    map(data => {
      const lastTenMaps = takeRight(data, Math.max(0, data.length - 8));
      const other = {
        label: 'other maps',
        value: lastTenMaps.reduce((sum, d) => sum + d.value, 0),
      };
      return concat(dropRight(data, Math.max(0, data.length - 8)), other);
    }),
  );

  constructor(private statisticsService: StatisticsService) {}
}
