import { Injectable } from '@angular/core';
import { SocketFactoryService } from './socket-factory.service';
import { Observable } from 'rxjs';

type Listener = (...args: any[]) => void;

@Injectable({
  providedIn: 'root'
})
export class Socket {

  private _socket = this.socketFactoryService.createSocket();

  constructor(
    private socketFactoryService: SocketFactoryService,
  ) { }

  addEventListener(event: string, listener: Listener): Socket {
    this._socket.addEventListener(event, listener);
    return this;
  }

  on(event: string, listener: Listener): Socket {
    return this.addEventListener(event, listener);
  }

  removeEventListener(event: string, listener?: Listener): Socket {
    this._socket.removeEventListener(event, listener);
    return this;
  }

  off(event: string, listener?: Listener): Socket {
    return this.removeEventListener(event, listener);
  }

  call<T>(methodName: string, ...args: any[]): Observable<T> {
    return new Observable(observer => {
      const _args = args.length > 0 ? args : [{ }]; // we need to pass at least one argument due to NestJS limitation
      this._socket.emit(methodName, ..._args, (response: T) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

}
