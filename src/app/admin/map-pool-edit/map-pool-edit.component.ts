import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { filter, take } from 'rxjs/operators';
import { MapEditComponent } from '../map-edit/map-edit.component';
import { MapPoolStore } from './map-pool.store';

@Component({
  selector: 'app-map-pool-edit',
  templateUrl: './map-pool-edit.component.html',
  styleUrls: ['./map-pool-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ MapPoolStore ],
})
export class MapPoolEditComponent implements OnInit {

  form = this.formBuilder.group({
    maps: this.formBuilder.array([]),
  });

  @ViewChildren(MapEditComponent)
  mapEditComponents: QueryList<MapEditComponent>;

  constructor(
    public readonly store: MapPoolStore,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.store.maps.pipe(
      filter(maps => !!maps),
      take(1),
    ).subscribe(maps => {
      // ayayay map maps
      this.form.setControl('maps', this.formBuilder.array(maps.map(map => this.formBuilder.group({ name: map.name, execConfig: map.execConfig }))));
      this.changeDetector.markForCheck();
    });

    this.form.valueChanges.subscribe(value => console.log(value));

    this.store.loadMaps();
  }

  get maps() {
    return this.form.get('maps') as FormArray;
  }

  remove(i: number) {
    this.maps.removeAt(i);
  }

  add() {
    this.mapEditComponents.changes.pipe(
      take(1),
    ).subscribe((compoents: QueryList<MapEditComponent>) => {
      compoents.last.focus();
    });
    this.maps.push(this.formBuilder.group({ name: null, execConfig: null }));
  }

}
