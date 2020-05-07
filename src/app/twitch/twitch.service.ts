import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { TwitchStream } from './models/twitch-stream';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) { }

  fetchStreams(): Observable<TwitchStream[]> {
    return this.http.get<TwitchStream[]>(`${this.apiUrl}/twitch/streams`);
  }

}
