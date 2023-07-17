import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';
import { entryQueueBball } from './entry-queues/entry-queue-bball';

const discordInvitation = 'https://discord.gg/UVFVfc4';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.bball.poland.tf',
  wsUrl: 'https://api.bball.poland.tf',
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
  titleSuffix: 'bball.poland.tf',
  entryQueue: entryQueueBball,
};
