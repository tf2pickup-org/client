import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Restriction } from '@app/profile/models/restriction';

@Component({
  selector: 'app-restriction-banner',
  templateUrl: './restriction-banner.component.html',
  styleUrls: ['./restriction-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestrictionBannerComponent {
  @Input()
  restriction: Restriction;
}
