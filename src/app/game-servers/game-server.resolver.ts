import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { loadGameServer } from './game-servers.actions';
import { gameServerById } from './game-servers.selectors';
import { GameServer } from './models/game-server';

@Injectable({
  providedIn: 'root',
})
export class GameServerResolver implements Resolve<GameServer> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<GameServer> {
    const gameServerId = route.params.gameServerId;
    return this.store.pipe(
      select(gameServerById(gameServerId)),
      tap(gameServer => {
        if (!gameServer) {
          this.store.dispatch(loadGameServer({ gameServerId }));
        }
      }),
      filter(gameServer => !!gameServer),
      take(1),
    );
  }
}
