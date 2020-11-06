import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameListComponent } from './game-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '../games.service';
import { Subject } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { PaginatedList } from '@app/core/models/paginated-list';
import { Game } from '../models/game';

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;
  let gamesService: jasmine.SpyObj<GamesService>;
  let results: Subject<PaginatedList<Game>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListComponent ],
      imports: [
        RouterTestingModule,
        NgxPaginationModule,
      ],
      providers: [
        {
          provide: GamesService,
          useValue: jasmine.createSpyObj<GamesService>(GamesService.name, ['fetchGames']),
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    results = new Subject();
    gamesService = TestBed.inject(GamesService) as jasmine.SpyObj<GamesService>;
    gamesService.fetchGames.and.returnValue(results.asObservable());

    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when there is not more than 1 page', () => {
    beforeEach(() => {
      results.next({ itemCount: 5, results: [ ] });
      fixture.detectChanges();
    });

    it('should not render pagination controls', () => {
      expect(fixture.debugElement.query(By.css('nav'))).toBeFalsy();
    });
  });

  describe('when there are more pages', () => {
    beforeEach(() => {
      results.next({ itemCount: 7, results: [ ] });
      fixture.detectChanges();
    });

    it('should render navigation controls', () => {
      expect(fixture.debugElement.query(By.css('nav'))).toBeTruthy();
    });

    it('should request given page', () => {
      const second = fixture.debugElement.query(By.css('nav ul li:nth-child(3) a')).nativeElement as HTMLAnchorElement;
      second.click();
      expect(gamesService.fetchGames).toHaveBeenCalledWith(5, 5);
    });
  });

});
