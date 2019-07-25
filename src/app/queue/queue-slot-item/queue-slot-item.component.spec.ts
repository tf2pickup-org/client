import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueSlotItemComponent } from './queue-slot-item.component';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { joinQueue, leaveQueue } from '../queue.actions';

describe('QueueSlotItemComponent', () => {
  let component: QueueSlotItemComponent;
  let fixture: ComponentFixture<QueueSlotItemComponent>;
  let store: MockStore<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueSlotItemComponent ],
      providers: [
        provideMockStore(),
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(QueueSlotItemComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(QueueSlotItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply correct css classes', () => {
    component.slot = { id: 0, gameClass: 'soldier', playerReady: false };
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.queue-slot-item')).nativeElement as HTMLElement;
    expect(div).toBeTruthy();
    expect(div.classList.contains('free')).toBe(true);
    expect(div.classList.contains('locked')).toBe(false);
    expect(div.classList.contains('taken')).toBe(false);
    expect(div.classList.contains('by-me')).toBe(false);
    expect(div.classList.contains('and-ready')).toBe(false);

    component.locked = true;
    fixture.detectChanges();
    expect(div.classList.contains('locked')).toBe(true);

    component.slot = { id: 0, gameClass: 'soldier', playerReady: false, playerId: 'FAKE_ID' };
    fixture.detectChanges();
    expect(div.classList.contains('taken')).toBe(true);

    component.takenByMe = true;
    fixture.detectChanges();
    expect(div.classList.contains('by-me')).toBe(true);

    component.slot = { id: 0, gameClass: 'soldier', playerReady: true, playerId: 'FAKE_ID' };
    fixture.detectChanges();
    expect(div.classList.contains('and-ready')).toBe(true);
  });

  describe('#takeSlot()', () => {
    beforeEach(() => {
      component.slot = { id: 0, gameClass: 'soldier', playerReady: false };
      fixture.detectChanges();
    });

    it('should dispatch joinQueue action', () => {
      const spy = spyOn(store, 'dispatch');
      component.takeSlot();
      expect(spy).toHaveBeenCalledWith(joinQueue({ slotId: 0 }));
    });

    it('should do nothing if the queue is locked', () => {
      component.locked = true;
      const spy = spyOn(store, 'dispatch');
      component.takeSlot();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should do nothing if the slot is already occupied', () => {
      component.slot = { id: 0, gameClass: 'soldier', playerReady: false, playerId: 'FAKE_ID' };
      const spy = spyOn(store, 'dispatch');
      component.takeSlot();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('#freeSlot()', () => {
    it('should dispatch leaveQueue action', () => {
      const spy = spyOn(store, 'dispatch');
      component.freeSlot({ stopPropagation: () => {} } as Event);
      expect(spy).toHaveBeenCalledWith(leaveQueue());
    });
  });
});
