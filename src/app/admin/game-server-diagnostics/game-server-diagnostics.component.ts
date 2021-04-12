import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GameServersService } from '@app/game-servers/game-servers.service';
import { GameServer } from '@app/game-servers/models/game-server';
import { GameServerDiagnosticRun } from '@app/game-servers/models/game-server-diagnostic-run';
import { Observable, ReplaySubject } from 'rxjs';
import { map, pluck, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-game-server-diagnostics',
  templateUrl: './game-server-diagnostics.component.html',
  styleUrls: ['./game-server-diagnostics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameServerDiagnosticsComponent implements OnInit {
  gameServer: Observable<GameServer> = this.route.data.pipe(
    pluck('gameServer'),
  );
  run = new ReplaySubject<GameServerDiagnosticRun>(1);

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private gameServersService: GameServersService,
  ) {}

  ngOnInit() {
    this.gameServer
      .pipe(
        take(1),
        map(gameServer => gameServer.name),
      )
      .subscribe(name => this.title.setTitle(`${name} diagnostics`));

    this.gameServer
      .pipe(
        take(1),
        map(gameServer => gameServer.id),
        switchMap(id => this.gameServersService.runDiagnostics(id)),
      )
      .subscribe(run => this.run.next(run));
  }
}
