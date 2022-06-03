import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { filter, skip, take } from 'rxjs/operators';
import { MapEditComponent } from '../map-edit/map-edit.component';
import { MapPoolStore } from './map-pool.store';

@Component({
  selector: 'app-map-pool-edit',
  templateUrl: './map-pool-edit.component.html',
  styleUrls: ['./map-pool-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MapPoolStore],
})
export class MapPoolEditComponent implements OnInit {
  form = this.formBuilder.group({
    maps: this.formBuilder.array<
      FormGroup<{
        name: FormControl<string>;
        execConfig: FormControl<string>;
      }>
    >([]),
  });

  @ViewChildren(MapEditComponent)
  mapEditComponents: QueryList<MapEditComponent>;

  constructor(
    public readonly store: MapPoolStore,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.store.maps
      .pipe(
        filter(maps => !!maps),
        take(1),
      )
      .subscribe(maps => {
        // ayayay map maps
        this.form.setControl(
          'maps',
          this.formBuilder.array(maps.map(map => this.createMapFromGroup(map))),
        );
        this.changeDetector.markForCheck();
      });

    this.store.loadMaps();
  }

  get maps() {
    return this.form.get('maps') as FormArray;
  }

  remove(i: number) {
    this.maps.removeAt(i);
    this.form.markAsDirty();
  }

  add() {
    this.mapEditComponents.changes
      .pipe(take(1))
      .subscribe((compoents: QueryList<MapEditComponent>) => {
        compoents.last.focus();
      });
    this.maps.push(this.createMapFromGroup());
    this.form.markAsDirty();
  }

  save() {
    this.store.maps.pipe(skip(1), take(1)).subscribe(maps => {
      this.maps.reset(maps);
    });

    this.store.save(this.maps.value);
  }

  private createMapFromGroup(
    { name, execConfig }: { name: string; execConfig?: string } = {
      name: null,
      execConfig: null,
    },
  ) {
    return this.formBuilder.group({
      name: [name, Validators.required],
      execConfig: [execConfig, Validators.pattern(/^\w*$/)],
    });
  }
}
