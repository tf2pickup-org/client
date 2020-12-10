import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameListComponent } from './game-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '../games.service';
import { Observable, Subject } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { PaginatedList } from '@app/core/models/paginated-list';
import { Game } from '../models/game';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;
  let gamesService: jasmine.SpyObj<GamesService>;
  let results: Subject<PaginatedList<Game>>;
  let queryParams: Subject<any>;
  let activatedRoute: { queryParamMap: Observable<any> };
  let router: Router;

  beforeEach(() => {
    queryParams = new Subject();
    activatedRoute = { queryParamMap: queryParams.asObservable() };
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'games', component: GameListComponent },
        ]),
        NgxPaginationModule,
      ],
      providers: [
        {
          provide: GamesService,
          useValue: jasmine.createSpyObj<GamesService>(GamesService.name, ['fetchGames']),
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
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

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callFake((commands, extras) => {
      queryParams.next(convertToParamMap(extras.queryParams || { }));
      return Promise.resolve(true);
    });
  });

  beforeEach(() => {
    component.ngOnInit();
    queryParams.next(convertToParamMap({ page: null }));
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
      expect(fixture.debugElement.query(By.css('.pagination'))).toBeTruthy();
    });

    it('should request given page', () => {
      const second = fixture.debugElement.query(By.css('.pagination__item:nth-child(3) a')).nativeElement as HTMLAnchorElement;
      second.click();
      expect(gamesService.fetchGames).toHaveBeenCalledWith(5, 5);
    });
  });

});
