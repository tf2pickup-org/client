import { NgModule } from '@angular/core';
import { Check, Coffee, Edit2, ExternalLink, Eye, Heart, MessageSquare, Minus, Plus, User, UserX, X } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';

// https://github.com/michaelbazos/angular-feather#available-icons
const icons = {
/* eslint-disable @typescript-eslint/naming-convention */
  Check,
  Coffee,
  Edit2,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  Minus,
  Plus,
  User,
  UserX,
  X,
/* eslint-enable @typescript-eslint/naming-convention */
};

@NgModule({
  imports: [
    FeatherModule.pick(icons),
  ],
  exports: [
    FeatherModule,
  ],
})
export class IconsModule { }
