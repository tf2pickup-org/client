import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.gg/jUATV48cYQ';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.hl.tf2pickup.ru',
  wsUrl: 'https://api.hl.tf2pickup.ru',
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
  titleSuffix: 'hl.tf2pickup.ru • Русские пикапы 9v9',
};
