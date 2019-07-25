import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueComponent } from './queue.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { queueClasses } from '../queue.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('QueueComponent', () => {
  let component: QueueComponent;
  let fixture: ComponentFixture<QueueComponent>;
  let store: MockStore<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueComponent ],
      providers: [
        provideMockStore(),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    store.overrideSelector(queueClasses, []);

    fixture = TestBed.createComponent(QueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
