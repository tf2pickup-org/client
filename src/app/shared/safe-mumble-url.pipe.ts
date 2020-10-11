import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeMumbleUrl'
})
export class SafeMumbleUrlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  transform(value: string): SafeUrl {
    const url = new URL(value);
    if (url.protocol === 'mumble:') {
      return this.sanitizer.bypassSecurityTrustUrl(value);
    } else {
      return value;
    }
  }

}
