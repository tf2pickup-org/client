import { NgModule } from '@angular/core';
import { Coffee, Edit2, Eye, Heart, Minus, Plus, User, UserX, X } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';

// https://github.com/michaelbazos/angular-feather#available-icons
const icons = {
  Coffee,
  Edit2,
  Eye,
  Heart,
  Minus,
  Plus,
  User,
  UserX,
  X,
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
