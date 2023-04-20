import { Injectable, Inject } from '@angular/core';
import { API_URL } from '@app/api-url';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(API_URL) private apiUrl: string) {}

  login() {
    window.location.href = `${this.apiUrl}/auth/steam`;
  }

  logout() {
    window.location.href = `${this.apiUrl}/auth/sign-out`;
  }
}
