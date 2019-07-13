import { Injectable, Inject } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import * as socketIo from 'socket.io-client';
import { WS_URL } from '@app/ws-url';

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
  ) {
    let options = { };
    if (this.authService.authenticated) {
      options = { ...options, query: `auth_token=${this.authService.token}` };
    }

    this._socket = socketIo(this.wsUrl, options);
    this._socket.on('error', (error: Error) => console.error(error));
  }

}
