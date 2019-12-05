export interface QueueSlot {
  id: number;
  gameClass: string;
  playerId?: string;
  playerReady: boolean;
  friend?: string;
}
