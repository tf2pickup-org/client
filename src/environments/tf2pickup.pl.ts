import { version } from './version';
import { entryQueue6v6 } from './entry-queue-6v6';
import { github, changelog } from './links';

const discordInvitation = 'https://discord.gg/UVFVfc4';

export const environment = {
  production: true,
  apiUrl: 'https://api.tf2pickup.pl',
  wsUrl: 'https://api.tf2pickup.pl',
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
  titleSuffix: 'tf2pickup.pl • Polskie Pickupy',
  entryQueue: entryQueue6v6,
};
