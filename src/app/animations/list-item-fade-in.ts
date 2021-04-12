import { animate, animation, stagger, style } from '@angular/animations';

export const listItemFadeIn = animation([
  style({
    opacity: 0,
    transform: 'translateY(-3px)',
  }),
  stagger('40ms', [
    animate(
      '100ms',
      style({
        opacity: 1,
        transform: 'none',
      }),
    ),
  ]),
]);
