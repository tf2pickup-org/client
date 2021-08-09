import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/SyfpNmzrcd';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.ro',
  wsUrl: 'https://api.tf2pickup.ro',
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
  titleSuffix: 'tf2pickup.ro • Romanian TF2 pick-up games',
};
