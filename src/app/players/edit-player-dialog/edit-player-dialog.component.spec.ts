import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPlayerDialogComponent } from './edit-player-dialog.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { playersLocked } from '../players.selectors';
import { FormsModule } from '@angular/forms';
import { Player } from '../models/player';
import { editPlayer } from '../players.actions';

class BsModalRefStub {
  hide() { }
}

describe('EditPlayerDialogComponent', () => {
  let component: EditPlayerDialogComponent;
  let fixture: ComponentFixture<EditPlayerDialogComponent>;
  let store: MockStore<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlayerDialogComponent ],
      imports: [
        FormsModule,
      ],
      providers: [
        provideMockStore(),
        { provide: BsModalRef, useClass: BsModalRefStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    store.overrideSelector(playersLocked, false);

    fixture = TestBed.createComponent(EditPlayerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#save()', () => {
    const player: Player = { id: 'FAKE_ID', name: 'FAKE_NAME', joinedAt: new Date(), steamId: 'FAKE_STEAM_ID',
      avatarUrl: 'FAKE_AVATAR_URL', skill: { } };

    beforeEach(() => {
      component.player = player;
    });

    it('should not do anything unless there are any changes to the player', () => {
      const spy = spyOn(store, 'dispatch');
      component.save();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should dispatch editPlayer action', () => {
      const spy = spyOn(store, 'dispatch');
      component.playerNameValue = 'FAKE_NAME_2';
      component.save();
      expect(spy).toHaveBeenCalledWith(editPlayer({ player: { ...player, name: 'FAKE_NAME_2' } }));
    });

    it('should eventually hide the dialog', () => {
      store.setState({ players: { ids: ['FAKE_ID'], entities: { FAKE_ID: player } } });

      const spy = spyOn(TestBed.get(BsModalRef), 'hide');
      component.playerNameValue = 'FAKE_NAME_2';
      component.save();

      store.setState({ players: { ids: ['FAKE_ID'], entities: { FAKE_ID: { ...player, name: 'FAKE_NAME_2' } } } });
      expect(spy).toHaveBeenCalled();
    });
  });
});
