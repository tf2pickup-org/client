import { Pipe, PipeTransform } from '@angular/core';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

@Pipe({
  name: 'countryFlag',
})
export class CountryFlagPipe implements PipeTransform {
  transform(value: string): string {
    return getUnicodeFlagIcon(value);
  }
}
