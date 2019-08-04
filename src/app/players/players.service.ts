import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player } from './models/player';
import { API_URL } from '@app/api-url';
import { HttpClient } from '@angular/common/http';
import { Game } from '@app/games/models/game';
import { PlayerSkill } from './models/player-skill';

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
    return this.http.put<Player>(`${this.apiUrl}/players/${player.id}`, player);
  }

  fetchPlayerSkill(playerId: string): Observable<PlayerSkill> {
    return this.http.get<PlayerSkill>(`${this.apiUrl}/players/${playerId}/skill`);
  }

  savePlayerSkill(playerSkill: PlayerSkill): Observable<PlayerSkill> {
    return this.http.put<PlayerSkill>(`${this.apiUrl}/players/${playerSkill.player}/skill`, playerSkill);
  }

}
