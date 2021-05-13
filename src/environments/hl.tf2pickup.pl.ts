import version from 'package.json';
import { entryQueue9v9 } from './entry-queue-9v9';
import { github, changelog } from './links';

const discordInvitation = 'https://discord.gg/UVFVfc4';

export const environment = {
  production: true,
  apiUrl: 'https://api.hl.tf2pickup.pl',
  wsUrl: 'https://api.hl.tf2pickup.pl',
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
  titleSuffix: 'hl.tf2pickup.pl • Polskie Pickupy 9v9',
  entryQueue: entryQueue9v9,
};
