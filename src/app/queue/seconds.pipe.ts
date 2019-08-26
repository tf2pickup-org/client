import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'util';

@Pipe({
  name: 'seconds'
})
export class SecondsPipe implements PipeTransform {

  transform(value: any): string {
    if (!isNumber(value)) {
      return value;
    }

    const minutes = Math.floor(value / 60);
    const seconds = ('' + (value - minutes * 60)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

}
