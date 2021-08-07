import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/g2T5r7X';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.de',
  wsUrl: 'https://api.tf2pickup.de',
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
  titleSuffix: 'tf2pickup.de • Deutsche Team Fortress 2 Pick-up games',
};
