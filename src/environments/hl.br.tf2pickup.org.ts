import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';
import { entryQueue9v9 } from './entry-queues/entry-queue-9v9';

const discordInvitation = 'https://discord.gg/eJfrSPVYZy';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.hl.br.tf2pickup.org',
  wsUrl: 'https://api.hl.br.tf2pickup.org',
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
  titleSuffix: 'hl.br.tf2pickup.org • Mixes Brasileiros de TF2',
  entryQueue: entryQueue9v9,
};
