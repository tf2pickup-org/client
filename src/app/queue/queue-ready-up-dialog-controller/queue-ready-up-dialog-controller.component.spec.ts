import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueReadyUpDialogControllerComponent } from './queue-ready-up-dialog-controller.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';

class BsModalServiceStub {

}

describe('QueueReadyUpDialogControllerComponent', () => {
  let component: QueueReadyUpDialogControllerComponent;
  let fixture: ComponentFixture<QueueReadyUpDialogControllerComponent>;
  let store: MockStore<any>;

  const initialState = { queue: { readyUpDialogShown: false } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueReadyUpDialogControllerComponent ],
      providers: [
        provideMockStore({ initialState }),
        { provide: BsModalService, useClass: BsModalServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);

    fixture = TestBed.createComponent(QueueReadyUpDialogControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
