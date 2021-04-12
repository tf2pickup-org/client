import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'steamProfileLink',
})
export class SteamProfileLinkPipe implements PipeTransform {
  transform(steamId: string): string {
    return `http://steamcommunity.com/profiles/${steamId}`;
  }
}
