import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerSkillTableComponent } from './player-skill-table.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PlayersService } from '@app/players/players.service';
import { MockComponent } from 'ng-mocks';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { queueConfig } from '@app/queue/queue.selectors';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { first } from 'rxjs/operators';
import { Player } from '@app/players/models/player';
import { PlayerSkill } from '@app/players/models/player-skill';
import { QueueConfig } from '@app/queue/models/queue-config';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

const config: QueueConfig = {
  teamCount: 2,
  classes: [
    {
      name: Tf2ClassName.scout,
      count: 2,
    },
    {
      name: Tf2ClassName.soldier,
      count: 2,
    },
    {
      name: Tf2ClassName.demoman,
      count: 1,
    },
    {
      name: Tf2ClassName.medic,
      count: 1,
    },
  ],
};

const allPlayers = [
  {
    id: 'FAKE_PLAYER_ID',
    name: 'FAKE_PLAYER_NAME',
    joinedAt: new Date(),
    steamId: 'FAKE_STEAM_ID',
    roles: [],
    avatar: {
      small: 'FAKE_SMALL_AVATAR_URL',
      medium: 'FAKE_MEDIUM_AVATAR_URL',
      large: 'FAKE_LARGE_AVATAR_URL',
    },
    _links: [],
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

describe(PlayerSkillTableComponent.name, () => {
  let component: PlayerSkillTableComponent;
  let fixture: ComponentFixture<PlayerSkillTableComponent>;
  let store: MockStore;
  let playersService: jasmine.SpyObj<PlayersService>;
  let datatable: DatatableComponent;
  let allPlayersResponse: Subject<Player[]>;
  let allPlayerSkillResponse: Subject<PlayerSkill[]>;

  beforeEach(() => {
    allPlayersResponse = new Subject();
    allPlayerSkillResponse = new Subject();

    playersService = jasmine.createSpyObj<PlayersService>(PlayersService.name, [
      'fetchAllPlayers',
      'fetchAllPlayerSkills',
    ]);
    playersService.fetchAllPlayers.and.returnValue(
      allPlayersResponse.asObservable().pipe(first()),
    );
    playersService.fetchAllPlayerSkills.and.returnValue(
      allPlayerSkillResponse.asObservable().pipe(first()),
    );
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          PlayerSkillTableComponent,
          MockComponent(DatatableComponent),
        ],
        providers: [
          provideMockStore(),
          { provide: PlayersService, useValue: playersService },
        ],
      })
        // https://github.com/angular/angular/issues/12313
        .overrideComponent(PlayerSkillTableComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    }),
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(queueConfig, config);
    store.refreshState();

    fixture = TestBed.createComponent(PlayerSkillTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    datatable = fixture.debugElement.query(By.css('ngx-datatable'))
      .componentInstance as DatatableComponent;
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
      { prop: 'name' },
      { prop: 'scout' },
      { prop: 'soldier' },
      { prop: 'demoman' },
      { prop: 'medic' },
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
