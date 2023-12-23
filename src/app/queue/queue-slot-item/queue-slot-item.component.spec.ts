import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueueSlotItemComponent } from './queue-slot-item.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { QueueSlot } from '../models/queue-slot';
import { MockComponent } from 'ng-mocks';
import { PlayerAvatarComponent } from '@app/players/player-avatar/player-avatar.component';
import { PlayerNameComponent } from '@app/players/player-name/player-name.component';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { Player } from '@app/players/models/player';

describe('QueueSlotItemComponent', () => {
  let component: QueueSlotItemComponent;
  let fixture: ComponentFixture<QueueSlotItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueSlotItemComponent,
        MockComponent(PlayerAvatarComponent),
        MockComponent(PlayerNameComponent),
      ],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(QueueSlotItemComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
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

  describe('with an empty slot', () => {
    const slot: QueueSlot = {
      id: 0,
      gameClass: Tf2ClassName.soldier,
      ready: false,
    };
    let slotDiv: HTMLElement;

    beforeEach(() => {
      component.slot = { ...slot };
      fixture.detectChanges();
      slotDiv = fixture.debugElement.query(By.css('.queue-slot-item'))
        .nativeElement as HTMLDivElement;
    });

    it('should render the slot div', () => {
      expect(slotDiv).toBeTruthy();
    });

    it('should apply correct css classes for default values', () => {
      expect(slotDiv.classList.contains('is-free')).toBe(true);
      expect(slotDiv.classList.contains('is-locked')).toBe(true);
      expect(slotDiv.classList.contains('is-taken')).toBe(false);
      expect(slotDiv.classList.contains('is-taken-by-me')).toBe(false);
      expect(slotDiv.classList.contains('is-and-ready')).toBe(false);
    });

    describe('when not locked', () => {
      beforeEach(() => {
        component.locked = false;
        fixture.detectChanges();
      });

      it('should apply correct css classes', () => {
        expect(slotDiv.classList.contains('is-locked')).toBe(false);
      });

      it('should emit takeSlot when clicked', done => {
        component.takeSlot.subscribe(theSlot => {
          expect(theSlot).toEqual(slot);
          done();
        });
        slotDiv.click();
      });
    });

    it('should not render an avatar', () => {
      expect(
        fixture.debugElement.query(By.css('app-player-avatar')),
      ).toBeNull();
    });
  });

  describe('with an occupied slot', () => {
    const slot: QueueSlot = {
      id: 0,
      gameClass: Tf2ClassName.soldier,
      ready: false,
      player: { id: 'FAKE_PLAYER_ID' } as Player,
    };
    let slotDiv: HTMLElement;

    beforeEach(() => {
      component.slot = { ...slot };
      fixture.detectChanges();
      slotDiv = fixture.debugElement.query(By.css('.queue-slot-item'))
        .nativeElement as HTMLDivElement;
    });

    it('should be marked as taken', () => {
      expect(slotDiv.classList.contains('is-taken')).toBe(true);
    });

    it("should render player's avatar", () => {
      const avatar = fixture.debugElement.query(By.css('app-player-avatar'))
        .componentInstance as PlayerAvatarComponent;
      expect(avatar.playerId).toEqual('FAKE_PLAYER_ID');
    });

    it('should render player name', () => {
      const name = fixture.debugElement.query(By.css('app-player-name'))
        .componentInstance as PlayerNameComponent;
      expect(name.playerId).toEqual('FAKE_PLAYER_ID');
    });

    it('should not emit takeSlot when clicked', () => {
      let emitted = false;
      component.takeSlot.subscribe(() => (emitted = true));
      slotDiv.click();
      expect(emitted).toBe(false);
    });

    describe('when readied up', () => {
      beforeEach(() => {
        component.slot = { ...slot, ready: true };
        fixture.detectChanges();
      });

      it('should apply correct css classes', () => {
        expect(slotDiv.classList.contains('is-ready')).toBe(true);
      });
    });

    describe('when the slot is occupied by by me', () => {
      beforeEach(() => {
        component.takenByMe = true;
        component.locked = false;
        fixture.detectChanges();
      });

      it('should apply correct css classes', () => {
        expect(slotDiv.classList.contains('is-taken')).toBe(true);
        expect(slotDiv.classList.contains('is-taken-by-me')).toBe(true);
      });

      it('should render the free slot button', done => {
        const freeSlotBtn = fixture.debugElement.query(By.css('.free-slot-btn'))
          .nativeElement as HTMLButtonElement;
        expect(freeSlotBtn).toBeTruthy();
        component.freeSlot.subscribe(done);
        freeSlotBtn.click();
      });

      it('should not emit takeSlot when clicked', () => {
        let emitted = false;
        component.takeSlot.subscribe(() => (emitted = true));
        slotDiv.click();
        expect(emitted).toBe(false);
      });

      describe("when I'm readied up", () => {
        beforeEach(() => {
          component.slot.ready = true;
          fixture.detectChanges();
        });

        it('should not render the free slot button', () => {
          expect(
            fixture.debugElement.query(By.css('.free-slot-btn')),
          ).toBeNull();
        });
      });
    });

    describe('when the slot is occupied by some other player', () => {
      beforeEach(() => {
        component.takenByMe = false;
        fixture.detectChanges();
      });

      describe('when the player can be marked as friend', () => {
        let markAsFriendBtn: HTMLButtonElement;

        beforeEach(() => {
          component.locked = false;
          component.friendFlags = { canMarkAsFriend: true };
          fixture.detectChanges();
          markAsFriendBtn = fixture.debugElement.query(
            By.css('.mark-as-friend-btn'),
          ).nativeElement as HTMLButtonElement;
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
            expect(markAsFriendBtn.classList.contains('is-marked-by-me')).toBe(
              false,
            );
          });
        });

        describe('when marked by me', () => {
          beforeEach(() => {
            component.friendFlags = { canMarkAsFriend: true, markedByMe: true };
            fixture.detectChanges();
          });

          it('should apply correct css classes', () => {
            expect(markAsFriendBtn.classList.contains('is-marked-by-me')).toBe(
              true,
            );
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
            component.friendFlags = {
              canMarkAsFriend: true,
              markedBy: 'FAKE_ENEMY_MEDIC_ID',
            };
            fixture.detectChanges();
          });

          it('should apply correct css classes', () => {
            expect(markAsFriendBtn.classList.contains('is-marked-by-me')).toBe(
              false,
            );
          });

          it('should render the button disabled', () => {
            expect(markAsFriendBtn.disabled).toBe(true);
          });
        });
      });
    });
  });
});
