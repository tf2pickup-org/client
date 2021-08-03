import { Injectable, Inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { WsTokenService } from './ws-token.service';
import { WS_URL } from '@app/ws-url';
import { Store } from '@ngrx/store';
import { ioConnected, ioDisconnected } from './io.actions';
import { noop } from 'rxjs';

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
      autoConnect: false,
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
    });

    socket.on('connect_error', error => {
      switch (error.message) {
        case 'invalid signature':
        case 'jwt expired':
          this.wsTokenService.getWsToken({ force: true }).subscribe(
            wsToken => {
              socket.auth = { token: `Bearer ${wsToken}` };
            },
            noop,
            () => socket.connect(),
          );
          break;

        default:
          console.error(error);
      }
    });

    socket.on('exception', ({ message }) => {
      console.error(message);
    });

    socket.on('connect', () => this.store.dispatch(ioConnected()));
    socket.on('disconnect', () => this.store.dispatch(ioDisconnected()));

    this.wsTokenService.getWsToken().subscribe(
      wsToken => {
        if (wsToken) {
          socket.auth = { token: `Bearer ${wsToken}` };
        }
      },
      noop,
      () => socket.connect(),
    );

    return socket;
  }
}
