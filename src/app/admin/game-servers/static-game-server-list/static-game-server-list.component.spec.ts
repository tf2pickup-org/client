import { GameServersService } from '@app/game-servers/game-servers.service';
import { GameServer } from '@app/game-servers/models/game-server';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject, take } from 'rxjs';
import { StaticGameServerListComponent } from './static-game-server-list.component';

describe(StaticGameServerListComponent.name, () => {
  let component: StaticGameServerListComponent;
  let fixture: MockedComponentFixture<StaticGameServerListComponent>;
  let staticGameServers: Subject<GameServer[]>;

  beforeEach(() => {
    staticGameServers = new Subject();
  });

  beforeEach(() =>
    MockBuilder(StaticGameServerListComponent).mock(GameServersService, {
      fetchStaticGameServers: jasmine
        .createSpy('fetchStaticGameServers')
        .and.returnValue(staticGameServers.pipe(take(1))),
    }),
  );

  beforeEach(() => {
    fixture = MockRender(StaticGameServerListComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the game servers are fetched', () => {
    beforeEach(() => {
      staticGameServers.next([
        {
          address: '127.0.0.1',
          port: '27015',
          provider: 'static',
          createdAt: new Date('2022-04-11T15:44:28.823Z'),
          customVoiceChannelName: '',
          lastHeartbeatAt: new Date(),
          name: 'A Team Fortress 2 server',
          priority: 1,
          id: '62544cdc4c2be3455df94cb4',
        },
      ]);
      fixture.detectChanges();
    });

    it('should render the game servers', () => {
      const items = ngMocks.findAll('a.game-server-item');
      expect(items.length).toBe(1);
    });
  });
});
