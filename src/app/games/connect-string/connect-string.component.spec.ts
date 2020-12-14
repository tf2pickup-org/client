import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConnectStringComponent } from './connect-string.component';
import { By } from '@angular/platform-browser';
import { MockPipe } from 'ng-mocks';
import { ConnectStringToLinkPipe } from '@app/shared/connect-string-to-link.pipe';
import { ChangeDetectionStrategy } from '@angular/core';

describe('ConnectStringComponent', () => {
  let component: ConnectStringComponent;
  let fixture: ComponentFixture<ConnectStringComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConnectStringComponent,
        MockPipe(ConnectStringToLinkPipe, (...args) => JSON.stringify(args)),
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(ConnectStringComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with connect string', () => {
    beforeEach(() => {
      component.connectString = 'FAKE_CONNECT_STRING';
      fixture.detectChanges();
    });

    it('should render the input', () => {
      const input = fixture.debugElement.query(By.css('input.connect-string')).nativeElement as HTMLInputElement;
      expect(input).toBeDefined();
      expect(input.readOnly).toBe(true);
    });

    it('should render the direct connect link', () => {
      const anchor = fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
      expect(anchor).toBeDefined();
      expect(anchor.href).toMatch(/FAKE_CONNECT_STRING/);
    });
  });

  describe('with stv connect string', () => {
    beforeEach(() => {
      component.stvConnectString = 'FAKE_STV_CONNECT_STRING';
      fixture.detectChanges();
    });

    it('should render the input', () => {
      const input = fixture.debugElement.query(By.css('input.connect-string')).nativeElement as HTMLInputElement;
      expect(input).toBeDefined();
      expect(input.readOnly).toBe(true);
    });

    it('should render the direct connect link', () => {
      const anchor = fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
      expect(anchor).toBeDefined();
      expect(anchor.href).toMatch(/FAKE_STV_CONNECT_STRING/);
    });
  });

  describe('without the connect string', () => {
    it('should not render input.connect-unavailable', () => {
      const input = fixture.debugElement.query(By.css('input.connect-string')).nativeElement as HTMLInputElement;
      expect(input.classList.contains('connect-unavailable')).toBe(true);
    });
  });
});
