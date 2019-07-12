import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Queue } from './models/queue';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/api-url';
import { QueuePlayer } from './models/queue-player';

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

  joinQueue(slot: string): Observable<QueuePlayer[]> {
    return this.http.post<QueuePlayer[]>(`${this.apiUrl}/queue/players`, { slot });
  }

  leaveQueue(): Observable<QueuePlayer[]> {
    return this.http.delete<QueuePlayer[]>(`${this.apiUrl}/queue/players`);
  }

}
