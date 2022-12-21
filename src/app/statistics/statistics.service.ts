import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { PlayedMapCount } from './models/played-map-count';
import { GameLaunchTimeSpan } from './models/game-launch-time-span';
import { GameLaunchesPerDay } from './models/game-launches-per-day';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  fetchPlayedMapsCount(): Observable<PlayedMapCount[]> {
    return this.http.get<PlayedMapCount[]>(
      `${this.apiUrl}/statistics/played-maps-count`,
    );
  }

  fetchGameLaunchTimeSpans(): Observable<GameLaunchTimeSpan[]> {
    return this.http.get<GameLaunchTimeSpan[]>(
      `${this.apiUrl}/statistics/game-launch-time-spans`,
    );
  }

  fetchGameLaunchesPerDay(since: Date): Observable<GameLaunchesPerDay[]> {
    return this.http.get<GameLaunchesPerDay[]>(
      `${this.apiUrl}/statistics/game-launches-per-day`,
      {
        params: {
          since: format(since, 'yyyy-MM-dd'),
        },
      },
    );
  }
}
