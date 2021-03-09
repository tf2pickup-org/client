import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamLoginButtonComponent } from './steam-login-button/steam-login-button.component';
import { ConnectStringToLinkPipe } from './connect-string-to-link.pipe';
import { SafeMumbleUrlPipe } from './safe-mumble-url.pipe';
import { GameClassIconComponent } from './game-class-icon/game-class-icon.component';
import { MapThumbnailPipe } from './map-thumbnail.pipe';
import { NavigateBackDirective } from './navigate-back.directive';
import { AsFormGroupPipe } from './as-form-group.pipe';

@NgModule({
  declarations: [
    SteamLoginButtonComponent,
    ConnectStringToLinkPipe,
    SafeMumbleUrlPipe,
    GameClassIconComponent,
    MapThumbnailPipe,
    NavigateBackDirective,
    AsFormGroupPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SteamLoginButtonComponent,
    ConnectStringToLinkPipe,
    SafeMumbleUrlPipe,
    GameClassIconComponent,
    MapThumbnailPipe,
    NavigateBackDirective,
    AsFormGroupPipe,
  ]
})
export class SharedModule { }
