import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { first } from 'rxjs/operators';
import { gamesLoaded, allGames } from '../games.selectors';
import { loadGames } from '../games.actions';
import { Observable } from 'rxjs';
import { Game } from '../models/game';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameListComponent implements OnInit {

  games: Observable<Game[]> = this.store.select(allGames);

  constructor(
    private store: Store<AppState>,
    private title: Title,
  ) { }

  ngOnInit() {
    this.store.pipe(
      select(gamesLoaded),
      first(),
    ).subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(loadGames());
      }
    });

    this.title.setTitle(`games • ${environment.titleSuffix}`);
  }

}
