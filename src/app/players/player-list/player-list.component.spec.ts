import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerListComponent } from './player-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { allPlayers } from '../selectors';

describe('PlayerListComponent', () => {
  let component: PlayerListComponent;
  let fixture: ComponentFixture<PlayerListComponent>;
  let store: MockStore<AppState>;

  beforeEach(async(() => {
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
    store.overrideSelector(allPlayers, []);

    fixture = TestBed.createComponent(PlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
