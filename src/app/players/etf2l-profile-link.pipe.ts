import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'etf2lProfileLink',
})
export class Etf2lProfileLinkPipe implements PipeTransform {
  transform(etf2lProfileId: string | number): string {
    return `http://etf2l.org/forum/user/${etf2lProfileId}`;
  }
}
