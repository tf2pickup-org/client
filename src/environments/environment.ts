import { entryQueue6v6 } from './entry-queues/entry-queue-6v6';
import { defaultEnvironment } from './default-environment';

const discordInvitation = 'https://discord.gg/UVFVfc4';

export const environment = {
  ...defaultEnvironment,
  production: false,
  apiUrl: '/api', // goes via local proxy
  wsUrl: '/',
  headerLinks: [
    {
      name: 'discord',
      icon: '/assets/ui_icon_discord.png',
      target: discordInvitation,
      tooltip: 'Join us on discord!',
    },
    {
      name: 'ko-fi',
      icon: '/assets/Ko-fi_logo_RGB_Outline.png',
      target: 'https://ko-fi.com/tf2pickuporg',
      tooltip: 'Support us on Ko-fi!',
    },
  ],
  footerLinks: [
    { name: 'privacy policy', target: '/privacy-policy' },
    { name: 'github', target: 'https://github.com/tf2pickup-pl' },
    { name: 'discord', target: discordInvitation },
    {
      name: 'changelog',
      target: 'https://github.com/tf2pickup-pl/client/blob/master/CHANGELOG.md',
    },
  ],
  titleSuffix: 'tf2pickup.pl • dev',

  // Initial queue config for ghost loading
  entryQueue: entryQueue6v6,

  mapThumbnailServiceUrl: '/map-thumbnails',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
