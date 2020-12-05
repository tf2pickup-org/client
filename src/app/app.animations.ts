import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations';

export const fadeThrough = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }),
    ]),
    query(':enter', [
      style({ opacity: 0, }),
    ]),
    group([
      query(':leave', [
        animate('50ms', style({ opacity: 0, })),
      ]),
      query(':enter', [
        animate('100ms 50ms', style({ opacity: 1 })),
      ]),
    ]),
  ]),
]);
