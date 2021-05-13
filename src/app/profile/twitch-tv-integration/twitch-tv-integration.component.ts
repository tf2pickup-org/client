import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TwitchService } from '@app/twitch/twitch.service';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-twitch-tv-integration',
  templateUrl: './twitch-tv-integration.component.html',
  styleUrls: ['./twitch-tv-integration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwitchTvIntegrationComponent {
  // twitchTvProfile = this.store.select(twitchTvUser);
  // twitchTvProfileLink = this.twitchTvProfile.pipe(
  //   filter(profile => !!profile),
  //   map(profile => profile.login),
  //   map(login => `https://www.twitch.tv/${login}/`),
  // );

  constructor(private twitchService: TwitchService, private store: Store) {}

  loginViaTwitchTv() {
    this.twitchService.login();
  }

  disconnect() {
    this.twitchService.disconnect().subscribe();
  }
}
