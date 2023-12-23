import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { isEmpty } from 'lodash-es';
import { map, Subject, takeUntil } from 'rxjs';
import { GameConfiguration } from './game-configuration';

@Component({
  selector: 'app-game-configuration',
  templateUrl: './game-configuration.component.html',
  styleUrls: ['./game-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameConfigurationComponent implements OnInit, OnDestroy {
  form = this.formBuilder.group({
    whitelistId: [''],
    joinGameServerTimeout: [0],
    rejoinGameServerTimeout: [0],
    executeExtraCommands: [''],
    logsTfUploadMethod: ['off'],
  });

  private destroyed = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly configurationService: ConfigurationService,
    private readonly location: Location,
  ) {}

  ngOnInit() {
    this.route.data
      .pipe(
        map<Data, GameConfiguration>(data => data['gameConfiguration']),
        takeUntil(this.destroyed),
      )
      .subscribe(
        ({
          whitelistId,
          joinGameServerTimeout,
          rejoinGameServerTimeout,
          executeExtraCommands,
          logsTfUploadMethod,
        }) => {
          this.form.patchValue({
            whitelistId,
            joinGameServerTimeout: joinGameServerTimeout / 1000,
            rejoinGameServerTimeout: rejoinGameServerTimeout / 1000,
            executeExtraCommands: executeExtraCommands.join('\n'),
            logsTfUploadMethod,
          });
          this.changeDetector.markForCheck();
        },
      );
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    this.configurationService
      .storeValues(
        {
          key: 'games.whitelist_id',
          value: this.form.get('whitelistId').value,
        },
        {
          key: 'games.join_gameserver_timeout',
          value: this.form.get('joinGameServerTimeout').value * 1000,
        },
        {
          key: 'games.rejoin_gameserver_timeout',
          value: this.form.get('rejoinGameServerTimeout').value * 1000,
        },
        {
          key: 'games.execute_extra_commands',
          value: this.form
            .get('executeExtraCommands')
            .value.split('\n')
            .filter(e => !isEmpty(e)),
        },
        {
          key: 'games.logs_tf_upload_method',
          value: this.form.get('logsTfUploadMethod').value,
        },
      )
      .subscribe(() => this.location.back());
  }
}
