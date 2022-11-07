import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { isEmpty, pickBy } from 'lodash-es';
import { concatMap, debounceTime, Observable, tap } from 'rxjs';
import { PlayerAction } from '../models/player-action';
import { PlayerActionsFilter } from '../models/player-actions-filter';
import { PlayerActionLogsService } from '../player-action-logs.service';

interface PlayerActionLogsState {
  actions: PlayerAction[];
  limit: number;
  filter: PlayerActionsFilter;
}

const initialState: PlayerActionLogsState = {
  actions: [],
  limit: 10,
  filter: {},
};

@Injectable({ providedIn: null })
export class PlayerActionLogsStore extends ComponentStore<PlayerActionLogsState> {
  readonly actions = this.select(state => state.actions);
  readonly limit = this.select(state => state.limit);
  readonly filter = this.select(state => state.filter);

  private readonly query = this.select(
    this.limit,
    this.filter,
    (limit, filter) => ({ limit, filter }),
    { debounce: true },
  );

  private readonly fetchActionLogs = this.effect(
    (query: Observable<{ limit: number }>) =>
      query.pipe(
        debounceTime(500),
        concatMap(query =>
          this.playerActionLogsService
            .fetchPlayerActions(query)
            .pipe(tap((actions: PlayerAction[]) => this.setActions(actions))),
        ),
      ),
  );

  readonly setLimit = this.updater(
    (state, limit: number): PlayerActionLogsState => ({
      ...state,
      limit,
    }),
  );

  readonly setFilter = this.updater(
    (
      state,
      filter: {
        key: keyof PlayerActionsFilter;
        value: string;
      },
    ): PlayerActionLogsState => ({
      ...state,
      filter: pickBy(
        {
          ...state.filter,
          [filter.key]: filter.value,
        },
        o => !isEmpty(o),
      ),
    }),
  );

  private readonly setActions = this.updater(
    (state, actions: PlayerAction[]): PlayerActionLogsState => ({
      ...state,
      actions,
    }),
  );

  constructor(
    private readonly playerActionLogsService: PlayerActionLogsService,
  ) {
    super(initialState);
    this.fetchActionLogs(this.query);
  }
}
