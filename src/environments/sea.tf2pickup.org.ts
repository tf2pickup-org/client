import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';
import { defaultHeaderLinks } from './default-header-links';

const discordInvitation = 'https://discord.com/invite/bTF8ME6';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.sea.tf2pickup.org',
  wsUrl: 'https://api.sea.tf2pickup.org',
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
  titleSuffix: 'sea.tf2pickup.org • Asian 6v6 Pickups',
};
