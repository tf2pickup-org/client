import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Queue } from './models/queue';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { QueueSlot } from './models/queue-slot';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) { }

  fetchQueue(): Observable<Queue> {
    return this.http.get<Queue>(`${this.apiUrl}/queue`);
  }

  joinQueue(slotId: number): Observable<QueueSlot[]> {
    return this.http.put<QueueSlot[]>(`${this.apiUrl}/queue/slots`, { action: 'join', slot_id: slotId });
  }

  leaveQueue(): Observable<QueueSlot[]> {
    return this.http.put<QueueSlot[]>(`${this.apiUrl}/queue/slots`, { action: 'leave' });
  }

}
