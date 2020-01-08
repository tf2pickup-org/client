import { Component, ChangeDetectionStrategy } from '@angular/core';
import { isInQueue, isPreReadied } from '../queue.selectors';
import { debounceTime, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { togglePreReady } from '../queue.actions';
import { Observable, combineLatest } from 'rxjs';
import { PreReadyService } from '../pre-ready.service';

@Component({
  selector: 'app-pre-ready-up-button',
  templateUrl: './pre-ready-up-button.component.html',
  styleUrls: ['./pre-ready-up-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreReadyUpButtonComponent {

  isInQueue = this.store.select(isInQueue).pipe(debounceTime(100));
  preReadied = this.store.select(isPreReadied);
  timeout = this.preReadyService.timeout;
  text: Observable<string | number> = combineLatest([this.preReadied, this.timeout]).pipe(
    map(([preReadied, timeout]) => preReadied ? timeout : 'Pre-ready up'),
  );

  constructor(
    private store: Store<{}>,
    private preReadyService: PreReadyService,
  ) { }

  preReadyToggle() {
    this.store.dispatch(togglePreReady());
  }

}
