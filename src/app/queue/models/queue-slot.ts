export interface QueueSlot {
  id: number;
  gameClass: string;
  playerId?: string;
  ready: boolean;
  friend?: string;
}
