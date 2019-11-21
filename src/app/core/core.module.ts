import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TitleControllerComponent } from './title-controller/title-controller.component';

@NgModule({
  declarations: [
    NavigationBarComponent,
    FooterComponent,
    TitleControllerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,

    TooltipModule,
  ],
  exports: [
    NavigationBarComponent,
    FooterComponent,
    TitleControllerComponent,
  ],
})
export class CoreModule { }
