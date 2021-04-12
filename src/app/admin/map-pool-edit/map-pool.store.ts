import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Map } from '@app/queue/models/map';
import { QueueService } from '@app/queue/queue.service';
import { mergeMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface MapPoolState {
  loading: boolean;
  saving: boolean;
  maps?: Map[];
}

const initialState: MapPoolState = {
  loading: true,
  saving: false,
};

@Injectable()
export class MapPoolStore extends ComponentStore<MapPoolState> {
  // selectors
  readonly maps = this.select(state => state.maps);
  readonly enabled = this.select(state => !state.loading && !state.saving);

  // effects
  readonly loadMaps = this.effect(() =>
    this.queueService.fetchMaps().pipe(
      tap(() => this.setLoading(true)),
      tap(maps => this.setMaps(maps)),
      tap(() => this.setLoading(false)),
    ),
  );

  readonly save = this.effect((maps: Observable<Map[]>) =>
    maps.pipe(
      tap(() => this.setSaving(true)),
      mergeMap(maps =>
        this.queueService.setMaps(maps).pipe(tap(maps => this.setMaps(maps))),
      ),
      tap(() => this.setSaving(false)),
    ),
  );

  // updaters
  private setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  private setSaving = this.updater((state, saving: boolean) => ({
    ...state,
    saving,
  }));

  private setMaps = this.updater((state, maps: Map[]) => ({
    ...state,
    maps,
  }));

  constructor(private queueService: QueueService) {
    super(initialState);
  }
}
