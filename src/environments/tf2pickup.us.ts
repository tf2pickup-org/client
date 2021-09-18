import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/j3MDHbDyWG';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.us',
  wsUrl: 'https://api.tf2pickup.us',
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
  titleSuffix:
    'tf2pickup.us • Team Fortress 2 Pick-up | Brought to you by FastCat',
};
