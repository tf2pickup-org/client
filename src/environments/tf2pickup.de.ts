import { version } from 'package.json';
import { entryQueue6v6 } from './entry-queue-6v6';

const discordInvitation = 'https://discord.gg/g2T5r7X';

export const environment = {
  production: true,
  apiUrl: 'https://api.tf2pickup.de',
  wsUrl: 'https://api.tf2pickup.de',
  version,
  headerLinks: [
    {
      name: 'discord',
      icon: '/assets/ui_icon_discord.png',
      target: discordInvitation,
      tooltip: 'Join us on discord!',
    },
  ],
  footerLinks: [
    { name: 'github', target: 'https://github.com/tf2pickup-pl' },
    { name: 'discord', target: discordInvitation },
    {
      name: 'changelog',
      target: 'https://github.com/tf2pickup-pl/client/blob/master/CHANGELOG.md',
    },
  ],
  titleSuffix: 'tf2pickup.de • Deutsche Team Fortress 2 Pick-up games',
  entryQueue: entryQueue6v6,
};
