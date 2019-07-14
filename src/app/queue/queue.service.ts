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
    private ioClientService: IoClientService,
  ) { }

  fetchQueue(): Observable<Queue> {
    return this.http.get<Queue>(`${this.apiUrl}/queue`);
  }

  joinQueue(slotId: number): Observable<QueueSlot> {
    return new Observable(observer => {
      this.ioClientService.socket.emit('join queue', slotId, (slot: QueueSlot) => {
        observer.next(slot);
        observer.complete();
      });
    });
  }

  leaveQueue(): Observable<QueueSlot> {
    return new Observable(observer => {
      this.ioClientService.socket.emit('leave queue', (slot: QueueSlot) => {
        observer.next(slot);
        observer.complete();
      });
    });
  }

}
