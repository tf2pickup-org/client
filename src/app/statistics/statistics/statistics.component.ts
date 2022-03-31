import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StatisticsService } from '@app/statistics/statistics.service';
import { concat, dropRight, takeRight } from 'lodash';
import { map } from 'rxjs/operators';
import { EChartsOption } from 'echarts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  playedMapCount: Observable<EChartsOption> = this.statisticsService
    .fetchPlayedMapsCount()
    .pipe(
      map(data => data.map(d => ({ name: d.mapName, value: d.count }))),
      map(data => {
        const lastTenMaps = takeRight(data, Math.max(0, data.length - 8));
        const other = {
          name: 'other maps',
          value: lastTenMaps.reduce((sum, d) => sum + d.value, 0),
        };
        return concat(dropRight(data, Math.max(0, data.length - 8)), other);
      }),
      map(data => ({
        title: {
          text: 'Most played maps',
          x: 'center',
        },
        calculable: true,
        series: [
          {
            name: 'area',
            type: 'pie',
            startAngle: 90,
            data,
          },
        ],
        label: {
          formatter: '{b}: {c}',
        },
      })),
    );

  constructor(private statisticsService: StatisticsService) {}
}
