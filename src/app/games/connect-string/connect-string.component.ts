import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
@Component({
  selector: 'app-connect-string',
  templateUrl: './connect-string.component.html',
  styleUrls: ['./connect-string.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectStringComponent {

  @Input()
  connectString: string;

  @Input()
  stvConnectString: string;

}
