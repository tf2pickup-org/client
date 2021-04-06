import { Routes, RouterModule } from '@angular/router';
import { QueueContainerComponent } from './queue-container/queue-container.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: QueueContainerComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueueRoutingModule {}
