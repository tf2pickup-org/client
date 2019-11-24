import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueSlotItemComponent } from './queue-slot-item.component';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('QueueSlotItemComponent', () => {
  let component: QueueSlotItemComponent;
  let fixture: ComponentFixture<QueueSlotItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueSlotItemComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(QueueSlotItemComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueSlotItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply correct css classes', () => {
    component.slot = { id: 0, gameClass: 'soldier', playerReady: false, votesForMapChange: false };
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

    component.slot = { id: 0, gameClass: 'soldier', playerReady: false, playerId: 'FAKE_ID', votesForMapChange: false };
    fixture.detectChanges();
    expect(div.classList.contains('taken')).toBe(true);

    component.takenByMe = true;
    fixture.detectChanges();
    expect(div.classList.contains('by-me')).toBe(true);

    component.slot = { id: 0, gameClass: 'soldier', playerReady: true, playerId: 'FAKE_ID', votesForMapChange: false };
    fixture.detectChanges();
    expect(div.classList.contains('and-ready')).toBe(true);
  });

  describe('#takeSlot', () => {
    let takeSlotBtn: HTMLElement;

    beforeEach(() => {
      component.slot = { id: 0, gameClass: 'soldier', playerReady: false, votesForMapChange: false };
      fixture.detectChanges();

      takeSlotBtn = fixture.debugElement.query(By.css('div.queue-slot-item')).nativeElement;
    });

    it('should be emitted when the slot is clicked', () => {
      component.takeSlot.subscribe(slot => expect(slot).toEqual(component.slot));
      takeSlotBtn.click();
    });
  });

  describe('#freeSlot', () => {
    let freeSlotBtn: HTMLButtonElement;

    beforeEach(() => {
      component.slot = { id: 0, gameClass: 'soldier', playerReady: false, votesForMapChange: false, playerId: 'FAKE_PLAYER_ID' };
      component.takenByMe = true;
      component.canHaveFriend = false;
      fixture.detectChanges();

      freeSlotBtn = fixture.debugElement.query(By.css('button.btn-light')).nativeElement as HTMLButtonElement;
    });

    it('should be emitted when the free slot button is clicked', () =>  {
      let emitted = false;
      component.freeSlot.subscribe(() => emitted = true);
      freeSlotBtn.click();
      expect(emitted).toBe(true);
    });
  });
});
