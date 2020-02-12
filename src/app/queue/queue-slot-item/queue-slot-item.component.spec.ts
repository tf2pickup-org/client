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

  describe('with a slot', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
      component.slot = { id: 0, gameClass: 'soldier', ready: false };
      fixture.detectChanges();
      div = fixture.debugElement.query(By.css('.queue-slot-item')).nativeElement as HTMLDivElement;
      expect(div).toBeTruthy();
    });

    it('should apply correct css classes for default values', () => {
      expect(div.classList.contains('free')).toBe(true);
      expect(div.classList.contains('locked')).toBe(true);
      expect(div.classList.contains('taken')).toBe(false);
      expect(div.classList.contains('by-me')).toBe(false);
      expect(div.classList.contains('and-ready')).toBe(false);
    });

    describe('when not locked', () => {
      beforeEach(() => {
        component.locked = false;
        fixture.detectChanges();
      });

      it('should apply correct css classes', () => {
        expect(div.classList.contains('locked')).toBe(false);
      });
    });

    describe('with a player occupying the slot', () => {
      beforeEach(() => {
        component.slot = { id: 0, gameClass: 'soldier', ready: false, playerId: 'FAKE_PLAYER_ID' };
        fixture.detectChanges();
      });

      it('should mark as taken', () => {
        expect(div.classList.contains('taken')).toBe(true);
      });

      describe('when readied up', () => {
        beforeEach(() => {
          component.slot.ready = true;
          fixture.detectChanges();
        });

        it('should apply correct css classes', () => {
          expect(div.classList.contains('and-ready')).toBe(true);
        });
      });

      describe('when the slot is taken by me', () => {
        beforeEach(() => {
          component.takenByMe = true;
          component.locked = false;
          fixture.detectChanges();
        });

        it('should apply correct css classes', () => {
          expect(div.classList.contains('taken')).toBe(true);
          expect(div.classList.contains('by-me')).toBe(true);
        });

        it('should render the free slot button', () => {
          expect(fixture.debugElement.query(By.css('.free-slot-btn')).nativeElement).toBeTruthy();
        });

        describe('when readied up', () => {
          beforeEach(() => {
            component.slot.ready = true;
            fixture.detectChanges();
          });

          it('should not render the free slot button', () => {
            expect(fixture.debugElement.query(By.css('.free-slot-btn'))).toBeNull();
          });
        });
      });

      describe('when the player can be marked as friend', () => {
        let markAsFriendBtn: HTMLButtonElement;

        beforeEach(() => {
          component.locked = false;
          component.friendFlags = { canMarkAsFriend: true };
          fixture.detectChanges();
          markAsFriendBtn = fixture.debugElement.query(By.css('.mark-as-friend-btn')).nativeElement as HTMLButtonElement;
        });

        it('should render the mark as friend button', () => {
          expect(markAsFriendBtn).toBeTruthy();
          expect(markAsFriendBtn.disabled).toBe(false);
        });

        describe('when not marked by me', () => {
          it('should apply correct css class', () => {
            expect(markAsFriendBtn.classList.contains('btn-light')).toBe(true);
            expect(markAsFriendBtn.classList.contains('btn-danger')).toBe(false);
          });
        });

        describe('when marked by me', () => {
          beforeEach(() => {
            component.friendFlags = { canMarkAsFriend: true, markedByMe: true };
            fixture.detectChanges();
          });

          it('should apply correct css classes', () => {
            expect(markAsFriendBtn.classList.contains('btn-light')).toBe(false);
            expect(markAsFriendBtn.classList.contains('btn-danger')).toBe(true);
          });
        });

        describe('when marked by someone else', () => {
          beforeEach(() => {
            component.friendFlags = { canMarkAsFriend: true, markedBy: { id: 'FAKE_ENEMY_MEDIC_ID', name: 'FAKE_ENEMY_MEDIC' } as any };
            fixture.detectChanges();
          });

          it('should apply correct css classes', () => {
            expect(markAsFriendBtn.classList.contains('btn-light')).toBe(true);
            expect(markAsFriendBtn.classList.contains('btn-danger')).toBe(false);
          });

          it('should render the button disabled', () => {
            expect(markAsFriendBtn.disabled).toBe(true);
          });
        });
      });
    });
  });

  describe('takeSlot', () => {
    let takeSlotBtn: HTMLElement;

    beforeEach(() => {
      component.locked = false;
      component.slot = { id: 0, gameClass: 'soldier', ready: false };
      fixture.detectChanges();
      takeSlotBtn = fixture.debugElement.query(By.css('div.queue-slot-item')).nativeElement;
    });

    it('should be emitted when the slot is clicked', done => {
      component.takeSlot.subscribe(slot => {
        expect(slot).toEqual(component.slot);
        done();
      });
      takeSlotBtn.click();
    });
  });

  describe('freeSlot', () => {
    let freeSlotBtn: HTMLButtonElement;

    beforeEach(() => {
      component.locked = false;
      component.slot = { id: 0, gameClass: 'soldier', ready: false, playerId: 'FAKE_PLAYER_ID' };
      component.takenByMe = true;
      fixture.detectChanges();

      freeSlotBtn = fixture.debugElement.query(By.css('button.free-slot-btn')).nativeElement as HTMLButtonElement;
    });

    it('should be emitted when the free slot button is clicked', done =>  {
      component.freeSlot.subscribe(done);
      freeSlotBtn.click();
      expect().nothing();
    });
  });

  describe('markFriend', () => {
    let markFriendBtn: HTMLButtonElement;

    beforeEach(() => {
      component.locked = false;
      component.slot = { id: 0, gameClass: 'soldier', ready: false, playerId: 'FAKE_PLAYER_ID' };
      component.friendFlags = { canMarkAsFriend: true };
      fixture.detectChanges();

      markFriendBtn = fixture.debugElement.query(By.css('button.slot-action-btn')).nativeElement as HTMLButtonElement;
    });

    it('should emit friend player id', done => {
      component.markFriend.subscribe(value => {
        expect(value).toBe('FAKE_PLAYER_ID');
        done();
      });
      markFriendBtn.click();
    });

    it('should emit null', done => {
      component.friendFlags = { canMarkAsFriend: true, markedByMe: true };
      component.markFriend.subscribe(value => {
        expect(value).toBe(null);
        done();
      });
      markFriendBtn.click();
    });
  });
});
