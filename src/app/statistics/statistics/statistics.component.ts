import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StatisticsService } from '@app/statistics/statistics.service';
import { concat, dropRight, takeRight } from 'lodash-es';
import { filter, map, switchMap } from 'rxjs/operators';
import { BarSeriesOption, EChartsOption } from 'echarts';
import { BehaviorSubject, Observable, of, zip } from 'rxjs';
import { sub } from 'date-fns';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  readonly since = [
    {
      key: 'last year',
      value: sub(new Date(), { years: 1 }),
    },
    {
      key: 'last 6 months',
      value: sub(new Date(), { months: 6 }),
    },
    {
      key: 'last month',
      value: sub(new Date(), { months: 1 }),
    },
    {
      key: 'last 2 weeks',
      value: sub(new Date(), { weeks: 2 }),
    },
  ];

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

  readonly gameLaunchesPerDaySince = new BehaviorSubject<Date>(
    this.since[0].value,
  );

  gameLaunchesPerDay: Observable<EChartsOption> =
    this.gameLaunchesPerDaySince.pipe(
      switchMap(since =>
        zip(of(since), this.statisticsService.fetchGameLaunchesPerDay(since)),
      ),
      filter(([, data]) => Boolean(data)),
      map(([since, data]) => {
        const end = new Date();
        const date = new Date(since);
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

  onSinceChanged(since: string) {
    this.gameLaunchesPerDaySince.next(new Date(Date.parse(since)));
  }
}
