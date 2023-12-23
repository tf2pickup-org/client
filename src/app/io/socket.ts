import { Injectable } from '@angular/core';
import { SocketFactoryService } from './socket-factory.service';
import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (...args: any[]) => void;

@Injectable({
  providedIn: 'root',
})
export class Socket {
  private socket = this.socketFactoryService.createSocket();

  constructor(private socketFactoryService: SocketFactoryService) {}

  on(event: string, listener: Listener): Socket {
    this.socket.on(event, listener);
    return this;
  }

  off(event: string, listener?: Listener): Socket {
    this.socket.off(event, listener);
    return this;
  }

  call<T>(methodName: string, ...args: unknown[]): Observable<T> {
    return new Observable(observer => {
      const sendArgs = args.length > 0 ? args : [{}]; // we need to pass at least one argument due to NestJS limitation
      this.socket.emit(methodName, ...sendArgs, (response: T) => {
        observer.next(response);
        observer.complete();
      });
    });
  }
}
