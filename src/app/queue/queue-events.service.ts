import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QueueSlot } from './models/queue-slot';
import { IoClientService } from '@app/core/io-client.service';
import { QueueState } from './models/queue-state';

@Injectable({
  providedIn: 'root'
})
export class QueueEventsService {

  private _slotUpdate = new Subject<QueueSlot>();
  private _stateUpdate = new Subject<QueueState>();
  private _slotsReset = new Subject<QueueSlot[]>();
  private _mapUpdate = new Subject<string>();

  get slotUpdate() {
    return this._slotUpdate.asObservable();
  }

  get stateUpdate() {
    return this._stateUpdate.asObservable();
  }

  get slotsReset() {
    return this._slotsReset.asObservable();
  }

  get mapUpdate() {
    return this._mapUpdate.asObservable();
  }

  constructor(
    private ws: IoClientService,
  ) {
    this.ws.socket.subscribe(socket => {
      socket.on('queue slot update', (slot: QueueSlot) => this._slotUpdate.next(slot));
      socket.on('queue state update', (state: QueueState) => this._stateUpdate.next(state));
      socket.on('queue slots reset', (slots: QueueSlot[]) => this._slotsReset.next(slots));
      socket.on('queue map updated', (map: string) => this._mapUpdate.next(map));
    });
  }
}
