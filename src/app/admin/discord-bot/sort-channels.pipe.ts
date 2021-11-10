import { Pipe, PipeTransform } from '@angular/core';
import { TextChannelInfo } from '../models/text-channel-info';

@Pipe({
  name: 'sortChannels',
})
export class SortChannelsPipe implements PipeTransform {
  transform(channels: TextChannelInfo[]): TextChannelInfo[] {
    console.log(channels);
    return channels
      ? [...channels].sort((a, b) => b.position - a.position)
      : channels;
  }
}
