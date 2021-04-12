import { Pipe, PipeTransform } from '@angular/core';
import { ResolvedGameSlot } from './models/resolved-game-slot';

/**
 * Orders classes in the game slot list.
 */
const tf2ClassPriority = {
  scout: 9,
  soldier: 8,
  pyro: 7,
  demoman: 6,
  heavy: 5,
  engineer: 4,
  medic: 3,
  sniper: 2,
  spy: 1,
};

@Pipe({
  name: 'orderTf2Classes',
})
export class OrderTf2ClassesPipe implements PipeTransform {
  transform(value: ResolvedGameSlot[]): ResolvedGameSlot[] {
    return value.sort(
      (a, b) => tf2ClassPriority[b.gameClass] - tf2ClassPriority[a.gameClass],
    );
  }
}
