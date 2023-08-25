import {
  Component,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-minimum-tf2-in-game-hours-dialog',
  templateUrl: './minimum-tf2-in-game-hours-dialog.component.html',
  styleUrls: ['./minimum-tf2-in-game-hours-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimumTf2InGameHoursDialogComponent implements AfterViewInit {
  @ViewChild('input')
  inputControl: ElementRef;

  @Input()
  minimumTf2InGameHours: number;

  @Output()
  accept = new EventEmitter<number>();

  @Output()
  cancel = new EventEmitter<void>();

  ngAfterViewInit() {
    this.inputControl.nativeElement.focus();
  }

  doAccept() {
    this.accept.next(parseInt(this.inputControl.nativeElement.value, 10));
  }
}
