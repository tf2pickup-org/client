/* eslint-disable id-blacklist */
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { first } from 'rxjs/operators';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockPipe } from 'ng-mocks';
import { MapThumbnailPipe } from '@app/shared/map-thumbnail.pipe';

const mockGameListResponse = {
  results: [
    {
      id: 'FAKE_GAME_ID',
      state: 'ended',
      number: 1905,
      map: 'cp_reckoner_rc5',
      slots: [],
      launchedAt: new Date('2020-12-08T17:24:21.003Z'),
    },
  ],
  itemCount: 1905,
};

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
      declarations: [
        GameListComponent,
        MockPipe(MapThumbnailPipe, value => new Subject()),
      ],
      imports: [RouterTestingModule, NgxPaginationModule, NoopAnimationsModule],
      providers: [
        {
          provide: GamesService,
          useValue: jasmine.createSpyObj<GamesService>(GamesService.name, [
            'fetchGames',
          ]),
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(GameListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    results = new Subject();
    gamesService = TestBed.inject(GamesService) as jasmine.SpyObj<GamesService>;
    gamesService.fetchGames.and.returnValue(
      results.asObservable().pipe(first()),
    );

    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callFake((commands, extras) => {
      queryParams.next(convertToParamMap(extras.queryParams || {}));
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
      results.next({
        results: mockGameListResponse.results,
        itemCount: 5,
      } as any);
      fixture.detectChanges();
    });

    it('should not render pagination controls', () => {
      expect(fixture.debugElement.query(By.css('.pagination'))).toBeFalsy();
    });
  });

  describe('when there are more pages', () => {
    beforeEach(() => {
      results.next(mockGameListResponse as any);

      // This is a workaround, I have no idea how to make Angular call the animation.done callback...
      component.onAnimationDone();

      fixture.detectChanges();
    });

    it('should render navigation controls', () => {
      expect(fixture.debugElement.query(By.css('.pagination'))).toBeTruthy();
    });

    it('should request given page', () => {
      const second = fixture.debugElement.query(
        By.css('.pagination__item:nth-child(3) a'),
      ).nativeElement as HTMLAnchorElement;
      second.click();
      expect(gamesService.fetchGames).toHaveBeenCalledWith(5, 5);
    });
  });
});
