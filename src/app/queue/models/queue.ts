import { QueueConfig } from './queue-config';
import { QueueSlot } from './queue-slot';
import { QueueState } from './queue-state';
import { MapVoteResult } from './map-vote-result';
import { SubstituteRequest } from './substitute-request';

export interface Queue {
  config: QueueConfig;
  slots: QueueSlot[];
  state: QueueState;
  mapVoteResults: MapVoteResult[];
  substituteRequests?: SubstituteRequest[];
}
