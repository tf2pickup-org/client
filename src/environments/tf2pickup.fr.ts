import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/RuUqhCT8Ts';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.fr',
  wsUrl: 'https://api.tf2pickup.fr',
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
  titleSuffix: 'tf2pickup.fr • French Team Fortress 2 Pick-up games',
};
