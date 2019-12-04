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

  private _slotsUpdate = new Subject<QueueSlot[]>();
  private _stateUpdate = new Subject<QueueState>();
  private _mapVoteResultsUpdate = new Subject<MapVoteResult[]>();

  get slotsUpdate() {
    return this._slotsUpdate.asObservable();
  }

  get stateUpdate() {
    return this._stateUpdate.asObservable();
  }

  get mapVoteResultsUpdate() {
    return this._mapVoteResultsUpdate.asObservable();
  }

  constructor(
    private ws: IoClientService,
  ) {
    this.ws.socket.subscribe(socket => {
      socket.on('queue slots update', (slots: QueueSlot[]) => this._slotsUpdate.next(slots));
      socket.on('queue state update', (state: QueueState) => this._stateUpdate.next(state));
      socket.on('map vote results update', (results: MapVoteResult[]) => this._mapVoteResultsUpdate.next(results));
    });
  }
}
