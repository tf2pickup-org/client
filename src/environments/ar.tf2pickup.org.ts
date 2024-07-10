import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.gg/7T2X5qDcmC';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.ar.tf2pickup.org',
  wsUrl: 'https://api.ar.tf2pickup.org',
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
  titleSuffix: 'ar.tf2pickup.org • Mixes sudamericanos de TF2',
};
