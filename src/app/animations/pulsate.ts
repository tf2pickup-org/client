import { animate, animation, keyframes, style } from '@angular/animations';

export const pulsate = animation([
  animate('150ms', keyframes([
    style({ transform: 'scale3d(1, 1, 1)' }),
    style({ transform: 'scale3d(1.1, 1.1, 1.1)' }),
    style({ transform: 'scale3d(1, 1, 1)' }),
  ])),
]);
