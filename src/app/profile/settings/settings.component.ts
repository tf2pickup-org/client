import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TwitchService } from '@app/twitch/twitch.service';
import { Store } from '@ngrx/store';
import { twitchTvUser } from '../profile.selectors';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {

  twitchTvProfile = this.store.select(twitchTvUser);
  twitchTvProfileLink = this.twitchTvProfile.pipe(
    filter(profile => !!profile),
    map(profile => profile.login),
    map(login => `https://www.twitch.tv/${login}/`),
  );

  constructor(
    private twitchService: TwitchService,
    private store: Store,
  ) { }

  loginViaTwitchTv() {
    this.twitchService.login();
  }

}
