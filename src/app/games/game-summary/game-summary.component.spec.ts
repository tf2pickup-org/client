import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { GameSummaryComponent } from './game-summary.component';
import { TablerIconComponent } from 'angular-tabler-icons';

describe('GameSummaryComponent', () => {
  let component: GameSummaryComponent;
  let fixture: ComponentFixture<GameSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GameSummaryComponent, MockComponent(TablerIconComponent)],
      imports: [NoopAnimationsModule],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(GameSummaryComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with logs', () => {
    beforeEach(() => {
      component.logsUrl = 'FAKE_LOGS_URL';
      fixture.detectChanges();
    });

    it('should render logs link', () => {
      const anchor = fixture.debugElement.query(By.css('a[href=FAKE_LOGS_URL]'))
        .nativeElement as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.target).toEqual('_blank');
    });
  });

  describe('with demo', () => {
    beforeEach(() => {
      component.demoUrl = 'FAKE_DEMO_URL';
      fixture.detectChanges();
    });

    it('should render demo link', () => {
      const anchor = fixture.debugElement.query(By.css('a[href=FAKE_DEMO_URL]'))
        .nativeElement as HTMLAnchorElement;
      expect(anchor).toBeTruthy();
      expect(anchor.target).toEqual('_blank');
    });
  });
});
