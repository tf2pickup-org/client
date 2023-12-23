import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { StaticGameServerComponent } from './static-game-server.component';

describe(StaticGameServerComponent.name, () => {
  let component: StaticGameServerComponent;
  let fixture: MockedComponentFixture<StaticGameServerComponent>;
  let routeData: Subject<unknown>;

  beforeEach(() => {
    routeData = new Subject();
  });

  beforeEach(() =>
    MockBuilder(StaticGameServerComponent)
      .mock(ActivatedRoute, {
        data: routeData.asObservable(),
      })
      .mock(Title, {
        setTitle: jasmine.createSpy('setTitle'),
      }),
  );

  beforeEach(() => {
    fixture = MockRender(StaticGameServerComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the game server is loaded', () => {
    beforeEach(() => {
      routeData.next({
        gameServer: {
          address: '127.0.0.1',
          port: '27015',
          name: 'A Team Fortress 2 server',
          id: '62544cdc4c2be3455df94cb4',
        },
      });
      fixture.detectChanges();
    });

    it('should render game server details', () => {
      const title = ngMocks.find('[title]').nativeElement as HTMLDivElement;
      expect(title.innerText).toEqual('A Team Fortress 2 server');
    });

    it('should set the page title', () => {
      const title = TestBed.inject(Title);
      expect(title.setTitle).toHaveBeenCalledOnceWith(
        'A Team Fortress 2 server',
      );
    });
  });
});
