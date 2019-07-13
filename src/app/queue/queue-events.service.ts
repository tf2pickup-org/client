import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QueueSlot } from './models/queue-slot';
import { IoClientService } from '@app/core/io-client.service';

@Injectable({
  providedIn: 'root'
})
export class QueueEventsService {

  private _slotUpdate = new Subject<QueueSlot>();

  get slotUpdate() {
    return this._slotUpdate.asObservable();
  }

  constructor(
    private ioClientService: IoClientService,
  ) {
    this.ioClientService.socket.on('queue slot update', (slot: QueueSlot) => this._slotUpdate.next(slot));
  }
}
