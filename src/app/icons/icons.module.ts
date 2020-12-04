import { NgModule } from '@angular/core';
import { AlertOctagon, Check, Clipboard, Coffee, Edit2, ExternalLink, Eye, FileText, Film, Headphones, Heart, MessageSquare, Minus,
  Play, Plus, RefreshCcw, Star, User, UserX, X } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';

// https://github.com/michaelbazos/angular-feather#available-icons
const icons = {
/* eslint-disable @typescript-eslint/naming-convention */
  AlertOctagon,
  Check,
  Clipboard,
  Coffee,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  Film,
  Headphones,
  Heart,
  MessageSquare,
  Minus,
  Play,
  Plus,
  RefreshCcw,
  Star,
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
