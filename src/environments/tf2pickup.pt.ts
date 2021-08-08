import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/hSWN5mu2kf';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.pt',
  wsUrl: 'https://api.tf2pickup.pt',
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
  titleSuffix: 'tf2pickup.pt • pickups portuguesas de TF2',
};
