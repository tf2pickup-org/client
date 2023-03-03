import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { preferencesUpdated, savePreferences } from '../profile.actions';
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

  isSaving = new BehaviorSubject<boolean>(false);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private actions: Actions,
  ) {}

  ngOnInit() {
    const defaultValues = this.form.value;

    this.store
      .select(preferences)
      .pipe(
        filter(preferences => !!preferences),
        take(1),
        map(preferences => ({ ...defaultValues, ...preferences })),
      )
      .subscribe(preferences => {
        this.form.patchValue(preferences);
      });
  }

  save() {
    this.isSaving.next(true);
    this.actions
      .pipe(ofType(preferencesUpdated), take(1))
      .subscribe(({ preferences }) => {
        this.form.reset(preferences);
        this.isSaving.next(false);
      });

    this.store.dispatch(
      savePreferences({
        preferences: {
          soundVolume: `${this.form.value.soundVolume}`,
        },
      }),
    );
  }
}
