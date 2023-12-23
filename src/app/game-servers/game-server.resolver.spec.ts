import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { GameServerResolver } from './game-server.resolver';
import { GameServersService } from './game-servers.service';
import { ActivatedRouteSnapshot } from '@angular/router';

describe(GameServerResolver.name, () => {
  let resolver: GameServerResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(GameServersService, {
          fetchGameServer: jasmine
            .createSpy('fetchGameServer')
            .and.callFake(id => of({ id })),
        }),
      ],
    });
    resolver = TestBed.inject(GameServerResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve the game server', done => {
    resolver
      .resolve({
        params: { gameServerId: 'FAKE_GAME_SERVER_ID' },
      } as unknown as ActivatedRouteSnapshot)
      .subscribe(gameServer => {
        expect(gameServer.id).toEqual('FAKE_GAME_SERVER_ID');

        const gameServersService = TestBed.inject(GameServersService);
        expect(gameServersService.fetchGameServer).toHaveBeenCalledWith(
          'FAKE_GAME_SERVER_ID',
        );

        done();
      });
  });
});
