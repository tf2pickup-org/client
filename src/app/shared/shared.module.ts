import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamLoginButtonComponent } from './steam-login-button/steam-login-button.component';
import { ConnectStringToLinkPipe } from './connect-string-to-link.pipe';
import { RulesComponent } from './rules/rules.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    SteamLoginButtonComponent,
    ConnectStringToLinkPipe,
    RulesComponent,
  ],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
  ],
  exports: [
    SteamLoginButtonComponent,
    ConnectStringToLinkPipe,
    RulesComponent,
  ]
})
export class SharedModule { }
