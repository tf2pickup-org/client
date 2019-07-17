import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { Game } from './models/game';
import { IoClientService } from '@app/core/io-client.service';

interface GameUpdateResponse {
  game?: Game;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private ioClientService: IoClientService,
  ) { }

  fetchGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/games`);
  }

  fetchGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/games/${gameId}`);
  }

  forceEndGame(gameId: string): Observable<Game> {
    return new Observable(observer => {
      this.ioClientService.socket.emit('force end game', gameId, (response: GameUpdateResponse) => {
        if (response.error) {
          observer.error(response.error);
        } else if (response.game) {
          observer.next(response.game);
          observer.complete();
        }
      });
    });
  }

}
