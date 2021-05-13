import version from 'package.json';
import { entryQueue6v6 } from './entry-queue-6v6';
import { changelog } from './links';

const discordInvitation = 'https://discord.gg/gvYMf2v';

export const environment = {
  production: true,
  apiUrl: 'https://api.yu.tf2pickup.eu',
  wsUrl: 'https://api.yu.tf2pickup.eu',
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
    { name: 'github', target: 'https://github.com/makemake-kbo/client' },
    { name: 'discord', target: discordInvitation },
    { name: 'changelog', target: changelog },
  ],
  titleSuffix: 'yu.tf2pickup.eu • Ex-Yu Team Fortress 2 Pick-up games',
  entryQueue: entryQueue6v6,
};
