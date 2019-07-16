import { Injectable, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { API_URL } from '@app/api-url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string;

  get authenticated() {
    return !!this.token;
  }

  constructor(
    @Inject(API_URL) private apiUrl: string,
  ) {
    this.token = sessionStorage.getItem('token');

    if (!this.token) {
      const params = new HttpParams({
        fromString: window.location.search.substr(1)
      });

      if (params.has('token')) {
        this.token = params.get('token');
        sessionStorage.setItem('token', this.token);
        window.location.search = '';
      }
    }
  }

  login() {
    sessionStorage.removeItem('token');
    window.location.href = `${this.apiUrl}/auth/steam`;
  }

}
