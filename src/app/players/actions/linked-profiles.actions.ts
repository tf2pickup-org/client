import { createAction, props } from '@ngrx/store';
import { LinkedProfiles } from '../models/linked-profiles';

export const loadLinkedProfiles = createAction(
  '[Player details] Load player linked profiles',
  props<{ playerId: string }>(),
);

export const linkedProfilesLoaded = createAction(
  '[API] Player linked profiles loaded',
  props<{ linkedProfiles: LinkedProfiles }>(),
);
