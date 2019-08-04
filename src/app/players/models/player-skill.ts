export interface PlayerSkill {
  id: string;
  player: string;
  skill: { [gameClass: string]: number };
}
