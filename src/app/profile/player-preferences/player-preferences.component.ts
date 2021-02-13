import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';
import { savePreferences } from '../profile.actions';
import { preferences } from '../profile.selectors';

@Component({
  selector: 'app-player-preferences',
  templateUrl: './player-preferences.component.html',
  styleUrls: ['./player-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPreferencesComponent implements OnInit {

  form = this.formBuilder.group({
    soundVolume: [1.0],
  });

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) { }

  ngOnInit() {
    const defaultValues = this.form.value;

    this.store.pipe(
      select(preferences),
      filter(preferences => !!preferences),
      take(1),
      map(preferences => ({ ...defaultValues, ...preferences })),
    ).subscribe(preferences => {
      this.form.patchValue(preferences);
    });
  }

  save() {
    this.store.dispatch(savePreferences({ preferences: {
      soundVolume: `${this.form.value.soundVolume}`,
    } }));
  }

}
