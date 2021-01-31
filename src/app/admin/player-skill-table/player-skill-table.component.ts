import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PlayerRow } from './player-row';
import { PlayerSkillTableStore } from './player-skill-table.store';

@Component({
  selector: 'app-player-skill-table',
  templateUrl: './player-skill-table.component.html',
  styleUrls: ['./player-skill-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ PlayerSkillTableStore ],
})
export class PlayerSkillTableComponent implements OnInit {

  constructor(
    public readonly store: PlayerSkillTableStore,
  ) { }

  ngOnInit() {
    this.store.loadAll();
  }

  getRowId(row: PlayerRow) {
    return row.id;
  }

}
