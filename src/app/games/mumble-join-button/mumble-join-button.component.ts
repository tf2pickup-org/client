import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/app.state';
import { Observable } from 'rxjs';
import { gameById } from '../games.selectors';
import { filter, withLatestFrom, map } from 'rxjs/operators';
import { profile } from '@app/profile/profile.selectors';
import * as urlParse from 'url-parse';

@Component({
  selector: 'app-mumble-join-button',
  templateUrl: './mumble-join-button.component.html',
  styleUrls: ['./mumble-join-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MumbleJoinButtonComponent {

  myMumbleUrl: Observable<string>;

  @Input()
  set gameId(gameId: string) {
    this.myMumbleUrl = this.store.pipe(
      select(gameById(gameId)),
      filter(game => !!game),
      filter(game => !!game.mumbleUrl),
      withLatestFrom(this.store.select(profile)),
      filter(([, theProfile]) => !!theProfile),
      map(([game, theProfile]) => {
        const mySlot = game.slots.find(s => s.playerId === theProfile.id);
        if (!mySlot) {
          return null;
        }

        const team = game.teams[mySlot.teamId];
        const url = urlParse(game.mumbleUrl);
        url.set('username', theProfile.name.replace(/\s+/g, '_'));
        return `${url.toString()}/${team}`;
      }),
    );
  }

  constructor(
    private store: Store<AppState>,
  ) { }

}
