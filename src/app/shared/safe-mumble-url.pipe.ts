import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import * as urlParse from 'url-parse';

@Pipe({
  name: 'safeMumbleUrl'
})
export class SafeMumbleUrlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  transform(value: string): SafeUrl {
    const url = urlParse(value);
    if (url.protocol === 'mumble:') {
      return this.sanitizer.bypassSecurityTrustUrl(value);
    } else {
      return value;
    }
  }

}
