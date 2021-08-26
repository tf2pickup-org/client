import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DiscordBotStore } from './discord-bot.store';

@Component({
  selector: 'app-discord-bot',
  templateUrl: './discord-bot.component.html',
  styleUrls: ['./discord-bot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DiscordBotStore],
})
export class DiscordBotComponent implements OnInit {
  constructor(private store: DiscordBotStore) {}

  ngOnInit() {
    this.store.loadAvailableGuilds();
  }
}
