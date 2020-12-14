import { Player } from '../models/player';
import { PlayerGroup } from './player-group';

export const groupPlayers = (players: Player[]): PlayerGroup[] => {
  const grouped = players.reduce((result, player) => {
    const key = player.name.charAt(0).toLocaleLowerCase();
    result[key] = result[key] || [];
    result[key].push(player);

    return result;
  }, { });

  return Object.keys(grouped).map(key => ({ key, players: grouped[key] }));
};
