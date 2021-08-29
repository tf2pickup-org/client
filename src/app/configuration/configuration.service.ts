import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { ConfigurationEntryKey } from './configuration-entry-key';

interface ConfigurationEntry {
  key: ConfigurationEntryKey;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  fetchValue<T extends ConfigurationEntry>(key: string): Observable<T> {
    return this.http.get<T>(
      `${this.apiUrl}/configuration/${key.split(' ').join('-')}`,
    );
  }

  storeValue<T extends ConfigurationEntry>(entry: T): Observable<T> {
    return this.http.put<T>(
      `${this.apiUrl}/configuration/${entry.key.split(' ').join('-')}`,
      entry,
    );
  }
}
