import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.com/invite/PVVqjgZCgj';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.nl',
  wsUrl: 'https://api.tf2pickup.nl',
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
  titleSuffix: 'tf2pickup.nl • Nederlandse Ploeg Fort 2 Oppikspellen',
};
