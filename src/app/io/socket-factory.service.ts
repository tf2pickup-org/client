import { Injectable, Inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { WsTokenService } from './ws-token.service';
import { WS_URL } from '@app/ws-url';
import { Store } from '@ngrx/store';
import { ioConnected, ioDisconnected } from './io.actions';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketFactoryService {
  constructor(
    private wsTokenService: WsTokenService,
    @Inject(WS_URL) private wsUrl: string,
    private store: Store,
  ) {}

  createSocket(): Socket {
    const socket = io(this.wsUrl, {
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
      auth: cb =>
        this.wsTokenService
          .getWsToken()
          .pipe(map(token => (token ? { token: `Bearer ${token}` } : {})))
          .subscribe(cb),
    });

    socket.on('exception', ({ message }) => {
      console.error(message);
    });

    socket.on('connect', () => this.store.dispatch(ioConnected()));
    socket.on('disconnect', () => this.store.dispatch(ioDisconnected()));
    return socket;
  }
}
