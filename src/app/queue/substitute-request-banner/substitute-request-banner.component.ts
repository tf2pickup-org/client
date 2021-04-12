import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SubstituteRequest } from '../models/substitute-request';

@Component({
  selector: 'app-substitute-request-banner',
  templateUrl: './substitute-request-banner.component.html',
  styleUrls: ['./substitute-request-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubstituteRequestBannerComponent {
  @Input()
  substituteRequest: SubstituteRequest;
}
