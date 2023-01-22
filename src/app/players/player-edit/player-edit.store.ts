import { Injectable } from '@angular/core';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { DefaultPlayerSkill } from '@app/configuration/models/default-player-skill';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { Observable, of, zip } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { loadPlayer, playerEdited } from '../actions';
import { Player } from '../models/player';
import { PlayersService } from '../players.service';
import { playerById } from '../selectors';

type PlayerSkillSet = { [gameClass in Tf2ClassName]?: number };

interface PlayerEditState {
  player?: Player;
  skill?: PlayerSkillSet;
  saving: boolean;
}

const initialState: PlayerEditState = {
  saving: false,
};

@Injectable()
export class PlayerEditStore extends ComponentStore<PlayerEditState> {
  readonly player = this.select(state => state.player);
  readonly skill = this.select(state => state.skill);
  readonly saving = this.select(state => state.saving);
  readonly isReady = this.select(
    state => Boolean(state.player) && Boolean(state.skill) && !state.saving,
  );

  readonly setPlayerId = this.effect((playerId: Observable<string>) =>
    playerId.pipe(
      tap((id: string) => this.loadPlayer(id)),
      tap((id: string) => this.loadPlayerSkill(id)),
    ),
  );

  readonly save = this.effect(
    (edits: Observable<{ name: string; skill: PlayerSkillSet }>) =>
      edits.pipe(
        tap(() => this.setSaving(true)),
        withLatestFrom(this.select(state => state.player)),
        mergeMap(([edits, player]) =>
          zip(
            this.playersService
              .setPlayerName(player.id, edits.name)
              .pipe(
                tap(player => this.store.dispatch(playerEdited({ player }))),
              ),
            this.playersService
              .setPlayerSkill(player.id, edits.skill)
              .pipe(tap(skill => this.setSkill(skill))),
          ),
        ),
        tap(() => this.setSaving(false)),
      ),
  );

  private readonly loadPlayer = this.effect((playerId: Observable<string>) =>
    playerId.pipe(
      switchMap(id =>
        this.store.select(playerById(id)).pipe(
          tap(player => {
            if (!player) {
              this.store.dispatch(loadPlayer({ playerId: id }));
            }
          }),
        ),
      ),
      filter(player => Boolean(player)),
      tap((player: Player) => this.setPlayer(player)),
    ),
  );

  private readonly loadPlayerSkill = this.effect(
    (playerId: Observable<string>) =>
      playerId.pipe(
        switchMap(id =>
          this.playersService.fetchPlayerSkill(id).pipe(
            switchMap(skill => {
              if (isEmpty(skill)) {
                return this.configurationService
                  .fetchValues<
                    [
                      {
                        [gameClass in Tf2ClassName]?: number;
                      },
                    ]
                  >('games.default_player_skill')
                  .pipe(map(value => value[0].value));
              }

              return of(skill);
            }),
            tap(skill => this.setSkill(skill)),
          ),
        ),
      ),
  );

  private readonly setPlayer = this.updater(
    (state, player: Player): PlayerEditState => ({
      ...state,
      player,
    }),
  );

  private readonly setSkill = this.updater(
    (state, skill: PlayerSkillSet): PlayerEditState => ({
      ...state,
      skill,
    }),
  );

  private readonly setSaving = this.updater(
    (state, saving: boolean): PlayerEditState => ({
      ...state,
      saving,
    }),
  );

  constructor(
    private readonly store: Store,
    private readonly playersService: PlayersService,
    private readonly configurationService: ConfigurationService,
  ) {
    super(initialState);
  }
}
