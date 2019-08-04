import { version } from 'package.json';

export const environment = {
  production: true,
  apiUrl: 'https://api.tf2pickup.pl',
  wsUrl: 'https://api.tf2pickup.pl',
  version,
  footerLinks: [
    { name: 'github', target: 'https://github.com/tf2pickup-pl' },
    { name: 'discord', target: 'https://discord.gg/YsAAAz' },
  ],
};
