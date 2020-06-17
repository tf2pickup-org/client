import { NgModule } from '@angular/core';
import { Coffee, Eye, Heart, Minus, Plus, UserX, X } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';

// https://github.com/michaelbazos/angular-feather#available-icons
const icons = {
  Coffee,
  Eye,
  Heart,
  Minus,
  Plus,
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
