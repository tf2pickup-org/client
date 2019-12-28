import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { Game } from './models/game';
import { PaginatedList } from '@app/core/models/paginated-list';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) { }

  fetchGames(offset: number, limit: number = 10): Observable<PaginatedList<Game>> {
    return this.http.get<PaginatedList<Game>>(`${this.apiUrl}/games?offset=${offset}&limit=${limit}`);
  }

  fetchGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/games/${gameId}`);
  }

  forceEndGame(gameId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/games/${gameId}?force_end`, { });
  }

  reinitializeServer(gameId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/games/${gameId}?reinitialize_server`, { });
  }

  fetchGameSkills(gameId: string): Observable<{ [playerId: string]: number }> {
    return this.http.get<{ [playerId: string]: number }>(`${this.apiUrl}/games/${gameId}/skills`);
  }

}
