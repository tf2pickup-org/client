import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { Game } from './models/game';
import { PaginatedList } from '@app/core/models/paginated-list';
import { Socket } from '@app/io/socket';
import { ConnectInfo } from './models/connect-info';
import { GameServerIdentifier } from '@app/game-servers/models/game-server-identifier';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private socket: Socket,
  ) {}

  fetchGames(
    offset: number,
    limit: number = 10,
  ): Observable<PaginatedList<Game>> {
    return this.http.get<PaginatedList<Game>>(
      `${this.apiUrl}/games?offset=${offset}&limit=${limit}`,
    );
  }

  fetchGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/games/${gameId}`);
  }

  forceEndGame(gameId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/games/${gameId}/force-end`, {});
  }

  reinitializeServer(gameId: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/games/${gameId}/reinitialize-gameserver`,
      {},
    );
  }

  reassign(gameId: string, gameServerId: GameServerIdentifier) {
    return this.http.put<void>(
      `${this.apiUrl}/games/${gameId}/assign-gameserver`,
      {
        ...gameServerId,
      },
    );
  }

  fetchGameSkills(gameId: string): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(
      `${this.apiUrl}/games/${gameId}/skills`,
    );
  }

  requestSubstitute(gameId: string, playerId: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/games/${gameId}/substitute-player`,
      {},
      { params: { player: playerId } },
    );
  }

  cancelSubstitutionRequest(
    gameId: string,
    playerId: string,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/games/${gameId}/cancel-player-substitute`,
      {},
      { params: { player: playerId } },
    );
  }

  replacePlayer(gameId: string, replaceeId: string): Observable<Game> {
    return this.socket.call<Game>('replace player', { gameId, replaceeId });
  }

  fetchConnectInfo(gameId: string): Observable<ConnectInfo> {
    return this.http.get<ConnectInfo>(
      `${this.apiUrl}/games/${gameId}/connect-info`,
    );
  }
}
