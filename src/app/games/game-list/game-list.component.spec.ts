import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameListComponent } from './game-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '../games.service';
import { NEVER, of, Subject } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { PlayersService } from '@app/players/players.service';
import { By } from '@angular/platform-browser';
import { PaginatedList } from '@app/core/models/paginated-list';
import { Game } from '../models/game';

class GamesServiceStub {
  results = new Subject<PaginatedList<Game>>();
  fetchGames() { return this.results.asObservable(); }
}

class PlayersServiceStub {
  fetchPlayerGames() { return NEVER; }
}

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;
  let gamesService: GamesServiceStub;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListComponent ],
      imports: [
        RouterTestingModule,
        NgxPaginationModule,
      ],
      providers: [
        { provide: GamesService, useClass: GamesServiceStub },
        { provide: PlayersService, useClass: PlayersServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    gamesService = TestBed.get(GamesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render pagination controls unless there is more than 1 page', () => {
    gamesService.results.next({ itemCount: 10, results: [] });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('nav'))).toBeFalsy();
  });

  it('should display \'no games\' text when there are no games', () => {
    gamesService.results.next({ itemCount: 0, results: [] });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('div>span.text-muted'))).toBeTruthy();
  });

  it('should render pagination controls when there are more pages', () => {
    gamesService.results.next({ itemCount: 11, results: [] });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('nav'))).toBeTruthy();
  });

  describe('#getPage()', () => {
    describe('without playerId', () => {
      it('should load a given page', () => {
        const spy = spyOn(TestBed.get(GamesService), 'fetchGames').and.returnValue(of({ itemCount: 50, results: [] }));
        component.getPage(1);
        expect(spy).toHaveBeenCalledWith(0, 10);

        component.getPage(5);
        expect(spy).toHaveBeenCalledWith(40, 10);
      });
    });

    describe('with playerId', () => {
      beforeEach(() => component.playerId = 'FAKE_PLAYER_ID');

      it('should load a given page', () => {
        const spy = spyOn(TestBed.get(PlayersService), 'fetchPlayerGames').and.returnValue(of({ itemCount: 50, results: [] }));
        component.getPage(1);
        expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID', 0, 10);

        component.getPage(3);
        expect(spy).toHaveBeenCalledWith('FAKE_PLAYER_ID', 20, 10);
      });
    });
  });

});
