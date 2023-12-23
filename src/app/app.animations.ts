import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeThrough = trigger('routeAnimations', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }),
      ],
      { optional: true },
    ),
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    group([
      query(':leave', [animate('50ms', style({ opacity: 0 }))], {
        optional: true,
      }),
      query(':enter', [animate('100ms 50ms', style({ opacity: 1 }))], {
        optional: true,
      }),
    ]),
  ]),
]);
