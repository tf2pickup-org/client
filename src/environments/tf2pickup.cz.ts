import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.gg/hSWN5mu2kf';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.cz',
  wsUrl: 'https://api.tf2pickup.cz',
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
  titleSuffix: 'tf2pickup.cz • Czech & Slovakian Team Fortress 2 Pick-up games',
};
