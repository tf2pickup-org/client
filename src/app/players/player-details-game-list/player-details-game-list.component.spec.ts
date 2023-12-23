/* eslint-disable id-blacklist */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginatedList } from '@app/core/models/paginated-list';
import { Game } from '@app/games/models/game';
import { GameClassIconComponent } from '@app/shared/game-class-icon/game-class-icon.component';
import { MockComponent } from 'ng-mocks';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject } from 'rxjs';
import { Player } from '../models/player';
import { PlayersService } from '../players.service';
import { PlayerDetailsGameListComponent } from './player-details-game-list.component';

describe('PlayerDetailsGameListComponent', () => {
  let component: PlayerDetailsGameListComponent;
  let fixture: ComponentFixture<PlayerDetailsGameListComponent>;
  let playersService: jasmine.SpyObj<PlayersService>;
  let results: Subject<PaginatedList<Game>>;

  beforeEach(() => {
    results = new Subject();
    playersService = jasmine.createSpyObj<PlayersService>(PlayersService.name, [
      'fetchPlayerGames',
    ]);
    playersService.fetchPlayerGames.and.returnValue(results.asObservable());
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerDetailsGameListComponent,
        MockComponent(GameClassIconComponent),
      ],
      imports: [RouterTestingModule, NgxPaginationModule],
      providers: [{ provide: PlayersService, useValue: playersService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => results.unsubscribe());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with playerId', () => {
    beforeEach(() => {
      component.playerId = 'FAKE_PLAYER_ID';
      fixture.detectChanges();
    });

    it('should load initial page of players games', () => {
      expect(playersService.fetchPlayerGames).toHaveBeenCalledWith(
        'FAKE_PLAYER_ID',
        0,
        10,
      );
    });

    describe('when there are no games', () => {
      beforeEach(() => {
        results.next({ results: [], itemCount: 0 });
      });

      it('should render no games', () => {
        const div = fixture.debugElement.query(By.css('.no-games'))
          .nativeElement as HTMLDivElement;
        expect(div).toBeTruthy();
        expect(div.innerText).toEqual('no games');
      });
    });

    describe('when there are games', () => {
      let previousPageAnchor: HTMLAnchorElement;
      let nextPageAnchor: HTMLAnchorElement;

      beforeEach(() => {
        results.next({
          results: [
            {
              id: 'FAKE_GAME_1',
              number: 1,
              launchedAt: new Date(),
              map: 'cp_fake_rc1',
              state: 'ended',
              slots: [
                {
                  player: { id: 'FAKE_PLAYER_ID' } as Player,
                  gameClass: 'soldier',
                  team: 'blu',
                  connectionStatus: 'offline',
                  status: 'active',
                },
                {
                  player: { id: 'FAKE_PLAYER_ID_2' } as Player,
                  gameClass: 'medic',
                  team: 'red',
                  connectionStatus: 'offline',
                  status: 'active',
                },
              ],
              connectInfoVersion: 1,
            },
          ],
          itemCount: 20,
        });

        fixture.detectChanges();

        previousPageAnchor = fixture.debugElement.query(
          By.css('nav ul li:nth-child(1) a'),
        ).nativeElement as HTMLAnchorElement;
        nextPageAnchor = fixture.debugElement.query(
          By.css('nav ul li:nth-child(3) a'),
        ).nativeElement as HTMLAnchorElement;
      });

      it('should render pagination controls', () => {
        expect(previousPageAnchor).toBeTruthy();
        expect(previousPageAnchor.classList.contains('disabled')).toBe(false);
        expect(nextPageAnchor).toBeTruthy();
      });

      it('should render the game', () => {
        const gameAnchor = fixture.debugElement.query(
          By.css('li.game-list-item a'),
        ).nativeElement as HTMLAnchorElement;
        expect(gameAnchor).toBeTruthy();
        expect(gameAnchor.href).toMatch(/\/game\/FAKE_GAME_1$/);

        const gameClassIcon = fixture.debugElement.query(
          By.css('li.game-list-item a app-game-class-icon'),
        ).componentInstance as GameClassIconComponent;

        expect(gameClassIcon.gameClass).toEqual('soldier');
      });

      describe('when the next page is being loaded', () => {
        beforeEach(() => {
          nextPageAnchor.click();
          fixture.detectChanges();
        });

        it('should render loading gif', () => {
          const loading = fixture.debugElement.query(By.css('.loading-wrapper'))
            .nativeElement as HTMLDivElement;
          expect(loading).toBeTruthy();
        });

        it('should request next page', () => {
          expect(playersService.fetchPlayerGames).toHaveBeenCalledWith(
            'FAKE_PLAYER_ID',
            10,
            10,
          );
        });
      });
    });
  });
});
