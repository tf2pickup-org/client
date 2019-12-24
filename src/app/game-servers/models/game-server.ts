export interface GameServer {
  id?: string;
  name: string;
  address: string;
  port: string;
  rconPassword?: string;
  isOnline?: boolean;
}
