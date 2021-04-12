import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    data: { title: 'settings' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
