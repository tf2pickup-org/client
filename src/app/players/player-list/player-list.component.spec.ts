import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerListComponent } from './player-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { RouterTestingModule } from '@angular/router/testing';
import { MemoizedSelector } from '@ngrx/store';
import { allPlayers } from '../selectors';
import { By } from '@angular/platform-browser';
import { IsAdminPipe } from '../is-admin.pipe';
import { Player } from '../models/player';
import { PlayerRole } from '../models/player-role';

describe('PlayerListComponent', () => {
  let component: PlayerListComponent;
  let fixture: ComponentFixture<PlayerListComponent>;
  let store: MockStore<AppState>;
  let allPlayersSelector: MemoizedSelector<AppState, Player[]>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerListComponent, IsAdminPipe],
      imports: [RouterTestingModule],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    allPlayersSelector = store.overrideSelector(allPlayers, []);

    fixture = TestBed.createComponent(PlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with players', () => {
    beforeEach(() => {
      allPlayersSelector.setResult([
        {
          id: 'FAKE_ID',
          name: 'FAKE_NAME',
          roles: [] as PlayerRole[],
        } as Player,
      ]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should render correct link', () => {
      const anchor = fixture.debugElement.query(By.css('a'))
        .nativeElement as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.href).toMatch(/\/player\/FAKE_ID$/);
      expect(anchor.innerText).toEqual('FAKE_NAME');
    });
  });

  it('should render an admin badge', () => {
    allPlayersSelector.setResult([
      { id: 'FAKE_ID', name: 'FAKE_NAME', roles: ['admin'] } as Player,
    ]);
    store.refreshState();
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('i-tabler[name=star]'))
      .nativeElement as HTMLElement;
    expect(badge).toBeTruthy();
  });
});
