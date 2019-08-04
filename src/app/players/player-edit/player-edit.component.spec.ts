import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerEditComponent } from './player-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { loadPlayerSkill, playerEdited } from '../players.actions';
import { Player } from '../models/player';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));
const actions = new Subject<Action>();

class RouterStub {
  navigate(params: string[]) { }
}

describe('PlayerEditComponent', () => {
  let component: PlayerEditComponent;
  let fixture: ComponentFixture<PlayerEditComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;
  const initialState = { players: { ids: [], entities: { } } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerEditComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap } },
        provideMockStore({ initialState }),
        { provide: Actions, useValue: actions },
        { provide: Router, useClass: RouterStub },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load player skill', () => {
    expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayerSkill({ playerId: 'FAKE_ID' }));
  });

  it('should redirect to player details after saving is done', () => {
    const spy = spyOn(TestBed.get(Router), 'navigate');
    actions.next(playerEdited({ player: { id: 'FAKE_ID' } } as { player: Player }));
    expect(spy).toHaveBeenCalledWith(['/player', 'FAKE_ID']);
  });
});
