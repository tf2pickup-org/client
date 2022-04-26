import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import {
  catchError,
  Observable,
  of,
  ReplaySubject,
  tap,
  throwError,
} from 'rxjs';
import { ServemeTfConfiguration } from './models/serveme-tf-configuration';
import { ServemeTfServerOption } from './models/serveme-tf-server-option';

@Injectable({
  providedIn: 'root',
})
export class ServemeTfService {
  private _isEnabled = new ReplaySubject<boolean>(1);

  constructor(
    private httpClient: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {
    this.checkEnabled();
  }

  get isEnabled(): Observable<boolean> {
    return this._isEnabled.asObservable();
  }

  fetchConfiguration(): Observable<ServemeTfConfiguration> {
    return this.httpClient.get<ServemeTfConfiguration>(
      `${this.apiUrl}/serveme-tf/configuration`,
    );
  }

  storeConfiguration(
    configuration: ServemeTfConfiguration,
  ): Observable<ServemeTfConfiguration> {
    return this.httpClient.put<ServemeTfConfiguration>(
      `${this.apiUrl}/serveme-tf/configuration`,
      configuration,
    );
  }

  fetchAllServers(): Observable<ServemeTfServerOption[]> {
    return this.httpClient.get<ServemeTfServerOption[]>(
      `${this.apiUrl}/serveme-tf/servers`,
    );
  }

  private checkEnabled() {
    this.httpClient
      .get<ServemeTfConfiguration>(`${this.apiUrl}/serveme-tf/configuration`)
      .pipe(
        tap(() => this._isEnabled.next(true)),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            this._isEnabled.next(false);
            return of(null);
          } else {
            return throwError(() => error);
          }
        }),
      )
      .subscribe();
  }
}
