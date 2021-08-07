import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/gvYMf2v';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.yu.tf2pickup.eu',
  wsUrl: 'https://api.yu.tf2pickup.eu',
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
  titleSuffix: 'yu.tf2pickup.eu • Ex-Yu Team Fortress 2 Pick-up games',
};
