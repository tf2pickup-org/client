import { ChangeDetectionStrategy, Component } from '@angular/core';
import { twitchTvProfile } from '@app/players/selectors';
import { TwitchService } from '@app/twitch/twitch.service';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs/operators';
import { currentPlayer } from '../profile.selectors';

@Component({
  selector: 'app-twitch-tv-integration',
  templateUrl: './twitch-tv-integration.component.html',
  styleUrls: ['./twitch-tv-integration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwitchTvIntegrationComponent {
  twitchTvProfile = this.store.pipe(
    select(currentPlayer),
    filter(player => !!player),
    map(player => player.id),
    switchMap(playerId => this.store.select(twitchTvProfile(playerId))),
  );
  twitchTvProfileLink = this.twitchTvProfile.pipe(
    filter(profile => !!profile),
    map(profile => profile.login),
    map(login => `https://www.twitch.tv/${login}/`),
  );

  constructor(private twitchService: TwitchService, private store: Store) {}

  loginViaTwitchTv() {
    this.twitchService.login();
  }

  disconnect() {
    this.twitchService.disconnect().subscribe();
  }
}
