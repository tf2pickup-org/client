import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@environment';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent implements OnInit {

  constructor(
    private title: Title,
  ) { }

  ngOnInit() {
    this.title.setTitle(`rules • ${environment.titleSuffix}`);
  }

}
