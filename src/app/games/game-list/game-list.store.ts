import { Injectable } from '@angular/core';
import { PaginatedList } from '@app/core/models/paginated-list';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { GamesService } from '../games.service';
import { Game } from '../models/game';

interface GameListState {
  loading: boolean;
  games: Game[];
  gameCount: number;
  page: number;
}

const initialState: GameListState = {
  loading: false,
  games: [],
  gameCount: 0,
  page: 1,
};

@Injectable()
export class GameListStore extends ComponentStore<GameListState> {

  readonly gamesPerPage = 5;

  loading = this.select(state => state.loading);
  games = this.select(state => state.games);
  gameCount = this.select(state => state.gameCount);
  page = this.select(state => state.page);

  loadPage = this.effect((page: Observable<number>) => page.pipe(
    tap(() => this.setLoading()),
    tap(_page => this.setPage(_page)),
    map(_page => (_page - 1) * this.gamesPerPage),
    switchMap(offset => this.gamesService.fetchGames(offset, this.gamesPerPage).pipe(
      tap(result => this.gamesLoaded(result)),
      catchError(() => EMPTY),
    )),
  ));

  private setPage = this.updater((state, page: number) => ({
    ...state,
    page,
  }));

  private setLoading = this.updater(state => ({
    ...state,
    loading: true,
  }));

  private gamesLoaded = this.updater((state, result: PaginatedList<Game>) => ({
    ...state,
    games: result.results,
    gameCount: result.itemCount,
    loading: false,
  }));

  constructor(
    private gamesService: GamesService,
  ) {
    super(initialState);
  }

}
