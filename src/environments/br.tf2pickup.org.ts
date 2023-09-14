import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.gg/E74eFrKeXJ';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.br.tf2pickup.org',
  wsUrl: 'https://api.br.tf2pickup.org',
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
  titleSuffix: 'br.tf2pickup.org • Mixes Brasileiros de TF2',
};
