import { Injectable, Inject } from '@angular/core';
import io from 'socket.io-client';
import { WsTokenService } from './ws-token.service';
import { WS_URL } from '@app/ws-url';

@Injectable({
  providedIn: 'root'
})
export class SocketFactoryService {

  constructor(
    private wsTokenService: WsTokenService,
    @Inject(WS_URL) private wsUrl: string,
  ) { }

  createSocket(): SocketIOClient.Socket {
    const socket = io(this.wsUrl, { autoConnect: false });

    socket.on('error', (error: Error) => {
      console.error(error);
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

    this.wsTokenService.getWsToken().subscribe(wsToken => {
      if (wsToken) {
        socket.io.opts.query = `auth_token=${wsToken}`;
      }
      socket.connect();
    });

    return socket;
  }

}
