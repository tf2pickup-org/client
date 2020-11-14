import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditPlayerRoleDialogComponent } from './edit-player-role-dialog.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector, Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { playersLocked } from '../selectors';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Player } from '../models/player';
import { setPlayerRole } from '../actions';

class BsModalRefStub {
  hide() { }
}

const player = {
  hasAcceptedRules: true,
  steamId: '76561198074409147',
  name: 'maly',
  avatarUrl: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/96/962ac5adb6b0cce647227a2c429c035e56197fb2.jpg',
  role: null,
  etf2lProfileId: 112758,
  joinedAt: '2019-08-02T19:01:09.576Z',
  id: 'FAKE_PLAYER_ID',
};

const initialState = {
  players: {
    players: {
      ids: [ 'FAKE_PLAYER_ID' ],
      entities: {
        FAKE_PLAYER_ID: player,
      },
    },
  },
};

describe('EditPlayerRoleDialogComponent', () => {
  let component: EditPlayerRoleDialogComponent;
  let fixture: ComponentFixture<EditPlayerRoleDialogComponent>;
  let store: MockStore<AppState>;
  let playersLockedSelector: MemoizedSelector<AppState, boolean>;
  let storeDispatchSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [ EditPlayerRoleDialogComponent ],
      providers: [
        { provide: BsModalRef, useClass: BsModalRefStub },
        provideMockStore({ initialState }),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    playersLockedSelector = store.overrideSelector(playersLocked, false);
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(EditPlayerRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buttons', () => {
    it('should enable and disable according to the state', () => {
      const saveBtn = fixture.debugElement.query(By.css('.btn-save')).nativeElement as HTMLButtonElement;
      expect(saveBtn).toBeDefined();
      const cancelBtn = fixture.debugElement.query(By.css('.btn-cancel')).nativeElement as HTMLButtonElement;
      expect(cancelBtn).toBeDefined();

      expect(saveBtn.disabled).toBe(false);
      expect(cancelBtn.disabled).toBe(false);

      playersLockedSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();

      expect(saveBtn.disabled).toBe(true);
      expect(cancelBtn.disabled).toBe(true);
    });
  });

  it('should receive the role', () => {
    component.player = { role: 'admin' } as Player;
    expect(component.selectedRole).toEqual('admin');
  });

  describe('#saveRole()', () => {
    beforeEach(() => {
      component.player = player as any;
      component.selectedRole = 'admin';
    });

    it('should dispatch the setPlayerRole action', () => {
      component.saveRole();
      expect(storeDispatchSpy).toHaveBeenCalledWith(setPlayerRole({ playerId: 'FAKE_PLAYER_ID', role: 'admin' }));
    });

    it('should eventually close the dialog', () => {
      const spy = spyOn(TestBed.get(BsModalRef), 'hide');

      component.saveRole();
      store.setState({
        players: {
          players: {
            ids: [ 'FAKE_PLAYER_ID' ],
            entities: {
              FAKE_PLAYER_ID: { ...player, role: 'admin' },
            },
          },
        },
      } as any);

      expect(spy).toHaveBeenCalled();
    });

    it('should save null role as well', () => {
      component.selectedRole = 'no role';
      component.saveRole();
      expect(storeDispatchSpy).toHaveBeenCalledWith(setPlayerRole({ playerId: 'FAKE_PLAYER_ID', role: null }));
    });
  });
});
