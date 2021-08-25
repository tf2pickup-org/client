import {
  animate,
  query,
  sequence,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const onlinePlayerListAnimation = trigger('onlinePlayerList', [
  transition(':increment', [
    query(':enter', [
      style({
        opacity: 0,
        maxHeight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }),
      stagger('200ms', [
        sequence([
          animate(
            '20ms',
            style({
              paddingTop: '*',
              paddingBottom: '*',
            }),
          ),
          animate(
            '100ms',
            style({
              opacity: 1,
              maxHeight: '30px',
            }),
          ),
        ]),
      ]),
    ]),
  ]),
  transition(':decrement', [
    query(':leave', [
      animate(
        '100ms',
        style({
          opacity: 0,
          maxHeight: 0,
        }),
      ),
    ]),
  ]),
]);
