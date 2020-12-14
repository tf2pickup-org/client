import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SkillTableComponent } from './skill-table.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/app.state';
import { Store, MemoizedSelector } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Player } from '../models/player';
import { allPlayers } from '../selectors';
import { loadPlayers, loadAllPlayerSkills } from '../actions';

const initialState = {
  queue: {
    config: {
      teamCount: 2,
      classes: [
        {
          name: 'scout',
          count: 2
        },
        {
          name: 'soldier',
          count: 2
        },
        {
          name: 'demoman',
          count: 1
        },
        {
          name: 'medic',
          count: 1
        }
      ],
      readyUptimeout: 40000,
      queueReadyTimeout: 60000,
      maps: [
        'cp_process_final',
        'cp_snakewater_final1',
        'cp_sunshine',
        'cp_granary_pro_rc8',
        'cp_gullywash_final1',
        'cp_reckoner_rc2',
        'cp_prolands_rc2t'
      ],
      execConfigs: [
        'etf2l_6v6_5cp'
      ]
    },
  },
};

describe('SkillTableComponent', () => {
  let component: SkillTableComponent;
  let fixture: ComponentFixture<SkillTableComponent>;
  let store: MockStore<AppState>;
  let allPlayersSelector: MemoizedSelector<AppState, Player[]>;
  let storeDispatchSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillTableComponent ],
      providers: [
        provideMockStore({ initialState }),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    storeDispatchSpy = spyOn(store, 'dispatch');
    allPlayersSelector = store.overrideSelector(allPlayers, []);

    fixture = TestBed.createComponent(SkillTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct columns', () => {
    component.columns.subscribe(columns => expect(columns).toEqual([
      { prop: 'name' }, { prop: 'scout' }, { prop: 'soldier' }, { prop: 'demoman' }, { prop: 'medic' },
    ]));
  });

  it('should map rows', () => {
    allPlayersSelector.setResult([
      {
        id: 'FAKE_PLAYER_ID',
        name: 'FAKE_PLAYER_NAME',
        joinedAt: new Date(),
        steamId: 'FAKE_STEAM_ID',
        avatarUrl: 'whatever',
        skill: {
          scout: 1,
          soldier: 2,
          demoman: 3,
          medic: 4,
        },
      },
    ]);

    store.refreshState();
    component.players.subscribe(players => expect(players).toEqual([
      {
        id: 'FAKE_PLAYER_ID',
        name: 'FAKE_PLAYER_NAME',
        scout: 1,
        soldier: 2,
        demoman: 3,
        medic: 4,
      },
    ]));
  });

  describe('#ngOnInit()', () => {
    it('should load all players', () => {
      component.ngOnInit();
      expect(storeDispatchSpy).toHaveBeenCalledWith(loadPlayers());
    });

    it('should load all player skills', () => {
      component.ngOnInit();
      expect(storeDispatchSpy).toHaveBeenCalledWith(loadAllPlayerSkills());
    });
  });
});
