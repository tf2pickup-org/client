import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameServerDiagnosticsComponent } from './game-server-diagnostics.component';

describe('GameServerDiagnosticsComponent', () => {
  let component: GameServerDiagnosticsComponent;
  let fixture: ComponentFixture<GameServerDiagnosticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameServerDiagnosticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameServerDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
