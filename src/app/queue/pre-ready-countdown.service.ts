import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { timer } from 'rxjs';
import { preReadyTimeoutCountDown } from './queue.actions';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreReadyCountdownService {

  private isCounting = false;

  constructor(
    private store: Store<AppState>,
  ) { }

  start() {
    if (this.isCounting) {
      return;
    }

    this.isCounting = true;
    timer(1000, 1000).pipe(
      takeWhile(() => this.isCounting),
    ).subscribe(() => this.store.dispatch(preReadyTimeoutCountDown()));
  }

  stop() {
    this.isCounting = false;
  }

}
