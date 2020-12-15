import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { PlayersService } from '../players.service';
import { Player } from '../models/player';
import { PlayerSkill } from '../models/player-skill';
import { map, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { keyBy } from 'lodash';
import { PlayerRow } from './player-row';
import { select, Store } from '@ngrx/store';
import { queueConfig } from '@app/queue/queue.selectors';

interface SkillTableState {
  players: Record<string, Player>;
  skills: PlayerSkill[];
}

const initialState: SkillTableState = {
  players: { },
  skills: [],
};

@Injectable()
export class SkillTableStore extends ComponentStore<SkillTableState> {

  players: Observable<PlayerRow[]> = this.select(state => state.skills.map(s => ({
    ...s.skill,
    id: s.player,
    name: state.players[s.player].name,
  }))).pipe(tap(console.log));

  columns: Observable<{ prop: string }[]> = this.store.pipe(
    select(queueConfig),
    map(config => config.classes.map(cls => cls.name)),
    map(value => [ 'name', ...value ]),
    map(props => props.map(prop => ({ prop }))),
  );

  loadAll = this.effect(() => forkJoin({
    players: this.playersService.fetchAllPlayers(),
    skills: this.playersService.fetchAllPlayerSkills(),
  }).pipe(
    tap(({ players, skills }) => {
      this.setPlayers(players);
      this.setPlayerSkills(skills);
    }),
  ));

  private setPlayers = this.updater((state, players: Player[]) => ({
    ...state,
    players: keyBy(players, 'id'),
  }));

  private setPlayerSkills = this.updater((state, skills: PlayerSkill[]) => ({
    ...state,
    skills,
  }));

  constructor(
    private playersService: PlayersService,
    private store: Store,
  ) {
    super(initialState);
  }

}
