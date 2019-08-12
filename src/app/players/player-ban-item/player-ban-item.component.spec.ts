import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerBanItemComponent } from './player-ban-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PlayerBanItemComponent', () => {
  let component: PlayerBanItemComponent;
  let fixture: ComponentFixture<PlayerBanItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerBanItemComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBanItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
