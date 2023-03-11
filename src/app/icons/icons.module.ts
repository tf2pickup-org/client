import { NgModule } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  IconArrowLeft,
  IconBackspace,
  IconCheck,
  IconCheckbox,
  IconChevronRight,
  IconClipboard,
  IconCoffee,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFileText,
  IconHeadphones,
  IconHeart,
  IconList,
  IconMinus,
  IconMovie,
  IconNotification,
  IconPencil,
  IconPlayerPlay,
  IconPlus,
  IconRefresh,
  IconSquare,
  IconSquareCheck,
  IconSquareX,
  IconStar,
  IconTrash,
  IconTrendingUp,
  IconUserX,
  IconVolume,
  IconVolumeOff,
  IconX,
  IconAlertOctagon,
} from 'angular-tabler-icons/icons';

// https://tabler-icons.io/
const icons = {
  /* eslint-disable @typescript-eslint/naming-convention */
  IconArrowLeft,
  IconBackspace,
  IconCheck,
  IconCheckbox,
  IconChevronRight,
  IconClipboard,
  IconCoffee,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFileText,
  IconHeadphones,
  IconHeart,
  IconList,
  IconMinus,
  IconMovie,
  IconNotification,
  IconPencil,
  IconPlayerPlay,
  IconPlus,
  IconRefresh,
  IconSquare,
  IconSquareCheck,
  IconSquareX,
  IconStar,
  IconTrash,
  IconTrendingUp,
  IconUserX,
  IconVolume,
  IconVolumeOff,
  IconX,
  IconAlertOctagon,
  /* eslint-enable @typescript-eslint/naming-convention */
};

@NgModule({
  imports: [TablerIconsModule.pick(icons)],
  exports: [TablerIconsModule],
})
export class IconsModule {}
