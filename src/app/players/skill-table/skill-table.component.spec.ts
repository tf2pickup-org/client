import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SkillTableComponent } from './skill-table.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PlayersService } from '../players.service';
import { MockComponent } from 'ng-mocks';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { queueConfig } from '@app/queue/queue.selectors';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { first } from 'rxjs/operators';
import { Player } from '../models/player';
import { PlayerSkill } from '../models/player-skill';

const config = {
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
};

const allPlayers = [
  {
    id: 'FAKE_PLAYER_ID',
    name: 'FAKE_PLAYER_NAME',
    joinedAt: new Date(),
    steamId: 'FAKE_STEAM_ID',
    avatarUrl: 'whatever',
  },
];

const allPlayerSkills = [
  {
    player: 'FAKE_PLAYER_ID',
    skill: {
      scout: 1,
      soldier: 2,
      demoman: 3,
      medic: 4,
    },
  },
];

describe('SkillTableComponent', () => {
  let component: SkillTableComponent;
  let fixture: ComponentFixture<SkillTableComponent>;
  let store: MockStore;
  let playersService: jasmine.SpyObj<PlayersService>;
  let datatable: DatatableComponent;
  let allPlayersResponse: Subject<Player[]>;
  let allPlayerSkillResponse: Subject<PlayerSkill[]>;

  beforeEach(() => {
    allPlayersResponse = new Subject();
    allPlayerSkillResponse = new Subject();

    playersService = jasmine.createSpyObj<PlayersService>(PlayersService.name, ['fetchAllPlayers', 'fetchAllPlayerSkills']);
    playersService.fetchAllPlayers.and.returnValue(allPlayersResponse.asObservable().pipe(first()));
    playersService.fetchAllPlayerSkills.and.returnValue(allPlayerSkillResponse.asObservable().pipe(first()));
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkillTableComponent,
        MockComponent(DatatableComponent),
      ],
      providers: [
        provideMockStore(),
        { provide: PlayersService, useValue: playersService },
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(SkillTableComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(queueConfig, config);
    store.refreshState();

    fixture = TestBed.createComponent(SkillTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    datatable = fixture.debugElement.query(By.css('ngx-datatable')).componentInstance as DatatableComponent;
  });

  beforeEach(() => {
    allPlayersResponse.next(allPlayers);
    allPlayerSkillResponse.next(allPlayerSkills);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct columns', () => {
    expect(datatable.columns).toEqual([
      { prop: 'name' }, { prop: 'scout' }, { prop: 'soldier' }, { prop: 'demoman' }, { prop: 'medic' },
    ]);
  });

  it('should render correct rows', () => {
    expect(datatable.rows).toEqual([
      {
        id: 'FAKE_PLAYER_ID',
        name: 'FAKE_PLAYER_NAME',
        scout: 1,
        soldier: 2,
        demoman: 3,
        medic: 4,
      },
    ]);
  });
});
