import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { PlayersService } from '@app/players/players.service';
import { Player } from '@app/players/models/player';
import { PlayerSkill } from '@app/players/models/player-skill';
import { map, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { keyBy } from 'lodash-es';
import { PlayerRow } from './player-row';
import { select, Store } from '@ngrx/store';
import { queueConfig } from '@app/queue/queue.selectors';

interface SkillTableState {
  players: Record<string, Player>;
  skills: PlayerSkill[];
}

const initialState: SkillTableState = {
  players: {},
  skills: [],
};

@Injectable()
export class PlayerSkillTableStore extends ComponentStore<SkillTableState> {
  players: Observable<PlayerRow[]> = this.select(state =>
    state.skills.map(s => ({
      ...s.skill,
      id: s.player,
      name: state.players[s.player].name,
    })),
  );

  columns: Observable<{ prop: string }[]> = this.store.pipe(
    select(queueConfig),
    map(config => config.classes.map(cls => cls.name)),
    map(value => ['name', ...value]),
    map(props => props.map(prop => ({ prop }))),
  );

  loadAll = this.effect(() =>
    forkJoin({
      players: this.playersService.fetchAllPlayers(),
      skills: this.playersService.fetchAllPlayerSkills(),
    }).pipe(
      tap(({ players, skills }) => {
        this.setPlayers(players);
        this.setPlayerSkills(skills);
      }),
    ),
  );

  private setPlayers = this.updater((state, players: Player[]) => ({
    ...state,
    players: keyBy(players, 'id'),
  }));

  private setPlayerSkills = this.updater((state, skills: PlayerSkill[]) => ({
    ...state,
    skills,
  }));

  constructor(private playersService: PlayersService, private store: Store) {
    super(initialState);
  }
}
