import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

interface SteamConnect {
  server: string;
  port?: number;
  password?: string;
}

@Pipe({
  name: 'connectStringToLink',
})
export class ConnectStringToLinkPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(connect: string): SafeUrl {
    const c = this.parseConnectString(connect);
    if (c) {
      let url = c.server;
      if (c.port) {
        url += ':' + c.port;
      }

      if (c.password) {
        url += '/' + c.password;
      }

      return this.sanitizer.bypassSecurityTrustUrl(`steam://connect/${url}`);
    } else {
      return null;
    }
  }

  private parseConnectString(connect: string): SteamConnect | undefined {
    const match = connect.match(
      /^connect (.[^:;]+):?(\d+)?(?:;\s?password\s(.+))?$/,
    );
    if (match && match[1]) {
      const ret: SteamConnect = { server: match[1] };

      if (match[2]) {
        ret.port = parseInt(match[2], 10);
      }

      if (match[3]) {
        ret.password = match[3];
      }

      return ret;
    }

    return undefined;
  }
}
