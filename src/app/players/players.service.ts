import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from './models/player';
import { API_URL } from '@app/api-url';
import { HttpClient } from '@angular/common/http';
import { Game } from '@app/games/models/game';
import { PlayerStats } from './models/player-stats';
import { PlayerBan } from './models/player-ban';
import { PaginatedList } from '@app/core/models/paginated-list';
import { Store } from '@ngrx/store';
import { PlayerRole } from './models/player-role';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { LinkedProfiles } from './models/linked-profiles';
import { PlayerSkill } from './models/player-skill';
import { ImportPlayerSkillResponse } from './models/import-player-skill-response';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private store: Store,
  ) {}

  fetchPlayer(playerId: string): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${playerId}`);
  }

  fetchPlayerGames(
    player: string,
    offset: number,
    limit: number = 10,
  ): Observable<PaginatedList<Game>> {
    return this.http.get<PaginatedList<Game>>(`${this.apiUrl}/games`, {
      params: {
        player,
        offset,
        limit,
      },
    });
  }

  setPlayerName(playerId: string, name: string): Observable<Player> {
    return this.http.patch<Player>(`${this.apiUrl}/players/${playerId}`, {
      name,
    });
  }

  setPlayerRoles(playerId: string, roles: PlayerRole[]): Observable<Player> {
    return this.http.patch<Player>(`${this.apiUrl}/players/${playerId}`, {
      roles,
    });
  }

  setPlayerSkill(
    playerId: string,
    skill: { [gameClass in Tf2ClassName]?: number },
  ) {
    return this.http.put<{ [gameClass in Tf2ClassName]?: number }>(
      `${this.apiUrl}/players/${playerId}/skill`,
      skill,
    );
  }

  fetchAllPlayerSkills(): Observable<PlayerSkill[]> {
    return this.http.get<PlayerSkill[]>(`${this.apiUrl}/players/all/skill`);
  }

  fetchPlayerSkill(
    playerId: string,
  ): Observable<{ [gameClass in Tf2ClassName]?: number }> {
    return this.http.get<Record<Tf2ClassName, number>>(
      `${this.apiUrl}/players/${playerId}/skill`,
    );
  }

  resetPlayerSkill(playerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/players/${playerId}/skill`);
  }

  fetchAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  fetchPlayerStats(playerId: string): Observable<PlayerStats> {
    return this.http.get<PlayerStats>(
      `${this.apiUrl}/players/${playerId}/stats`,
    );
  }

  fetchPlayerBans(playerId: string): Observable<PlayerBan[]> {
    return this.http.get<PlayerBan[]>(
      `${this.apiUrl}/players/${playerId}/bans`,
    );
  }

  addPlayerBan(playerBan: Partial<PlayerBan>): Observable<PlayerBan> {
    return this.http.post<PlayerBan>(
      `${this.apiUrl}/players/${playerBan.player}/bans`,
      playerBan,
    );
  }

  revokePlayerBan(playerBan: PlayerBan): Observable<PlayerBan> {
    return this.http.post<PlayerBan>(
      `${this.apiUrl}/players/${playerBan.player}/bans/${playerBan.id}?revoke`,
      {},
    );
  }

  forceCreatePlayer(player: Partial<Player>) {
    return this.http.post<Player>(`${this.apiUrl}/players`, player);
  }

  fetchPlayerLinkedProfiles(playerId: string): Observable<LinkedProfiles> {
    return this.http.get<LinkedProfiles>(
      `${this.apiUrl}/players/${playerId}/linked-profiles`,
    );
  }

  fetchOnlinePlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/online-players`);
  }

  importPlayerSkill(csvSkillFile: File): Observable<ImportPlayerSkillResponse> {
    const formData = new FormData();
    formData.append('skills', csvSkillFile, csvSkillFile.name);
    return this.http.post<ImportPlayerSkillResponse>(
      `${this.apiUrl}/players/import-skills`,
      formData,
    );
  }
}
