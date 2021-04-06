import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import {
  queueRequiredPlayerCount,
  queueCurrentPlayerCount,
} from '../queue.selectors';
import { Title } from '@angular/platform-browser';
import { map, takeUntil, filter } from 'rxjs/operators';
import { environment } from '@environment';

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueContainerComponent implements OnInit, OnDestroy {
  requiredPlayerCount = this.store.select(queueRequiredPlayerCount);
  currentPlayerCount = this.store.select(queueCurrentPlayerCount);
  private destroyed = new Subject<void>();

  constructor(private store: Store, private title: Title) {}

  ngOnInit() {
    combineLatest([
      this.currentPlayerCount,
      this.requiredPlayerCount.pipe(filter(value => value !== null)),
    ])
      .pipe(
        map(([current, required]) => `[${current}/${required}]`),
        takeUntil(this.destroyed),
      )
      .subscribe(text =>
        this.title.setTitle(`${text} ${environment.titleSuffix}`),
      );
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }
}
