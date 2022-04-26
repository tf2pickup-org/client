import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServemeTfService } from './serveme-tf.service';

@Component({
  selector: 'app-game-servers',
  templateUrl: './game-servers.component.html',
  styleUrls: ['./game-servers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameServersComponent {
  isServemeTfEnabled = this.servemeTfService.isEnabled;

  constructor(private servemeTfService: ServemeTfService) {}
}
