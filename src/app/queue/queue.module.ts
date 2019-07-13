import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './queue.reducer';
import { QueueContainerComponent } from './queue-container/queue-container.component';
import { QueueRoutingModule } from './queue-routing.module';
import { QueueComponent } from './queue/queue.component';
import { QueueStatusComponent } from './queue-status/queue-status.component';
import { EffectsModule } from '@ngrx/effects';
import { QueueEffects } from './queue.effects';
import { HttpClientModule } from '@angular/common/http';
import { QueueClassSlotListComponent } from './queue-class-slot-list/queue-class-slot-list.component';
import { QueueSlotItemComponent } from './queue-slot-item/queue-slot-item.component';
import { PlayerModule } from '@app/player/player.module';

@NgModule({
  declarations: [
    QueueContainerComponent,
    QueueComponent,
    QueueStatusComponent,
    QueueClassSlotListComponent,
    QueueSlotItemComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('queue', reducer),
    EffectsModule.forFeature([QueueEffects]),

    PlayerModule,

    QueueRoutingModule,
  ],
})
export class QueueModule { }
