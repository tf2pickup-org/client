import { ReplaySubject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { GameServersEffects } from './game-servers.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { GameServersService } from './game-servers.service';
import { gameServersLoaded, loadGameServers, gameServerLoaded, loadGameServer } from './game-servers.actions';

class GameServersServiceStub {
  fetchGameServers() { return of([]); }
  fetchGameServer(gameServerId: string) { return of({ id: 'FAKE_ID', name: 'FAKE_NAME' }); }
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

  describe('#loadGameServers', () => {
    it('should attempt to fetch all game servers', () => {
      const spy = spyOn(gameServersService, 'fetchGameServers').and.callThrough();
      effects.loadGameServers.subscribe(action => expect(action).toEqual(gameServersLoaded({ gameServers: [] })));
      actions.next(loadGameServers());
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#loadGameServer', () => {
    it('should attempt to fetch the given game server', () => {
      const spy = spyOn(gameServersService, 'fetchGameServer').and.callThrough();
      effects.loadGameServer.subscribe(action =>
        expect(action).toEqual(gameServerLoaded({ gameServer: { id: 'FAKE_ID', name: 'FAKE_NAME' } } as any)));
      actions.next(loadGameServer({ gameServerId: 'FAKE_ID' }));
      expect(spy).toHaveBeenCalledWith('FAKE_ID');
    });
  });
});
