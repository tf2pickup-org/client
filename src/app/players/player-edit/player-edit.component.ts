import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap, filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { playerById, playersLocked } from '../players.selectors';
import { loadPlayer, editPlayer, playerEdited, loadPlayerSkill } from '../players.actions';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Player } from '../models/player';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

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
  gameClasses = new BehaviorSubject<string[]>([]);

  @HostListener('document:keydown.escape', ['$event'])
  onKeyDown() {
    this.cancel();
  }

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private actions: Actions,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const getPlayerId = this.route.paramMap.pipe(
      map(params => params.get('id')),
    );

    getPlayerId.pipe(
      switchMap(playerId => this.store.select(playerById(playerId)).pipe(
        tap(player => {
          if (!player) {
            this.store.dispatch(loadPlayer({ playerId }));
          }
        }),
      )),
      filter(player => !!player),
      takeUntil(this.destroyed),
    ).subscribe(player => {
      this.originalPlayer = player;

      if (this.player.get('skill')) {
        this.player.removeControl('skill');
      }

      this.player.setValue({ name: player.name });

      if (player.skill) {
        this.player.addControl('skill', this.toFormGroup(player.skill));
        this.gameClasses.next(Object.keys(player.skill));
      }

      this.changeDetector.markForCheck();
    });

    getPlayerId.pipe(
      takeUntil(this.destroyed),
    ).subscribe(playerId => this.store.dispatch(loadPlayerSkill({ playerId })));

    getPlayerId.subscribe(playerId => {
      this.actions.pipe(
        ofType(playerEdited),
        filter(action => action.player.id === playerId),
        takeUntil(this.destroyed),
      ).subscribe(() => this.router.navigate(['/player', playerId]));
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

  cancel() {
    this.router.navigate(['/player', this.originalPlayer.id]);
  }

  get skill() {
    return this.player.get('skill') as FormGroup;
  }

  private toFormGroup(skill: { [gameClass: string]: number }): FormGroup {
    const group = { };
    Object.keys(skill).forEach(gameClass => {
      group[gameClass] = new FormControl(skill[gameClass]);
    });
    return new FormGroup(group);
  }

}
