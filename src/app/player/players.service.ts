import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player } from './models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  fetchOnlinePlayers(): Observable<Player[]> {
    // mock
    return of([
      { id: '1', name: 'mały', },
      { id: '2', name: 'nieduzy' },
    ]);
  }

}
