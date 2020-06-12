import { Injectable, Inject } from '@angular/core';
import io from 'socket.io-client';
import { WsTokenService } from './ws-token.service';
import { WS_URL } from '@app/ws-url';
import { Store } from '@ngrx/store';
import { ioConnected, ioDisconnected } from './io.actions';

@Injectable({
  providedIn: 'root'
})
export class SocketFactoryService {

  constructor(
    private wsTokenService: WsTokenService,
    @Inject(WS_URL) private wsUrl: string,
    private store: Store,
  ) { }

  createSocket(): SocketIOClient.Socket {
    const socket = io(this.wsUrl, {
      autoConnect: false,
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
    });

    socket.on('error', (error: Error) => {
      switch (error.message) {
        case 'Signature verification failed': {
          this.wsTokenService.getWsToken({ force: true }).subscribe(wsToken => {
            socket.io.opts.query = `auth_token=${wsToken}`;
            socket.connect();
          });
          break;
        }

        default:
          console.error(error.message);
      }
    });

    socket.on('exception', ({ message }) => {
      console.error(message);
    });

    socket.on('connect', () => this.store.dispatch(ioConnected()));
    socket.on('reconnect', () => this.store.dispatch(ioConnected()));
    socket.on('disconnect', () => this.store.dispatch(ioDisconnected()));

    this.wsTokenService.getWsToken().subscribe(wsToken => {
      if (wsToken) {
        socket.io.opts.query = `auth_token=${wsToken}`;
      }
      socket.connect();
    });

    return socket;
  }

}
