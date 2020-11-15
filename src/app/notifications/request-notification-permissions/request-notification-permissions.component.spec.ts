import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { NotificationsService } from '../notifications.service';
import { RequestNotificationPermissionsComponent } from './request-notification-permissions.component';

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
      declarations: [ RequestNotificationPermissionsComponent ],
      providers: [
        {
          provide: NotificationsService,
          useValue: jasmine.createSpyObj<NotificationsService>(
            NotificationsService.name,
            ['requestPermission'],
            {
              permission: permission.asObservable(),
            }
          ),
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    notificationsService = TestBed.inject(NotificationsService) as jasmine.SpyObj<NotificationsService>;

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

    it('should render the warning dialog', () => {
      expect(fixture.debugElement.query(By.css('.alert-warning'))).toBeTruthy();
    });

    it('should render the allow notifications button', () => {
      const button = fixture.debugElement.query(By.css('.btn-primary')).nativeElement as HTMLButtonElement;
      button.click();
      expect(notificationsService.requestPermission).toHaveBeenCalled();
    });
  });

  describe('when permission = denied', () => {
    beforeEach(() => {
      permission.next('denied');
      fixture.detectChanges();
    });

    it('should render the danger dialog', () => {
      expect(fixture.debugElement.query(By.css('.alert-danger'))).toBeTruthy();
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
