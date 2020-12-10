import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './profile.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProfileEffects } from './profile.effects';
import { AcceptRulesDialogComponent } from './accept-rules-dialog/accept-rules-dialog.component';
import { MarkdownModule } from 'ngx-markdown';
import { SettingsComponent } from './settings/settings.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { IconsModule } from '@app/icons/icons.module';
import { TwitchTvIntegrationComponent } from './twitch-tv-integration/twitch-tv-integration.component';

@NgModule({
  declarations: [
    AcceptRulesDialogComponent,
    SettingsComponent,
    TwitchTvIntegrationComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('profile', reducer),
    EffectsModule.forFeature([ProfileEffects]),
    MarkdownModule.forChild(),
    OverlayModule,
    PortalModule,
    IconsModule,

    ProfileRoutingModule,
  ],
})
export class ProfileModule { }
