import { QueueConfig } from './queue-config';
import { QueueSlot } from './queue-slot';
import { QueueState } from './queue-state';

export interface Queue {
  config: QueueConfig;
  slots: QueueSlot[];
  state: QueueState;
}
