import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { queueConfig } from '@app/queue/queue.selectors';
import { Store } from '@ngrx/store';
import { BehaviorSubject, zip } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { tf2ClassOrder } from '@app/shared/tf2-class-order';
import { KeyValue } from '@angular/common';
import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

type DefaultPlayerSkill = {
  [gameClass in Tf2ClassName]?: number;
};

@Component({
  selector: 'app-default-player-skill-edit',
  templateUrl: './default-player-skill-edit.component.html',
  styleUrls: ['./default-player-skill-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultPlayerSkillEditComponent implements OnInit {
  isSaving = new BehaviorSubject<boolean>(false);

  form = this.formBuilder.group({
    gameClasses: this.formBuilder.group({}),
  });

  private queueConfig = this.store.select(queueConfig);

  classCount = this.queueConfig.pipe(
    map(queueConfig => queueConfig.classes.length),
  );

  constructor(
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private changeDetector: ChangeDetectorRef,
    private store: Store,
  ) {}

  ngOnInit() {
    zip(
      this.configurationService
        .fetchValues<[DefaultPlayerSkill]>('games.default_player_skill')
        .pipe(map(s => s[0].value)),
      this.queueConfig.pipe(
        take(1),
        map(queueConfig => queueConfig.classes),
        map(classes => classes.map(cls => cls.name)),
      ),
    ).subscribe(([defaultSkill, gameClasses]) => {
      this.form.setControl(
        'gameClasses',
        this.formBuilder.group(
          gameClasses
            .map(gameClass => ({ gameClass, value: defaultSkill[gameClass] }))
            .reduce((acc, { gameClass, value }) => {
              acc[gameClass] = [value, Validators.required];
              return acc;
            }, {}),
        ),
      );
      this.changeDetector.markForCheck();
    });
  }

  save() {
    this.isSaving.next(true);
    this.configurationService
      .storeValues<[DefaultPlayerSkill]>({
        key: 'games.default_player_skill',
        value: this.gameClasses.value,
      })
      .pipe(
        map(entry => entry[0].value),
        tap(defaultPlayerSkill =>
          this.form.reset({ gameClasses: defaultPlayerSkill }),
        ),
      )
      .subscribe(() => {
        this.isSaving.next(false);
      });
  }

  get gameClasses(): FormGroup {
    return this.form.get('gameClasses') as FormGroup;
  }

  // skipcq: JS-0105
  orderGameClasses = (
    a: KeyValue<Tf2ClassName, FormControl>,
    b: KeyValue<Tf2ClassName, FormControl>,
  ): number => tf2ClassOrder[b.key] - tf2ClassOrder[a.key];
}
