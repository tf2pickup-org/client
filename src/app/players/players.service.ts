import { Injectable, Inject } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { Player } from './models/player';
import { API_URL } from '@app/api-url';
import { HttpClient } from '@angular/common/http';
import { Game } from '@app/games/models/game';
import { PlayerSkill } from './models/player-skill';
import { map, first } from 'rxjs/operators';
import { PlayerStats } from './models/player-stats';
import { PlayerBan } from './models/player-ban';
import { PaginatedList } from '@app/core/models/paginated-list';
import { Store, select } from '@ngrx/store';
import { queueConfig } from '@app/queue/queue.selectors';
import { PlayerRole } from './models/player-role';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private store: Store<{}>,
  ) { }

  fetchPlayer(playerId: string): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${playerId}`);
  }

  fetchPlayerGames(playerId: string, offset: number, limit: number = 10): Observable<PaginatedList<Game>> {
    return this.http.get<PaginatedList<Game>>(`${this.apiUrl}/players/${playerId}/games?offset=${offset}&limit=${limit}`);
  }

  setPlayerName(playerId: string, name: string): Observable<Player> {
    return this.http.patch<Player>(`${this.apiUrl}/players/${playerId}`, { name });
  }

  setPlayerRole(playerId: string, role: PlayerRole): Observable<Player> {
    return this.http.patch<Player>(`${this.apiUrl}/players/${playerId}`, { role });
  }

  setPlayerSkill(playerId: string, skill: { [gameClass: string]: number }) {
    return this.http.put<{ [gameClass: string]: number }>(`${this.apiUrl}/players/${playerId}/skill`, skill);
  }

  fetchAllPlayerSkills(): Observable<PlayerSkill[]> {
    return this.http.get<PlayerSkill[]>(`${this.apiUrl}/players/all/skill`);
  }

  fetchPlayerSkill(playerId: string): Observable<{ [gameClass: string]: number }> {
    return this.http.get<{ [gameClass: string]: number }>(`${this.apiUrl}/players/${playerId}/skill`);
  }

  fetchAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  fetchPlayerStats(playerId: string): Observable<PlayerStats> {
    return this.http.get<PlayerStats>(`${this.apiUrl}/players/${playerId}/stats`);
  }

  fetchPlayerBans(playerId: string): Observable<PlayerBan[]> {
    return this.http.get<PlayerBan[]>(`${this.apiUrl}/players/${playerId}/bans`);
  }

  addPlayerBan(playerBan: Partial<PlayerBan>): Observable<PlayerBan> {
    return this.http.post<PlayerBan>(`${this.apiUrl}/players/${playerBan.player}/bans`, playerBan);
  }

  revokePlayerBan(playerBan: PlayerBan): Observable<PlayerBan> {
    return this.http.post<PlayerBan>(`${this.apiUrl}/players/${playerBan.player}/bans/${playerBan.id}?revoke`, { });
  }

  defaultSkill(playerId: string): Observable<{ [gameClass: string]: number }> {
    return this.store.pipe(
      select(queueConfig),
      first(config => !!config),
      map(config => config.classes.reduce((_skill, curr) => { _skill[curr.name] = 1; return _skill; }, { })),
    );
  }

}
