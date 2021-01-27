import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { MapPoolEditComponent } from './map-pool-edit/map-pool-edit.component';
import { MapEditComponent } from './map-edit/map-edit.component';
import { IconsModule } from '@app/icons/icons.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    ConfigurationComponent,
    MapPoolEditComponent,
    MapEditComponent,
  ],
  imports: [
    CommonModule,
    TooltipModule,

    IconsModule,

    AdminRoutingModule,
  ]
})
export class AdminModule { }
