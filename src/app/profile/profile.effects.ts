import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from './profile.service';
import { loadProfile, profileLoaded, acceptRules, rulesAccepted, profileUpdated, savePreferences, preferencesUpdated } from './profile.actions';
import { AuthService } from '@app/auth/auth.service';
import { filter, mergeMap, map, switchMap, mapTo } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Store } from '@ngrx/store';
import { Socket } from '@app/io/socket';
import { AcceptRulesDialogService } from './accept-rules-dialog.service';

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

  promptUserToAcceptRules = createEffect(() =>
    this.actions.pipe(
      ofType(profileLoaded),
      filter(({ profile }) => !profile.player.hasAcceptedRules),
      switchMap(() => this.acceptRulesDialogService.showAcceptRulesDialog().pipe(
        mapTo(acceptRules()),
      )),
    ),
  );

  acceptRules = createEffect(() =>
    this.actions.pipe(
      ofType(acceptRules),
      switchMap(() => this.profileService.acceptRules().pipe(
        mapTo(rulesAccepted()),
      )),
    )
  );

  savePreferences = createEffect(() => this.actions.pipe(
    ofType(savePreferences),
    mergeMap(({ preferences }) => this.profileService.savePreferences(preferences)),
    map(preferences => preferencesUpdated({ preferences })),
  ));

  constructor(
    private actions: Actions,
    private profileService: ProfileService,
    private authService: AuthService,
    private store: Store,
    socket: Socket,
    private acceptRulesDialogService: AcceptRulesDialogService,
  ) {
    fromEvent(socket, 'profile update').subscribe(profileChanges => this.store.dispatch(profileUpdated({ profileChanges })));
  }

  ngrxOnInitEffects() {
    return loadProfile();
  }

}
