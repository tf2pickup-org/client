import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { isAdmin, profile } from '@app/profile/profile.selectors';
import { filter, map } from 'rxjs/operators';
import { Profile } from '@app/profile/models/profile';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  constructor(
    private store: Store,
  ) { }

  canActivate(): Observable<boolean> {
    return this.store.select(profile).pipe(
      filter(profile => ['authenticated', 'not authenticated'].includes(profile.authenticated)),
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(profile => {
        if (profile.authenticated === 'not authenticated') {
          return false;
        } else {
          return ['admin', 'super-user'].includes((profile as Profile).player.role);
        }
      })
    );
  }

}
