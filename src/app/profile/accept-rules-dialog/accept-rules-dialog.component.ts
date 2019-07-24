import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-accept-rules-dialog',
  templateUrl: './accept-rules-dialog.component.html',
  styleUrls: ['./accept-rules-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptRulesDialogComponent {

  rulesAccepted = new Subject<void>();
  phase = new BehaviorSubject<'mumble' | 'rules'>('mumble');

  step() {
    switch (this.phase.value) {
      case 'mumble':
        this.phase.next('rules');
        break;

      case 'rules':
        this.rulesAccepted.next();
        break;
    }
  }

}
