import { Injectable, Inject } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { Player } from './models/player';
import { API_URL } from '@app/api-url';
import { HttpClient } from '@angular/common/http';
import { Game } from '@app/games/models/game';
import { PlayerSkill } from './models/player-skill';
import { map } from 'rxjs/operators';
import { PlayerStats } from './models/player-stats';
import { PlayerBan } from './models/player-ban';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) { }

  fetchPlayer(playerId: string): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${playerId}`);
  }

  fetchPlayerGames(playerId: string): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/players/${playerId}/games`);
  }

  savePlayer(player: Player): Observable<Player> {
    const editedPlayer = {
      name: player.name,
    };

    const editedSkill = {
      player: player.id,
      skill: player.skill,
    };

    return zip(
      this.http.patch<Player>(`${this.apiUrl}/players/${player.id}`, editedPlayer),
      this.http.put<PlayerSkill>(`${this.apiUrl}/players/${player.id}/skill`, editedSkill),
    ).pipe(
      map(([thePlayer, skill]) => ({ ...thePlayer, skill: skill.skill })),
    );
  }

  fetchPlayerSkill(playerId: string): Observable<PlayerSkill> {
    return this.http.get<PlayerSkill>(`${this.apiUrl}/players/${playerId}/skill`);
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
    return this.http.put<PlayerBan>(`${this.apiUrl}/players/${playerBan.player}/bans?revoke`, { ...playerBan });
  }

}
