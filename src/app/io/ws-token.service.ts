import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { API_URL } from '@app/api-url';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WsTokenService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  getWsToken(): Observable<string | null> {
    return this.http
      .get<{ wsToken: string }>(`${this.apiUrl}/auth/wstoken`, {
        withCredentials: true,
      })
      .pipe(
        map(({ wsToken }) => wsToken),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return of(null);
          }

          return throwError(() => error);
        }),
      );
  }
}
