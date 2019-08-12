import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlayerBanComponent } from './add-player-ban.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Location } from '@angular/common';
import { Router, convertToParamMap, ActivatedRoute } from '@angular/router';
import { playerBanAdded } from '../actions';
import { PlayerBan } from '../models/player-ban';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));
const actions = new Subject<Action>();

describe('AddPlayerBanComponent', () => {
  let component: AddPlayerBanComponent;
  let fixture: ComponentFixture<AddPlayerBanComponent>;

  const initialState = {
    players: {
      players: {
        ids: [ 'FAKE_ID' ],
        entities: {
          FAKE_ID: {
            id: 'FAKE_ID',
            name: 'FAKE_NAME',
          },
        },
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlayerBanComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Actions, useValue: actions },
        { provide: ActivatedRoute, useValue: { paramMap } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlayerBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to player ban list when adding a ban is done', () => {
    const spy = spyOn(TestBed.get(Router), 'navigate');
    actions.next(playerBanAdded({ playerBan: { player: 'FAKE_ID' } } as { playerBan: PlayerBan }));
    expect(spy).toHaveBeenCalledWith(['/player', 'FAKE_ID', 'bans']);
  });

  describe('#cancel()', () => {
    it('should call location.back()', () => {
      const spy = spyOn(TestBed.get(Location), 'back');
      component.cancel();
      expect(spy).toHaveBeenCalled();
    });
  });
});
