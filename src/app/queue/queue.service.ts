import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Queue } from './models/queue';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { QueueSlot } from './models/queue-slot';
import { Friendship } from './models/friendship';
import { Socket } from '@app/io/socket';
import { Map } from './models/map';
import { MapVoteResult } from './models/map-vote-result';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private socket: Socket,
  ) { }

  fetchQueue(): Observable<Queue> {
    return this.http.get<Queue>(`${this.apiUrl}/queue`);
  }

  scrambleMaps(): Observable<MapVoteResult[]> {
    return this.http.put<MapVoteResult[]>(`${this.apiUrl}/queue/map_vote_results/scramble`, { });
  }

  joinQueue(slotId: number): Observable<QueueSlot[]> {
    return this.socket.call<QueueSlot[]>('join queue', { slotId });
  }

  leaveQueue(): Observable<QueueSlot> {
    return this.socket.call<QueueSlot>('leave queue');
  }

  readyUp(): Observable<QueueSlot> {
    return this.socket.call<QueueSlot>('player ready');
  }

  voteForMap(map: string): Observable<string> {
    return this.socket.call<string>('vote for map', { map });
  }

  markFriend(friendPlayerId: string): Observable<Friendship[]> {
    return this.socket.call<Friendship[]>('mark friend', { friendPlayerId });
  }

  fetchMaps(): Observable<Map[]> {
    return this.http.get<Map[]>(`${this.apiUrl}/queue/maps`);
  }

  setMaps(maps: Map[]): Observable<Map[]> {
    return this.http.put<Map[]>(`${this.apiUrl}/queue/maps`, maps);
  }

}
