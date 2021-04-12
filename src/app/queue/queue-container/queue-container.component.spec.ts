import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueContainerComponent } from './queue-container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  queueRequiredPlayerCount,
  queueCurrentPlayerCount,
} from '../queue.selectors';
import { Title } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('QueueContainerComponent', () => {
  let component: QueueContainerComponent;
  let fixture: ComponentFixture<QueueContainerComponent>;
  let setTitleSpy: jasmine.Spy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [QueueContainerComponent],
        imports: [RouterTestingModule],
        providers: [
          provideMockStore({
            selectors: [
              { selector: queueRequiredPlayerCount, value: 12 },
              { selector: queueCurrentPlayerCount, value: 5 },
            ],
          }),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    setTitleSpy = spyOn(TestBed.get(Title), 'setTitle');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set the page title', () => {
      component.ngOnInit();
      expect(setTitleSpy).toHaveBeenCalled();
      expect(setTitleSpy.calls.mostRecent().args[0]).toMatch(/^\[5\/12\]/);
    });
  });
});
