import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { timer, BehaviorSubject } from 'rxjs';
import { takeWhile, finalize } from 'rxjs/operators';
import { stopPreReady } from './queue.actions';
import { isPreReadied } from './queue.selectors';

@Injectable({
  providedIn: 'root'
})
export class PreReadyService {

  private readonly defaultTmeout = 180; // 3 minutes
  private _timeout = new BehaviorSubject<number>(1000);
  private isCounting = false;

  get timeout() {
    return this._timeout.asObservable();
  }

  constructor(
    private store: Store<AppState>,
  ) {
    this.store.select(isPreReadied).subscribe(preReadied => {
      if (preReadied) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  start() {
    if (this.isCounting) {
      return;
    }

    this.isCounting = true;
    this._timeout.next(this.defaultTmeout);

    timer(1000, 1000).pipe(
      takeWhile(() => this.isCounting),
      finalize(() => this.store.dispatch(stopPreReady())),
    ).subscribe(() => {
      this._timeout.next(this._timeout.value - 1);
      if (this._timeout.value <= 0) {
        this.isCounting = false;
      }
    });
  }

  stop() {
    this.isCounting = false;
  }

}
