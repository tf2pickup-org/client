// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { version } from 'package.json';

const discordInvitation = 'https://discord.gg/UVFVfc4';

export const environment = {
  production: false,
  apiUrl: '/api', // goes via local proxy
  wsUrl: '/',
  version,
  headerLinks: [
    { name: 'discord', icon: '/assets/discord.svg', target: discordInvitation, tooltip: 'Join us on discord!' },
  ],
  footerLinks: [
    { name: 'github', target: 'https://github.com/tf2pickup-pl' },
    { name: 'discord', target: discordInvitation },
    { name: 'changelog', target: 'https://github.com/tf2pickup-pl/client/blob/master/CHANGELOG.md' },
  ],
  titleSuffix: 'tf2pickup.pl • dev',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
