import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';
import { entryQueue9v9 } from './entry-queues/entry-queue-9v9';

const discordInvitation = 'https://discord.gg/SVZ4CjmsjJ';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.hl.tf2pickup.eu',
  wsUrl: 'https://api.hl.tf2pickup.eu',
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
  titleSuffix: 'hl.tf2pickup.eu • European Highlander Pickups',
  entryQueue: entryQueue9v9,
};
