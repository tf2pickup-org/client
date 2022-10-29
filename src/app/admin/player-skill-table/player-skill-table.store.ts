import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { PlayersService } from '@app/players/players.service';
import { PlayerSkill } from '@app/players/models/player-skill';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PlayerRow } from './player-row';
import { Store } from '@ngrx/store';
import { queueConfig } from '@app/queue/queue.selectors';

type SkillTableState = PlayerSkill[];
const initialState: SkillTableState = [];

@Injectable()
export class PlayerSkillTableStore extends ComponentStore<SkillTableState> {
  players: Observable<PlayerRow[]> = this.select(state =>
    state.map(s => ({
      ...s.skill,
      id: s.id,
      name: s.name,
    })),
  );

  columns: Observable<{ prop: string }[]> = this.store.select(queueConfig).pipe(
    map(config => config.classes.map(cls => cls.name)),
    map(value => ['name', ...value]),
    map(props => props.map(prop => ({ prop }))),
  );

  loadAll = this.effect(() =>
    this.playersService
      .fetchAllPlayerSkills()
      .pipe(tap((skills: PlayerSkill[]) => this.setPlayerSkills(skills))),
  );

  private setPlayerSkills = this.updater(
    (state, skills: PlayerSkill[]): SkillTableState => [...skills],
  );

  constructor(private playersService: PlayersService, private store: Store) {
    super(initialState);
  }
}
