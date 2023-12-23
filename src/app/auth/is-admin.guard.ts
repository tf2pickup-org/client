import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { profile } from '@app/profile/profile.selectors';
import { filter, map } from 'rxjs/operators';
import { Profile } from '@app/profile/models/profile';
import { PlayerRole } from '@app/players/models/player-role';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuard {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.select(profile).pipe(
      filter(profile =>
        ['authenticated', 'not authenticated'].includes(profile.authenticated),
      ),
      map(profile => {
        if (profile.authenticated === 'not authenticated') {
          return false;
        } else {
          return (['admin', 'super user'] as PlayerRole[]).some(role =>
            (profile as Profile).player.roles.includes(role),
          );
        }
      }),
    );
  }
}
