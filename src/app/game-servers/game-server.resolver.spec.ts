import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GameServerResolver } from './game-server.resolver';
import { loadGameServer } from './game-servers.actions';

describe(GameServerResolver.name, () => {
  let resolver: GameServerResolver;
  let initialState: any;

  beforeEach(() => {
    initialState = {
      gameServers: {
        ids: [],
        entities: {},
      },
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });
    resolver = TestBed.inject(GameServerResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe("when the game server isn't fetched yet", () => {
    it('should attempt to load the game server', () => {
      const spy = spyOn(TestBed.inject(MockStore), 'dispatch');
      resolver
        .resolve({ params: { gameServerId: 'FAKE_GAME_SERVER_ID' } } as any)
        .subscribe();
      expect(spy).toHaveBeenCalledWith(
        loadGameServer({ gameServerId: 'FAKE_GAME_SERVER_ID' }),
      );
    });
  });

  describe('when the game server is fetched', () => {
    beforeEach(() => {
      const store = TestBed.inject(MockStore);
      store.setState({
        gameServers: {
          ids: ['FAKE_GAME_SERVER_ID'],
          entities: {
            FAKE_GAME_SERVER_ID: {
              isAvailable: true,
              isOnline: true,
              resolvedIpAddresses: ['127.0.0.1'],
              name: 'test',
              address: '127.0.0.1',
              port: '27015',
              mumbleChannelName: '1',
              createdAt: '2021-03-20T21:58:51.698Z',
              id: 'FAKE_GAME_SERVER_ID',
            },
          },
        },
      });
    });

    it('should resolve with the the game server', done => {
      resolver
        .resolve({ params: { gameServerId: 'FAKE_GAME_SERVER_ID' } } as any)
        .subscribe(gameServer => {
          expect(gameServer.id).toEqual('FAKE_GAME_SERVER_ID');
          done();
        });
    });
  });
});
