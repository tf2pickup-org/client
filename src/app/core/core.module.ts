import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { TitleControllerComponent } from './title-controller/title-controller.component';
import { OfflineStateBannerComponent } from './offline-state-banner/offline-state-banner.component';

@NgModule({
  declarations: [
    NavigationBarComponent,
    FooterComponent,
    TitleControllerComponent,
    OfflineStateBannerComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [
    NavigationBarComponent,
    FooterComponent,
    TitleControllerComponent,
    OfflineStateBannerComponent,
  ],
})
export class CoreModule {}
