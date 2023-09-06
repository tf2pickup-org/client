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
import { format, add, intervalToDuration, formatDuration } from 'date-fns';
import { playerById, playerBansLocked } from '../selectors';
import { loadPlayer, addPlayerBan, playerBanAdded } from '../actions';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Player } from '../models/player';
import { Actions, ofType } from '@ngrx/effects';
import { Location } from '@angular/common';
import { currentPlayer } from '@app/profile/profile.selectors';

type DurationUnit =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years';

type BanDurationInputType = 'duration' | 'endDate' | 'forever';

const getDurationToDate = (dateTimeString: string): string => {
  const epochValue = Date.parse(dateTimeString);
  if (Number.isNaN(epochValue)) {
    return 'Invalid date';
  }
  if (epochValue <= Date.now()) {
    return 'End date must be after current date';
  }

  const duration = intervalToDuration({
    start: new Date(),
    end: new Date(epochValue),
  });
  return formatDuration(duration);
};

const endDateTimeValidator: ValidatorFn = groupControl => {
  if (groupControl.get('durationInputType').value !== 'endDate') {
    return null;
  }

  const fullBanEndDate = `${groupControl.get('endDate').value} ${
    groupControl.get('endTime').value
  }`;
  const endDateEpoch = Date.parse(fullBanEndDate);
  if (Number.isNaN(endDateEpoch)) {
    return { endDate: 'Date or time are invalid' };
  }
  if (endDateEpoch < Date.now()) {
    return { endDate: 'End date must be after current date' };
  }
  return null;
};

@Component({
  selector: 'app-add-player-ban',
  templateUrl: './add-player-ban.component.html',
  styleUrls: ['./add-player-ban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPlayerBanComponent implements OnInit, OnDestroy {
  player: Observable<Player>;
  banExpirationDate = new BehaviorSubject<string>(new Date().toLocaleString());
  banDuration = new BehaviorSubject<string>('0 seconds');
  durationInputType = new BehaviorSubject<BanDurationInputType>('duration');
  isSubmitLocked = this.store.select(playerBansLocked);
  locked = this.store.select(playerBansLocked);

  banForm = this.formBuilder.group(
    {
      durationInputType: ['duration' as BanDurationInputType],
      durationUnit: ['seconds' as DurationUnit],
      durationValue: [1],
      endDate: [new Date().toLocaleString()],
      endTime: [new Date().toLocaleTimeString()],
      reason: ['', Validators.required],
    },
    { validators: endDateTimeValidator },
  );

  private readonly destroyed = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly actions: Actions,
    private readonly location: Location,
  ) {
    const now = new Date();
    this.banForm.get('endDate').setValue(format(now, 'yyyy-MM-dd'));
    this.banForm.get('endTime').setValue(format(now, 'HH:mm'));

    this.banForm
      .get('durationInputType')
      .valueChanges.subscribe(durationInputType => {
        this.durationInputType.next(durationInputType);
        if (durationInputType === 'forever') {
          this.banExpirationDate.next(
            add(new Date(), { years: 100 }).toLocaleString(),
          );
        } else {
          this.banExpirationDate.next(new Date().toLocaleString());
        }
      });

    this.banForm.get('durationUnit').valueChanges.subscribe(durationUnit => {
      const duration = {
        [durationUnit]: this.banForm.get('durationValue').value,
      };
      this.banExpirationDate.next(add(new Date(), duration).toLocaleString());
    });

    this.banForm.get('durationValue').valueChanges.subscribe(durationValue => {
      const duration = {
        [this.banForm.get('durationUnit').value]: durationValue,
      };
      this.banExpirationDate.next(add(new Date(), duration).toLocaleString());
    });

    this.banForm.get('endDate').valueChanges.subscribe(endDate => {
      const dateTimeString = `${endDate} ${this.banForm.get('endTime').value}`;
      this.banDuration.next(getDurationToDate(dateTimeString));
    });

    this.banForm.get('endTime').valueChanges.subscribe(endTime => {
      const dateTimeString = `${this.banForm.get('endDate').value} ${endTime}`;
      this.banDuration.next(getDurationToDate(dateTimeString));
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

  getEndDate() {
    switch (this.banForm.get('durationInputType').value) {
      case 'duration':
        return add(new Date(), {
          [this.banForm.get('durationUnit').value]:
            this.banForm.get('durationValue').value,
        });
      case 'endDate':
        return new Date(
          `${this.banForm.get('endDate').value} ${
            this.banForm.get('endTime').value
          }`,
        );
      case 'forever':
        return add(new Date(), { years: 100 });
      default:
        throw new Error('Unsupported ban duration input type');
    }
  }

  submit() {
    this.player
      .pipe(
        first(),
        map(player => player.id),
        map(player => ({
          player,
          start: new Date(),
          end: this.getEndDate(),
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
