import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { TwitchStream } from './models/twitch-stream';
import { Store } from '@ngrx/store';
import { twitchStreamsUpdated } from './twitch.actions';
import io from 'socket.io-client';
import { AuthService } from '@app/auth/auth.service';
import { WindowHelperService } from '@app/shared/window-helper.service';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private store: Store,
    private authService: AuthService,
    private windowHelperService: WindowHelperService,
  ) {
    const socket = io('/twitch');
    socket.on('streams update', (twitchStreams: TwitchStream[]) => this.store.dispatch(twitchStreamsUpdated({ twitchStreams })));
  }

  login() {
    this.authService.reauth().subscribe(authToken => {
      const width = 550;
      const height = 850;
      const url = `${this.apiUrl}/twitch/auth?token=${authToken}`;
      this.windowHelperService.openWindow({ width, height, url });
    });
  }

  fetchStreams(): Observable<TwitchStream[]> {
    return this.http.get<TwitchStream[]>(`${this.apiUrl}/twitch/streams`);
  }

}
