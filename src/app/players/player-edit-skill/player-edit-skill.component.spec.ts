import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerEditSkillComponent } from './player-edit-skill.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { GameClassIconComponent } from '@app/shared/game-class-icon/game-class-icon.component';

describe('PlayerEditSkillComponent', () => {
  let component: PlayerEditSkillComponent;
  let fixture: ComponentFixture<PlayerEditSkillComponent>;
  const formGroup = new FormGroup({ soldier: new FormControl(5) });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerEditSkillComponent,
        MockComponent(GameClassIconComponent),
      ],
      imports: [ReactiveFormsModule],
    })
      // https://github.com/angular/angular/issues/12313
      .overrideComponent(PlayerEditSkillComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerEditSkillComponent);
    component = fixture.componentInstance;
    component.form = formGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with game class defined', () => {
    beforeEach(() => {
      component.gameClass = 'soldier';
      fixture.detectChanges();
    });

    it('should render the proper game class', () => {
      const gameClassIcon = fixture.debugElement.query(
        By.css('app-game-class-icon'),
      ).componentInstance as GameClassIconComponent;
      expect(gameClassIcon.gameClass).toEqual('soldier');
    });
  });
});
