import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'steamProfileLink',
})
export class SteamProfileLinkPipe implements PipeTransform {
  transform(steamId: string): string {
    return `https://steamcommunity.com/profiles/${steamId}`;
  }
}
