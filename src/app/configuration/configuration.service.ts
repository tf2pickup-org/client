import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { ConfigurationEntry } from './models/configuration-entry';

type GetConfigurationEntry<T> = ConfigurationEntry<T>;
type SetConfigurationEntry<T> = Pick<ConfigurationEntry<T>, 'key' | 'value'>;

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {}

  fetchValues<T extends readonly unknown[]>(
    ...keys: string[]
  ): Observable<{ -readonly [P in keyof T]: GetConfigurationEntry<T[P]> }> {
    return this.http.get<{
      -readonly [P in keyof T]: GetConfigurationEntry<T[P]>;
    }>(`${this.apiUrl}/configuration`, {
      params: {
        ...(keys?.length
          ? {
              keys: keys.join(','),
            }
          : {}),
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
