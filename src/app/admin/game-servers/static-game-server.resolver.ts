import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { GameServersService } from '@app/game-servers/game-servers.service';
import { GameServer } from '@app/game-servers/models/game-server';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StaticGameServerResolver {
  constructor(private gameServersService: GameServersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<GameServer> {
    const gameServerId = route.params['gameServerId'];
    return this.gameServersService.fetchGameServer(gameServerId);
  }
}
