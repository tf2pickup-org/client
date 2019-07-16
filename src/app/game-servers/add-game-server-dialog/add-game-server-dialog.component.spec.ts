import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGameServerDialogComponent } from './add-game-server-dialog.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';

class BsModalRefStub {

}

describe('AddGameServerDialogComponent', () => {
  let component: AddGameServerDialogComponent;
  let fixture: ComponentFixture<AddGameServerDialogComponent>;
  let store: MockStore<any>;
  const initialState = { gameServers: { locked: false } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGameServerDialogComponent ],
      providers: [
        { provide: BsModalRef, useClass: BsModalRefStub },
        provideMockStore({ initialState }),
      ],
      imports: [ FormsModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGameServerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#add()', () => {
    it('adds game server', () => {
      component.addressValue = 'FAKE_ADDRESS';
      component.serverNameValue = 'FAKE_NAME';
      component.portValue = 12345;
      component.rconPasswordValue = 'FAKE_PASSWORD';

      const spy = spyOn(store, 'dispatch');
      component.add();
      expect(spy).toHaveBeenCalledWith({
        gameServer: { name: 'FAKE_NAME', address: 'FAKE_ADDRESS', port: 12345, rconPassword: 'FAKE_PASSWORD' },
        type: '[Admin] Add game server',
      });
    });

    it('should close the dialog');
  });
});
