import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PlayerDetailsHeaderComponent } from './player-details-header.component';

describe('PlayerDetailsHeaderComponent', () => {
  let component: PlayerDetailsHeaderComponent;
  let fixture: ComponentFixture<PlayerDetailsHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerDetailsHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render img with crossorigin="anonymous"', () => {
    const imgs = fixture.debugElement
      .queryAll(By.css('img'))
      .map(el => el.nativeElement) as HTMLImageElement[];
    expect(imgs.every(img => img.crossOrigin === 'anonymous')).toBe(true);
  });
});
