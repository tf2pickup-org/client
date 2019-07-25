import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueReadyUpDialogComponent } from './queue-ready-up-dialog.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { leaveQueue, readyUp } from '../queue.actions';

class BsModalRefStub {
  hide() { }
}

describe('QueueReadyUpDialogComponent', () => {
  let component: QueueReadyUpDialogComponent;
  let fixture: ComponentFixture<QueueReadyUpDialogComponent>;
  let store: MockStore<any>;
  let bsModalRef: BsModalRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueReadyUpDialogComponent ],
      providers: [
        provideMockStore(),
        { provide: BsModalRef, useClass: BsModalRefStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    bsModalRef = TestBed.get(BsModalRef);

    fixture = TestBed.createComponent(QueueReadyUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#leaveQueue()', () => {
    it('should dispatch leaveQueue action', () => {
      const spy = spyOn(store, 'dispatch');
      component.leaveQueue();
      expect(spy).toHaveBeenCalledWith(leaveQueue());
    });

    it('should hide the dialog', () => {
      const spy = spyOn(bsModalRef, 'hide');
      component.leaveQueue();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#confirmReady()', () => {
    it('should dispatch readyUp action', () => {
      const spy = spyOn(store, 'dispatch');
      component.confirmReady();
      expect(spy).toHaveBeenCalledWith(readyUp());
    });

    it('should hide the dialog', () => {
      const spy = spyOn(bsModalRef, 'hide');
      component.confirmReady();
      expect(spy).toHaveBeenCalled();
    });
  });
});
