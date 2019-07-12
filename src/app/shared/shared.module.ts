import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamLoginButtonComponent } from './steam-login-button/steam-login-button.component';

@NgModule({
  declarations: [SteamLoginButtonComponent],
  imports: [
    CommonModule
  ],
  exports: [SteamLoginButtonComponent]
})
export class SharedModule { }
