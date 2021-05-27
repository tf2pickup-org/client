import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from './profile.service';
import {
  loadProfile,
  profileLoaded,
  acceptRules,
  rulesAccepted,
  profileUpdated,
  savePreferences,
  preferencesUpdated,
  linkedProfilesLoaded,
} from './profile.actions';
import { AuthService } from '@app/auth/auth.service';
import {
  filter,
  mergeMap,
  map,
  switchMap,
  mapTo,
  withLatestFrom,
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Store } from '@ngrx/store';
import { Socket } from '@app/io/socket';
import { AcceptRulesDialogService } from './accept-rules-dialog.service';
import { currentPlayer } from './profile.selectors';
import { PlayersService } from '@app/players/players.service';

@Injectable()
export class ProfileEffects implements OnInitEffects {
  loadProfile = createEffect(() => {
    return this.actions.pipe(
      ofType(loadProfile),
      filter(() => this.authService.authenticated),
      mergeMap(() => this.profileService.fetchProfile()),
      map(profile => profileLoaded({ profile })),
    );
  });

  loadLinkedProfiles = createEffect(() => {
    return this.actions.pipe(
      ofType(profileLoaded),
      withLatestFrom(this.store.select(currentPlayer)),
      map(([, player]) => player.id),
      mergeMap(playerId =>
        this.playersService.fetchPlayerLinkedProfiles(playerId).pipe(
          map(linkedProfiles => linkedProfiles.linkedProfiles),
          map(linkedProfiles => linkedProfilesLoaded({ linkedProfiles })),
        ),
      ),
    );
  });

  promptUserToAcceptRules = createEffect(() => {
    return this.actions.pipe(
      ofType(profileLoaded),
      filter(({ profile }) => !profile.hasAcceptedRules),
      switchMap(() =>
        this.acceptRulesDialogService
          .showAcceptRulesDialog()
          .pipe(mapTo(acceptRules())),
      ),
    );
  });

  acceptRules = createEffect(() => {
    return this.actions.pipe(
      ofType(acceptRules),
      switchMap(() =>
        this.profileService.acceptRules().pipe(mapTo(rulesAccepted())),
      ),
    );
  });

  savePreferences = createEffect(() => {
    return this.actions.pipe(
      ofType(savePreferences),
      mergeMap(({ preferences }) =>
        this.profileService.savePreferences(preferences),
      ),
      map(preferences => preferencesUpdated({ preferences })),
    );
  });

  constructor(
    private actions: Actions,
    private profileService: ProfileService,
    private authService: AuthService,
    private store: Store,
    socket: Socket,
    private acceptRulesDialogService: AcceptRulesDialogService,
    private playersService: PlayersService,
  ) {
    fromEvent(socket, 'profile update').subscribe(profileChanges =>
      this.store.dispatch(profileUpdated({ profileChanges })),
    );
  }

  ngrxOnInitEffects() {
    return loadProfile();
  }
}
