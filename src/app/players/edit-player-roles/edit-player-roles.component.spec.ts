import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatherComponent } from 'angular-feather';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { loadPlayer, playerEdited } from '../actions';
import { Player } from '../models/player';
import { PlayersService } from '../players.service';
import { EditPlayerRolesComponent } from './edit-player-roles.component';

describe(EditPlayerRolesComponent.name, () => {
  let component: EditPlayerRolesComponent;
  let fixture: MockedComponentFixture;
  let routeParams: Subject<any>;
  let store: MockStore;
  let playersService: jasmine.SpyObj<PlayersService>;
  let submitButton: HTMLButtonElement;
  let setPlayerRole: Subject<Player>;

  beforeEach(() => {
    routeParams = new Subject();
    setPlayerRole = new Subject();
  });

  beforeEach(() => MockBuilder(EditPlayerRolesComponent)
    .provide(provideMockStore({
      initialState: {
        players: {
          players: {
            ids: [],
            entities: {},
          },
        },
      },
    }))
    .keep(ReactiveFormsModule)
    .mock(ActivatedRoute, {
      paramMap: routeParams.pipe(map(convertToParamMap)),
    })
    .mock(PlayersService)
    .mock(Title)
    .mock(Location)
    .mock(FeatherComponent)
  );

  beforeEach(() => {
    fixture = MockRender(EditPlayerRolesComponent);
    component = fixture.point.componentInstance;

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    playersService = TestBed.inject(PlayersService) as jasmine.SpyObj<PlayersService>;
    playersService.setPlayerRole.and.returnValue(setPlayerRole.asObservable());

    fixture.detectChanges();
    submitButton = ngMocks.find('button[type=submit]').nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when a player id is given', () => {
    beforeEach(() => {
      routeParams.next({ id: 'FAKE_PLAYER_ID' });
    });

    it('should load the player from the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(loadPlayer({ playerId: 'FAKE_PLAYER_ID' }));
    });

    it('should disable the submit button initially', () => {
      expect(submitButton.disabled).toBe(true);
    });

    describe('with player loaded', () => {
      beforeEach(() => {
        store.setState({
          players: {
            players: {
              ids: [ 'FAKE_PLAYER_ID' ],
              entities: {
                FAKE_PLAYER_ID: {
                  name: 'maly',
                  role: 'admin',
                },
              },
            },
          },
        });
      });

      it('should set the title', () => {
        const title = TestBed.inject(Title);
        expect(title.setTitle).toHaveBeenCalledWith(jasmine.stringMatching(/maly/));
      });

      it('should set the role', () => {
        const option = ngMocks.find('input[type=radio]#admin').nativeElement as HTMLInputElement;
        expect(option.checked).toBe(true);
      });

      describe('when selecting another role', () => {
        beforeEach(() => {
          const option = ngMocks.find('input[type=radio]#no-role').nativeElement as HTMLInputElement;
          option.click();
          fixture.detectChanges();
        });

        it('should enable the submit button', () => {
          expect(submitButton.disabled).toBe(false);
        });

        describe('when submitted', () => {
          beforeEach(() => {
            submitButton.click();
            fixture.detectChanges();
          });

          it('should call the api', () => {
            expect(playersService.setPlayerRole).toHaveBeenCalledWith('FAKE_PLAYER_ID', null);
          });

          it('should disable the submit button', () => {
            expect(submitButton.disabled).toBe(true);
          });

          describe('when the server replies', () => {
            beforeEach(() => {
              setPlayerRole.next({ name: 'maly', role: null } as Player);
            });

            it('should update the player', () => {
              expect(store.dispatch).toHaveBeenCalledWith(playerEdited({ player: { name: 'maly', role: null } as Player }));
            });

            it('should navigate back', () => {
              const location = TestBed.inject(Location);
              expect(location.back).toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
