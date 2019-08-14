import { Injectable } from '@angular/core';
import { IoClientService } from '@app/core/io-client.service';
import { Subject } from 'rxjs';
import { Profile } from './models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileEventsService {

  private _profileUpdated = new Subject<Partial<Profile>>();

  get profileUpdated() {
    return this._profileUpdated.asObservable();
  }

  constructor(
    private ws: IoClientService,
  ) {
    this.ws.socket.subscribe(socket => {
      socket.on('profile update', (profileChanges: Partial<Profile>) => this._profileUpdated.next(profileChanges));
    });
  }
}
