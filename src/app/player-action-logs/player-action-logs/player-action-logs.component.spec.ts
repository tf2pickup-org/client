import { TestBed } from '@angular/core/testing';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject, take } from 'rxjs';
import { PlayerAction } from '../models/player-action';
import { PlayerActionLogsService } from '../player-action-logs.service';
import { PlayerActionLogsComponent } from './player-action-logs.component';

const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

describe('PlayerActionLogsComponent', () => {
  let component: PlayerActionLogsComponent;
  let fixture: MockedComponentFixture<PlayerActionLogsComponent>;
  let actionLogs: Subject<PlayerAction[]>;
  let playerActionLogsService: jasmine.SpyObj<PlayerActionLogsService>;

  beforeEach(() => {
    actionLogs = new Subject();
  });

  beforeEach(() =>
    MockBuilder(PlayerActionLogsComponent).mock(PlayerActionLogsService, {
      fetchPlayerActions: jasmine
        .createSpy('fetchPlayerActions')
        .and.callFake(() => actionLogs.pipe(take(1))),
    }),
  );

  beforeEach(() => {
    fixture = MockRender(PlayerActionLogsComponent);
    component = fixture.point.componentInstance;

    playerActionLogsService = TestBed.inject(
      PlayerActionLogsService,
    ) as jasmine.SpyObj<PlayerActionLogsService>;

    fixture.detectChanges();
  });

  beforeEach(async () => {
    await wait(600);
    actionLogs.next([]);
  });

  afterEach(() => {
    actionLogs.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should query for all actions initially', () => {
    expect(playerActionLogsService.fetchPlayerActions).toHaveBeenCalledWith({
      limit: 10,
      filter: {},
    });
  });

  describe('when players are filtered', () => {
    beforeEach(async () => {
      const nameInput = ngMocks.find('#player-name-input')
        .nativeElement as HTMLInputElement;
      nameInput.value = 'FAKE_NAME_FILTER';
      // nameInput.dispatchEvent(new Event('input'));
      nameInput.dispatchEvent(new KeyboardEvent('keyup'));
      fixture.detectChanges();

      await wait(600);
      fixture.detectChanges();
    });

    it('should refresh player actions', () => {
      expect(playerActionLogsService.fetchPlayerActions).toHaveBeenCalledWith({
        limit: 10,
        filter: {
          'player.name': 'FAKE_NAME_FILTER',
        },
      });
    });
  });
});
