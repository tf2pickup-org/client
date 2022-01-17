import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { GuildInfo } from '../models/guild-info';
import { DiscordBotStore } from './discord-bot.store';
import { Discord } from '@app/configuration/models/discord';
import { ConfigurationEntryKey } from '@app/configuration/configuration-entry-key';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-discord-bot',
  templateUrl: './discord-bot.component.html',
  styleUrls: ['./discord-bot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DiscordBotStore],
})
export class DiscordBotComponent implements OnInit {
  form = this.formBuilder.group({
    guilds: new FormArray([]),
  });

  constructor(
    public readonly store: DiscordBotStore,
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.store.availableGuilds.subscribe(guilds => {
      guilds.forEach(guild => {
        const serverControl = this.getGuildControl(guild.id);
        if (!serverControl) {
          this.guilds.push(
            new FormGroup({
              guildId: new FormControl(guild.id),
              adminNotificationsChannelId: new FormControl(null),
              queueNotificationsChannelId: new FormControl(null),
              substituteMentionRole: new FormControl(null),
            }),
          );
          this.store.loadTextChannels(guild.id);
          this.store.loadRoles(guild.id);
        }
      });
    });

    this.store.loadAvailableGuilds();
    this.form.valueChanges.subscribe(form => console.log(form));
  }

  get guilds(): FormArray {
    return this.form.get('guilds') as FormArray;
  }

  getGuildControl(guildId: string): FormGroup {
    const guilds = this.guilds;
    for (let i = 0; i < guilds.length; ++i) {
      if (guilds.at(i).get('guildId').value === guildId) {
        return guilds.at(i) as FormGroup;
      }
    }
  }

  guildInfo(guildId: string): Observable<GuildInfo> {
    return this.store.availableGuilds.pipe(
      map(guilds => guilds.find(guild => guild.id === guildId)),
    );
  }

  save() {
    const value: Discord = { key: ConfigurationEntryKey.discord, guilds: [] };
    for (let control of this.guilds.controls) {
      value.guilds.push({
        guildId: control.get('guildId').value,
        queueNotificationsChannelId: control.get('queueNotificationsChannelId')
          .value,
        substituteMentionRole: control.get('substituteMentionRole').value,
        adminNotificationsChannelId: control.get('adminNotificationsChannelId')
          .value,
      });
    }

    console.log(value);
    this.configurationService
      .storeValue<Discord>(value)
      .subscribe(() => this.location.back());
  }
}
