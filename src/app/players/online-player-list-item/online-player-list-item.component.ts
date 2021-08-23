import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-online-player-list-item',
  templateUrl: './online-player-list-item.component.html',
  styleUrls: ['./online-player-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnlinePlayerListItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
