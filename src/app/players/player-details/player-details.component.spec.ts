import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerDetailsComponent } from './player-details.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PlayersService } from '../players.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadPlayer } from '../players.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class BsModalServiceStub {

}

class PlayersServiceStub {
  fetchPlayerGames() { return of([]); }
  fetchPlayerStats() { return of({}) };
}

class RouterStub {
  navigate(params: string[]) { }
}

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

fdescribe('PlayerDetailsComponent', () => {
  let component: PlayerDetailsComponent;
  let fixture: ComponentFixture<PlayerDetailsComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;

  const initialState = { players: { ids: [], entities: { } } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDetailsComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: BsModalService, useClass: BsModalServiceStub },
        { provide: PlayersService, useClass: PlayersServiceStub  },
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { paramMap } },
        { provide: Router, useClass: RouterStub },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the player if it is not in the store yet', () => {
    expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayer({ playerId: 'FAKE_ID' }));
  });

  it('should load player\'s games', () => {
    expect(component.games).toBeTruthy();
  });

  it('should load  player\'s stats', () => {
    expect(component.stats).toBeTruthy();
  });
});
