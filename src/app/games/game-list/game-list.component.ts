import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Game } from '../models/game';
import { GameListStore } from './game-list.store';
import { gameListAnimation } from './game-list.animation';

// Helper object for handling animation.
// Animations in this component are quite complex...
interface AnimationState {
  games: Game[];
  isAnimating: boolean;
}

const initialAnimationState: AnimationState = {
  games: [],
  isAnimating: true,
};

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GameListStore ],
  animations: [ gameListAnimation ],
})
export class GameListComponent implements OnInit, OnDestroy {

  animationStore = new BehaviorSubject<AnimationState>(initialAnimationState);

  games = this.animationStore.pipe(
    filter(state => !state.isAnimating),
    map(state => state.games),
  );

  private destroyed = new Subject<void>();

  constructor(
    public readonly store: GameListStore,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.store.games.pipe(
      takeUntil(this.destroyed),
    ).subscribe(games => this.animationStore.next({ ...this.animationStore.value, games }));

    this.store.isLoading.pipe(
      filter(isLoading => isLoading),
      takeUntil(this.destroyed),
    ).subscribe(() => this.animationStore.next({ ...this.animationStore.value, games: [] }));
  }

  ngOnInit() {
    this.route.queryParamMap.pipe(
      map(params => params.get('page')),
      map(page => page ?? '1'),
      takeUntil(this.destroyed),
    ).subscribe(page => this.store.loadPage(parseInt(page, 10)));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.animationStore.complete();
  }

  loadPage(page: number) {
    this.router.navigate(['/games'], { queryParams: { page }});
  }

  onAnimationStart() {
    this.animationStore.next({ ...this.animationStore.value, isAnimating: true });
  }

  onAnimationDone() {
    this.animationStore.next({ ...this.animationStore.value, isAnimating: false });
  }

}
