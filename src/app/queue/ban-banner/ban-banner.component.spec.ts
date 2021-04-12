import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BanBannerComponent } from './ban-banner.component';

describe('BanBannerComponent', () => {
  let component: BanBannerComponent;
  let fixture: ComponentFixture<BanBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BanBannerComponent],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(BanBannerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with ban', () => {
    beforeEach(() => {
      component.ban = {
        id: 'FAKE_BAN_ID',
        admin: 'FAKE_ADMIN_ID',
        player: 'FAKE_PLAYER_ID',
        reason: 'FAKE_BAN_REASON',
        start: new Date(),
        end: new Date(),
      };
      fixture.detectChanges();
    });

    it('should render the banner', () => {
      expect(fixture.debugElement.query(By.css('.ban-banner'))).toBeTruthy();
    });
  });
});
