import { Injectable } from '@angular/core';
import { preferences } from '@app/profile/profile.selectors';
import { Store } from '@ngrx/store';
import { Howl } from 'howler';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SoundPlayerService {
  private readonly defaultVolume = '1.0';

  constructor(private store: Store) {}

  playSound(sources: string[]): Observable<void> {
    const player = (volume: number) =>
      new Observable<void>(subscriber => {
        const sound = new Howl({
          src: sources,
          autoplay: true,
          volume,
          onend: () => subscriber.complete(),
        });

        return () => {
          sound.stop();
        };
      });

    return this.store.select(preferences).pipe(
      take(1),
      map(preferences => preferences?.['soundVolume'] ?? this.defaultVolume),
      map(volume => parseFloat(volume)),
      switchMap(volume => player(volume)),
    );
  }
}
