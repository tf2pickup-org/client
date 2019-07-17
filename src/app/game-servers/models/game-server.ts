export interface GameServer {
  id?: string;
  name: string;
  address: string;
  port: number;
  rconPassword?: string;
  isOnline?: boolean;
}
