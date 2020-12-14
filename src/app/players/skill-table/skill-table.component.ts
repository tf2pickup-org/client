import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SkillTableStore } from './skill-table.store';
import { PlayerRow } from './player-row';

@Component({
  selector: 'app-skill-table',
  templateUrl: './skill-table.component.html',
  styleUrls: ['./skill-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ SkillTableStore ],
})
export class SkillTableComponent implements OnInit {

  constructor(
    public readonly store: SkillTableStore,
  ) { }

  ngOnInit() {
    this.store.loadAll();
  }

  getRowId(row: PlayerRow) {
    return row.id;
  }

}
