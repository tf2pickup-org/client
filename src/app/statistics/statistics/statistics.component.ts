import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StatisticsService } from '@app/statistics/statistics.service';
import { concat, dropRight, takeRight } from 'lodash-es';
import { filter, map } from 'rxjs/operators';
import { BarSeriesOption, EChartsOption } from 'echarts';
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

  gameLaunchTimes: Observable<EChartsOption> = this.statisticsService
    .fetchGameLaunchTimeSpans()
    .pipe(
      map(
        data =>
          ['night', 'morning', 'afternoon', 'evening'].map(timeOfTheDay => ({
            type: 'bar',
            name: timeOfTheDay,
            stack: 'day',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: data
              .filter(d => d.timeOfTheDay === timeOfTheDay)
              .map(d => ({
                ...d,
                /* From 1..7 to 0..6, where 0 is Monday and 6 is Sunday */
                dayOfWeek: (d.dayOfWeek + 5) % 7,
              }))
              .sort((a, b) => b.dayOfWeek - a.dayOfWeek)
              .map(d => d.count),
          })) as BarSeriesOption[],
      ),
      map(series => ({
        title: {
          text: 'Game launch times',
          x: 'center',
        },
        legend: {
          top: 28,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ].reverse(),
        },
        series,
      })),
    );

  gameLaunchesPerDay: Observable<EChartsOption> = this.statisticsService
    .fetchGameLaunchesPerDay()
    .pipe(
      filter(data => Boolean(data)),
      map(data => {
        const end = new Date();
        const date = new Date(end);
        date.setFullYear(date.getFullYear() - 1);
        const result = [];
        while (date < end) {
          const day = date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          });

          const monthNumeric = `0${date.getMonth() + 1}`.slice(-2);
          const dateNumeric = `0${date.getDate()}`.slice(-2);
          const lookupDay = `${date.getFullYear()}-${monthNumeric}-${dateNumeric}`;

          result.push({
            day,
            count: data.find(d => d.day === lookupDay)?.count ?? 0,
          });

          date.setDate(date.getDate() + 1);
        }

        return result;
      }),
      map(data => ({
        title: {
          text: 'Played games per day in the last year',
          x: 'center',
        },
        xAxis: {
          data: data.map(d => d.day),
        },
        yAxis: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        series: [
          {
            type: 'line',
            data: data.map(d => d.count),
          },
        ],
      })),
    );

  constructor(private statisticsService: StatisticsService) {
    /* empty */
  }
}
