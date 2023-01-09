import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-show-skills-switch',
  templateUrl: './show-skills-switch.component.html',
  styleUrls: ['./show-skills-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowSkillsSwitchComponent {
  @Input()
  showSkills: boolean;

  @Output()
  readonly showSkillsToggle = new EventEmitter<boolean>();

  toggle() {
    this.showSkills = !this.showSkills;
    this.showSkillsToggle.emit(this.showSkills);
  }
}
