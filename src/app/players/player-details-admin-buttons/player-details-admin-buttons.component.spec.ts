import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerDetailsAdminButtonsComponent } from './player-details-admin-buttons.component';

describe('PlayerDetailsAdminButtonsComponent', () => {
  let component: PlayerDetailsAdminButtonsComponent;
  let fixture: ComponentFixture<PlayerDetailsAdminButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDetailsAdminButtonsComponent ],
      imports: [
        RouterTestingModule,
      ],
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
    const editPlayerAnchor = fixture.debugElement.query(By.css('.edit-player-button')).nativeElement as HTMLAnchorElement;
    expect(editPlayerAnchor).toBeTruthy();
    expect(editPlayerAnchor.href).toMatch(/\/player\/FAKE_PLAYER_ID\/edit$/);

    const playerBansAnchor = fixture.debugElement.query(By.css('.player-bans-button')).nativeElement as HTMLAnchorElement;
    expect(playerBansAnchor).toBeTruthy();
    expect(playerBansAnchor.href).toMatch(/\/player\/FAKE_PLAYER_ID\/bans$/);
  });
});
