import { transition, query, style, stagger, animate } from '@angular/animations';

export function fadeIn(selector = ':enter', duration = '400ms ease-out') {
  return [
    transition(selector, [
      style({
        opacity: 0,
      }),
      animate(duration, style({
        opacity: 1,
      })),
    ]),
  ];
}
