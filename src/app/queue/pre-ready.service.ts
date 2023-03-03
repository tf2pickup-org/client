import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { stopPreReady } from './queue.actions';
import { isPreReadied } from './queue.selectors';

@Injectable({
  providedIn: 'root',
})
export class PreReadyService {
  private readonly defaultTimeout = 300; // 5 minutes
  private _timeout = new BehaviorSubject<number>(this.defaultTimeout);
  private timer: ReturnType<typeof setInterval>;

  get timeout() {
    return this._timeout.asObservable();
  }

  constructor(private store: Store) {
    this.store.select(isPreReadied).subscribe(preReadied => {
      if (preReadied) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  start() {
    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => this.onTimeout(), 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    this.store.dispatch(stopPreReady());
    this._timeout.next(this.defaultTimeout);
  }

  private onTimeout() {
    this._timeout.next(this._timeout.value - 1);
    if (this._timeout.value <= 0) {
      this.stop();
    }
  }
}
