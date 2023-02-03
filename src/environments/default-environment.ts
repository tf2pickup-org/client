import { entryQueue6v6 } from './entry-queues/entry-queue-6v6';
import { version } from './version';
import { defaultFooterLinks } from './default-footer-links';

export const defaultEnvironment = {
  production: true,
  version,
  footerLinks: defaultFooterLinks,
  entryQueue: entryQueue6v6,
  mapThumbnailServiceUrl: 'https://mapthumbnails.tf2pickup.org',
};
