import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-player-edit-skill',
  templateUrl: './player-edit-skill.component.html',
  styleUrls: ['./player-edit-skill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerEditSkillComponent {
  @Input()
  gameClass: string;

  @Input()
  form: FormGroup;
}
