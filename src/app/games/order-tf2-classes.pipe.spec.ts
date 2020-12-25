import { ResolvedGamePlayer } from './models/resolved-game-player';
import { OrderTf2ClassesPipe } from './order-tf2-classes.pipe';

describe('OrderTf2ClassesPipe', () => {
  let pipe: OrderTf2ClassesPipe;

  beforeEach(() => {
    pipe = new OrderTf2ClassesPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should order TF2 classes', () => {
    const slots = [
      { id: 'soldier', gameClass: 'soldier' },
      { id: 'demoman', gameClass: 'demoman' },
      { id: 'scout', gameClass: 'scout' },
    ] as ResolvedGamePlayer[];

    expect(pipe.transform(slots)).toEqual([
      { id: 'scout', gameClass: 'scout' },
      { id: 'soldier', gameClass: 'soldier' },
      { id: 'demoman', gameClass: 'demoman' },
    ] as any);
  });
});
