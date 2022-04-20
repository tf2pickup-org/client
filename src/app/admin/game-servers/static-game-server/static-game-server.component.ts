import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GameServer } from '@app/game-servers/models/game-server';
import { map, Observable, pluck, take } from 'rxjs';

@Component({
  selector: 'app-static-game-server',
  templateUrl: './static-game-server.component.html',
  styleUrls: ['./static-game-server.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticGameServerComponent implements OnInit {
  gameServer: Observable<GameServer> = this.route.data.pipe(
    pluck('gameServer'),
  );

  constructor(private route: ActivatedRoute, private title: Title) {}

  ngOnInit() {
    this.gameServer
      .pipe(
        take(1),
        map(gameServer => gameServer.name),
      )
      .subscribe(name => this.title.setTitle(`${name}`));
  }
}
