import { QueueConfig } from './queue-config';
import { QueuePlayer } from './queue-player';

export interface Queue {
  config: QueueConfig;
  players: QueuePlayer[];
}
