import { LinkedProfile } from '@app/players/models/linked-profile';
import { createAction, props } from '@ngrx/store';
import { Profile } from './models/profile';

export const loadProfile = createAction('[Init] Load profile');

export const profileLoaded = createAction(
  '[API] Profile loaded',
  props<{ profile: Profile }>(),
);

export const acceptRules = createAction('[Profile] Accept rules');
export const rulesAccepted = createAction('[Profile API] Rules accepted');

export const profileUpdated = createAction(
  '[WS] Profile updated',
  props<{ profileChanges: Partial<Profile> }>(),
);

export const savePreferences = createAction(
  '[Player settings] Save preferences',
  props<{ preferences: { [key: string]: string } }>(),
);

export const preferencesUpdated = createAction(
  '[API] Preferences updated',
  props<{ preferences: { [key: string]: string } }>(),
);

export const loadLinkedProfiles = createAction(
  '[Init] Load linked profiles for the current player',
);

export const linkedProfilesLoaded = createAction(
  '[Profile API] Linked profiles for the current player loaded',
  props<{ linkedProfiles: LinkedProfile[] }>(),
);
