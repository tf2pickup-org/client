import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.gg/gZAYCAzDkr';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.co.il',
  wsUrl: 'https://api.tf2pickup.co.il',
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
  titleSuffix: 'tf2pickup.co.il • Israeli Team Fortress 2 Pick-up games',
};
