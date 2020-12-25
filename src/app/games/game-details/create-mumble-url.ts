import { Game } from '../models/game';
import { Profile } from '@app/profile/models/profile';

export const createMumbleUrl = (game: Game, profile: Profile) => {
  if (!game?.mumbleUrl) {
    return null;
  }

  const mySlot = game?.slots.find(s => s.player === profile?.id);
  if (!mySlot) {
    return null;
  }

  const url = new URL(game.mumbleUrl);

  // https://stackoverflow.com/questions/64299675/why-the-url-class-does-not-support-setting-username-for-protocols-other-than-htt
  const protocol = url.protocol;
  url.protocol = 'http:';
  url.username = profile.name.replace(/\s+/g, '_');
  url.pathname += '/' + mySlot.team.toUpperCase();
  url.protocol = protocol;

  return url.toString();
};
