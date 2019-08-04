import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerEditSkillComponent } from './player-edit-skill.component';

describe('PlayerEditSkillComponent', () => {
  let component: PlayerEditSkillComponent;
  let fixture: ComponentFixture<PlayerEditSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerEditSkillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerEditSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
