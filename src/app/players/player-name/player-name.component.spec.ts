import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerNameComponent } from './player-name.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('PlayerNameComponent', () => {
  let component: PlayerNameComponent;
  let fixture: ComponentFixture<PlayerNameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerNameComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(MockStore)?.resetSelectors());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
