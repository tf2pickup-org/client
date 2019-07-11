import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Queue } from './models/queue';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  fetchQueue(): Observable<Queue> {
    return of({
      config: {
        classes: [
          { name: 'scout', count: 2 },
          { name: 'soldier', count: 2 },
          { name: 'demoman', count: 1 },
          { name: 'medic', count: 1 }
        ],
      },
      players: [
        { playerId: '1', slot: 'soldier' },
      ],
    });
  }

}
