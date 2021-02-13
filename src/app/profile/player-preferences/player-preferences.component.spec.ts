import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPreferencesComponent } from './player-preferences.component';

describe('PlayerPreferencesComponent', () => {
  let component: PlayerPreferencesComponent;
  let fixture: ComponentFixture<PlayerPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerPreferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
