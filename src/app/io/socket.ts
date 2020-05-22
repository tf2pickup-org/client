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

  on(event: string, listener: Listener): Socket {
    this._socket.on(event, listener);
    return this;
  }

  off(event: string, listener?: Listener): Socket {
    this._socket.off(event, listener);
    return this;
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
