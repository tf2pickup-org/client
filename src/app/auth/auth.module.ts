import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { TokenStoreService } from './token-store.service';

@NgModule({
  declarations: [
    AuthErrorComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
      deps: [ TokenStoreService, AuthService ],
    }
  ]
})
export class AuthModule { }
