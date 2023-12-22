import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GameServersService } from './game-servers.service';
import { GameServer } from './models/game-server';

@Injectable({
  providedIn: 'root',
})
export class GameServerResolver {
  constructor(private gameServersService: GameServersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<GameServer> {
    const gameServerId = route.params.gameServerId;
    return this.gameServersService.fetchGameServer(gameServerId);
  }
}
