import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap, first, filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { playerById, playerBansLocked } from '../selectors';
import { loadPlayer, addPlayerBan, playerBanAdded } from '../actions';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Player } from '../models/player';
import { Actions, ofType } from '@ngrx/effects';
import { Location } from '@angular/common';
import { profile } from '@app/profile/profile.selectors';

@Component({
  selector: 'app-add-player-ban',
  templateUrl: './add-player-ban.component.html',
  styleUrls: ['./add-player-ban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPlayerBanComponent implements OnInit, OnDestroy {

  readonly lengthValues = [
    '1 hour',
    '6 hours',
    '24 hours',
    '3 days',
    '7 days',
    '2 weeks',
    '4 weeks',
    '6 months',
    '1 year',
    'forever',
  ];

  player: Observable<Player>;

  lengthLabel = new BehaviorSubject<string>(this.lengthValues[0]);
  isSubmitLocked = this.store.select(playerBansLocked);

  banForm = this.formBuilder.group({
    length: [ 0 ],
    reason: [ '', Validators.required ],
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
      this.lengthLabel.next(this.lengthValues[value]);
    });
  }

  ngOnInit() {
    const getPlayerId = this.route.paramMap.pipe(
      map(params => params.get('id')),
    );

    this.player = getPlayerId.pipe(
      switchMap(playerId => this.store.select(playerById(playerId)).pipe(
        tap(player => {
          if (!player) {
            this.store.dispatch(loadPlayer({ playerId }));
          }
        }),
      )),
    );

    getPlayerId.subscribe(playerId => {
      this.actions.pipe(
        ofType(playerBanAdded),
        filter(action => action.playerBan.player === playerId),
        takeUntil(this.destroyed),
      ).subscribe(() => this.router.navigate(['/player', playerId, 'bans']));
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  submit() {
    this.player.pipe(
      first(),
      map(player => player.id),
      map(player => ({
        player,
        start: new Date(),
        end: this.getBanEnd(),
        reason: this.banForm.get('reason').value,
      })),
      withLatestFrom(this.store.select(profile)),
      map(([playerBan, theProfile]) => ({ ...playerBan, admin: theProfile.id })),
    ).subscribe(playerBan => this.store.dispatch(addPlayerBan({ playerBan })));
  }

  cancel() {
    this.location.back();
  }

  private getBanEnd() {
    const end = new Date();

    switch (this.banForm.get('length').value) {
      case 0: // 1 hour
        end.setHours(end.getHours() + 1);
        break;

      case 1: // 6 hours
        end.setHours(end.getHours() + 6);
        break;

      case 2: // 24 hours
        end.setHours(end.getHours() + 24);
        break;

      case 3: // 3 days
        end.setDate(end.getDate() + 3);
        break;

      case 4: // 7 days
        end.setDate(end.getDate() + 7);
        break;

      case 5: // 2 weeks
        end.setDate(end.getDate() + 14);
        break;

      case 6: // 4 weeks
        end.setDate(end.getDate() + 28);
        break;

      case 7: // 6 months
        end.setMonth(end.getMonth() + 6);
        break;

      case 8: // 1 year
        end.setFullYear(end.getFullYear() + 1);
        break;

      case 9: // forever
        end.setFullYear(end.getFullYear() + 100);
        break;
    }

    return end;
  }

}
