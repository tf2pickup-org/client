import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameServersService } from '@app/game-servers/game-servers.service';
import { GameServer } from '@app/game-servers/models/game-server';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-static-game-server-list',
  templateUrl: './static-game-server-list.component.html',
  styleUrls: ['./static-game-server-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticGameServerListComponent implements OnInit {
  gameServers: Observable<GameServer[]>;

  constructor(private gameServersService: GameServersService) {}

  ngOnInit() {
    this.gameServers = this.gameServersService.fetchStaticGameServers();
  }
}
