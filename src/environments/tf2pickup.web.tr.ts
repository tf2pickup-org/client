import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/ZFhmY2wEhc';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.web.tr',
  wsUrl: 'https://api.tf2pickup.web.tr',
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
  titleSuffix: 'tf2pickup.web.tr • TF2 Türk Pickupları',
};
