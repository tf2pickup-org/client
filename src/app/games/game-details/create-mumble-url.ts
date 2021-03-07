import { Game } from '../models/game';
import { Player } from '@app/players/models/player';

export const createMumbleUrl = (game: Game, player: Player) => {
  if (!game?.mumbleUrl) {
    return null;
  }

  const mySlot = game?.slots.find(s => s.player === player?.id);
  if (!mySlot) {
    return null;
  }

  const url = new URL(game.mumbleUrl);

  // https://stackoverflow.com/questions/64299675/why-the-url-class-does-not-support-setting-username-for-protocols-other-than-htt
  const protocol = url.protocol;
  url.protocol = 'http:';
  url.username = player.name.replace(/\s+/g, '_');
  url.pathname += '/' + mySlot.team.toUpperCase();
  url.protocol = protocol;

  return url.toString();
};
