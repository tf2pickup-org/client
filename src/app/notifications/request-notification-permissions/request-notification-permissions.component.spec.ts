import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { NotificationsService } from '../notifications.service';
import { RequestNotificationPermissionsComponent } from './request-notification-permissions.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { TablerIconComponent } from 'angular-tabler-icons';

describe('RequestNotificationPermissionsComponent', () => {
  let component: RequestNotificationPermissionsComponent;
  let fixture: ComponentFixture<RequestNotificationPermissionsComponent>;
  let permission: ReplaySubject<NotificationPermission>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    permission = new ReplaySubject(1);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RequestNotificationPermissionsComponent,
        MockComponent(TablerIconComponent),
      ],
      imports: [NoopAnimationsModule],
      providers: [
        {
          provide: NotificationsService,
          useValue: jasmine.createSpyObj<NotificationsService>(
            NotificationsService.name,
            ['requestPermission'],
            {
              permission: permission.asObservable(),
            },
          ),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    notificationsService = TestBed.inject(
      NotificationsService,
    ) as jasmine.SpyObj<NotificationsService>;

    fixture = TestBed.createComponent(RequestNotificationPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when permission = default', () => {
    beforeEach(() => {
      permission.next('default');
      fixture.detectChanges();
    });

    it('should render the banner', () => {
      const div = fixture.debugElement.query(
        By.css('.request-notification-permissions'),
      ).nativeElement as HTMLElement;
      expect(div.classList.contains('default')).toBe(true);
    });

    it('should render the allow notifications button', () => {
      const button = fixture.debugElement.query(
        By.css('.allow-notifications-button'),
      ).nativeElement as HTMLButtonElement;
      button.click();
      expect(notificationsService.requestPermission).toHaveBeenCalled();
    });
  });

  describe('when permission = denied', () => {
    beforeEach(() => {
      permission.next('denied');
      fixture.detectChanges();
    });

    it('should render the banner', () => {
      const div = fixture.debugElement.query(
        By.css('.request-notification-permissions'),
      ).nativeElement as HTMLElement;
      expect(div.classList.contains('denied')).toBe(true);
    });
  });

  describe('when permission = granted', () => {
    beforeEach(() => {
      permission.next('granted');
      fixture.detectChanges();
    });

    it('should not render anything', () => {
      expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(0);
    });
  });
});
