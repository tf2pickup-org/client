export type LogsTfUploadMethod = 'off' | 'backend' | 'gameserver';

export interface GameConfiguration {
  whitelistId: string;
  joinGameServerTimeout: number;
  rejoinGameServerTimeout: number;
  executeExtraCommands: string[];
  logsTfUploadMethod: LogsTfUploadMethod;
}
