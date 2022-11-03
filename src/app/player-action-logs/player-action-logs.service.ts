import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { isObject } from 'lodash-es';
import { Observable } from 'rxjs';
import { PlayerAction } from './models/player-action';
import { PlayerActionsFilter } from './models/player-actions-filter';

interface PlayerActionsQuery {
  limit?: number;
  filter?: PlayerActionsFilter;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerActionLogsService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {}

  fetchPlayerActions(query?: PlayerActionsQuery): Observable<PlayerAction[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (isObject(value)) {
        for (const [key2, value2] of Object.entries(value)) {
          params = params.append(`${key}[${key2}]`, value2);
        }
      } else {
        params = params.append(key, value);
      }
    }

    return this.http.get<PlayerAction[]>(`${this.apiUrl}/player-action-logs`, {
      params,
    });
  }
}
