import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { Profile } from './models/profile';
import { PlayerPreferences } from './models/player-preferences';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {}

  fetchProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profile`);
  }

  acceptRules(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/profile?accept_terms`, {});
  }

  savePreferences(
    preferences: PlayerPreferences,
  ): Observable<PlayerPreferences> {
    return this.http.put<PlayerPreferences>(
      `${this.apiUrl}/profile/preferences`,
      preferences,
    );
  }
}
