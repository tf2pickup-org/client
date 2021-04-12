import { version } from 'package.json';
import { entryQueue6v6 } from './entry-queue-6v6';
import { github, changelog } from './links';

const discordInvitation = 'https://discord.gg/T6PfVC3bqQ';

export const environment = {
  production: true,
  apiUrl: 'https://api.tf2pickup.fi',
  wsUrl: 'https://api.tf2pickup.fi',
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
  titleSuffix: 'tf2pickup.fi • Suomenkieliset Team Fortress 2 Pick-up -pelit',
  entryQueue: entryQueue6v6,
};
