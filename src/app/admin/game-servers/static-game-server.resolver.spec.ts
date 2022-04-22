import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { GameServersService } from '@app/game-servers/game-servers.service';
import { GameServer } from '@app/game-servers/models/game-server';
import { MockProvider } from 'ng-mocks';
import { Subject, take } from 'rxjs';
import { StaticGameServerResolver } from './static-game-server.resolver';

describe('StaticGameServerResolver', () => {
  let resolver: StaticGameServerResolver;
  let gameServer: Subject<GameServer>;

  beforeEach(() => {
    gameServer = new Subject();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(GameServersService, {
          fetchGameServer: jasmine
            .createSpy('fetchGameServer')
            .and.returnValue(gameServer.pipe(take(1))),
        }),
      ],
    });
    resolver = TestBed.inject(StaticGameServerResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('#resolve()', () => {
    let mockGameServer: GameServer;

    beforeEach(() => {
      mockGameServer = {
        id: 'FAKE_GAMESERVER_ID',
        name: 'FAKE_GAMESERVER',
        address: '127.0.0.1',
        port: '27015',
        priority: 1,
        provider: 'static',
      };
    });

    it('should resolve the gameServer', done => {
      resolver
        .resolve({
          params: { gameServerId: 'FAKE_GAMESERVER_ID' },
        } as unknown as ActivatedRouteSnapshot)
        .subscribe(gameServer => {
          expect(gameServer).toEqual(mockGameServer);

          const gameServersService = TestBed.inject(GameServersService);
          expect(gameServersService.fetchGameServer).toHaveBeenCalledOnceWith(
            'FAKE_GAMESERVER_ID',
          );
          done();
        });
      gameServer.next(mockGameServer);
    });
  });
});
