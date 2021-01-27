import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MapPoolStore } from './map-pool.store';

@Component({
  selector: 'app-map-pool-edit',
  templateUrl: './map-pool-edit.component.html',
  styleUrls: ['./map-pool-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ MapPoolStore ],
})
export class MapPoolEditComponent implements OnInit {

  constructor(
    public readonly store: MapPoolStore,
  ) { }

  ngOnInit() {
    this.store.loadMaps();
  }

}
