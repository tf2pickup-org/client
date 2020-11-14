/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerEditComponent } from './player-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { loadPlayerSkill, playerEdited, loadPlayer, setPlayerName, setPlayerSkill } from '../actions';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));
const actions = new Subject<Action>();

describe('PlayerEditComponent', () => {
  let component: PlayerEditComponent;
  let fixture: ComponentFixture<PlayerEditComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;
  let setTitleSpy: jasmine.Spy;

  const initialState = {
    players: {
      players: {
        ids: [],
        entities: { },
      },
    },
  };

  beforeEach(waitForAsync(() => {
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
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');
    setTitleSpy = spyOn(TestBed.get(Title), 'setTitle').and.callThrough();
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

  it('should load player data', () => {
    expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayer({ playerId: 'FAKE_ID' }));
  });

  describe('#cancel()', () => {
    it('should navigate back to the player details page', () => {
      const spy = spyOn(TestBed.get(Location), 'back');
      component.cancel();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#onKeyDown()', () => {
    it('should navigate back to the player details page', () => {
      const spy = spyOn(TestBed.get(Location), 'back');
      component.onKeyDown();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('with player', () => {
    beforeEach(() => {
      store.setState({
        players: {
          players: {
            ids: [
              'FAKE_ID'
            ],
            entities: {
              FAKE_ID: {
                name: 'maly',
                id: 'FAKE_ID',
              }
            },
            locked: false
          },
        },
      });
    });

    it('should set the title', () => {
      expect(setTitleSpy).toHaveBeenCalledWith(jasmine.stringMatching('maly'));
    });

    it('should set the player name', () => {
      expect(component.player.value.name).toEqual('maly');
    });

    describe('#save()', () => {
      it('should dispatch the setPlayerName action', () => {
        component.player.value.name = 'maly2';
        component.save();
        expect(storeDispatchSpy).toHaveBeenCalledWith(setPlayerName({ playerId: 'FAKE_ID', name: 'maly2' }));
      });

      it('should redirect to the player details after saving is done', () => {
        const spy = spyOn(TestBed.get(Router), 'navigate');
        component.player.value.name = 'maly2';
        component.save();
        actions.next(playerEdited({ player: { id: 'FAKE_ID' } } as any));
        expect(spy).toHaveBeenCalledWith(['/player', 'FAKE_ID']);
      });

      it('should do nothing if the name has not changed', () => {
        component.save();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(setPlayerName({ playerId: 'FAKE_ID', name: 'maly' }));
      });
    });

    describe('and with skill', () => {
      describe('#save()', () => {
        it('should dispatch the setPlayerSkill action', () => {
          component.player.value.skill = { demoman: 5 };
          component.save();
          expect(storeDispatchSpy).toHaveBeenCalledWith(setPlayerSkill({ playerId: 'FAKE_ID', skill: { demoman: 5 }}));
        });
      });
    });
  });
});
