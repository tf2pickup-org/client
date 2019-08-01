import { Injectable, Inject } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import * as socketIo from 'socket.io-client';
import { WS_URL } from '@app/ws-url';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { loadQueue } from '@app/queue/queue.actions';
import { of, Observable, ReplaySubject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';

function callWsMethod<T>(socket: SocketIOClient.Socket, methodName: string, ...args: any[]): Observable<T> {
  return new Observable(observer => {
    socket.emit(methodName, ...args, (response: { value?: T, error?: string }) => {
      if (response.error) {
        observer.error(response.error);
      } else if (response.value) {
        observer.next(response.value);
        observer.complete();
      }
    });
  });
}

@Injectable({
  providedIn: 'root'
})
export class IoClientService {

  private _socket = new ReplaySubject<SocketIOClient.Socket>(1);

  get socket(): Observable<SocketIOClient.Socket> {
    return this._socket.asObservable();
  }

  constructor(
    private authService: AuthService,
    @Inject(WS_URL) private wsUrl: string,
    private store: Store<AppState>,
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {
    this.connect();
  }

  public call<T>(methodName: string, ...args: any[]): Observable<T> {
    return this.socket.pipe(
      switchMap(socket => callWsMethod<T>(socket, methodName, ...args)),
    );
  }

  private connect() {
    let createSocket: Observable<SocketIOClient.Socket>;
    if (this.authService.authenticated) {
      createSocket = this.http.get<{ wsToken: string}>(`${this.apiUrl}/auth/wstoken`).pipe(
        map(({ wsToken }) => ({ query: `auth_token=${wsToken}` })),
        map(options => socketIo(this.wsUrl, options)),
      );
    } else {
      createSocket = of(socketIo(this.wsUrl));
    }

    createSocket.subscribe(socket => {
      socket.on('connect', () => this.store.dispatch(loadQueue()));
      socket.on('error', (error: Error) => console.error(error.message));
      this._socket.next(socket);
    });
  }

}
