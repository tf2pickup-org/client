import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { allPlayers } from '../selectors';
import { loadPlayers, loadAllPlayerSkills } from '../actions';
import { Observable } from 'rxjs';
import { queueConfig } from '@app/queue/queue.selectors';
import { map } from 'rxjs/operators';

interface PlayerRow {
  [gameclass: string]: any;
  id: string;
  name: string;
}

@Component({
  selector: 'app-skill-table',
  templateUrl: './skill-table.component.html',
  styleUrls: ['./skill-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillTableComponent implements OnInit {

  columns: Observable<{ prop: string}[]> = this.store.pipe(
    select(queueConfig),
    map(config => config.classes.map(cls => cls.name)),
    map(value => [ 'name', ...value ]),
    map(props => props.map(prop => ({ prop }))),
  );

  players: Observable<PlayerRow[]> = this.store.pipe(
    select(allPlayers),
    map(players => players.map(player => ({
        id: player.id,
        name: player.name,
        ...player.skill,
      }),
    )),
  );

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
    // eslint-disable-next-line ngrx/avoid-dispatching-multiple-actions-sequentially
    this.store.dispatch(loadPlayers());
    // eslint-disable-next-line ngrx/avoid-dispatching-multiple-actions-sequentially
    this.store.dispatch(loadAllPlayerSkills());
  }

  getRowId(row: PlayerRow) {
    return row.id;
  }

}
