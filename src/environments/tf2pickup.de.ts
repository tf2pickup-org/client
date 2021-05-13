import version from 'package.json';
import { entryQueue6v6 } from './entry-queue-6v6';
import { github, changelog } from './links';

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
    { name: 'github', target: github },
    { name: 'discord', target: discordInvitation },
    { name: 'changelog', target: changelog },
  ],
  titleSuffix: 'tf2pickup.de • Deutsche Team Fortress 2 Pick-up games',
  entryQueue: entryQueue6v6,
};
