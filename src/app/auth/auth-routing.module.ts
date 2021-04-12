import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthErrorComponent } from './auth-error/auth-error.component';

export const routes: Routes = [
  {
    path: 'auth-error',
    component: AuthErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
