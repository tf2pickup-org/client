import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { loadPlayer, playerEdited } from '../actions';
import { playerById } from '../selectors';
import { Location } from '@angular/common';
import { PlayersService } from '../players.service';
import { PlayerRole } from '../models/player-role';

@Component({
  selector: 'app-edit-player-roles',
  templateUrl: './edit-player-roles.component.html',
  styleUrls: ['./edit-player-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPlayerRolesComponent implements OnInit, OnDestroy {

  readonly rolesAvailable: { label: string, value: PlayerRole }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Super user', value: 'super user' },
  ];

  player = this.formBuilder.group({
    roles: new FormArray(this.rolesAvailable.map(() => new FormControl(false))),
  });

  ready = new BehaviorSubject<boolean>(false);

  private playerId: string;
  private destroyed = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private title: Title,
    private location: Location,
    private playersService: PlayersService,
  ) { }

  ngOnInit() {
    // load the given player
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      tap(playerId => this.playerId = playerId),
      takeUntil(this.destroyed),
      switchMap(playerId => this.store.select(playerById(playerId)).pipe(
        tap(player => {
          if (!player) {
            this.store.dispatch(loadPlayer({ playerId }));
          }
        }),
      )),
      filter(player => !!player),
      take(1),
    ).subscribe(player => {
      this.player.patchValue({ roles: this.rolesAvailable.map(role => player.roles.includes(role.value)) });
      this.title.setTitle(`${player.name} • edit role • ${environment.titleSuffix}`);
      this.ready.next(true);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    if (this.playerId) {
      this.ready.next(false);
      const roles = this.rolesAvailable
        .filter((role, i) => this.roles.controls[i].value)
        .map(role => role.value);

      this.playersService.setPlayerRoles(this.playerId, roles).subscribe(player => {
        this.store.dispatch(playerEdited({ player }));
        this.location.back();
      });
    }
  }

  get roles(): FormArray {
    return this.player.get('roles') as FormArray;
  }

}
