import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HallOfFameService } from '../hall-of-fame.service';
import { Observable } from 'rxjs';
import { HallOfFame } from '../models/hall-of-fame';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';

@Component({
  selector: 'app-hall-of-fame',
  templateUrl: './hall-of-fame.component.html',
  styleUrls: ['./hall-of-fame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HallOfFameComponent implements OnInit {

  hallOfFame: Observable<HallOfFame>;

  constructor(
    private hallOfFameService: HallOfFameService,
    private title: Title,
  ) { }

  ngOnInit() {
    this.title.setTitle(`hall of fame • ${environment.titleSuffix}`);
    this.hallOfFame = this.hallOfFameService.fetchHallOfFames();
  }

}
