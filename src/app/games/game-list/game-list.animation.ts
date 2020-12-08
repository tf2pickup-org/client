import { query, transition, trigger, useAnimation } from '@angular/animations';
import { listItemFadeIn, listItemFadeOut } from '@app/animations';

export const gameListAnimation = trigger('gameList', [
  transition(':increment', [
    query(':enter', [
      useAnimation(listItemFadeIn),
    ]),
  ]),
  transition(':decrement', [
    query(':leave', [
      useAnimation(listItemFadeOut),
    ]),
  ])
]);
