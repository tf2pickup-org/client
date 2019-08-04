import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    NavigationBarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    NavigationBarComponent,
    FooterComponent,
  ],
})
export class CoreModule { }
