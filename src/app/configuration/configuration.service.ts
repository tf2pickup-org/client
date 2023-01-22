import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { ConfigurationEntryKey } from './configuration-entry-key';

interface GetConfigurationEntry<T> {
  key: string;
  schema: unknown;
  value?: T;
  defaultValue?: T;
}

interface SetConfigurationEntry<T> {
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

  fetchValues<T extends readonly unknown[]>(
    ...keys: string[]
  ): Observable<{ -readonly [P in keyof T]: GetConfigurationEntry<T[P]> }> {
    return this.http.get<{
      -readonly [P in keyof T]: GetConfigurationEntry<T[P]>;
    }>(`${this.apiUrl}/configuration`, {
      params: {
        keys: keys.join(','),
      },
    });
  }

  storeValues<T extends readonly unknown[]>(
    ...entries: SetConfigurationEntry<T[number]>[]
  ): Observable<{ -readonly [P in keyof T]: GetConfigurationEntry<T[P]> }> {
    return this.http.put<{
      -readonly [P in keyof T]: GetConfigurationEntry<T[P]>;
    }>(`${this.apiUrl}/configuration`, entries);
  }
}
