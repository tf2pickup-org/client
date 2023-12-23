import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerAvatarComponent } from './player-avatar.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

describe('PlayerAvatarComponent', () => {
  let component: PlayerAvatarComponent;
  let fixture: ComponentFixture<PlayerAvatarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerAvatarComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

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
