import { GameServersService } from '@app/game-servers/game-servers.service';
import { GameServerOption } from '@app/game-servers/models/game-server-option';
import { WithLoadingPipe } from '@app/shared/with-loading.pipe';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject, take } from 'rxjs';
import { GameServerOptionListComponent } from '../game-server-option-list/game-server-option-list.component';
import { GameServerOptionListDialogComponent } from './game-server-option-list-dialog.component';

describe('GameServerOptionListDialogComponent', () => {
  let component: GameServerOptionListDialogComponent;
  let fixture: MockedComponentFixture<GameServerOptionListDialogComponent>;
  let gameServerOptions: Subject<GameServerOption[]>;

  beforeEach(() => {
    gameServerOptions = new Subject();
  });

  beforeEach(() =>
    MockBuilder(GameServerOptionListDialogComponent)
      .mock(GameServersService, {
        fetchGameServerOptions: jasmine
          .createSpy('fetchGameServerOptions')
          .and.returnValue(gameServerOptions.asObservable().pipe(take(1))),
      })
      .mock(GameServerOptionListComponent)
      .keep(WithLoadingPipe),
  );

  beforeEach(() => {
    fixture = MockRender(GameServerOptionListDialogComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => gameServerOptions.complete());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when options are loaded', () => {
    const options = [
      {
        id: 'FAKE_GAMESERVER_1',
        provider: 'FAKE_PROVIDER',
        name: 'FAKE GAMESERVER',
      },
    ];

    beforeEach(() => {
      gameServerOptions.next(options);
      fixture.detectChanges();
    });

    it('should render options', () => {
      const gameServerOptionList = ngMocks.find('app-game-server-option-list')
        .componentInstance as GameServerOptionListComponent;
      expect(gameServerOptionList.gameServerOptions).toEqual(options);
    });
  });
});
