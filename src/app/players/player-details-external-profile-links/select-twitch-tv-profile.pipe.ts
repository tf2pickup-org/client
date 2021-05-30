import { Pipe, PipeTransform } from '@angular/core';
import { LinkedProfiles } from '../models/linked-profiles';
import { TwitchTvProfile } from '../models/twitch-tv-profile';

@Pipe({
  name: 'selectTwitchTvProfile',
})
export class SelectTwitchTvProfilePipe implements PipeTransform {
  transform(value: LinkedProfiles): TwitchTvProfile {
    return value?.linkedProfiles.find(
      profile => profile.provider === 'twitch.tv',
    );
  }
}
