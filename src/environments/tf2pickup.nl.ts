import { version } from 'package.json';
import { entryQueue6v6 } from './entry-queue-6v6';
import { github, changelog } from './links';

const discordInvitation = 'https://discord.com/invite/PVVqjgZCgj';

export const environment = {
  production: true,
  apiUrl: 'https://api.tf2pickup.nl',
  wsUrl: 'https://api.tf2pickup.nl',
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
  titleSuffix: 'tf2pickup.nl • Nederlandse Ploeg Fort 2 Oppikspellen',
  entryQueue: entryQueue6v6,
};
