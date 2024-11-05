import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/TfbuC74zpN';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.teamfortress2.com',
  wsUrl: 'https://api.tf2pickup.teamfortress2.com',
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
  titleSuffix: 'ÜBERFEST 2024 pickup',
};
