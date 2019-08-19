import { Component, ChangeDetectionStrategy } from '@angular/core';
import { isInQueue, isPreReadied, preReadyTimeout } from '../queue.selectors';
import { debounceTime, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { togglePreReady } from '../queue.actions';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-pre-ready-up-button',
  templateUrl: './pre-ready-up-button.component.html',
  styleUrls: ['./pre-ready-up-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreReadyUpButtonComponent {

  isInQueue = this.store.select(isInQueue).pipe(debounceTime(100));
  preReadied = this.store.select(isPreReadied);
  timeout = this.store.select(preReadyTimeout);
  text: Observable<string> = combineLatest([this.preReadied, this.timeout]).pipe(
    map(([preReadied, timeout]) => preReadied ? `${timeout}` : 'Pre-ready up'),
  );

  constructor(
    private store: Store<AppState>,
  ) { }

  preReadyToggle() {
    this.store.dispatch(togglePreReady());
  }

}
