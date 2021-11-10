import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { GuildInfo } from '../models/guild-info';
import { DiscordBotStore } from './discord-bot.store';

@Component({
  selector: 'app-discord-bot',
  templateUrl: './discord-bot.component.html',
  styleUrls: ['./discord-bot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DiscordBotStore],
})
export class DiscordBotComponent implements OnInit {
  form = this.formBuilder.group({
    servers: new FormArray([]),
  });

  constructor(
    public readonly store: DiscordBotStore,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.store.availableGuilds.subscribe(guilds => {
      guilds.forEach(guild => {
        const serverControl = this.getServerControl(guild.id);
        if (!serverControl) {
          this.servers.push(
            new FormGroup({
              guildId: new FormControl(guild.id),
              enabled: new FormControl(false),
              adminNotificationsChannelId: new FormControl(null),
            }),
          );
        }
      });
    });

    this.store.loadAvailableGuilds();
    this.form.valueChanges.subscribe(form => console.log(form));
  }

  get servers(): FormArray {
    return this.form.get('servers') as FormArray;
  }

  getServerControl(guildId: string): FormGroup {
    const servers = this.servers;
    for (let i = 0; i < servers.length; ++i) {
      if (servers.at(i).get('guildId').value === guildId) {
        return servers.at(i) as FormGroup;
      }
    }
  }

  onServerSelectionChange(event) {
    const guildId = event.target.value;

    this.getServerControl(guildId).patchValue({
      enabled: event.target.checked,
    });

    if (event.target.checked) {
      this.store.loadTextChannels(guildId);
    }
  }

  guildInfo(guildId: string): Observable<GuildInfo> {
    console.log(guildId);
    return this.store.availableGuilds.pipe(
      map(guilds => guilds.find(guild => guild.id === guildId)),
    );
  }
}
