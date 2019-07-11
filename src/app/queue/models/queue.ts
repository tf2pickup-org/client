import { QueueConfig } from './queue-config';

export interface Queue {
  config: QueueConfig;
  players: string[];
}
