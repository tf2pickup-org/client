import { Injectable, Inject } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import * as socketIo from 'socket.io-client';
import { WS_URL } from '@app/ws-url';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { loadQueue } from '@app/queue/queue.actions';

@Injectable({
  providedIn: 'root'
})
export class IoClientService {

  private _socket: SocketIOClient.Socket;

  get socket() {
    return this._socket;
  }

  constructor(
    private authService: AuthService,
    @Inject(WS_URL) private wsUrl: string,
    private store: Store<AppState>,
  ) {
    let options = { };
    if (this.authService.authenticated) {
      options = { ...options, query: `auth_token=${this.authService.token}` };
    }

    this._socket = socketIo(this.wsUrl, options);
    this._socket.on('error', (error: Error) => console.error(error));
    this._socket.on('connect', () => this.store.dispatch(loadQueue()));
  }

}
