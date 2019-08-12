import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { combineLatest, Subject } from 'rxjs';
import { activeGame } from '@app/games/games.selectors';
import { queueRequiredPlayerCount, queueCurrentPlayerCount } from '../queue.selectors';
import { Title } from '@angular/platform-browser';
import { map, debounceTime, takeUntil } from 'rxjs/operators';
import { environment } from '@environment';

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueContainerComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  activeGame = this.store.select(activeGame);
  requiredPlayerCount = this.store.select(queueRequiredPlayerCount);
  currentPlayerCount = this.store.select(queueCurrentPlayerCount);

  constructor(
    private store: Store<AppState>,
    private title: Title,
  ) { }

  ngOnInit() {
    combineLatest([
      this.currentPlayerCount,
      this.requiredPlayerCount,
    ]).pipe(
      debounceTime(100),
      map(([current, required]) => `[${current}/${required}]`),
      takeUntil(this.destroyed),
    ).subscribe(text => this.title.setTitle(`${text} ${environment.titleSuffix}`));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

}
