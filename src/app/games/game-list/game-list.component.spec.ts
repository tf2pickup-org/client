import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameListComponent } from './game-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '../games.service';
import { NEVER, of } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { PlayersService } from '@app/players/players.service';

class GamesServiceStub {
  fetchGames() { return NEVER; }
}

class PlayersServiceStub {
  fetchPlayerGames() { return NEVER; }
}

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(async(() => {
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
