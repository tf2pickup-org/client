import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { timer, BehaviorSubject } from 'rxjs';
import { takeWhile, finalize, debounceTime } from 'rxjs/operators';
import { stopPreReady } from './queue.actions';
import { isPreReadied } from './queue.selectors';

@Injectable({
  providedIn: 'root'
})
export class PreReadyService {

  private readonly defaultTimeout = 300; // 5 minutes
  private _timeout = new BehaviorSubject<number>(this.defaultTimeout);
  private isCounting = false;

  get timeout() {
    return this._timeout.asObservable();
  }

  constructor(
    private store: Store,
  ) {
    this.store.pipe(
      select(isPreReadied),
      debounceTime(1000),
    ).subscribe(preReadied => {
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
    this._timeout.next(this.defaultTimeout);

    timer(0, 1000).pipe(
      // eslint-disable-next-line rxjs/no-ignored-takewhile-value
      takeWhile(() => this.isCounting),
      finalize(() => {
        this.store.dispatch(stopPreReady());
        this._timeout.next(this.defaultTimeout);
      }),
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
