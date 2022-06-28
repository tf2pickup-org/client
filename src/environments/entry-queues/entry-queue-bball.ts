import { Tf2ClassName } from '@app/shared/models/tf2-class-name';

export const entryQueueBball = {
  config: {
    teamCount: 2,
    classes: [{ name: Tf2ClassName.soldier, count: 2 }],
  },
  slots: [
    { id: 0, gameClass: Tf2ClassName.soldier, ready: false },
    { id: 1, gameClass: Tf2ClassName.soldier, ready: false },
    { id: 2, gameClass: Tf2ClassName.soldier, ready: false },
    { id: 3, gameClass: Tf2ClassName.soldier, ready: false },
  ],
};
