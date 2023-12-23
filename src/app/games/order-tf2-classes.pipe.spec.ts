import { GameSlot } from './models/game-slot';
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
      { gameClass: 'soldier' } as GameSlot,
      { gameClass: 'demoman' } as GameSlot,
      { gameClass: 'scout' } as GameSlot,
    ];

    expect(pipe.transform(slots)).toEqual([
      { gameClass: 'scout' },
      { gameClass: 'soldier' },
      { gameClass: 'demoman' },
    ] as GameSlot[]);
  });
});
