import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { allPlayers } from '../selectors';
import { loadPlayers, loadAllPlayerSkills } from '../actions';
import { Observable } from 'rxjs';
import { queueConfig } from '@app/queue/queue.selectors';
import { map } from 'rxjs/operators';

interface PlayerRow {
  id: string;
  name: string;
  [gameclass: string]: any;
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
    map(players => players.map(player => {
      return {
        id: player.id,
        name: player.name,
        ...player.skill,
      };
    })),
  );

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(loadPlayers());
    this.store.dispatch(loadAllPlayerSkills());
  }

  getRowId(row: PlayerRow) {
    return row.id;
  }

}
