import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.gg/bG4WKUqx';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.ultiduo.tf2pickup.eu',
  wsUrl: 'https://api.ultiduo.tf2pickup.eu',
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
  titleSuffix: 'ultiduo.tf2pickup.eu • TF2 ultiduo pick-up games',
};
