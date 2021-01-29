import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MapPoolEditComponent } from './map-pool-edit/map-pool-edit.component';
import { MapEditComponent } from './map-edit/map-edit.component';
import { IconsModule } from '@app/icons/icons.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { AdminItemListComponent } from './admin-item-list/admin-item-list.component';

@NgModule({
  declarations: [
    MapPoolEditComponent,
    MapEditComponent,
    AdminItemListComponent,
  ],
  imports: [
    CommonModule,
    TooltipModule,
    ReactiveFormsModule,

    IconsModule,
    SharedModule,

    AdminRoutingModule,
  ]
})
export class AdminModule { }
