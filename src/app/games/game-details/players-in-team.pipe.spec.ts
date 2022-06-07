import { Player } from '@app/players/models/player';
import { GameSlot } from '../models/game-slot';
import { PlayersInTeamPipe } from './players-in-team.pipe';

describe('PlayersInTeamPipe', () => {
  let pipe: PlayersInTeamPipe;

  beforeEach(() => {
    pipe = new PlayersInTeamPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should select slots of only selected team', () => {
    const slots: GameSlot[] = [
      {
        team: 'blu',
        gameClass: 'soldier',
        connectionStatus: 'connected',
        status: 'active',
        player: { id: 'PLAYER_1_ID' } as Player,
      },
      {
        team: 'red',
        gameClass: 'soldier',
        connectionStatus: 'connected',
        status: 'active',
        player: { id: 'PLAYER_2_ID' } as Player,
      },
    ];
    const res = pipe.transform(slots, 'blu');
    expect(res.length).toBe(1);
    expect(res[0].player.id).toEqual('PLAYER_1_ID');
  });
});
