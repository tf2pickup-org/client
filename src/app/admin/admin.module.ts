import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';

@NgModule({
  declarations: [ConfigurationComponent],
  imports: [
    CommonModule,

    AdminRoutingModule,
  ]
})
export class AdminModule { }
