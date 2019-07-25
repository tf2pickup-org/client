import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamLoginButtonComponent } from './steam-login-button/steam-login-button.component';
import { ConnectStringToLinkPipe } from './connect-string-to-link.pipe';

@NgModule({
  declarations: [
    SteamLoginButtonComponent,
    ConnectStringToLinkPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SteamLoginButtonComponent,
    ConnectStringToLinkPipe,
  ]
})
export class SharedModule { }
