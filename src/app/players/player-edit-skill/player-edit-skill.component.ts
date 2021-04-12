import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MDCTextField } from '@material/textfield/component';

@Component({
  selector: 'app-player-edit-skill',
  templateUrl: './player-edit-skill.component.html',
  styleUrls: ['./player-edit-skill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerEditSkillComponent implements OnDestroy {
  @Input()
  gameClass: string;

  @Input()
  form: FormGroup;

  @ViewChild('skill')
  set skillInput(skillInput: ElementRef) {
    if (this.field) {
      this.field.destroy();
    }

    if (skillInput) {
      this.field = new MDCTextField(skillInput.nativeElement);
    }
  }

  private field: MDCTextField;

  ngOnDestroy() {
    if (this.field) {
      this.field.destroy();
    }
  }
}
