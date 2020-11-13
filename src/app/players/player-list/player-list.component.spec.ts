import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerListComponent } from './player-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { allPlayers } from '../selectors';
import { By } from '@angular/platform-browser';

describe('PlayerListComponent', () => {
  let component: PlayerListComponent;
  let fixture: ComponentFixture<PlayerListComponent>;
  let store: MockStore<AppState>;
  let allPlayersSelector: MemoizedSelector<AppState, any[]>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerListComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        provideMockStore(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    allPlayersSelector = store.overrideSelector(allPlayers, []);

    fixture = TestBed.createComponent(PlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct link', () => {
    allPlayersSelector.setResult([{ id: 'FAKE_ID', name: 'FAKE_NAME' }]);
    store.refreshState();
    fixture.detectChanges();

    const anchor = fixture.debugElement.query(By.css('a.list-group-item.list-group-item-action')).nativeElement as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
    expect(anchor.href).toMatch(/\/player\/FAKE_ID$/);
    expect(anchor.innerText).toEqual('FAKE_NAME');
  });

  it('should render an admin badge', () => {
    allPlayersSelector.setResult([{ id: 'FAKE_ID', name: 'FAKE_NAME', role: 'admin' }]);
    store.refreshState();
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('span.badge')).nativeElement as HTMLElement;
    expect(badge.classList.contains('badge-warning')).toBe(true);
    expect(badge.innerText).toEqual('admin');
  });
});
