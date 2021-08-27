import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
    guildName: [''],
  });

  constructor(
    public readonly store: DiscordBotStore,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.store.loadAvailableGuilds();
  }
}
