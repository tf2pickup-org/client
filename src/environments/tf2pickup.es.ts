import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/9YKcMgg';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.es',
  wsUrl: 'https://api.tf2pickup.es',
  headerLinks: [
    {
      name: 'discord',
      icon: '/assets/ui_icon_discord.png',
      target: discordInvitation,
      tooltip: 'Join us on discord!',
    },
  ],
  footerLinks: [
    ...defaultFooterLinks,
    { name: 'discord', target: discordInvitation },
  ],
  titleSuffix: 'tf2pickup.es • Spanish Team Fortress 2 Pick-up games',
};
