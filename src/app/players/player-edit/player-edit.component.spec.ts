import { TestBed } from '@angular/core/testing';
import { PlayerEditComponent } from './player-edit.component';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  MockBuilder,
  MockedComponentFixture,
  MockRender,
  ngMocks,
} from 'ng-mocks';
import { PlayersService } from '../players.service';
import { filter, map, take } from 'rxjs/operators';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { loadPlayer, playerEdited } from '../actions';
import { Title } from '@angular/platform-browser';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { PlayerEditSkillComponent } from '../player-edit-skill/player-edit-skill.component';
import { FeatherComponent } from 'angular-feather';
import { Location } from '@angular/common';
import { Player } from '../models/player';
import { ConfigurationService } from '@app/configuration/configuration.service';

describe(PlayerEditComponent.name, () => {
  let fixture: MockedComponentFixture;
  let component: PlayerEditComponent;
  let routeParams: Subject<any>;
  let store: MockStore;
  let playersService: jasmine.SpyObj<PlayersService>;
  let saveButton: HTMLButtonElement;
  let nameInput: HTMLInputElement;
  let fetchPlayerSkill: Subject<{ [gameClass in Tf2ClassName]?: number }>;
  let setPlayerName: Subject<Player>;
  let setPlayerSkill: Subject<any>;
  let configuration: Subject<Record<string, any>>;

  beforeEach(() => {
    routeParams = new Subject();
    fetchPlayerSkill = new Subject();
    setPlayerName = new Subject();
    setPlayerSkill = new Subject();
    configuration = new Subject();
  });

  beforeEach(() =>
    MockBuilder(PlayerEditComponent)
      .provide(
        provideMockStore({
          initialState: {
            players: {
              players: {
                ids: [],
                entities: {},
              },
            },
          },
        }),
      )
      .keep(ReactiveFormsModule)
      .keep(FormBuilder)
      .mock(ActivatedRoute, {
        paramMap: routeParams.pipe(map(convertToParamMap)),
      })
      .mock(PlayersService)
      .mock(Title)
      .mock(Location)
      .mock(PlayerEditSkillComponent)
      .mock(FeatherComponent)
      .mock(ConfigurationService, {
        fetchValues: jasmine.createSpy('fetchValue').and.callFake((...keys) =>
          configuration.pipe(
            filter(configuration => keys.every(key => key in configuration)),
            map(configuration =>
              keys.map(key => ({
                value: configuration[key],
              })),
            ),
            take(1),
          ),
        ),
        storeValues: jasmine
          .createSpy('storeValue')
          .and.callFake((...entries) =>
            configuration.pipe(
              filter(configuration =>
                entries.every(entry => entry.key in configuration),
              ),
              map(configuration =>
                entries.map(entry => configuration[entry.key]),
              ),
              take(1),
            ),
          ),
      }),
  );

  beforeEach(() => {
    fixture = MockRender(PlayerEditComponent);
    component = fixture.point.componentInstance;

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');

    playersService = TestBed.inject(
      PlayersService,
    ) as jasmine.SpyObj<PlayersService>;
    playersService.fetchPlayerSkill.and.returnValue(
      fetchPlayerSkill.asObservable(),
    );
    playersService.setPlayerName.and.returnValue(setPlayerName.asObservable());
    playersService.setPlayerSkill.and.returnValue(
      setPlayerSkill.asObservable(),
    );

    fixture.detectChanges();
    saveButton = ngMocks.find('button[type=submit]').nativeElement;
    nameInput = ngMocks.find('input[type=text]').nativeElement;
  });

  afterEach(() => configuration.complete());
  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when a player id is given', () => {
    beforeEach(() => {
      routeParams.next({ id: 'FAKE_PLAYER_ID' });
    });

    it('should load the player from the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        loadPlayer({ playerId: 'FAKE_PLAYER_ID' }),
      );
    });

    it("should load player's skill", () => {
      expect(playersService.fetchPlayerSkill).toHaveBeenCalledWith(
        'FAKE_PLAYER_ID',
      );
    });

    it('should disable the save button initially', () => {
      expect(saveButton.disabled).toBe(true);
    });

    describe('with player loaded', () => {
      beforeEach(() => {
        store.setState({
          players: {
            players: {
              ids: ['FAKE_PLAYER_ID'],
              entities: {
                FAKE_PLAYER_ID: {
                  name: 'maly',
                  id: 'FAKE_PLAYER_ID',
                },
              },
            },
          },
        });
      });

      it('should set the title', () => {
        const title = TestBed.inject(Title);
        expect(title.setTitle).toHaveBeenCalledWith(
          jasmine.stringMatching(/maly.+edit/),
        );
      });

      it("should set the player's name", () => {
        expect(nameInput.value).toEqual('maly');
      });

      describe('when the skill not set', () => {
        beforeEach(() => {
          fetchPlayerSkill.next({});
          fetchPlayerSkill.complete();
          configuration.next({
            'games.default_player_skill': { scout: -1, soldier: -1 },
          });
          fixture.detectChanges();
        });

        it('should render default skill', () => {
          const playerEditSkillComponents = ngMocks.findInstances(
            PlayerEditSkillComponent,
          );
          expect(playerEditSkillComponents.length).toBe(2); // scout and soldier
        });
      });

      describe('when the skill is fetched', () => {
        beforeEach(() => {
          fetchPlayerSkill.next({ scout: 1, soldier: 2 });
          fetchPlayerSkill.complete();
          fixture.detectChanges();
        });

        it('should render skill forms', () => {
          const playerEditSkillComponents = ngMocks.findInstances(
            PlayerEditSkillComponent,
          );
          expect(playerEditSkillComponents.length).toBe(2); // scout and soldier
        });

        describe('when the name is edited', () => {
          beforeEach(() => {
            nameInput.value = 'maly2';
            nameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
          });

          it('should enable the submit button', () => {
            expect(saveButton.disabled).toBe(false);
          });

          describe('when the form is saved', () => {
            beforeEach(() => {
              saveButton.click();
              fixture.detectChanges();
            });

            it('should set the new values', () => {
              expect(playersService.setPlayerName).toHaveBeenCalledWith(
                'FAKE_PLAYER_ID',
                'maly2',
              );
              expect(playersService.setPlayerSkill).toHaveBeenCalledWith(
                'FAKE_PLAYER_ID',
                {
                  scout: 1,
                  soldier: 2,
                },
              );
            });

            it('should disable the submit button', () => {
              expect(saveButton.disabled).toBe(true);
            });

            describe('when the values are updated', () => {
              beforeEach(() => {
                setPlayerName.next({
                  name: 'maly2',
                  id: 'FAKE_PLAYER_ID',
                } as Player);
                setPlayerName.complete();
                setPlayerSkill.next({ scout: 7, soldier: 8 });
                setPlayerSkill.complete();
              });

              it('should store the edited player in the store', () => {
                expect(store.dispatch).toHaveBeenCalledWith(
                  playerEdited({
                    player: { name: 'maly2', id: 'FAKE_PLAYER_ID' } as Player,
                  }),
                );
              });

              it('should redirect back', () => {
                const location = TestBed.inject(Location);
                expect(location.back).toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
  });

  it('should render cancel button', () => {
    const location = TestBed.inject(Location);
    const cancelButton = ngMocks.find('.cancel-button')
      .nativeElement as HTMLButtonElement;
    cancelButton.click();
    expect(location.back).toHaveBeenCalled();
  });
});
