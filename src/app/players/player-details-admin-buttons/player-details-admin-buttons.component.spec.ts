import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MockComponent } from 'ng-mocks';
import { PlayerDetailsAdminButtonsComponent } from './player-details-admin-buttons.component';

describe('PlayerDetailsAdminButtonsComponent', () => {
  let component: PlayerDetailsAdminButtonsComponent;
  let fixture: ComponentFixture<PlayerDetailsAdminButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerDetailsAdminButtonsComponent,
        MockComponent(TablerIconComponent),
      ],
      imports: [RouterTestingModule],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(PlayerDetailsAdminButtonsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsAdminButtonsComponent);
    component = fixture.componentInstance;
    component.playerId = 'FAKE_PLAYER_ID';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct links', () => {
    const editPlayerAnchor = fixture.debugElement.query(
      By.css('.edit-player-button'),
    ).nativeElement as HTMLAnchorElement;
    expect(editPlayerAnchor).toBeTruthy();
    expect(editPlayerAnchor.href).toMatch(/\/player\/FAKE_PLAYER_ID\/edit$/);

    const playerBansAnchor = fixture.debugElement.query(
      By.css('.player-bans-button'),
    ).nativeElement as HTMLAnchorElement;
    expect(playerBansAnchor).toBeTruthy();
    expect(playerBansAnchor.href).toMatch(/\/player\/FAKE_PLAYER_ID\/bans$/);
  });

  describe('when super-user', () => {
    beforeEach(() => {
      component.isSuperUser = true;
      fixture.detectChanges();
    });

    it('should render roles link', () => {
      const playerRolesAnchor = fixture.debugElement.query(
        By.css('.edit-player-roles-button'),
      ).nativeElement as HTMLAnchorElement;
      expect(playerRolesAnchor).toBeTruthy();
      expect(playerRolesAnchor.href).toMatch(
        /\/player\/FAKE_PLAYER_ID\/roles$/,
      );
    });
  });
});
