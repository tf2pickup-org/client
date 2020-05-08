import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { TwitchStream } from './models/twitch-stream';
import { Store } from '@ngrx/store';
import { twitchStreamsUpdated } from './twitch.actions';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private store: Store,
  ) {
    const socket = io('/twitch');
    socket.on('streams update', (twitchStreams: TwitchStream[]) => this.store.dispatch(twitchStreamsUpdated({ twitchStreams })));
  }

  fetchStreams(): Observable<TwitchStream[]> {
    return this.http.get<TwitchStream[]>(`${this.apiUrl}/twitch/streams`);
  }

}
