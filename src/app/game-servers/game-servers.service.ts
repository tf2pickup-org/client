import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { interval, Observable, timer } from 'rxjs';
import { GameServer } from './models/game-server';
import { GameServerDiagnosticRun } from './models/game-server-diagnostic-run';
import { map, mergeMap, switchMap, takeWhile } from 'rxjs/operators';

interface RunDiagnosticsResponse {
  tracking: {
    url: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GameServersService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  fetchGameServers(): Observable<GameServer[]> {
    return this.http.get<GameServer[]>(`${this.apiUrl}/game-servers`);
  }

  addGameServer(gameServer: GameServer): Observable<GameServer> {
    return this.http.post<GameServer>(
      `${this.apiUrl}/game-servers`,
      gameServer,
    );
  }

  removeGameServer(gameServerId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/game-servers/${gameServerId}`,
    );
  }

  fetchGameServer(gameServerId: string): Observable<GameServer> {
    return this.http.get<GameServer>(
      `${this.apiUrl}/game-servers/${gameServerId}`,
    );
  }

  runDiagnostics(gameServerId: string): Observable<GameServerDiagnosticRun> {
    return this.http
      .post<RunDiagnosticsResponse>(
        `${this.apiUrl}/game-servers/${gameServerId}/diagnostics`,
        {},
      )
      .pipe(
        map(response => response.tracking.url),
        switchMap(url =>
          timer(0, 500).pipe(
            mergeMap(() => this.http.get<GameServerDiagnosticRun>(url)),
            takeWhile(run => ['pending', 'running'].includes(run.status), true),
          ),
        ),
      );
  }
}
