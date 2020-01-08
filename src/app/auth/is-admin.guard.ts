import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { isAdmin } from '@app/profile/profile.selectors';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  constructor(
    private store: Store<{}>,
  ) { }

  canActivate(): Observable<boolean> {
    return this.store.select(isAdmin);
  }

}
