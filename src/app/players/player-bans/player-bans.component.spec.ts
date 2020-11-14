/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerBansComponent } from './player-bans.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadPlayerBans, revokePlayerBan } from '../actions';
import { Location } from '@angular/common';

const paramMap = of(convertToParamMap({ id: 'FAKE_ID' }));

describe('PlayerBansComponent', () => {
  let component: PlayerBansComponent;
  let fixture: ComponentFixture<PlayerBansComponent>;
  let store: MockStore<any>;
  let storeDispatchSpy: jasmine.Spy;

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
      bans: {
        ids: [],
        entities: [],
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerBansComponent ],
      imports: [ RouterTestingModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { paramMap } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load player bans', () => {
    expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayerBans({ playerId: 'FAKE_ID' }));
  });

  describe('#revoke', () => {
    const ban = {
      player: 'FAKE_PLAYER_ID',
      start: new Date(),
      end: new Date(),
      reason: 'FAKE_PLAYER_BAN_REASON',
      admin: 'FAKE_ADMIN_ID',
      id: 'FAKE_PLAYER_BAN_ID'
    };

    it('should dispatch revoke action', () => {
      component.revoke(ban);
      expect(storeDispatchSpy).toHaveBeenCalledWith(revokePlayerBan({ playerBan: ban }));
    });
  });

  describe('#back()', () => {
    it('should call location.back()', () => {
      const location = TestBed.get(Location);
      const spy = spyOn(location, 'back');
      component.back();
      expect(spy).toHaveBeenCalled();
    });
  });
});
