import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Map } from '@app/queue/models/map';
import { MDCTextField } from '@material/textfield';

@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapEditComponent implements OnDestroy {

  @ViewChild('mapName')
  set mapNameInput(mapNameInput: ElementRef) {
    if (mapNameInput) {
      if (this.mapNameField) {
        this.mapNameField.destroy();
      }

      this.mapNameField = new MDCTextField(mapNameInput.nativeElement)
    }
  }

  @ViewChild('execConfig')
  set execConfigInput(execConfigInput: ElementRef) {
    if (execConfigInput) {
      if (this.execConfigField) {
        this.execConfigField.destroy();
      }

      this.execConfigField = new MDCTextField(execConfigInput.nativeElement)
    }
  }

  @Input()
  map: Map;

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

}
