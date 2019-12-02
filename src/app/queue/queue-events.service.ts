import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QueueSlot } from './models/queue-slot';
import { IoClientService } from '@app/core/io-client.service';
import { QueueState } from './models/queue-state';
import { MapVoteResult } from './models/map-vote-result';

@Injectable({
  providedIn: 'root'
})
export class QueueEventsService {

  private _slotUpdate = new Subject<QueueSlot>();
  private _stateUpdate = new Subject<QueueState>();
  private _slotsReset = new Subject<QueueSlot[]>();
  private _mapVoteResultsUpdate = new Subject<MapVoteResult[]>();

  get slotUpdate() {
    return this._slotUpdate.asObservable();
  }

  get stateUpdate() {
    return this._stateUpdate.asObservable();
  }

  get slotsReset() {
    return this._slotsReset.asObservable();
  }

  get mapVoteResultsUpdate() {
    return this._mapVoteResultsUpdate.asObservable();
  }

  constructor(
    private ws: IoClientService,
  ) {
    this.ws.socket.subscribe(socket => {
      socket.on('queue slot update', (slot: QueueSlot) => this._slotUpdate.next(slot));
      socket.on('queue state update', (state: QueueState) => this._stateUpdate.next(state));
      socket.on('queue slots reset', (slots: QueueSlot[]) => this._slotsReset.next(slots));
      socket.on('map vote results update', (results: MapVoteResult[]) => this._mapVoteResultsUpdate.next(results));
    });
  }
}
