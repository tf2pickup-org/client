import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable, fromEvent } from 'rxjs';
import { TwitchStream } from './models/twitch-stream';
import { Store } from '@ngrx/store';
import { twitchStreamsUpdated } from './twitch.actions';
import { WindowHelperService } from '@app/shared/window-helper.service';
import { Socket } from '@app/io/socket';
import { Player } from '@app/players/models/player';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private store: Store,
    private windowHelperService: WindowHelperService,
    socket: Socket,
  ) {
    fromEvent<TwitchStream[]>(socket, 'twitch streams update').subscribe(
      twitchStreams =>
        this.store.dispatch(twitchStreamsUpdated({ twitchStreams })),
    );
  }

  login() {
    const width = 550;
    const height = 850;
    const url = `${this.apiUrl}/twitch/auth`;
    this.windowHelperService.openWindow({ width, height, url });
  }

  disconnect() {
    return this.http.put<Player>(`${this.apiUrl}/twitch/disconnect`, {});
  }

  fetchStreams(): Observable<TwitchStream[]> {
    return this.http.get<TwitchStream[]>(`${this.apiUrl}/twitch/streams`);
  }
}
