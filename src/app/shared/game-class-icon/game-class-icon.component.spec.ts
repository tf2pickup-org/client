import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameClassIconComponent } from './game-class-icon.component';

describe('GameClassIconComponent', () => {
  let component: GameClassIconComponent;
  let fixture: ComponentFixture<GameClassIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameClassIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameClassIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
