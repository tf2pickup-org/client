import { ReplaySubject, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { GameServersEffects } from './game-servers.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { GameServersService } from './game-servers.service';
import { gameServersLoaded, loadGameServers, gameServerLoaded, loadGameServer, gameServerAdded, addGameServer, failedToAddGameServer,
  gameServerRemoved, removeGameServer } from './game-servers.actions';
import { GameServer } from './models/game-server';
import { HttpErrorResponse } from '@angular/common/http';

class GameServersServiceStub {
  fetchGameServers() { return of([]); }
  fetchGameServer(gameServerId: string) { return of({ id: 'FAKE_ID', name: 'FAKE_NAME' }); }
  addGameServer(gameServer: GameServer) { return of(gameServer); }
  removeGameServer(gameServerId: string) { return of(); }
}

describe('GameServersEffects', () => {
  const actions = new ReplaySubject<Action>(1);
  let effects: GameServersEffects;
  let gameServersService: GameServersServiceStub;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GameServersEffects,
      provideMockActions(() => actions.asObservable()),
      { provide: GameServersService, useClass: GameServersServiceStub },
    ]
  }));

  beforeEach(() => {
    effects = TestBed.get(GameServersEffects);
    gameServersService = TestBed.get(GameServersService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadGameServers', () => {
    it('should attempt to fetch all game servers', () => {
      const spy = spyOn(gameServersService, 'fetchGameServers').and.callThrough();
      effects.loadGameServers.subscribe(action => expect(action).toEqual(gameServersLoaded({ gameServers: [] })));
      actions.next(loadGameServers());
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('loadGameServer', () => {
    it('should attempt to fetch the given game server', () => {
      const spy = spyOn(gameServersService, 'fetchGameServer').and.callThrough();
      effects.loadGameServer.subscribe(action =>
        expect(action).toEqual(gameServerLoaded({ gameServer: { id: 'FAKE_ID', name: 'FAKE_NAME' } } as any)));
      actions.next(loadGameServer({ gameServerId: 'FAKE_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_ID');
    });
  });

  describe('addGameServer', () => {
    const gameServer: GameServer = { name: 'some name', address: '127.0.0.1', port: '27015', rconPassword: '123456' };

    it('should add the given server', () => {
      const spy = spyOn(gameServersService, 'addGameServer').and.callThrough();
      effects.addGameServer.subscribe(action => expect(action).toEqual(gameServerAdded({ gameServer })));
      actions.next(addGameServer({ gameServer }));
      expect(spy).toHaveBeenCalledWith(gameServer);
    });

    it('should handle errors', () => {
      spyOn(gameServersService, 'addGameServer')
        .and.returnValue(throwError(new HttpErrorResponse({ error: { message: 'haha failed' } })));
      effects.addGameServer.subscribe(action => expect(action).toEqual(failedToAddGameServer({ error: 'haha failed' })));
      actions.next(addGameServer({ gameServer }));
    });
  });

  describe('removeGameServer', () => {
    it('should remove the  game server', () => {
      const spy = spyOn(gameServersService, 'removeGameServer').and.callThrough();
      effects.removeGameServer.subscribe(action => expect(action).toEqual(gameServerRemoved({ gameServerId: 'FAKE_ID' })));
      actions.next(removeGameServer({ gameServerId: 'FAKE_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_ID');
    });
  });
});
