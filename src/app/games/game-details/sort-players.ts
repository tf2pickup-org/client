import { GamePlayer } from '../models/game-player';

/**
 * Orders classes in the game slot list.
 */
const tf2ClassPriority = new Map([
  [ 'scout',    9 ],
  [ 'soldier',  8 ],
  [ 'pyro',     7 ],
  [ 'demoman',  6 ],
  [ 'heavy',    5 ],
  [ 'engineer', 4 ],
  [ 'medic',    3 ],
  [ 'sniper',   2 ],
  [ 'spy',      1 ],
]);

export const sortPlayers = (players: GamePlayer[]) =>
  players.sort((a, b) => tf2ClassPriority.get(b.gameClass) - tf2ClassPriority.get(a.gameClass));
