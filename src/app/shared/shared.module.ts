import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamLoginButtonComponent } from './steam-login-button/steam-login-button.component';
import { ConnectStringToLinkPipe } from './connect-string-to-link.pipe';
import { SafeMumbleUrlPipe } from './safe-mumble-url.pipe';
import { GameClassIconComponent } from './game-class-icon/game-class-icon.component';
import { NavigateBackDirective } from './navigate-back.directive';
import { AsFormGroupPipe } from './as-form-group.pipe';
import { CountryFlagPipe } from './country-flag.pipe';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { WithLoadingPipe } from './with-loading.pipe';
import { TooltipDirective } from './tooltip.directive';
import { TooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  declarations: [
    SteamLoginButtonComponent,
    ConnectStringToLinkPipe,
    SafeMumbleUrlPipe,
    GameClassIconComponent,
    NavigateBackDirective,
    AsFormGroupPipe,
    CountryFlagPipe,
    ConfirmDialogComponent,
    WithLoadingPipe,
    TooltipDirective,
    TooltipComponent,
  ],
  imports: [CommonModule],
  exports: [
    SteamLoginButtonComponent,
    ConnectStringToLinkPipe,
    SafeMumbleUrlPipe,
    GameClassIconComponent,
    NavigateBackDirective,
    AsFormGroupPipe,
    CountryFlagPipe,
    ConfirmDialogComponent,
    WithLoadingPipe,
    TooltipDirective,
  ],
})
export class SharedModule {}
