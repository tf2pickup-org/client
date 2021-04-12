import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ConfigurationEntryResponse<T> {
  key: string;
  value: T;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  fetchValue<T>(key: string): Observable<T> {
    return this.http
      .get<ConfigurationEntryResponse<T>>(
        `${this.apiUrl}/configuration/${key.split(' ').join('-')}`,
      )
      .pipe(map(response => response.value));
  }

  storeValue<T>(key: string, value: any): Observable<T> {
    return this.http
      .put<ConfigurationEntryResponse<T>>(
        `${this.apiUrl}/configuration/${key.split(' ').join('-')}`,
        { key, value },
      )
      .pipe(map(response => response.value));
  }
}
