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

      it('should emit takeSlot when clicked', done => {
        component.takeSlot.subscribe(done);
        div.click();
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

      it('should not emit takeSlot when clicked', done => {
        let emitted = false;
        component.takeSlot.subscribe(() => emitted = true);
        setTimeout(() => {
          if (emitted) {
            done.fail();
          } else {
            done();
          }
        }, 100);
        div.click();
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

        it('should render the free slot button', done => {
          const freeSlotBtn = fixture.debugElement.query(By.css('.free-slot-btn')).nativeElement as HTMLButtonElement;
          expect(freeSlotBtn).toBeTruthy();
          component.freeSlot.subscribe(done);
          freeSlotBtn.click();
        });

        it('should not emit takeSlot when clicked', done => {
          let emitted = false;
          component.takeSlot.subscribe(() => emitted = true);
          setTimeout(() => {
            if (emitted) {
              done.fail();
            } else {
              done();
            }
          }, 100);
          div.click();
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

        it('should emit friend player id', done => {
          component.markFriend.subscribe(value => {
            expect(value).toBe('FAKE_PLAYER_ID');
            done();
          });
          markAsFriendBtn.click();
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

          it('should emit markFriend(null)', done => {
            component.markFriend.subscribe(value => {
              expect(value).toBe(null);
              done();
            });
            markAsFriendBtn.click();
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
});
