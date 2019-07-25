import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPlayerDialogComponent } from './edit-player-dialog.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { playersLocked } from '../players.selectors';
import { FormsModule } from '@angular/forms';

class BsModalRefStub {

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
    it('should not do anything unless there are any changes to the player');
  });
});
