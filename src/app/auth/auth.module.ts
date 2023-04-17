import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpParams } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { HTTP_PARAMS } from './http-params';

@NgModule({
  declarations: [AuthErrorComponent],
  imports: [CommonModule, AuthRoutingModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_PARAMS,
      useValue: new HttpParams({
        fromString: window.location.search.substr(1),
      }),
    },
  ],
})
export class AuthModule {}
