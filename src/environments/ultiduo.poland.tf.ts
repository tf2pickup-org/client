import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';
import { entryQueueUltiduo } from './entry-queues/entry-queue-ultiduo';

const discordInvitation = 'https://discord.gg/UVFVfc4';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.ultiduo.poland.tf',
  wsUrl: 'https://api.ultiduo.poland.tf',
  headerLinks: [
    {
      name: 'discord',
      icon: '/assets/ui_icon_discord.png',
      target: discordInvitation,
      tooltip: 'Join us on discord!',
    },
    ...defaultHeaderLinks,
  ],
  footerLinks: [
    ...defaultFooterLinks,
    { name: 'discord', target: discordInvitation },
  ],
  titleSuffix: 'ultiduo.poland.tf',
  entryQueue: entryQueueUltiduo,
};
