import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DiagnosticCheck } from '@app/game-servers/models/diagnostic-check';

@Component({
  selector: 'app-diagnostic-check-info',
  templateUrl: './diagnostic-check-info.component.html',
  styleUrls: ['./diagnostic-check-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagnosticCheckInfoComponent {

  @Input()
  check: DiagnosticCheck;

}
