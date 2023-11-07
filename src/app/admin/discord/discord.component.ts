import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Guild } from './models/guild';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DiscordConfiguration } from './models/discord-configuration';
import { Location } from '@angular/common';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { TextChannel } from './models/text-channel';

@Component({
  selector: 'app-discord',
  templateUrl: './discord.component.html',
  styleUrls: ['./discord.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscordComponent implements OnInit {
  private readonly destroyed = new Subject<void>();

  form = this.formBuilder.group({
    guilds: this.formBuilder.array<
      FormGroup<{
        id: FormControl<string>;
        name: FormControl<string>;
        isEnabled: FormControl<boolean>;
        adminNotifications: FormGroup<{
          channel: FormControl<string | null>;
        }>;
        substituteNotifications: FormGroup<{
          channel: FormControl<string | null>;
          role: FormControl<string | null>;
        }>;
        queuePrompts: FormGroup<{ channel: FormControl<string | null> }>;
      }>
    >([]),
  });

  isSaving = new BehaviorSubject<boolean>(false);
  textChannels = new BehaviorSubject<Map<string, Map<string, TextChannel[]>>>(
    new Map(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly configurationService: ConfigurationService,
    private readonly location: Location,
  ) {}

  ngOnInit() {
    this.route.data
      .pipe(takeUntil(this.destroyed))
      .subscribe(
        ({
          configuration,
          guilds,
        }: {
          configuration: DiscordConfiguration;
          guilds: Guild[];
        }) => {
          this.form.setControl(
            'guilds',
            this.formBuilder.array(
              guilds.map(guild => {
                const config = configuration.guilds.find(
                  g => g.id === guild.id,
                );
                return this.formBuilder.group({
                  id: guild.id,
                  name: guild.name,
                  isEnabled: Boolean(config),
                  adminNotifications: this.formBuilder.group({
                    channel: config?.adminNotifications?.channel ?? null,
                  }),
                  substituteNotifications: this.formBuilder.group({
                    channel: config?.substituteNotifications?.channel ?? null,
                    role: config?.substituteNotifications?.role ?? null,
                  }),
                  queuePrompts: this.formBuilder.group({
                    channel: config?.queuePrompts?.channel ?? null,
                  }),
                });
              }),
            ),
          );
          this.changeDetector.markForCheck();
        },
      );
  }

  get guilds() {
    return this.form.get('guilds') as FormArray;
  }

  save() {
    this.isSaving.next(true);
    const config: DiscordConfiguration = {
      guilds: this.form.value.guilds
        .filter(value => value.isEnabled)
        .map(value => ({
          id: value.id,
          ...(value.adminNotifications.channel
            ? {
                adminNotifications: {
                  channel: value.adminNotifications.channel,
                },
              }
            : {}),
          ...(value.substituteNotifications.channel
            ? {
                substituteNotifications: {
                  channel: value.substituteNotifications.channel,
                  role: value.substituteNotifications.role ?? undefined,
                },
              }
            : {}),
          ...(value.queuePrompts.channel
            ? {
                queuePrompts: {
                  channel: value.queuePrompts.channel,
                  bumpPlayerThresholdRatio: 0.5,
                },
              }
            : {}),
        })),
    };

    this.configurationService
      .storeValues({
        key: 'discord.guilds',
        value: config.guilds,
      })
      .subscribe(() => this.location.back());
  }
}
