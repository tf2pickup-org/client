/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerBansComponent } from './player-bans.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { loadPlayerBans, revokePlayerBan } from '../actions';
import { MockComponent } from 'ng-mocks';
import { PlayerBanItemComponent } from '../player-ban-item/player-ban-item.component';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';

const paramMap = of(convertToParamMap({ id: 'FAKE_PLAYER_ID' }));

describe('PlayerBansComponent', () => {
  let component: PlayerBansComponent;
  let fixture: ComponentFixture<PlayerBansComponent>;
  let store: MockStore;

  const initialState = {
    players: {
      players: {
        ids: ['FAKE_PLAYER_ID'],
        entities: {
          FAKE_PLAYER_ID: {
            id: 'FAKE_PLAYER_ID',
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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          PlayerBansComponent,
          MockComponent(PlayerBanItemComponent),
        ],
        imports: [RouterTestingModule],
        providers: [
          provideMockStore({ initialState }),
          { provide: ActivatedRoute, useValue: { paramMap } },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
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
    expect(store.dispatch).toHaveBeenCalledWith(
      loadPlayerBans({ playerId: 'FAKE_PLAYER_ID' }),
    );
  });

  describe('with bans', () => {
    const mockBan = {
      player: 'FAKE_PLAYER_ID',
      start: new Date(),
      end: new Date(),
      reason: 'FAKE_PLAYER_BAN_REASON',
      admin: 'FAKE_ADMIN_ID',
      id: 'FAKE_PLAYER_BAN_ID',
    };

    let playerBanItem: PlayerBanItemComponent;

    beforeEach(() => {
      store.setState({
        players: {
          players: {
            ids: ['FAKE_PLAYER_ID'],
            entities: {
              FAKE_ID: {
                id: 'FAKE_PLAYER_ID',
                name: 'FAKE_NAME',
              },
            },
          },
          bans: {
            ids: ['FAKE_PLAYER_BAN_ID'],
            entities: { FAKE_PLAYER_BAN_ID: mockBan },
          },
        },
      });

      fixture.detectChanges();
      playerBanItem = fixture.debugElement.query(
        By.css('app-player-ban-item'),
      ).componentInstance;
    });

    it('should render PlayerBanItem', () => {
      expect(playerBanItem).toBeTruthy();
    });

    it('should be able to revoke a ban', () => {
      playerBanItem.revoke.emit();
      expect(store.dispatch).toHaveBeenCalledWith(
        revokePlayerBan({ playerBan: mockBan }),
      );
    });
  });

  describe('when user presses the cancel button', () => {
    let cancelButton: HTMLButtonElement;

    beforeEach(() => {
      cancelButton = fixture.debugElement.query(By.css('.cancel-button'))
        .nativeElement as HTMLButtonElement;
    });

    it('should go back in history', () => {
      const spy = spyOn(TestBed.inject(Location), 'back');
      cancelButton.click();
      expect(spy).toHaveBeenCalled();
    });
  });
});
