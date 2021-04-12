import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { scrambleMaps } from '@app/queue/queue.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-scramble-maps',
  templateUrl: './scramble-maps.component.html',
  styleUrls: ['./scramble-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrambleMapsComponent implements OnInit {
  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(scrambleMaps());
    this.router.navigate(['/']);
  }
}
