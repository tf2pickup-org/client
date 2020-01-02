import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-join-game-info',
  templateUrl: './join-game-info.component.html',
  styleUrls: ['./join-game-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameInfoComponent {

  @ViewChild('connectInput', { static: false })
  connectInput: ElementRef;

  @Input()
  gameId: string;

  @Input()
  connectString: string;

  copyConnectString() {
    const input = this.connectInput.nativeElement as HTMLInputElement;
    input.focus();
    input.select();
    document.execCommand('copy');
  }

}
