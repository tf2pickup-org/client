import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-connect-string',
  templateUrl: './connect-string.component.html',
  styleUrls: ['./connect-string.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectStringComponent {

  @ViewChild('connectInput', { static: false })
  connectInput: ElementRef;

  @Input()
  connectString: string;

  copyConnectString() {
    const input = this.connectInput.nativeElement as HTMLInputElement;
    input.focus();
    input.select();
    document.execCommand('copy');
  }

}
