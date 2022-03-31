import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { JoinVoiceButtonComponent } from './join-voice-button.component';
import { SharedModule } from '@app/shared/shared.module';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockPipe } from 'ng-mocks';
import { SafeMumbleUrlPipe } from '@app/shared/safe-mumble-url.pipe';

describe(JoinVoiceButtonComponent.name, () => {
  let component: JoinVoiceButtonComponent;
  let fixture: ComponentFixture<JoinVoiceButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JoinVoiceButtonComponent,
        MockPipe(SafeMumbleUrlPipe, (...args) => JSON.stringify(args)),
      ],
      imports: [SharedModule],
    })
      .overrideComponent(JoinVoiceButtonComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinVoiceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with mumble url', () => {
    beforeEach(() => {
      component.mumbleUrl = 'FAKE_MUMBLE_URL';
      fixture.detectChanges();
    });

    it('should render the button', () => {
      const button = fixture.debugElement.query(By.css('a'))
        .nativeElement as HTMLAnchorElement;
      expect(button).toBeTruthy();
      expect(button.href).toMatch(/FAKE_MUMBLE_URL/);
    });
  });
});
