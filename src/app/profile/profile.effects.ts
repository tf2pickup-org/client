import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from './profile.service';
import { loadProfile, profileLoaded } from './profile.actions';
import { AuthService } from '@app/auth/auth.service';
import { filter, mergeMap, map } from 'rxjs/operators';

@Injectable()
export class ProfileEffects implements OnInitEffects {

  loadProfile = createEffect(() =>
    this.actions.pipe(
      ofType(loadProfile),
      filter(() => this.authService.authenticated),
      mergeMap(() => this.profileService.fetchProfile()),
      map(profile => profileLoaded({ profile })),
    )
  );

  constructor(
    private actions: Actions,
    private profileService: ProfileService,
    private authService: AuthService,
  ) { }

  ngrxOnInitEffects() {
    return loadProfile();
  }

}
