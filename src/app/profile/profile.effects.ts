import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from './profile.service';
import { loadProfile, profileLoaded, acceptRules, rulesAccepted, profileUpdated } from './profile.actions';
import { AuthService } from '@app/auth/auth.service';
import { filter, mergeMap, map, switchMap, mapTo, tap } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AcceptRulesDialogComponent } from './accept-rules-dialog/accept-rules-dialog.component';
import { Observable, fromEvent } from 'rxjs';
import { Store } from '@ngrx/store';
import { Socket } from '@app/io/socket';

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
      filter(({ profile }) => !profile.hasAcceptedRules),
      switchMap(() => this.showAcceptRulesDialog().pipe(
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

  constructor(
    private actions: Actions,
    private profileService: ProfileService,
    private authService: AuthService,
    private modalService: BsModalService,
    private store: Store,
    socket: Socket,
  ) {
    fromEvent(socket, 'profile update').subscribe(profileChanges => this.store.dispatch(profileUpdated({ profileChanges })));
  }

  ngrxOnInitEffects() {
    return loadProfile();
  }

  private showAcceptRulesDialog(): Observable<void> {
    const modal = this.modalService.show(AcceptRulesDialogComponent, {
      keyboard: false,
      ignoreBackdropClick: true,
      class: 'modal-lg',
    });

    return (modal.content as AcceptRulesDialogComponent).rulesAccepted.asObservable().pipe(
      tap(() => modal.hide()),
    );
  }

}
