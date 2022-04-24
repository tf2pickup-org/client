export interface GameServer {
  id: string;
  name: string;
  address: string;
  port: string;
  priority: number;
  customVoiceChannelName?: string;
  provider: string;
  createdAt?: Date;
  lastHeartbeatAt?: Date;
}
