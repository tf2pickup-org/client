import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameBasicInfoComponent } from './game-basic-info.component';

describe('GameBasicInfoComponent', () => {
  let component: GameBasicInfoComponent;
  let fixture: ComponentFixture<GameBasicInfoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GameBasicInfoComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
