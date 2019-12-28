import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { isAdmin } from '@app/profile/profile.selectors';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  constructor(
    private store: Store<AppState>,
  ) { }

  canActivate(): Observable<boolean> {
    return this.store.select(isAdmin);
  }

}
