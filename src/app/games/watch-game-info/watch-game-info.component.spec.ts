import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WatchGameInfoComponent } from './watch-game-info.component';
import { MockComponent } from 'ng-mocks';
import { ConnectStringComponent } from '../connect-string/connect-string.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('WatchGameInfoComponent', () => {
  let component: WatchGameInfoComponent;
  let fixture: ComponentFixture<WatchGameInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WatchGameInfoComponent,
        MockComponent(ConnectStringComponent),
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(WatchGameInfoComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchGameInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with connect string', () => {
    beforeEach(() => {
      component.stvConnectString = 'FAKE_CONNECT_STRING';
      fixture.detectChanges();
    });

    it('should render ConnectStringComponent', () => {
      const connectStringComponent = fixture.debugElement.query(By.css('app-connect-string')).componentInstance as ConnectStringComponent;
      expect(connectStringComponent).toBeDefined();
      expect(connectStringComponent.connectString).toEqual('FAKE_CONNECT_STRING');
    });
  });
});
