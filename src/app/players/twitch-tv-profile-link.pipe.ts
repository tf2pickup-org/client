import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twitchTvProfileLink'
})
export class TwitchTvProfileLinkPipe implements PipeTransform {

  transform(twitchTvLogin: string): string {
    return `https://www.twitch.tv/${twitchTvLogin}/`;
  }

}
