import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { combineLatest, Subject } from 'rxjs';
import { queueRequiredPlayerCount, queueCurrentPlayerCount } from '../queue.selectors';
import { Title } from '@angular/platform-browser';
import { map, takeUntil, filter } from 'rxjs/operators';
import { environment } from '@environment';
import { AuthService } from '@app/auth/auth.service';

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueContainerComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  requiredPlayerCount = this.store.select(queueRequiredPlayerCount);
  currentPlayerCount = this.store.select(queueCurrentPlayerCount);
  authenticated = this.authService.authenticated;

  constructor(
    private store: Store<AppState>,
    private title: Title,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    combineLatest([
      this.currentPlayerCount,
      this.requiredPlayerCount.pipe(filter(value => value !== null)),
    ]).pipe(
      map(([current, required]) => `[${current}/${required}]`),
      takeUntil(this.destroyed),
    ).subscribe(text => this.title.setTitle(`${text} ${environment.titleSuffix}`));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

}
