import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  map,
  switchMap,
  tap,
  first,
  filter,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { playerById, playerBansLocked } from '../selectors';
import { loadPlayer, addPlayerBan, playerBanAdded } from '../actions';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Player } from '../models/player';
import { Actions, ofType } from '@ngrx/effects';
import { Location } from '@angular/common';
import { currentPlayer } from '@app/profile/profile.selectors';

interface BanLengthValue {
  label: string;
  toDate: () => Date;
}

@Component({
  selector: 'app-add-player-ban',
  templateUrl: './add-player-ban.component.html',
  styleUrls: ['./add-player-ban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPlayerBanComponent implements OnInit, OnDestroy {
  readonly lengthValues: BanLengthValue[] = [
    {
      label: '1 hour',
      toDate: () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        return date;
      },
    },
    {
      label: '2 hours',
      toDate: () => {
        const date = new Date();
        date.setHours(date.getHours() + 2);
        return date;
      },
    },
    {
      label: '6 hours',
      toDate: () => {
        const date = new Date();
        date.setHours(date.getHours() + 6);
        return date;
      },
    },
    {
      label: '24 hours',
      toDate: () => {
        const date = new Date();
        date.setHours(date.getHours() + 24);
        return date;
      },
    },
    {
      label: '3 days',
      toDate: () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date;
      },
    },
    {
      label: '7 days',
      toDate: () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      },
    },
    {
      label: '2 weeks',
      toDate: () => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date;
      },
    },
    {
      label: '4 weeks',
      toDate: () => {
        const date = new Date();
        date.setDate(date.getDate() + 28);
        return date;
      },
    },
    {
      label: '6 months',
      toDate: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 6);
        return date;
      },
    },
    {
      label: '1 year',
      toDate: () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date;
      },
    },
    {
      label: 'forever',
      toDate: () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 100);
        return date;
      },
    },
  ];

  player: Observable<Player>;
  lengthLabel = new BehaviorSubject<string>(this.lengthValues[0].label);
  isSubmitLocked = this.store.select(playerBansLocked);
  locked = this.store.select(playerBansLocked);

  banForm = this.formBuilder.group({
    length: [0],
    reason: ['', Validators.required],
  });

  private destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private formBuilder: FormBuilder,
    private router: Router,
    private actions: Actions,
    private location: Location,
  ) {
    this.banForm.get('length').valueChanges.subscribe(value => {
      this.lengthLabel.next(this.lengthValues[value].label);
    });
  }

  ngOnInit() {
    const getPlayerId = this.route.paramMap.pipe(
      map(params => params.get('id')),
    );

    this.player = getPlayerId.pipe(
      switchMap(playerId =>
        this.store.select(playerById(playerId)).pipe(
          tap(player => {
            if (!player) {
              this.store.dispatch(loadPlayer({ playerId }));
            }
          }),
        ),
      ),
    );

    getPlayerId.subscribe(playerId => {
      this.actions
        .pipe(
          ofType(playerBanAdded),
          filter(action => action.playerBan.player === playerId),
          takeUntil(this.destroyed),
        )
        .subscribe(() => this.router.navigate(['/player', playerId, 'bans']));
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  submit() {
    this.player
      .pipe(
        first(),
        map(player => player.id),
        map(player => ({
          player,
          start: new Date(),
          end: this.lengthValues[this.banForm.get('length').value].toDate(),
          reason: this.banForm.get('reason').value,
        })),
        withLatestFrom(this.store.select(currentPlayer)),
        map(([playerBan, admin]) => ({ ...playerBan, admin: admin.id })),
      )
      .subscribe(playerBan => this.store.dispatch(addPlayerBan({ playerBan })));
  }

  cancel() {
    this.location.back();
  }
}
