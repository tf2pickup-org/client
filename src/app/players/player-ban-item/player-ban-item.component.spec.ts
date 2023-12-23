import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerBanItemComponent } from './player-ban-item.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PlayerBanItemComponent', () => {
  let component: PlayerBanItemComponent;
  let fixture: ComponentFixture<PlayerBanItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerBanItemComponent],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(PlayerBanItemComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBanItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with player ban', () => {
    beforeEach(() => {
      const start = new Date();
      start.setHours(start.getHours() - 1);

      const end = new Date();
      end.setHours(end.getHours() + 1);

      component.playerBan = {
        player: 'FAKE_PLAYER_ID',
        start,
        end,
        reason: 'FAKE_PLAYER_BAN_REASON',
        admin: 'FAKE_ADMIN_ID',
        id: 'FAKE_PLAYER_BAN_ID',
      };
      fixture.detectChanges();
    });

    it('should emit revoke event', done => {
      component.revoke.subscribe(done);
      const btn = fixture.debugElement.query(By.css('button[type=button]'))
        .nativeElement as HTMLButtonElement;
      btn.click();
      expect().nothing();
    });
  });
});
