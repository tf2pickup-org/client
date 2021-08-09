import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/bG4WKUqx';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.bball.tf2pickup.eu',
  wsUrl: 'https://api.bball.tf2pickup.eu',
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
  titleSuffix: 'bball.tf2pickup.eu • TF2 bball pick-up games',
};
