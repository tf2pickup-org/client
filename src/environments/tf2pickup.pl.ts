import { version } from 'package.json';

export const environment = {
  production: true,
  apiUrl: 'https://api.tf2pickup.es',
  wsUrl: 'https://api.tf2pickup.es',
  version,
  headerLinks: [],
  footerLinks: [
    { name: 'github', target: 'https://github.com/tf2pickup-pl' },
    { name: 'changelog', target: 'https://github.com/tf2pickup-pl/client/blob/master/CHANGELOG.md' },
  ],
  titleSuffix: 'tf2pickup.es • Spanish Team Fortress 2 Pickup-up games',
};
