import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './queue.reducer';
import { QueueContainerComponent } from './queue-container/queue-container.component';
import { QueueRoutingModule } from './queue-routing.module';
import { QueueComponent } from './queue/queue.component';
import { QueueStatusComponent } from './queue-status/queue-status.component';

@NgModule({
  declarations: [
    QueueContainerComponent,
    QueueComponent,
    QueueStatusComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('queue', reducer),

    QueueRoutingModule,
  ],
})
export class QueueModule { }
