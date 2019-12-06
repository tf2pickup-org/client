import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Queue } from './models/queue';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { QueueSlot } from './models/queue-slot';
import { IoClientService } from '@app/core/io-client.service';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private ws: IoClientService,
  ) { }

  fetchQueue(): Observable<Queue> {
    return this.http.get<Queue>(`${this.apiUrl}/queue`);
  }

  joinQueue(slotId: number): Observable<QueueSlot[]> {
    return this.ws.call<QueueSlot[]>('join queue', slotId);
  }

  leaveQueue(): Observable<QueueSlot> {
    return this.ws.call<QueueSlot>('leave queue');
  }

  readyUp(): Observable<QueueSlot> {
    return this.ws.call<QueueSlot>('player ready');
  }

  voteForMap(map: string): Observable<string> {
    return this.ws.call<string>('vote for map', map);
  }

  markFriend(friendId: string): Observable<QueueSlot> {
    return this.ws.call<QueueSlot>('mark friend', friendId);
  }

}
