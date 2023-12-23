import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueClassSlotListComponent } from './queue-class-slot-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { mySlot } from '../queue.selectors';
import { MockComponent } from 'ng-mocks';
import { QueueSlotContainerComponent } from '../queue-slot-container/queue-slot-container.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { Player } from '@app/players/models/player';

describe('QueueClassSlotListComponent', () => {
  let component: QueueClassSlotListComponent;
  let fixture: ComponentFixture<QueueClassSlotListComponent>;
  let store: MockStore;

  const initialState = {
    queue: {
      slots: [
        {
          id: 0,
          gameClass: 'scout',
          ready: false,
        },
        {
          id: 8,
          gameClass: 'demoman',
          player: {
            id: 'FAKE_PLAYER_ID',
          },
          ready: false,
        },
      ],
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueClassSlotListComponent,
        MockComponent(QueueSlotContainerComponent),
      ],
      providers: [provideMockStore({ initialState })],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(QueueClassSlotListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(mySlot, null);
    fixture = TestBed.createComponent(QueueClassSlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with slots', () => {
    beforeEach(() => {
      component.gameClass = 'demoman';
      fixture.detectChanges();
    });

    it('should fetch slots of the given class', () => {
      component.slots.subscribe(slots =>
        expect(slots).toEqual([
          {
            id: 8,
            gameClass: Tf2ClassName.demoman,
            player: { id: 'FAKE_PLAYER_ID' } as Player,
            ready: false,
          },
        ]),
      );
    });

    it('should render slots', () => {
      const container = fixture.debugElement.query(
        By.css('app-queue-slot-container'),
      ).componentInstance as QueueSlotContainerComponent;
      expect(container.slotId).toEqual(8);
    });
  });
});
