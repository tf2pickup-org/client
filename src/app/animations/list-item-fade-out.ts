import { animate, animation, stagger, style } from '@angular/animations';

export const listItemFadeOut = animation([
  stagger('20ms', [
    animate('50ms', style({
      opacity: 0,
    })),
  ]),
]);
