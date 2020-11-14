import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap, filter, takeUntil, first } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { playerById, playersLocked, playerSkillByPlayerId } from '../selectors';
import { loadPlayer, playerEdited, loadPlayerSkill, setPlayerName, setPlayerSkill, playerSkillEdited } from '../actions';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Player } from '../models/player';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, Observable, BehaviorSubject, zip } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-player-edit',
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerEditComponent implements OnInit, OnDestroy {

  player = this.formBuilder.group({
    name: ['', Validators.required],
  });
  locked: Observable<boolean> = this.store.select(playersLocked);
  gameClasses = new BehaviorSubject<string[]>([]);

  private destroyed = new Subject<void>();
  private originalPlayer: Player;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private formBuilder: FormBuilder,
    private actions: Actions,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private title: Title,
    private location: Location,
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  onKeyDown() {
    this.cancel();
  }

  ngOnInit() {
    const getPlayerId = this.route.paramMap.pipe(
      map(params => params.get('id')),
    );

    getPlayerId.pipe(
      switchMap(playerId => this.store.select(playerById(playerId)).pipe(
        tap(player => {
          if (!player) {
            this.store.dispatch(loadPlayer({ playerId }));
          } else {
            this.title.setTitle(`${player.name} • edit • ${environment.titleSuffix}`);
          }
        }),
      )),
      filter(player => !!player),
      first(),
      takeUntil(this.destroyed),
    ).subscribe(player => {
      this.originalPlayer = player;
      this.player.setValue({ name: player.name });
      this.changeDetector.markForCheck();
    });

    getPlayerId.pipe(
      switchMap(playerId => this.store.select(playerSkillByPlayerId(playerId))),
      filter(skill => !!skill),
      first(),
      takeUntil(this.destroyed),
    ).subscribe(skill => {
      this.player.addControl('skill', this.toFormGroup(skill));
      this.gameClasses.next(Object.keys(skill));
      this.changeDetector.markForCheck();
    });

    getPlayerId.pipe(
      takeUntil(this.destroyed),
    ).subscribe(playerId => this.store.dispatch(loadPlayerSkill({ playerId })));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  save() {
    const observables: Observable<any>[] = [];
    const actions: Action[] = [];

    if (this.player.value.name !== this.originalPlayer.name) {
      actions.push(setPlayerName({ playerId: this.originalPlayer.id, name: this.player.value.name }));
      observables.push(
        this.actions.pipe(
          ofType(playerEdited),
          filter(action => action.player.id === this.originalPlayer.id),
          // eslint-disable-next-line
          first(),
        )
      );
    }

    if (JSON.stringify(this.player.value.skill) !== JSON.stringify(this.originalPlayer.skill)) {
      actions.push(setPlayerSkill({ playerId: this.originalPlayer.id, skill: this.player.value.skill }));
      observables.push(
        this.actions.pipe(
          ofType(playerSkillEdited),
          filter(action => action.playerId === this.originalPlayer.id),
          // eslint-disable-next-line
          first(),
        )
      );
    }

    zip(...observables).pipe(
      takeUntil(this.destroyed),
    ).subscribe(() => this.router.navigate(['/player', this.originalPlayer.id]));

    actions.forEach(action => this.store.dispatch(action));
  }

  cancel() {
    this.location.back();
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
