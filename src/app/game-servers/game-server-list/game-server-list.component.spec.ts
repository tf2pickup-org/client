import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameServerListComponent } from './game-server-list.component';

describe('GameServerListComponent', () => {
  let component: GameServerListComponent;
  let fixture: ComponentFixture<GameServerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameServerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameServerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
