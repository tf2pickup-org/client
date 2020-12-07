import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GameListStore } from './game-list.store';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GameListStore ],
})
export class GameListComponent implements OnInit {

  constructor(
    public readonly store: GameListStore,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.queryParamMap.pipe(
      map(params => params.get('page')),
      map(page => page ?? '1'),
    ).subscribe(page => this.store.loadPage(parseInt(page, 10)));
  }

  loadPage(page: number) {
    this.router.navigate(['/games'], { queryParams: { page }});
  }

}
