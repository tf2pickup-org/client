import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

const discordInvitation = 'https://discord.gg/T6PfVC3bqQ';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.fi',
  wsUrl: 'https://api.tf2pickup.fi',
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
  titleSuffix: 'tf2pickup.fi • Suomenkieliset Team Fortress 2 Pick-up -pelit',
};
