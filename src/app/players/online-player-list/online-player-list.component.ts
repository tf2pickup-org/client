import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-online-player-list',
  templateUrl: './online-player-list.component.html',
  styleUrls: ['./online-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnlinePlayerListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
