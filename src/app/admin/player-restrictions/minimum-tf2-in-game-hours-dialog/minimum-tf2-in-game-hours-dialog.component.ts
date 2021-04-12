import {
  Component,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { MDCTextField } from '@material/textfield';

@Component({
  selector: 'app-minimum-tf2-in-game-hours-dialog',
  templateUrl: './minimum-tf2-in-game-hours-dialog.component.html',
  styleUrls: ['./minimum-tf2-in-game-hours-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimumTf2InGameHoursDialogComponent
  implements AfterViewInit, OnDestroy {
  @ViewChild('input')
  inputControl: ElementRef;

  @Input()
  minimumTf2InGameHours: number;

  @Output()
  accept = new EventEmitter<number>();

  @Output()
  cancel = new EventEmitter<void>();

  private field: MDCTextField;

  ngAfterViewInit() {
    this.field = new MDCTextField(this.inputControl.nativeElement);
    this.field.focus();
  }

  ngOnDestroy() {
    this.field.destroy();
  }

  doAccept() {
    this.accept.next(parseInt(this.field.value, 10));
  }
}
