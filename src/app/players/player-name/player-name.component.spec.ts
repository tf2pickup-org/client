import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNameComponent } from './player-name.component';

describe('PlayerNameComponent', () => {
  let component: PlayerNameComponent;
  let fixture: ComponentFixture<PlayerNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
