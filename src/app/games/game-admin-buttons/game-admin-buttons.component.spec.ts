import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GameAdminButtonsComponent } from './game-admin-buttons.component';

describe('GameAdminButtonsComponent', () => {
  let component: GameAdminButtonsComponent;
  let fixture: ComponentFixture<GameAdminButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameAdminButtonsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameAdminButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the reinitialize server button', done => {
    const reinitializeBtn = fixture.debugElement.query(
      By.css('.reinitialize-server-button'),
    ).nativeElement as HTMLButtonElement;
    expect(reinitializeBtn).toBeTruthy();

    component.reinitializeServer.subscribe(done);
    reinitializeBtn.click();
  });

  it('should render the force end button', done => {
    const forceEndBtn = fixture.debugElement.query(By.css('.force-end-button'))
      .nativeElement as HTMLButtonElement;
    expect(forceEndBtn).toBeTruthy();

    component.forceEnd.subscribe(done);
    forceEndBtn.click();
  });
});
