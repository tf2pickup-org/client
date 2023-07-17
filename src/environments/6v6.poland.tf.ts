import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.gg/UVFVfc4';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.6v6.poland.tf',
  wsUrl: 'https://api.6v6.poland.tf',
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
  titleSuffix: '6v6.poland.tf',
};
