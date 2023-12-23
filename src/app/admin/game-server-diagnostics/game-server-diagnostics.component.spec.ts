import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GameServersService } from '@app/game-servers/game-servers.service';
import { TablerIconComponent } from 'angular-tabler-icons';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { Subject } from 'rxjs';
import { DiagnosticCheckInfoComponent } from './diagnostic-check-info/diagnostic-check-info.component';
import { GameServerDiagnosticsComponent } from './game-server-diagnostics.component';

describe(GameServerDiagnosticsComponent.name, () => {
  let component: GameServerDiagnosticsComponent;
  let fixture: MockedComponentFixture<GameServerDiagnosticsComponent>;
  let routeData: Subject<unknown>;
  let diagnostics: Subject<unknown>;

  beforeEach(() => {
    routeData = new Subject();
    diagnostics = new Subject();
  });

  beforeEach(() =>
    MockBuilder(GameServerDiagnosticsComponent)
      .mock(DiagnosticCheckInfoComponent)
      .mock(TablerIconComponent)
      .mock(ActivatedRoute, {
        data: routeData.asObservable(),
      })
      .mock(GameServersService, {
        runDiagnostics: jasmine
          .createSpy('runDiagnostics')
          .and.returnValue(diagnostics.asObservable()),
      })
      .mock(Title),
  );

  beforeEach(() => {
    fixture = MockRender(GameServerDiagnosticsComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    routeData.next({
      gameServer: { name: 'FAKE_GAME_SERVER', id: 'FAKE_GAME_SERVER_ID' },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title', () => {
    const title = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    expect(title.setTitle).toHaveBeenCalledOnceWith(
      jasmine.stringMatching(/FAKE_GAME_SERVER diagnostics/),
    );
  });

  it('should render header', () => {
    const header = ngMocks.find('h6').nativeElement as HTMLElement;
    expect(header.innerText).toEqual('FAKE_GAME_SERVER diagnostics');
  });

  it('should run diagnostics', () => {
    const gameServersService = TestBed.inject(
      GameServersService,
    ) as jasmine.SpyObj<GameServersService>;
    expect(gameServersService.runDiagnostics).toHaveBeenCalledOnceWith(
      'FAKE_GAME_SERVER_ID',
    );
  });

  describe('when the run is initialized', () => {
    beforeEach(() => {
      diagnostics.next({
        id: 'FAKE_DIAGNOSTIC_RUN_ID',
        launchedAt: new Date(),
        gameServer: 'FAKE_GAME_SERVER_ID',
        checks: [],
        status: 'pending',
      });

      fixture.detectChanges();
    });

    it('should render the run status', () => {
      const span = ngMocks.find('span.run-status')
        .nativeElement as HTMLSpanElement;
      expect(span.innerText).toEqual('Status: pending');
    });
  });
});
