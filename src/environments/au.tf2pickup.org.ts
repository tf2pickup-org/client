import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.gg/ozfortress-82651383144120320';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.au.tf2pickup.org',
  wsUrl: 'https://api.au.tf2pickup.org',
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
  titleSuffix: 'au.tf2pickup.org • Australian TF2 pick-up games',
};
