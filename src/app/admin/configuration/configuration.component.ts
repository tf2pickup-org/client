import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
