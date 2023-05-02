import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil, pairwise, filter, take } from 'rxjs/operators';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';
import { Location } from '@angular/common';
import { PlayerSkill } from '../models/player-skill';
import { PlayerEditStore } from './player-edit.store';

const toFormGroup = (skill: PlayerSkill['skill']): FormGroup => {
  const group = {};
  Object.keys(skill).forEach(gameClass => {
    group[gameClass] = new FormControl(skill[gameClass]);
  });
  return new FormGroup(group);
};

@Component({
  selector: 'app-player-edit',
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlayerEditStore],
})
export class PlayerEditComponent implements OnInit, OnDestroy {
  player = this.formBuilder.group({
    name: ['', Validators.required],
    skill: this.formBuilder.group<{ [className: string]: FormControl<number> }>(
      {},
    ),
  });
  gameClasses = new BehaviorSubject<string[]>([]);

  private destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private title: Title,
    private location: Location,
    public readonly store: PlayerEditStore,
  ) {}

  @HostListener('document:keydown.escape', ['$event'])
  onKeyDown() {
    this.cancel();
  }

  ngOnInit() {
    this.store.player
      .pipe(
        filter(player => Boolean(player)),
        take(1),
        takeUntil(this.destroyed),
      )
      .subscribe(player => {
        this.title.setTitle(
          `${player.name} • edit • ${environment.titleSuffix}`,
        );
        this.player.patchValue({ name: player.name });
        this.changeDetector.markForCheck();
      });

    this.store.skill
      .pipe(
        filter(skill => Boolean(skill)),
        take(1),
        takeUntil(this.destroyed),
      )
      .subscribe(skill => {
        this.player.setControl('skill', toFormGroup(skill));
        this.gameClasses.next(Object.keys(skill));
        this.changeDetector.markForCheck();
      });

    // load the given player
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        takeUntil(this.destroyed),
      )
      .subscribe(playerId => this.store.setPlayerId(playerId));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    this.store.saving
      .pipe(
        pairwise(),
        filter(([former, latter]) => former && !latter),
        takeUntil(this.destroyed),
      )
      .subscribe(() => this.location.back());

    this.store.save({
      name: this.player.value.name,
      skill: this.player.value.skill,
    });
  }

  cancel() {
    this.location.back();
  }

  resetPlayerSkill() {
    this.store.resetPlayerSkill().subscribe(() => this.location.back());
  }

  get skill() {
    return this.player.get('skill') as FormGroup;
  }
}
