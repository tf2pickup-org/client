import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinGameInfoComponent } from './join-game-info.component';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { ConnectStringToLinkPipe } from '@app/shared/connect-string-to-link.pipe';
import { MockComponent } from 'ng-mocks';
import { ConnectStringComponent } from '../connect-string/connect-string.component';
import { MumbleJoinButtonComponent } from '../mumble-join-button/mumble-join-button.component';
import { By } from '@angular/platform-browser';

describe('JoinGameInfoComponent', () => {
  let component: JoinGameInfoComponent;
  let fixture: ComponentFixture<JoinGameInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConnectStringToLinkPipe,
        JoinGameInfoComponent,
        MockComponent(ConnectStringComponent),
        MockComponent(MumbleJoinButtonComponent),
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(JoinGameInfoComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinGameInfoComponent);
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

    it('should render ConnectStringComponent', () => {
      const connectStringComponent = fixture.debugElement.query(By.css('app-connect-string')).componentInstance as ConnectStringComponent;
      expect(connectStringComponent).toBeDefined();
      expect(connectStringComponent.connectString).toEqual('FAKE_CONNECT_STRING');
    });
  });

  describe('with gameId', () => {
    beforeEach(() => {
      component.gameId = 'FAKE_GAME_ID';
      fixture.detectChanges();
    });

    it('should render MumbleJoinButton', () => {
      const mumbleJoinButton = fixture.debugElement.query(By.css('app-mumble-join-button')).componentInstance as MumbleJoinButtonComponent;
      expect(mumbleJoinButton).toBeDefined();
      expect(mumbleJoinButton.gameId).toEqual('FAKE_GAME_ID');
    });
  });
});
