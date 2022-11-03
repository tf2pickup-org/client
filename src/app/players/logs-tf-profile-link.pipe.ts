import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'logsTfProfileLink',
})
export class LogsTfProfileLinkPipe implements PipeTransform {
  transform(steamId: string): string {
    return `https://logs.tf/profile/${steamId}`;
  }
}
