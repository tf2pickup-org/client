import { animate, animation, style } from '@angular/animations';

export const fadeIn = animation([
  style({
    opacity: 0,
  }),
  animate(
    '100ms',
    style({
      opacity: 1,
    }),
  ),
]);
