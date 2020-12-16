import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerAvatarComponent } from './player-avatar.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';

describe('PlayerAvatarComponent', () => {
  let component: PlayerAvatarComponent;
  let fixture: ComponentFixture<PlayerAvatarComponent>;
  let store: MockStore<any>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerAvatarComponent ],
      providers: [
        provideMockStore(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);

    fixture = TestBed.createComponent(PlayerAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render img with crossorigin="anonymous"', () => {
    const imgs = fixture.debugElement.queryAll(By.css('img')).map(el => el.nativeElement) as HTMLImageElement[];
    expect(imgs.every(img => img.crossOrigin === 'anonymous')).toBe(true);
  });
});
