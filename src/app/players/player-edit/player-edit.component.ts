import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap, filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { playerById, playersLocked } from '../players.selectors';
import { loadPlayer, editPlayer, playerEdited } from '../players.actions';
import { FormBuilder, Validators } from '@angular/forms';
import { Player } from '../models/player';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-player-edit',
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerEditComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  private originalPlayer: Player;
  player = this.formBuilder.group({
    name: ['', Validators.required],
  });
  locked: Observable<boolean> = this.store.select(playersLocked);

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private actions: Actions,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.store.select(playerById(id)).pipe(
        tap(player => {
          if (!player) {
            this.store.dispatch(loadPlayer({ playerId: id }));
          }
        }),
      )),
      filter(player => !!player),
      takeUntil(this.destroyed),
    ).subscribe(player => {
      this.originalPlayer = player;
      this.player.setValue({
        name: player.name,
      });

      this.actions.pipe(
        ofType(playerEdited),
        filter(action => action.player.id === player.id),
        takeUntil(this.destroyed),
      ).subscribe(() => this.router.navigate(['/player', player.id]));
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  save() {
    const player: Player = { ...this.originalPlayer, ...this.player.value };
    this.store.dispatch(editPlayer({ player }));
  }

}
