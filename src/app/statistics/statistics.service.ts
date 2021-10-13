import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { PlayedMapCount } from './models/played-map-count';

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
}
