import { QueueConfig } from './queue-config';
import { QueueSlot } from './queue-slot';

export interface Queue {
  config: QueueConfig;
  slots: QueueSlot[];
}
