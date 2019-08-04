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
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
