import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  @Input()
  title?: string;

  @Input()
  supportingText?: string;

  @Input()
  acceptText = 'Accept';

  @Input()
  cancelText = 'Cancel';

  @Output()
  readonly accept = new EventEmitter<void>();

  @Output()
  readonly cancel = new EventEmitter<void>();
}
