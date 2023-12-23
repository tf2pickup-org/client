import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { environment } from '@environment';

@Component({
  selector: 'app-title-controller',
  templateUrl: './title-controller.component.html',
  styleUrls: ['./title-controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleControllerComponent implements OnInit {
  constructor(private router: Router, private title: Title) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          while (route.firstChild) {
            route = route.firstChild;
          }

          return route.snapshot;
        }),
        map(route => route.data['title']),
        filter(title => Boolean(title)),
      )
      .subscribe(title =>
        this.title.setTitle(`${title} • ${environment.titleSuffix}`),
      );
  }
}
