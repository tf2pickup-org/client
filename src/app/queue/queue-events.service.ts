import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QueueSlot } from './models/queue-slot';
import { IoClientService } from '@app/core/io-client.service';
import { QueueState } from './models/queue-state';
import { MapVoteResult } from './models/map-vote-result';
import { SubstituteRequest } from './models/substitute-request';
import { Friendship } from './models/friendship';

@Injectable({
  providedIn: 'root'
})
export class QueueEventsService {

  private _slotsUpdate = new Subject<QueueSlot[]>();
  private _stateUpdate = new Subject<QueueState>();
  private _mapVoteResultsUpdate = new Subject<MapVoteResult[]>();
  private _substituteRequests = new Subject<SubstituteRequest[]>();
  private _frienshipsUpdate = new Subject<Friendship[]>();

  get slotsUpdate() {
    return this._slotsUpdate.asObservable();
  }

  get stateUpdate() {
    return this._stateUpdate.asObservable();
  }

  get mapVoteResultsUpdate() {
    return this._mapVoteResultsUpdate.asObservable();
  }

  get substituteRequests() {
    return this._substituteRequests.asObservable();
  }

  get friendshipsUpdate() {
    return this._frienshipsUpdate.asObservable();
  }

  constructor(
    private ws: IoClientService,
  ) {
    this.ws.socket.subscribe(socket => {
      socket.on('queue slots update', (slots: QueueSlot[]) => this._slotsUpdate.next(slots));
      socket.on('queue state update', (state: QueueState) => this._stateUpdate.next(state));
      socket.on('map vote results update', (results: MapVoteResult[]) => this._mapVoteResultsUpdate.next(results));
      socket.on('substitute requests update', (requests: SubstituteRequest[]) => this._substituteRequests.next(requests));
      socket.on('friendships update', (friendships: Friendship[]) => this._frienshipsUpdate.next(friendships));
    });
  }
}
