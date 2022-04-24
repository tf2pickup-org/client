import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-edit-page-wrapper',
  templateUrl: './edit-page-wrapper.component.html',
  styleUrls: ['./edit-page-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPageWrapperComponent {
  @Input()
  title: string;

  @Input()
  saveDisabled = true;

  @Input()
  submitButton = true;
}
