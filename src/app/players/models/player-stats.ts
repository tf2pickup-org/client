export interface PlayerStats {
  player: string;
  gamesPlayed: number;
  classesPlayed: Record<string, number>;
}
