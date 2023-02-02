import {
  animate,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MapThumbnailService } from '../../shared/map-thumbnail.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { pulsate } from '@app/animations';

@Component({
  selector: 'app-map-vote-button',
  templateUrl: './map-vote-button.component.html',
  styleUrls: ['./map-vote-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('unroll', [
      transition(':enter', [
        style({
          height: '0px',
          opacity: 0,
        }),
        animate(
          '250ms ease-out',
          style({
            height: '*',
            opacity: 1,
          }),
        ),
      ]),
    ]),
    trigger('pulsate', [transition(':increment', useAnimation(pulsate))]),
  ],
})
export class MapVoteButtonComponent {
  @Input()
  map: string;

  @Input()
  votePercent: number;

  @Input()
  selected = false;

  @Input()
  disabled = true;

  @Output()
  readonly voteToggle = new EventEmitter<boolean>();

  isSmallScreen = this.breakpointObserver.isMatched('(max-width: 599px)');

  get mapThumbnailImage() {
    return this.mapThumbnailService.getMapThumbnailUrl(this.map);
  }

  constructor(
    private mapThumbnailService: MapThumbnailService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  toggleVote() {
    this.voteToggle.emit(!this.selected);
  }
}
