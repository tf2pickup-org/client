import { version } from 'package.json';

const discordInvitation = 'https://discord.gg/UVFVfc4';

export const environment = {
  production: true,
  apiUrl: 'https://api.hl.tf2pickup.pl',
  wsUrl: 'https://api.hl.tf2pickup.pl',
  version,
  headerLinks: [
    { name: 'discord', icon: '/assets/ui_icon_discord.png', target: discordInvitation, tooltip: 'Join us on discord!' },
  ],
  footerLinks: [
    { name: 'github', target: 'https://github.com/tf2pickup-pl' },
    { name: 'discord', target: discordInvitation },
    { name: 'changelog', target: 'https://github.com/tf2pickup-pl/client/blob/master/CHANGELOG.md' },
  ],
  titleSuffix: 'hl.tf2pickup.pl • Polskie Pickupy 9v9',
};
