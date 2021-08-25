import { defaultEnvironment } from './default-environment';
import { defaultFooterLinks } from './default-footer-links';

export const environment = {
  ...defaultEnvironment,
  apiUrl: 'https://api.tf2pickup.ru',
  wsUrl: 'https://api.tf2pickup.ru',
  headerLinks: [],
  footerLinks: [...defaultFooterLinks],
  titleSuffix: 'tf2pickup.ru • тф2пикап по-русски?',
};
