import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerEditSkillComponent } from './player-edit-skill.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('PlayerEditSkillComponent', () => {
  let component: PlayerEditSkillComponent;
  let fixture: ComponentFixture<PlayerEditSkillComponent>;
  const formGroup = new FormGroup({ soldier: new FormControl(5) });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerEditSkillComponent ],
      imports: [
        ReactiveFormsModule,
      ],
    })
    // https://github.com/angular/angular/issues/12313
    .overrideComponent(PlayerEditSkillComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
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

  it('should set min & max on the input', () => {
    component.form = formGroup;
    component.gameClass = 'soldier';
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input[type=number]')).nativeElement as HTMLInputElement;
    expect(el).toBeTruthy();
    expect(el.min).toBe('1');
    expect(el.max).toBe('5');
  });
});
