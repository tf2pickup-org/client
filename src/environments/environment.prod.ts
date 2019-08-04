import { version } from 'package.json';

const discordInvitation = 'https://discord.gg/YsAAAz';

export const environment = {
  production: true,
  apiUrl: 'https://api.tf2pickup.pl',
  wsUrl: 'https://api.tf2pickup.pl',
  version,
  headerLinks: [
    { name: 'discord', icon: '/assets/discord.svg', target: discordInvitation, tooltip: 'Join us on discord!' },
  ],
  footerLinks: [
    { name: 'github', target: 'https://github.com/tf2pickup-pl' },
    { name: 'discord', target: discordInvitation },
  ],
};
