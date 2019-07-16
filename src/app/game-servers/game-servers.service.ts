import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { GameServer } from './models/game-server';

@Injectable({
  providedIn: 'root'
})
export class GameServersService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) { }

  fetchGameServers(): Observable<GameServer[]> {
    return this.http.get<GameServer[]>(`${this.apiUrl}/game-servers`);
  }

  addGameServer(gameServer: GameServer): Observable<GameServer> {
    return this.http.post<GameServer>(`${this.apiUrl}/game-servers`, gameServer);
  }

  removeGameServer(gameServerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/game-servers/${gameServerId}`);
  }

}
