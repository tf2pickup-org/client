import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AppState } from '@app/app.state';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { queuePlayers } from '../queue.selectors';
import { profile } from '@app/profile/profile.selectors';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-join-or-leave-queue',
  templateUrl: './join-or-leave-queue.component.html',
  styleUrls: ['./join-or-leave-queue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinOrLeaveQueueComponent {

  private _slot: string;

  @Input()
  set slot(slot: string) {
    this._slot = slot;
    this.isInSlot = combineLatest(
      this.store.select(queuePlayers).pipe(map(players => players.filter(p => p.slot === slot))),
      this.store.select(profile),
    ).pipe(
      map(([players, theProfile]) => theProfile && players.find(p => p.playerId === theProfile.id)),
      map(player => !!player),
    );
  }

  get slot() {
    return this._slot;
  }

  isInSlot: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
  ) { }

}
