import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SubstituteRequestBannerComponent } from './substitute-request-banner.component';

describe('SubstituteRequestBannerComponent', () => {
  let component: SubstituteRequestBannerComponent;
  let fixture: ComponentFixture<SubstituteRequestBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstituteRequestBannerComponent ],
      imports: [
        RouterTestingModule,
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(SubstituteRequestBannerComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstituteRequestBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with substitute request', () => {
    beforeEach(() => {
      component.substituteRequest = {
        team: 'BLU',
        gameClass: 'soldier',
        gameNumber: 123,
        gameId: 'FAKE_GAME_ID',
      };
      fixture.detectChanges();
    });

    it('should render the banner', () => {
      expect(fixture.debugElement.query(By.css('.substitute-request-banner'))).toBeTruthy();
    });

    it('should redirect to the game', () => {
      const anchor = fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.href).toMatch(/\/game\/FAKE_GAME_ID$/);
    });
  });
});
