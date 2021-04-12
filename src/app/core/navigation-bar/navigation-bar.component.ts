import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { currentPlayer, isLoggedIn } from '@app/profile/profile.selectors';
import { environment } from '@environment';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  isLoggedIn = this.store.select(isLoggedIn);
  currentPlayer = this.store.select(currentPlayer);
  links = environment.headerLinks;

  constructor(private store: Store) {}
}
