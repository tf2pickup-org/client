import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QueueContainerComponent } from './queue-container.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { activeGame } from '@app/games/games.selectors';
import { queueRequiredPlayerCount, queueCurrentPlayerCount } from '../queue.selectors';
import { Title } from '@angular/platform-browser';

describe('QueueContainerComponent', () => {
  let component: QueueContainerComponent;
  let fixture: ComponentFixture<QueueContainerComponent>;
  let store: MockStore<any>;
  let setTitleSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueContainerComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: activeGame, value: null },
            { selector: queueRequiredPlayerCount, value: 12 },
            { selector: queueCurrentPlayerCount, value: 5 },
          ]
        }),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    setTitleSpy = spyOn(TestBed.get(Title), 'setTitle');

    fixture = TestBed.createComponent(QueueContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show active game link');

  describe('ngOnInit()', () => {
    it('should set the page title', fakeAsync(() => {
      component.ngOnInit();
      tick(200);
      expect(setTitleSpy).toHaveBeenCalled();
      expect(setTitleSpy.calls.mostRecent().args[0]).toMatch(/^\[5\/12\]/);
    }));
  });
});
