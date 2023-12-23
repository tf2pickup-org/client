// skipcq: JS-0108
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TitleControllerComponent } from './title-controller.component';
import { ReplaySubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';

class RouterStub {
  events = new ReplaySubject<unknown>(1);
  routerState = {
    root: {
      firstChild: {
        snapshot: {
          data: {
            title: 'FAKE_TITLE',
          },
        },
      },
    },
  };
}

class TitleStub {
  setTitle() {}
}

describe('TitleControllerComponent', () => {
  let component: TitleControllerComponent;
  let fixture: ComponentFixture<TitleControllerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TitleControllerComponent],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: Title, useClass: TitleStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title', () => {
    environment.titleSuffix = 'FAKE_TITLE_SUFFIX';
    const spy = spyOn(TestBed.get(Title), 'setTitle');
    const router = TestBed.get(Router) as RouterStub;
    router.events.next(new NavigationEnd(1, 'test', 'test'));
    expect(spy).toHaveBeenCalledWith('FAKE_TITLE • FAKE_TITLE_SUFFIX');
  });
});
