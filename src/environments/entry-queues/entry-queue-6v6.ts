import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

export const entryQueue6v6 = {
  config: {
    teamCount: 2,
    classes: [
      { name: Tf2ClassName.scout, count: 2 },
      { name: Tf2ClassName.soldier, count: 2 },
      { name: Tf2ClassName.demoman, count: 1 },
      { name: Tf2ClassName.medic, count: 1 },
    ],
  },
  slots: [
    { id: 0, gameClass: Tf2ClassName.scout, ready: false },
    { id: 1, gameClass: Tf2ClassName.scout, ready: false },
    { id: 2, gameClass: Tf2ClassName.scout, ready: false },
    { id: 3, gameClass: Tf2ClassName.scout, ready: false },
    { id: 4, gameClass: Tf2ClassName.soldier, ready: false },
    { id: 5, gameClass: Tf2ClassName.soldier, ready: false },
    { id: 6, gameClass: Tf2ClassName.soldier, ready: false },
    { id: 7, gameClass: Tf2ClassName.soldier, ready: false },
    { id: 8, gameClass: Tf2ClassName.demoman, ready: false },
    { id: 9, gameClass: Tf2ClassName.demoman, ready: false },
    { id: 10, gameClass: Tf2ClassName.medic, ready: false },
    { id: 11, gameClass: Tf2ClassName.medic, ready: false },
  ],
};
