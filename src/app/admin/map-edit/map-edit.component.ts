import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MDCTextField } from '@material/textfield';

@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapEditComponent implements OnDestroy {

  @ViewChild('mapName')
  set mapNameControl(mapNameControl: ElementRef) {
    if (mapNameControl) {
      if (this.mapNameField) {
        this.mapNameField.destroy();
      }

      this.mapNameField = new MDCTextField(mapNameControl.nativeElement)
    }
  }

  @ViewChild('execConfig')
  set execConfigControl(execConfigControl: ElementRef) {
    if (execConfigControl) {
      if (this.execConfigField) {
        this.execConfigField.destroy();
      }

      this.execConfigField = new MDCTextField(execConfigControl.nativeElement)
    }
  }

  @ViewChild('mapNameInput')
  mapNameInput: ElementRef;

  @Input()
  mapControl: FormGroup;

  @Output()
  remove = new EventEmitter<void>();

  private mapNameField: MDCTextField;
  private execConfigField: MDCTextField;

  ngOnDestroy() {
    if (this.mapNameField) {
      this.mapNameField.destroy();
    }

    if (this.execConfigField) {
      this.execConfigField.destroy();
    }
  }

  focus() {
    this.mapNameInput?.nativeElement.focus();
  }

}
