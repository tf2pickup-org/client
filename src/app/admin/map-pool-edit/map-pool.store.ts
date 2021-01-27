import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Map } from '@app/queue/models/map';
import { QueueService } from '@app/queue/queue.service';
import { tap } from 'rxjs/operators';

interface MapPoolState {
  loading: boolean;
  maps?: Map[];
}

const initialState: MapPoolState = {
  loading: true,
}

@Injectable()
export class MapPoolStore extends ComponentStore<MapPoolState> {

  // selectors
  readonly maps = this.select(state => state.maps);

  // effects
  readonly loadMaps = this.effect(() => this.queueService.fetchMaps().pipe(
    tap((maps: Map[]) => this.setMaps(maps)),
  ));

  // updaters
  private setMaps = this.updater((state, maps: Map[]) => ({
    ...state,
    maps,
  }));

  constructor(
    private queueService: QueueService,
  ) {
    super(initialState);
  }

}
